# CLAUDE.md — Monorepo La Cle Institut

## Projet

Monorepo avec deux apps Next.js 16 independantes deployees sur Vercel.

**La Cle Institut** = organisme de formation certifie Qualiopi (PNL, Analyse Transactionnelle, Approche Systemique).
**Marien Jesson** = fondateur, CEO, directeur pedagogique, responsable communaute + admin.
**Propul'SEO (Etienne)** = prestataire tech (LMS, site vitrine, automatisations, commercial digital).

### Les deux apps
- **`la-cle-institut/`** — Site vitrine institutionnel. Voir `la-cle-institut/CLAUDE.md`.
- **`la-cle-app/`** — Plateforme LMS (espace apprenant + admin). Voir `la-cle-app/CLAUDE.md`.

Quand l'utilisateur dit "le site" = `la-cle-institut`. Quand il dit "l'app" ou "le LMS" = `la-cle-app`.

## Commandes

```bash
# Institut (site vitrine) — port 3000
cd la-cle-institut && npm run dev
cd la-cle-institut && npm run build
cd la-cle-institut && npm run lint

# App (LMS) — port 3001
cd la-cle-app && npm run dev
cd la-cle-app && npm run build
cd la-cle-app && npm run lint
```

Pas de framework de test configure.

## Stack partage

Next.js 16 App Router, React 19, Tailwind v4, TypeScript strict, framer-motion.
Tailwind v4 : tokens CSS dans `globals.css` via `@theme` (pas de tailwind.config).
PostCSS : `@tailwindcss/postcss`. Path alias : `@/*` -> `src/*`.

## Deploiement Vercel

2 projets Vercel separes :
- **`la-cle-institut`** (Root Directory = `la-cle-institut`) — domaine principal.
- **`la-cle-app`** (Root Directory = `la-cle-app`) — URL Vercel propre, `basePath: "/acces-espace"`.
- L'institut proxy `/acces-espace/*` vers l'app via `rewrites()` dans `next.config.ts` + variable `NEXT_PUBLIC_APP_URL`.

## Conventions globales

- Max **250 lignes** par fichier — extraire en sous-composants
- Zero `any` TypeScript
- Zero `console.log` en production
- Contenu en **francais** (ton institutionnel, jamais commercial)
- Tokens couleur : **jamais de hex brut**, toujours les classes du design system
- Animations : respecter `prefers-reduced-motion`
- Mock data : jamais importer directement dans les composants, passer par les services

### TODOs dans le code
```typescript
// TODO // Supabase: [description query/table]
// TODO // Stripe: [description webhook/action]
// TODO // Resend: [description email]
// TODO // Qualiopi Ind.X: [ce que ca prouve pour l'audit]
```

## Documents de reference

| Document | Emplacement | Contenu |
|----------|-------------|---------|
| PRD | `PRD.md` (racine) | Requirements produit site vitrine uniquement |
| Methode La Cle | `la-cle-app/docs/METHODE_LA_CLE.md` | Pedagogie, capsules, questions, repetition espacee, chatbot |
| Parcours utilisateur | `la-cle-app/docs/PARCOURS_UTILISATEUR.md` | Parcours eleve complet : inscription → certification |
| Cahier charges Qualiopi | `la-cle-app/docs/CAHIER_CHARGES_QUALIOPI.md` | Indicateurs Qualiopi plateforme + site |
| Organigramme | `la-cle-app/docs/ORGANIGRAMME.md` | Structure equipe, qui fait quoi |
| Retours site vitrine | `la-cle-institut/docs/RETOURS_SITE_VITRINE.md` | Retours tests utilisateurs, bugs, navigation |

**Lire le doc concerne AVANT de coder une feature qui touche a son perimetre.**

## Contacts

- **Marien Jesson** (client) : fondateur, decisionnaire pedagogie
- **Etienne** (Propul'SEO) : dev, point de contact technique
- Email support : `contact@institutlacle.fr`
- Email referent handicap (Qualiopi Ind.26) : `contact@institutlacle.fr`
