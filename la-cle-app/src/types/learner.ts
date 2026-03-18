import type { LearnerStatusType } from "@/lib/status";

export interface Learner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: LearnerStatusType;
  createdAt: string;
  lastLoginAt: string | null;
  isActive: boolean;
  mustChangePassword: boolean;
  progression: LearnerProgression;
}

export interface LearnerProgression {
  overallPercent: number;
  modulesCompleted: number;
  modulesTotal: number;
  videosWatched: number;
  videosTotal: number;
  examsPassed: number;
  examsTotal: number;
  finalExamStatus: "not_started" | "requested" | "scheduled" | "passed" | "failed";
}

export interface LearnerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
