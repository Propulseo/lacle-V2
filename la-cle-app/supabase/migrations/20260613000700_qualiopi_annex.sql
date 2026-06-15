-- ============================================================================
-- 07_qualiopi_annex
-- LMS La Cle Institut — Annexe Qualiopi + transverse
-- Tables : pre_enrollment_answers, onboarding_results, positioning_results,
--          engagement_tracking, engagement_reminders, satisfaction_surveys,
--          presentiel_sessions, session_registrations, support_messages,
--          payment_transactions, revision_resources, platform_settings,
--          chatbot_messages
--
-- Dependances (fichiers de numero inferieur, deja appliques) :
--   01_enums    : tous les CREATE TYPE (satisfaction_type, report_status...)
--   02_identity : profiles, formations
--   03_content  : notions
--   05_enrollment_vault : enrollments
--
-- RLS : NON activee ici (centralisee dans 09_rls.sql).
-- ============================================================================


-- ----------------------------------------------------------------------------
-- pre_enrollment_answers
-- Reponses au questionnaire de pre-inscription (Qualiopi Ind.4).
-- Formulaire PUBLIC : learner_id peut etre NULL (prospect non encore inscrit),
-- l'identification se fait alors par contact_email.
-- ----------------------------------------------------------------------------
CREATE TABLE pre_enrollment_answers (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id            uuid REFERENCES profiles(id) ON DELETE SET NULL,
  contact_email         text,
  answers               jsonb NOT NULL,
  questionnaire_version int NOT NULL DEFAULT 1,
  completed_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pre_enrollment_answers_learner ON pre_enrollment_answers (learner_id);

COMMENT ON COLUMN pre_enrollment_answers.learner_id IS 'NULL si prospect non encore inscrit (formulaire public) ; rattachement a posteriori.';
COMMENT ON COLUMN pre_enrollment_answers.contact_email IS 'Identifiant de repli quand learner_id est NULL (prospect public).';
COMMENT ON COLUMN pre_enrollment_answers.questionnaire_version IS 'Version du questionnaire au moment de la reponse (preuve Qualiopi horodatee, immuable).';


-- ----------------------------------------------------------------------------
-- onboarding_results
-- Resultat du questionnaire d'accueil / auto-positionnement initial.
-- 1 seul par eleve (UNIQUE learner_id).
-- ----------------------------------------------------------------------------
CREATE TABLE onboarding_results (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id            uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  answers               jsonb NOT NULL,
  pnl_level             text NOT NULL,
  recommended_pace      text NOT NULL,
  questionnaire_version int NOT NULL DEFAULT 1,
  completed_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (learner_id)
);

COMMENT ON COLUMN onboarding_results.pnl_level IS 'Niveau PNL declare/estime a l''accueil (libre, semantique pedagogique).';
COMMENT ON COLUMN onboarding_results.recommended_pace IS 'Rythme recommande issu de l''onboarding (libre).';
COMMENT ON COLUMN onboarding_results.questionnaire_version IS 'Version du questionnaire au moment de la reponse (preuve Qualiopi horodatee).';


-- ----------------------------------------------------------------------------
-- positioning_results
-- Resultat du positionnement par formation (Qualiopi Ind.8).
-- Conditionne le deverrouillage du bloc 1 quand formations.requires_positioning.
-- 1 seul par (eleve, formation).
-- ----------------------------------------------------------------------------
CREATE TABLE positioning_results (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id            uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  formation_id          uuid NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  answers               jsonb NOT NULL,
  score                 int,
  starting_level        text NOT NULL,
  recommendations       jsonb NOT NULL DEFAULT '[]',
  questionnaire_version int NOT NULL DEFAULT 1,
  completed_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (learner_id, formation_id)
);

COMMENT ON COLUMN positioning_results.starting_level IS 'Niveau de depart determine par le positionnement (libre).';
COMMENT ON COLUMN positioning_results.recommendations IS 'Liste JSON de recommandations de parcours.';
COMMENT ON COLUMN positioning_results.questionnaire_version IS 'Version du questionnaire au moment de la reponse (preuve Qualiopi horodatee).';


-- ----------------------------------------------------------------------------
-- engagement_tracking
-- Etat d'engagement de l'eleve (1 ligne par eleve, PK = learner_id).
-- PAS de days_since_last_activity (valeur perissable) : calcule a la volee en vue.
-- Ecrit par RPC / job / staff (pas d'INSERT/UPDATE authenticated direct).
-- ----------------------------------------------------------------------------
CREATE TABLE engagement_tracking (
  learner_id         uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  last_connection_at timestamptz,
  last_progress_at   timestamptz,
  status             engagement_status NOT NULL DEFAULT 'actif',
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_engagement_tracking_status ON engagement_tracking (status);

COMMENT ON TABLE engagement_tracking IS 'Materialise l''etat d''engagement ; le nombre de jours d''inactivite se calcule a la volee (vue), jamais stocke.';
COMMENT ON COLUMN engagement_tracking.last_connection_at IS 'Derniere connexion (server-only, alimente par job/RPC).';
COMMENT ON COLUMN engagement_tracking.last_progress_at IS 'Derniere progression pedagogique (server-only).';


-- ----------------------------------------------------------------------------
-- engagement_reminders
-- Relances d'engagement envoyees a l'eleve (email / appel).
-- Ecrit par service_role / job (aucune ecriture authenticated).
-- ----------------------------------------------------------------------------
CREATE TABLE engagement_reminders (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  level        int NOT NULL,
  channel      reminder_channel NOT NULL,
  sent_at      timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz
);

CREATE INDEX idx_engagement_reminders_learner_sent ON engagement_reminders (learner_id, sent_at);

COMMENT ON COLUMN engagement_reminders.level IS 'Palier de relance (1, 2, 3...) aligne sur les seuils d''inactivite.';


-- ----------------------------------------------------------------------------
-- satisfaction_surveys
-- Enquetes de satisfaction "a chaud" et "a froid" (Qualiopi).
-- L'enquete a froid est accessible via access_token (RPC SECURITY DEFINER),
-- learner_id peut etre NULL (envoi par lien, eleve eventuellement parti).
-- ----------------------------------------------------------------------------
CREATE TABLE satisfaction_surveys (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id          uuid REFERENCES profiles(id) ON DELETE SET NULL,
  formation_id        uuid NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  type                satisfaction_type NOT NULL,
  access_token        uuid,
  answers             jsonb NOT NULL DEFAULT '[]',
  public_review       text,
  wants_public_review boolean NOT NULL DEFAULT false,
  is_published        boolean NOT NULL DEFAULT false,
  completed_at        timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (access_token)
);

CREATE INDEX idx_satisfaction_surveys_type ON satisfaction_surveys (type);

COMMENT ON COLUMN satisfaction_surveys.access_token IS 'Token d''acces public (enquete a froid) ; consomme via RPC SECURITY DEFINER, jamais expose en SELECT ouvert.';
COMMENT ON COLUMN satisfaction_surveys.public_review IS 'Avis destine a publication (site vitrine) ; visible publiquement uniquement si is_published.';
COMMENT ON COLUMN satisfaction_surveys.is_published IS 'Publication validee par le staff (gate la diffusion de public_review).';


-- ----------------------------------------------------------------------------
-- presentiel_sessions
-- Sessions presentielles / regroupements (contenu, staff-only en ecriture).
-- formation_id nullable (session transverse possible).
-- ----------------------------------------------------------------------------
CREATE TABLE presentiel_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id     uuid REFERENCES formations(id) ON DELETE SET NULL,
  title            text NOT NULL,
  description      text,
  session_date     date NOT NULL,
  start_time       time NOT NULL,
  end_time         time NOT NULL,
  location         text NOT NULL,
  max_participants int NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_presentiel_sessions_date ON presentiel_sessions (session_date);


-- ----------------------------------------------------------------------------
-- session_registrations
-- Inscriptions des eleves aux sessions presentielles.
-- attended : NULL = non renseigne, true/false = emargement.
-- ----------------------------------------------------------------------------
CREATE TABLE session_registrations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    uuid NOT NULL REFERENCES presentiel_sessions(id) ON DELETE CASCADE,
  learner_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at timestamptz NOT NULL DEFAULT now(),
  attended      boolean,
  UNIQUE (session_id, learner_id)
);

COMMENT ON COLUMN session_registrations.attended IS 'NULL = emargement non renseigne ; true/false = presence constatee (preuve Qualiopi).';


-- ----------------------------------------------------------------------------
-- support_messages
-- Messages de support eleve -> staff, avec reponse.
-- ----------------------------------------------------------------------------
CREATE TABLE support_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject    text NOT NULL,
  message    text NOT NULL,
  reply      text,
  created_at timestamptz NOT NULL DEFAULT now(),
  replied_at timestamptz
);

CREATE INDEX idx_support_messages_learner ON support_messages (learner_id);

COMMENT ON COLUMN support_messages.reply IS 'Reponse du staff (NULL tant que non traite).';


-- ----------------------------------------------------------------------------
-- payment_transactions
-- Transactions Stripe (immuable cote eleve, ecrit par webhook/service_role).
-- enrollment_id nullable (SET NULL si l'inscription est supprimee, on garde la trace compta).
-- ----------------------------------------------------------------------------
CREATE TABLE payment_transactions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id            uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrollment_id         uuid REFERENCES enrollments(id) ON DELETE SET NULL,
  stripe_payment_intent text,
  amount_cents          int NOT NULL,
  currency              text NOT NULL DEFAULT 'eur',
  status                payment_txn_status NOT NULL,
  occurred_at           timestamptz NOT NULL DEFAULT now()
);

-- M2: index unique PARTIEL (et non UNIQUE inline) : plusieurs lignes a NULL sont
-- autorisees (NULL != NULL en SQL), l'unicite ne s'applique qu'aux PaymentIntent
-- reels -> idempotence webhook Stripe garantie sans bloquer les ecritures sans PI.
CREATE UNIQUE INDEX payment_transactions_stripe_pi_uidx
  ON payment_transactions (stripe_payment_intent)
  WHERE stripe_payment_intent IS NOT NULL;

COMMENT ON TABLE payment_transactions IS 'Ecrit exclusivement par webhook Stripe / service_role ; aucune ecriture authenticated (RLS 09).';
COMMENT ON COLUMN payment_transactions.stripe_payment_intent IS 'Identifiant Stripe PaymentIntent (idempotence via index unique partiel).';


-- ----------------------------------------------------------------------------
-- revision_resources
-- Ressources de revision rattachees a un bloc (PDF, question flash, video).
-- bloc_id nullable (ressource transverse). 'answer' pour les ressources type question.
-- ----------------------------------------------------------------------------
CREATE TABLE revision_resources (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bloc_id     uuid REFERENCES blocs(id) ON DELETE SET NULL,
  type        revision_resource_type NOT NULL,
  title       text NOT NULL,
  description text,
  content     text NOT NULL,
  answer      text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_revision_resources_bloc ON revision_resources (bloc_id);

COMMENT ON COLUMN revision_resources.content IS 'Corps de la ressource : URL PDF, enonce question ou reference video selon type.';
COMMENT ON COLUMN revision_resources.answer IS 'Reponse attendue (pertinent pour type=question).';


-- ----------------------------------------------------------------------------
-- platform_settings
-- Singleton de configuration de la plateforme (id boolean = true, 1 seule ligne).
-- ----------------------------------------------------------------------------
CREATE TABLE platform_settings (
  id                            boolean PRIMARY KEY DEFAULT true CHECK (id),
  site_name                     text NOT NULL,
  support_email                 text NOT NULL,
  exam_passing_score            int NOT NULL DEFAULT 100,
  max_exam_attempts             int NOT NULL DEFAULT 3,
  session_registration_deadline_days int NOT NULL DEFAULT 7,
  maintenance_mode              boolean NOT NULL DEFAULT false,
  updated_at                    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE platform_settings IS 'Singleton : id force a true (CHECK), garantit une unique ligne de configuration.';


-- ----------------------------------------------------------------------------
-- chatbot_messages
-- Historique des conversations du chatbot pedagogique.
-- session_id regroupe les messages d'une meme conversation ; notion_id optionnel.
-- ----------------------------------------------------------------------------
CREATE TABLE chatbot_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id uuid NOT NULL,
  role       chat_role NOT NULL,
  content    text NOT NULL,
  notion_id  uuid REFERENCES notions(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_chatbot_messages_learner_session ON chatbot_messages (learner_id, session_id);

COMMENT ON COLUMN chatbot_messages.session_id IS 'Regroupe les messages d''une meme conversation (cote application, pas de table sessions).';
COMMENT ON COLUMN chatbot_messages.notion_id IS 'Notion pedagogique liee au message (NULL si hors notion).';
