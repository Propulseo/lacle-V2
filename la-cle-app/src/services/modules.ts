import { mockModules } from "@/data/mock/modules";
import { mockExamAttempts } from "@/data/mock/exams";
import { mockVideos } from "@/data/mock/videos";
import type { LegacyModule, ModuleWithProgress } from "@/types";
import { sleep, generateId } from "@/lib/utils";

const modules = [...mockModules];

/**
 * Recupere tous les modules tries par ordre croissant.
 *
 * @returns Tableau des modules
 */
export async function getModules(): Promise<LegacyModule[]> {
  await sleep(300);
  return [...modules].sort((a, b) => a.order - b.order);
}

/**
 * Recupere un module par son identifiant.
 *
 * @param id - Identifiant du module
 * @returns Le module ou null si non trouve
 */
export async function getModule(id: string): Promise<LegacyModule | null> {
  await sleep(200);
  return modules.find((m) => m.id === id) || null;
}

/**
 * Cree un nouveau module de formation.
 *
 * @param data - Donnees du module (sans id ni createdAt)
 * @returns Le module cree avec son ID genere
 */
export async function createModule(data: Omit<LegacyModule, "id" | "createdAt">): Promise<LegacyModule> {
  await sleep(400);
  const newModule: LegacyModule = {
    ...data,
    id: `module-${generateId()}`,
    createdAt: new Date().toISOString(),
  };
  modules.push(newModule);
  return newModule;
}

/**
 * Met a jour un module existant.
 *
 * @param id - Identifiant du module
 * @param data - Champs a modifier
 * @returns Le module mis a jour
 * @throws Si le module n'existe pas
 */
export async function updateModule(id: string, data: Partial<LegacyModule>): Promise<LegacyModule> {
  await sleep(300);
  const idx = modules.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error("Module non trouvé");
  modules[idx] = { ...modules[idx], ...data };
  return modules[idx];
}

/**
 * Supprime un module par son identifiant.
 *
 * @param id - Identifiant du module
 * @throws Si le module n'existe pas
 */
export async function deleteModule(id: string): Promise<void> {
  await sleep(300);
  const idx = modules.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error("Module non trouvé");
  modules.splice(idx, 1);
}

/**
 * Reordonne les modules selon un nouveau classement.
 *
 * @param orderedIds - Tableau d'IDs dans le nouvel ordre
 */
export async function reorderModules(orderedIds: string[]): Promise<void> {
  await sleep(200);
  orderedIds.forEach((id, index) => {
    const m = modules.find((m) => m.id === id);
    if (m) m.order = index + 1;
  });
}

/**
 * Recupere les modules enrichis de la progression d'un apprenant.
 * Calcule le statut (locked/in_progress/completed) et le nombre de videos vues.
 *
 * @param learnerId - Identifiant de l'apprenant
 * @returns Modules avec statut de progression
 */
export async function getModulesForLearner(learnerId: string): Promise<ModuleWithProgress[]> {
  await sleep(400);
  const sorted = [...modules].sort((a, b) => a.order - b.order);

  return sorted.map((m, index) => {
    const moduleVideos = mockVideos.filter((v) => v.moduleId === m.id);
    const attempts = mockExamAttempts.filter(
      (a) => a.learnerId === learnerId && mockModules.some((mod) => mod.examId === a.examId && mod.id === m.id)
    );
    const examPassed = attempts.some((a) => a.passed);

    // Simple mock logic: first module always accessible, others need previous exam passed
    let status: ModuleWithProgress["status"] = "locked";
    if (index === 0) {
      status = examPassed ? "completed" : "in_progress";
    } else {
      const prevModule = sorted[index - 1];
      const prevAttempts = mockExamAttempts.filter(
        (a) => a.learnerId === learnerId && mockModules.some((mod) => mod.examId === a.examId && mod.id === prevModule.id)
      );
      const prevPassed = prevAttempts.some((a) => a.passed);
      if (prevPassed) {
        status = examPassed ? "completed" : "in_progress";
      }
    }

    return {
      ...m,
      status,
      videosWatched: status === "completed" ? moduleVideos.length : Math.floor(moduleVideos.length * 0.5),
      examPassed,
    };
  });
}
