export type ModuleStatus = "locked" | "in_progress" | "completed";
export type ModuleAccessLevel = "all" | "valide" | "certifie";

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  accessLevel: ModuleAccessLevel;
  videosCount: number;
  totalDuration: number; // seconds
  isPublished: boolean;
  examId: string | null;
  createdAt: string;
}

export interface ModuleWithProgress extends Module {
  status: ModuleStatus;
  videosWatched: number;
  examPassed: boolean;
}
