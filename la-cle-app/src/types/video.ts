export interface Video {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  duration: number; // seconds
  src: string | null; // null = placeholder
  thumbnailUrl: string | null;
  questions: VideoQuestion[];
  isPublished: boolean;
  createdAt: string;
}

export interface VideoQuestion {
  id: string;
  videoId: string;
  timestamp: number; // seconds into video when question appears
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
  questionsAnswered: string[]; // question IDs
}
