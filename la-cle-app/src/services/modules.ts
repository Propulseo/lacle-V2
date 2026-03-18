import { mockModules } from "@/data/mock/modules";
import { mockExamAttempts } from "@/data/mock/exams";
import { mockVideos } from "@/data/mock/videos";
import type { Module, ModuleWithProgress } from "@/types";
import { sleep, generateId } from "@/lib/utils";

const modules = [...mockModules];

export async function getModules(): Promise<Module[]> {
  await sleep(300);
  return [...modules].sort((a, b) => a.order - b.order);
}

export async function getModule(id: string): Promise<Module | null> {
  await sleep(200);
  return modules.find((m) => m.id === id) || null;
}

export async function createModule(data: Omit<Module, "id" | "createdAt">): Promise<Module> {
  await sleep(400);
  const newModule: Module = {
    ...data,
    id: `module-${generateId()}`,
    createdAt: new Date().toISOString(),
  };
  modules.push(newModule);
  return newModule;
}

export async function updateModule(id: string, data: Partial<Module>): Promise<Module> {
  await sleep(300);
  const idx = modules.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error("Module non trouvé");
  modules[idx] = { ...modules[idx], ...data };
  return modules[idx];
}

export async function deleteModule(id: string): Promise<void> {
  await sleep(300);
  const idx = modules.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error("Module non trouvé");
  modules.splice(idx, 1);
}

export async function reorderModules(orderedIds: string[]): Promise<void> {
  await sleep(200);
  orderedIds.forEach((id, index) => {
    const m = modules.find((m) => m.id === id);
    if (m) m.order = index + 1;
  });
}

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
