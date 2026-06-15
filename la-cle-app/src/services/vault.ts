// Service vault — cable Supabase. Le coffre personnel de l'apprenant s'appuie sur
// la vue `learner_vault_view` qui calcule, par eleve, l'etat is_visible/is_unlocked
// d'apres son statut d'inscription, l'unlock_rule du document et ses unlocks explicites.
// La vue est filtree par RLS sur learner_id = auth.uid() : on ne renseigne donc PAS
// de learnerId cote appel. L'etat de signature (non porte par la vue) est joint depuis
// vault_signatures pour l'eleve courant.
import { createClient } from "@/lib/supabase/client";
import type { VaultDocument, DocumentCategory, StudentStatus } from "@/types";

type VaultViewRow = {
  vault_document_id: string | null;
  category: DocumentCategory | null;
  title: string | null;
  file_url: string | null;
  signature_required: boolean | null;
  available_from: StudentStatus | null;
  is_unlocked: boolean | null;
  is_visible: boolean | null;
};

const VAULT_VIEW_SELECT =
  "vault_document_id, category, title, file_url, signature_required, available_from, is_unlocked, is_visible";

/**
 * Mappe une ligne de `learner_vault_view` vers le DTO VaultDocument.
 *
 * @param row - Ligne de la vue (etat par eleve)
 * @param signedAt - Date de signature pour l'eleve courant (depuis vault_signatures), ou undefined
 */
function mapVaultRow(row: VaultViewRow, signedAt: Date | undefined): VaultDocument {
  const unlocked = row.is_unlocked ?? false;
  return {
    id: row.vault_document_id ?? "",
    category: row.category ?? "pratiques",
    title: row.title ?? "",
    // fileUrl n'est expose que si le document est debloque pour l'eleve.
    fileUrl: unlocked && row.file_url ? row.file_url : undefined,
    signatureRequired: row.signature_required ?? false,
    isSigned: signedAt !== undefined,
    signedAt,
    availableFrom: row.available_from ?? "decouverte",
  };
}

/**
 * Recupere l'etat de signature de l'eleve courant, indexe par vault_document_id.
 *
 * @returns Map vault_document_id -> date de signature
 */
async function getSignedMap(
  supabase: ReturnType<typeof createClient>,
): Promise<Map<string, Date>> {
  const { data, error } = await supabase
    .from("vault_signatures")
    .select("vault_document_id, signed_at");
  if (error) throw error;
  return new Map(
    (data ?? []).map((s) => [s.vault_document_id, new Date(s.signed_at)] as const),
  );
}

/**
 * Recupere tous les documents visibles du coffre personnel de l'apprenant courant.
 * La vue applique deja le filtrage par eleve (RLS) et le calcul de visibilite.
 *
 * @returns Tableau des documents du coffre (5 categories)
 */
export async function getVaultDocuments(): Promise<VaultDocument[]> {
  const supabase = createClient();
  const [{ data, error }, signed] = await Promise.all([
    supabase
      .from("learner_vault_view")
      .select(VAULT_VIEW_SELECT)
      .eq("is_visible", true)
      .order("category", { ascending: true })
      .order("title", { ascending: true }),
    getSignedMap(supabase),
  ]);
  if (error) throw error;
  return (data as VaultViewRow[]).map((row) =>
    mapVaultRow(row, row.vault_document_id ? signed.get(row.vault_document_id) : undefined),
  );
}

/**
 * Recupere les documents visibles du coffre filtres par categorie.
 *
 * @param category - Categorie de documents (contractuels, financiers, pedagogiques, qualite, pratiques)
 * @returns Documents de la categorie demandee
 */
export async function getVaultDocumentsByCategory(
  category: DocumentCategory,
): Promise<VaultDocument[]> {
  const supabase = createClient();
  const [{ data, error }, signed] = await Promise.all([
    supabase
      .from("learner_vault_view")
      .select(VAULT_VIEW_SELECT)
      .eq("is_visible", true)
      .eq("category", category)
      .order("title", { ascending: true }),
    getSignedMap(supabase),
  ]);
  if (error) throw error;
  return (data as VaultViewRow[]).map((row) =>
    mapVaultRow(row, row.vault_document_id ? signed.get(row.vault_document_id) : undefined),
  );
}
