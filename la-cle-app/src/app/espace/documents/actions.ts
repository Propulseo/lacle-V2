"use server";

// Server Actions du coffre (Vault).
// Securite : le telechargement d'un document du coffre passe par une URL SIGNEE
// generee server-side APRES verification que le document est debloque pour l'eleve
// courant (learner_vault_view.is_unlocked = true, scope RLS sur auth.uid()). Le bucket
// `vault-documents` est PRIVE et n'a pas de policy de lecture eleve : seul ce chemin,
// qui re-verifie le droit puis signe via service_role, donne acces au fichier.
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const VAULT_BUCKET = "vault-documents";
const SIGNED_URL_TTL_SECONDS = 120;

export interface VaultDownloadResult {
  url: string;
}

/**
 * Genere une URL signee temporaire pour un document du coffre, si et seulement si
 * ce document est debloque pour l'apprenant courant.
 *
 * @param vaultDocumentId - UUID du document (vault_documents.id)
 * @returns URL signee a usage unique (TTL court)
 * @throws si non authentifie, document introuvable/verrouille, ou fichier absent
 */
export async function getVaultDownloadUrl(
  vaultDocumentId: string,
): Promise<VaultDownloadResult> {
  if (!vaultDocumentId) throw new Error("Document introuvable.");

  // 1. Verifier le droit via la vue (RLS self : la vue ne montre que les lignes de
  //    auth.uid()). On exige is_unlocked = true pour ce document precis.
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Authentification requise.");

  const { data: row, error } = await supabase
    .from("learner_vault_view")
    .select("file_url, is_unlocked")
    .eq("vault_document_id", vaultDocumentId)
    .eq("is_unlocked", true)
    .maybeSingle();
  if (error) throw error;
  if (!row || !row.file_url) {
    throw new Error("Ce document n'est pas disponible au téléchargement.");
  }

  // 2. Signer le chemin Storage (bucket prive) via service_role. `file_url` contient
  //    le chemin relatif dans le bucket `vault-documents` (<formation_id>/<filename>).
  const admin = createAdminClient();
  const { data: signed, error: signError } = await admin.storage
    .from(VAULT_BUCKET)
    .createSignedUrl(row.file_url, SIGNED_URL_TTL_SECONDS);
  if (signError || !signed?.signedUrl) {
    throw new Error("Impossible de générer le lien de téléchargement.");
  }

  return { url: signed.signedUrl };
}
