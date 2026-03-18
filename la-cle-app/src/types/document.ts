export type DocumentType = "facture" | "contrat" | "attestation" | "autre";

export interface Document {
  id: string;
  learnerId: string;
  learnerName: string;
  type: DocumentType;
  title: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: "admin" | "system";
}

export interface SupportMessage {
  id: string;
  learnerId: string;
  learnerName: string;
  subject: string;
  message: string;
  reply: string | null;
  createdAt: string;
  repliedAt: string | null;
}
