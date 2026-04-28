export type ExamType = "module" | "final";

export interface ExamAttempt {
  id: string;
  attemptNumber: number;
  score: number;
  passed: boolean;
  attemptedAt: Date;
  blockedUntil?: Date;
}

export interface Exam {
  id: string;
  type: ExamType;
  moduleId?: string;
  attempts: ExamAttempt[];
  maxAttemptsPerDay: number;
  isBlocked: boolean;
  blockedUntil?: Date;
  isPassed: boolean;
}

export interface ExamQuestion {
  id: string;
  type: "qcm" | "vrai_faux" | "texte";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}

export interface ModularExam {
  id: string;
  moduleId: string;
  title: string;
  questions: ExamQuestion[];
  passingScore: number;
  maxAttempts: number;
  timeLimitMinutes: number | null;
  createdAt: string;
}

export interface LegacyExamAttempt {
  id: string;
  examId: string;
  learnerId: string;
  answers: Record<string, string>;
  score: number;
  passed: boolean;
  completedAt: string;
}

export type FinalExamStatus = "not_started" | "requested" | "scheduled" | "passed" | "failed";

export interface FinalExam {
  id: string;
  learnerId: string;
  status: FinalExamStatus;
  requestedAt: string | null;
  scheduledAt: string | null;
  completedAt: string | null;
  score: number | null;
  notes: string | null;
}
