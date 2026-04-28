export type QuestionType =
  | "validation"
  | "integration"
  | "anticipation"
  | "philosophie";

export interface QuestionCategory {
  id: string;
  label: string;
  description?: string;
}

export interface ScheduledReview {
  id: string;
  questionId: string;
  dueAt: Date;
  interval: 1 | 3 | 7 | 21;
  completedAt?: Date;
  studentAnswer?: string;
  responseTime?: number;
}

export interface CourseQuestion {
  id: string;
  type: QuestionType;
  categoryId: string;
  content: string;
  options?: string[];
  correctAnswer?: string;
  studentAnswer?: string;
  answeredAt?: Date;
  responseTime?: number;
  attemptCount?: number;
  scheduledReviews?: ScheduledReview[];
}

export interface VideoQuestion {
  id: string;
  videoId: string;
  timestamp: number;
  type: "qcm" | "vrai_faux" | "texte";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface VideoProgress {
  videoId: string;
  learnerId: string;
  completed: boolean;
  lastPosition: number;
  questionsAnswered: string[];
}
