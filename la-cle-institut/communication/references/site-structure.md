# Structure du site — Institut La Clé

> URL : https://laclevdeux.vercel.app/

## Routes (13 pages)

| Route | Titre | Description |
|-------|-------|-------------|
| `/` | Accueil | Splash screen → Key Symbol + nom + 3 CTA |
| `/nous-decouvrir` | Nous découvrir (hub) | 3 Hub Cards : vocation, concept, équipe |
| `/nous-decouvrir/notre-vocation` | Notre vocation | 3 sections texte + vidéo placeholder |
| `/nous-decouvrir/le-concept` | Le concept | 5 sections texte alternées |
| `/nous-decouvrir/equipe` | L'équipe | Diptyque garants + bio fondateur |
| `/formations` | Catalogue formations | Hero + progression + 3 formation cards |
| `/formations/pnl-praticien` | PNL Praticien | Hero métriques + modules timeline + FAQ |
| `/acces-espace` | Accès espace | 2 cartes connexion (apprenant + admin) |
| `/contact` | Contact | Email + adresse |
| `/mentions-legales` | Mentions légales | — |
| `/cgv` | CGV | — |
| `/design-system` | Design System (dev) | Showcase interne |

## Architecture composants

```
src/
├── app/
│   ├── layout.tsx              ← Layout racine (fonts, atmosphere, skip link)
│   ├── globals.css             ← Design tokens Tailwind v4
│   ├── page.tsx                ← Home
│   └── [routes]/page.tsx       ← Pages statiques
├── components/
│   ├── layout/
│   │   ├── BackgroundAtmosphere.tsx  ← Aurora blobs animés
│   │   ├── Header.tsx                ← Barre fixe + logo + connexion
│   │   ├── FooterMinimal.tsx         ← Footer sobre
│   │   ├── BackLink.tsx              ← Navigation retour
│   │   └── PageWrapper.tsx           ← Container principal
│   ├── splash/
│   │   ├── SplashScreen.tsx          ← Écran intro 1.8s
│   │   ├── KeySymbol.tsx             ← SVG clé animé
│   │   └── useSplashSession.ts       ← Logic sessionStorage
│   ├── ui/
│   │   ├── Button.tsx                ← Bouton (default/ghost, 2 tailles)
│   │   ├── HeroSection.tsx           ← Hero titre + sous-titre
│   │   ├── SectionBlock.tsx          ← Section conteneur
│   │   ├── ScrollReveal.tsx          ← Animation scroll
│   │   ├── FormationCard.tsx         ← Carte formation
│   │   ├── HubCard.tsx               ← Carte navigation hub
│   │   ├── ModuleCard.tsx            ← Carte module numérotée
│   │   ├── FAQAccordion.tsx          ← Accordion FAQ
│   │   ├── Expandable.tsx            ← Section dépliable
│   │   ├── VideoPlaceholder.tsx      ← Placeholder vidéo
│   │   └── VideoAtmosphere.tsx       ← Player vidéo lazy
│   ├── formations/
│   │   ├── ParcoursSteps.tsx         ← 3 étapes parcours
│   │   ├── PNLModules.tsx            ← Timeline 7 modules
│   │   ├── PNLFAQ.tsx                ← FAQ PNL
│   │   └── TeamFounderBio.tsx        ← Bio expandable
│   └── acces-espace/
│       └── AccesEspaceContent.tsx    ← Cartes connexion
└── lib/
    ├── animations.ts                 ← Easings + variants framer-motion
    └── constants.ts                  ← SITE, ROUTES, SPLASH config
```

## Stack technique
- **Framework** : Next.js 16 (App Router)
- **Styling** : Tailwind CSS v4 (`@theme inline`)
- **Animation** : framer-motion
- **Déploiement** : Vercel
- **Fonts** : next/font/google (Cormorant Garamond + DM Sans)
