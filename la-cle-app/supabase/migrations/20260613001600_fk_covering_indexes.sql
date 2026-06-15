-- =============================================================================
-- 16_fk_covering_indexes.sql
-- Index couvrants sur les 28 cles etrangeres sans index (advisor
-- unindexed_foreign_keys). Ameliore les jointures et les CASCADE/SET NULL.
-- =============================================================================

CREATE INDEX IF NOT EXISTS bloc_progress_bloc_id_idx                 ON public.bloc_progress (bloc_id);
CREATE INDEX IF NOT EXISTS cas_pratique_submissions_corrector_id_idx ON public.cas_pratique_submissions (corrector_id);
CREATE INDEX IF NOT EXISTS cas_pratique_submissions_learner_id_idx   ON public.cas_pratique_submissions (learner_id);
CREATE INDEX IF NOT EXISTS chatbot_messages_notion_id_idx            ON public.chatbot_messages (notion_id);
CREATE INDEX IF NOT EXISTS course_item_vault_links_doc_id_idx        ON public.course_item_vault_links (vault_document_id);
CREATE INDEX IF NOT EXISTS course_progress_cours_id_idx              ON public.course_progress (cours_id);
CREATE INDEX IF NOT EXISTS enrollments_formation_id_idx              ON public.enrollments (formation_id);
CREATE INDEX IF NOT EXISTS exam_attempts_exam_bloc_id_idx            ON public.exam_attempts (exam_bloc_id);
CREATE INDEX IF NOT EXISTS exam_attempts_exam_final_id_idx           ON public.exam_attempts (exam_final_id);
CREATE INDEX IF NOT EXISTS final_exam_progress_exam_final_id_idx     ON public.final_exam_progress (exam_final_id);
CREATE INDEX IF NOT EXISTS payment_transactions_enrollment_id_idx    ON public.payment_transactions (enrollment_id);
CREATE INDEX IF NOT EXISTS payment_transactions_learner_id_idx       ON public.payment_transactions (learner_id);
CREATE INDEX IF NOT EXISTS positioning_results_formation_id_idx      ON public.positioning_results (formation_id);
CREATE INDEX IF NOT EXISTS presentiel_sessions_formation_id_idx      ON public.presentiel_sessions (formation_id);
CREATE INDEX IF NOT EXISTS question_responses_reviewer_id_idx        ON public.question_responses (reviewer_id);
CREATE INDEX IF NOT EXISTS satisfaction_surveys_formation_id_idx     ON public.satisfaction_surveys (formation_id);
CREATE INDEX IF NOT EXISTS satisfaction_surveys_learner_id_idx       ON public.satisfaction_surveys (learner_id);
CREATE INDEX IF NOT EXISTS scheduled_reviews_question_id_idx         ON public.scheduled_reviews (question_id);
CREATE INDEX IF NOT EXISTS session_registrations_learner_id_idx      ON public.session_registrations (learner_id);
CREATE INDEX IF NOT EXISTS site_collections_updated_by_idx           ON public.site_collections (updated_by);
CREATE INDEX IF NOT EXISTS site_content_updated_by_idx               ON public.site_content (updated_by);
CREATE INDEX IF NOT EXISTS site_content_versions_changed_by_idx      ON public.site_content_versions (changed_by);
CREATE INDEX IF NOT EXISTS site_media_uploaded_by_idx                ON public.site_media (uploaded_by);
CREATE INDEX IF NOT EXISTS vault_signatures_doc_id_idx               ON public.vault_signatures (vault_document_id);
CREATE INDEX IF NOT EXISTS vault_unlocks_doc_id_idx                  ON public.vault_unlocks (vault_document_id);
CREATE INDEX IF NOT EXISTS video_progress_video_id_idx               ON public.video_progress (video_id);
CREATE INDEX IF NOT EXISTS video_reports_learner_id_idx              ON public.video_reports (learner_id);
CREATE INDEX IF NOT EXISTS video_reports_video_id_idx                ON public.video_reports (video_id);
