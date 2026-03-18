import { mockLearners } from "@/data/mock/learners";
import type { Learner, LearnerFormData } from "@/types";
import { sleep, generateId } from "@/lib/utils";
import type { LearnerStatusType } from "@/lib/status";

const learners = [...mockLearners];

export async function getLearners(): Promise<Learner[]> {
  await sleep(300);
  return [...learners];
}

export async function getLearner(id: string): Promise<Learner | null> {
  await sleep(200);
  return learners.find((l) => l.id === id) || null;
}

export async function createLearner(data: LearnerFormData): Promise<Learner> {
  await sleep(400);
  const newLearner: Learner = {
    id: `learner-${generateId()}`,
    ...data,
    status: "en_cours",
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    isActive: true,
    mustChangePassword: true,
    progression: {
      overallPercent: 0,
      modulesCompleted: 0,
      modulesTotal: 3,
      videosWatched: 0,
      videosTotal: 12,
      examsPassed: 0,
      examsTotal: 3,
      finalExamStatus: "not_started",
    },
  };
  learners.push(newLearner);
  return newLearner;
}

export async function updateLearner(id: string, data: Partial<LearnerFormData>): Promise<Learner> {
  await sleep(300);
  const idx = learners.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error("Apprenant non trouvé");
  learners[idx] = { ...learners[idx], ...data };
  return learners[idx];
}

export async function toggleActive(id: string): Promise<Learner> {
  await sleep(200);
  const idx = learners.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error("Apprenant non trouvé");
  learners[idx] = { ...learners[idx], isActive: !learners[idx].isActive };
  return learners[idx];
}

export async function updateLearnerStatus(id: string, status: LearnerStatusType): Promise<Learner> {
  await sleep(200);
  const idx = learners.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error("Apprenant non trouvé");
  learners[idx] = { ...learners[idx], status };
  return learners[idx];
}

export async function getLearnerStats() {
  await sleep(200);
  const total = learners.length;
  const active = learners.filter((l) => l.isActive).length;
  const enCours = learners.filter((l) => l.status === "en_cours").length;
  const valide = learners.filter((l) => l.status === "valide").length;
  const certifie = learners.filter((l) => l.status === "certifie").length;
  return { total, active, enCours, valide, certifie };
}
