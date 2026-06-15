-- =============================================================================
-- 20_fix_submit_exam_attempt.sql
-- Corrige un bug RUNTIME de submit_exam_attempt (cree en 10) decouvert au test :
-- les CASE de statut (INSERT VALUES + ON CONFLICT) retournent du text et
-- l'assignation text->enum est refusee ("column status is of type
-- progress_status / final_exam_status but expression is of type text").
-- Fix : caster explicitement les branches en progress_status / final_exam_status.
-- (Remote : applique en 2 iterations 20 puis 21 ; ce fichier = version finale.)
-- =============================================================================
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
  v_prior_attempts   int;
  v_prior_failures   int;
  v_blocked_until    timestamptz;
  v_next_allowed_at  timestamptz;
  v_now              timestamptz := now();
  v_rec              record;
  v_correct          text;
  v_given            text;
  v_recent_24h       int;
  v_last_completed   timestamptz;
  v_bloc_id          uuid;
  v_formation_id     uuid;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentification requise.' USING errcode = '28000';
  END IF;

  IF p_answers IS NULL THEN
    p_answers := '{}'::jsonb;
  END IF;

  IF p_exam_kind = 'bloc' THEN
    SELECT eb.passing_score, eb.bloc_id INTO v_passing_score, v_bloc_id
      FROM public.exams_bloc eb WHERE eb.id = p_exam_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Examen de bloc introuvable.' USING errcode = 'P0002';
    END IF;

    SELECT count(*), max(completed_at) INTO v_prior_attempts, v_last_completed
      FROM public.exam_attempts ea WHERE ea.learner_id = v_uid AND ea.exam_bloc_id = p_exam_id;

    SELECT count(*) INTO v_recent_24h
      FROM public.exam_attempts ea
     WHERE ea.learner_id = v_uid AND ea.exam_bloc_id = p_exam_id
       AND ea.completed_at > v_now - interval '24 hours';

    IF v_recent_24h >= 5 THEN
      v_next_allowed_at := (
        SELECT min(ea.completed_at) + interval '24 hours'
          FROM (
            SELECT ea.completed_at FROM public.exam_attempts ea
             WHERE ea.learner_id = v_uid AND ea.exam_bloc_id = p_exam_id
               AND ea.completed_at > v_now - interval '24 hours'
             ORDER BY ea.completed_at ASC LIMIT 1
          ) ea
      );
      RAISE EXCEPTION 'Limite de 5 essais sur 24h atteinte. Prochain essai possible le %.', v_next_allowed_at USING errcode = 'P0001';
    END IF;

    IF v_prior_attempts >= 2 AND v_last_completed IS NOT NULL THEN
      IF v_last_completed > v_now - interval '1 hour' THEN
        v_next_allowed_at := v_last_completed + interval '1 hour';
        RAISE EXCEPTION 'Vous devez attendre 1 heure entre deux essais. Prochain essai possible le %.', v_next_allowed_at USING errcode = 'P0001';
      END IF;
    END IF;

    v_attempt_number := v_prior_attempts + 1;

    FOR v_rec IN
      SELECT q.id, q.points, q.is_qcm, qa.correct_answer
        FROM public.questions q
        LEFT JOIN public.question_answers qa ON qa.question_id = q.id
       WHERE q.scope = 'examen_bloc' AND q.exam_bloc_id = p_exam_id
    LOOP
      v_total_points := v_total_points + COALESCE(v_rec.points, 1);
      v_given := p_answers ->> v_rec.id::text;
      v_correct := v_rec.correct_answer;
      IF v_rec.is_qcm AND v_correct IS NOT NULL AND v_given IS NOT NULL
         AND lower(btrim(v_given)) = lower(btrim(v_correct)) THEN
        v_earned_points := v_earned_points + COALESCE(v_rec.points, 1);
      END IF;
    END LOOP;

    v_score := CASE WHEN v_total_points > 0 THEN floor((v_earned_points::numeric / v_total_points::numeric) * 100)::int ELSE 0 END;
    v_passed := v_score >= COALESCE(v_passing_score, 100);

    IF v_passed THEN
      v_next_allowed_at := NULL; v_blocked_until := NULL;
    ELSE
      IF v_recent_24h + 1 >= 5 THEN
        v_blocked_until := (
          SELECT min(c) + interval '24 hours' FROM (
            SELECT ea.completed_at AS c FROM public.exam_attempts ea
             WHERE ea.learner_id = v_uid AND ea.exam_bloc_id = p_exam_id
               AND ea.completed_at > v_now - interval '24 hours'
            UNION ALL SELECT v_now
          ) s
        );
        v_next_allowed_at := v_blocked_until;
      ELSIF v_attempt_number >= 2 THEN
        v_next_allowed_at := v_now + interval '1 hour'; v_blocked_until := v_next_allowed_at;
      ELSE
        v_next_allowed_at := v_now; v_blocked_until := NULL;
      END IF;
    END IF;

    INSERT INTO public.exam_attempts (
      learner_id, exam_kind, exam_bloc_id, attempt_number, answers, score, passed, completed_at, blocked_until, blocked_reason
    ) VALUES (
      v_uid, 'bloc', p_exam_id, v_attempt_number, p_answers, v_score, v_passed, v_now, v_blocked_until,
      CASE WHEN v_passed THEN NULL ELSE 'Echec - reglementation essais bloc' END
    );

    INSERT INTO public.bloc_progress (learner_id, bloc_id, status, exam_passed, unlocked_at, updated_at)
    VALUES (
      v_uid, v_bloc_id,
      CASE WHEN v_passed THEN 'completed'::public.progress_status ELSE 'in_progress'::public.progress_status END,
      v_passed,
      CASE WHEN v_passed THEN v_now ELSE NULL END,
      v_now
    )
    ON CONFLICT (learner_id, bloc_id) DO UPDATE SET
      status      = CASE WHEN v_passed THEN 'completed'::public.progress_status
                         ELSE GREATEST(public.bloc_progress.status, 'in_progress'::public.progress_status) END,
      exam_passed = public.bloc_progress.exam_passed OR v_passed,
      unlocked_at = COALESCE(public.bloc_progress.unlocked_at, CASE WHEN v_passed THEN v_now ELSE NULL END),
      updated_at  = v_now;

  ELSIF p_exam_kind = 'final' THEN
    SELECT ef.passing_score, ef.formation_id INTO v_passing_score, v_formation_id
      FROM public.exams_final ef WHERE ef.id = p_exam_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Examen final introuvable.' USING errcode = 'P0002';
    END IF;

    SELECT count(*), count(*) FILTER (WHERE NOT ea.passed), max(ea.completed_at)
      INTO v_prior_attempts, v_prior_failures, v_last_completed
      FROM public.exam_attempts ea WHERE ea.learner_id = v_uid AND ea.exam_final_id = p_exam_id;

    IF v_prior_attempts >= 2 AND v_last_completed IS NOT NULL THEN
      v_next_allowed_at := v_last_completed + public.next_final_delay(v_prior_attempts);
      IF v_now < v_next_allowed_at THEN
        RAISE EXCEPTION 'Le prochain essai a l''examen final sera possible le %.', v_next_allowed_at USING errcode = 'P0001';
      END IF;
    END IF;

    v_attempt_number := v_prior_attempts + 1;

    FOR v_rec IN
      SELECT q.id, q.points, q.is_qcm, qa.correct_answer
        FROM public.questions q
        LEFT JOIN public.question_answers qa ON qa.question_id = q.id
       WHERE q.scope = 'examen_final' AND q.exam_final_id = p_exam_id
    LOOP
      v_total_points := v_total_points + COALESCE(v_rec.points, 1);
      v_given := p_answers ->> v_rec.id::text;
      v_correct := v_rec.correct_answer;
      IF v_rec.is_qcm AND v_correct IS NOT NULL AND v_given IS NOT NULL
         AND lower(btrim(v_given)) = lower(btrim(v_correct)) THEN
        v_earned_points := v_earned_points + COALESCE(v_rec.points, 1);
      END IF;
    END LOOP;

    v_score := CASE WHEN v_total_points > 0 THEN floor((v_earned_points::numeric / v_total_points::numeric) * 100)::int ELSE 0 END;
    v_passed := v_score >= COALESCE(v_passing_score, 100);

    IF v_passed THEN
      v_blocked_until := NULL; v_next_allowed_at := NULL;
    ELSE
      v_next_allowed_at := v_now + public.next_final_delay(v_attempt_number);
      v_blocked_until := CASE WHEN v_next_allowed_at > v_now THEN v_next_allowed_at ELSE NULL END;
    END IF;

    INSERT INTO public.exam_attempts (
      learner_id, exam_kind, exam_final_id, attempt_number, answers, score, passed, completed_at, blocked_until, blocked_reason
    ) VALUES (
      v_uid, 'final', p_exam_id, v_attempt_number, p_answers, v_score, v_passed, v_now, v_blocked_until,
      CASE WHEN v_passed THEN NULL ELSE 'Echec - back-off croissant examen final' END
    );

    INSERT INTO public.final_exam_progress (
      learner_id, exam_final_id, status, passed_at, completed_at, best_score, updated_at
    ) VALUES (
      v_uid, p_exam_id,
      CASE WHEN v_passed THEN 'passed'::public.final_exam_status ELSE 'failed'::public.final_exam_status END,
      CASE WHEN v_passed THEN v_now ELSE NULL END,
      v_now, v_score, v_now
    )
    ON CONFLICT (learner_id, exam_final_id) DO UPDATE SET
      status       = CASE
                       WHEN v_passed THEN 'passed'::public.final_exam_status
                       WHEN public.final_exam_progress.status = 'passed' THEN 'passed'::public.final_exam_status
                       ELSE 'failed'::public.final_exam_status END,
      passed_at    = COALESCE(public.final_exam_progress.passed_at, CASE WHEN v_passed THEN v_now ELSE NULL END),
      completed_at = v_now,
      best_score   = GREATEST(COALESCE(public.final_exam_progress.best_score, 0), v_score),
      updated_at   = v_now;

  ELSE
    RAISE EXCEPTION 'exam_kind invalide: %', p_exam_kind USING errcode = '22023';
  END IF;

  RETURN jsonb_build_object('passed', v_passed, 'score', v_score, 'blocked_until', v_blocked_until, 'next_allowed_at', v_next_allowed_at);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.submit_exam_attempt(public.exam_kind, uuid, jsonb) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.submit_exam_attempt(public.exam_kind, uuid, jsonb) TO authenticated;
