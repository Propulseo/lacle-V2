# CLAUDE.md — la-cle-institut (Site vitrine)

## Contexte

Site vitrine institutionnel de La Cle Institut. Pas de LMS, pas de paiement, pas d'inscription.
Le PRD (`PRD.md` a la racine) est la source de verite pour les requirements produit.

## Document de reference

| Doc | Perimetre |
|-----|-----------|
| `docs/RETOURS_SITE_VITRINE.md` | Retours tests utilisateurs : bugs, navigation, textes, esthetique |
| `PRD.md` (racine) | Vision produit, architecture pages, direction artistique, contraintes |

## Architecture des pages

```
/                          — Accueil (splash 1.8s + 3 boutons)
/nous-decouvrir            — Hub decouverte (3 cartes)
/nous-decouvrir/notre-vocation — Pourquoi La Cle (textes + videos atmosphere)
/nous-decouvrir/le-concept     — La methode (a reformuler selon retours)
/nous-decouvrir/equipe         — Equipe fondatrice
/formations                — Catalogue (carrousel avec badges statut)
/formations/pnl-praticien  — Fiche formation PNL (page centrale)
/acces-espace              — Page intermediaire vers LMS
/mentions-legales
/cgv
/contact
```

## Design system

**Tokens couleur** (noms francais dans `globals.css` via `@theme`) :
- `noir`, `graphite` — fonds sombres
- `ivoire` — texte clair
- `bronze` — accent discret
- `cendre` — texte secondaire
- `filet` — bordures

**Theme** : dark/light via `data-theme` sur `<html>`. Toggle avec View Transitions API (cercle reveal). Provider dans `src/lib/theme.tsx`.

**Polices** : Cormorant Garamond (`--font-display`, `--font-serif`) + Libre Franklin (`--font-body`).

## Patterns cles

- `PageWrapper` — wraps `<main>` avec `id="main-content"` pour skip-link
- `SectionBlock` — section standard (padding + max-width 1200px)
- `ScrollReveal` — fade-in-up au scroll (respecte `prefers-reduced-motion`)
- `HeroSection` — hero reutilisable (surtitre/titre/sous-titre)
- `Button` — polymorphe (`<Link>` si `href`, `<button>` sinon), 3 variantes : `default`, `ghost`, `elegant`
- Pages delegent aux client components (`page.tsx` -> `HomeContent.tsx`)

**Routes** : toujours via `ROUTES` dans `src/lib/constants.ts`, jamais hardcode.
**Animations** : presets dans `src/lib/animations.ts` (`fadeInUp`, `fadeIn`, `stagger`, `EASE_INSTITUTIONAL`).
**CSS classes** dans `globals.css` : `.btn-elegant`, `.card-elevated`, `.text-label`, `.text-display`, etc.

## Splash screen

1.8s, symbole de la cle, "Comprendre avant d'agir". Non skippable.
Joue une fois par session (`sessionStorage` key `la-cle-splash-shown`).
Composants dans `src/components/splash/`.

## Obligations Qualiopi (site vitrine)

- **Ind.1** : programme telechargeable + "Actualise en mai 2026" + referentiel competences
- **Ind.2** : widget stats resultats (alimente par le LMS)
- **Ind.26** : mention referent handicap dans le footer (`contact@institutlacle.fr`)

## Retours utilisateurs prioritaires (voir `docs/RETOURS_SITE_VITRINE.md`)

- Mode clair/sombre : micro-animation pour indiquer le toggle
- Navigation "Nous Decouvrir" : breadcrumb en bas des 3 pages (Vocation > Concept > Equipe)
- Page Concept : reformuler (100% video, sans livret, 100% reussite avant presentiel)
- Formations : retirer mention presentiel, carrousel avec badges statut
- FAQ : ajouter "jamais technique de manipulation"
