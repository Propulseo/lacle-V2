-- =============================================================================
-- 09_rls.sql — Row Level Security : ENABLE + policies pour les 44 tables.
-- LMS La Cle Institut. Postgres 15 / Supabase.
--
-- Helper central : is_staff(auth.uid()) = profiles.role IN ('admin','formateur')
--   (cree en 02_identity_hierarchy.sql, SECURITY DEFINER STABLE).
-- Convention "self" : learner_id = auth.uid() (ou id = auth.uid() pour profiles).
--
-- Tables CONTENU      : SELECT authenticated ; INSERT/UPDATE/DELETE is_staff().
-- Tables SECRETES     : ALL is_staff() uniquement (jamais authenticated).
-- Tables DONNEES ELEVE: SELECT self OR is_staff ; INSERT/UPDATE self.
-- Tables IMMUABLES RPC: SELECT self OR is_staff ; AUCUNE ecriture authenticated
--                       (les RPC SECURITY DEFINER bypassent la RLS).
-- =============================================================================


-- =============================================================================
-- 1. ENABLE ROW LEVEL SECURITY sur les 44 tables
-- =============================================================================

-- 02_identity_hierarchy
ALTER TABLE public.profiles                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formations               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocs                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cours                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_items             ENABLE ROW LEVEL SECURITY;

-- 03_content
ALTER TABLE public.videos                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_overlay_questions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_overlay_answers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_answers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notions                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_notions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_notions         ENABLE ROW LEVEL SECURITY;

-- 04_exams
ALTER TABLE public.exams_bloc               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams_final              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.final_exam_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bloc_progress            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cas_pratiques            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cas_pratique_submissions ENABLE ROW LEVEL SECURITY;

-- 05_enrollment_vault
ALTER TABLE public.enrollments              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_documents          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_item_vault_links  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_unlocks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_signatures         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents           ENABLE ROW LEVEL SECURITY;

-- 06_progress
ALTER TABLE public.video_progress           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_responses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_reports            ENABLE ROW LEVEL SECURITY;

-- 07_qualiopi_annex
ALTER TABLE public.pre_enrollment_answers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_results       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positioning_results      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_tracking      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_reminders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.satisfaction_surveys     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presentiel_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_registrations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_resources       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_messages         ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- 2. PROFILES — self SELECT/UPDATE ; staff SELECT/UPDATE tous ;
--    INSERT via trigger handle_new_user (SECURITY DEFINER, bypass RLS).
-- =============================================================================

CREATE POLICY profiles_select_self_or_staff ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_staff(auth.uid()));

CREATE POLICY profiles_update_self ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY profiles_update_staff ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));


-- =============================================================================
-- 3. TABLES CONTENU — SELECT authenticated ; ecritures is_staff()
--    (formations, blocs, cours, course_items, videos, video_overlay_questions,
--     questions, notions, video_notions, question_notions, exams_bloc,
--     exams_final, cas_pratiques, vault_documents, course_item_vault_links,
--     presentiel_sessions, revision_resources)
-- =============================================================================

-- formations
CREATE POLICY formations_select_authenticated ON public.formations
  FOR SELECT TO authenticated USING (true);
CREATE POLICY formations_write_staff ON public.formations
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- blocs
CREATE POLICY blocs_select_authenticated ON public.blocs
  FOR SELECT TO authenticated USING (true);
CREATE POLICY blocs_write_staff ON public.blocs
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- cours
CREATE POLICY cours_select_authenticated ON public.cours
  FOR SELECT TO authenticated USING (true);
CREATE POLICY cours_write_staff ON public.cours
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- course_items
CREATE POLICY course_items_select_authenticated ON public.course_items
  FOR SELECT TO authenticated USING (true);
CREATE POLICY course_items_write_staff ON public.course_items
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- videos
CREATE POLICY videos_select_authenticated ON public.videos
  FOR SELECT TO authenticated USING (true);
CREATE POLICY videos_write_staff ON public.videos
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- video_overlay_questions (le choix visible ; la reponse correcte est ailleurs)
CREATE POLICY video_overlay_questions_select_authenticated ON public.video_overlay_questions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY video_overlay_questions_write_staff ON public.video_overlay_questions
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- questions (le contenu/options visible ; la reponse correcte est ailleurs)
CREATE POLICY questions_select_authenticated ON public.questions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY questions_write_staff ON public.questions
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- notions
CREATE POLICY notions_select_authenticated ON public.notions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY notions_write_staff ON public.notions
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- video_notions
CREATE POLICY video_notions_select_authenticated ON public.video_notions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY video_notions_write_staff ON public.video_notions
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- question_notions
CREATE POLICY question_notions_select_authenticated ON public.question_notions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY question_notions_write_staff ON public.question_notions
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- exams_bloc
CREATE POLICY exams_bloc_select_authenticated ON public.exams_bloc
  FOR SELECT TO authenticated USING (true);
CREATE POLICY exams_bloc_write_staff ON public.exams_bloc
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- exams_final
CREATE POLICY exams_final_select_authenticated ON public.exams_final
  FOR SELECT TO authenticated USING (true);
CREATE POLICY exams_final_write_staff ON public.exams_final
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- cas_pratiques
CREATE POLICY cas_pratiques_select_authenticated ON public.cas_pratiques
  FOR SELECT TO authenticated USING (true);
CREATE POLICY cas_pratiques_write_staff ON public.cas_pratiques
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- vault_documents
CREATE POLICY vault_documents_select_authenticated ON public.vault_documents
  FOR SELECT TO authenticated USING (true);
CREATE POLICY vault_documents_write_staff ON public.vault_documents
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- course_item_vault_links
CREATE POLICY course_item_vault_links_select_authenticated ON public.course_item_vault_links
  FOR SELECT TO authenticated USING (true);
CREATE POLICY course_item_vault_links_write_staff ON public.course_item_vault_links
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- presentiel_sessions
CREATE POLICY presentiel_sessions_select_authenticated ON public.presentiel_sessions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY presentiel_sessions_write_staff ON public.presentiel_sessions
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- revision_resources
CREATE POLICY revision_resources_select_authenticated ON public.revision_resources
  FOR SELECT TO authenticated USING (true);
CREATE POLICY revision_resources_write_staff ON public.revision_resources
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));


-- =============================================================================
-- 4. TABLES SECRETES — staff-only (jamais authenticated).
--    correct_answer / explanation : le scoring eleve passe par RPC SECURITY DEFINER.
-- =============================================================================

CREATE POLICY video_overlay_answers_staff_only ON public.video_overlay_answers
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY question_answers_staff_only ON public.question_answers
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));


-- =============================================================================
-- 5. TABLES DONNEES ELEVE — SELECT self OR is_staff ; INSERT/UPDATE self.
--    (video_progress, course_progress, scheduled_reviews, support_messages,
--     session_registrations, onboarding_results, positioning_results,
--     video_reports)
-- =============================================================================

-- video_progress
CREATE POLICY video_progress_select_self_or_staff ON public.video_progress
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY video_progress_insert_self ON public.video_progress
  FOR INSERT TO authenticated
  WITH CHECK (learner_id = auth.uid());
CREATE POLICY video_progress_update_self ON public.video_progress
  FOR UPDATE TO authenticated
  USING (learner_id = auth.uid())
  WITH CHECK (learner_id = auth.uid());

-- course_progress
CREATE POLICY course_progress_select_self_or_staff ON public.course_progress
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY course_progress_insert_self ON public.course_progress
  FOR INSERT TO authenticated
  WITH CHECK (learner_id = auth.uid());
CREATE POLICY course_progress_update_self ON public.course_progress
  FOR UPDATE TO authenticated
  USING (learner_id = auth.uid())
  WITH CHECK (learner_id = auth.uid());

-- scheduled_reviews
CREATE POLICY scheduled_reviews_select_self_or_staff ON public.scheduled_reviews
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY scheduled_reviews_insert_self ON public.scheduled_reviews
  FOR INSERT TO authenticated
  WITH CHECK (learner_id = auth.uid());
CREATE POLICY scheduled_reviews_update_self ON public.scheduled_reviews
  FOR UPDATE TO authenticated
  USING (learner_id = auth.uid())
  WITH CHECK (learner_id = auth.uid());

-- support_messages
CREATE POLICY support_messages_select_self_or_staff ON public.support_messages
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY support_messages_insert_self ON public.support_messages
  FOR INSERT TO authenticated
  WITH CHECK (learner_id = auth.uid());
-- la reponse (reply) est ecrite par le staff
CREATE POLICY support_messages_update_staff ON public.support_messages
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- session_registrations
CREATE POLICY session_registrations_select_self_or_staff ON public.session_registrations
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY session_registrations_insert_self ON public.session_registrations
  FOR INSERT TO authenticated
  WITH CHECK (learner_id = auth.uid());
CREATE POLICY session_registrations_update_self ON public.session_registrations
  FOR UPDATE TO authenticated
  USING (learner_id = auth.uid())
  WITH CHECK (learner_id = auth.uid());
-- l'emargement (attended) est aussi gere par le staff
CREATE POLICY session_registrations_update_staff ON public.session_registrations
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- onboarding_results
CREATE POLICY onboarding_results_select_self_or_staff ON public.onboarding_results
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY onboarding_results_insert_self ON public.onboarding_results
  FOR INSERT TO authenticated
  WITH CHECK (learner_id = auth.uid());
CREATE POLICY onboarding_results_update_self ON public.onboarding_results
  FOR UPDATE TO authenticated
  USING (learner_id = auth.uid())
  WITH CHECK (learner_id = auth.uid());

-- positioning_results
CREATE POLICY positioning_results_select_self_or_staff ON public.positioning_results
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY positioning_results_insert_self ON public.positioning_results
  FOR INSERT TO authenticated
  WITH CHECK (learner_id = auth.uid());
CREATE POLICY positioning_results_update_self ON public.positioning_results
  FOR UPDATE TO authenticated
  USING (learner_id = auth.uid())
  WITH CHECK (learner_id = auth.uid());

-- video_reports
CREATE POLICY video_reports_select_self_or_staff ON public.video_reports
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY video_reports_insert_self ON public.video_reports
  FOR INSERT TO authenticated
  WITH CHECK (learner_id = auth.uid());
-- la resolution (status, resolution_notes) est traitee par le staff
CREATE POLICY video_reports_update_staff ON public.video_reports
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));


-- =============================================================================
-- 6. TABLES IMMUABLES via RPC — SELECT self OR is_staff ;
--    AUCUNE policy INSERT/UPDATE/DELETE pour authenticated.
--    (exam_attempts, question_responses, vault_unlocks, vault_signatures)
--    Les RPC SECURITY DEFINER ecrivent en bypassant la RLS.
-- =============================================================================

CREATE POLICY exam_attempts_select_self_or_staff ON public.exam_attempts
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE POLICY question_responses_select_self_or_staff ON public.question_responses
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE POLICY vault_unlocks_select_self_or_staff ON public.vault_unlocks
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE POLICY vault_signatures_select_self_or_staff ON public.vault_signatures
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));

-- M5 (defense-in-depth) : DENY explicite des ecritures directes par authenticated
-- sur les tables immuables. Fonctionnellement deja interdit (deny-by-default,
-- aucune policy d'ecriture), mais les policies USING(false)/WITH CHECK(false)
-- rendent l'intention "ecriture RPC uniquement" lisible et fail-fast.
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
-- 7. PROGRESSION ETAT — SELECT self OR is_staff ;
--    ecritures via RPC/webhook/staff (pas d'INSERT/UPDATE authenticated direct).
--    (enrollments, final_exam_progress, bloc_progress, engagement_tracking)
-- =============================================================================

CREATE POLICY enrollments_select_self_or_staff ON public.enrollments
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE POLICY final_exam_progress_select_self_or_staff ON public.final_exam_progress
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE POLICY bloc_progress_select_self_or_staff ON public.bloc_progress
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE POLICY engagement_tracking_select_self_or_staff ON public.engagement_tracking
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));


-- =============================================================================
-- 8. WEBHOOK / SERVICE_ROLE — SELECT self OR is_staff ;
--    aucune policy authenticated d'ecriture (ecrit par service_role/webhook,
--    qui bypasse la RLS).
--    (payment_transactions, engagement_reminders)
-- =============================================================================

CREATE POLICY payment_transactions_select_self_or_staff ON public.payment_transactions
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE POLICY engagement_reminders_select_self_or_staff ON public.engagement_reminders
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));


-- =============================================================================
-- 9. CAS PRATIQUE SUBMISSIONS — SELECT self OR is_staff ; INSERT self ;
--    UPDATE (correction) is_staff() seulement.
-- =============================================================================

CREATE POLICY cas_pratique_submissions_select_self_or_staff ON public.cas_pratique_submissions
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY cas_pratique_submissions_insert_self ON public.cas_pratique_submissions
  FOR INSERT TO authenticated
  WITH CHECK (learner_id = auth.uid());
CREATE POLICY cas_pratique_submissions_update_staff ON public.cas_pratique_submissions
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));


-- =============================================================================
-- 10. SATISFACTION SURVEYS — SELECT self OR is_staff ;
--     INSERT/UPDATE self ; publication is_staff().
--     L'acces "froid" par access_token passe par RPC (pas de policy ouverte).
-- =============================================================================

CREATE POLICY satisfaction_surveys_select_self_or_staff ON public.satisfaction_surveys
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY satisfaction_surveys_insert_self ON public.satisfaction_surveys
  FOR INSERT TO authenticated
  WITH CHECK (learner_id = auth.uid());
CREATE POLICY satisfaction_surveys_update_self ON public.satisfaction_surveys
  FOR UPDATE TO authenticated
  USING (learner_id = auth.uid())
  WITH CHECK (learner_id = auth.uid());
-- la publication (is_published) du temoignage est validee par le staff
CREATE POLICY satisfaction_surveys_update_staff ON public.satisfaction_surveys
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));


-- =============================================================================
-- 11. PRE-ENROLLMENT ANSWERS — formulaire public.
--     INSERT autorise a anon + authenticated ; SELECT self OR is_staff.
-- =============================================================================

-- A3 : pas de WITH CHECK (true) — un authentifie ne peut rattacher la reponse
-- qu'a LUI-MEME (ou la laisser non rattachee) ; un prospect anonyme n'a pas de learner_id.
CREATE POLICY pre_enrollment_answers_insert_public ON public.pre_enrollment_answers
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NULL AND learner_id IS NULL)             -- prospect anonyme (contact_email seul)
    OR (auth.uid() IS NOT NULL AND learner_id = auth.uid()) -- inscrit : sa propre ligne
    OR (auth.uid() IS NOT NULL AND learner_id IS NULL)      -- authentifie pas encore rattache
  );
CREATE POLICY pre_enrollment_answers_select_self_or_staff ON public.pre_enrollment_answers
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));


-- =============================================================================
-- 12. USER_DOCUMENTS & CHATBOT_MESSAGES
--     user_documents : SELECT self OR is_staff ; ecriture is_staff().
--     chatbot_messages : SELECT self OR is_staff ; INSERT self.
-- =============================================================================

CREATE POLICY user_documents_select_self_or_staff ON public.user_documents
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY user_documents_write_staff ON public.user_documents
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY chatbot_messages_select_self_or_staff ON public.chatbot_messages
  FOR SELECT TO authenticated
  USING (learner_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY chatbot_messages_insert_self ON public.chatbot_messages
  FOR INSERT TO authenticated
  WITH CHECK (learner_id = auth.uid());


-- =============================================================================
-- 13. PLATFORM_SETTINGS — singleton. SELECT authenticated ; UPDATE is_staff().
-- =============================================================================

CREATE POLICY platform_settings_select_authenticated ON public.platform_settings
  FOR SELECT TO authenticated USING (true);
CREATE POLICY platform_settings_update_staff ON public.platform_settings
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));
