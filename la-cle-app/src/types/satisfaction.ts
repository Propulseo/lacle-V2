export type SatisfactionType = "chaud" | "froid";

export interface SatisfactionAnswer {
  questionId: string;
  rating?: number;
  text?: string;
}

export interface SatisfactionSurvey {
  id: string;
  type: SatisfactionType;
  formationId: string;
  studentId: string;
  answers: SatisfactionAnswer[];
  publicReview?: string;
  wantsPublicReview: boolean;
  completedAt?: Date;
}
