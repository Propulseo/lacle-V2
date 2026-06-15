-- ============================================================================
-- 04_exams — Examens (bloc + final), tentatives, progression, cas pratiques
-- ----------------------------------------------------------------------------
-- Possede: exams_bloc, exams_final, exam_attempts, final_exam_progress,
--          bloc_progress, cas_pratiques, cas_pratique_submissions
--          + ALTER TABLE questions ADD CONSTRAINT (FK differees depuis 03).
-- Reference (deja applique): profiles (02), formations/blocs (02), questions (03).
-- RLS centralisee dans 09_rls.sql — NON activee ici.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- exams_bloc — examen de fin de bloc (2 essais immediats, puis 1/h, max 5/24h)
-- ----------------------------------------------------------------------------
CREATE TABLE exams_bloc (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bloc_id            uuid NOT NULL UNIQUE REFERENCES blocs(id) ON DELETE CASCADE,
  title              text NOT NULL,
  message_accueil    text NOT NULL,
  message_reussite   text NOT NULL,
  message_attente    text NOT NULL,
  passing_score      int NOT NULL DEFAULT 100,
  time_limit_minutes int,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

COMMENT ON COLUMN exams_bloc.time_limit_minutes IS 'Limite de temps en minutes (NULL = pas de limite).';
COMMENT ON COLUMN exams_bloc.message_attente IS 'Message affiche pendant la periode de cooldown entre tentatives (1/h, max 5/24h).';

-- ----------------------------------------------------------------------------
-- exams_final — examen final de formation (back-off croissant, jamais bloque def.)
-- ----------------------------------------------------------------------------
CREATE TABLE exams_final (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id          uuid NOT NULL UNIQUE REFERENCES formations(id) ON DELETE CASCADE,
  title                 text NOT NULL,
  message_accueil       text,
  message_reussite      text,
  message_encouragement text,
  passing_score         int NOT NULL DEFAULT 100,
  time_limit_minutes    int,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

COMMENT ON COLUMN exams_final.message_encouragement IS 'Message affiche en cas d''echec (encouragement avant nouvelle tentative).';
COMMENT ON COLUMN exams_final.time_limit_minutes IS 'Limite de temps en minutes (NULL = pas de limite).';

-- ----------------------------------------------------------------------------
-- exam_attempts — tentatives d'examen (table IMMUABLE, ecriture via RPC SECURITY DEFINER)
-- La regle de back-off final est RECALCULEE A LA VOLEE depuis cet historique.
-- ----------------------------------------------------------------------------
CREATE TABLE exam_attempts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exam_kind      exam_kind NOT NULL,
  exam_bloc_id   uuid REFERENCES exams_bloc(id) ON DELETE CASCADE,
  exam_final_id  uuid REFERENCES exams_final(id) ON DELETE CASCADE,
  attempt_number int NOT NULL,
  answers        jsonb NOT NULL DEFAULT '{}',
  score          int NOT NULL,
  passed         boolean NOT NULL,
  started_at     timestamptz,
  completed_at   timestamptz NOT NULL DEFAULT now(),
  blocked_until  timestamptz,
  blocked_reason text,
  CONSTRAINT exam_attempts_kind_target_chk CHECK (
    (exam_kind = 'bloc'  AND exam_bloc_id  IS NOT NULL AND exam_final_id IS NULL) OR
    (exam_kind = 'final' AND exam_final_id IS NOT NULL AND exam_bloc_id  IS NULL)
  )
);

CREATE INDEX exam_attempts_learner_bloc_idx  ON exam_attempts (learner_id, exam_bloc_id, completed_at);
CREATE INDEX exam_attempts_learner_final_idx ON exam_attempts (learner_id, exam_final_id, completed_at);

COMMENT ON COLUMN exam_attempts.blocked_until IS 'Horodatage indicatif (affichage) du prochain essai possible. La porte d''entree reelle est RECALCULEE a la volee par une fonction depuis l''historique des tentatives — ne pas s''y fier comme verite immuable.';
COMMENT ON COLUMN exam_attempts.blocked_reason IS 'Raison du blocage temporaire (back-off / quota 24h). Server-only.';
COMMENT ON TABLE  exam_attempts IS 'Table immuable: ecriture exclusivement via RPC SECURITY DEFINER (aucune policy INSERT/UPDATE pour authenticated en 09).';

-- ----------------------------------------------------------------------------
-- final_exam_progress — etat de l'examen final par eleve (1 ligne / learner+exam)
-- ----------------------------------------------------------------------------
CREATE TABLE final_exam_progress (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exam_final_id uuid NOT NULL REFERENCES exams_final(id) ON DELETE CASCADE,
  status        final_exam_status NOT NULL DEFAULT 'not_started',
  requested_at  timestamptz,
  scheduled_at  timestamptz,
  passed_at     timestamptz,
  completed_at  timestamptz,
  best_score    int,
  notes         text,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (learner_id, exam_final_id)
);

COMMENT ON COLUMN final_exam_progress.notes IS 'Notes admin (ex: deblocage manuel apres back-off). Server-only.';

-- ----------------------------------------------------------------------------
-- bloc_progress — materialise le deblocage du bloc suivant (pas de bloc N+1 si echec)
-- ----------------------------------------------------------------------------
CREATE TABLE bloc_progress (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bloc_id     uuid NOT NULL REFERENCES blocs(id) ON DELETE CASCADE,
  status      progress_status NOT NULL DEFAULT 'not_started',
  exam_passed boolean NOT NULL DEFAULT false,
  unlocked_at timestamptz,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (learner_id, bloc_id)
);

CREATE INDEX bloc_progress_learner_idx ON bloc_progress (learner_id);

COMMENT ON COLUMN bloc_progress.exam_passed IS 'Reussite de l''examen de bloc — conditionne le deblocage du bloc suivant.';

-- ----------------------------------------------------------------------------
-- cas_pratiques — cas pratiques (etape post-examen final, relus par formateur)
-- ----------------------------------------------------------------------------
CREATE TABLE cas_pratiques (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id uuid NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  numero       int NOT NULL,
  title        text NOT NULL,
  situation    text NOT NULL,
  consignes    text,
  max_essais   int NOT NULL DEFAULT 3,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (formation_id, numero)
);

-- ----------------------------------------------------------------------------
-- cas_pratique_submissions — soumissions d'un cas pratique (correction staff)
-- ----------------------------------------------------------------------------
CREATE TABLE cas_pratique_submissions (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cas_pratique_id    uuid NOT NULL REFERENCES cas_pratiques(id) ON DELETE CASCADE,
  learner_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  essai_number       int NOT NULL,
  response           text NOT NULL,
  submitted_at       timestamptz NOT NULL DEFAULT now(),
  status             submission_status NOT NULL DEFAULT 'pending',
  corrector_id       uuid REFERENCES profiles(id),
  corrector_feedback text,
  score              int,
  corrected_at       timestamptz,
  UNIQUE (cas_pratique_id, learner_id, essai_number)
);

CREATE INDEX cas_pratique_submissions_status_idx ON cas_pratique_submissions (status);

COMMENT ON COLUMN cas_pratique_submissions.corrector_id IS 'Formateur/admin ayant corrige (NULL tant que non corrige). Ecriture de correction reservee a is_staff().';

-- ----------------------------------------------------------------------------
-- FK differees: questions.exam_bloc_id / questions.exam_final_id (colonnes creees
-- en 03 sans REFERENCES car exams_bloc/exams_final n'existaient pas encore).
-- ----------------------------------------------------------------------------
ALTER TABLE questions
  ADD CONSTRAINT questions_exam_bloc_fk
  FOREIGN KEY (exam_bloc_id) REFERENCES exams_bloc(id) ON DELETE CASCADE;

ALTER TABLE questions
  ADD CONSTRAINT questions_exam_final_fk
  FOREIGN KEY (exam_final_id) REFERENCES exams_final(id) ON DELETE CASCADE;
