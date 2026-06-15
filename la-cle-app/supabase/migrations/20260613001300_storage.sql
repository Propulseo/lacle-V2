-- =============================================================================
-- 20260613001300_storage.sql  [B1 - Buckets Storage + RLS storage.objects]
-- Sans ces buckets/policies, les colonnes file_url (vault_documents,
-- user_documents) et site_media (bucket/path) pointent dans le vide, et un
-- bucket sans policy = fuite. Les VIDEOS pedagogiques ne sont PAS ici (liens
-- YouTube/Vimeo externes, decision client).
--
-- Convention de chemin (a respecter cote Server Actions d'upload) :
--   user-uploads     : <learner_uid>/<filename>      -> foldername[1] = uid
--   vault-documents  : <formation_id>/<filename>      -> lecture eleve via URL
--                      SIGNEE generee server-side (apres verif vault_unlocks) ;
--                      pas de policy de lecture eleve directe (les signed URLs
--                      contournent la RLS, c'est voulu).
--   site-media       : libre (lecture publique).
-- Depend de is_staff() (fichier 00200).
-- =============================================================================

-- ----------------------------------------------------------------------------
-- Buckets
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-media', 'site-media', true)        -- images/docs du site vitrine (lecture publique)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', false)   -- documents nominatifs eleve (factures, contrats...)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('vault-documents', 'vault-documents', false)  -- catalogue documentaire du coffre
ON CONFLICT (id) DO NOTHING;

-- RLS est deja activee par defaut sur storage.objects (Supabase). On ajoute les policies.

-- ---- site-media : lecture publique, ecriture staff ----
CREATE POLICY site_media_read_public ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-media');

CREATE POLICY site_media_write_staff ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'site-media' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'site-media' AND public.is_staff(auth.uid()));

-- ---- user-uploads : <uid>/... — self (lecture/ecriture) + staff ; delete staff ----
CREATE POLICY user_uploads_read_self_or_staff ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'user-uploads'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_staff(auth.uid()))
  );

CREATE POLICY user_uploads_insert_self_or_staff ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'user-uploads'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_staff(auth.uid()))
  );

CREATE POLICY user_uploads_update_self_or_staff ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'user-uploads'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_staff(auth.uid()))
  )
  WITH CHECK (
    bucket_id = 'user-uploads'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_staff(auth.uid()))
  );

CREATE POLICY user_uploads_delete_staff ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'user-uploads' AND public.is_staff(auth.uid()));

-- ---- vault-documents : ecriture/lecture staff seulement ----
-- (les eleves accedent au document debloque via une URL SIGNEE generee
--  server-side apres verification de vault_unlocks ; pas de policy eleve directe)
CREATE POLICY vault_documents_all_staff ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'vault-documents' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'vault-documents' AND public.is_staff(auth.uid()));
