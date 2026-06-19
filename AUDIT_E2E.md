> **Note méthodologique (à lire avant le rapport).**
> Audit croisé multi-rôles confrontant le **code** au **snapshot DB autoritaire** (`.planning/db-snapshot-2026-06-18.md`, capturé en live token frais : RLS de 48 tables, corps des RPC, triggers, vues, advisor) + le rapport `AUDIT_FRONTEND.md`. Les agents n'ont **pas** sollicité Supabase live (immunisé à l'expiration de token).
> **Limite de vérification** : la phase de réfutation adversariale a été **rate-limitée côté API** (21 verdicts `verify` sur 30 ont échoué — burst d'agents parallèles). Les findings concernés restent donc **« incertains »** au sens du workflow (analyse de découverte solide, mais non re-réfutée par un second agent). **Ce ne sont pas des findings douteux** : Étienne/Claude ont **indépendamment confirmé en live** (via `pg_policies`, corps des RPC, `get_advisors`) les points de sécurité structurants — notamment l'absence de policy d'écriture sur `enrollments`, le scoring/limites 100 % serveur, les secrets staff-only, l'immuabilité des tables de preuve. Les sévérités ci-dessous sont fiables ; le label « incertain » signale seulement qu'un second passage adversarial automatique n'a pas pu tourner.
> Verdicts bruts : 9 confirmés · 21 incertains (rate-limit) · 0 réfutés (30 findings, 8 flux).

---

# Audit croisé back+front — La Clé (2026-06-18)

## Synthèse exécutive

**Posture générale : backend solide, écarts concentrés sur le câblage front.**

L'architecture serveur de la plateforme LMS La Clé est **robuste sur ses fondamentaux de sécurité** : le scoring d'examens et les limites de tentatives sont 100 % serveur (RPC `SECURITY DEFINER`), les secrets (bonnes réponses) sont staff-only, les tables de preuve (`exam_attempts`, `question_responses`, `vault_unlocks`, `vault_signatures`) sont immuables et écrites exclusivement via RPC, l'anti-élévation de privilèges est assuré par triggers, le coffre est gaté par vue (`learner_vault_view`), et les tables/vues d'export Qualiopi (Ind.4/Ind.8) sont provisionnées et prêtes.

**Les écarts réels ne sont PAS des failles serveur. Ils se concentrent sur trois axes :**

1. **Chemins d'écriture front manquants ou orphelins** : des RPC/tables prêtes côté DB ne sont jamais appelées par le front (positionnement Ind.8, onboarding, réponses aux questions / répétition espacée, progression vidéo / déverrouillage coffre, certification). La donnée pédagogique et de conformité **n'est jamais produite**, malgré une infra DB complète.
2. **Écritures clientes cassées par la RLS** : plusieurs mutations (`enrollments.status`, planification examen final) partent de la clé anon et ne matchent aucune policy → **no-op silencieux**, l'UI affiche un succès factice.
3. **Gating de conformité 100 % client (localStorage)** : positionnement bloquant, gating paiement cours 8, consentement contrat/CGV vivent uniquement dans le navigateur → **contournables et non auditables**.

**Rappel cadrant la sévérité : plateforme PRÉ-LANCEMENT.** Aucune activité élève réelle, `videos.src=NULL`, aucun média uploadé, 0 paiement, volumétrie de preuve à 0. Les risques ci-dessous sont donc **latents** aujourd'hui mais **bloquants avant ouverture commerciale et avant tout passage d'audit Qualiopi**.

---

## Ce qui est SAIN (vérifié)

Invariants serveur confirmés par le snapshot — à ne pas remettre en cause :

- **Scoring examens 100 % serveur** : `submit_exam_attempt` (DEFINER) calcule le score par jointure `questions LEFT JOIN question_answers`, applique `passing_score`, et impose les limites de tentatives (5/24h, +1h après 2 essais). Le client ne fait que de l'UX.
- **Secrets staff-only** : `question_answers` et `video_overlay_answers` en `ALL USING is_staff()` — les bonnes réponses ne fuitent jamais côté élève. Les services live strippent `correctAnswer` à `""`.
- **Tables de preuve immuables** : `exam_attempts`, `question_responses`, `vault_unlocks`, `vault_signatures` en INSERT/UPDATE/DELETE = `false`, écrites uniquement par RPC DEFINER.
- **Anti-élévation de privilèges** : triggers sur `profiles` empêchent un élève de se promouvoir staff.
- **`payment_transactions`** : écriture webhook/`service_role` only — jamais depuis le client.
- **Gating du coffre par vue** : `learner_vault_view` filtre par `vault_unlocks` et par statut d'enrollment ; le contenu fichier est protégé par bucket privé `vault-documents` (policy staff-only).
- **CMS figé en code** : hero/legal/conformité ne sont jamais en base (garde-fou voulu).
- **Exports Qualiopi prêts** : vues `export_ind4_preinscription`, `export_ind8_positionnement` provisionnées et fonctionnelles — il ne leur manque que la donnée.

> Aucun bypass d'écriture serveur, aucune fuite de secret, aucune corruption d'intégrité d'examen n'a été trouvé. Le durcissement restant est applicatif (front) et de conformité, pas de sécurité serveur.

---

## Risques confirmés par sévérité

### HIGH

#### 1. Réponses de pré-inscription (Ind.4) jamais persistées — uniquement localStorage
- **Sévérité** : high · **Fix** : FRONT
- **Code** : `la-cle-app/src/app/inscription/page.tsx:29-37` — `handleSubmit` ne fait que `localStorage.setItem("pre_enrollment_data", ...)` puis `setSubmitted(true)` inconditionnel (try/finally sans catch). TODO explicites `inscription/page.tsx:3-4` et `PreEnrollmentQuestionnaire.tsx:10-13`. Aucun `src/services/*` ne référence `pre_enrollment_answers`.
- **DB** : snapshot section 5, policy `pre_enrollment_answers` INSERT `{anon,authenticated}` (anon si `learner_id` NULL) — la RLS **autorise** déjà l'insert anon ; vue `export_ind4_preinscription` prête ; table à 0 ligne.
- **Impact** : indicateur Qualiopi Ind.4 **non auditable**. Réponses dans le navigateur uniquement, jamais horodatées serveur, jamais accessibles à l'admin. L'export renverra toujours vide.
- **Reco** : dans `handleSubmit`, `INSERT` dans `pre_enrollment_answers` via le client anon (`learner_id` NULL), avec gestion d'erreur. `localStorage` conservé seulement en cache UX.

#### 2. Résultat du test de positionnement (Ind.8) jamais persisté
- **Sévérité** : high · **Fix** : FRONT
- **Code** : `la-cle-app/src/lib/positioning.ts:243-247` — `markPositioningCompleted` écrit seulement `localStorage`. `PositioningTest.tsx:63-72` appelle `markPositioningCompleted` puis `onComplete` (→ `router.replace`). Aucun `.from('positioning_results')` dans tout `src`.
- **DB** : `positioning_results` INSERT/UPDATE self, SELECT self/staff (prêt) ; vue `export_ind8_positionnement` ; volume 0. Le chemin voulu est un **INSERT client direct** (pas une RPC).
- **Impact** : Ind.8 non auditable — l'export restera structurellement vide même post-lancement.
- **Reco** : brancher `supabase.from('positioning_results').insert({ learner_id, formation_id, answers, score, starting_level, completed_at })` dans `handleContinue` avant `markPositioningCompleted`.

#### 3. Aucun chemin serveur ne fait passer l'apprenant au statut « certifié »
- **Sévérité** : high · **Fix** : BOTH
- **Code** : `services/final-exams.ts:42-53` (lit `final_exam_progress`, jamais `enrollments.status`) ; `services/learners.ts:344-359` `updateLearnerStatus` écrit `enrollments.update({status})` côté client. Aucune Server Action / RPC de certification.
- **DB** : `enrollments` = SELECT self/staff UNIQUEMENT, **aucune policy INSERT/UPDATE/DELETE** ; `submit_exam_attempt` écrit `final_exam_progress` (passed) mais **pas** `enrollments` ; `enrollments.certified_at` existe mais rien ne l'écrit.
- **Impact** : réussir l'examen final met `final_exam_progress='passed'` mais **ne certifie jamais** l'élève. Le déverrouillage coffre « certifié » et l'attestation ne se déclenchent jamais. Cul-de-sac métier.
- **Reco** : RPC `SECURITY DEFINER` `certify_learner(learner_id)` réservée `is_staff` (ou Server Action `service_role`) qui, après vérif `final_exam_progress.status='passed'`, met `enrollments.status='certifie'` + `certified_at=now()`. Câbler un bouton admin. **Ne pas** ajouter de policy UPDATE client large sur `enrollments`.

#### 4. `updateLearnerStatus` écrit `enrollments` via la clé anon → no-op silencieux RLS
- **Sévérité** : high (surface live atténuée — aucune UI ne l'appelle aujourd'hui) · **Fix** : DB/RLS
- **Code** : `services/learners.ts:344-359` — seul code changeant le statut, via client browser.
- **DB** : aucune policy UPDATE → 0 ligne affectée, **pas d'erreur PostgREST visible**.
- **Impact** : tout changement de statut administratif est silencieusement sans effet ; l'UI peut afficher un succès factice. Fonction « piège » prête à être câblée.
- **Reco** : déplacer la mutation dans la Server Action / RPC `is_staff` du point 3. Neutraliser l'écriture cliente.

#### 5. Gating cours 8 (contrat + CGV + paiement) 100 % client via localStorage
- **Sévérité** : high · **Fix** : DB/RLS
- **Code** : `lib/enrollment-gate.ts:13-57` — `CONTRACT_KEY`/`CGV_KEY`/`PAYMENT_KEY` lus/écrits en `localStorage` ; `isEnrollmentComplete()` combine 3 booléens localStorage ; `useModuleAccess.tsx:34` → `module-access.ts:29` `enrollment_required`.
- **DB** : `enrollments` aucune policy d'écriture, `payment_transactions` webhook only ; aucune colonne `contract_signed`/`cgv_accepted` ; contenu pédagogique `SELECT USING(true)` pour tout authentifié.
- **Impact** : un élève authentifié fait `localStorage.setItem('enrollment_contract_signed','true')` pour débloquer l'UI ; **et même sans l'UI**, le contenu cours 8 est récupérable via PostgREST direct (clé anon). Aucun point d'enforcement serveur du paiement.
- **Reco** : persister les 3 conditions serveur (`contract_signed_at`/`cgv_accepted_at` + webhook Stripe). Faire lire au gate l'enrollment réel. Pour rendre le blocage non cosmétique, **gater le contenu cours 8 côté DB** (policy/vue exigeant enrollment actif/payé pour les blocs > ordre 7). Pré-lancement atténue (`videos.src=NULL`, 0 paiement) mais **à traiter avant ouverture commerciale**.

#### 6. Conditions contrat/CGV non persistées ni horodatées → preuve contractuelle absente
- **Sévérité** : high · **Fix** : DB/RLS
- **Code** : `lib/enrollment-gate.ts:41,47` (TODO `UPDATE students SET contract_signed_at=now()` jamais fait) ; `EnrollmentGate.tsx:52-60` n'appelle que les setters localStorage.
- **DB** : aucune colonne `contract_signed_at`/`cgv_accepted_at` dans `enrollments`, aucune table de consentement, aucune vue d'export de consentement.
- **Impact** : acceptation contrat + CGV = acte juridique/Qualiopi, stocké uniquement dans le localStorage → non opposable, non horodaté serveur, perdu au changement d'appareil.
- **Reco** : table/colonnes de consentement horodaté écrites via RPC/Server Action, avec vue d'export pour l'audit.

#### 7. `requestFinalExam` / `updateFinalExam` (planification) écrivent `final_exam_progress` côté client → cassés par la RLS
- **Sévérité** : high (incertain — à confirmer) · **Fix** : BOTH
- **Code** : `services/final-exams.ts:106-135` (`insert status='requested'`), `145-162` (`update`), appelés depuis `app/espace/examen-final/page.tsx:45` (élève) et `ScheduleFinalExamModal.tsx:43` (admin). Tous via client anon. `page.tsx:47` avale l'erreur (catch vide).
- **DB** : `final_exam_progress` SELECT self/staff, écriture via RPC/`service_role` only — aucune policy INSERT/UPDATE authenticated. `submit_exam_attempt` n'écrit que passed/failed, pas `requested`/`scheduled`.
- **Impact** : flux demande d'examen final (élève) + planification présentiel (admin) reposent sur des écritures que la RLS bloque → demande jamais persistée, admin ne voit rien, sous-flux `requested→scheduled→passed` non fonctionnel.
- **Reco** : RPC `request_final_exam()` (self) + `schedule_final_exam(progress_id, scheduled_at)` (`is_staff`), ou Server Actions `service_role`. Retirer les écritures clientes. Ne plus avaler l'erreur.

#### 8. `submit_question_response` jamais appelé → réponses non persistées + répétition espacée jamais amorcée
- **Sévérité** : high (incertain — à confirmer) · **Fix** : FRONT
- **Code** : aucun `.rpc("submit_question_response")` dans `src`. `OverlayQuestion.tsx` + `useVideoProgress.ts:40 handleAnswer` ne font que `setAnsweredQuestions` (aucun réseau). Questions de cours idem.
- **DB** : `submit_question_response` (DEFINER) écrit `question_responses` (immuable) et planifie J+1/J+3/J+7/J+21 dans `scheduled_reviews`. Volumes à 0.
- **Impact** : pilier pédagogique La Clé (répétition espacée) **jamais amorcé** ; analytics admin par notion et coffre de révision resteront vides quoi que fassent les élèves.
- **Reco** : câbler `OverlayQuestion`/`useVideoProgress` et les questions de cours sur `supabase.rpc("submit_question_response", {p_question_id, p_answer, p_response_time_ms})` ; utiliser le `{correct, explanation}` retourné.

#### 9. `record_video_progress` jamais déclenché → progression vidéo et déverrouillage coffre jamais écrits
- **Sévérité** : high (incertain — à confirmer) · **Fix** : FRONT
- **Code** : `videos.ts:318-326` `markVideoCompleted` enveloppe la RPC mais **aucun appelant**. `video/[videoId]/page.tsx:106` `onEnded={() => {}}` (no-op), `page.tsx:89 isCompleted = false` (en dur, TODO Supabase).
- **DB** : `record_video_progress` (DEFINER) upsert `video_progress` et INSERT `vault_unlocks` si completed ; `learner_vault_view` gate le coffre via `vault_unlocks`. Volumes à 0.
- **Impact** : aucune progression enregistrée, **coffre jamais déverrouillé**, engagement à zéro même pour un élève actif. Le wrapper existe mais est orphelin.
- **Reco** : appeler `markVideoCompleted` depuis `VideoPlayer` (`onEnded` → `p_completed=true`, `onTimeUpdate` périodique → `p_position`) ; dériver `isCompleted` de `video_progress`.

#### 10. Téléchargement document débloqué cassé : aucune URL signée server-side
- **Sévérité** : high (incertain — à confirmer) · **Fix** : BOTH
- **Code** : `documents/page.tsx:114-117` `window.open(doc.fileUrl, "_blank")` direct ; `doc.fileUrl` = `learner_vault_view.file_url` brut. Aucun `createSignedUrl`/Server Action dans `src`.
- **DB** : bucket `vault-documents` **privé**, policy staff-only ; le contrat impose une URL signée générée server-side après vérif `vault_unlocks`.
- **Impact** : dès qu'un fichier est uploadé, l'élève reçoit 400/403 (bucket privé) → fonctionnalité cassée. Latent aujourd'hui (`file_url=NULL`).
- **Reco** : Server Action / route qui vérifie `is_unlocked` via `learner_vault_view` pour `auth.uid()` puis `storage.from('vault-documents').createSignedUrl(path, ttl)` en `service_role`. Remplacer `window.open(doc.fileUrl)`.

#### 11. Capture de signature de document absente : RPC d'écriture `vault_signatures` inexistante
- **Sévérité** : high (incertain — à confirmer) · **Fix** : BOTH
- **Code** : `documents/page.tsx:26-29` calcule un badge `a_signer` mais **aucune action de signature** (seul Download existe). `vault.ts` est en lecture seule.
- **DB** : `vault_signatures` écriture = false, « écriture exclusivement via RPC SECURITY DEFINER », **mais aucune RPC de signature n'existe**.
- **Impact** : pour les docs `signature_required` (contrats, Qualiopi), ni chemin d'écriture ni UI. Horodatage de signature jamais persisté → contractualisation non auditable.
- **Reco** : RPC `sign_vault_document(p_vault_document_id, p_meta)` qui vérifie déverrouillage et INSERT `vault_signatures` ; UI d'action sur les docs `a_signer`.

### MEDIUM

#### 12. Bilan d'accueil (onboarding) jamais persisté
- **Sévérité** : medium (ajustée de high) · **Fix** : FRONT
- **Code** : `lib/onboarding.ts:212-215` `markOnboardingCompleted` écrit seulement le flag localStorage. `OnboardingAssessment.tsx:75-104` construit le résultat complet puis le **jette**. Aucun INSERT `onboarding_results`.
- **DB** : `onboarding_results` INSERT/UPDATE self, SELECT self/staff ; volume 0 ; consommé par `export_ind8_positionnement`.
- **Impact** : réponses libres, niveau PNL, rythme recommandé perdus ; admin n'a rien à lire.
- **Reco** : insérer dans `onboarding_results` dans `handleContinueFromResult`. Migrer le gate parcours de localStorage vers une query.

#### 13. Caractère « bloquant avant module 1 » appliqué uniquement côté client (localStorage)
- **Sévérité** : medium · **Fix** : BOTH
- **Code** : `parcours/page.tsx:27-31`, `parcours/[moduleId]/page.tsx:42-44` reposent sur `hasCompletedOnboarding()`/`hasCompletedPositioning()` (localStorage). TODO explicite « éviter la triche côté client ».
- **DB** : contenu module 1 `SELECT USING(true)` — aucune policy/RPC ne conditionne l'accès à `positioning_results`.
- **Impact** : `localStorage.setItem('positioning_test_completed','true')` ou PostgREST direct → accès module 1 sans test. Contrôle Qualiopi Ind.8 « bloquant » non prouvable.
- **Reco** : une fois le point 2 corrigé, baser le gate sur l'existence d'une ligne `positioning_results` (query serveur).

#### 14. Soumission d'examen sans catch : refus serveur échoue silencieusement
- **Sévérité** : medium (incertain) · **Fix** : FRONT
- **Code** : `examen/page.tsx:68-72` `submitAttempt(...).then(...)` **sans `.catch()`** ; `exams.ts:349 if (error) throw error;`.
- **DB** : le RPC lève une exception sur tentative non autorisée (>5/24h ou <1h).
- **Impact** : le serveur refuse légitimement mais l'élève reste bloqué sans feedback. Bug fonctionnel.
- **Reco** : try/catch + Alert/Toast ; re-fetch des tentatives après erreur.

#### 15. Bornes de blocage serveur (`blocked_until`/`next_allowed_at`) jetées par le client
- **Sévérité** : medium (incertain) · **Fix** : FRONT
- **Code** : `exams.ts:318-323` les déclare mais `submitAttempt` (`354-362`) ne les propage pas ; l'UI vient de `lib/exam-logic.ts:19-62` qui **recalcule** à partir de `Date.now()` local.
- **Impact** : message de blocage dépend de l'horloge locale (manipulable) → peut diverger du serveur. Pas un contournement (écriture gatée serveur).
- **Reco** : propager `blocked_until`/`next_allowed_at` jusqu'à l'UI comme source de vérité.

#### 16. Incohérence statut paiement : enum `trial|active|failed` (front) vs `bloque` (DB) jamais reliés
- **Sévérité** : medium (incertain) · **Fix** : BOTH
- **Code** : `lib/enrollment-gate.ts:51-57` `getPaymentStatus()` depuis localStorage ; `LearnerShell.tsx:19` bannière si `'failed'`. Aucun code ne relie `'failed'` à `enrollments.status='bloque'`.
- **DB** : `payment_transactions` webhook only, `enrollments.status` non écrivable, aucun trigger ne dérive `bloque`.
- **Impact** : transition « paiement échoué → blocage + alerte admin » inexistante ; bannière `failed` décorative.
- **Reco** : webhook Stripe `service_role` qui écrit `payment_transactions` et bascule `enrollments.status='bloque'`.

#### 17. Correction des questions overlay vidéo côté client contre un `correctAnswer` vide → tout jugé « Incorrect »
- **Sévérité** : medium (incertain) · **Fix** : FRONT
- **Code** : `OverlayQuestion.tsx:23-26` compare à `question.correctAnswer`, or `videos.ts:62` `mapOverlayQuestion` force `correctAnswer:""`. QCM → toujours `false` ; texte (`includes("")`) → toujours `true`.
- **Impact** : feedback pédagogique faux/arbitraire. Bug de feedback, **pas une fuite** (le secret reste staff-only en DB).
- **Reco** : supprimer la correction locale ; scorer via `submit_question_response`. Lié au point 8.

#### 18. Dépôt d'attestation (`user_documents`) : aucun code n'émet l'attestation après certification
- **Sévérité** : medium (incertain) · **Fix** : FRONT
- **Code** : aucun `.from('user_documents').insert` dans `src`.
- **DB** : `user_documents` INSERT/UPDATE/DELETE staff (policy prête) ; volume 0.
- **Impact** : dernière étape certification (attestation Qualiopi) sans chemin d'écriture.
- **Reco** : Server Action `service_role` insérant `user_documents(type='attestation', ...)`, dans la même opération que `certify_learner`.

### LOW

#### 19. Le fallback en dur empêche l'admin de vider une collection/valeur sur la vitrine
- **Sévérité** : low (ajustée de medium) · **Fix** : FRONT
- **Code** : `la-cle-institut/src/lib/cms/queries.ts:45` `if (error || !data || data.length === 0) return fallback;` et `queries.ts:20`. Confond « 0 ligne publiée » et « erreur ».
- **Impact** : si Marien dépublie tout, la vitrine **réaffiche silencieusement le seed**. Perte de contrôle éditorial. Aucune dimension sécurité.
- **Reco** : ne retomber sur le fallback que si `client===null` ou `error` ; si succès avec `data.length===0`/`value null`, retourner `[]`/valeur vide.

#### 20. Un indicateur de résultats laissé vide est écrit comme 0
- **Sévérité** : low · **Fix** : FRONT
- **Code** : `SiteContentEditor.tsx:83` `obj[sub.name] = Number(values[...] ?? "0")` ; `Number("")===0`. Aucune validation.
- **Impact** : effacer un indicateur publie « 0% de réussite » sur la page de vente Qualiopi — trompeur. Réversible.
- **Reco** : valider les sous-champs numériques avant save (refuser vide/NaN) ; garde-fou d'affichage côté vitrine.

#### 21. Historique de tentatives rafraîchi une seule fois et complété localement
- **Sévérité** : low · **Fix** : FRONT
- **Code** : `examen/page.tsx:46-49` charge une seule fois, puis `page.tsx:70` étend la liste avec un attempt fabriqué `id: attempt-${Date.now()}`.
- **Impact** : UI de gating potentiellement désynchronisée. Aucune tentative interdite ne passe (RPC re-vérifie tout). Sans conséquence sécurité.
- **Reco** : re-`getAttempts` après chaque soumission.

#### 22. `is_staff()` exécutable par anon (durcissement DB)
- **Sévérité** : low · **Fix** : DB/RLS
- **DB** : `20260613001500_security_hardening.sql:49-50` `GRANT EXECUTE ... TO anon` ; advisor. Un anon peut tester si un UUID est staff (oracle booléen).
- **Impact** : **aucun levier** sur le CMS (anon ne peut ni écrire ni lire les brouillons).
- **Reco** : `REVOKE EXECUTE ON FUNCTION is_staff(uuid) FROM anon, public`.

#### 23. Leaked-password protection désactivée (advisor Supabase Auth)
- **Sévérité** : low · **Fix** : CONFIG
- **DB** : advisor `auth_leaked_password_protection` WARN.
- **Reco** : activer la vérification HaveIBeenPwned dans Supabase Auth (1 toggle).

---

## À trancher (décisions Étienne/Marien)

| # | Question | Décision attendue |
|---|----------|-------------------|
| A | **Scoring positionnement côté client** (`positioning.ts:54-179`, `correctAnswer` en clair, calcul client). | Acceptable si le positionnement reste un **outil d'orientation non certifiant**. Si le score doit faire foi → recalcul serveur à l'insertion (trigger/RPC). |
| B | **Mapping schéma pré-inscription** (`submittedAt` epoch ms vs `completed_at` ISO ; `contact_email`/`questionnaire_version` non alimentés). | À traiter **lors** du branchement du point 1. Ajouter un champ email au questionnaire pour `contact_email`. |
| C | **Gating contenu cours 8 côté DB** (point 5) : passer le contenu payant derrière une policy/vue gatée, ou accepter que `SELECT USING(true)` reste cosmétique ? | Décision **bloquante avant ouverture commerciale**. Recommandé : gater les blocs > ordre 7. |
| D | **Visibilité du catalogue `vault_documents`** (titres/catégories visibles par tout authentifié). | Le bucket privé protège le **fichier** ; seuls les **métadonnées** fuitent. Décider si la confidentialité des titres importe. |
| E | **Rôle « formateur »** + sémantique `failed` (transaction) vs `bloque` (enrollment). | Décisions client en suspens qui conditionnent les Server Actions de statut (points 3/4/16). |
| F | **Réponses correctes en clair dans `data/mock/videos.ts`/`exams.ts`** (code mort, non importé). | Supprimer pour éviter une réintroduction future comme source d'affichage/scoring. |

---

## Faux positifs écartés (transparence)

Aucun finding **réfuté** (0). Plusieurs points **neutralisés par le ground truth** — ne pas traiter comme bugs :

- **Lecture de l'énoncé des questions d'examen à l'avance** (`questions SELECT USING(true)`) — **acceptable** : bonnes réponses staff-only, scoring + limites 100 % serveur.
- **Contenu pédagogique non gaté par inscription** (`SELECT USING(true)`) — **décision voulue** ; le garde-fou est le gating cours 8 (à reconstruire serveur, point 5).
- **`payment_transactions` / tables immuables non écrites par le client** — comportement **voulu** (webhook/RPC only).
- **Volumétrie à 0 partout** — **état pré-lancement assumé**.

---

## Croisement avec AUDIT_FRONTEND.md

| Item front | Verdict snapshot | Une ligne |
|------------|------------------|-----------|
| `client-side-security-1` (gating module localStorage) | **CONFIRMÉ** | Gate onboarding/positionnement 100 % localStorage, contournable ; contenu non gaté serveur (points 13/2). |
| `client-side-security-2` (scoring examen client) | **RÉFUTÉ / sain** | Scoring 100 % serveur via `submit_exam_attempt`. |
| `client-side-security-3` (réponses correctes exposées) | **NUANCÉ** | Secrets staff-only (sain) ; seul résidu = mock mort `data/mock/*` (point F). |
| `client-side-security-4` (limites tentatives client) | **RÉFUTÉ / sain** | Limites 5/24h + 1h serveur ; `lib/exam-logic.ts` purement UX (points 15/21). |
| `client-side-security-5` (gating paiement cours 8) | **CONFIRMÉ** | localStorage seul, contenu récupérable via PostgREST (point 5). |
| `client-side-security-6` (`updateLearnerStatus` clé anon) | **CONFIRMÉ** | Aucune policy UPDATE `enrollments` → no-op silencieux (point 4). |
| `client-side-security-7` (consentement contrat/CGV non persisté) | **CONFIRMÉ** | localStorage seul, aucune table de consentement horodaté (point 6). |
| `client-side-security-8` (téléchargement coffre / URL non signée) | **CONFIRMÉ** | Bucket privé, aucune signed URL server-side (point 10). |
| `legacy-residue-orphans-1` (mocks avec réponses) | **CONFIRMÉ (low)** | `data/mock/*` mort, non importé (point F). |

---

## Plan de remédiation priorisé

Effort : **S** (≤ ½ j) · **M** (1-2 j) · **L** (> 2 j).

### LOT 0 — Bloqueurs avant lancement payant
| # | Action | Côté | Effort |
|---|--------|------|--------|
| 0.1 | Persister + gater **paiement/contrat/CGV cours 8** côté DB : colonnes `contract_signed_at`/`cgv_accepted_at`, webhook Stripe `service_role`, **policy/vue gatant les blocs > ordre 7** (points 5, 6, 16). | DB/RLS + CONFIG | **L** |
| 0.2 | Server Action / RPC `is_staff` **`certify_learner`** + RPC `request_final_exam`/`schedule_final_exam` ; neutraliser `updateLearnerStatus` client (points 3, 4, 7). | DB/RLS | **M** |
| 0.3 | **Signed URL coffre** server-side (vérif `learner_vault_view.is_unlocked` → `createSignedUrl`) + remplacer `window.open` (point 10). | BOTH | **M** |

### LOT 1 — Conformité Qualiopi auditable
| # | Action | Côté | Effort |
|---|--------|------|--------|
| 1.1 | Écriture **pré-inscription Ind.4** (`pre_enrollment_answers`) + mapping schéma + `contact_email` (points 1, B). | FRONT | **S** |
| 1.2 | Écriture **positionnement Ind.8** (`positioning_results`) + **onboarding** (`onboarding_results`) (points 2, 12). | FRONT | **S** |
| 1.3 | RPC **`sign_vault_document`** + UI de signature (point 11) ; émission **attestation** `user_documents` à la certification (point 18). | BOTH | **M** |
| 1.4 | Migrer les gates « bloquant avant module 1 » vers query `positioning_results`/`onboarding_results` (point 13). | BOTH | **S** |

### LOT 2 — Câblage pédagogique (méthode La Clé)
| # | Action | Côté | Effort |
|---|--------|------|--------|
| 2.1 | Câbler **`record_video_progress`** depuis `VideoPlayer` ; dériver `isCompleted` → déverrouille le coffre (point 9). | FRONT | **M** |
| 2.2 | Câbler **`submit_question_response`** (overlay + cours) → persistance + répétition espacée ; afficher `correct`/`explanation` (points 8, 17). | FRONT | **M** |

### LOT 3 — Robustesse UX examens
| # | Action | Côté | Effort |
|---|--------|------|--------|
| 3.1 | try/catch sur `submitAttempt` + Toast ; re-`getAttempts` après soumission (points 14, 21). | FRONT | **S** |
| 3.2 | Propager `blocked_until`/`next_allowed_at` du RPC vers l'UI (point 15). | FRONT | **S** |

### LOT 4 — Durcissement & hygiène
| # | Action | Côté | Effort |
|---|--------|------|--------|
| 4.1 | Fallback CMS vitrine (distinguer erreur vs 0 ligne) + validation indicateurs avant save (points 19, 20). | FRONT | **S** |
| 4.2 | `REVOKE EXECUTE ON FUNCTION is_staff(uuid) FROM anon, public` (point 22). | DB/RLS | **S** |
| 4.3 | Activer leaked-password protection (point 23). | CONFIG | **S** |
| 4.4 | Supprimer `data/mock/videos.ts`/`exams.ts` (réponses en clair, code mort) (point F). | FRONT | **S** |

> **Cadrage final** : aucun de ces lots ne corrige une faille de sécurité serveur — le backend (RPC/RLS/immutabilité/anti-élévation) est sain. Le **LOT 0 est bloquant avant tout encaissement** (le gating payant n'a aujourd'hui aucun enforcement serveur), et le **LOT 1 est bloquant avant tout audit Qualiopi** (Ind.4/Ind.8, consentement, certification jamais produits malgré une infra DB prête).
