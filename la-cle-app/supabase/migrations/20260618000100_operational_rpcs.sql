-- =============================================================================
-- 20260618000100_operational_rpcs.sql  [Phase 1 — chemins d'ecriture manquants]
-- Les tables enrollments / final_exam_progress / vault_signatures n'ont PAS de
-- policy d'ecriture pour authenticated (par design : ecriture via RPC DEFINER).
-- Ces RPC fournissent les chemins serveur surs qui manquaient (consentement,
-- statut, certification, demande/planif examen final, signature de document).
-- Style aligne sur 20260613001000_functions_rpc.sql (DEFINER, search_path fige,
-- RAISE avec errcodes). GRANT EXECUTE TO authenticated en fin de fichier.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- accept_enrollment_terms(p_kind) [self] : enregistre le consentement horodate
-- (contrat OU CGV) sur l'inscription de l'appelant. Remplace le localStorage.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.accept_enrollment_terms(p_kind text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_now timestamptz := now();
  v_row public.enrollments%rowtype;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentification requise.' USING errcode = '28000';
  END IF;
  IF p_kind NOT IN ('contract', 'cgv') THEN
    RAISE EXCEPTION 'Type de consentement invalide (contract|cgv).' USING errcode = '22023';
  END IF;

  IF p_kind = 'contract' THEN
    UPDATE public.enrollments
       SET contract_signed = true,
           contract_signed_at = COALESCE(contract_signed_at, v_now)
     WHERE learner_id = v_uid
     RETURNING * INTO v_row;
  ELSE
    UPDATE public.enrollments
       SET cgv_accepted = true,
           cgv_accepted_at = COALESCE(cgv_accepted_at, v_now)
     WHERE learner_id = v_uid
     RETURNING * INTO v_row;
  END IF;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inscription introuvable pour cet apprenant.' USING errcode = 'P0002';
  END IF;

  RETURN jsonb_build_object(
    'contract_signed', v_row.contract_signed,
    'contract_signed_at', v_row.contract_signed_at,
    'cgv_accepted', v_row.cgv_accepted,
    'cgv_accepted_at', v_row.cgv_accepted_at
  );
END;
$$;

COMMENT ON FUNCTION public.accept_enrollment_terms(text) IS
  'Self: enregistre le consentement horodate (contrat|CGV) sur l''inscription de auth.uid(). Ecrit enrollments malgre l''absence de policy UPDATE (DEFINER).';

-- -----------------------------------------------------------------------------
-- set_enrollment_status(p_learner, p_status) [staff] : changement de statut
-- administratif. Pose enrolled_at / certified_at quand pertinent.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_enrollment_status(
  p_learner uuid,
  p_status  public.student_status
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_now timestamptz := now();
  v_row public.enrollments%rowtype;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Action reservee au staff.' USING errcode = '42501';
  END IF;

  UPDATE public.enrollments
     SET status = p_status,
         enrolled_at  = CASE WHEN p_status = 'inscrit'  THEN COALESCE(enrolled_at, v_now)  ELSE enrolled_at  END,
         certified_at = CASE WHEN p_status = 'certifie' THEN COALESCE(certified_at, v_now) ELSE certified_at END
   WHERE learner_id = p_learner
   RETURNING * INTO v_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inscription introuvable.' USING errcode = 'P0002';
  END IF;

  RETURN jsonb_build_object('status', v_row.status, 'enrolled_at', v_row.enrolled_at, 'certified_at', v_row.certified_at);
END;
$$;

COMMENT ON FUNCTION public.set_enrollment_status(uuid, public.student_status) IS
  'Staff: change le statut d''inscription d''un apprenant (decouverte/inscrit/bloque/certifie) + horodatages derives.';

-- -----------------------------------------------------------------------------
-- certify_learner(p_learner) [staff] : certifie un apprenant SI son examen final
-- est reussi (final_exam_progress.status='passed'). Le certificat est un
-- vault_document (available_from='certifie') deverrouille par le statut via
-- learner_vault_view — pas un insert ici.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.certify_learner(p_learner uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_now timestamptz := now();
  v_row public.enrollments%rowtype;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Action reservee au staff.' USING errcode = '42501';
  END IF;

  PERFORM 1 FROM public.final_exam_progress
    WHERE learner_id = p_learner AND status = 'passed';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Examen final non reussi : certification impossible.' USING errcode = 'P0001';
  END IF;

  UPDATE public.enrollments
     SET status = 'certifie',
         certified_at = COALESCE(certified_at, v_now)
   WHERE learner_id = p_learner
   RETURNING * INTO v_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inscription introuvable.' USING errcode = 'P0002';
  END IF;

  RETURN jsonb_build_object('status', v_row.status, 'certified_at', v_row.certified_at);
END;
$$;

COMMENT ON FUNCTION public.certify_learner(uuid) IS
  'Staff: passe l''apprenant a certifie (+ certified_at) si son examen final est passed. Le certificat vault se deverrouille par le statut.';

-- -----------------------------------------------------------------------------
-- request_final_exam() [self] : l'apprenant demande son examen final (formation
-- de son inscription). Upsert final_exam_progress -> 'requested'.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.request_final_exam()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid       uuid := auth.uid();
  v_now       timestamptz := now();
  v_formation uuid;
  v_exam      uuid;
  v_row       public.final_exam_progress%rowtype;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentification requise.' USING errcode = '28000';
  END IF;

  SELECT e.formation_id INTO v_formation FROM public.enrollments e WHERE e.learner_id = v_uid;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inscription introuvable.' USING errcode = 'P0002';
  END IF;

  SELECT ef.id INTO v_exam FROM public.exams_final ef WHERE ef.formation_id = v_formation;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Examen final non configure pour cette formation.' USING errcode = 'P0002';
  END IF;

  INSERT INTO public.final_exam_progress (learner_id, exam_final_id, status, requested_at, updated_at)
  VALUES (v_uid, v_exam, 'requested', v_now, v_now)
  ON CONFLICT (learner_id, exam_final_id) DO UPDATE SET
    status       = CASE WHEN public.final_exam_progress.status = 'not_started'
                        THEN 'requested'::public.final_exam_status
                        ELSE public.final_exam_progress.status END,
    requested_at = COALESCE(public.final_exam_progress.requested_at, v_now),
    updated_at   = v_now
  RETURNING * INTO v_row;

  RETURN jsonb_build_object('id', v_row.id, 'status', v_row.status, 'requested_at', v_row.requested_at);
END;
$$;

COMMENT ON FUNCTION public.request_final_exam() IS
  'Self: demande d''examen final (formation de l''inscription de auth.uid()). Upsert final_exam_progress -> requested.';

-- -----------------------------------------------------------------------------
-- schedule_final_exam(p_progress_id, p_scheduled_at) [staff] : planifie une date.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.schedule_final_exam(
  p_progress_id uuid,
  p_scheduled_at timestamptz
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_row public.final_exam_progress%rowtype;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Action reservee au staff.' USING errcode = '42501';
  END IF;
  IF p_scheduled_at IS NULL THEN
    RAISE EXCEPTION 'Date de planification requise.' USING errcode = '22023';
  END IF;

  UPDATE public.final_exam_progress
     SET status = 'scheduled', scheduled_at = p_scheduled_at, updated_at = now()
   WHERE id = p_progress_id
   RETURNING * INTO v_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Demande d''examen final introuvable.' USING errcode = 'P0002';
  END IF;

  RETURN jsonb_build_object('id', v_row.id, 'status', v_row.status, 'scheduled_at', v_row.scheduled_at);
END;
$$;

COMMENT ON FUNCTION public.schedule_final_exam(uuid, timestamptz) IS
  'Staff: planifie la date d''un examen final (final_exam_progress -> scheduled).';

-- -----------------------------------------------------------------------------
-- sign_vault_document(p_vault_document_id, p_meta) [self] : signe un document du
-- coffre SI deverrouille (learner_vault_view.is_unlocked). Trace immuable.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sign_vault_document(
  p_vault_document_id uuid,
  p_meta jsonb DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_now timestamptz := now();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentification requise.' USING errcode = '28000';
  END IF;

  PERFORM 1 FROM public.learner_vault_view v
   WHERE v.learner_id = v_uid
     AND v.vault_document_id = p_vault_document_id
     AND v.is_unlocked;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Document non deverrouille ou introuvable.' USING errcode = '42501';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.vault_signatures
     WHERE learner_id = v_uid AND vault_document_id = p_vault_document_id
  ) THEN
    RAISE EXCEPTION 'Document deja signe.' USING errcode = 'P0001';
  END IF;

  INSERT INTO public.vault_signatures (learner_id, vault_document_id, signed_at, signature_meta)
  VALUES (v_uid, p_vault_document_id, v_now, p_meta);

  RETURN jsonb_build_object('signed', true, 'signed_at', v_now);
END;
$$;

COMMENT ON FUNCTION public.sign_vault_document(uuid, jsonb) IS
  'Self: signe un document du coffre deverrouille (trace immuable vault_signatures). DEFINER : ecrit malgre l''absence de policy INSERT.';

-- -----------------------------------------------------------------------------
-- GRANTS : appelables par les utilisateurs connectes (la fonction filtre staff/self).
-- -----------------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.accept_enrollment_terms(text)              TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_enrollment_status(uuid, public.student_status) TO authenticated;
GRANT EXECUTE ON FUNCTION public.certify_learner(uuid)                      TO authenticated;
GRANT EXECUTE ON FUNCTION public.request_final_exam()                       TO authenticated;
GRANT EXECUTE ON FUNCTION public.schedule_final_exam(uuid, timestamptz)     TO authenticated;
GRANT EXECUTE ON FUNCTION public.sign_vault_document(uuid, jsonb)           TO authenticated;
