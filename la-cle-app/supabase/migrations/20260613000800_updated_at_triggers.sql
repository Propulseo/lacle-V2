-- 08_updated_at_triggers
-- Fonction generique BEFORE UPDATE qui maintient automatiquement la colonne
-- updated_at, + un trigger sur CHAQUE table possedant cette colonne.
-- Depend des tables creees dans les fichiers 02 a 07 (numeros inferieurs).

-- ---------------------------------------------------------------------------
-- Fonction generique
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_updated_at() IS
  'Trigger generique BEFORE UPDATE: positionne NEW.updated_at = now() sur toute table possedant une colonne updated_at.';

-- ---------------------------------------------------------------------------
-- Triggers — 02_identity_hierarchy
-- ---------------------------------------------------------------------------
CREATE TRIGGER trg_profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_formations_set_updated_at
  BEFORE UPDATE ON public.formations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_blocs_set_updated_at
  BEFORE UPDATE ON public.blocs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_cours_set_updated_at
  BEFORE UPDATE ON public.cours
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_course_items_set_updated_at
  BEFORE UPDATE ON public.course_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Triggers — 03_content
-- ---------------------------------------------------------------------------
CREATE TRIGGER trg_videos_set_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_questions_set_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_notions_set_updated_at
  BEFORE UPDATE ON public.notions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Triggers — 04_exams
-- ---------------------------------------------------------------------------
CREATE TRIGGER trg_exams_bloc_set_updated_at
  BEFORE UPDATE ON public.exams_bloc
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_exams_final_set_updated_at
  BEFORE UPDATE ON public.exams_final
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_final_exam_progress_set_updated_at
  BEFORE UPDATE ON public.final_exam_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_bloc_progress_set_updated_at
  BEFORE UPDATE ON public.bloc_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_cas_pratiques_set_updated_at
  BEFORE UPDATE ON public.cas_pratiques
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Triggers — 05_enrollment_vault
-- ---------------------------------------------------------------------------
CREATE TRIGGER trg_enrollments_set_updated_at
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_vault_documents_set_updated_at
  BEFORE UPDATE ON public.vault_documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Triggers — 06_progress
-- ---------------------------------------------------------------------------
CREATE TRIGGER trg_video_progress_set_updated_at
  BEFORE UPDATE ON public.video_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_course_progress_set_updated_at
  BEFORE UPDATE ON public.course_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Triggers — 07_qualiopi_annex
-- ---------------------------------------------------------------------------
CREATE TRIGGER trg_engagement_tracking_set_updated_at
  BEFORE UPDATE ON public.engagement_tracking
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_platform_settings_set_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
