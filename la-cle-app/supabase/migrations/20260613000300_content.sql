-- =====================================================================
-- 03_content
-- Couche CONTENU pedagogique du LMS La Cle.
-- Possede: videos, video_overlay_questions, video_overlay_answers,
--          questions, question_answers, notions, video_notions,
--          question_notions.
--
-- Depend de (fichiers de numero inferieur, deja appliques):
--   - 02_identity_hierarchy: course_items.
--   - profiles / formations / blocs / cours (02) ne sont pas directement
--     references ici mais font partie de la hierarchie amont.
--
-- ATTENTION: questions.exam_bloc_id / questions.exam_final_id referencent
-- exams_bloc / exams_final qui sont crees dans 04 (numero superieur). Les
-- deux FK sont donc declarees en simples colonnes uuid ici (SANS clause
-- REFERENCES) et la contrainte FK est ajoutee en ALTER TABLE a la fin de
-- 04_exams.sql.
--
-- SECRET DES REPONSES: les bonnes reponses et explications vivent dans des
-- tables SEPAREES staff-only (video_overlay_answers, question_answers) pour
-- ne JAMAIS etre exposees aux eleves via PostgREST. Les tables de questions
-- ne contiennent que l'enonce et les options (visibles).
--
-- La RLS n'est PAS activee ici: elle est centralisee dans 09_rls.sql.
-- =====================================================================

-- ---------------------------------------------------------------------
-- videos
-- ---------------------------------------------------------------------
CREATE TABLE videos (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id          uuid NOT NULL UNIQUE REFERENCES course_items(id) ON DELETE CASCADE,
  code             text NOT NULL,
  title            text NOT NULL,
  description      text,
  duration_seconds int NOT NULL DEFAULT 0,
  src              text,
  thumbnail_url    text,
  announces_vault  boolean NOT NULL DEFAULT false,
  is_published     boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX videos_code_idx ON videos (code);

COMMENT ON COLUMN videos.code IS
  'Code metier de la video. L''unicite par formation N''EST PAS contrainte au niveau SQL (necessiterait un index fonctionnel traversant course_items > cours > blocs > formation); elle est garantie par le RPC/admin de creation de contenu.';
COMMENT ON COLUMN videos.announces_vault IS
  'true si la video annonce/declenche l''ouverture d''un document du coffre (course_item de kind acces_coffre lie en aval).';

-- ---------------------------------------------------------------------
-- video_overlay_questions
-- Questions superposees a un instant donne de la video (enonce + options
-- visibles). La bonne reponse est stockee a part dans video_overlay_answers.
-- ---------------------------------------------------------------------
CREATE TABLE video_overlay_questions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id          uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  timestamp_seconds int NOT NULL,
  format            question_format NOT NULL,
  question          text NOT NULL,
  options           jsonb,
  position          int NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX video_overlay_questions_video_ts_idx
  ON video_overlay_questions (video_id, timestamp_seconds);

COMMENT ON COLUMN video_overlay_questions.options IS
  'Choix proposes (jsonb), VISIBLES par l''eleve. Ne contient JAMAIS l''indication de la bonne reponse (cf. video_overlay_answers).';

-- ---------------------------------------------------------------------
-- video_overlay_answers (SECRETE - staff only)
-- Bonne reponse + explication d''une question overlay. Jamais exposee aux
-- eleves: SELECT reserve a is_staff() en 09, scoring eleve via RPC
-- SECURITY DEFINER.
-- ---------------------------------------------------------------------
CREATE TABLE video_overlay_answers (
  overlay_question_id uuid PRIMARY KEY REFERENCES video_overlay_questions(id) ON DELETE CASCADE,
  correct_answer      text,
  explanation         text
);

COMMENT ON TABLE video_overlay_answers IS
  'SECRETE / staff-only: contient la bonne reponse et l''explication des questions overlay. Ne doit JAMAIS etre lisible par les eleves via PostgREST (policy SELECT = is_staff() uniquement en 09_rls.sql). Le scoring eleve passe par RPC SECURITY DEFINER.';
COMMENT ON COLUMN video_overlay_answers.correct_answer IS
  'Bonne reponse (server-only). NULL admis tant que non saisie par l''admin.';

-- ---------------------------------------------------------------------
-- questions
-- Questions pedagogiques (cours) ET questions composant les examens
-- (bloc / final). Le scope distingue le rattachement; un CHECK garantit la
-- coherence scope <-> FK renseignee.
-- exam_bloc_id / exam_final_id sont de simples colonnes uuid ici: leur FK
-- vers exams_bloc / exams_final est ajoutee en fin de 04_exams.sql.
-- La bonne reponse est stockee a part dans question_answers.
-- ---------------------------------------------------------------------
CREATE TABLE questions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id               uuid UNIQUE REFERENCES course_items(id) ON DELETE CASCADE,
  scope                 question_scope NOT NULL DEFAULT 'cours',
  exam_bloc_id          uuid,
  exam_final_id         uuid,
  type                  question_type NOT NULL,
  is_qcm                boolean NOT NULL DEFAULT false,
  is_blocking           boolean NOT NULL DEFAULT false,
  requires_human_review boolean NOT NULL DEFAULT false,
  content               text NOT NULL,
  options               jsonb,
  points                int NOT NULL DEFAULT 1,
  position              int NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT questions_scope_target_check CHECK (
    (scope = 'cours'        AND item_id IS NOT NULL AND exam_bloc_id IS NULL     AND exam_final_id IS NULL)
    OR (scope = 'examen_bloc'  AND exam_bloc_id IS NOT NULL AND exam_final_id IS NULL)
    OR (scope = 'examen_final' AND exam_final_id IS NOT NULL AND exam_bloc_id IS NULL)
  )
);

CREATE INDEX questions_scope_idx        ON questions (scope);
CREATE INDEX questions_item_id_idx      ON questions (item_id);
CREATE INDEX questions_exam_bloc_id_idx ON questions (exam_bloc_id);
CREATE INDEX questions_exam_final_id_idx ON questions (exam_final_id);

COMMENT ON COLUMN questions.exam_bloc_id IS
  'FK ajoutee en 04 (ALTER TABLE ... ADD CONSTRAINT questions_exam_bloc_fk vers exams_bloc): exams_bloc est cree dans le fichier 04, de numero superieur.';
COMMENT ON COLUMN questions.exam_final_id IS
  'FK ajoutee en 04 (ALTER TABLE ... ADD CONSTRAINT questions_exam_final_fk vers exams_final): exams_final est cree dans le fichier 04, de numero superieur.';
COMMENT ON COLUMN questions.requires_human_review IS
  'true => la reponse libre de l''eleve doit etre relue par un formateur (relecture humaine), distinct de is_qcm/is_blocking.';
COMMENT ON COLUMN questions.is_blocking IS
  'true => une bonne reponse est requise pour progresser; distinct de is_qcm (format) et de requires_human_review (relecture).';
COMMENT ON COLUMN questions.options IS
  'Choix proposes (jsonb), VISIBLES par l''eleve. Ne contient JAMAIS l''indication de la bonne reponse (cf. question_answers).';

-- ---------------------------------------------------------------------
-- question_answers (SECRETE - staff only)
-- Bonne reponse + explication d''une question. Jamais exposee aux eleves:
-- SELECT reserve a is_staff() en 09, scoring eleve via RPC SECURITY DEFINER.
-- ---------------------------------------------------------------------
CREATE TABLE question_answers (
  question_id    uuid PRIMARY KEY REFERENCES questions(id) ON DELETE CASCADE,
  correct_answer text,
  explanation    text
);

COMMENT ON TABLE question_answers IS
  'SECRETE / staff-only: contient la bonne reponse et l''explication des questions. Ne doit JAMAIS etre lisible par les eleves via PostgREST (policy SELECT = is_staff() uniquement en 09_rls.sql). Le scoring eleve passe par RPC SECURITY DEFINER.';
COMMENT ON COLUMN question_answers.correct_answer IS
  'Bonne reponse (server-only). NULL admis tant que non saisie par l''admin.';

-- ---------------------------------------------------------------------
-- notions
-- Concepts pedagogiques transverses, relies aux videos et aux questions
-- (utilises par la repetition espacee et le chatbot).
-- ---------------------------------------------------------------------
CREATE TABLE notions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label       text NOT NULL UNIQUE,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- video_notions (table de liaison M:N video <-> notion)
-- ---------------------------------------------------------------------
CREATE TABLE video_notions (
  video_id   uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  notion_id  uuid NOT NULL REFERENCES notions(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (video_id, notion_id)
);

CREATE INDEX video_notions_notion_id_idx ON video_notions (notion_id);

-- ---------------------------------------------------------------------
-- question_notions (table de liaison M:N question <-> notion)
-- ---------------------------------------------------------------------
CREATE TABLE question_notions (
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  notion_id   uuid NOT NULL REFERENCES notions(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (question_id, notion_id)
);

CREATE INDEX question_notions_notion_id_idx ON question_notions (notion_id);
