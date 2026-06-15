-- =============================================================================
-- 18_rls_perf_storage.sql
-- Consolide les policies storage.objects en UNE par action (3 buckets en OR) :
--   - corrige auth_rls_initplan (auth.uid()/is_staff wrappes en (select ...))
--   - corrige multiple_permissive_policies (les 2 FOR ALL chevauchaient user-uploads)
-- Semantique conservee :
--   site-media       : objets servis par URL publique (RLS non consultee) ; staff gere/liste.
--   user-uploads     : <uid>/... self (read/insert/update) + staff ; delete staff only.
--   vault-documents  : staff only (eleves via signed URL server-side).
-- =============================================================================

DROP POLICY IF EXISTS site_media_write_staff             ON storage.objects;
DROP POLICY IF EXISTS user_uploads_read_self_or_staff    ON storage.objects;
DROP POLICY IF EXISTS user_uploads_insert_self_or_staff  ON storage.objects;
DROP POLICY IF EXISTS user_uploads_update_self_or_staff  ON storage.objects;
DROP POLICY IF EXISTS user_uploads_delete_staff          ON storage.objects;
DROP POLICY IF EXISTS vault_documents_all_staff          ON storage.objects;

-- SELECT (listing/lecture via API) : user-uploads self-or-staff ; site-media & vault staff.
CREATE POLICY lms_storage_select ON storage.objects
  FOR SELECT TO authenticated
  USING (
    (bucket_id = 'user-uploads'    AND ((storage.foldername(name))[1] = (select auth.uid())::text OR (select public.is_staff(auth.uid()))))
    OR (bucket_id = 'site-media'      AND (select public.is_staff(auth.uid())))
    OR (bucket_id = 'vault-documents' AND (select public.is_staff(auth.uid())))
  );

CREATE POLICY lms_storage_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    (bucket_id = 'user-uploads'    AND ((storage.foldername(name))[1] = (select auth.uid())::text OR (select public.is_staff(auth.uid()))))
    OR (bucket_id = 'site-media'      AND (select public.is_staff(auth.uid())))
    OR (bucket_id = 'vault-documents' AND (select public.is_staff(auth.uid())))
  );

CREATE POLICY lms_storage_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    (bucket_id = 'user-uploads'    AND ((storage.foldername(name))[1] = (select auth.uid())::text OR (select public.is_staff(auth.uid()))))
    OR (bucket_id = 'site-media'      AND (select public.is_staff(auth.uid())))
    OR (bucket_id = 'vault-documents' AND (select public.is_staff(auth.uid())))
  )
  WITH CHECK (
    (bucket_id = 'user-uploads'    AND ((storage.foldername(name))[1] = (select auth.uid())::text OR (select public.is_staff(auth.uid()))))
    OR (bucket_id = 'site-media'      AND (select public.is_staff(auth.uid())))
    OR (bucket_id = 'vault-documents' AND (select public.is_staff(auth.uid())))
  );

-- DELETE : staff uniquement sur les 3 buckets.
CREATE POLICY lms_storage_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id IN ('user-uploads', 'site-media', 'vault-documents')
    AND (select public.is_staff(auth.uid()))
  );
