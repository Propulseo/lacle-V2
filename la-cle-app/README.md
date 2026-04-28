# la-cle-app — LMS La Cle Institut

Plateforme e-learning (espace apprenant + admin) pour La Cle Institut, organisme de formation certifie Qualiopi.

## Stack

- **Next.js 16** (App Router) / **React 19** / **TypeScript strict**
- **Tailwind CSS v4** — tokens dans `globals.css` via `@theme inline`
- **framer-motion** — animations UI
- **Vitest + Testing Library** — tests unitaires
- **Supabase** (prevu, mock data pour l'instant)
- **Stripe** (prevu, pas encore branche)
- **Resend** (prevu, pas encore branche)

## Commandes

```bash
npm run dev          # Serveur dev sur port 3001
npm run build        # Build production
npm run lint         # ESLint src/
npm run lint:fix     # ESLint src/ --fix
npm run test         # Vitest (watch)
npm run test:run     # Vitest (single run)
npm run test:coverage # Vitest + coverage
```

## Variables d'environnement

```env
# Supabase (pas encore connecte)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (pas encore connecte)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend (pas encore connecte)
RESEND_API_KEY=
```

## Architecture

```
src/
├── app/
│   ├── page.tsx                        # Landing / redirect
│   ├── login/                          # Connexion eleve
│   ├── inscription/                    # Pre-inscription (a creer)
│   ├── satisfaction/                   # Questionnaires satisfaction
│   ├── espace/                         # Espace apprenant
│   │   ├── page.tsx                    # Dashboard
│   │   ├── parcours/                   # Modules + videos + examens
│   │   ├── examen-final/               # Examen final
│   │   ├── presentiel/                 # Sessions presentielles
│   │   ├── documents/                  # Documents personnels
│   │   ├── compte/                     # Profil + mot de passe
│   │   └── onboarding/                 # Bilan d'accueil
│   └── admin/                          # Espace admin
│       └── (dashboard)/
│           ├── page.tsx                # Dashboard admin
│           ├── apprenants/             # Gestion apprenants
│           ├── contenus/              # Modules, videos, examens
│           ├── documents/             # Documents + support
│           ├── engagement/            # Anti-decrochage
│           ├── satisfaction/          # Questionnaires
│           ├── moyens-techniques/     # Page Qualiopi Ind.17
│           └── parametres/            # Reglages
├── components/
│   ├── ui/                            # Design system (24 composants)
│   ├── layout/                        # Shells, headers, sidebars
│   ├── admin/                         # Composants admin
│   ├── learner/                       # Composants apprenant
│   ├── exam/                          # Sous-composants examens
│   ├── account/                       # Sous-composants compte
│   ├── enrollment/                    # Pre-inscription
│   ├── onboarding/                    # Bilan d'accueil
│   ├── positioning/                   # Test de positionnement
│   └── satisfaction/                  # Questionnaires satisfaction
├── data/mock/                         # Donnees mock (Supabase pas connecte)
├── services/                          # Couche d'acces aux donnees
├── hooks/                             # Hooks React custom
├── lib/                               # Utilitaires, constantes, logique metier
├── types/                             # Types TypeScript (barrel via index.ts)
└── contexts/                          # Contextes React (auth)
```

## Demo

Cette plateforme est actuellement en mode demo (mock data).

### Comptes de test

| Role | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@institutlacle.fr | demo2026 |
| Apprenant inscrit | marien@institutlacle.fr | demo2026 |
| Apprenant Decouverte | visiteur@example.com | demo2026 |

### Limitations connues

- Les donnees ne sont pas persistees (rechargement = etat initial)
- Les paiements sont simules (Stripe pas encore branche)
- Les emails ne sont pas envoyes (Resend pas encore branche)
- Le bouton signalement bug fonctionne en local seulement

## Documentation

Les documents de reference sont dans `docs/` :

- `METHODE_LA_CLE.md` — Pedagogie, capsules, questions, repetition espacee
- `PARCOURS_UTILISATEUR.md` — Parcours eleve complet
- `CAHIER_CHARGES_QUALIOPI.md` — Indicateurs Qualiopi plateforme
- `ORGANIGRAMME.md` — Structure equipe
