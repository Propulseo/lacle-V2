import { mockDocuments, mockSupportMessages } from "@/data/mock/documents";
import type { LegacyDocument, SupportMessage } from "@/types";
import { sleep, generateId } from "@/lib/utils";

const documents = [...mockDocuments];
const messages = [...mockSupportMessages];

/**
 * Recupere les documents, filtres par apprenant si precise.
 *
 * @param learnerId - Identifiant de l'apprenant (optionnel, tous si omis)
 * @returns Tableau des documents
 */
export async function getDocuments(learnerId?: string): Promise<LegacyDocument[]> {
  await sleep(300);
  if (learnerId) {
    return documents.filter((d) => d.learnerId === learnerId);
  }
  return [...documents];
}

/**
 * Cree un nouveau document (contrat, facture, attestation, etc.).
 *
 * @param data - Donnees du document (sans id ni uploadedAt)
 * @returns Le document cree
 */
export async function createDocument(data: Omit<LegacyDocument, "id" | "uploadedAt">): Promise<LegacyDocument> {
  await sleep(400);
  const doc: LegacyDocument = {
    ...data,
    id: `doc-${generateId()}`,
    uploadedAt: new Date().toISOString(),
  };
  documents.push(doc);
  return doc;
}

/**
 * Supprime un document par son identifiant.
 *
 * @param id - Identifiant du document
 * @throws Si le document n'existe pas
 */
export async function deleteDocument(id: string): Promise<void> {
  await sleep(300);
  const idx = documents.findIndex((d) => d.id === id);
  if (idx === -1) throw new Error("Document non trouvé");
  documents.splice(idx, 1);
}

/**
 * Recupere les messages de support, filtres par apprenant si precise.
 *
 * @param learnerId - Identifiant de l'apprenant (optionnel)
 * @returns Tableau des messages de support
 */
export async function getSupportMessages(learnerId?: string): Promise<SupportMessage[]> {
  await sleep(300);
  if (learnerId) {
    return messages.filter((m) => m.learnerId === learnerId);
  }
  return [...messages];
}

/**
 * Cree un nouveau message de support envoye par un apprenant.
 *
 * @param learnerId - Identifiant de l'apprenant
 * @param learnerName - Nom affiche de l'apprenant
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
  await sleep(400);
  const msg: SupportMessage = {
    id: `msg-${generateId()}`,
    learnerId,
    learnerName,
    subject,
    message,
    reply: null,
    createdAt: new Date().toISOString(),
    repliedAt: null,
  };
  messages.push(msg);
  return msg;
}

/**
 * Ajoute une reponse admin a un message de support.
 *
 * @param id - Identifiant du message
 * @param reply - Contenu de la reponse
 * @returns Le message avec la reponse ajoutee
 * @throws Si le message n'existe pas
 */
export async function replySupportMessage(id: string, reply: string): Promise<SupportMessage> {
  await sleep(300);
  const idx = messages.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error("Message non trouvé");
  messages[idx] = {
    ...messages[idx],
    reply,
    repliedAt: new Date().toISOString(),
  };
  return messages[idx];
}
