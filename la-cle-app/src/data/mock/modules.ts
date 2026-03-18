import type { Module } from "@/types";

export const mockModules: Module[] = [
  {
    id: "module-1",
    title: "Les fondamentaux de la PNL",
    description:
      "Découvrez les bases de la Programmation Neuro-Linguistique : présupposés, systèmes de représentation et premières techniques de communication.",
    order: 1,
    accessLevel: "all",
    videosCount: 4,
    totalDuration: 3600, // 1h
    isPublished: true,
    examId: "exam-1",
    createdAt: "2025-05-01T10:00:00Z",
  },
  {
    id: "module-2",
    title: "Techniques avancées de communication",
    description:
      "Approfondissez les techniques de synchronisation, le méta-modèle linguistique et les stratégies d'ancrage pour une communication efficace.",
    order: 2,
    accessLevel: "all",
    videosCount: 3,
    totalDuration: 2700, // 45min
    isPublished: true,
    examId: "exam-2",
    createdAt: "2025-05-15T10:00:00Z",
  },
  {
    id: "module-3",
    title: "Applications thérapeutiques et coaching",
    description:
      "Maîtrisez les protocoles de changement, la ligne du temps, le recadrage et les applications en coaching professionnel et thérapeutique.",
    order: 3,
    accessLevel: "all",
    videosCount: 5,
    totalDuration: 4500, // 1h15
    isPublished: true,
    examId: "exam-3",
    createdAt: "2025-06-01T10:00:00Z",
  },
];
