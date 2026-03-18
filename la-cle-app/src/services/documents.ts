import { mockDocuments, mockSupportMessages } from "@/data/mock/documents";
import type { Document, SupportMessage } from "@/types";
import { sleep, generateId } from "@/lib/utils";

const documents = [...mockDocuments];
const messages = [...mockSupportMessages];

export async function getDocuments(learnerId?: string): Promise<Document[]> {
  await sleep(300);
  if (learnerId) {
    return documents.filter((d) => d.learnerId === learnerId);
  }
  return [...documents];
}

export async function createDocument(data: Omit<Document, "id" | "uploadedAt">): Promise<Document> {
  await sleep(400);
  const doc: Document = {
    ...data,
    id: `doc-${generateId()}`,
    uploadedAt: new Date().toISOString(),
  };
  documents.push(doc);
  return doc;
}

export async function deleteDocument(id: string): Promise<void> {
  await sleep(300);
  const idx = documents.findIndex((d) => d.id === id);
  if (idx === -1) throw new Error("Document non trouvé");
  documents.splice(idx, 1);
}

export async function getSupportMessages(learnerId?: string): Promise<SupportMessage[]> {
  await sleep(300);
  if (learnerId) {
    return messages.filter((m) => m.learnerId === learnerId);
  }
  return [...messages];
}

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
