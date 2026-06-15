-- =============================================================================
-- 15_security_hardening.sql
-- Corrige les advisors securite post-apply (0 ERROR avant ; durcit les WARN reels) :
--   - EXECUTE PUBLIC par defaut sur les fonctions -> retire, re-grant precis.
--   - update_engagement_status etait DE FAIT appelable par tous (faille) -> service_role only.
--   - fonctions trigger-only jamais exposees en RPC.
--   - next_final_delay : search_path fige + usage interne uniquement.
--   - bucket public site-media : retrait de la policy de listing large.
-- NB : voir aussi 19 (lockdown explicite anon/authenticated : Supabase accorde
--      EXECUTE directement a ces roles, pas seulement via PUBLIC).
-- =============================================================================

-- next_final_delay : pure (math/interval), usage interne par submit_exam_attempt.
ALTER FUNCTION public.next_final_delay(int) SET search_path = pg_catalog, pg_temp;
REVOKE EXECUTE ON FUNCTION public.next_final_delay(int) FROM PUBLIC;

-- Fonctions trigger-only : invoquees par les triggers (droits du proprietaire),
-- jamais par un appelant -> aucun EXECUTE client necessaire.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.protect_profile_privilege_cols() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_profile_role_on_insert() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.snapshot_site_content_change() FROM PUBLIC;

-- Jobs anti-decrochage uniquement (service_role). Retire l'acces PUBLIC par defaut.
REVOKE EXECUTE ON FUNCTION public.update_engagement_status(uuid, public.engagement_status, timestamptz) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.update_engagement_status(uuid, public.engagement_status, timestamptz) TO service_role;

-- RPC clients (eleve connecte) : retire PUBLIC, grant precis a authenticated.
REVOKE EXECUTE ON FUNCTION public.submit_exam_attempt(public.exam_kind, uuid, jsonb)     FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.submit_question_response(uuid, text, int)               FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.complete_review(uuid, text, int)                        FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.record_video_progress(uuid, int, boolean)              FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_cours_questions(uuid)                               FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.reorder_course_item(uuid, numeric)                      FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.submit_exam_attempt(public.exam_kind, uuid, jsonb)     TO authenticated;
GRANT  EXECUTE ON FUNCTION public.submit_question_response(uuid, text, int)               TO authenticated;
GRANT  EXECUTE ON FUNCTION public.complete_review(uuid, text, int)                        TO authenticated;
GRANT  EXECUTE ON FUNCTION public.record_video_progress(uuid, int, boolean)              TO authenticated;
GRANT  EXECUTE ON FUNCTION public.get_cours_questions(uuid)                               TO authenticated;
GRANT  EXECUTE ON FUNCTION public.reorder_course_item(uuid, numeric)                      TO authenticated;

-- RPC token (enquete a froid) : anon + authenticated par design (lien anonyme).
REVOKE EXECUTE ON FUNCTION public.get_satisfaction_survey_by_token(uuid)                                  FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.submit_satisfaction_survey_by_token(uuid, jsonb, text, boolean)         FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_satisfaction_survey_by_token(uuid)                                  TO anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.submit_satisfaction_survey_by_token(uuid, jsonb, text, boolean)         TO anon, authenticated;

-- is_staff : requise par la RLS (evaluee par anon ET authenticated dans les policies).
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_staff(uuid) TO anon, authenticated, service_role;

-- Bucket public site-media : les objets sont servis par URL publique (sans RLS).
-- La policy de listing large permettait a anon d'enumerer le bucket -> on la retire.
DROP POLICY IF EXISTS site_media_read_public ON storage.objects;
