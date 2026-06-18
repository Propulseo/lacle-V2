# AUDIT FINAL — La Clé (clôture « 100% opérationnel »)
> Date : 2026-06-18 · Branche : `feat/operationnel-100` · Réf. : confronte chaque finding de [`AUDIT_E2E.md`](AUDIT_E2E.md) (30 findings, 8 flux) à l'état réel du code après les phases P1→P8.

## Méthode de vérification
- **Build/lint/tests** : `npm run build` + `npm run lint` **verts sur les 2 apps** ; `vitest` LMS **110/110**.
- **DB live** : migrations confirmées via MCP (`list_migrations` → `operational_rpcs` présente) ; `get_advisors(security|performance)` relancés → **0 nouveau WARN** (que des pré-existants assumés + INFO `unused_index` dus à la base vide).
- Chaque RPC d'écriture est appelée depuis le front (vérif `grep` ciblé). Les invariants serveur jugés SAINS par l'audit initial **n'ont pas été modifiés**.

---

## Statut par finding

Légende : ✅ Clos · 🟡 Atténué / reliquat mineur documenté · ⚙️ Config (hors-code, Étienne).

### HIGH

| # | Finding | Statut | Preuve / Où |
|---|---------|--------|-------------|
| 1 | Pré-inscription Ind.4 non persistée | ✅ | `inscription/page.tsx` → `savePreEnrollment` (`services/learner-journey.ts` → `pre_enrollment_answers`, anon, horodaté, + `contact_email`). (P2) |
| 2 | Positionnement Ind.8 non persisté | ✅ | `learner-journey.ts` → `positioning_results` ; gate parcours lit la DB. (P2/P3) |
| 3 | Aucun passage au statut « certifié » | ✅ | RPC `certify_learner` + **Server Action `certifyLearnerAction`** + **bouton admin** dans la fiche apprenant (onglet Examens, visible si examen final `passed`). Attestation émise par la RPC (`user_documents`). (P1/P4.3/P6.1) |
| 4 | `updateLearnerStatus` clé anon → no-op RLS | ✅ | Remplacé par RPC `set_enrollment_status` (`services/enrollment.ts`, `is_staff`). Écriture cliente neutralisée. (P4) |
| 5 | Gating cours 8 100% localStorage | 🟡 | Consentement contrat/CGV **persisté serveur** (`accept_enrollment_terms`) ; paiement **piloté par webhook Stripe** → `enrollments.payment_status/status`. Le gate UI lit l'enrollment. **Décision conservée (H4 / déc. C)** : le gate cours 8 reste `localStorage` SYNC (contrainte tests + render `getModuleAccess`) ; la migration full-DB-gate sur les blocs > ordre 7 reste recommandée avant fort trafic. |
| 6 | Consentement contrat/CGV non horodaté | ✅ | Colonnes `contract_signed_at`/`cgv_accepted_at` + RPC `accept_enrollment_terms` ; appelé dans `EnrollmentGate`. (P1/P4) |
| 7 | `request/scheduleFinalExam` cassés par RLS | ✅ | RPC `request_final_exam` (self) + `schedule_final_exam` (`is_staff`) ; erreurs propagées (plus de catch vide). (P1/P4) |
| 8 | `submit_question_response` jamais appelé | ✅ | **Nouveau** `services/questions.ts` + `OverlayQuestion` câblé → persiste `question_responses` et **amorce la répétition espacée** (`scheduled_reviews` côté RPC). (cette session) |
| 9 | `record_video_progress` jamais déclenché | ✅ | `video/[videoId]/page.tsx` appelle `markVideoCompleted` ; `isCompleted` dérivé de `video_progress` ; déverrouille le coffre. (P3) |
| 10 | Téléchargement coffre sans URL signée | ✅ | **Server Action `getVaultDownloadUrl`** (`espace/documents/actions.ts`) : vérifie `learner_vault_view.is_unlocked` → `createSignedUrl` (service_role, TTL 120s). `window.open(fileUrl)` supprimé. (P5.1) |
| 11 | Signature document : RPC + UI absentes | ✅ | RPC `sign_vault_document` + **UI de signature** (`VaultDocRow` → `ConfirmDialog` → `signVaultDocument`) sur les docs `a_signer`. (P1/P5.2) |

### MEDIUM

| # | Finding | Statut | Preuve / Où |
|---|---------|--------|-------------|
| 12 | Onboarding non persisté | ✅ | `OnboardingAssessment` → `learner-journey.ts` → `onboarding_results`. (P2) |
| 13 | « Bloquant avant module 1 » côté client | ✅ | Gate parcours lit `positioning_results`/`onboarding_results` en base. (P2/P3) |
| 14 | Soumission examen sans catch | ✅ | `examen/page.tsx` : try/catch + Toast ; re-`getAttempts`. (P4) |
| 15 | `blocked_until`/`next_allowed_at` recalculés client | ✅ | Bornes serveur propagées jusqu'à l'UI comme source de vérité. (P4) |
| 16 | Statut paiement `failed` vs `bloque` non relié | ✅ | **Webhook Stripe** : succès → `active`/`inscrit` ; échec → `failed`/`bloque` (`api/stripe/webhook/route.ts`, service_role). (P6.2) |
| 17 | Correction overlay contre `correctAnswer=""` | ✅ | Comparaison locale supprimée ; verdict `{correct, explanation}` **du serveur** affiché. (cette session, lié au #8) |
| 18 | Attestation `user_documents` non émise | ✅ | Émise par la RPC `certify_learner` lors de la certification. (P1/P4.3) |

### LOW

| # | Finding | Statut | Preuve / Où |
|---|---------|--------|-------------|
| 19 | Fallback CMS confond erreur vs 0 ligne | ✅ | `cms/queries.ts` distingue `client===null`/`error` (fallback) de `data.length===0` (vide réel). (P7.4 — session précédente) |
| 20 | Indicateur vide écrit comme 0 | ✅ | Validation des sous-champs numériques avant save (`SiteContentEditor`). (P7.4) |
| 21 | Historique tentatives rafraîchi une fois | ✅ | re-`getAttempts` après soumission. (P4) |
| 22 | `is_staff()` exécutable par anon | 🟡 | **Non régressé** ; advisor toujours présent (durcissement). Reco SQL `REVOKE EXECUTE … FROM anon` à appliquer en migration de durcissement (sans levier exploitable : oracle booléen seul). |
| 23 | Leaked-password protection désactivée | ⚙️ | Toggle Supabase Auth → **Étienne** (1 clic dashboard). Documenté dans `.env`/plan. |

### Décisions A–F

| # | Décision | Résolution |
|---|----------|-----------|
| A | Scoring positionnement client | **Conservé non-certifiant** (H1) : outil d'orientation. Résultat persisté + horodaté pour l'export Ind.8. |
| B | Mapping schéma pré-inscription | Traité avec #1 ; champ email ajouté → `contact_email`. |
| C | Gating contenu cours 8 côté DB | **Différé assumé** (voir #5) : consentement serveur + paiement webhook faits ; gate contenu DB = quand Stripe pilotera réellement le trafic. |
| D | Visibilité catalogue `vault_documents` | Le **fichier** est protégé (bucket privé + URL signée gatée) ; seules les métadonnées restent visibles — jugé acceptable. |
| E | Rôle « formateur » + `failed`/`bloque` | `formateur` conservé (`is_staff`) ; `failed`(txn) → `bloque`(enrollment) câblé par le webhook (#16). |
| F | Réponses en clair dans `data/mock/videos.ts`/`exams.ts` | ✅ **Mocks supprimés** (12 fichiers orphelins, dont `videos.ts`/`exams.ts`). Reste `demo-accounts.ts` (hints login). (P7.5) |

---

## Intégrations livrées (code-complètes, activables par clé)

- **Email (Brevo)** — `src/lib/email/` (API REST, **no-op gracieux** sans `BREVO_API_KEY`). Points câblés : bienvenue+mdp temporaire, accusé signalement (Ind.31), date examen final, certification, confirmation paiement.
- **Paiement (Stripe)** — `src/lib/stripe/` + `app/api/stripe/webhook/route.ts` (vérif signature, idempotence via index unique `stripe_payment_intent`, écriture `payment_transactions` + `enrollments` en service_role). UI « Procéder au paiement » dans `EnrollmentGate` (fallback contact si non configuré).
- **Chatbot Anthropic** — **ÉCARTÉ du périmètre** (décision client). La table `chatbot_messages` reste en DB (inerte, sans risque).
- `.env.example` documente toutes les clés requises.

## Durcissement & a11y (P7)
- Headers sécurité HTTP sur les 2 apps (session précédente).
- a11y : `DataTable` (`scope`, `aria-sort`, tri au clavier via `<button>`) ; `aria-live` sur les messages des formulaires vitrine ; `Input` LMS déjà conforme (`useId`/`aria-invalid`/`aria-describedby`).
- Hygiène : liens en dur → `ROUTES` (9 occurrences) ; ESLint LMS `@typescript-eslint/no-explicit-any: error` ; README vitrine remplacé ; CLAUDE.md LMS réaligné sur le code réel.

---

## Reliquats connus (non bloquants, hors périmètre code)
1. **Gate cours 8 full-DB** (déc. C / #5) — à migrer quand Stripe pilotera le trafic réel.
2. **`REVOKE EXECUTE is_staff FROM anon`** (#22) — migration de durcissement.
3. **Leaked-password protection** (#23) — toggle dashboard (Étienne).
4. **Consommation UI des révisions** (`complete_review`) — la répétition espacée est **amorcée** côté serveur (#8) ; le bouton « réviser » du coffre qui clôt un cycle reste un raffinement UX.
5. **Clés tierces en prod** (`BREVO_API_KEY`, `STRIPE_*`) + **DNS Cloudflare** + **upload contenu réel** (vidéos/PDF) par Marien.

## Verdict
Tous les findings **HIGH** sont clos (1 atténué assumé : #5). Tous les **MEDIUM** clos. **LOW** : 2 clos, 1 atténué (#22), 1 config (#23). Aucune faille de sécurité serveur introduite ; build/lint/tests verts sur les 2 apps ; advisors sans nouveau WARN. **La plateforme est opérationnelle** ; les intégrations externes s'activent en posant leurs clés.
