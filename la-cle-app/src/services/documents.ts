// Service documents — cable Supabase (table user_documents + support_messages),
// adaptateur vers les DTO LegacyDocument/SupportMessage (pages inchangees).
// RLS : un eleve ne lit que ses propres documents/messages ; le staff voit tout.
// NB PostgREST : l'embed profiles via la FK learner_id (many-to-one) revient en OBJET.
// Upload de fichier hors scope : on conserve la signature et on insere uniquement
// les metadonnees (file_url = placeholder en attendant le branchement Storage).
import { createClient } from "@/lib/supabase/client";
import type { LegacyDocument, SupportMessage } from "@/types";
import type { Database } from "@/types/database.types";

type ProfileEmbed = { first_name: string; last_name: string } | null;

type DocumentRow = {
  id: string;
  learner_id: string;
  type: Database["public"]["Enums"]["document_type"];
  title: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  uploaded_at: string;
  uploaded_by: Database["public"]["Enums"]["upload_source"];
  profiles: ProfileEmbed;
};

type MessageRow = {
  id: string;
  learner_id: string;
  subject: string;
  message: string;
  reply: string | null;
  created_at: string;
  replied_at: string | null;
  profiles: ProfileEmbed;
};

const DOCUMENT_SELECT =
  "id, learner_id, type, title, file_name, file_url, file_size, uploaded_at, uploaded_by, profiles(first_name, last_name)";

const MESSAGE_SELECT =
  "id, learner_id, subject, message, reply, created_at, replied_at, profiles(first_name, last_name)";

function fullName(p: ProfileEmbed): string {
  return p ? `${p.first_name} ${p.last_name}`.trim() : "";
}

function mapDocument(d: DocumentRow): LegacyDocument {
  return {
    id: d.id,
    learnerId: d.learner_id,
    learnerName: fullName(d.profiles),
    type: d.type,
    title: d.title,
    fileName: d.file_name,
    fileSize: d.file_size ?? 0,
    uploadedAt: d.uploaded_at,
    uploadedBy: d.uploaded_by,
  };
}

function mapMessage(m: MessageRow): SupportMessage {
  return {
    id: m.id,
    learnerId: m.learner_id,
    learnerName: fullName(m.profiles),
    subject: m.subject,
    message: m.message,
    reply: m.reply,
    createdAt: m.created_at,
    repliedAt: m.replied_at,
  };
}

/**
 * Recupere les documents, filtres par apprenant si precise.
 *
 * @param learnerId - Identifiant de l'apprenant (optionnel, tous si omis)
 * @returns Tableau des documents
 */
export async function getDocuments(learnerId?: string): Promise<LegacyDocument[]> {
  const supabase = createClient();
  let query = supabase.from("user_documents").select(DOCUMENT_SELECT).order("uploaded_at", { ascending: false });
  if (learnerId) query = query.eq("learner_id", learnerId);
  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as DocumentRow[]).map(mapDocument);
}

/**
 * Cree un nouveau document (contrat, facture, attestation, etc.).
 * Upload reel hors scope : seules les metadonnees sont inserees.
 *
 * @param data - Donnees du document (sans id ni uploadedAt)
 * @returns Le document cree
 */
export async function createDocument(data: Omit<LegacyDocument, "id" | "uploadedAt">): Promise<LegacyDocument> {
  const supabase = createClient();
  const insert: Database["public"]["Tables"]["user_documents"]["Insert"] = {
    learner_id: data.learnerId,
    type: data.type,
    title: data.title,
    file_name: data.fileName,
    // TODO // Supabase: remplacer par l'URL Storage reelle apres upload du fichier
    file_url: "",
    file_size: data.fileSize,
    uploaded_by: data.uploadedBy,
  };
  const { data: row, error } = await supabase
    .from("user_documents")
    .insert(insert)
    .select(DOCUMENT_SELECT)
    .single();
  if (error) throw error;
  return mapDocument(row as unknown as DocumentRow);
}

/**
 * Supprime un document par son identifiant.
 *
 * @param id - Identifiant du document
 */
export async function deleteDocument(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("user_documents").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Recupere les messages de support, filtres par apprenant si precise.
 *
 * @param learnerId - Identifiant de l'apprenant (optionnel)
 * @returns Tableau des messages de support
 */
export async function getSupportMessages(learnerId?: string): Promise<SupportMessage[]> {
  const supabase = createClient();
  let query = supabase.from("support_messages").select(MESSAGE_SELECT).order("created_at", { ascending: false });
  if (learnerId) query = query.eq("learner_id", learnerId);
  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as MessageRow[]).map(mapMessage);
}

/**
 * Cree un nouveau message de support envoye par un apprenant.
 *
 * @param learnerId - Identifiant de l'apprenant
 * @param learnerName - Nom affiche de l'apprenant (non persiste : derive du profil)
 * @param subject - Sujet du message
 * @param message - Contenu du message
 * @returns Le message cree
 */
export async function createSupportMessage(
  learnerId: string,
  learnerName: string,
  subject: string,
  message: string
): Promise<SupportMessage> {
  const supabase = createClient();
  const insert: Database["public"]["Tables"]["support_messages"]["Insert"] = {
    learner_id: learnerId,
    subject,
    message,
  };
  const { data: row, error } = await supabase
    .from("support_messages")
    .insert(insert)
    .select(MESSAGE_SELECT)
    .single();
  if (error) throw error;
  const mapped = mapMessage(row as unknown as MessageRow);
  // Repli sur le nom fourni si le profil n'est pas joignable par l'embed (RLS).
  return mapped.learnerName ? mapped : { ...mapped, learnerName };
}

/**
 * Ajoute une reponse admin a un message de support.
 *
 * @param id - Identifiant du message
 * @param reply - Contenu de la reponse
 * @returns Le message avec la reponse ajoutee
 */
export async function replySupportMessage(id: string, reply: string): Promise<SupportMessage> {
  const supabase = createClient();
  const patch: Database["public"]["Tables"]["support_messages"]["Update"] = {
    reply,
    replied_at: new Date().toISOString(),
  };
  const { data: row, error } = await supabase
    .from("support_messages")
    .update(patch)
    .eq("id", id)
    .select(MESSAGE_SELECT)
    .single();
  if (error) throw error;
  return mapMessage(row as unknown as MessageRow);
}
