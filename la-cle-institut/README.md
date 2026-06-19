# La Clé Institut — Site vitrine

Site vitrine institutionnel de **La Clé Institut**, organisme de formation certifié Qualiopi
(PNL, Analyse Transactionnelle, Approche Systémique). Pas de LMS ni de paiement ici : la
plateforme apprenant est l'app séparée `la-cle-app` (proxy via `/acces-espace`).

## Stack

- **Next.js 16** (App Router) / **React 19** / **TypeScript strict**
- **Tailwind CSS v4** — tokens CSS dans `globals.css` via `@theme` (pas de `tailwind.config`)
- **framer-motion** — animations (respectent `prefers-reduced-motion`)
- CMS vitrine en lecture depuis Supabase (fallback statique gracieux)
- Hébergement Vercel / Coolify

## Démarrage

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Repères

- Contenu **en français**, ton institutionnel (jamais commercial).
- Couleurs : **tokens du design system uniquement** (`noir`, `graphite`, `ivoire`, `bronze`,
  `cendre`, `filet`…), jamais de hex brut.
- Routes : toujours via `ROUTES` (`src/lib/constants.ts`), jamais en dur.
- 2 routes API : `/api/contact` (honeypot anti-spam) et `/api/send-program`.

## Documentation

- `CLAUDE.md` (ce dossier) — contexte, pages, design system, conventions.
- `PRD.md` (racine du monorepo) — vision produit & requirements.
- `docs/RETOURS_SITE_VITRINE.md` — retours tests utilisateurs.

## Qualiopi (site vitrine)

- **Ind.1** : programme téléchargeable + date de mise à jour + référentiel compétences.
- **Ind.2** : widget résultats (alimenté par le LMS).
- **Ind.26** : mention référent handicap (`contact@institutlacle.fr`) dans le footer.
