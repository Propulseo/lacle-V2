-- =============================================================================
-- 20260613001000_functions_rpc.sql
-- RPC SECURITY DEFINER pour le LMS la-cle-app.
-- Toutes les fonctions appliquent les droits (auth.uid(), is_staff()) et les
-- "lois" pedagogiques figees par le contrat. Elles bypassent la RLS pour
-- ecrire les tables immuables (exam_attempts, question_responses, vault_unlocks).
-- Reference des objets crees dans les fichiers de numero inferieur (01..07, 09).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- HELPER: next_final_delay(attempt_index)
-- Loi examen FINAL: back-off croissant. 2 essais immediats (index 0,1), puis
-- delai = 24h * 2^(n) avec n = attempt_index - 2 (24h, 48h, 96h, ...).
-- Recalcule a la volee a partir de l'historique (jamais fige en colonne).
-- attempt_index = nombre d'echecs deja consommes (0-based) pour le prochain essai.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.next_final_delay(attempt_index int)
RETURNS interval
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN attempt_index < 2 THEN interval '0'
    -- Exposant plafonne (LEAST .. 20) + numeric: evite le debordement int
    -- (2^31) pour un eleve qui echoue tres souvent. Cap ~2^20 (~119 ans).
    ELSE (interval '24 hours') * (2 ^ LEAST(attempt_index - 2, 20))::numeric
  END;
$$;

COMMENT ON FUNCTION public.next_final_delay(int) IS
  'Examen final: delai avant le prochain essai. attempt_index = nb d''essais deja consommes (0-based). 2 immediats (0/0h), puis 24h*2^(n). Recalcule a la volee, jamais fige.';


-- -----------------------------------------------------------------------------
-- RPC: submit_exam_attempt(p_exam_kind, p_exam_id, p_answers)
-- Applique les lois (bloc: 2 immediats, 1/h, max 5/24h ; final: back-off
-- croissant via next_final_delay). Score depuis question_answers. Insere
-- exam_attempts (learner = auth.uid()), met a jour bloc_progress /
-- final_exam_progress. Retourne {passed, score, blocked_until, next_allowed_at}.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_exam_attempt(
  p_exam_kind public.exam_kind,
  p_exam_id   uuid,
  p_answers   jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid              uuid := auth.uid();
  v_passing_score    int;
  v_total_points     int := 0;
  v_earned_points    int := 0;
  v_score            int := 0;
  v_passed           boolean := false;
  v_attempt_number   int;
  v_prior_attempts   int;      -- tentatives deja terminees (toutes)
  v_prior_failures   int;      -- echecs deja consommes
  v_blocked_until    timestamptz;
  v_next_allowed_at  timestamptz;
  v_now              timestamptz := now();
  v_rec              record;
  v_correct          text;
  v_given            text;
  -- bloc gating
  v_recent_24h       int;
  v_last_completed   timestamptz;
  v_bloc_id          uuid;
  -- final gating
  v_formation_id     uuid;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentification requise.' USING errcode = '28000';
  END IF;

  IF p_answers IS NULL THEN
    p_answers := '{}'::jsonb;
  END IF;

  -- ---------------------------------------------------------------------------
  -- BRANCHE EXAMEN DE BLOC
  -- ---------------------------------------------------------------------------
  IF p_exam_kind = 'bloc' THEN
    SELECT eb.passing_score, eb.bloc_id
      INTO v_passing_score, v_bloc_id
      FROM public.exams_bloc eb
     WHERE eb.id = p_exam_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Examen de bloc introuvable.' USING errcode = 'P0002';
    END IF;

    -- Tentatives deja terminees pour ce bloc
    SELECT count(*), max(completed_at)
      INTO v_prior_attempts, v_last_completed
      FROM public.exam_attempts ea
     WHERE ea.learner_id = v_uid
       AND ea.exam_bloc_id = p_exam_id;

    -- Tentatives sur les 24h glissantes
    SELECT count(*)
      INTO v_recent_24h
      FROM public.exam_attempts ea
     WHERE ea.learner_id = v_uid
       AND ea.exam_bloc_id = p_exam_id
       AND ea.completed_at > v_now - interval '24 hours';

    -- LOI BLOC: max 5 essais / 24h glissantes
    IF v_recent_24h >= 5 THEN
      v_next_allowed_at := (
        SELECT min(ea.completed_at) + interval '24 hours'
          FROM (
            SELECT ea.completed_at
              FROM public.exam_attempts ea
             WHERE ea.learner_id = v_uid
               AND ea.exam_bloc_id = p_exam_id
               AND ea.completed_at > v_now - interval '24 hours'
             ORDER BY ea.completed_at ASC
             LIMIT 1
          ) ea
      );
      RAISE EXCEPTION 'Limite de 5 essais sur 24h atteinte. Prochain essai possible le %.', v_next_allowed_at
        USING errcode = 'P0001';
    END IF;

    -- LOI BLOC: 2 essais immediats d'affilee, puis 1 essai / heure
    IF v_prior_attempts >= 2 AND v_last_completed IS NOT NULL THEN
      IF v_last_completed > v_now - interval '1 hour' THEN
        v_next_allowed_at := v_last_completed + interval '1 hour';
        RAISE EXCEPTION 'Vous devez attendre 1 heure entre deux essais. Prochain essai possible le %.', v_next_allowed_at
          USING errcode = 'P0001';
      END IF;
    END IF;

    v_attempt_number := v_prior_attempts + 1;

    -- Scoring depuis question_answers (table SECRETE)
    FOR v_rec IN
      SELECT q.id, q.points, q.is_qcm, qa.correct_answer
        FROM public.questions q
        LEFT JOIN public.question_answers qa ON qa.question_id = q.id
       WHERE q.scope = 'examen_bloc'
         AND q.exam_bloc_id = p_exam_id
    LOOP
      v_total_points := v_total_points + COALESCE(v_rec.points, 1);
      v_given := p_answers ->> v_rec.id::text;
      v_correct := v_rec.correct_answer;
      IF v_rec.is_qcm AND v_correct IS NOT NULL AND v_given IS NOT NULL
         AND lower(btrim(v_given)) = lower(btrim(v_correct)) THEN
        v_earned_points := v_earned_points + COALESCE(v_rec.points, 1);
      END IF;
    END LOOP;

    IF v_total_points > 0 THEN
      v_score := floor((v_earned_points::numeric / v_total_points::numeric) * 100)::int;
    ELSE
      v_score := 0;
    END IF;

    v_passed := v_score >= COALESCE(v_passing_score, 100);

    -- Calcul du verrou post-tentative (pour affichage)
    IF v_passed THEN
      v_next_allowed_at := NULL;
      v_blocked_until := NULL;
    ELSE
      -- apres cette tentative: combien sur 24h ?
      IF v_recent_24h + 1 >= 5 THEN
        -- la 5e (ou plus) tentative dans la fenetre: blocage 24h depuis la plus ancienne
        v_blocked_until := (
          SELECT min(c) + interval '24 hours' FROM (
            SELECT ea.completed_at AS c
              FROM public.exam_attempts ea
             WHERE ea.learner_id = v_uid
               AND ea.exam_bloc_id = p_exam_id
               AND ea.completed_at > v_now - interval '24 hours'
            UNION ALL SELECT v_now
          ) s
        );
        v_next_allowed_at := v_blocked_until;
      ELSIF v_attempt_number >= 2 THEN
        -- au-dela des 2 essais immediats: 1 essai / heure
        v_next_allowed_at := v_now + interval '1 hour';
        v_blocked_until := v_next_allowed_at;
      ELSE
        v_next_allowed_at := v_now;
        v_blocked_until := NULL;
      END IF;
    END IF;

    INSERT INTO public.exam_attempts (
      learner_id, exam_kind, exam_bloc_id, attempt_number,
      answers, score, passed, completed_at, blocked_until, blocked_reason
    ) VALUES (
      v_uid, 'bloc', p_exam_id, v_attempt_number,
      p_answers, v_score, v_passed, v_now, v_blocked_until,
      CASE WHEN v_passed THEN NULL ELSE 'Echec - reglementation essais bloc' END
    );

    -- Mise a jour bloc_progress (reussite => deblocage bloc)
    INSERT INTO public.bloc_progress (learner_id, bloc_id, status, exam_passed, unlocked_at, updated_at)
    VALUES (
      v_uid, v_bloc_id,
      CASE WHEN v_passed THEN 'completed' ELSE 'in_progress' END,
      v_passed,
      CASE WHEN v_passed THEN v_now ELSE NULL END,
      v_now
    )
    ON CONFLICT (learner_id, bloc_id) DO UPDATE SET
      status      = CASE WHEN v_passed THEN 'completed' ELSE GREATEST(public.bloc_progress.status, 'in_progress') END,
      exam_passed = public.bloc_progress.exam_passed OR v_passed,
      unlocked_at = COALESCE(public.bloc_progress.unlocked_at, CASE WHEN v_passed THEN v_now ELSE NULL END),
      updated_at  = v_now;

  -- ---------------------------------------------------------------------------
  -- BRANCHE EXAMEN FINAL
  -- ---------------------------------------------------------------------------
  ELSIF p_exam_kind = 'final' THEN
    SELECT ef.passing_score, ef.formation_id
      INTO v_passing_score, v_formation_id
      FROM public.exams_final ef
     WHERE ef.id = p_exam_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Examen final introuvable.' USING errcode = 'P0002';
    END IF;

    -- Historique des tentatives finales
    SELECT count(*), count(*) FILTER (WHERE NOT ea.passed), max(ea.completed_at)
      INTO v_prior_attempts, v_prior_failures, v_last_completed
      FROM public.exam_attempts ea
     WHERE ea.learner_id = v_uid
       AND ea.exam_final_id = p_exam_id;

    -- LOI FINAL: back-off croissant. Delai requis avant CE nouvel essai,
    -- recalcule a la volee depuis le nombre d'echecs deja consommes.
    -- attempt_index = nb d'essais deja consommes (= v_prior_attempts).
    IF v_prior_attempts >= 2 AND v_last_completed IS NOT NULL THEN
      v_next_allowed_at := v_last_completed + public.next_final_delay(v_prior_attempts);
      IF v_now < v_next_allowed_at THEN
        RAISE EXCEPTION 'Le prochain essai a l''examen final sera possible le %.', v_next_allowed_at
          USING errcode = 'P0001';
      END IF;
    END IF;

    v_attempt_number := v_prior_attempts + 1;

    -- Scoring depuis question_answers
    FOR v_rec IN
      SELECT q.id, q.points, q.is_qcm, qa.correct_answer
        FROM public.questions q
        LEFT JOIN public.question_answers qa ON qa.question_id = q.id
       WHERE q.scope = 'examen_final'
         AND q.exam_final_id = p_exam_id
    LOOP
      v_total_points := v_total_points + COALESCE(v_rec.points, 1);
      v_given := p_answers ->> v_rec.id::text;
      v_correct := v_rec.correct_answer;
      IF v_rec.is_qcm AND v_correct IS NOT NULL AND v_given IS NOT NULL
         AND lower(btrim(v_given)) = lower(btrim(v_correct)) THEN
        v_earned_points := v_earned_points + COALESCE(v_rec.points, 1);
      END IF;
    END LOOP;

    IF v_total_points > 0 THEN
      v_score := floor((v_earned_points::numeric / v_total_points::numeric) * 100)::int;
    ELSE
      v_score := 0;
    END IF;

    v_passed := v_score >= COALESCE(v_passing_score, 100);

    -- Verrou post-tentative pour affichage (jamais blocage definitif auto)
    IF v_passed THEN
      v_blocked_until := NULL;
      v_next_allowed_at := NULL;
    ELSE
      -- index pour le PROCHAIN essai = nb d'essais maintenant consommes (= v_attempt_number)
      v_next_allowed_at := v_now + public.next_final_delay(v_attempt_number);
      IF v_next_allowed_at > v_now THEN
        v_blocked_until := v_next_allowed_at;
      ELSE
        v_blocked_until := NULL;
      END IF;
    END IF;

    INSERT INTO public.exam_attempts (
      learner_id, exam_kind, exam_final_id, attempt_number,
      answers, score, passed, completed_at, blocked_until, blocked_reason
    ) VALUES (
      v_uid, 'final', p_exam_id, v_attempt_number,
      p_answers, v_score, v_passed, v_now, v_blocked_until,
      CASE WHEN v_passed THEN NULL ELSE 'Echec - back-off croissant examen final' END
    );

    -- Mise a jour final_exam_progress
    INSERT INTO public.final_exam_progress (
      learner_id, exam_final_id, status, passed_at, completed_at, best_score, updated_at
    ) VALUES (
      v_uid, p_exam_id,
      CASE WHEN v_passed THEN 'passed' ELSE 'failed' END,
      CASE WHEN v_passed THEN v_now ELSE NULL END,
      v_now,
      v_score,
      v_now
    )
    ON CONFLICT (learner_id, exam_final_id) DO UPDATE SET
      status       = CASE
                       WHEN v_passed THEN 'passed'
                       WHEN public.final_exam_progress.status = 'passed' THEN 'passed'
                       ELSE 'failed'
                     END,
      passed_at    = COALESCE(public.final_exam_progress.passed_at, CASE WHEN v_passed THEN v_now ELSE NULL END),
      completed_at = v_now,
      best_score   = GREATEST(COALESCE(public.final_exam_progress.best_score, 0), v_score),
      updated_at   = v_now;

  ELSE
    RAISE EXCEPTION 'exam_kind invalide: %', p_exam_kind USING errcode = '22023';
  END IF;

  RETURN jsonb_build_object(
    'passed',          v_passed,
    'score',           v_score,
    'blocked_until',   v_blocked_until,
    'next_allowed_at', v_next_allowed_at
  );
END;
$$;

COMMENT ON FUNCTION public.submit_exam_attempt(public.exam_kind, uuid, jsonb) IS
  'Soumet une tentative d''examen (bloc ou final), applique les lois d''essais a la volee, score depuis question_answers (staff-only), ecrit exam_attempts + bloc/final_progress. SECURITY DEFINER: bypass RLS des tables immuables.';

GRANT EXECUTE ON FUNCTION public.submit_exam_attempt(public.exam_kind, uuid, jsonb) TO authenticated;


-- -----------------------------------------------------------------------------
-- RPC: submit_question_response(p_question_id, p_answer, p_response_time_ms)
-- Insere question_responses (occurrence = max+1 de la reprise courante),
-- auto-score QCM via question_answers, si correct genere 4 scheduled_reviews
-- (review_cycle_id commun, J+1/3/7/21). Retourne {is_correct, explanation}.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_question_response(
  p_question_id      uuid,
  p_answer           text,
  p_response_time_ms int DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid           uuid := auth.uid();
  v_is_qcm        boolean;
  v_req_review    boolean;
  v_correct       text;
  v_explanation   text;
  v_is_correct    boolean := NULL;
  v_occurrence    int;
  v_cycle_id      uuid;
  v_now           timestamptz := now();
  v_today         date := (now() AT TIME ZONE 'UTC')::date;
  v_review_status public.submission_status := NULL;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentification requise.' USING errcode = '28000';
  END IF;

  IF p_answer IS NULL OR btrim(p_answer) = '' THEN
    RAISE EXCEPTION 'Une reponse est requise.' USING errcode = '22023';
  END IF;

  SELECT q.is_qcm, q.requires_human_review, qa.correct_answer, qa.explanation
    INTO v_is_qcm, v_req_review, v_correct, v_explanation
    FROM public.questions q
    LEFT JOIN public.question_answers qa ON qa.question_id = q.id
   WHERE q.id = p_question_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Question introuvable.' USING errcode = 'P0002';
  END IF;

  -- Auto-score QCM uniquement (reponses libres = relecture humaine ulterieure)
  IF v_is_qcm AND v_correct IS NOT NULL THEN
    v_is_correct := lower(btrim(p_answer)) = lower(btrim(v_correct));
  ELSE
    v_is_correct := NULL;  -- non auto-scorable
  END IF;

  -- Si la question demande une relecture humaine, on marque review_status pending
  IF v_req_review THEN
    v_review_status := 'pending';
  END IF;

  -- occurrence = max existant + 1 (distingue les reprises d'un meme cours)
  SELECT COALESCE(max(qr.occurrence), 0) + 1
    INTO v_occurrence
    FROM public.question_responses qr
   WHERE qr.learner_id = v_uid
     AND qr.question_id = p_question_id;

  INSERT INTO public.question_responses (
    learner_id, question_id, occurrence, answer, is_correct,
    response_time_ms, attempt_count, answered_at, review_status
  ) VALUES (
    v_uid, p_question_id, v_occurrence, p_answer, v_is_correct,
    p_response_time_ms, 1, v_now, v_review_status
  );

  -- Si correct: generer une serie de 4 revisions espacees (J+1/3/7/21)
  IF v_is_correct IS TRUE THEN
    v_cycle_id := gen_random_uuid();
    INSERT INTO public.scheduled_reviews (
      learner_id, question_id, review_cycle_id, interval_days, due_on, status, created_at
    )
    SELECT v_uid, p_question_id, v_cycle_id, d, v_today + d, 'pending', v_now
      FROM (VALUES (1), (3), (7), (21)) AS s(d);
  END IF;

  -- SECURITE (B2): ne jamais reveler l'explication d'une reponse LIBRE
  -- (non-QCM) -> elle est relue par un formateur, pas auto-corrigee.
  -- Pour les QCM, l'explication = feedback pedagogique intentionnel
  -- (METHODE: "integration QCM, feedback apres erreur"). Le correct_answer
  -- lui-meme n'est JAMAIS retourne (reste dans question_answers staff-only).
  IF NOT COALESCE(v_is_qcm, false) THEN
    v_explanation := NULL;
  END IF;

  RETURN jsonb_build_object(
    'is_correct',  v_is_correct,
    'explanation', v_explanation
  );
END;
$$;

COMMENT ON FUNCTION public.submit_question_response(uuid, text, int) IS
  'Soumet une reponse a une question de cours. occurrence = max+1 (reprises). Auto-score QCM via question_answers. Si correct: genere 4 scheduled_reviews (cycle commun, J+1/3/7/21). SECURITY DEFINER.';

GRANT EXECUTE ON FUNCTION public.submit_question_response(uuid, text, int) TO authenticated;


-- -----------------------------------------------------------------------------
-- RPC: complete_review(p_review_id, p_answer, p_response_time_ms)
-- Marque la review 'done'. Si echec: passe le cycle courant a 'superseded'
-- (toutes les reviews pending du meme cycle) et regenere un cycle a J+1.
-- Retourne {is_correct, explanation}.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.complete_review(
  p_review_id        uuid,
  p_answer           text,
  p_response_time_ms int DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid          uuid := auth.uid();
  v_question_id  uuid;
  v_cycle_id     uuid;
  v_status       public.review_status;
  v_is_qcm       boolean;
  v_correct      text;
  v_explanation  text;
  v_is_correct   boolean := NULL;
  v_new_cycle    uuid;
  v_now          timestamptz := now();
  v_today        date := (now() AT TIME ZONE 'UTC')::date;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentification requise.' USING errcode = '28000';
  END IF;

  IF p_answer IS NULL OR btrim(p_answer) = '' THEN
    RAISE EXCEPTION 'Une reponse est requise.' USING errcode = '22023';
  END IF;

  -- Charge la review (et verifie la propriete)
  SELECT sr.question_id, sr.review_cycle_id, sr.status
    INTO v_question_id, v_cycle_id, v_status
    FROM public.scheduled_reviews sr
   WHERE sr.id = p_review_id
     AND sr.learner_id = v_uid;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Revision introuvable ou non autorisee.' USING errcode = 'P0002';
  END IF;

  IF v_status <> 'pending' THEN
    RAISE EXCEPTION 'Cette revision n''est plus en attente (statut=%).', v_status
      USING errcode = 'P0001';
  END IF;

  -- Correction QCM via question_answers
  SELECT q.is_qcm, qa.correct_answer, qa.explanation
    INTO v_is_qcm, v_correct, v_explanation
    FROM public.questions q
    LEFT JOIN public.question_answers qa ON qa.question_id = q.id
   WHERE q.id = v_question_id;

  IF v_is_qcm AND v_correct IS NOT NULL THEN
    v_is_correct := lower(btrim(p_answer)) = lower(btrim(v_correct));
  ELSE
    v_is_correct := NULL;
  END IF;

  -- Marque la review courante 'done'
  UPDATE public.scheduled_reviews sr
     SET status        = 'done',
         completed_at  = v_now,
         student_answer = p_answer,
         response_time_ms = p_response_time_ms,
         is_correct    = v_is_correct
   WHERE sr.id = p_review_id;

  -- Si echec avere (QCM faux): on annule le reste du cycle et on regenere a J+1
  IF v_is_correct IS FALSE THEN
    UPDATE public.scheduled_reviews sr
       SET status = 'superseded'
     WHERE sr.learner_id = v_uid
       AND sr.review_cycle_id = v_cycle_id
       AND sr.status = 'pending';

    v_new_cycle := gen_random_uuid();
    INSERT INTO public.scheduled_reviews (
      learner_id, question_id, review_cycle_id, interval_days, due_on, status, created_at
    )
    SELECT v_uid, v_question_id, v_new_cycle, d, v_today + d, 'pending', v_now
      FROM (VALUES (1), (3), (7), (21)) AS s(d);
  END IF;

  RETURN jsonb_build_object(
    'is_correct',  v_is_correct,
    'explanation', v_explanation
  );
END;
$$;

COMMENT ON FUNCTION public.complete_review(uuid, text, int) IS
  'Marque une scheduled_review done. Si QCM faux: passe le reste du cycle a superseded et regenere un cycle complet a partir de J+1. SECURITY DEFINER.';

GRANT EXECUTE ON FUNCTION public.complete_review(uuid, text, int) TO authenticated;


-- -----------------------------------------------------------------------------
-- RPC: record_video_progress(p_video_id, p_position, p_completed)
-- Upsert video_progress; si completed=true, debloque les vault_documents lies
-- a tous les course_items pointant cette video via course_item_vault_links
-- (INSERT vault_unlocks ON CONFLICT DO NOTHING, trigger_kind='video_completion').
-- Retourne {completed, unlocked_count}.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.record_video_progress(
  p_video_id  uuid,
  p_position  int,
  p_completed boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid           uuid := auth.uid();
  v_item_id       uuid;
  v_now           timestamptz := now();
  v_position      int := GREATEST(COALESCE(p_position, 0), 0);
  v_completed     boolean := COALESCE(p_completed, false);
  v_unlocked      int := 0;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentification requise.' USING errcode = '28000';
  END IF;

  -- Verifie l'existence de la video et recupere son course_item
  SELECT v.item_id INTO v_item_id
    FROM public.videos v
   WHERE v.id = p_video_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Video introuvable.' USING errcode = 'P0002';
  END IF;

  -- Upsert video_progress
  INSERT INTO public.video_progress (
    learner_id, video_id, completed, completed_at, last_position_seconds, updated_at
  ) VALUES (
    v_uid, p_video_id, v_completed,
    CASE WHEN v_completed THEN v_now ELSE NULL END,
    v_position, v_now
  )
  ON CONFLICT (learner_id, video_id) DO UPDATE SET
    completed             = public.video_progress.completed OR v_completed,
    completed_at          = COALESCE(public.video_progress.completed_at, CASE WHEN v_completed THEN v_now ELSE NULL END),
    last_position_seconds = GREATEST(public.video_progress.last_position_seconds, v_position),
    updated_at            = v_now;

  -- Si la video est completee: debloquer les coffres lies a son course_item
  IF v_completed THEN
    WITH ins AS (
      INSERT INTO public.vault_unlocks (
        learner_id, vault_document_id, trigger_kind, trigger_ref, unlocked_at
      )
      SELECT v_uid, civl.vault_document_id, 'video_completion', p_video_id, v_now
        FROM public.course_item_vault_links civl
       WHERE civl.item_id = v_item_id
      ON CONFLICT (learner_id, vault_document_id) DO NOTHING
      RETURNING 1
    )
    SELECT count(*) INTO v_unlocked FROM ins;
  END IF;

  RETURN jsonb_build_object(
    'completed',      v_completed,
    'unlocked_count', v_unlocked
  );
END;
$$;

COMMENT ON FUNCTION public.record_video_progress(uuid, int, boolean) IS
  'Upsert video_progress (position monotone). Si completed: debloque les vault_documents lies via course_item_vault_links (vault_unlocks ON CONFLICT DO NOTHING, trigger_kind=video_completion). SECURITY DEFINER.';

GRANT EXECUTE ON FUNCTION public.record_video_progress(uuid, int, boolean) TO authenticated;


-- -----------------------------------------------------------------------------
-- RPC: get_cours_questions(p_cours_id)
-- Retourne les questions de cours (scope='cours') du cours, SANS correct_answer
-- ni explanation (lecture eleve sure). Filtre les course_items de kind=question.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_cours_questions(p_cours_id uuid)
RETURNS SETOF jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT jsonb_build_object(
           'id',          q.id,
           'item_id',     q.item_id,
           'type',        q.type,
           'is_qcm',      q.is_qcm,
           'is_blocking', q.is_blocking,
           'content',     q.content,
           'options',     q.options,
           'points',      q.points,
           'position',    q.position
         )
    FROM public.questions q
    JOIN public.course_items ci ON ci.id = q.item_id
   WHERE q.scope = 'cours'
     AND ci.kind = 'question'
     AND ci.cours_id = p_cours_id
     AND auth.uid() IS NOT NULL
   ORDER BY q.position ASC, ci.position ASC;
$$;

COMMENT ON FUNCTION public.get_cours_questions(uuid) IS
  'Renvoie les questions de cours SANS correct_answer/explanation (lecture eleve sure). Le secret reste dans question_answers (staff-only). SECURITY DEFINER mais ne fuite jamais les reponses.';

GRANT EXECUTE ON FUNCTION public.get_cours_questions(uuid) TO authenticated;


-- -----------------------------------------------------------------------------
-- RPC: reorder_course_item(p_item_id, p_new_position)
-- Reservee au staff (is_staff). Met a jour la position (numeric, fractionnaire).
-- Retourne {id, position}.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.reorder_course_item(
  p_item_id      uuid,
  p_new_position numeric
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
  IF NOT public.is_staff(v_uid) THEN
    RAISE EXCEPTION 'Action reservee au staff.' USING errcode = '42501';
  END IF;

  IF p_new_position IS NULL THEN
    RAISE EXCEPTION 'Position requise.' USING errcode = '22023';
  END IF;

  UPDATE public.course_items ci
     SET position   = p_new_position,
         updated_at = v_now
   WHERE ci.id = p_item_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Element de cours introuvable.' USING errcode = 'P0002';
  END IF;

  RETURN jsonb_build_object('id', p_item_id, 'position', p_new_position);
END;
$$;

COMMENT ON FUNCTION public.reorder_course_item(uuid, numeric) IS
  'Met a jour la position (numeric fractionnaire) d''un course_item. Reservee au staff via is_staff(). SECURITY DEFINER.';

GRANT EXECUTE ON FUNCTION public.reorder_course_item(uuid, numeric) TO authenticated;


-- -----------------------------------------------------------------------------
-- RPC: update_engagement_status(p_learner, p_status, p_last_progress_at) [M3]
-- Ecriture controlee de engagement_tracking par les jobs anti-decrochage
-- (Ind.12). engagement_tracking n'a aucune policy d'ecriture authenticated;
-- les jobs s'authentifient en service_role. Cette RPC documente l'intention
-- et centralise l'upsert. GRANT EXECUTE reserve a service_role.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_engagement_status(
  p_learner          uuid,
  p_status           public.engagement_status,
  p_last_progress_at timestamptz DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.engagement_tracking (
    learner_id, status, last_progress_at, updated_at
  ) VALUES (
    p_learner, p_status, p_last_progress_at, now()
  )
  ON CONFLICT (learner_id) DO UPDATE SET
    status           = EXCLUDED.status,
    last_progress_at = COALESCE(EXCLUDED.last_progress_at, public.engagement_tracking.last_progress_at),
    updated_at       = now();
END;
$$;

COMMENT ON FUNCTION public.update_engagement_status(uuid, public.engagement_status, timestamptz) IS
  'Upsert du suivi anti-decrochage (Ind.12) par les jobs cron (service_role). SECURITY DEFINER.';

GRANT EXECUTE ON FUNCTION public.update_engagement_status(uuid, public.engagement_status, timestamptz) TO service_role;


-- -----------------------------------------------------------------------------
-- RPC: get_satisfaction_survey_by_token(p_token) [B3]
-- Acces "a froid" (Ind.30) par lien anonyme: learner_id peut etre NULL, l'acces
-- se fait par access_token (jamais via policy SELECT ouverte). Renvoie le
-- minimum pour afficher le formulaire. Ne fuite pas l'identite.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_satisfaction_survey_by_token(p_token uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT jsonb_build_object(
           'id',                 s.id,
           'type',               s.type,
           'formation_id',       s.formation_id,
           'answers',            s.answers,
           'wants_public_review', s.wants_public_review,
           'completed_at',       s.completed_at
         )
    FROM public.satisfaction_surveys s
   WHERE s.access_token = p_token;
$$;

COMMENT ON FUNCTION public.get_satisfaction_survey_by_token(uuid) IS
  'Acces a froid (Ind.30) par token anonyme. Renvoie le formulaire sans exposer learner_id. SECURITY DEFINER (pas de policy SELECT ouverte).';

GRANT EXECUTE ON FUNCTION public.get_satisfaction_survey_by_token(uuid) TO anon, authenticated;


-- -----------------------------------------------------------------------------
-- RPC: submit_satisfaction_survey_by_token(p_token, p_answers, ...) [B3]
-- Enregistre les reponses "a froid" via le token (une seule fois). Horodate
-- server-side (completed_at) pour la preuve Qualiopi.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_satisfaction_survey_by_token(
  p_token               uuid,
  p_answers             jsonb,
  p_public_review       text    DEFAULT NULL,
  p_wants_public_review boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_id           uuid;
  v_completed_at timestamptz;
BEGIN
  IF p_token IS NULL THEN
    RAISE EXCEPTION 'Token requis.' USING errcode = '22023';
  END IF;

  UPDATE public.satisfaction_surveys s
     SET answers             = COALESCE(p_answers, '[]'::jsonb),
         public_review       = p_public_review,
         wants_public_review = COALESCE(p_wants_public_review, false),
         completed_at        = now()
   WHERE s.access_token = p_token
     AND s.completed_at IS NULL
  RETURNING s.id, s.completed_at INTO v_id, v_completed_at;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Enquete introuvable ou deja completee.' USING errcode = 'P0002';
  END IF;

  RETURN jsonb_build_object('id', v_id, 'completed_at', v_completed_at);
END;
$$;

COMMENT ON FUNCTION public.submit_satisfaction_survey_by_token(uuid, jsonb, text, boolean) IS
  'Soumet une enquete de satisfaction a froid via token (one-shot, horodatage server-side). SECURITY DEFINER.';

GRANT EXECUTE ON FUNCTION public.submit_satisfaction_survey_by_token(uuid, jsonb, text, boolean) TO anon, authenticated;
