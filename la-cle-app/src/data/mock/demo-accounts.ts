// Comptes de demo (hints des formulaires de login) — comptes SEED Supabase reels.
// marien@la-cle.com = admin (unique), client@lacle.com = eleve (mdp: Password).
// Il n'existe qu'un seul compte eleve seed : "decouverte" pointe dessus aussi
// (le statut decouverte/inscrit depend de l'enrollment, pas du compte).

export const DEMO_ACCOUNTS = {
  admin: {
    email: "marien@la-cle.com",
    password: "Password",
    role: "admin" as const,
  },
  learner: {
    email: "client@lacle.com",
    password: "Password",
    role: "learner" as const,
    status: "inscrit" as const,
  },
  decouverte: {
    email: "client@lacle.com",
    password: "Password",
    role: "learner" as const,
    status: "decouverte" as const,
  },
};
