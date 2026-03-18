import type { Session } from "@/types";

export const mockSessions: Session[] = [
  {
    id: "session-1",
    title: "Atelier pratique PNL — Session 1",
    description:
      "Mise en pratique des techniques fondamentales de la PNL : calibration, synchronisation et rapport. Exercices en binôme supervisés.",
    date: "2026-02-15",
    startTime: "09:00",
    endTime: "17:00",
    location: "Institut La Clé — Salle principale, Paris 8e",
    maxParticipants: 12,
    registrations: [
      {
        id: "reg-1",
        sessionId: "session-1",
        learnerId: "learner-2",
        learnerName: "Thomas Martin",
        registeredAt: "2026-01-20T10:00:00Z",
        attended: true,
      },
      {
        id: "reg-2",
        sessionId: "session-1",
        learnerId: "learner-3",
        learnerName: "Sophie Bernard",
        registeredAt: "2026-01-22T14:00:00Z",
        attended: true,
      },
    ],
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "session-2",
    title: "Atelier pratique PNL — Session 2",
    description:
      "Approfondissement des techniques avancées : ancrage, recadrage, ligne du temps. Démonstrations et pratique supervisée.",
    date: "2026-04-12",
    startTime: "09:00",
    endTime: "17:00",
    location: "Institut La Clé — Salle principale, Paris 8e",
    maxParticipants: 12,
    registrations: [
      {
        id: "reg-3",
        sessionId: "session-2",
        learnerId: "learner-2",
        learnerName: "Thomas Martin",
        registeredAt: "2026-03-01T09:00:00Z",
        attended: null,
      },
    ],
    createdAt: "2026-02-15T10:00:00Z",
  },
];
