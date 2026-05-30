# PLAN D'ACTION — Site vitrine La Clé (`la-cle-institut`)

> Livrable unique d'audit. Aucune ligne de code n'a été modifiée aujourd'hui.
> Objet : pour chaque problème identifié (retours utilisateurs + obligations Qualiopi), une fiche avec un **prompt prêt à coller** dans une nouvelle session Claude Code.
> Date de l'audit : 30 mai 2026.
> Périmètre : **site vitrine `la-cle-institut`** (le LMS `la-cle-app` est hors périmètre de ce plan, sauf renvois explicites).

---

## ÉTAPE 0 — PREUVE DE TRAVAIL (fichiers réellement ouverts)

### 0.1 Incident sur le dossier `Documents Qualiopi/`
À l'ouverture, le dossier `Documents Qualiopi` (dans `Downloads`) ne contenait **que des fichiers macOS `._*` (AppleDouble, 120 à 432 octets, vides de contenu)** : 0 vrai document lisible. Signalé. Tu as ensuite redéposé l'ensemble dans `c:\Users\etien\Desktop\La Clé 2\Documents Qualiopi\` : **74 vrais fichiers** sont alors devenus lisibles. Les `.docx` ont été extraits en texte (via `unzip` + `perl`) et lus.

### 0.2 Documents Qualiopi lus (extraits .docx, dossier par dossier)
Indicateurs lus en intégralité (texte extrait) :

| Indicateur | Documents ouverts | Statut lecture |
|---|---|---|
| **Ind 1 — informations au public** | `PROGRAMME DE FORMATION.docx`, `RÉFÉRENTIEL DE COMPÉTENCES.docx` | ✅ lus en entier |
| **Ind 2 — indicateur de résultats** | `Indicateur 2.docx` | ✅ lu en entier |
| Ind 4 — analyse du besoin | `analyse du besoin.docx` | ✅ extrait |
| Ind 5 — objectifs | `Modalités d'évaluation des acquis.docx`, `Pool de questions examen final.docx`, `Pool de questions par Bloc.docx` | ✅ extraits |
| Ind 6 — contenus et modalités | `Contenus pédagogiques…docx`, `RÉFÉRENTIEL DE COMPÉTENCES copie.docx`, `RÉFÉRENTIEL OFFICIEL DES NOTIONS PRATICIEN PNL.docx` | ✅ extraits |
| Ind 7 — contenus et exigences | `Adéquation des contenus.docx` | ✅ extrait |
| Ind 8 — positionnement | `Positionnement à l'entrée.docx`, `TEST DE POSITIONNEMENT.docx` | ✅ extraits |
| Ind 9 — conditions de déroulement | `Cours 0.docx` | ✅ extrait |
| Ind 10 — adaptation | `Mise en œuvre.docx` | ✅ extrait |
| Ind 11 — atteinte des objectifs | `Objectifs pédagogiques…docx`, `QUESTIONNAIRE SATISFACTION à chaud.docx`, `QUESTIONNAIRE SUIVI à froid.docx` | ✅ extraits |
| Ind 12 — engagement | `Modalités pédagogiques variées.docx`, `Procédure de gestion des abandons…docx`, `Tableau de suivi des appels.docx`, `e mail de relance.docx` | ✅ extraits |
| Ind 17 — moyens humain/technique | `Gestion technique externalisée…docx` | ✅ extrait |
| Ind 18 — coordination des acteurs | `Coordination des intervenants…docx`, `IMG_3792.PNG`, `V3 - CONTRAT DE PRESTATION…pdf` | ✅ docx extrait (PDF/PNG : pièces internes, non lus en détail) |
| Ind 19 — ressources pédagogiques | `Coffre pédagogique.docx`, `Ressources pédagogiques…docx`, `résumé de bloc/Résumé Bloc 1→7.docx` | ✅ extraits |
| Ind 21 — compétences des acteurs | `CONTRAT FORMATEUR.docx`, `CURRICULUM VITAE.docx`, `MÉTHODE LA CLÉ.docx`, `Organisation des compétences.docx`, `RÉFÉRENTIEL FORMATEUR.docx`, +1 PDF, 1 HEIC | ✅ docx extraits (PDF/HEIC internes non lus) |
| Ind 22 — gestion compétence | `Politique de développement des compétences.docx`, 1 HEIC | ✅ docx extrait |
| Ind 23/24/25 — veille | `Qualiopi_Methodologie_Veille…pdf`, `Veille_Qualiopi_Avril_2026…pdf` | ⚠️ PDF de très petite taille (2,9 / 3,6 Ko), survolés |
| **Ind 26 — situation de handicap** | `Référent et procédure Handicap.docx` | ✅ lu en entier |
| Ind 27 — sous-traitance | `Pilotage des prestations externalisées.docx` | ✅ extrait |
| Ind 30 — recueil appréciations | `QUESTIONNAIRE chaud/froid copie.docx`, `Email de Relance.docx`, `Tableaux_Qualiopi_Satisfaction.xlsx` | ✅ docx extraits (xlsx non parsé) |
| Ind 31 — réclamations | `Dispositif Bêta.docx`, `Fiche Cours Beta Testeur.docx` | ✅ extraits |
| **Ind 32 — amélioration continue** | `Cahier des Charges Site Web Spécial Qualiopi.docx`, `Registre d'amélioration.docx`, `Retours groupés du site Web…docx` | ✅ lus en entier |
| Hors indicateurs | `Guide Etienne.docx`, `Organigramme Société.docx`, `Parcours utilisateur.docx`, `Parcours Praticien PNL/Bloc 1→3 + Trame générale.docx`, `vrac de documents/*` (contrats, statuts, règlement intérieur, livret d'accueil, attestation, facture, document source) | ✅ extraits |

> Fichiers **non lus en contenu** (volontaire, sans impact site) : images `IMG_3792.PNG`, `IMG_3793.HEIC`, `IMG_3794.HEIC` ; PDF contrats/statuts internes ; `.xlsx` satisfaction. Aucun n'a d'impact sur le site vitrine.

### 0.3 Document de retours client lu
- **`Retours groupés du site Web et Parcours test utilisateur`** (PDF fourni en pièce jointe, 8 pages, 13 avril 2026) + sa version `.docx` (Ind 32) : **lus en entier** (les deux versions sont identiques).

### 0.4 Docs projet (dans le repo) lus en entier
- `PRD.md` (racine) ✅
- `CLAUDE.md` (racine) ✅
- `la-cle-institut/CLAUDE.md` ✅
- `la-cle-app/CLAUDE.md` ✅
- `la-cle-institut/docs/RETOURS_SITE_VITRINE.md` ✅
- `la-cle-app/docs/CAHIER_CHARGES_QUALIOPI.md` ✅ (digest fidèle du Cahier des charges site Ind 32)

### 0.5 Code source cartographié (8 agents parallèles, fichiers réellement lus)
Header/layout/footer ; thème/mode clair/atmosphère ; home/splash/stats ; nous-découvrir + DiscoverNav ; formations/carrousel/FAQ ; features Qualiopi site (`qualiopi.ts`, `FormationDocuments`, `ProgramEmailForm`, route `send-program`) ; Button + `globals.css` complet + tokens ; performances/animations. Tous les chemins et numéros de ligne cités dans les fiches proviennent de cette lecture.

### 0.6 Compteur de boucles
- **Boucle 1** : cartographie documentaire (retours + 32 indicateurs + docs repo). Résultat : seuls **Ind 1, 2, 26** touchent le site vitrine ; les autres sont LMS ou internes.
- **Boucle 2** : cartographie du code (8 agents) + **vérification croisée** « déjà implémenté / partiel / absent » pour chaque retour. Résultat : plusieurs retours sont **déjà traités** dans le code (voir fiches A4, A6, A7, A12, Q26) — évite des prompts inutiles.

---

## PRÉAMBULE COMMUN (déjà intégré dans chaque prompt)
Chaque prompt ci-dessous est autonome. Tous rappellent le même contexte :
> Projet : site vitrine `la-cle-institut` (monorepo La Clé). Stack : Next.js 16 App Router, React 19, TypeScript strict (zéro `any`), Tailwind v4 (tokens couleur **français** dans `src/app/globals.css` via `@theme`, **jamais de hex brut**), framer-motion. Contraintes : max **250 lignes/fichier**, zéro `console.log`, contenu **français institutionnel** (jamais commercial), **aucun tiret cadratin (—) ni demi-cadratin (–)** dans les contenus client (utiliser deux-points, virgule, point, parenthèses), animations respectant `prefers-reduced-motion`, routes via `ROUTES` (`src/lib/constants.ts`), données en **fakedata typées** (aucun Supabase). Travaille uniquement dans `la-cle-institut/`. Lance `npm run lint` et `npm run build` avant de conclure.

---

# STREAM A — CORRECTIONS ISSUES DES RETOURS UTILISATEURS

---

### [A1] Chevauchement du header sur `/nous-decouvrir`
- **Catégorie** : Bug visuel
- **Priorité** : **P0**
- **Retour source** : Retours groupés, p.7 (capture) ; « bugs de chevauchement visuel repérés » (p.6). Le wordmark « La Clé » + l'item « Accueil » se superposent au label « INSTITUT LA CLÉ » du hero.
- **Statut actuel** : à corriger (bug confirmé par lecture code).
- **Fichier(s) concerné(s)** :
  - `src/components/layout/Header.tsx:75-98` (header `fixed`, cluster gauche : back-link « Accueil » + `KeySymbol` + « La Clé », tous dans un même `flex gap-3`)
  - `src/components/ui/HeroSection.tsx:29,32,35` (hero : `pt-32 md:pt-40`, conteneur `max-w-[1200px] px-6 md:px-10 lg:px-16`, label `text-label tracking-[0.3em] text-bronze`)
  - `src/app/nous-decouvrir/page.tsx:17,19-24` (`<Header showBack backHref="/" backLabel="Accueil" />` + `<HeroSection label="Institut La Clé" … />`)
- **Cause racine** : header `position:fixed` (hors flux, ne pousse pas le contenu) + dégagement délégué au seul `pt-32` du hero (insuffisant sur certains viewports/zoom) + **géométries de conteneur différentes** (header `max-w-7xl` `px-6/lg:px-12` vs hero `max-w-[1200px]` `px-6/md:px-10/lg:px-16`, donc bords gauches non alignés) + **doublon de marque** (« La Clé » dans le header ET « INSTITUT LA CLÉ » dans le hero) + « Accueil » back-link collé au logo.
- **Action technique** : (1) supprimer le label `label="Institut La Clé"` redondant du hero sur `/nous-decouvrir` (le header porte déjà la marque) ; (2) augmenter le dégagement du hero (`pt-40 md:pt-48`) pour passer sous le header fixe ; (3) aligner la géométrie header/hero (mêmes `max-width` et paddings horizontaux) ; (4) aérer le cluster gauche (séparer back-link et logo). Vérifier 320 / 375 / 768 / 1024 / 1280 px.
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (Next.js 16 App Router, React 19, TS strict, Tailwind v4 tokens français dans globals.css, framer-motion ; max 250 lignes/fichier, zéro console.log, tokens jamais en hex, routes via ROUTES). Travaille uniquement dans la-cle-institut/.

Bug à corriger (P0) : sur /nous-decouvrir, le header fixe (back-link « Accueil » + logo « La Clé » + KeySymbol) se chevauche visuellement avec le label de hero « INSTITUT LA CLÉ ». Capture testeur confirmée.

Fichiers : src/components/layout/Header.tsx:75-98 ; src/components/ui/HeroSection.tsx:29,32,35 ; src/app/nous-decouvrir/page.tsx:17-24.

Cause : header position:fixed (hors flux) + pt-32 insuffisant + conteneurs header (max-w-7xl, px-6/lg:px-12) et hero (max-w-[1200px], px-6/md:px-10/lg:px-16) non alignés + doublon de marque (« La Clé » header vs « INSTITUT LA CLÉ » hero).

À faire :
1) Supprimer le label redondant : retirer `label="Institut La Clé"` du <HeroSection> de src/app/nous-decouvrir/page.tsx (garder title/subtitle/decorativeLine). Vérifie que HeroSection gère un label optionnel/absent sans casser la mise en page (ajuste si nécessaire le rendu conditionnel du <p> label).
2) Augmenter le dégagement du hero : dans HeroSection.tsx, passer le padding top à `pt-40 md:pt-48` (au lieu de `pt-32 md:pt-40`). Vérifie que ça ne dégrade pas les autres pages qui utilisent HeroSection.
3) Aligner la géométrie : harmoniser max-width et paddings horizontaux entre le header (Header.tsx) et HeroSection pour que les bords gauches coïncident.
4) Aérer le cluster gauche du header : si le back-link « Accueil » reste collé au logo, augmenter l'espacement ou séparer les zones.

Contrainte : ne change pas la logique du thème ni des routes. Aucun hex brut, tokens uniquement.

Critère de réussite : sur /nous-decouvrir, à 320/375/768/1024/1280 px, aucun chevauchement entre le header et le titre « Nous découvrir » ; pas de doublon visuel de marque ; npm run lint + npm run build OK.
```
- **Critère de validation** : capture à 4 largeurs sans superposition ; build vert.

---

### [A2] Chevauchement des stats sur mobile (fiche PNL)
- **Catégorie** : Bug visuel
- **Priorité** : **P0**
- **Retour source** : Retours groupés, p.8 (capture mobile) : « 7 MODULES DISTANCIELS / 2 PHASES COMPLÉMENTAIRES / 1 CERTIFICATION DÉLIVRÉE » se chevauchent.
- **Statut actuel** : à corriger. Le bloc est sur la fiche PNL, **pas** sur la home.
- **Fichier(s) concerné(s)** : `src/app/formations/pnl-praticien/page.tsx:19-23` (const `METRICS`) et `:64-78` (grille).
- **Cause racine** : grille **toujours `grid-cols-3`** (jamais empilée), labels en `uppercase` `text-[0.6rem]` (~9,6px) avec `tracking-[0.2em]` → les libellés à deux mots (« COMPLÉMENTAIRES », « CERTIFICATION DÉLIVRÉE ») passent sur plusieurs lignes dans des colonnes ~33vw et se télescopent.
- **Action technique** : empiler sur mobile (`grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8`), réduire le `tracking` mobile et/ou monter à `text-[0.65rem]`. **Attention** : ce bloc `METRICS` mentionne « Phases complémentaires » (= présentiel) → à traiter conjointement avec **A13**.
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (Next.js 16, React 19, TS strict, Tailwind v4 tokens français, max 250 lignes/fichier, tokens jamais en hex). Travaille uniquement dans la-cle-institut/.

Bug à corriger (P0) : sur mobile, le bloc de stats de la fiche PNL (« 7 Modules distanciels / 2 Phases complémentaires / 1 Certification délivrée ») a ses libellés qui se chevauchent.

Fichier : src/app/formations/pnl-praticien/page.tsx, const METRICS (lignes ~19-23) et la grille (lignes ~64-78).

Cause : la grille reste `grid grid-cols-3 gap-8` à tous les breakpoints ; les labels `uppercase text-[0.6rem] tracking-[0.2em]` à deux mots wrappent et se télescopent en colonnes étroites.

À faire :
1) Empiler sur mobile : remplacer `grid grid-cols-3 gap-8` par `grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8` (garder `md:max-w-lg md:gap-16` et le `border-t`).
2) Détendre la typo des labels : réduire `tracking-[0.2em]` (ex. `tracking-[0.12em]`) et passer `text-[0.6rem]` à `text-[0.65rem]` sur mobile (garder le `md:` actuel).
3) IMPORTANT : ne modifie PAS encore le contenu de METRICS (le libellé « Phases complémentaires » sera traité dans la fiche A13 — retrait du présentiel). Ici, uniquement la mise en page.

Critère de réussite : à 320/360/390 px, les 3 stats sont empilées et lisibles, aucun chevauchement ; à partir de sm, retour à 3 colonnes ; npm run build OK.
```
- **Critère de validation** : capture mobile sans télescopage ; build vert.

---

### [A3] Halo bronze trop fort en mode clair
- **Catégorie** : Mode clair-sombre / Esthétique
- **Priorité** : **P1**
- **Retour source** : Retours groupés p.1 : « Sur la version claire, la tache bronze est encore trop forte. Ça crée un ressenti gênant (photosensibilité). » + `RETOURS_SITE_VITRINE.md` : « Adoucir l'opacité, ne pas supprimer ».
- **Statut actuel** : **partiellement traité.** `BackgroundAtmosphere` a déjà des `LIGHT_BLOBS` très atténués (opacité 0.01-0.03, blur 180-200px). Le **résidu gênant** vient de `HeroAtmosphere` (home) dont les variables bronze clair restent fortes + un pulse infini.
- **Fichier(s) concerné(s)** :
  - `src/app/globals.css:281-289` (bloc `[data-theme="light"]`) : `--hero-glow-1: rgba(176,144,88,0.22)`, `--hero-glow-2: rgba(154,123,68,0.14)`, `--hero-focal: rgba(176,144,88,0.14)`, `--hero-focal-outer: rgba(200,180,145,0.10)`
  - `src/app/globals.css:392-394` (`.hero-atmosphere-glow-1 { animation: heroPulse 4s infinite }`, sans garde `prefers-reduced-motion`)
  - (référence : `BackgroundAtmosphere.tsx:63-100` déjà atténué, **ne pas y toucher**)
- **Action technique** : baisser les variables bronze du hero **en mode clair uniquement** (≈ moitié), et neutraliser/atténuer `heroPulse` en clair + ajouter une garde `prefers-reduced-motion`.
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (Tailwind v4, tokens/variables CSS dans src/app/globals.css ; tokens jamais en hex sauf à l'intérieur des variables CSS déjà existantes). Travaille uniquement dans la-cle-institut/.

Objectif (P1) : en MODE CLAIR, le halo bronze du hero d'accueil reste trop fort (gêne photosensibilité). NB : BackgroundAtmosphere est déjà atténué (LIGHT_BLOBS) — NE PAS le modifier. Le résidu vient de HeroAtmosphere via des variables CSS.

Fichiers : src/app/globals.css, bloc [data-theme="light"] (lignes ~281-289) et règle .hero-atmosphere-glow-1 (lignes ~392-394) + keyframes heroPulse (~384-387).

À faire (mode clair uniquement) :
1) Dans [data-theme="light"], réduire d'environ la moitié : --hero-glow-1 (0.22 -> ~0.10), --hero-glow-2 (0.14 -> ~0.07), --hero-focal (0.14 -> ~0.07), --hero-focal-outer (0.10 -> ~0.05). NE touche PAS le bloc dark (lignes ~57-81).
2) Atténuer le pulse en clair : ajouter dans [data-theme="light"] une règle `.hero-atmosphere-glow-1 { animation: none; }` (ou une durée plus lente et amplitude réduite).
3) Ajouter une garde d'accessibilité : sous @media (prefers-reduced-motion: reduce), `.hero-atmosphere-glow-1 { animation: none; }` (mirror la règle .orb-a existante).

Contrainte : ne touche ni au mode sombre, ni à BackgroundAtmosphere.

Critère de réussite : en mode clair sur la home, le halo bronze est nettement plus discret, aucune zone saturée ; mode sombre inchangé ; prefers-reduced-motion coupe le pulse ; npm run build OK.
```
- **Critère de validation** : comparaison avant/après mode clair (halo discret), mode sombre identique.

---

### [A4] Découverte du toggle clair/sombre (micro-animation d'entrée)
- **Catégorie** : Mode clair-sombre
- **Priorité** : **P2**
- **Retour source** : Retours groupés p.1 : « beaucoup ne l'ont même pas capté… une petite animation à l'entrée qui permet de l'indiquer ». `RETOURS_SITE_VITRINE.md` : « Priorité : micro-animation à l'entrée ».
- **Statut actuel** : **DÉJÀ IMPLÉMENTÉ.** `ThemeToggle` a un hint d'entrée (`entrance-hint-toggle`, anneau bronze pulsé) joué **une fois par session** via `sessionStorage` clé `toggle_hint_shown`, déclenché à l'arrivée en vue (ou après le hero sur la home), garde `prefers-reduced-motion` OK.
- **Fichier(s) concerné(s)** : `src/components/layout/ThemeToggle.tsx:7,60-97` ; `src/app/globals.css:466-497` (keyframes `toggleHint`) ; `Header.tsx:153-155,235-244` ; `HomeContent.tsx:69-73`.
- **Action technique** : aucune obligatoire. Polish possible : (a) `localStorage` au lieu de `sessionStorage` si « une fois pour toutes » souhaité ; (b) tooltip texte court ; (c) hint sur le toggle mobile ; (d) corriger la typo `Changer de th\ème` → `thème` (`Header.tsx:243`).
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut. Travaille uniquement dans la-cle-institut/.

Constat : la micro-animation d'aide au toggle clair/sombre est DÉJÀ implémentée (ThemeToggle.tsx, classe entrance-hint-toggle, sessionStorage 'toggle_hint_shown', garde prefers-reduced-motion). Ne pas réimplémenter.

Polish optionnel demandé :
1) Corriger la typo dans src/components/layout/Header.tsx:243 : le label mobile « Changer de th\ème » contient un antislash parasite -> « Changer de thème ».
2) (À valider avec Marien) Si on veut que le hint ne se rejoue jamais (et pas seulement une fois par session), remplacer sessionStorage par localStorage dans ThemeToggle.tsx (clé HINT_STORAGE_KEY 'toggle_hint_shown', lignes ~69-70).
3) (Optionnel) Ajouter un court libellé transitoire (« Changer de thème ») près du bouton pendant le hint, gated sur l'état playHint, et un hint équivalent sur le toggle mobile.

Contrainte : réutiliser la mécanique playHint/entrance-hint-toggle existante, ne pas dupliquer.

Critère de réussite : typo corrigée ; comportement du hint inchangé (ou « une fois pour toutes » si l'option 2 est retenue) ; npm run build OK.
```
- **Critère de validation** : toggle visible/animé une fois ; typo corrigée.

---

### [A5] Variante de bouton plus élégante
- **Catégorie** : Esthétique
- **Priorité** : **P2**
- **Retour source** : Retours groupés p.1 : « Les boutons sont très lisibles et simples… As-tu une possibilité d'avoir un design de bouton plus élégant ? ».
- **Statut actuel** : une variante `elegant` existe déjà (`.btn-elegant`) mais reste **très sobre** (pas de fond, pas de glow, bordure fine). Marge d'enrichissement en gardant la lisibilité.
- **Fichier(s) concerné(s)** : `src/components/ui/Button.tsx:13,41-47` (variantes `default | ghost | elegant`) ; `src/app/globals.css:532-585` (`.btn-elegant`, sweep `::before`, soulignement `::after`) ; garde reduced-motion `:592-598`. Tokens dispo : `--color-bronze`, `--color-bronze-clair`, `--color-bronze-sombre`.
- **Action technique** : enrichir `.btn-elegant` (léger fond bronze `color-mix` faible alpha + douce ombre/glow au hover + bordure un peu plus présente au repos), via `color-mix(in srgb, var(--color-bronze) …)` pour rester thème-adaptatif ; conserver `uppercase`/lisibilité ; respecter la garde reduced-motion existante.
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (Tailwind v4, tokens français dans globals.css, jamais de hex brut ; les tokens couleur sont --color-bronze, --color-bronze-clair, --color-bronze-sombre, --color-ivoire). Ton institutionnel sobre (cf PRD : pas d'énergie commerciale). Travaille uniquement dans la-cle-institut/.

Objectif (P2) : proposer une variante de bouton plus élégante tout en gardant la lisibilité. La variante `elegant` existe déjà (.btn-elegant) mais est très sobre.

Fichiers : src/app/globals.css:532-585 (.btn-elegant + ::before sweep + ::after underline + :hover) ; garde prefers-reduced-motion lignes ~592-598 ; src/components/ui/Button.tsx (variants map lignes ~41-47).

À faire :
1) Enrichir .btn-elegant en restant sobre : ajouter un fond très léger au repos via color-mix(in srgb, var(--color-bronze) ~6%, transparent) ; au hover, une ombre douce (box-shadow diffuse bronze faible alpha) et/ou un fond color-mix ~12% ; bordure au repos un peu plus présente (35% -> ~50%). Garde le sweep ::before et l'underline ::after existants.
2) Garder color-mix(var(--color-bronze)) partout pour l'adaptation automatique clair/sombre ; aucun hex brut ; conserver uppercase + font-body (lisibilité).
3) Vérifier que la garde @media prefers-reduced-motion (lignes ~592-598) couvre les nouvelles transitions (ajouter la propriété box-shadow à transition:none si besoin).
4) Ne crée PAS une nouvelle variante (édite .btn-elegant en place) pour que la fiche PNL et /design-system la reflètent automatiquement.

Critère de réussite : la variante elegant gagne en présence/raffinement sans perdre en lisibilité, fonctionne en clair ET sombre, respecte reduced-motion ; visible sur /design-system et /formations/pnl-praticien ; npm run build OK.
```
- **Critère de validation** : rendu comparé sur `/design-system` (clair + sombre), reduced-motion respecté.

---

### [A6] Fil de navigation bas de page « Vocation › Concept › Équipe »
- **Catégorie** : Navigation
- **Priorité** : **P2**
- **Retour source** : Retours groupés p.2-3 : « le seul gros retour… un menu Vocation > Concept > équipe en bas de chaque page… conservez le bouton allez vers la formation ».
- **Statut actuel** : **DÉJÀ IMPLÉMENTÉ.** `DiscoverNav` rend ce fil en bas des 3 pages, ordre Vocation › Concept › Équipe, item actif en bronze + `aria-current`, liens cliquables ; sur Équipe, bouton CTA vers `/formations` présent (libellé « Découvrir la formation »).
- **Fichier(s) concerné(s)** : `src/components/layout/DiscoverNav.tsx:17-21,40-77` ; pages `notre-vocation:183`, `le-concept:118`, `equipe:125`.
- **Action technique** : aucune. Nuance optionnelle : aligner le libellé exact du CTA Équipe (« Aller vers la formation ») si Marien le souhaite (`DiscoverNav.tsx:73-77`).
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut. Travaille uniquement dans la-cle-institut/.

Constat : le fil de navigation bas de page « Vocation › Concept › Équipe » est DÉJÀ implémenté (src/components/layout/DiscoverNav.tsx, monté sur les 3 pages nous-decouvrir, item actif en bronze + aria-current, CTA vers /formations sur Équipe). Aucune réimplémentation.

Ajustement optionnel (à valider avec Marien) : le retour parlait du bouton « Aller vers la formation » ; le libellé actuel est « Découvrir la formation » (DiscoverNav.tsx ~73-77). Si Marien préfère la formulation exacte « Aller vers la formation », change uniquement ce texte.

Critère de réussite : si modifié, le libellé du CTA Équipe est « Aller vers la formation » et pointe vers ROUTES.formations ; sinon, ne rien changer ; npm run build OK.
```
- **Critère de validation** : fil présent/actif sur les 3 pages (déjà le cas) ; CTA Équipe vers `/formations`.

---

### [A7] Indication de l'ordre de découverte (1er item « Notre vocation »)
- **Catégorie** : Navigation
- **Priorité** : **P2**
- **Retour source** : Retours groupés p.2 : « indiquer l'ordre de découverte… une petite animation le premier item à découvrir "notre vocation" ».
- **Statut actuel** : **DÉJÀ IMPLÉMENTÉ.** La carte « Notre vocation » (hub `/nous-decouvrir`) joue une micro-animation `entrance-hint-hub` (anneau bronze + lift) via `hintFirstVisit`.
- **Fichier(s) concerné(s)** : `src/app/nous-decouvrir/page.tsx:27-54` ; `src/components/ui/HubCard.tsx:31-58` ; `src/app/globals.css:475-497`.
- **Action technique** : aucune obligatoire. Durcissement optionnel : réellement écrire/lire `sessionStorage[hintStorageKey]` dans `HubCard.tsx:35-39` (actuellement le « une fois » repose sur `useInView once`, donc se rejoue au reload).
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut. Travaille uniquement dans la-cle-institut/.

Constat : l'indication du premier item « Notre vocation » est DÉJÀ implémentée (HubCard hintFirstVisit -> classe entrance-hint-hub sur /nous-decouvrir, garde prefers-reduced-motion). Aucune réimplémentation.

Durcissement optionnel : dans src/components/ui/HubCard.tsx (~lignes 31-58), le hint utilise une prop hintStorageKey (« vocation_hint_shown ») mais NE lit/écrit PAS réellement sessionStorage : le « une fois » repose seulement sur useInView once, donc le hint se rejoue à chaque rechargement. Ajouter la garde sessionStorage[hintStorageKey] (lecture au montage, écriture au déclenchement) pour ne le jouer qu'une fois par session, comme le fait déjà ThemeToggle.

Critère de réussite : si modifié, le hint « Notre vocation » ne se joue qu'une fois par session ; comportement visuel inchangé ; npm run build OK.
```
- **Critère de validation** : hint joué une fois ; pas de régression visuelle.

---

### [A8] Page Équipe : texte d'abord, vidéo en dessous
- **Catégorie** : Navigation / Structure
- **Priorité** : **P2**
- **Retour source** : Retours groupés p.2 : « Notre équipe : J'inverserais vidéo et textes. D'abord le texte, plus bas la vidéo. »
- **Statut actuel** : **probablement déjà conforme.** L'ordre actuel est : Hero (titre) → bloc TEXTE « Les garants » → bloc VIDÉO (placeholder « Vidéo, Introduction équipe ») → origines → bio fondateur → équipe à venir → DiscoverNav. Le texte précède donc déjà la vidéo.
- **Fichier(s) concerné(s)** : `src/app/nous-decouvrir/equipe/page.tsx:43-74`.
- **Action technique** : confirmer auprès de Marien que c'est bien l'agencement attendu. Si une vidéo de hero spécifique devait passer sous le texte, réordonner les `SectionBlock` (`:44-74`).
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut. Travaille uniquement dans la-cle-institut/.

À vérifier (P2) : retour testeur « sur la page Équipe, mettre le texte d'abord, la vidéo en dessous ». Lis src/app/nous-decouvrir/equipe/page.tsx (lignes ~36-125).

Constat attendu : l'ordre est déjà Hero -> bloc TEXTE « Les garants » -> bloc VIDÉO (VideoPlaceholder « Vidéo — Introduction équipe ») -> origines -> bio -> DiscoverNav. Donc le texte précède déjà la vidéo.

À faire :
1) Confirme cet ordre dans le code et rapporte-le.
2) Si (et seulement si) tu repères une vidéo/visuel qui apparaît AVANT un bloc texte censé venir en premier, réordonne les <SectionBlock> concernés pour mettre le texte avant la vidéo. Sinon, ne change rien et signale que le retour est déjà satisfait.

Critère de réussite : rapport clair de l'ordre actuel ; modification uniquement si un bloc vidéo précède indûment le texte ; npm run build OK.
```
- **Critère de validation** : ordre texte→vidéo confirmé (ou corrigé).

---

### [A9] Accroche commutable entre 3 variantes
- **Catégorie** : Textes
- **Priorité** : **P1**
- **Retour source** : Retours groupés p.1 : « que choisit-on ? Comprendre Puis Agir, Comprendre et Agir, ou Comprendre avant d'agir ». `RETOURS_SITE_VITRINE.md` : « Décider en réunion ».
- **Statut actuel** : **partiel.** `SITE.baseline = "Comprendre avant d'agir"` est centralisé (`constants.ts:4`) et utilisé par le splash, mais `FooterMinimal.tsx:28` **hardcode** la chaîne (ne suivra pas la constante), et il n'existe pas de jeu de variantes.
- **Fichier(s) concerné(s)** : `src/lib/constants.ts:4` ; `src/components/splash/SplashScreen.tsx:37` (déjà via constante) ; `src/components/layout/FooterMinimal.tsx:28` (hardcodé) ; `TeamFounderBio.tsx:37` (prose narrative, à laisser).
- **Action technique** : créer `BASELINE_VARIANTS` + clé active dans `constants.ts`, faire pointer `SITE.baseline` sur la variante active, et remplacer le hardcode du footer par `{SITE.baseline}`. **Décision du wording = Marien** (ne pas trancher).
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (TS strict, contenu français). Travaille uniquement dans la-cle-institut/.

Objectif (P1) : rendre l'accroche/baseline facilement commutable entre 3 variantes décidées plus tard par le client : « Comprendre puis agir », « Comprendre et agir », « Comprendre avant d'agir » (variante actuelle). NE PAS trancher le wording final : juste rendre le basculement trivial.

Fichiers : src/lib/constants.ts (SITE.baseline ligne ~4) ; src/components/layout/FooterMinimal.tsx:28 (hardcode la chaîne) ; src/components/splash/SplashScreen.tsx:37 (utilise déjà la constante).

À faire :
1) Dans constants.ts, ajouter un objet de variantes, ex. :
   export const BASELINE_VARIANTS = { puis: "Comprendre puis agir", et: "Comprendre et agir", avant: "Comprendre avant d'agir" } as const;
   export const ACTIVE_BASELINE: keyof typeof BASELINE_VARIANTS = "avant";
   puis faire SITE.baseline = BASELINE_VARIANTS[ACTIVE_BASELINE] (garder l'apostrophe typographique cohérente avec l'existant).
2) Remplacer le texte hardcodé de FooterMinimal.tsx:28 par {SITE.baseline}.
3) Laisser TeamFounderBio.tsx:37 tel quel (c'est de la prose narrative, pas la baseline).
4) Ne touche pas au wording : changer de variante = changer ACTIVE_BASELINE en un seul endroit.

Critère de réussite : changer ACTIVE_BASELINE met à jour splash ET footer ; aucun autre endroit ne hardcode la baseline ; zéro any ; npm run build OK.
```
- **Critère de validation** : modifier `ACTIVE_BASELINE` change l'accroche partout (splash + footer).

---

### [A10] Page « Le concept » : clarifier sans livret / 100% vidéo / clés en main / 100% réussite avant présentiel
- **Catégorie** : Textes
- **Priorité** : **P1**
- **Retour source** : Retours groupés p.2 : « on comprend pas qu'ici c'est une méthode sans livret, en mode clés en mains… 100% de réussite avant l'entrée en présentiel… tout est en vidéo ». `RETOURS_SITE_VITRINE.md` : « À reformuler, en réunion avec Marien pour les mots-clés ».
- **Statut actuel** : **absent.** Les 5 sections actuelles sont philosophiques (cadre méthodologique, compréhension vs transformation, progression, place de la PNL, posture non thérapeutique) ; aucune ne décrit le **format** (sans livret, 100% vidéo, clés en main, logique 100% réussite avant présentiel).
- **Fichier(s) concerné(s)** : `src/app/nous-decouvrir/le-concept/page.tsx:16-55` (array `SECTIONS`), `:62-116`.
- **Action technique** : ajouter/réécrire une section décrivant le format (placeholder clairement balisé `À VALIDER MARIEN`), en cohérence avec **A13** (le présentiel est une étape pédagogique « après 100% de réussite », pas une formation vendue) et **A11** (alléger « rigueur »). Ne pas inventer le wording final.
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (Next.js 16, contenu français institutionnel, jamais commercial ; aucun tiret cadratin/demi-cadratin dans le texte client : utiliser deux-points, virgule, point, parenthèses). Travaille uniquement dans la-cle-institut/.

Objectif (P1) : la page /nous-decouvrir/le-concept ne fait pas comprendre 4 points clés. Il faut les rendre explicites SANS inventer le wording définitif (le client validera) :
- méthode sans livret ;
- 100% vidéo ;
- parcours clés en main ;
- logique pédagogique : viser 100% de réussite en distanciel AVANT toute entrée en présentiel (le présentiel n'est pas vendu ici, c'est une étape pédagogique ultérieure).

Fichier : src/app/nous-decouvrir/le-concept/page.tsx (array SECTIONS lignes ~16-55, et corps ~62-116).

À faire :
1) Ajouter une nouvelle section (ou réécrire une section existante) qui énonce les 4 points ci-dessus, dans le ton sobre/institutionnel. Marque le texte avec un commentaire « /* TODO COPY — à valider avec Marien */ » et un placeholder rédigé proprement (pas de lorem).
2) N'introduis aucune promesse commerciale ; ne présente pas le présentiel comme une offre disponible (cohérence avec la fiche A13).
3) Respecte la règle de ponctuation : aucun « — » ni « – » dans le texte affiché.
4) Garde le fichier sous 250 lignes (découpe en sous-composant si besoin).

Critère de réussite : la page mentionne explicitement sans livret + 100% vidéo + clés en main + logique 100% réussite avant présentiel, en placeholder balisé « à valider Marien », sans tiret cadratin/demi-cadratin ; npm run build OK.
```
- **Critère de validation** : 4 points présents et balisés « à valider » ; pas de tirets longs.

---

### [A11] Mot « rigueur » trop filtrant
- **Catégorie** : Textes
- **Priorité** : **P1**
- **Retour source** : Retours groupés p.2 : « Attention au mot rigueur, il est filtrant… conçu pour ceux qui ont envie d'apprendre ». `RETOURS_SITE_VITRINE.md` : « À remplacer ».
- **Statut actuel** : **12 occurrences** (« rigueur »/« rigoureux ») à adoucir.
- **Fichier(s) concerné(s)** : `notre-vocation/page.tsx:21,23` ; `le-concept/page.tsx:27,53` ; `equipe/page.tsx:22,27,94` ; `TeamFounderBio.tsx:36` ; `PNLFAQ.tsx:19` ; `design-system/page.tsx:51` (miroir de la FAQ) ; `pnl-praticien/page.tsx:59,215`.
- **Action technique** : remplacer par un registre plus accueillant (« exigence », « soin », « sérieux », « profondeur », « structure ») **selon décision Marien** ; garder la cohérence FAQ ↔ design-system.
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (contenu français institutionnel, accueillant mais sérieux ; aucun tiret cadratin/demi-cadratin). Travaille uniquement dans la-cle-institut/.

Objectif (P1) : le mot « rigueur » filtre trop (retour testeur). L'adoucir sans renier le sérieux de l'institut, sur les 12 occurrences. Le wording final est à valider avec Marien : propose un remplacement cohérent par occurrence (registre suggéré : « exigence », « soin », « sérieux », « profondeur », « structure ») et signale chaque changement.

Occurrences (rigueur/rigoureux) :
- src/app/nous-decouvrir/notre-vocation/page.tsx:21,23
- src/app/nous-decouvrir/le-concept/page.tsx:27,53
- src/app/nous-decouvrir/equipe/page.tsx:22,27,94
- src/components/formations/TeamFounderBio.tsx:36
- src/components/formations/PNLFAQ.tsx:19
- src/app/design-system/page.tsx:51 (miroir de la réponse FAQ — garder identique à PNLFAQ)
- src/app/formations/pnl-praticien/page.tsx:59,215

À faire :
1) Remplace chaque occurrence par une formulation plus accueillante, en conservant le sens. Évite de répéter le même mot partout.
2) Garde PNLFAQ.tsx:19 et design-system/page.tsx:51 STRICTEMENT identiques entre eux.
3) Aucun tiret cadratin/demi-cadratin introduit. Marque les choix par un commentaire « /* COPY — à valider Marien */ » à proximité.
4) Ne modifie pas la mise en page, seulement le texte.

Critère de réussite : plus aucune occurrence de « rigueur »/« rigoureux » non validée ; FAQ et design-system cohérents ; npm run build OK.
```
- **Critère de validation** : 0 occurrence résiduelle non validée ; FAQ ↔ design-system identiques.

---

### [A12] FAQ PNL : « voire d'altruisme » + jamais une technique de manipulation
- **Catégorie** : Textes
- **Priorité** : **P2**
- **Retour source** : Retours groupés p.5 : « un outil d'observation et de compréhension (voire d'altruisme), jamais comme une technique de manipulation ou de transformation rapide ».
- **Statut actuel** : **DÉJÀ IMPLÉMENTÉ** (quasi verbatim) dans `PNLFAQ.tsx:6-10`. Le texte cible est présent.
- **Fichier(s) concerné(s)** : `src/components/formations/PNLFAQ.tsx:6-10` ; (corps page : `pnl-praticien/page.tsx:109-121` n'a pas la phrase « jamais manipulation »).
- **Action technique** : aucune obligatoire. Options : encadrer « voire d'altruisme » de guillemets « … » si le client le veut ; **purger le tiret cadratin** présent dans la réponse (« — jamais comme une technique ») pour respecter la règle de ponctuation client (→ voir aussi A18) ; éventuellement refléter la phrase anti-manipulation dans le corps de la fiche PNL.
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (contenu français ; règle client : aucun tiret cadratin « — » ni demi-cadratin « – », utiliser deux-points/virgule/point/parenthèses). Travaille uniquement dans la-cle-institut/.

Constat : la définition FAQ de la PNL est DÉJÀ conforme au retour (src/components/formations/PNLFAQ.tsx:6-10 : « outil d'observation, de compréhension, voire d'altruisme, jamais comme une technique de manipulation ou de transformation rapide »).

À faire (polish P2) :
1) Dans PNLFAQ.tsx, la réponse contient un tiret cadratin (« voire d'altruisme — jamais comme une technique… »). Remplace ce « — » par une virgule ou un point pour respecter la règle de ponctuation client.
2) (Optionnel, à valider Marien) Encadrer « voire d'altruisme » de guillemets français « voire d'altruisme ».
3) (Optionnel) Refléter la formule anti-manipulation dans le corps de src/app/formations/pnl-praticien/page.tsx (section « Qu'est-ce que la PNL », ~109-121) pour cohérence inter-pages.

Critère de réussite : la réponse FAQ ne contient plus de tiret cadratin ; sens préservé ; npm run build OK.
```
- **Critère de validation** : phrase présente, sans tiret cadratin.

---

### [A13] Retirer le présentiel de la formation disponible
- **Catégorie** : Formations
- **Priorité** : **P0**
- **Retour source** : Retours groupés p.3 : « Sur formation disponible on peut pas mettre présentiel + distanciel… ça mène à confusion et Qualiopi n'aime pas. La formation présentiel n'est pas prête. » `RETOURS_SITE_VITRINE.md` : « Retirer la mention présentiel immédiatement ».
- **Statut actuel** : **non fait.** Le présentiel est présent partout sur la fiche PNL.
- **Fichier(s) concerné(s)** :
  - `pnl-praticien/page.tsx:16` (meta : « …et phase présentielle intensive ») ; `:19-23` (METRICS « 2 Phases complémentaires ») ; `:180-220` (section « Présentiel + Certification », carte « Phase présentielle »)
  - `ParcoursSteps.tsx:11-17` (étape 02 « Présentiel »)
  - `PNLFAQ.tsx:14,24,29` (3 réponses mentionnant le présentiel)
  - `design-system/page.tsx:50,259` (copies de démo)
  - (carrousel : `formations.ts` sépare déjà en cartes distinctes, OK — voir A14)
- **Action technique** : retirer/reformuler toute mention présentiel de la **fiche vendue** : meta, METRICS, section dédiée, étape ParcoursSteps, réponses FAQ. Reformuler la certification comme issue du parcours **distanciel**.
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (contenu français institutionnel ; conformité Qualiopi ; aucun tiret cadratin/demi-cadratin dans le texte client). Travaille uniquement dans la-cle-institut/.

Objectif (P0) : une formation DISPONIBLE ne doit afficher qu'UNE modalité. Le présentiel n'est pas prêt et crée de la confusion (et un risque Qualiopi). Retirer/neutraliser TOUTES les mentions de présentiel sur la fiche PNL vendue, et reformuler la certification comme aboutissement du parcours DISTANCIEL.

Fichiers et points :
1) src/app/formations/pnl-praticien/page.tsx
   - ligne ~16 (metadata description) : retirer « et phase présentielle intensive » ;
   - lignes ~19-23 (METRICS) : remplacer « 2 / Phases complémentaires » par une stat distancielle pertinente (ex. nombre de blocs/heures) OU retirer cette colonne (coordonne avec la fiche A2 sur la grille responsive) ;
   - lignes ~180-220 (section « Présentiel + Certification ») : supprimer la carte « Phase présentielle / Intégration pratique » et ne garder que la Certification, ou restructurer en « Certification » seule.
2) src/components/formations/ParcoursSteps.tsx (~11-17) : supprimer l'étape 02 « Présentiel » et renuméroter (le composant s'adapte au nombre d'étapes). Résultat : Distanciel -> Certification.
3) src/components/formations/PNLFAQ.tsx : réécrire les réponses lignes ~14, ~24, ~29 pour retirer le présentiel ; la question « Le parcours est-il entièrement à distance ? » doit désormais répondre « Oui ».
4) src/app/design-system/page.tsx (~50 et ~259) : aligner les copies de démo (distanciel uniquement).
Règle : aucun tiret cadratin/demi-cadratin dans les textes ; ton non commercial ; tokens jamais en hex.

Critère de réussite : grep « présentiel »/« presentiel » sur la fiche PNL, ParcoursSteps et PNLFAQ ne renvoie plus de mention présentant le présentiel comme partie de la formation vendue ; la certification est décrite comme issue du distanciel ; npm run build OK.
```
- **Critère de validation** : `grep -i présentiel` sur les surfaces de vente PNL = 0 mention « vendue » ; certification = distanciel.

---

### [A14] Carrousel / roue par parcours avec badges de statut
- **Catégorie** : Formations
- **Priorité** : **P1**
- **Retour source** : Retours groupés p.3-4 : « une roue/carrousel, avec des liens… une roue propre à chaque parcours (PNL, AT, systémique)… annotation disponible / en cours de création / en projet ».
- **Statut actuel** : **partiel.** L'enum de statut (`disponible | en_cours_de_creation | en_projet`), les **badges**, et la logique carte cliquable/désactivée (« Bientôt disponible ») **existent déjà** dans `FormationCarousel`. Manque : la **dimension « parcours »** (regrouper par PNL / AT / Systémique) et **une roue/carrousel par parcours** ; le compteur « X parcours » compte en fait les formations.
- **Fichier(s) concerné(s)** : `src/lib/formations.ts:1-69` (type + array plat de 5 entrées) ; `src/components/formations/FormationCarousel.tsx:13-36,40-125,170-261` ; `src/app/formations/page.tsx:99-108` ; (composant mort `FormationCard.tsx`, ne pas éditer).
- **Action technique** : ajouter une dimension `parcours` au modèle (`pnl | analyse-transactionnelle | systemique`) ou restructurer en `PARCOURS[] = { id, label, steps: Formation[] }` ; rendre une roue/carrousel par parcours en **réutilisant** `FormationItem`/`StatusBadge`/badges existants ; corriger le compteur.
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (Next.js 16, TS strict zéro any, Tailwind v4 tokens français, framer-motion, prefers-reduced-motion ; fakedata typées). Travaille uniquement dans la-cle-institut/.

Objectif (P1) : présenter les formations sous forme de carrousel/roue PAR PARCOURS (PNL, Analyse Transactionnelle, Systémique), chaque étape ayant un badge de statut (disponible / en cours de création / en projet) ; clic sur « disponible » -> page formation ; les autres restent en « Bientôt disponible ».

Déjà en place (à RÉUTILISER, ne pas réécrire) : enum FormationStatus = disponible|en_cours_de_creation|en_projet, STATUS_LABEL, STATUS_BADGE, et la logique carte cliquable/désactivée dans src/components/formations/FormationCarousel.tsx (FormationItem ~170-245). NE PAS éditer src/components/ui/FormationCard.tsx (code mort).

Fichiers : src/lib/formations.ts (modèle + array FORMATIONS plat de 5 entrées) ; src/components/formations/FormationCarousel.tsx ; src/app/formations/page.tsx (~99-108).

À faire :
1) Modèle (formations.ts) : ajouter une dimension parcours. Au choix : champ `parcours: 'pnl' | 'analyse-transactionnelle' | 'systemique'` sur Formation, OU une structure PARCOURS: { id, label, steps: Formation[] }[]. Garde tout typé (zéro any). Conserve les statuts/href existants. Place les fakedata ici (pas dans les composants).
2) Rendu : afficher une roue/carrousel PAR parcours (titre du parcours + ses étapes ordonnées). Réutilise FormationItem/StatusBadge tels quels. Décide avec sobriété si « roue » = piste horizontale snap (existante) répétée par parcours, ou un visuel radial léger ; reste fidèle au ton institutionnel du PRD (animation minimale).
3) Corrige le libellé compteur : « {FORMATIONS.length} parcours » (FormationCarousel ~ligne 84) compte des formations, pas des parcours. Affiche le vrai nombre de parcours (ou supprime le compteur).
4) Respecte prefers-reduced-motion (déjà géré, ne pas casser) et max 250 lignes/fichier (découpe : ex. ParcoursCarousel + FormationItem).

Critère de réussite : la page /formations montre les parcours groupés, chacun avec ses étapes badgées ; seule la PNL distancielle est cliquable ; compteur correct ; zéro any ; npm run lint + build OK.
```
- **Critère de validation** : parcours groupés, badges corrects, seul « disponible » cliquable, compteur juste.

---

### [A15] Performances : alléger le coût des animations
- **Catégorie** : Performance
- **Priorité** : **P2**
- **Retour source** : Retours groupés p.1 : « une seule fois j'ai eu à faire à des lags ». `RETOURS_SITE_VITRINE.md` : « Performance : une occurrence, acceptable ».
- **Statut actuel** : suspect principal identifié : `BackgroundAtmosphere` (4 blobs floutés animés en continu, blur 80-200px, animation de `left/top` au lieu de `transform`, sans `will-change`, monté globalement). Secondaire : `heroPulse` sans garde reduced-motion ; header `backdrop-blur-2xl` sticky qui se cumule.
- **Fichier(s) concerné(s)** : `BackgroundAtmosphere.tsx:102-145,148-165` + `layout.tsx:46` ; `HeroAtmosphere.tsx` + `globals.css:384-394` ; `Header.tsx:102,184` + `globals.css:406-407`.
- **Action technique** : animer en `transform` (translate) plutôt que `left/top` ; ajouter `will-change:transform,opacity` + couche GPU ; réduire le blur (180-200px excessif en clair) et/ou passer de 4 à 2 blobs ; envisager de ne monter `BackgroundAtmosphere` que sur la home ; couper les blobs/`heroPulse` sous `prefers-reduced-motion` ; réduire le `backdrop-blur` du header.
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (Next.js 16, framer-motion, Tailwind v4 ; objectif Lighthouse > 90 ; prefers-reduced-motion respecté). Travaille uniquement dans la-cle-institut/.

Objectif (P2) : réduire le coût GPU/compositor des animations (un lag a été rapporté). Aucune régression visuelle notable attendue.

Suspect principal : src/components/layout/BackgroundAtmosphere.tsx (monté globalement via src/app/layout.tsx:46) — 4 blobs en radial-gradient avec filter: blur(80-200px), animés sur left/top en boucle perpétuelle (onAnimationComplete -> setTarget), sans will-change ni couche GPU.

À faire :
1) BackgroundAtmosphere : remplacer l'animation de left/top par transform translate (x/y) ; ajouter willChange:'transform,opacity' et transform: translateZ(0) sur les blobs ; réduire le blur (surtout les 180-200px du mode clair) ; réduire le nombre de blobs de 4 à 2 si le rendu reste correct.
2) Envisager de ne monter BackgroundAtmosphere que sur la home (ou de mettre les blobs en display:none, pas seulement figés, sous prefers-reduced-motion).
3) HeroAtmosphere/globals.css : ajouter une garde @media (prefers-reduced-motion: reduce) { .hero-atmosphere-glow-1 { animation:none } } (cf fiche A3).
4) Header (src/components/layout/Header.tsx:102) : tester backdrop-blur-2xl -> backdrop-blur-md/lg sur la pilule sticky.
Mesure avant/après si possible (Lighthouse mobile sur la home).

Critère de réussite : animations en transform + will-change, blur réduit, blobs coupés sous reduced-motion ; rendu visuel proche ; pas de régression ; npm run build OK.
```
- **Critère de validation** : profilage avant/après (moins de repaints), rendu visuel équivalent.

---

### [A16] Parcours du fondateur : ajouter « plus de 10 ans de pratique » + autres métiers
- **Catégorie** : Textes
- **Priorité** : **P1**
- **Retour source** : Retours groupés p.2 : « sur mon parcours détaillé, mettre que je pratique depuis plus de 10 ans, et que j'ai d'autres métiers à côté… formulation à décider en réunion ».
- **Statut actuel** : à ajouter (wording à valider Marien).
- **Fichier(s) concerné(s)** : `src/components/formations/TeamFounderBio.tsx` ; page `equipe/page.tsx:100-102` (où `TeamFounderBio` est monté), section « version courte + longue dépliable » prévue au PRD §9.
- **Action technique** : insérer ces éléments dans la bio (placeholder balisé « à valider Marien »), sans storytelling héroïque (contrainte PRD).
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (ton institutionnel sobre, PRD §9 : « aucun storytelling héroïque, aucune mise en scène personnelle, ton neutre » ; aucun tiret cadratin/demi-cadratin). Travaille uniquement dans la-cle-institut/.

Objectif (P1) : enrichir le parcours du fondateur (Marien) avec deux faits demandés par le client : (a) il pratique depuis plus de 10 ans ; (b) il exerce d'autres métiers à côté. Le wording final sera validé par Marien : insère un placeholder rédigé proprement, balisé « /* COPY — à valider Marien */ », sans inventer de détails non confirmés.

Fichiers : src/components/formations/TeamFounderBio.tsx ; src/app/nous-decouvrir/equipe/page.tsx (~100-102).

À faire :
1) Ajouter dans la bio (version courte et/ou longue dépliable si elle existe) une phrase neutre intégrant « plus de 10 ans de pratique » et « d'autres métiers en parallèle », sans superlatifs ni ton commercial.
2) Respecter le ton PRD (pas de storytelling héroïque). Aucun tiret cadratin/demi-cadratin.
3) Garder le composant sous 250 lignes.

Critère de réussite : la bio mentionne les deux faits en placeholder balisé « à valider Marien », ton neutre, sans tirets longs ; npm run build OK.
```
- **Critère de validation** : deux faits présents, balisés « à valider », ton neutre.

---

### [A17] Logo définitif intégré à l'animation d'entrée (en attente du logo)
- **Catégorie** : Esthétique
- **Priorité** : **P2** (bloqué : en attente du logo)
- **Retour source** : Retours groupés p.1 : « Une fois qu'on aura le logo définitif, est-ce que tu comptes l'intégrer dans l'animation ? ».
- **Statut actuel** : non fait (le logo définitif n'existe pas encore). Point d'intégration identifié.
- **Fichier(s) concerné(s)** : `src/components/home/HomeContent.tsx:94-113,217` (splash inline + `SplashOrbital`) ; `src/components/home/SplashOrbital.tsx` ; `src/components/splash/KeySymbol.tsx` (glyphe clé réutilisable). NB : `SplashScreen.tsx`/`useSplashSession.ts` ne pilotent **pas** la home (voir A19).
- **Action technique** : préparer un emplacement `logo` (composant/prop) dans l'animation d'entrée home, prêt à recevoir le SVG/asset final. À faire **quand** le logo arrive.
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut. Travaille uniquement dans la-cle-institut/. NB : l'animation d'entrée de la home est pilotée par src/components/home/HomeContent.tsx (machine à phases inline) + src/components/home/SplashOrbital.tsx — PAS par src/components/splash/SplashScreen.tsx (utilisé seulement sur /design-system).

Objectif (P2, à faire quand le logo définitif sera fourni) : intégrer le logo dans l'animation d'entrée de la home.

À faire :
1) Préparer un point d'intégration propre : un composant/zone « logo » dans la séquence d'entrée (autour de HomeContent.tsx:94-113 où apparaît SITE.baseline, et/ou au centre de SplashOrbital pendant isSplash). Réutilise le pattern de KeySymbol comme placeholder remplaçable.
2) Tant que l'asset final n'est pas livré, garder le visuel actuel (clé orbitale) et exposer une prop/asset facile à substituer.
3) Respecter prefers-reduced-motion et la durée d'entrée existante.

Critère de réussite : un emplacement logo clairement substituable existe dans l'animation home ; aucun changement visuel tant que l'asset n'est pas fourni ; npm run build OK.
```
- **Critère de validation** : point d'intégration prêt ; rendu inchangé sans asset.

---

### [A18] Purger les tirets cadratins/demi-cadratins des contenus client
- **Catégorie** : Textes
- **Priorité** : **P2**
- **Retour source** : Règle de style client (consigne mission) : « jamais de tiret cadratin ni demi-cadratin ; deux-points, virgule, point ou parenthèses ; pas de tirets en début de liste côté client ».
- **Statut actuel** : non respecté. Plusieurs textes affichés contiennent « — » (ex. FAQ « voire d'altruisme — jamais… », concept, équipe « —&nbsp;avec rigueur », TeamFounderBio).
- **Fichier(s) concerné(s)** : à localiser par grep (`—` et `–`) dans `src/app/**` et `src/components/**`, **uniquement dans les chaînes affichées** (pas le code).
- **Action technique** : remplacer chaque « — »/« – » des contenus client par deux-points, virgule, point ou parenthèses selon le sens. Ne pas toucher au code (opérateurs, JSX) ni aux séparateurs purement visuels non textuels.
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (contenu français). Règle de style client STRICTE : aucun tiret cadratin « — » ni demi-cadratin « – » dans les textes affichés ; utiliser deux-points, virgule, point ou parenthèses ; pas de tiret en début de liste côté client. Travaille uniquement dans la-cle-institut/.

Objectif (P2) : purger tous les « — » et « – » des CONTENUS CLIENT (texte affiché), sans toucher au code.

À faire :
1) grep « — » (U+2014) et « – » (U+2013) dans src/app/** et src/components/**.
2) Pour chaque occurrence DANS UNE CHAÎNE DE TEXTE AFFICHÉE (titres, paragraphes, réponses FAQ, labels, métadonnées descriptives), remplace par la ponctuation adéquate (deux-points, virgule, point ou parenthèses) selon le sens. Exemples : « voire d'altruisme — jamais… » -> « voire d'altruisme, jamais… » ; « —&nbsp;avec rigueur » -> « , avec rigueur » (coordonne avec la fiche A11).
3) NE PAS modifier : opérateurs/code TS/JSX, commentaires de code, et tout caractère « - » (trait d'union normal) qui est correct.
4) Vérifie qu'aucun rendu ne casse (entités HTML, &nbsp; conservés si pertinents).

Critère de réussite : grep « — » et « – » dans les chaînes affichées de src/ = 0 ; rendu intact ; npm run build OK.
```
- **Critère de validation** : `grep` des tirets longs dans les textes affichés = 0.

---

### [A19] Dette technique : code mort, console.log, durée splash, données stale
- **Catégorie** : Performance / Dette
- **Priorité** : **P2**
- **Retour source** : Audit code (boucle 2).
- **Statut actuel** : plusieurs éléments à nettoyer (non bloquants).
- **Fichier(s) concerné(s) / constats** :
  - **Composants orphelins** : `HeroOrbitalKey.tsx` (jamais importé), `VideoAtmosphere.tsx` (jamais monté), `useSplashSession.ts` (jamais importé), `SplashScreen.tsx`/`KeySymbol` animé (seulement `/design-system`), `FormationCard.tsx` (seulement `/design-system`).
  - **`console.log`** : `src/app/api/send-program/route.ts:58` (viole « zéro console.log en prod ») — traité aussi en **Q1**.
  - **Durée splash** : `CLAUDE.md` dit 1,8s mais la home tourne ~3,95s (`HomeContent.tsx:26-28 PHASE_DELAYS`). `SPLASH_DURATION=1800` (`constants.ts:21`) n'est utilisé que par le composant inutilisé.
  - **Données stale** : `design-system/page.tsx` `COLORS_LIGHT` ne correspond plus aux vrais tokens de `globals.css`.
- **Action technique** : supprimer/regrouper le code mort (après confirmation qu'aucun usage futur n'est prévu) ; retirer le `console.log` ; aligner la durée splash documentée vs réelle (décider 1,8s ou documenter ~3,95s) ; resynchroniser les swatches `/design-system`.
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (TS strict, zéro console.log en prod, max 250 lignes/fichier). Travaille uniquement dans la-cle-institut/.

Objectif (P2) : nettoyage de dette technique, sans changer le rendu public.

À faire (confirme l'absence d'usage avant suppression) :
1) Code mort : src/components/home/HeroOrbitalKey.tsx (jamais importé) et src/components/splash/useSplashSession.ts (jamais importé) -> supprimer. src/components/ui/VideoAtmosphere.tsx, src/components/splash/SplashScreen.tsx, src/components/ui/FormationCard.tsx -> utilisés seulement par /design-system : soit les garder pour la démo, soit les retirer de /design-system et supprimer (décide selon utilité de la page démo). Vérifie qu'aucune route publique ne les importe (grep).
2) console.log : src/app/api/send-program/route.ts:58 -> retirer (voir aussi fiche Q1 pour le branchement Resend).
3) Durée splash : aligner la doc et le code. La home tourne ~3,95s (HomeContent.tsx PHASE_DELAYS) alors que CLAUDE.md/constants SPLASH_DURATION disent 1,8s. Décide (avec Marien si besoin) : soit raccourcir PHASE_DELAYS pour viser ~1,8s, soit mettre à jour la doc. Ne casse pas la séquence.
4) /design-system : resynchroniser COLORS_LIGHT (page.tsx) avec les vrais tokens [data-theme="light"] de globals.css (valeurs divergentes).

Critère de réussite : plus de composants orphelins inutiles ; zéro console.log ; durée splash cohérente doc/code ; swatches /design-system exacts ; npm run lint + build OK.
```
- **Critère de validation** : `grep console.log` = 0 ; pas d'import cassé ; build vert.

---

# STREAM B — CONFORMITÉ QUALIOPI (impact site vitrine)

> Rappel : seuls **Indicateurs 1, 2, 26** concernent le site vitrine. Les autres sont LMS (`la-cle-app`) ou internes (voir tableau §C).

---

### [Q1] Indicateur 1 — Programme + référentiel téléchargeables, date d'actualisation, envoi e-mail
- **Catégorie** : Qualiopi
- **Priorité** : **P0**
- **Retour source** : `Cahier des Charges Site Web Spécial Qualiopi` (Ind 32) + Retours p.4 : « Le programme doit figurer sur la page de vente ou être téléchargeable… programme marketing + officiel Qualiopi accessible… email pour télécharger… pareil pour le référentiel des compétences… dater (actualisé en mai 2026) ». Source `PROGRAMME DE FORMATION.docx` (tarif 2 200 € TTC, prérequis « aucun », durée ~60h, modalités/délais d'accès, public, objectifs, 7 blocs, évaluation, formateur) + `RÉFÉRENTIEL DE COMPÉTENCES.docx` (10 compétences).
- **Statut actuel** : **UI complète mais non opérationnelle.** `FormationDocuments.tsx` affiche déjà 2 cartes (Programme / Référentiel) + un formulaire e-mail + la date « Actualisé en {PAGE_LAST_UPDATED} » (= « mai 2026 », centralisée dans `qualiopi.ts:15`). **Mais** : (1) les 2 PDF réels **n'existent pas** dans `public/documents/` → les boutons renvoient 404 ; (2) la route `send-program` est un **stub** (pas de Resend, contient un `console.log`, message « envoyé » trompeur).
- **Fichier(s) concerné(s)** : `src/lib/qualiopi.ts:15` ; `src/components/formations/FormationDocuments.tsx:9-34,83-88` ; `src/components/formations/ProgramEmailForm.tsx` ; `src/app/api/send-program/route.ts:32-61` ; `public/documents/README.md` (noms attendus : `pnl-praticien-programme.pdf`, `pnl-praticien-referentiel.pdf`) ; consommé dans `pnl-praticien/page.tsx:246-249`.
- **Décision à acter (tension PRD)** : le PRD impose « aucun prix affiché ». Le tarif (2 200 € TTC) **vit dans le PDF officiel téléchargeable**, pas sur la page → satisfait Qualiopi (tarif accessible) **et** le PRD (pas de prix on-page). À confirmer avec Marien.
- **Note** : e-mail référent dans les docs = « contact@institutlaclé.fr » (avec accent) mais le code/CLAUDE.md utilisent `contact@institutlacle.fr` (sans accent). **Garder `contact@institutlacle.fr`** (canonique) ; signaler la coquille des docs.
- **Action technique** : (1) déposer les 2 PDF réels (livrables client) sous les noms attendus ; (2) brancher Resend dans la route (`npm i resend`, `RESEND_API_KEY`, envoi avec pièce jointe) ou, à défaut, ne pas afficher un message « envoyé » mensonger ; (3) retirer le `console.log` ; (4) éventuellement générer un PDF programme à partir du contenu `PROGRAMME DE FORMATION.docx`.
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (Next.js 16 App Router, TS strict, zéro console.log en prod ; fakedata/Resend non encore branché ailleurs). Travaille uniquement dans la-cle-institut/.

Objectif (P0, Qualiopi Ind.1) : rendre réellement opérationnels le téléchargement du programme + référentiel et l'envoi par e-mail sur la fiche /formations/pnl-praticien. L'UI est DÉJÀ construite (FormationDocuments.tsx + ProgramEmailForm.tsx + date « Actualisé en {PAGE_LAST_UPDATED} » via src/lib/qualiopi.ts). Les manques sont : PDF absents + route e-mail en stub + console.log.

Fichiers : src/app/api/send-program/route.ts (stub) ; src/components/formations/ProgramEmailForm.tsx ; src/components/formations/FormationDocuments.tsx (PROGRAM_PDF/REFERENTIEL_PDF lignes ~9-10) ; src/lib/qualiopi.ts:15 (PAGE_LAST_UPDATED) ; public/documents/README.md (noms attendus : pnl-praticien-programme.pdf, pnl-praticien-referentiel.pdf).

À faire :
1) Brancher l'envoi e-mail : `npm i resend` dans la-cle-institut ; lire RESEND_API_KEY depuis l'env ; dans send-program/route.ts, remplacer le console.log (ligne ~58) par resend.emails.send({ from, to: email, subject, html, attachments:[{ filename, path: <URL absolue du PDF programme> }] }) ; gérer erreurs + codes HTTP ; RETIRER le console.log (conformité zéro console.log).
2) Si la clé Resend n'est pas encore dispo : NE PAS afficher « le programme vient de vous être envoyé » de façon trompeuse. Afficher un message honnête (ex. « Votre demande est enregistrée, vous recevrez le programme très vite ») et logguer côté serveur sans console.log (ou TODO Resend balisé).
3) Documenter clairement que les 2 PDF réels doivent être déposés dans public/documents/ sous les noms exacts (pnl-praticien-programme.pdf, pnl-praticien-referentiel.pdf). Tant qu'ils manquent, les boutons renvoient 404 (attendu). NE PAS inventer de PDF.
4) E-mail référent : utiliser contact@institutlacle.fr (sans accent), valeur canonique du code ; signaler que les docs source écrivent « institutlaclé.fr » (coquille).
5) Décision tarif (à confirmer Marien) : le tarif 2 200 € TTC reste UNIQUEMENT dans le PDF officiel (pas affiché sur la page), pour respecter le PRD « aucun prix affiché » tout en satisfaisant Qualiopi (tarif accessible via le programme téléchargeable). Ne pas ajouter de prix on-page.

Contrainte : TS strict, zéro any, zéro console.log, tokens jamais en hex.

Critère de réussite : la soumission e-mail appelle réellement Resend (ou affiche un message honnête si clé absente) ; aucun console.log ; date « Actualisé en mai 2026 » visible et éditable en un point (qualiopi.ts) ; chemins PDF documentés ; npm run lint + build OK.
```
- **Critère de validation** : envoi e-mail réel (ou message honnête) ; 0 `console.log` ; date éditable centralisée ; instructions PDF claires.

---

### [Q2] Indicateur 2 — Widget « Nos indicateurs qualité » (résultats, fakedata)
- **Catégorie** : Qualiopi
- **Priorité** : **P1**
- **Retour source** : `Indicateur 2.docx` : « affichables publiquement sur le site… widget site web : Satisfaction X/5, Réussite X%, Taux de complétion X%, Nombre d'apprenants X, Mise à jour : date ». Publics : inscrits, apprenants actifs, complétion %, réussite examen final %, réussite par bloc %, satisfaction /5, recommandation %, temps moyen.
- **Statut actuel** : **absent.** Les `METRICS` du hero PNL sont **structurels** (7/2/1), pas des résultats Qualiopi. Aucun widget de résultats, aucune structure prête pour Supabase.
- **Fichier(s) concerné(s)** : à créer (`src/components/formations/FormationResultats.tsx` + fakedata typées, ex. `src/lib/resultats.ts`) ; à monter dans `pnl-praticien/page.tsx` (près de la section Documents/Certification).
- **Action technique** : créer un composant « Nos indicateurs qualité » alimenté par des **fakedata typées** (taux de réussite, nb de certifiés, satisfaction /5, complétion %, recommandation %, temps moyen, date de mise à jour), **structuré pour un futur fetch Supabase** (TODO balisé). Ne pas réutiliser `METRICS`.
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (Next.js 16, TS strict zéro any, Tailwind v4 tokens français jamais en hex, fakedata typées, AUCUN Supabase ; max 250 lignes/fichier ; ton institutionnel non commercial). Travaille uniquement dans la-cle-institut/.

Objectif (P1, Qualiopi Ind.2) : afficher sur la fiche /formations/pnl-praticien un widget « Nos indicateurs qualité » alimenté par fakedata, structuré pour un branchement Supabase futur (données temps réel issues du LMS). NE PAS confondre avec les METRICS structurels du hero (7/2/1) : ce sont des RÉSULTATS.

À faire :
1) Créer src/lib/resultats.ts : un type ResultatsQualiopi (ex. { tauxReussite: number; nbCertifies: number; satisfactionSur5: number; tauxCompletion: number; tauxRecommandation: number; tempsMoyenHeures: number; miseAJour: string }) + une const fakedata typée + un commentaire « // TODO // Supabase: query agrégée résultats examens + certifications (Qualiopi Ind.2) ».
2) Créer src/components/formations/FormationResultats.tsx (server component) qui consomme ces données et affiche un bloc sobre « Nos indicateurs qualité » : Satisfaction X/5, Taux de réussite X%, Taux de complétion X%, Nombre de certifiés X, plus la date de mise à jour. Réutilise PAGE_LAST_UPDATED de qualiopi.ts pour la date si pertinent, ou la date des fakedata.
3) Monter le composant dans src/app/formations/pnl-praticien/page.tsx, près de la section Documents (commentaire « Qualiopi indicateur 2 »). Mise en page responsive cohérente (attention à ne pas reproduire le bug de chevauchement A2 : empilage mobile + tracking raisonnable).
4) Tokens uniquement, zéro hex, zéro any. Marque clairement les valeurs comme fakedata provisoires.

Critère de réussite : widget « Nos indicateurs qualité » visible sur la fiche PNL, alimenté par fakedata typées, structuré pour Supabase (TODO balisé), responsive sans chevauchement ; zéro any ; npm run lint + build OK.
```
- **Critère de validation** : widget présent, fakedata typées, TODO Supabase, responsive propre.

---

### [Q26] Indicateur 26 — Mention référent handicap (+ page accessibilité optionnelle)
- **Catégorie** : Qualiopi
- **Priorité** : **P2**
- **Retour source** : `Référent et procédure Handicap.docx` + Cahier des charges Ind 32 : « Mentionné quelque part qu'une personne handicapée doit contacter le référent handicap (contact@…). Le webmaster décidera de l'emplacement du bouton. »
- **Statut actuel** : **mention footer DÉJÀ IMPLÉMENTÉE** (`FooterMinimal.tsx:60-70`, « Toute personne en situation de handicap peut contacter notre référent handicap : contact@institutlacle.fr », depuis `qualiopi.ts:18`). Conforme à l'obligation minimale.
- **Fichier(s) concerné(s)** : `src/components/layout/FooterMinimal.tsx:60-70` ; `src/lib/qualiopi.ts:18`.
- **Action technique** : aucune obligatoire. **Recommandation (P2)** : créer une page `/accessibilite` reprenant l'engagement, le référent (Marien Jesson), la procédure d'accueil et le réseau mobilisable (le `.docx` est riche) → excellente preuve d'audit ; lier depuis le footer. À arbitrer avec la contrainte PRD « pas de liens secondaires parasites ».
- **Prompt prêt à coller** :
```
Contexte : site vitrine la-cle-institut (Next.js 16 App Router, TS strict, Tailwind v4 tokens français, contenu institutionnel ; routes via ROUTES dans src/lib/constants.ts ; aucun tiret cadratin/demi-cadratin). Travaille uniquement dans la-cle-institut/.

Constat : la mention référent handicap (Qualiopi Ind.26) est DÉJÀ dans le footer (FooterMinimal.tsx:60-70, email contact@institutlacle.fr via qualiopi.ts). Obligation minimale satisfaite.

Option recommandée (P2, à valider Marien) : créer une page dédiée /accessibilite pour renforcer la preuve d'audit, à partir du document « Référent et procédure Handicap » :
1) Créer la route src/app/accessibilite/page.tsx (HeroSection + SectionBlock) reprenant : engagement de l'organisme, accessibilité native du distanciel, référent handicap (Marien Jesson, contact@institutlacle.fr), procédure d'accueil (signalement, entretien, analyse, aménagements, suivi), et le réseau mobilisable (Agefiph, Cap Emploi 35, MDPH 35, Ressource Handicap Formation Bretagne). Ton sobre, aucun tiret cadratin/demi-cadratin.
2) Ajouter ROUTES.accessibility = "/accessibilite" dans constants.ts et lier la page depuis la mention du footer (le « bouton » dont parle le doc), sans surcharger la navigation principale (respect PRD : pas de liens parasites).
3) Réutiliser HANDICAP_REFERENT_EMAIL de qualiopi.ts (ne pas hardcoder l'email).

Critère de réussite : page /accessibilite sobre et complète, liée depuis le footer, email via constante ; sans tiret cadratin/demi-cadratin ; npm run lint + build OK.
```
- **Critère de validation** : (si retenue) page `/accessibilite` accessible depuis le footer ; mention footer conservée.

---

## §C — STATUT DES 32 INDICATEURS QUALIOPI (impact site vitrine)

| Ind. | Sujet | Impact site vitrine | Fiche / Statut |
|---|---|---|---|
| 1 | Informations au public (page de vente) | **OUI** | **Q1** (P0) — UI faite, PDF + Resend à finaliser |
| 2 | Indicateur de résultats | **OUI** | **Q2** (P1) — widget à créer (fakedata) |
| 3 | Réservé RNCP | Non | Sans impact site |
| 4 | Questionnaire pré-inscription (7 q.) | Non (LMS) | Sans impact site vitrine — concerne `la-cle-app` |
| 5 | Objectifs / traçage questions | Non | Sans impact site |
| 6 | Contenus et modalités | Non | Sans impact site |
| 7 | Contenus et exigences | Non | Sans impact site |
| 8 | Test de positionnement (Cours 0) | Non (LMS) | Sans impact site vitrine — `la-cle-app` |
| 9 | Conditions de déroulement | Non | Sans impact site |
| 10 | Adaptation de la prestation | Non | Sans impact site |
| 11 | Atteinte des objectifs | Non | Sans impact site |
| 12 | Engagement / anti-décrochage | Non (LMS) | Sans impact site vitrine — `la-cle-app` |
| 13 | (non concerné) | Non | Sans impact site |
| 14 | (non concerné) | Non | Sans impact site |
| 15 | (non concerné) | Non | Sans impact site |
| 16 | (non concerné) | Non | Sans impact site |
| 17 | Moyens techniques | Non (LMS) | Sans impact site vitrine — `la-cle-app` |
| 18 | Coordination des acteurs | Non | Sans impact site (action : Marien renvoie contrat signé) |
| 19 | Ressources pédagogiques | Non | Sans impact site |
| 20 | (non concerné) | Non | Sans impact site |
| 21 | Compétences des acteurs | Non | Sans impact site (CV éventuel plus tard) |
| 22 | Gestion de la compétence | Non | Sans impact site |
| 23 | Veille réglementaire | Non | Sans impact site |
| 24 | Veille pédagogique | Non | Sans impact site |
| 25 | Veille technique/métiers | Non | Sans impact site |
| 26 | Situation de handicap | **OUI** | **Q26** (P2) — mention footer déjà faite ; page `/accessibilite` recommandée |
| 27 | Sous-traitance | Non | Sans impact site (action : signer contrat) |
| 28 | (non concerné) | Non | Sans impact site |
| 29 | (non concerné) | Non | Sans impact site |
| 30 | Recueil des appréciations | Non (LMS) | Sans impact site vitrine — `la-cle-app` |
| 31 | Traitement des réclamations | Non (LMS) | Sans impact site vitrine — `la-cle-app` (bouton bug dans le LMS) |
| 32 | Amélioration continue | Non | Sans impact site (géré par Marien ; ce document EST une trace) |

> Les indicateurs 4, 8, 12, 17, 30, 31 ont un impact **LMS** documenté dans `la-cle-app/docs/CAHIER_CHARGES_QUALIOPI.md` (hors périmètre de ce plan site).

---

## §D — TABLEAU RÉCAPITULATIF (trié par priorité)

| ID | Titre | Catégorie | Priorité | Fichier principal | Statut actuel |
|---|---|---|---|---|---|
| A1 | Chevauchement header /nous-decouvrir | Bug visuel | **P0** | `layout/Header.tsx` + `ui/HeroSection.tsx` | À corriger |
| A2 | Chevauchement stats mobile | Bug visuel | **P0** | `formations/pnl-praticien/page.tsx` | À corriger |
| A13 | Retrait présentiel formation dispo | Formations | **P0** | `formations/pnl-praticien/page.tsx` | À corriger |
| Q1 | Ind.1 programme/référentiel + e-mail | Qualiopi | **P0** | `api/send-program/route.ts` | UI faite, PDF+Resend à finaliser |
| A3 | Halo bronze trop fort (clair) | Mode clair-sombre | **P1** | `globals.css` (hero light) | Partiel |
| A9 | Accroche commutable (3 variantes) | Textes | **P1** | `lib/constants.ts` | Partiel |
| A10 | Page Concept (sans livret/100% vidéo) | Textes | **P1** | `nous-decouvrir/le-concept/page.tsx` | Absent |
| A11 | Mot « rigueur » trop filtrant | Textes | **P1** | 6 fichiers (12 occ.) | À corriger |
| A14 | Carrousel/roue par parcours | Formations | **P1** | `formations.ts` + `FormationCarousel.tsx` | Partiel |
| A16 | Parcours fondateur (10 ans + métiers) | Textes | **P1** | `formations/TeamFounderBio.tsx` | À ajouter |
| Q2 | Ind.2 widget résultats qualité | Qualiopi | **P1** | (à créer) `FormationResultats.tsx` | Absent |
| A4 | Découverte toggle clair/sombre | Mode clair-sombre | **P2** | `layout/ThemeToggle.tsx` | Déjà fait (polish) |
| A5 | Bouton plus élégant | Esthétique | **P2** | `globals.css` `.btn-elegant` | Existe (à enrichir) |
| A6 | Fil bas de page Nous découvrir | Navigation | **P2** | `layout/DiscoverNav.tsx` | Déjà fait |
| A7 | Hint ordre « Notre vocation » | Navigation | **P2** | `ui/HubCard.tsx` | Déjà fait |
| A8 | Équipe : texte avant vidéo | Navigation | **P2** | `nous-decouvrir/equipe/page.tsx` | Déjà conforme (vérifier) |
| A12 | FAQ PNL « voire d'altruisme » | Textes | **P2** | `formations/PNLFAQ.tsx` | Déjà fait (polish tiret) |
| A15 | Performances animations | Performance | **P2** | `layout/BackgroundAtmosphere.tsx` | À optimiser |
| A17 | Logo définitif dans l'animation | Esthétique | **P2** | `home/HomeContent.tsx` | En attente logo |
| A18 | Purge tirets cadratins (contenus) | Textes | **P2** | `src/**` (chaînes affichées) | À corriger |
| A19 | Dette technique (code mort, log…) | Performance/Dette | **P2** | divers | À nettoyer |
| Q26 | Ind.26 référent handicap | Qualiopi | **P2** | `layout/FooterMinimal.tsx` | Footer fait ; page `/accessibilite` reco |

**Répartition par priorité :** P0 = 4 · P1 = 7 · P2 = 11.

---

## §E — COMPTEUR FINAL

- **Nombre total de fiches** : **25** (22 fiches d'action avec prompt + 3 lignes de statut pour Ind. groupés couvertes par le tableau §C).
- **Nombre total de prompts prêts à coller** : **22** (A1 à A19 = 19, Q1, Q2, Q26 = 3).
- **Indicateurs Qualiopi traités** : **32/32** (chacun a un statut dans §C ; 3 ont une fiche action site : Ind 1, 2, 26).
- **Retours utilisateurs traités** : **100%** (chaque point du document de retours a une fiche ; les retours « projection » non urgents — podcast avec Théo, témoignages — sont listés ci-dessous, sans prompt).
- **Boucles de lecture effectuées** : **2** (documentaire + code avec vérification croisée).

### Éléments futurs (hors périmètre immédiat, sans prompt)
- **Podcast avec Théo** (studio Q/R) en remplacement des vidéos figées (Retours p.3) — à planifier quand le contenu existe.
- **Section témoignages** sur la page formations (`RETOURS_SITE_VITRINE.md`) — dépend des premiers avis publics (Ind. 30, LMS).
- **Vidéos d'atmosphère** sur `notre-vocation` (PRD §8) : composant `VideoAtmosphere` prêt mais non monté ; à brancher quand les vidéos ≤ 20s seront fournies.

### Points à trancher avec Marien avant exécution (rappel)
1. Accroche : choisir la variante (A9).
2. Mot « rigueur » : valider les remplacements (A11).
3. Page Concept : valider le wording des 4 points (A10).
4. Parcours fondateur : formulation (A16).
5. Tarif 2 200 € : confirmer qu'il reste dans le PDF officiel et hors page (Q1).
6. Page `/accessibilite` : créer ou non (Q26).
7. Libellé CTA Équipe « Aller vers la formation » vs « Découvrir la formation » (A6).
