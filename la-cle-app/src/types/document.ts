import type { StudentStatus } from "./student";
import type { CourseQuestion } from "./question";
import type { ExamAttempt } from "./exam";

export type DocumentCategory =
  | "contractuels"
  | "financiers"
  | "pedagogiques"
  | "qualite"
  | "pratiques";

export interface VaultDocument {
  id: string;
  category: DocumentCategory;
  title: string;
  fileUrl?: string;
  signatureRequired: boolean;
  isSigned: boolean;
  signedAt?: Date;
  availableFrom: StudentStatus;
}

export interface RevisionSheet {
  id: string;
  moduleId: string;
  title: string;
  content: string;
}

export interface Vault {
  formations: {
    [formationId: string]: {
      documents: VaultDocument[];
      revisions: RevisionSheet[];
      questions: CourseQuestion[];
      exams: ExamAttempt[];
    };
  };
}

export type DocumentType = "facture" | "contrat" | "attestation" | "autre";

export interface LegacyDocument {
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
