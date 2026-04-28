# CLAUDE.md — la-cle-app (LMS La Cle Institut)
> Source de verite pour toute session Claude Code sur ce projet.

---

## 1. QUI EST CE PROJET

**La Cle Institut** est un organisme de formation certifie Qualiopi, specialise en PNL (Programmation Neuro-Linguistique), Analyse Transactionnelle et Approche Systemique.

**Fondateur : Marien Jesson** (CEO, directeur pedagogique, responsable communaute, responsable admin — il porte tout pour le moment).

**Propul'SEO (Etienne)** = prestataire tech. Gere le LMS, le site vitrine, les automatisations, le pole commercial digital.

**Ce projet (`la-cle-app`)** est la plateforme LMS (Learning Management System) — espace apprenant + espace admin. Il est **distinct** du site vitrine (`la-cle-institut`).

---

## 2. STACK TECHNIQUE

- **Next.js 16 / React 19 / TypeScript strict**
- **Tailwind CSS v4** — tokens CSS dans `globals.css` via `@theme inline` (pas de tailwind.config)
- **framer-motion** pour les animations
- **Supabase** — pas encore connecte. Toutes les donnees sont en mock data pour l'instant.
- **Resend** — prevu pour les emails transactionnels (pas encore branche)
- **Stripe** — prevu pour les paiements (pas encore branche)
- **Vercel** — hebergement

### Regles absolues du projet
- Max **250 lignes par fichier** — decoupe en sous-composants si depasse
- Zero `any` TypeScript — utiliser les interfaces de `src/types/lms.ts`
- Zero `console.log` en production
- Tous les TODO Supabase/Stripe/Resend sont a commenter clairement dans le code (voir section 7)
- Les mock data sont dans `src/data/mock/` — ne jamais importer directement dans les composants, passer par les services (`src/services/`)

---

## 3. ARCHITECTURE EXISTANTE

### Routes (26 pages existantes + 2 a creer)

**Apprenant** (`/espace`) :
```
/                                    — accueil
/login                               — connexion eleve
/espace                              — dashboard apprenant
/espace/parcours                     — liste modules (timeline)
/espace/parcours/[moduleId]          — detail module + videos + examen
/espace/parcours/[moduleId]/video/[videoId] — lecteur video + questions overlay
/espace/parcours/[moduleId]/examen   — examen modulaire
/espace/examen-final                 — demande + statut examen final
/espace/presentiel                   — sessions presentielles
/espace/revision                     — coffre de revision (fiches, questions, videos)
/espace/documents                    — documents perso (contrats, factures)
/espace/compte                       — profil
```

**Admin** (`/admin`, route group `(dashboard)`) :
```
/admin/login                         — connexion admin
/admin                               — dashboard (stats + alertes)
/admin/contenus                      — hub contenus
/admin/contenus/modules              — liste modules
/admin/contenus/modules/[id]         — detail module + videos
/admin/contenus/modules/[id]/videos/[videoId] — detail video
/admin/contenus/examen-final         — gestion examens finaux
/admin/contenus/coffre               — coffre de revision
/admin/apprenants                    — liste apprenants
/admin/apprenants/nouveau            — creer apprenant
/admin/apprenants/[id]               — fiche apprenant
/admin/sessions                      — sessions presentielles
/admin/documents                     — documents + messages support
/admin/parametres                    — reglages plateforme
```

**A creer** (composants orphelins existants, pas encore de route) :
- `/inscription` — composant `PreEnrollmentQuestionnaire` pret dans `src/components/enrollment/`
- `/espace/onboarding` — composant `OnboardingAssessment` pret dans `src/components/onboarding/`

### Composants existants (35)
- **ui/** (24) : Button, Input, Textarea, Select, Card, Badge, Modal, DropdownMenu, DataTable, Pagination, SearchInput, ProgressBar, ProgressRing, StatCard, EmptyState, Alert, Tabs, Breadcrumb, Toggle, Expandable, FileUploadZone, VideoPlayer, ScrollReveal, SectionBlock
- **layout/** (7) : BackgroundAtmosphere, AdminSidebar, AdminHeader, AdminShell, LearnerHeader, LearnerMobileNav, LearnerShell
- **admin/** (3) : StatsOverview, RecentActivity, AlertsPanel
- **learner/** (1) : OverlayQuestion
- **enrollment/** (2) : RadioChoice, PreEnrollmentQuestionnaire — ORPHELIN (pas de route)
- **onboarding/** (3) : OnboardingQuestionStep, OnboardingResultScreen, OnboardingAssessment — ORPHELIN (pas de route)

### Types — ATTENTION : deux systemes coexistent

**Probleme a resoudre en priorite.**
- `src/types/lms.ts` → **source de verite cible** (Qualiopi-ready, complet, 251 lignes)
- `src/types/index.ts` → re-exporte l'ancien systeme (`learner.ts`, `module.ts`, `video.ts`, `exam.ts`, `session.ts`, `document.ts`, `revision.ts`, `settings.ts`)
- **Les pages importent encore depuis `@/types` (l'ancien systeme)**
- Migration a faire : unifier vers `lms.ts` sans rien casser

### Services (9)
`auth`, `learners`, `modules`, `videos`, `exams`, `sessions`, `documents`, `revision`, `settings`
Chaque service importe ses mock data depuis `src/data/mock/` et expose des fonctions async avec `sleep()` pour simuler la latence.

### Mock data (9)
`admin`, `learners`, `modules`, `videos`, `exams`, `sessions`, `documents`, `revision`, `settings`

### Hooks (3)
`useAuth`, `useRequireAuth`, `useVideoProgress`

### Lib
`constants.ts` (ROUTES + SITE), `animations.ts`, `utils.ts`, `status.ts`, `onboarding.ts`

### Contexts
`AuthContext.tsx` — faux auth avec mock user

---

## 4. DOCUMENTS DE REFERENCE — LIRE AVANT DE CODER

Les documents suivants sont dans `docs/`. **Lis le doc concerne AVANT de builder une feature** si elle touche a son perimetre.

### `docs/METHODE_LA_CLE.md`
La methode pedagogique officielle. Contient :
- Les 3 niveaux d'objectifs : Comprendre → Savoir utiliser → Incarner
- La double progression : montee logique (cognitive) + montee emotionnelle
- L'architecture des cours : encarts → capsules video (quelques secondes a 5 min)
- Les 5 types de questions : anticipation / philosophique / integration QCM / integration libre / validation
- La temporalite des revisions : **J+1, J+3, J+7, J+21** (repetition espacee — systeme fixe, non adaptatif)
- La logique de titres masques : premiere lecture = code (1A1, 1A2...), apres completion = titre visible
- La pedagogie spiralee : notions introduites, approfondies, reliees, integrees
- Le chatbot pedagogique : ne donne jamais la reponse, propose des metaphores, renvoie vers les cours
- Les analytics par notion (pas seulement par cours)

### `docs/PARCOURS_UTILISATEUR.md`
Le parcours complet vu depuis l'eleve, etape par etape :
- Creation de compte (mail, nom, profession, telephone, mdp)
- Bilan d'accueil personnalise (10 questions) → avant Cours 0
- Essai 7 jours : statut "Decouverte", acces cours 1-7, coffre limite
- Blocage cours 7 → inscription requise
- Conditions cours 8 : contrat signe + CGV + paiement recu
- Structure complete du Coffre (5 categories documentaires)
- Modalites examens de module et examen final
- Post-certification : attestation + invitation presentiel
- Points XXXXX = a debattre avec Marien avant de coder

### `docs/CAHIER_CHARGES_QUALIOPI.md`
Les indicateurs Qualiopi qui concernent la plateforme :
- **Ind. 1** : page de vente (programme telechargeable, referentiel competences, date de mise a jour) — site vitrine
- **Ind. 2** : indicateur de resultats — export stats en temps reel depuis le LMS
- **Ind. 4** : questionnaire pre-inscription (7 questions, horodatage, export audit)
- **Ind. 8** : test de positionnement Cours 0 (10 questions, horodatage, export audit, bloquant avant module 1)
- **Ind. 12** : anti-decrochage (relances J+7/14/28/42, dashboard 4 onglets, export stats)
- **Ind. 17** : page moyens techniques (statique, bouton imprimer, pour preuve d'audit)
- **Ind. 26** : mention referent handicap (`contact@institutlacle.fr`) dans footer site + LMS
- **Ind. 30** : questionnaires satisfaction a chaud (post-examen) + a froid (J+90), export Excel, vue admin
- **Ind. 31** : bouton signalement bugs (flottant dans LearnerShell, modale avec page auto-remplie)

### `docs/ORGANIGRAMME.md`
Structure de La Cle Institut :
- Direction Generale + Pedagogique : Marien Jesson
- Pole Digital / Produit : Propul'SEO (Etienne)
- Pole Commercial : Propul'SEO
- Pole Communaute/Fidelisation : Marien Jesson (premier destinataire alertes anti-decrochage)
- Pole Administratif : Marien Jesson
- Formateurs : 0 pour le moment, role futur prevu (relecture reponses libres, corrections)

---

## 5. LOGIQUE METIER — REGLES CRITIQUES A RESPECTER

### Statuts de l'eleve
```typescript
type StudentStatus = 'decouverte' | 'inscrit' | 'bloque' | 'certifie'
```
- `decouverte` : essai 7 jours, acces cours 1-7 uniquement, coffre limite (CGU + politique confidentialite + guide demarrage seulement)
- `inscrit` : acces complet selon progression
- `bloque` : paiement echoue — bloque la ou il en est + alerte admin
- `certifie` : examen final reussi + presentiel valide

### Titres de capsules
- Premiere lecture : afficher le **code uniquement** (`1A1`, `1A2`, `1B1`...)
- Apres completion du cours : les **titres deviennent visibles**
- Utiliser `getCapsuleDisplayName(code, title, isCompleted)` dans `src/lib/capsule-utils.ts`
- Apres completion : possibilite d'**accelerer la lecture** dans le VideoPlayer

### Types de questions inter-capsules
Les questions sont en **pop-up overlay** entre les capsules, pas une section separee.

1. **Anticipation** : avant une notion, reponse libre, **non bloquante**
2. **Philosophique** : metacognitive, reponse libre, **non bloquante**
3. **Integration QCM** : **bloquante**, bonne reponse obligatoire, tentatives illimitees, feedback apres erreur
4. **Integration libre** : enregistree, relue par un formateur si necessaire, **non bloquante**
5. **Validation** : fin de sequence, QCM, **bloquante**

Les questions appartiennent a des **categories definies par l'admin**. L'admin consulte les reponses **par eleve ET par categorie**.

### Enregistrement des donnees par question
Pour chaque question sont enregistres :
- la reponse (non modifiable apres soumission)
- le **temps de reponse** (`responseTime`)
- le **nombre de tentatives** (`attemptCount`)

Toutes les questions sont consultables :
- par l'**eleve** (lecture seule, dans le coffre)
- par le **formateur** (par eleve + par categorie)

### Repetition espacee
Chaque question repondue **correctement** declenche 4 revisions planifiees : **J+1, J+3, J+7, J+21**.
Systeme **fixe**, non adaptatif. Si echec lors d'une revision, la sequence repart de J+1.

### Examens de module
- **2 essais immediats** enchainables (sans delai)
- Ensuite : max **1 essai par heure**, max **5 tentatives sur 24h**
- Echec apres tout ca → **blocage 24h** + message "Prendre contact avec nous"

### Examen final
- **J1** : 2 essais maximum
- Blocage 24h automatique
- **J3** : 1 essai
- Blocage 48h si echec
- **J5** : 1 essai final (4eme total)
- **Echec** → prise de contact staff obligatoire
- **Reussite** → attestation fin de formation + invitation presentiel dans le coffre

### Structure du Coffre (Vault)
```
Coffre > Praticien PNL > 5 categories :
1. Contractuels : contrat distanciel, contrat presentiel, CGV, reglement interieur
2. Financiers : factures, recus, echeanciers
3. Pedagogiques : attestation suivi, validations modules, convocation presentiel, certificat final
4. Qualite/conformite : questionnaire satisfaction a chaud, a froid, docs Qualiopi
5. Pratiques : dates presentiel, adresse, consignes logistiques
```

Acces coffre en mode Decouverte : uniquement CGU + politique confidentialite + guide demarrage.

### Acces au cours 8 (3 conditions cumulatives)
1. `contractSigned === true`
2. `cgvAccepted === true`
3. `paymentStatus === 'active'`
Si paiement echoue ensuite → `status = 'bloque'` + alerte admin

### Blocage cours 7 (statut Decouverte)
L'eleve est bloque au cours 7. Il ne peut pas passer l'examen de module.
Afficher une invitation discrete a s'inscrire.

### Chatbot pedagogique
- Ne donne **jamais** la reponse directe — REGLE ABSOLUE
- Propose des metaphores et angles de reflexion
- Renvoie vers les capsules concernees (ex: "revois la capsule 2B3")
- Max **10 messages par session**

---

## 6. ETAT D'AVANCEMENT PAR CHANTIER

| Chantier | Statut | Notes |
|----------|--------|-------|
| Types TypeScript unifies | Partiel | Deux systemes — `lms.ts` vs `types/*.ts`. Les pages importent l'ancien. |
| Questionnaire pre-inscription (Ind.4) | Composant fait, pas de route | `/inscription` a creer |
| Bilan d'accueil (Ind.8) | Composant fait, pas de route | `/espace/onboarding` a creer, blocage avant Cours 0 a implementer |
| Test positionnement Cours 0 (Ind.8) | Types seulement | Composant `PositioningTest` + route a creer, bloquant avant module 1 |
| Titres masques | Types definis, pas dans l'UI | `getCapsuleDisplayName` a creer dans `capsule-utils.ts` |
| Questions inter-capsules (methode) | Partiel | `OverlayQuestion` existe pour timestamps video, mais pas les 5 types de la methode |
| Statut Decouverte + blocage cours 7 | Non implemente | `StudentStatus` existe dans `lms.ts` mais pas dans `status.ts` |
| Gating cours 8 | Non implemente | Types definis, aucune logique de blocage |
| Coffre Vault 5 categories | Partiel | Coffre revision existe, pas le Vault documentaire 5 onglets |
| Logique examens (limites + delais) | Partiel | Flux basique OK, pas de gestion tentatives/blocages temporels |
| Repetition espacee J+1/3/7/21 | Non implemente | Types a ajouter, hook a creer |
| Chatbot pedagogique | Non implemente | — |
| Dashboard anti-decrochage admin (Ind.12) | Types seulement | Page `/admin/engagement` + mock data + 4 onglets a creer |
| Questionnaires satisfaction (Ind.30) | Types seulement | Composants + routes + vue admin + export a creer |
| Analytics pedagogiques (par notion) | Non implemente | Page `/admin/analytics` double lecture cours/notion |
| Page moyens techniques (Ind.17) | Non implemente | Page statique `/admin/moyens-techniques` + bouton imprimer |
| Bouton signalement bugs (Ind.31) | Non implemente | Bouton flottant dans LearnerShell + modale |
| Referent handicap (Ind.26) | Non implemente | Mention dans footer LMS |

---

## 7. TODOS SYSTEMATIQUES A INCLURE DANS LE CODE

Chaque fois qu'une feature touche a une de ces integrations, ajouter le commentaire correspondant :

```typescript
// TODO // Supabase: [description de la query/table concernee]
// TODO // Stripe: [description du webhook ou action concernee]
// TODO // Resend: [description de l'email a envoyer]
// TODO // Qualiopi Ind.X: [ce que cet export prouve pour l'audit]
```

---

## 8. DESIGN SYSTEM

- **Fond** : bleu-nuit profond `#0a0f1e` — tokens `nuit`, `encre`, `surface`
- **Texte** : blanc casse `#f0ede8` — token `ivoire`
- **Accent** : dore pale `#c9a96e` — token `or`
- **Secondaires** : `cendre` (texte secondaire), `pierre` (texte tertiaire), `filet` (bordures)
- **Feedback** : `succes`, `erreur`, `attention`, `info`
- Tokens CSS dans `globals.css` via `@theme inline`
- Police : definie dans `globals.css` — ne pas changer
- **Toujours utiliser les tokens CSS, jamais de valeurs hex hardcodees**

---

## 9. CONTACTS PROJET

- **Marien Jesson** (client) : fondateur La Cle Institut, decisionnaire pedagogie
- **Etienne** (Propul'SEO) : responsable developpement, point de contact technique
- Email support plateforme : `contact@institutlacle.fr`
- Email referent handicap (Qualiopi Ind.26) : `contact@institutlacle.fr`

---

## TAILWIND
- Version : Tailwind CSS v4
- Pas de tailwind.config.js
- Tokens CSS definis dans globals.css via @theme inline
- Ne jamais utiliser @apply ni tailwind.config patterns

## DOCS DE REFERENCE
Les fichiers suivants sont dans /docs — lis-les si la feature les concerne :
- docs/METHODE_LA_CLE.md
- docs/PARCOURS_UTILISATEUR.md
- docs/CAHIER_CHARGES_QUALIOPI.md
- docs/ORGANIGRAMME.md
- docs/RETOURS_SITE_VITRINE.md
