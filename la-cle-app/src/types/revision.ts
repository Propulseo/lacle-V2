export type RevisionResourceType = "pdf" | "question" | "video";

export interface RevisionResource {
  id: string;
  type: RevisionResourceType;
  title: string;
  description: string;
  content: string; // URL for pdf/video, question text for question
  answer?: string; // for question type
  moduleId: string | null;
  createdAt: string;
}
