-- ============================================================================
-- 06_progress — Progression eleve & repetition espacee (LMS La Cle)
-- Tables possedees: video_progress, course_progress, question_responses,
--                   scheduled_reviews, video_reports
-- Postgres 15 (Supabase). RLS centralisee dans 09_rls.sql (non activee ici).
-- Reference des objets crees en amont: profiles (02), cours (02), videos (03),
--   questions (03). Enums (01): progress_status, submission_status,
--   review_status, report_type, report_status.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- video_progress — etat de visionnage d'une video par un eleve
-- ----------------------------------------------------------------------------
CREATE TABLE video_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  last_position_seconds int NOT NULL DEFAULT 0,
  overlay_questions_answered jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (learner_id, video_id)
);

CREATE INDEX video_progress_learner_idx ON video_progress (learner_id);

COMMENT ON COLUMN video_progress.overlay_questions_answered IS 'Tableau JSON des overlay_question_id deja repondus dans cette video (suivi cote eleve, ecrit via RPC/self).';
COMMENT ON COLUMN video_progress.completed_at IS 'Horodatage du passage a completed=true; NULL tant que la video n''est pas terminee.';

-- ----------------------------------------------------------------------------
-- course_progress — etat d'avancement d'un cours par un eleve
-- ----------------------------------------------------------------------------
CREATE TABLE course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cours_id uuid NOT NULL REFERENCES cours(id) ON DELETE CASCADE,
  status progress_status NOT NULL DEFAULT 'not_started',
  completed_at timestamptz,
  last_access_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (learner_id, cours_id)
);

CREATE INDEX course_progress_learner_idx ON course_progress (learner_id);

COMMENT ON COLUMN course_progress.completed_at IS 'Horodatage du passage a status=completed; NULL tant que le cours n''est pas termine.';

-- ----------------------------------------------------------------------------
-- question_responses — reponses eleve (immuable via RPC) + relecture humaine
-- ----------------------------------------------------------------------------
CREATE TABLE question_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  occurrence int NOT NULL DEFAULT 1,
  answer text NOT NULL,
  is_correct boolean,
  response_time_ms int,
  attempt_count int NOT NULL DEFAULT 1,
  answered_at timestamptz NOT NULL DEFAULT now(),
  reviewer_id uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  reviewer_feedback text,
  review_status submission_status
);

CREATE INDEX question_responses_learner_question_idx ON question_responses (learner_id, question_id);
CREATE INDEX question_responses_question_idx ON question_responses (question_id);

COMMENT ON COLUMN question_responses.occurrence IS 'Numero de reprise du cours pour cette question (1 = premier passage); distingue les reponses d''un cours repris.';
COMMENT ON COLUMN question_responses.is_correct IS 'NULL tant que non corrige (reponse libre en attente de relecture humaine) ou non scorable automatiquement.';
COMMENT ON COLUMN question_responses.reviewer_id IS 'Formateur/admin ayant relu la reponse libre; NULL si aucune relecture requise (requires_human_review=false).';
COMMENT ON COLUMN question_responses.review_status IS 'Statut de la relecture humaine (pending|corrected); NULL si la question ne requiert pas de relecture.';

-- ----------------------------------------------------------------------------
-- scheduled_reviews — repetition espacee (4 intervalles par cycle)
-- ----------------------------------------------------------------------------
CREATE TABLE scheduled_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  review_cycle_id uuid NOT NULL,
  interval_days int NOT NULL,
  due_on date NOT NULL,
  status review_status NOT NULL DEFAULT 'pending',
  completed_at timestamptz,
  student_answer text,
  response_time_ms int,
  is_correct boolean,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX scheduled_reviews_learner_due_idx ON scheduled_reviews (learner_id, due_on);
CREATE INDEX scheduled_reviews_due_pending_idx ON scheduled_reviews (due_on) WHERE status = 'pending';
CREATE INDEX scheduled_reviews_cycle_idx ON scheduled_reviews (review_cycle_id);

COMMENT ON COLUMN scheduled_reviews.review_cycle_id IS 'Regroupe les 4 intervalles d''une meme generation; permet d''annuler/regenerer toute la serie (status=superseded) a J+1 apres echec.';
COMMENT ON COLUMN scheduled_reviews.status IS 'pending = a faire; done = effectue; superseded = annule par regeneration du cycle.';

-- ----------------------------------------------------------------------------
-- video_reports — signalements (bug / incoherence) sur une video ou page
-- ----------------------------------------------------------------------------
CREATE TABLE video_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE SET NULL,
  page_url text,
  report_type report_type NOT NULL DEFAULT 'bug',
  description text NOT NULL,
  status report_status NOT NULL DEFAULT 'ouvert',
  resolution_notes text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX video_reports_status_idx ON video_reports (status);

COMMENT ON COLUMN video_reports.video_id IS 'Video concernee; NULL si le signalement vise une page sans video (page_url renseigne) ou si la video a ete supprimee.';
