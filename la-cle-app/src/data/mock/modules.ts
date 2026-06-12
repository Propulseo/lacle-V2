import type { LegacyModule } from "@/types";

export const mockModules: LegacyModule[] = [
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
  {
    id: "module-4",
    title: "Ancrage et états ressources",
    description:
      "Installez, déclenchez et combinez des ancres pour mobiliser les états internes utiles au changement.",
    order: 4,
    accessLevel: "all",
    videosCount: 4,
    totalDuration: 3300, // 55min
    isPublished: true,
    examId: null,
    createdAt: "2025-06-20T10:00:00Z",
  },
  {
    id: "module-5",
    title: "Sous-modalités et transformation du vécu",
    description:
      "Explorez la structure fine de l'expérience subjective et les protocoles de changement par les sous-modalités.",
    order: 5,
    accessLevel: "all",
    videosCount: 4,
    totalDuration: 3600, // 1h
    isPublished: true,
    examId: null,
    createdAt: "2025-07-05T10:00:00Z",
  },
  {
    id: "module-6",
    title: "Stratégies mentales et modélisation",
    description:
      "Décodez les stratégies internes de l'excellence et apprenez les bases de la modélisation en PNL.",
    order: 6,
    accessLevel: "all",
    videosCount: 5,
    totalDuration: 4200, // 1h10
    isPublished: true,
    examId: null,
    createdAt: "2025-07-20T10:00:00Z",
  },
  {
    id: "module-7",
    title: "Croyances et valeurs",
    description:
      "Identifiez les croyances limitantes, travaillez les hiérarchies de valeurs et accompagnez leur évolution.",
    order: 7,
    accessLevel: "all",
    videosCount: 4,
    totalDuration: 3900, // 1h05
    isPublished: true,
    examId: "exam-7",
    createdAt: "2025-08-05T10:00:00Z",
  },
  {
    id: "module-8",
    title: "Intégration et posture du praticien",
    description:
      "Reliez l'ensemble des techniques dans une pratique cohérente et préparez la certification de praticien.",
    order: 8,
    accessLevel: "valide",
    videosCount: 6,
    totalDuration: 5400, // 1h30
    isPublished: true,
    examId: null,
    createdAt: "2025-08-20T10:00:00Z",
  },
];
