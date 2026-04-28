// Comptes de demo — a supprimer lors du branchement Supabase Auth

export const DEMO_ACCOUNTS = {
  admin: {
    email: "admin@institutlacle.fr",
    password: "demo2026",
    role: "admin" as const,
  },
  learner: {
    email: "marien@institutlacle.fr",
    password: "demo2026",
    role: "learner" as const,
    status: "inscrit" as const,
  },
  decouverte: {
    email: "visiteur@example.com",
    password: "demo2026",
    role: "learner" as const,
    status: "decouverte" as const,
  },
};
