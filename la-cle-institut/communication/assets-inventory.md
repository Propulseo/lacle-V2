# Assets Inventory — Institut La Clé

> Audit complet du site https://laclevdeux.vercel.app/
> Source : code Next.js (App Router) — `la-cle-institut/src/`

---

## 1. LOGOS & MARQUE

| Asset | Type | Format | Usage | Localisation | Statut | Remarques |
|-------|------|--------|-------|-------------|--------|-----------|
| Logo texte "La Clé" | Typogramme | SVG (reconstruit) | Header, accueil, toutes pages | `Header.tsx:38` | **Reconstruit** | Rendu via `<Link>` + CSS (`font-serif text-xl`). Pas d'image source. Police = Cormorant Garamond 400 |
| Key Symbol (clé) | Icône/Symbole | SVG natif (code JSX) | Splash screen, accueil, identité | `KeySymbol.tsx` | **Extrait** | SVG inline animé. viewBox 48×120. Stroke draw. C'est le symbole identitaire principal |
| Logo complet vertical | Symbole + texte | SVG (reconstruit) | Usages print/social | — | **Reconstruit** | Composition : Key Symbol + texte + tagline |
| Logo complet horizontal | Symbole + texte | SVG (reconstruit) | Header étendu, présentations | — | **Reconstruit** | Variante paysage |
| Favicon | ICO | ICO 256×256 | Onglet navigateur | `.next/static/media/favicon.0b3bf435.ico` | **Extrait** | Fichier ICO standard |

## 2. ICÔNES

| Asset | Type | Format | Usage | Localisation | Statut | Remarques |
|-------|------|--------|-------|-------------|--------|-----------|
| User Icon | Icône SVG | SVG inline | Header "Connexion" | `Header.tsx:10-26` | **Extrait** | Lucide-style, stroke 1.5 |
| Graduation Icon | Icône SVG | SVG inline | Page accès espace (apprenant) | `AccesEspaceContent.tsx:8-15` | **Extrait** | Mortier graduation |
| Shield Check Icon | Icône SVG | SVG inline | Page accès espace (admin) | `AccesEspaceContent.tsx:17-24` | **Extrait** | Bouclier + check |
| Copy Icon | Icône SVG | SVG inline | Copie identifiants | `AccesEspaceContent.tsx:26-33` | **Extrait** | Clipboard copy |
| Arrow Right Icon | Icône SVG | SVG inline | CTA "Se connecter" | `AccesEspaceContent.tsx:35-41` | **Extrait** | Flèche droite |
| Arrow Left (←) | Caractère | HTML entity | BackLink navigation | `BackLink.tsx` | **Reconstruit** | `&larr;` — rendu typographique |
| Plus/Close (+/×) | Caractère | Texte | FAQ accordion toggle | `FAQAccordion.tsx`, `Expandable.tsx` | **Reconstruit** | "+" qui rotate 45° pour devenir "×" |

## 3. ÉLÉMENTS DÉCORATIFS

| Asset | Type | Format | Usage | Localisation | Statut | Remarques |
|-------|------|--------|-------|-------------|--------|-----------|
| Accent line bronze | Ligne CSS | SVG (reconstruit) | Séparateur team cards, modules | `equipe/page.tsx:60`, `ModuleCard.tsx:30` | **Reconstruit** | `h-px w-12 bg-bronze` |
| Bronze gradient line (vertical) | Gradient CSS | SVG (reconstruit) | Formation card left accent | `FormationCard.tsx:24` | **Reconstruit** | `from-bronze via-bronze/40 to-transparent` |
| Separator gradient vertical | Gradient CSS | SVG (reconstruit) | Entre sections (équipe) | `equipe/page.tsx:76-77` | **Reconstruit** | `from-transparent via-bronze/30 to-transparent` |
| Background number (ghost) | Texte décoratif | CSS | Module cards, étapes | `ModuleCard.tsx:12`, steps | **Documenté** | `text-ivoire/[0.03]` — très subtil |
| CTA line expander | Ligne animée | CSS | "En savoir plus" → | `FormationCard.tsx:80` | **Documenté** | `w-8 → w-12` on hover |
| Hover accent line (modules) | Ligne animée | CSS | Timeline modules | `PNLModules.tsx:89` | **Documenté** | `w-0 → w-12` on hover |

## 4. BACKGROUNDS & ATMOSPHÈRE

| Asset | Type | Format | Usage | Localisation | Statut | Remarques |
|-------|------|--------|-------|-------------|--------|-----------|
| Aurora Atmosphere | Animation JS | HTML autonome | Background global (toutes pages) | `BackgroundAtmosphere.tsx` | **Reconstruit** | 4 blobs radial-gradient, mix-blend-mode:screen, framer-motion, mouvement continu |
| Background Noir | Couleur plate | SVG | Fond principal | `globals.css:48` | **Extrait** | `#0B0B0B` |
| Background Graphite | Couleur plate | SVG | Sections alternées | `SectionBlock.tsx:14` | **Extrait** | `#131313` à 50% opacité |
| Aurora statique | Gradient composé | SVG | Version print/social | — | **Reconstruit** | Snapshot statique des 4 blobs |
| Header backdrop | CSS backdrop | — | Barre de navigation | `Header.tsx:34` | **Documenté** | `bg-noir/80 backdrop-blur-md` |

## 5. ANIMATIONS

| Asset | Techno | Format export | Usage | Localisation | Statut | Remarques |
|-------|--------|--------------|-------|-------------|--------|-----------|
| Key Symbol stroke draw | framer-motion / CSS | HTML autonome | Splash screen (1.8s) | `KeySymbol.tsx` | **Reconstruit** | stroke-dasharray/dashoffset, séquencé (circle → shaft → teeth) |
| Splash screen complet | framer-motion / CSS | HTML autonome | Premier chargement | `SplashScreen.tsx` | **Reconstruit** | Key draw + baseline fadeInUp + container fadeOut. 1800ms total |
| Scroll reveal (fadeInUp) | framer-motion | HTML autonome | Toutes sections | `ScrollReveal.tsx` | **Reconstruit** | opacity:0→1, y:24→0, ease institutional, viewport trigger |
| Aurora blobs drift | framer-motion / CSS | HTML autonome | Background permanent | `BackgroundAtmosphere.tsx` | **Reconstruit** | 4 blobs, mouvement aléatoire continu, 12-30s cycles |
| Button hover transitions | CSS | Documenté | Tous boutons | `Button.tsx` | **Documenté** | `duration-500 ease-institutional` |
| Card hover lift | CSS | Documenté | Hub cards | `HubCard.tsx:13` | **Documenté** | `-translate-y-1` on hover |
| FAQ accordion open/close | framer-motion | Documenté | FAQ sections | `FAQAccordion.tsx`, `Expandable.tsx` | **Documenté** | height:0→auto, opacity animate |

## 6. TYPOGRAPHIE

| Police | Source | Poids | Usage | Licence |
|--------|--------|-------|-------|---------|
| Cormorant Garamond | Google Fonts | 300, 400, 500, 600, 700 + italic | Titres (h1–h6), logo texte, chiffres décoratifs | OFL (libre) |
| DM Sans | Google Fonts | 300, 400, 500, 700 | Body, labels, boutons, navigation | OFL (libre) |

## 7. ÉLÉMENTS UI COMPOSANTS

| Composant | Format export | Localisation | Statut |
|-----------|--------------|-------------|--------|
| Button (default + ghost, 2 tailles) | SVG | `Button.tsx` | **Reconstruit** |
| Button CTA filled (bronze) | SVG | `AccesEspaceContent.tsx:103-108` | **Reconstruit** |
| Connexion pill (header) | SVG | `Header.tsx:45-55` | **Reconstruit** |
| Formation Card (active) | SVG | `FormationCard.tsx` | **Reconstruit** |
| Hub Card | SVG | `HubCard.tsx` | **Reconstruit** |
| Module Card | SVG | `ModuleCard.tsx` | **Reconstruit** |
| Header bar | SVG | `Header.tsx` | **Reconstruit** |
| Video Placeholder | CSS | `VideoPlaceholder.tsx` | **Documenté** |
| FAQ Accordion | JS + CSS | `FAQAccordion.tsx` | **Documenté** |
| Expandable section | JS + CSS | `Expandable.tsx` | **Documenté** |

## 8. ÉLÉMENTS NON PRÉSENTS

Les éléments suivants ne sont **pas** présents sur le site :
- Photos / images réelles (placeholder uniquement)
- Illustrations / pictogrammes complexes
- Vidéos (placeholders "Vidéo atmosphère")
- Lottie JSON
- WebGL / 3D
- Patterns / textures répétables
- Mockups
- Loader / spinner
- Overlays complexes
- Éléments sonores

## 9. FICHIERS SOURCE PUBLICS

Les fichiers dans `public/` sont des assets par défaut Next.js (file.svg, globe.svg, next.svg, vercel.svg, window.svg) — **non utilisés** par le site. Ils peuvent être ignorés.
