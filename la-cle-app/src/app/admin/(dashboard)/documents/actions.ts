"use server";

// Server Action : upload d'un document nominatif d'apprenant par le staff.
// Securite : verifie que l'APPELANT est staff via RLS self-read, PUIS upload le
// fichier dans le bucket prive `user-uploads` au chemin <learner_uid>/<filename>
// et insere la ligne user_documents (file_url = chemin Storage) en service_role.
// Le telechargement cote eleve repassera par une URL signee (policies user-uploads:
// self lecture). On stocke le CHEMIN, jamais une URL publique (bucket prive).
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { randomBytes } from "node:crypto";
import type { Database } from "@/types/database.types";

type DocumentType = Database["public"]["Enums"]["document_type"];

const UPLOADS_BUCKET = "user-uploads";
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 Mo
const ALLOWED_EXT = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];

export interface UploadDocumentResult {
  documentId: string;
}

/** Valide taille + extension d'un fichier uploade (garde-fou serveur). */
function assertValidUpload(file: File): void {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Fichier trop volumineux (20 Mo maximum).");
  }
  const lower = file.name.toLowerCase();
  if (!ALLOWED_EXT.some((ext) => lower.endsWith(ext))) {
    throw new Error("Format de fichier non autorisé.");
  }
}

/** Nettoie un nom de fichier pour un chemin Storage sur (pas d'espaces/accents/slashes). */
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
  return `${base || "document"}${ext}`;
}

/**
 * Upload un document nominatif et l'insere dans user_documents.
 *
 * @param formData - learnerId, type, title + file (champ "file")
 * @returns Identifiant du document cree
 */
export async function uploadLearnerDocumentAction(
  formData: FormData,
): Promise<UploadDocumentResult> {
  const learnerId = String(formData.get("learnerId") ?? "").trim();
  const type = String(formData.get("type") ?? "autre") as DocumentType;
  const title = String(formData.get("title") ?? "").trim();
  const file = formData.get("file");

  if (!learnerId || !title) throw new Error("Apprenant et titre sont requis.");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Veuillez joindre un fichier.");
  }
  assertValidUpload(file);

  // 1. Verifier que l'appelant est staff (RLS self-read).
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

  // 2. Upload dans user-uploads/<learnerId>/<timestamp-filename> (service_role).
  const admin = createAdminClient();
  const fileName = sanitizeFileName(file.name);
  // Prefixe aleatoire pour eviter les collisions de chemin (pas de dependance horloge).
  const prefix = randomBytes(6).toString("hex");
  const path = `${learnerId}/${prefix}-${fileName}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from(UPLOADS_BUCKET)
    .upload(path, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (uploadError) {
    throw new Error("L'upload du fichier a échoué.");
  }

  // 3. Inserer les metadonnees (file_url = chemin Storage prive).
  const insert: Database["public"]["Tables"]["user_documents"]["Insert"] = {
    learner_id: learnerId,
    type,
    title,
    file_name: file.name,
    file_url: path,
    file_size: file.size,
    uploaded_by: "admin",
  };
  const { data: row, error: insertError } = await admin
    .from("user_documents")
    .insert(insert)
    .select("id")
    .single();
  if (insertError || !row) {
    // Compensation : retirer le fichier orphelin si l'INSERT echoue.
    await admin.storage.from(UPLOADS_BUCKET).remove([path]);
    throw new Error("Enregistrement du document impossible.");
  }

  return { documentId: row.id };
}
