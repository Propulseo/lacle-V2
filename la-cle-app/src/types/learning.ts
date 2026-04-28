import type { CourseQuestion } from "./question";
import type { ExamAttempt } from "./exam";

export interface Capsule {
  id: string;
  code: string;
  title?: string;
  videoUrl?: string;
  isCompleted: boolean;
  completedAt?: Date;
  questions: CourseQuestion[];
}

export interface Course {
  id: string;
  moduleId: string;
  number: number;
  capsules: Capsule[];
  isCompleted: boolean;
  exercisesDescription?: string;
}

export interface Module {
  id: string;
  number: number;
  title: string;
  courses: Course[];
  examAttempts: ExamAttempt[];
  isUnlocked: boolean;
  isCompleted: boolean;
}

export type ModuleStatus = "locked" | "in_progress" | "completed";
export type ModuleAccessLevel = "all" | "valide" | "certifie";

export interface LegacyModule {
  id: string;
  title: string;
  description: string;
  order: number;
  accessLevel: ModuleAccessLevel;
  videosCount: number;
  totalDuration: number;
  isPublished: boolean;
  examId: string | null;
  createdAt: string;
}

export interface ModuleWithProgress extends LegacyModule {
  status: ModuleStatus;
  videosWatched: number;
  examPassed: boolean;
}

export interface Video {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  src: string | null;
  thumbnailUrl: string | null;
  questions: import("./question").VideoQuestion[];
  isPublished: boolean;
  createdAt: string;
}

export type RevisionResourceType = "pdf" | "question" | "video";

export interface RevisionResource {
  id: string;
  type: RevisionResourceType;
  title: string;
  description: string;
  content: string;
  answer?: string;
  moduleId: string | null;
  createdAt: string;
}
