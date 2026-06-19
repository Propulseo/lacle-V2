"use server";

// Server Action : upload d'une ressource de revision (fiche PDF partagee) par le staff.
// Securite : verifie staff via RLS self-read, PUIS upload dans le bucket prive partage
// `vault-documents` (staff-only en lecture/ecriture). Retourne le CHEMIN Storage que la
// modale stocke dans revision_resources.content. La lecture eleve repassera par une URL
// signee server-side (le contenu de revision n'a pas de policy d'acces direct eleve).
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { randomBytes } from "node:crypto";

const SHARED_BUCKET = "vault-documents";
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 Mo

export interface UploadRevisionFileResult {
  /** Chemin Storage relatif (a stocker dans revision_resources.content). */
  path: string;
}

function sanitizeFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot).toLowerCase() : "";
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 80);
  return `${base || "ressource"}${ext}`;
}

/**
 * Upload un fichier de ressource de revision dans le bucket partage.
 *
 * @param formData - file (champ "file")
 * @returns Chemin Storage relatif
 */
export async function uploadRevisionFileAction(
  formData: FormData,
): Promise<UploadRevisionFileResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Veuillez joindre un fichier.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Fichier trop volumineux (20 Mo maximum).");
  }
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Seuls les fichiers PDF sont autorisés.");
  }

  // 1. Verifier staff.
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Authentification requise.");
  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", auth.user.id)
    .single();
  if (me?.role !== "admin" && me?.role !== "formateur") {
    throw new Error("Action réservée à l'administration.");
  }

  // 2. Upload dans vault-documents/revision/<rand>-<filename> (service_role).
  const admin = createAdminClient();
  const prefix = randomBytes(6).toString("hex");
  const path = `revision/${prefix}-${sanitizeFileName(file.name)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from(SHARED_BUCKET)
    .upload(path, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (uploadError) throw new Error("L'upload du fichier a échoué.");

  return { path };
}
