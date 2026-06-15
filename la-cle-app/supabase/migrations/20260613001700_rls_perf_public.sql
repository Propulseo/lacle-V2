-- =============================================================================
-- 17_rls_perf_public.sql
-- Optimisation perf RLS (schema public) :
--   - auth_rls_initplan : auth.uid() / is_staff(auth.uid()) -> wrappes en
--     (select ...) pour evaluation UNE fois (initplan) et non par ligne.
--   - multiple_permissive_policies : les policies staff FOR ALL chevauchaient le
--     SELECT -> separees en actions d'ecriture ; doublons UPDATE fusionnes.
-- Semantique d'acces strictement identique a 09_rls / 12_site_cms.
-- =============================================================================

-- 1) Drop de toutes les policies existantes du schema public (recreees ci-dessous).
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- =============================================================================
-- PROFILES
-- =============================================================================
CREATE POLICY profiles_select_self_or_staff ON public.profiles
  FOR SELECT TO authenticated
  USING (id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
-- UPDATE self + staff fusionnes (le trigger protect_profile_privilege_cols fige les colonnes sensibles)
CREATE POLICY profiles_update ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (select auth.uid()) OR (select public.is_staff(auth.uid())))
  WITH CHECK (id = (select auth.uid()) OR (select public.is_staff(auth.uid())));

-- =============================================================================
-- TABLES CONTENU : SELECT authenticated ; ecritures staff (par action)
-- =============================================================================
-- formations
CREATE POLICY formations_select_authenticated ON public.formations FOR SELECT TO authenticated USING (true);
CREATE POLICY formations_insert_staff ON public.formations FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY formations_update_staff ON public.formations FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY formations_delete_staff ON public.formations FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- blocs
CREATE POLICY blocs_select_authenticated ON public.blocs FOR SELECT TO authenticated USING (true);
CREATE POLICY blocs_insert_staff ON public.blocs FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY blocs_update_staff ON public.blocs FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY blocs_delete_staff ON public.blocs FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- cours
CREATE POLICY cours_select_authenticated ON public.cours FOR SELECT TO authenticated USING (true);
CREATE POLICY cours_insert_staff ON public.cours FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY cours_update_staff ON public.cours FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY cours_delete_staff ON public.cours FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- course_items
CREATE POLICY course_items_select_authenticated ON public.course_items FOR SELECT TO authenticated USING (true);
CREATE POLICY course_items_insert_staff ON public.course_items FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY course_items_update_staff ON public.course_items FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY course_items_delete_staff ON public.course_items FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- videos
CREATE POLICY videos_select_authenticated ON public.videos FOR SELECT TO authenticated USING (true);
CREATE POLICY videos_insert_staff ON public.videos FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY videos_update_staff ON public.videos FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY videos_delete_staff ON public.videos FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- video_overlay_questions
CREATE POLICY voq_select_authenticated ON public.video_overlay_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY voq_insert_staff ON public.video_overlay_questions FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY voq_update_staff ON public.video_overlay_questions FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY voq_delete_staff ON public.video_overlay_questions FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- questions
CREATE POLICY questions_select_authenticated ON public.questions FOR SELECT TO authenticated USING (true);
CREATE POLICY questions_insert_staff ON public.questions FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY questions_update_staff ON public.questions FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY questions_delete_staff ON public.questions FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- notions
CREATE POLICY notions_select_authenticated ON public.notions FOR SELECT TO authenticated USING (true);
CREATE POLICY notions_insert_staff ON public.notions FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY notions_update_staff ON public.notions FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY notions_delete_staff ON public.notions FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- video_notions
CREATE POLICY video_notions_select_authenticated ON public.video_notions FOR SELECT TO authenticated USING (true);
CREATE POLICY video_notions_insert_staff ON public.video_notions FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY video_notions_update_staff ON public.video_notions FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY video_notions_delete_staff ON public.video_notions FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- question_notions
CREATE POLICY question_notions_select_authenticated ON public.question_notions FOR SELECT TO authenticated USING (true);
CREATE POLICY question_notions_insert_staff ON public.question_notions FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY question_notions_update_staff ON public.question_notions FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY question_notions_delete_staff ON public.question_notions FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- exams_bloc
CREATE POLICY exams_bloc_select_authenticated ON public.exams_bloc FOR SELECT TO authenticated USING (true);
CREATE POLICY exams_bloc_insert_staff ON public.exams_bloc FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY exams_bloc_update_staff ON public.exams_bloc FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY exams_bloc_delete_staff ON public.exams_bloc FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- exams_final
CREATE POLICY exams_final_select_authenticated ON public.exams_final FOR SELECT TO authenticated USING (true);
CREATE POLICY exams_final_insert_staff ON public.exams_final FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY exams_final_update_staff ON public.exams_final FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY exams_final_delete_staff ON public.exams_final FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- cas_pratiques
CREATE POLICY cas_pratiques_select_authenticated ON public.cas_pratiques FOR SELECT TO authenticated USING (true);
CREATE POLICY cas_pratiques_insert_staff ON public.cas_pratiques FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY cas_pratiques_update_staff ON public.cas_pratiques FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY cas_pratiques_delete_staff ON public.cas_pratiques FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- vault_documents
CREATE POLICY vault_documents_select_authenticated ON public.vault_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY vault_documents_insert_staff ON public.vault_documents FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY vault_documents_update_staff ON public.vault_documents FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY vault_documents_delete_staff ON public.vault_documents FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- course_item_vault_links
CREATE POLICY civl_select_authenticated ON public.course_item_vault_links FOR SELECT TO authenticated USING (true);
CREATE POLICY civl_insert_staff ON public.course_item_vault_links FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY civl_update_staff ON public.course_item_vault_links FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY civl_delete_staff ON public.course_item_vault_links FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- presentiel_sessions
CREATE POLICY presentiel_sessions_select_authenticated ON public.presentiel_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY presentiel_sessions_insert_staff ON public.presentiel_sessions FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY presentiel_sessions_update_staff ON public.presentiel_sessions FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY presentiel_sessions_delete_staff ON public.presentiel_sessions FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- revision_resources
CREATE POLICY revision_resources_select_authenticated ON public.revision_resources FOR SELECT TO authenticated USING (true);
CREATE POLICY revision_resources_insert_staff ON public.revision_resources FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY revision_resources_update_staff ON public.revision_resources FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY revision_resources_delete_staff ON public.revision_resources FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));

-- =============================================================================
-- TABLES SECRETES (1 seule policy par action -> pas de multiple permissive)
-- =============================================================================
CREATE POLICY video_overlay_answers_staff_only ON public.video_overlay_answers
  FOR ALL TO authenticated
  USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY question_answers_staff_only ON public.question_answers
  FOR ALL TO authenticated
  USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));

-- =============================================================================
-- DONNEES ELEVE : select self_or_staff ; insert/update self
-- =============================================================================
-- video_progress
CREATE POLICY video_progress_select_self_or_staff ON public.video_progress FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY video_progress_insert_self ON public.video_progress FOR INSERT TO authenticated WITH CHECK (learner_id = (select auth.uid()));
CREATE POLICY video_progress_update_self ON public.video_progress FOR UPDATE TO authenticated USING (learner_id = (select auth.uid())) WITH CHECK (learner_id = (select auth.uid()));
-- course_progress
CREATE POLICY course_progress_select_self_or_staff ON public.course_progress FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY course_progress_insert_self ON public.course_progress FOR INSERT TO authenticated WITH CHECK (learner_id = (select auth.uid()));
CREATE POLICY course_progress_update_self ON public.course_progress FOR UPDATE TO authenticated USING (learner_id = (select auth.uid())) WITH CHECK (learner_id = (select auth.uid()));
-- scheduled_reviews
CREATE POLICY scheduled_reviews_select_self_or_staff ON public.scheduled_reviews FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY scheduled_reviews_insert_self ON public.scheduled_reviews FOR INSERT TO authenticated WITH CHECK (learner_id = (select auth.uid()));
CREATE POLICY scheduled_reviews_update_self ON public.scheduled_reviews FOR UPDATE TO authenticated USING (learner_id = (select auth.uid())) WITH CHECK (learner_id = (select auth.uid()));
-- support_messages
CREATE POLICY support_messages_select_self_or_staff ON public.support_messages FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY support_messages_insert_self ON public.support_messages FOR INSERT TO authenticated WITH CHECK (learner_id = (select auth.uid()));
CREATE POLICY support_messages_update_staff ON public.support_messages FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
-- session_registrations (UPDATE self+staff fusionne)
CREATE POLICY session_registrations_select_self_or_staff ON public.session_registrations FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY session_registrations_insert_self ON public.session_registrations FOR INSERT TO authenticated WITH CHECK (learner_id = (select auth.uid()));
CREATE POLICY session_registrations_update ON public.session_registrations FOR UPDATE TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid()))) WITH CHECK (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
-- onboarding_results
CREATE POLICY onboarding_results_select_self_or_staff ON public.onboarding_results FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY onboarding_results_insert_self ON public.onboarding_results FOR INSERT TO authenticated WITH CHECK (learner_id = (select auth.uid()));
CREATE POLICY onboarding_results_update_self ON public.onboarding_results FOR UPDATE TO authenticated USING (learner_id = (select auth.uid())) WITH CHECK (learner_id = (select auth.uid()));
-- positioning_results
CREATE POLICY positioning_results_select_self_or_staff ON public.positioning_results FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY positioning_results_insert_self ON public.positioning_results FOR INSERT TO authenticated WITH CHECK (learner_id = (select auth.uid()));
CREATE POLICY positioning_results_update_self ON public.positioning_results FOR UPDATE TO authenticated USING (learner_id = (select auth.uid())) WITH CHECK (learner_id = (select auth.uid()));
-- video_reports
CREATE POLICY video_reports_select_self_or_staff ON public.video_reports FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY video_reports_insert_self ON public.video_reports FOR INSERT TO authenticated WITH CHECK (learner_id = (select auth.uid()));
CREATE POLICY video_reports_update_staff ON public.video_reports FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));

-- =============================================================================
-- TABLES IMMUABLES via RPC : select self_or_staff ; DENY ecritures authenticated
-- =============================================================================
CREATE POLICY exam_attempts_select_self_or_staff ON public.exam_attempts FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY question_responses_select_self_or_staff ON public.question_responses FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY vault_unlocks_select_self_or_staff ON public.vault_unlocks FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY vault_signatures_select_self_or_staff ON public.vault_signatures FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));

CREATE POLICY exam_attempts_no_insert ON public.exam_attempts FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY exam_attempts_no_update ON public.exam_attempts FOR UPDATE TO authenticated USING (false);
CREATE POLICY exam_attempts_no_delete ON public.exam_attempts FOR DELETE TO authenticated USING (false);
CREATE POLICY question_responses_no_insert ON public.question_responses FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY question_responses_no_update ON public.question_responses FOR UPDATE TO authenticated USING (false);
CREATE POLICY question_responses_no_delete ON public.question_responses FOR DELETE TO authenticated USING (false);
CREATE POLICY vault_unlocks_no_insert ON public.vault_unlocks FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY vault_unlocks_no_update ON public.vault_unlocks FOR UPDATE TO authenticated USING (false);
CREATE POLICY vault_unlocks_no_delete ON public.vault_unlocks FOR DELETE TO authenticated USING (false);
CREATE POLICY vault_signatures_no_update ON public.vault_signatures FOR UPDATE TO authenticated USING (false);
CREATE POLICY vault_signatures_no_delete ON public.vault_signatures FOR DELETE TO authenticated USING (false);

-- =============================================================================
-- PROGRESSION ETAT + WEBHOOK : select self_or_staff (ecritures RPC/service_role)
-- =============================================================================
CREATE POLICY enrollments_select_self_or_staff ON public.enrollments FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY final_exam_progress_select_self_or_staff ON public.final_exam_progress FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY bloc_progress_select_self_or_staff ON public.bloc_progress FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY engagement_tracking_select_self_or_staff ON public.engagement_tracking FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY payment_transactions_select_self_or_staff ON public.payment_transactions FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY engagement_reminders_select_self_or_staff ON public.engagement_reminders FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));

-- =============================================================================
-- CAS PRATIQUE SUBMISSIONS
-- =============================================================================
CREATE POLICY cas_pratique_submissions_select_self_or_staff ON public.cas_pratique_submissions FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY cas_pratique_submissions_insert_self ON public.cas_pratique_submissions FOR INSERT TO authenticated WITH CHECK (learner_id = (select auth.uid()));
CREATE POLICY cas_pratique_submissions_update_staff ON public.cas_pratique_submissions FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));

-- =============================================================================
-- SATISFACTION SURVEYS (UPDATE self+staff fusionne)
-- =============================================================================
CREATE POLICY satisfaction_surveys_select_self_or_staff ON public.satisfaction_surveys FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY satisfaction_surveys_insert_self ON public.satisfaction_surveys FOR INSERT TO authenticated WITH CHECK (learner_id = (select auth.uid()));
CREATE POLICY satisfaction_surveys_update ON public.satisfaction_surveys FOR UPDATE TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid()))) WITH CHECK (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));

-- =============================================================================
-- PRE-ENROLLMENT (formulaire public)
-- =============================================================================
CREATE POLICY pre_enrollment_answers_insert_public ON public.pre_enrollment_answers
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    ((select auth.uid()) IS NULL AND learner_id IS NULL)
    OR ((select auth.uid()) IS NOT NULL AND learner_id = (select auth.uid()))
    OR ((select auth.uid()) IS NOT NULL AND learner_id IS NULL)
  );
CREATE POLICY pre_enrollment_answers_select_self_or_staff ON public.pre_enrollment_answers
  FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));

-- =============================================================================
-- USER_DOCUMENTS (ecriture staff par action) & CHATBOT_MESSAGES
-- =============================================================================
CREATE POLICY user_documents_select_self_or_staff ON public.user_documents FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY user_documents_insert_staff ON public.user_documents FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY user_documents_update_staff ON public.user_documents FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY user_documents_delete_staff ON public.user_documents FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));

CREATE POLICY chatbot_messages_select_self_or_staff ON public.chatbot_messages FOR SELECT TO authenticated USING (learner_id = (select auth.uid()) OR (select public.is_staff(auth.uid())));
CREATE POLICY chatbot_messages_insert_self ON public.chatbot_messages FOR INSERT TO authenticated WITH CHECK (learner_id = (select auth.uid()));

-- =============================================================================
-- PLATFORM_SETTINGS (singleton)
-- =============================================================================
CREATE POLICY platform_settings_select_authenticated ON public.platform_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY platform_settings_update_staff ON public.platform_settings FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));

-- =============================================================================
-- CMS site vitrine (ecriture staff par action)
-- =============================================================================
-- site_content
CREATE POLICY site_content_select_public ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY site_content_insert_staff ON public.site_content FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY site_content_update_staff ON public.site_content FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY site_content_delete_staff ON public.site_content FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- site_collections
CREATE POLICY site_collections_select_published ON public.site_collections FOR SELECT TO anon, authenticated USING (published OR (select public.is_staff(auth.uid())));
CREATE POLICY site_collections_insert_staff ON public.site_collections FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY site_collections_update_staff ON public.site_collections FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY site_collections_delete_staff ON public.site_collections FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- site_media
CREATE POLICY site_media_select_public ON public.site_media FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY site_media_insert_staff ON public.site_media FOR INSERT TO authenticated WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY site_media_update_staff ON public.site_media FOR UPDATE TO authenticated USING ((select public.is_staff(auth.uid()))) WITH CHECK ((select public.is_staff(auth.uid())));
CREATE POLICY site_media_delete_staff ON public.site_media FOR DELETE TO authenticated USING ((select public.is_staff(auth.uid())));
-- site_content_versions (lecture staff)
CREATE POLICY site_content_versions_select_staff ON public.site_content_versions FOR SELECT TO authenticated USING ((select public.is_staff(auth.uid())));
