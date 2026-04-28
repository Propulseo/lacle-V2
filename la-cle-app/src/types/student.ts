export type StudentStatus = "decouverte" | "inscrit" | "bloque" | "certifie";

export type PaymentStatus = "trial" | "active" | "failed" | "cancelled";

export interface LearnerProgression {
  overallPercent: number;
  modulesCompleted: number;
  modulesTotal: number;
  videosWatched: number;
  videosTotal: number;
  examsPassed: number;
  examsTotal: number;
  finalExamStatus: import("./exam").FinalExamStatus;
}

export interface Learner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: StudentStatus;
  createdAt: string;
  lastLoginAt: string | null;
  isActive: boolean;
  mustChangePassword: boolean;
  progression: LearnerProgression;
}

export interface LearnerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Student {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profession: string;
  phone: string;
  status: StudentStatus;
  paymentStatus: PaymentStatus;
  onboarding?: import("./onboarding").OnboardingResult;
  positioningTest?: import("./onboarding").PositioningTestResult;
  contractSigned: boolean;
  cgvAccepted: boolean;
  modules: import("./learning").Module[];
  vault: import("./document").Vault;
  engagement: import("./engagement").EngagementTracking;
  enrolledAt?: Date;
  trialStartedAt?: Date;
  trialEndsAt?: Date;
}
