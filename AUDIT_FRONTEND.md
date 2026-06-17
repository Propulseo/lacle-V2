> **Note méthodologique (à lire avant le rapport).**
> Cet audit est **pur-code** : il s'est interdit toute introspection Supabase live (pour ne pas entrer en contention avec l'audit DB `AUDIT_E2E.md` lancé en parallèle). Conséquence : tous les findings de la dimension **`client-side-security` sont classés « incertains » (section 4)** car ils dépendent de l'état réel de la RLS/RPC.
> De plus, la phase de vérification adversariale a subi un **rate-limit API** (2 workflows simultanés) : les agents `verify:client-side-security-1..8`, `verify:legacy-residue-orphans-3`, `verify:a11y-perf-seo-3/6` **n'ont pas pu tourner**. Les findings concernés ne sont donc **pas** adversarialement confirmés — ils sont à **trancher contre `AUDIT_E2E.md`** (introspection live), pas à considérer comme bénins. Le « 0 critique / 0 high confirmé » ci-dessous est un artéfact de ce périmètre, **pas** un feu vert sécurité.
> Verdicts: 20 confirmés · 12 incertains · 5 faux positifs (sur 37 findings bruts, 8 dimensions).

---

# Audit front + securite — La Cle (2026-06-17)

## 1. Synthese executive

L'audit pur-code du monorepo (vitrine `la-cle-institut` + LMS `la-cle-app`) montre un projet globalement sain au niveau de l'hygiene front (zero `any` vivant, accents corrects, tokens respectes hors cas legitimes, secrets correctement gitignores) mais porteur d'un **risque structurel majeur post-migration** : plusieurs regles critiques restent appliquees **uniquement cote client** (gating cours 7/8, conditions d'inscription en localStorage, persistance Qualiopi Ind.4/Ind.8) face a une RLS contenu volontairement ouverte (`USING(true)`). Sur les **20 findings confirmes**, la repartition apres ajustement adversarial est : **0 critique, 0 high, 3 medium, 17 low**. Les findings les plus graves (acces contenu paye sans paiement, gating falsifiable, route admin sans guard serveur) sont en file **« incertains »** (12 items) car leur impact reel depend d'une verification live de la RLS/RPC que cet audit s'est interdit de solliciter — ils doivent etre tranches en croisant avec `AUDIT_E2E.md`. **Top risques a traiter** : (1) absence totale de headers de securite HTTP sur les deux apps (medium), (2) accessibilite des formulaires publics et des tableaux admin (2 medium WCAG), (3) la grappe « securite client-only » a confirmer/corriger cote DB. Aucun secret reel n'est expose dans le code livre.

## 2. Risques critiques & eleves (confirmes)

Apres verification adversariale, **aucun finding confirme ne reste en severite critique ou high** : les items les plus lourds (`deps-build-config-1`, et toute la dimension `client-side-security`) ont ete soit abaisses a medium, soit reclasses en « incertains ». Les vrais risques eleves residuels sont donc concentres dans la section 4 (A trancher), faute de verification DB autorisee dans le perimetre de cet audit.

Le finding le plus structurant **confirme** est presente ci-dessous car il conditionne la posture de securite generale.

### Dimension deps-build-config

**Aucun header de securite HTTP (CSP, HSTS, X-Frame-Options, X-Content-Type-Options) dans les deux apps** — severite **medium** (abaissee de high)
- Fichiers : `la-cle-institut/next.config.ts:5-25`, `la-cle-app/next.config.ts:3-6`
- Impact : aucune fonction `headers()` n'existe. L'espace admin et apprenant sont embarquables en iframe (clickjacking) faute de `X-Frame-Options`/`frame-ancestors` ; pas de HSTS (risque de downgrade TLS sous MITM actif) ; pas de `nosniff` ; pas de CSP pour mitiger un XSS sur une app qui rend du contenu CMS et des examens. La RLS protege les donnees mais ne couvre **aucun** de ces vecteurs (orthogonaux). Attenue partiellement par les cookies Supabase `SameSite=Lax`.
- Recommandation : ajouter `async headers()` dans les deux `next.config.ts` : au minimum `Strict-Transport-Security: max-age=15552000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (cote LMS) / `SAMEORIGIN` (vitrine, pour le proxy `/acces-espace`), `Referrer-Policy: strict-origin-when-cross-origin`, et une CSP demarree en `Content-Security-Policy-Report-Only`. Veiller a ce que la CSP de la vitrine autorise le proxy `/acces-espace`.

### Dimension a11y-perf-seo (2 medium WCAG, voir section 3 pour le detail)

Les deux findings d'accessibilite restes en **medium** apres ajustement (`a11y-perf-seo-1` formulaires sans `aria-live`, `a11y-perf-seo-2` en-tetes de tableau LMS non operables au clavier) sont detailles dans le tableau de la section 3 ; ils constituent les manquements WCAG les plus concrets (4.1.3, 2.1.1, 1.3.1) sur des surfaces reellement utilisees (formulaire de contact public, tableau admin).

## 3. Moyens & mineurs (confirmes)

| ID | Sev. | Titre | Fichier:ligne | Recommandation courte |
|----|------|-------|---------------|------------------------|
| a11y-perf-seo-1 | medium | Formulaires vitrine sans `aria-live` (statut envoi/erreur/succes inaudible au lecteur d'ecran, WCAG 4.1.3) | `ContactForm.tsx:149-153`, `ProgramEmailForm.tsx:75-79` | Envelopper statut/erreur dans `role="status" aria-live="polite"` (ou `role="alert"`), annoncer aussi `sending`/`sent` |
| a11y-perf-seo-2 | medium | En-tetes de tableau LMS triables non operables au clavier, sans `scope`/`aria-sort` (WCAG 2.1.1, 1.3.1) | `DataTable.tsx:83-103` | `<button>` interne (ou `tabIndex=0`+`onKeyDown`), `aria-sort` sur le `<th>` actif, `scope="col"` partout |
| secrets-env-leak-1 | low | Cle `service_role` en clair dans `.env.local` (gitignore, non committe, isolee serveur ; expiration 10 ans, pas 70) | `la-cle-app/.env.local:7` | Injecter via secrets Coolify/Vercel en prod ; rotation si le dossier a deja ete partage/archive |
| secrets-env-leak-2 | low | `.gitignore` d'app (`.env*.local`) plus permissif que racine (`**/.env*`) — protection effective via la racine | `la-cle-app/.gitignore:32` | Harmoniser sur `.env*` pour auto-protection de chaque app |
| legacy-residue-orphans-1 | low | Repertoire `data/mock/` mort (~1500 lignes) sauf `demo-accounts.ts` | `la-cle-app/src/data/mock/*` | Supprimer tout `data/mock/` sauf `demo-accounts.ts` (a deplacer vers `src/lib/`) |
| legacy-residue-orphans-2 | low | Modele nested `Module>Course>Capsule` orphelin ; le DTO plat « Legacy » est le contrat branche (nommage trompeur) | `types/learning.ts:4-31` | Supprimer le nested une fois `Student` supprime, OU acter le renommage, OU commentaire d'en-tete |
| legacy-residue-orphans-4 | low | Faux positif documente : `enrollment/` et `onboarding/` sont **cables**, pas orphelins | `inscription/page.tsx:13-15`, `espace/onboarding/page.tsx:10` | Aucune suppression ; retirer de la liste « orphelins » des notes projet |
| error-resilience-fallback-1 | low | `handleMove`/`handleTogglePublished` (CMS) : `await` service throwable sans try/catch ni feedback | `SiteCollectionEditor.tsx:64-72` | try/catch + Alert/Toast, aligner sur `SiteContentEditor.handleSave` |
| error-resilience-fallback-2 | low | Pattern systemique d'`onClick` async non protege dans l'admin (ex. `handleAttendance`) | `sessions/page.tsx:28-31` | Helper d'action mutante standardise (try/catch + Toast + refetch) |
| error-resilience-fallback-3 | low | Vitrine sans `error.tsx`/`global-error.tsx` (seul `not-found.tsx`) ; chaine CMS ne leve jamais | `la-cle-institut/src/app/not-found.tsx` | Ajouter `global-error.tsx` (+ `error.tsx`) de marque avec bouton reset, parite LMS |
| front-contract-consistency-1 | low | Champ CMS `nombreApprenants` editable+seede mais jamais affiche (Qualiopi Ind.2 saisi non montre) | `cms-schema.ts:44`, `FormationResultats.tsx:16-21` | Afficher en 5e stat, OU retirer du schema+seed |
| front-contract-consistency-2 | low | Coercition `Number()` systematique sur sous-champs `object` : fragile si futur champ texte (NaN silencieux) | `SiteContentEditor.tsx:81-85` | Coercer selon `sub.type` (`Number()` si `number`, sinon string) |
| front-contract-consistency-3 | low | Liens `'/admin'`/`'/espace'` en dur contournant `ROUTES` | `contenus/site/page.tsx:26`, `AdminSidebar.tsx:90`, `LearnerHeader.tsx:21` | Remplacer par `ROUTES.admin.dashboard`/`ROUTES.espace.dashboard` |
| front-contract-consistency-4 | low | Enum DB `site_collection_type` (10 types) vs front cable (2) — scope v1, deja documente en SQL | `database.types.ts:2662-2672`, `cms-schema.ts:62-81` | Confirmer l'intention v1, tracer/maintenir le TODO de cablage des 8 types restants |
| a11y-perf-seo-5 | low | `VideoAtmosphere` (dormant) : `autoPlay loop` sans garde reduced-motion + `<img>` au lieu de next/image (WCAG 2.2.2) | `VideoAtmosphere.tsx:64-78` | Avant tout usage : conditionner `autoPlay` a `!prefersReducedMotion`, sinon supprimer l'orphelin |
| project-rules-1 | low | 5 fichiers >250 lignes (couche services/data, pas de JSX) | `services/learners.ts:387`, `services/exams.ts:366`, `data/mock/exams.ts:378`, `services/videos.ts:326`, `data/mock/videos.ts:310` | Scinder par domaine, OU acter dans CLAUDE.md que la limite vise les composants UI |
| project-rules-2 | low | Hex bruts dans `global-error`/`icon`/`opengraph-image` (justifies : hors @theme/Tailwind) | `global-error.tsx:16,42`, `icon.tsx:14`, `opengraph-image.tsx:17-21` | Aucune action requise ; eventuellement centraliser les hex dupliques commentes |
| deps-build-config-4 | low | README LMS obsolete (« Supabase pas connecte » faux) + mots de passe demo perimes (`demo2026`, comptes inexistants en base) | `la-cle-app/README.md:11,30,92,96-100` | Mettre a jour le README, retirer le tableau de mots de passe en clair |
| deps-build-config-5 | low | ESLint LMS plus permissif que vitrine (`no-explicit-any` non enforce, lint limite a `src/`) | `la-cle-app/eslint.config.mjs`, `package.json:9` | Ajouter `@typescript-eslint/no-explicit-any: 'error'`, etendre le scope de lint |

## 4. A trancher (incertains) — decision/info humaine requise (Etienne / Marien)

Ces findings n'ont **pas** pu etre verifies en lecture-seule de code car ils dependent de l'etat reel de la RLS/RPC en base (verification interdite dans ce perimetre, croiser avec `AUDIT_E2E.md`). Plusieurs portent une severite potentielle **critique/high** : ils sont prioritaires a confirmer.

| ID | Sev. potentielle | A trancher | Fichiers cles |
|----|------------------|------------|----------------|
| client-side-security-1 | **critical** | La RLS de `videos`/`cours`/`course_items`/`blocs` est-elle vraiment en `USING(true)` ? Si oui, tout authentifie peut lire le contenu et les `videos.src` des cours gates (cours 8+) sans paiement via la cle anon. | `module-access.ts:21-33`, `videos.ts:92-100`, migration 19 `rls_clean_and_lockdown.sql:79` |
| client-side-security-2 | **critical** | Les conditions d'inscription (contrat/CGV/paiement) sont lues depuis `localStorage` (falsifiables console). Le EnrollmentGate cours 8 est-il reellement contournable ? Stripe/contrat non branches. | `enrollment-gate.ts:23-49`, `useModuleAccess.tsx:34` |
| client-side-security-3 | **high** | Routes admin protegees 100% cote client (`useRequireAuth`), aucun guard serveur/middleware. La RLS `is_staff()` couvre-t-elle 100% des lectures admin ? | `admin/(dashboard)/layout.tsx:10`, `useRequireAuth.ts:21-30`, `supabase/middleware.ts` |
| client-side-security-4 | **high** | Test de positionnement (Qualiopi Ind.8) persiste uniquement en `localStorage`, aucune ecriture horodatee serveur → indicateur non auditable. Decision : brancher `positioning_results`. | `positioning.ts:238-247`, `positionnement/page.tsx`, `PositioningTest.tsx` |
| client-side-security-5 | medium | Onboarding/bilan d'accueil (Ind.4) idem `localStorage`, table `onboarding_results` existe non ecrite. | `onboarding.ts:205-215`, `espace/onboarding/page.tsx` |
| client-side-security-6 | **high** | `updateLearnerStatus` ecrit `enrollments` via cle anon mais aucune policy UPDATE n'existe → changement de statut admin **casse silencieusement** par la RLS. Verifier + deplacer en Server Action `service_role` ou ajouter policy `is_staff()`. | `learners.ts:344-359`, migration 19 |
| client-side-security-7 | medium | `vault_documents` en `SELECT USING(true)` : `file_url` lisible par tout authentifie en court-circuitant `learner_vault_view`. Risque reel si URLs publiques/devinables. | migration 19 `:124`, `vault.ts:68-83` |
| client-side-security-8 | low | Bonnes reponses du positionnement embarquees client (`correctAnswer` en clair) + scoring client. Acceptable si auto-evaluation non certifiante — a documenter ou deplacer serveur si Ind.8 doit etre fiable. | `positioning.ts:54-179` |
| legacy-residue-orphans-3 | medium | Interface `Student` orpheline (duplique `Learner`) entretient le sous-graphe mort `Module/Course/Capsule` + `Vault` + `EngagementTracking`. Supprimer `Student`, garder `Learner` canonique. | `types/student.ts`, `types/document.ts`, `types/engagement.ts` |
| a11y-perf-seo-3 | medium | `Input` derive l'`id` du label → ids dupliques possibles dans le CMS (plusieurs `Input label="Valeur"`) cassant `label htmlFor` (WCAG 4.1.1/1.3.1). | `Input.tsx:13`, `SiteContentEditor.tsx:106-110` |
| a11y-perf-seo-4 | low (abaissee) | `BackgroundAtmosphere` : 4 blobs animes en boucle sur toutes les pages. Premisse « recomposition blur continue » techniquement inexacte (transform-only/will-change/reduced-motion deja en place). Optimisation mineure, pas un defaut medium. | `BackgroundAtmosphere.tsx:155-157`, `layout.tsx:64` |
| a11y-perf-seo-6 | low | Home vitrine sans `metadata` propre (herite title generique) ; LMS sans `openGraph` (prive, mineur). Ajouter `export const metadata` dedie a la home. | `la-cle-institut/src/app/page.tsx:1-5`, `la-cle-app/src/app/layout.tsx:23-27` |

## 5. Faux positifs ecartes (transparence)

| ID | Titre | Pourquoi ecarte |
|----|-------|------------------|
| project-rules-3 | Hex brut dans `DSPalette` | Les hex sont de la **donnee documentaire** affichee en texte ; le rendu passe exclusivement par les classes `bg-*`. Aucun contournement du design system. |
| a11y-perf-seo-7 | Contraste placeholders/labels en `text-pierre` | Premisse fausse : `pierre = #8B857C` (pas `#6B665F`). Les labels passent (5.08–5.38:1 > 4.5:1). Les placeholders sont WCAG-toleres et non porteurs d'info (tous les champs ont un vrai label). |
| deps-build-config-2 | `.gitignore` LMS laisserait committer `.env`/`.env.production` | Le `.gitignore` racine `**/.env*` couvre recursivement tout. `git check-ignore` confirme que `.env`, `.env.production`, `.env.development` sont ignores. Aucun filet manquant. |
| deps-build-config-3 | Middleware sans redirection = gating client | **Architecture voulue et documentee** : confidentialite assuree par la RLS (cle anon), seul chemin `service_role` re-verifie `is_staff` serveur. Un non-auth sur `/admin` ne rend qu'une coquille vide. Reste un point de defense-en-profondeur (abaisse low), pas une vuln. |
| deps-build-config-6 | `rewrites()` vitrine : `console.warn` + proxy sans verrouillage | `console.warn` en config build (pas runtime client), pratique Next standard. `NEXT_PUBLIC_APP_URL` est controlee par l'operateur, pas un attaquant. Fallback fail-closed (`return []`). Benin. |

## 6. Plan de remediation propose

Distinction : **[FRONT]** = correction pur-code dans les apps ; **[DB/RLS]** = exige migration Supabase / Server Action / RPC (a croiser imperativement avec `AUDIT_E2E.md` en cours, qui detient la verite live). Effort : **S** (<2h), **M** (½–1j), **L** (>1j).

### Lot 0 — BLOQUANT : confirmer la grappe « securite client-only » (avant tout deploiement payant)
Priorite absolue. Ces points peuvent rendre le contenu payant accessible sans paiement et casser le parcours admin.
1. **[DB/RLS] Verifier la RLS de `videos`/`cours`/`course_items`/`blocs`** (client-side-security-1). Si `USING(true)` : restreindre par statut d'inscription via vue/RPC `SECURITY DEFINER` (modele `learner_vault_view`), masquer `videos.src` (URL signee a la demande). **Effort L.**
2. **[DB/RLS] Brancher les conditions d'inscription sur `enrollments`** au lieu de `localStorage` (client-side-security-2) ; cabler Stripe (webhook → `payment_transactions`/`enrollments.payment_status` en `service_role`) et la signature de contrat. Supprimer toute decision d'acces basee sur `localStorage`. **Effort L.**
3. **[DB/RLS] Reparer `updateLearnerStatus`** (client-side-security-6) : Server Action `is_staff` + `service_role`, ou policy `enrollments UPDATE is_staff()`. Auditer tous les services admin qui ecrivent sans policy d'ecriture. **Effort M.**
4. **[DB/RLS] Restreindre `vault_documents` SELECT** au staff (l'eleve passe par la vue) ou retirer `file_url` de la table de base ; garantir URL signee server-side (client-side-security-7). **Effort M.**
5. **[DB/RLS] Guard serveur du segment `/admin`** (middleware ou layout Server Component lisant `profiles.role`), en complement de la RLS (client-side-security-3). **Effort M.**

### Lot 1 — Conformite Qualiopi (persistance horodatee)
6. **[DB/RLS] Persister positionnement (Ind.8)** dans `positioning_results` (INSERT self/RPC) avec `completedAt` ; lire la completion depuis la base (client-side-security-4). **Effort M.**
7. **[DB/RLS] Persister onboarding (Ind.4)** dans `onboarding_results` (client-side-security-5). **Effort M.**
8. **[DB/RLS] (optionnel) Scoring positionnement serveur** si Ind.8 doit etre fiable/auditable (client-side-security-8). **Effort M.**

### Lot 2 — Durcissement securite & resilience front
9. **[FRONT] Headers de securite HTTP** dans les deux `next.config.ts` (HSTS, nosniff, X-Frame-Options/frame-ancestors, Referrer-Policy, CSP Report-Only) (deps-build-config-1). **Effort M.**
10. **[FRONT] try/catch + Toast** sur les `onClick` async admin via un helper d'action mutante partage (error-resilience-fallback-1 & -2). **Effort S–M.**
11. **[FRONT] `global-error.tsx` + `error.tsx`** de marque cote vitrine (error-resilience-fallback-3). **Effort S.**

### Lot 3 — Accessibilite (WCAG)
12. **[FRONT] `aria-live`** sur les statuts des formulaires vitrine (a11y-perf-seo-1). **Effort S.**
13. **[FRONT] `DataTable` accessible** : `<button>`/clavier, `aria-sort`, `scope="col"` (a11y-perf-seo-2). **Effort S.**
14. **[FRONT] `Input` id unique** via `useId()` prefixe/suffixe (a11y-perf-seo-3). **Effort S.**

### Lot 4 — Hygiene & dette (non bloquant)
15. **[FRONT] Supprimer `data/mock/`** sauf `demo-accounts.ts` (deplace vers `src/lib/`) (legacy-residue-orphans-1). **Effort S.**
16. **[FRONT] Trancher la dualite de types** : supprimer `Student` + modele nested orphelin, garder `Learner`/DTO plat canonique (legacy-residue-orphans-2 & -3). **Effort M.**
17. **[FRONT] Mettre a jour le README LMS**, retirer les mots de passe demo (deps-build-config-4). **Effort S.**
18. **[FRONT] Aligner ESLint LMS** (`no-explicit-any: error`, scope de lint) (deps-build-config-5). **Effort S.**
19. **[FRONT] Liens via `ROUTES`** (front-contract-consistency-3), `.gitignore` harmonise (secrets-env-leak-2), champ `nombreApprenants` (afficher ou retirer, front-contract-consistency-1), coercition `Number()` type-aware (front-contract-consistency-2), `VideoAtmosphere` (garde reduced-motion ou suppression, a11y-perf-seo-5), metadata home (a11y-perf-seo-6). **Effort S chacun.**
20. **[FRONT] (optionnel) BackgroundAtmosphere** : reduire blobs/blur ou ne monter que sur `/` (a11y-perf-seo-4) ; centraliser hex dupliques (project-rules-2) ; scinder fichiers >250 lignes ou amender CLAUDE.md (project-rules-1). **Effort S.**

> **Note de croisement** : les lots 0 et 1 (tous **[DB/RLS]**) ne doivent pas etre corriges a l'aveugle a partir de ce seul audit code. Ils doivent etre valides contre les resultats live de `AUDIT_E2E.md` (etat reel des policies, RPC, triggers) avant toute migration, pour eviter de durcir une regle deja correcte ou d'en casser une fonctionnelle.
