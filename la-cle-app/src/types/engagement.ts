export interface ReminderLog {
  level: 1 | 2 | 3 | 4;
  sentAt: Date;
  type: "email" | "call";
}

export type EngagementStatus =
  | "actif"
  | "inactif_7j"
  | "inactif_14j"
  | "inactif_28j"
  | "inactif_42j"
  | "abandonne";

export interface EngagementTracking {
  lastConnectionAt: Date;
  lastProgressAt: Date;
  daysSinceLastActivity: number;
  remindersSent: ReminderLog[];
  status: EngagementStatus;
}

export interface EngagementLearner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  engagement: EngagementTracking;
  currentModule: number;
  currentCourse: number;
  totalCourses: number;
  isReprise: boolean;
}
