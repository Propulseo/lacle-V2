import { mockLearners } from "@/data/mock/learners";
import type { Learner, LearnerFormData, StudentStatus } from "@/types";
import { sleep, generateId } from "@/lib/utils";

const learners = [...mockLearners];

/**
 * Recupere la liste de tous les apprenants.
 *
 * @returns Tableau de tous les apprenants
 * @example
 * const learners = await getLearners()
 */
export async function getLearners(): Promise<Learner[]> {
  await sleep(300);
  return [...learners];
}

/**
 * Recupere un apprenant par son identifiant.
 *
 * @param id - Identifiant de l'apprenant
 * @returns L'apprenant ou null si non trouve
 * @example
 * const learner = await getLearner('learner-1')
 */
export async function getLearner(id: string): Promise<Learner | null> {
  await sleep(200);
  return learners.find((l) => l.id === id) || null;
}

/**
 * Cree un nouvel apprenant avec le statut "inscrit".
 *
 * @param data - Donnees du formulaire de creation
 * @returns L'apprenant cree avec son ID genere
 */
export async function createLearner(data: LearnerFormData): Promise<Learner> {
  await sleep(400);
  const newLearner: Learner = {
    id: `learner-${generateId()}`,
    ...data,
    status: "inscrit",
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

/**
 * Met a jour les informations d'un apprenant existant.
 *
 * @param id - Identifiant de l'apprenant
 * @param data - Champs a modifier
 * @returns L'apprenant mis a jour
 * @throws Si l'apprenant n'existe pas
 */
export async function updateLearner(id: string, data: Partial<LearnerFormData>): Promise<Learner> {
  await sleep(300);
  const idx = learners.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error("Apprenant non trouvé");
  learners[idx] = { ...learners[idx], ...data };
  return learners[idx];
}

/**
 * Bascule l'etat actif/inactif d'un apprenant.
 *
 * @param id - Identifiant de l'apprenant
 * @returns L'apprenant avec le flag `isActive` inverse
 * @throws Si l'apprenant n'existe pas
 */
export async function toggleActive(id: string): Promise<Learner> {
  await sleep(200);
  const idx = learners.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error("Apprenant non trouvé");
  learners[idx] = { ...learners[idx], isActive: !learners[idx].isActive };
  return learners[idx];
}

/**
 * Change le statut d'un apprenant (decouverte, inscrit, bloque, certifie).
 *
 * @param id - Identifiant de l'apprenant
 * @param status - Nouveau statut
 * @returns L'apprenant mis a jour
 * @throws Si l'apprenant n'existe pas
 */
export async function updateLearnerStatus(id: string, status: StudentStatus): Promise<Learner> {
  await sleep(200);
  const idx = learners.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error("Apprenant non trouvé");
  learners[idx] = { ...learners[idx], status };
  return learners[idx];
}

/**
 * Calcule les statistiques globales des apprenants (total, actifs, par statut).
 *
 * @returns Objet avec les compteurs par statut
 */
export async function getLearnerStats() {
  await sleep(200);
  const total = learners.length;
  const active = learners.filter((l) => l.isActive).length;
  const decouverte = learners.filter((l) => l.status === "decouverte").length;
  const inscrit = learners.filter((l) => l.status === "inscrit").length;
  const certifie = learners.filter((l) => l.status === "certifie").length;
  const bloque = learners.filter((l) => l.status === "bloque").length;
  return { total, active, decouverte, inscrit, certifie, bloque };
}
