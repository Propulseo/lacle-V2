-- =============================================================================
-- 20260613001100_views.sql
-- Vues d'analyse + export Qualiopi pour le LMS la-cle-app.
--
-- SECURITY INVOKER par defaut (Postgres 15) : ces vues s'executent avec les
-- droits de l'appelant et sont donc soumises a la RLS des tables sous-jacentes.
-- L'acces "analyse" reste reserve au staff : soit via la RLS (un eleve ne voit
-- que ses propres lignes), soit via REVOKE/GRANT explicites ci-dessous pour les
-- vues d'export Qualiopi qui agregent toute la cohorte.
--
-- Ces vues ne referencent QUE des tables/colonnes definies dans le contrat
-- (fichiers 01 a 07, deja appliques).
-- =============================================================================


-- -----------------------------------------------------------------------------
-- notion_responses_global
-- Agregation des reponses aux questions, ventilee par notion.
-- Source : question_responses x question_notions x notions.
-- On ne compte que les reponses dont la correction est connue (is_correct NOT NULL).
-- -----------------------------------------------------------------------------
CREATE VIEW notion_responses_global AS
SELECT
    n.id                                                        AS notion_id,
    n.label                                                     AS notion_label,
    count(qr.id)                                                AS total_responses,
    count(qr.id) FILTER (WHERE qr.is_correct IS TRUE)           AS correct_responses,
    count(qr.id) FILTER (WHERE qr.is_correct IS FALSE)          AS incorrect_responses,
    count(qr.id) FILTER (WHERE qr.is_correct IS NULL)           AS pending_responses,
    ROUND(
        count(qr.id) FILTER (WHERE qr.is_correct IS TRUE)::numeric
        / NULLIF(count(qr.id) FILTER (WHERE qr.is_correct IS NOT NULL), 0)
        * 100,
        2
    )                                                           AS correct_rate_pct
FROM notions n
LEFT JOIN question_notions qn ON qn.notion_id = n.id
LEFT JOIN question_responses qr ON qr.question_id = qn.question_id
GROUP BY n.id, n.label;

COMMENT ON VIEW notion_responses_global IS
'Taux de reussite global par notion (toutes cohortes). correct_rate_pct calcule sur les reponses corrigees (is_correct NOT NULL).';


-- -----------------------------------------------------------------------------
-- notion_responses_by_learner
-- Identique a notion_responses_global mais ventilee par eleve.
-- Sous RLS, un eleve ne voit que ses propres lignes ; le staff voit tout.
-- -----------------------------------------------------------------------------
CREATE VIEW notion_responses_by_learner AS
SELECT
    qr.learner_id                                               AS learner_id,
    n.id                                                        AS notion_id,
    n.label                                                     AS notion_label,
    count(qr.id)                                                AS total_responses,
    count(qr.id) FILTER (WHERE qr.is_correct IS TRUE)           AS correct_responses,
    count(qr.id) FILTER (WHERE qr.is_correct IS FALSE)          AS incorrect_responses,
    count(qr.id) FILTER (WHERE qr.is_correct IS NULL)           AS pending_responses,
    ROUND(
        count(qr.id) FILTER (WHERE qr.is_correct IS TRUE)::numeric
        / NULLIF(count(qr.id) FILTER (WHERE qr.is_correct IS NOT NULL), 0)
        * 100,
        2
    )                                                           AS correct_rate_pct
FROM question_responses qr
JOIN question_notions qn ON qn.question_id = qr.question_id
JOIN notions n ON n.id = qn.notion_id
GROUP BY qr.learner_id, n.id, n.label;

COMMENT ON VIEW notion_responses_by_learner IS
'Taux de reussite par notion et par eleve. Soumis a la RLS de question_responses (self OR is_staff).';


-- -----------------------------------------------------------------------------
-- learner_progress_view
-- Avancement par eleve et par formation :
--   - cours completes (course_progress.status = 'completed')
--   - blocs valides (bloc_progress.exam_passed = true)
-- On scope par enrollment (learner_id, formation_id) puis on rattache la
-- progression cours/bloc a la bonne formation via la hierarchie cours>bloc.
-- -----------------------------------------------------------------------------
CREATE VIEW learner_progress_view AS
WITH cours_par_formation AS (
    SELECT
        c.id        AS cours_id,
        b.formation_id
    FROM cours c
    JOIN blocs b ON b.id = c.bloc_id
),
blocs_par_formation AS (
    SELECT
        b.id        AS bloc_id,
        b.formation_id
    FROM blocs b
),
cours_stats AS (
    SELECT
        cp.learner_id,
        cpf.formation_id,
        count(*)                                                       AS cours_total_avec_progres,
        count(*) FILTER (WHERE cp.status = 'completed')                AS cours_completes,
        count(*) FILTER (WHERE cp.status = 'in_progress')              AS cours_en_cours
    FROM course_progress cp
    JOIN cours_par_formation cpf ON cpf.cours_id = cp.cours_id
    GROUP BY cp.learner_id, cpf.formation_id
),
blocs_stats AS (
    SELECT
        bp.learner_id,
        bpf.formation_id,
        count(*)                                                       AS blocs_total_avec_progres,
        count(*) FILTER (WHERE bp.exam_passed IS TRUE)                 AS blocs_valides,
        count(*) FILTER (WHERE bp.status = 'completed')                AS blocs_completes
    FROM bloc_progress bp
    JOIN blocs_par_formation bpf ON bpf.bloc_id = bp.bloc_id
    GROUP BY bp.learner_id, bpf.formation_id
)
SELECT
    e.learner_id                                                       AS learner_id,
    p.first_name                                                       AS first_name,
    p.last_name                                                        AS last_name,
    p.email                                                            AS email,
    e.formation_id                                                     AS formation_id,
    f.title                                                            AS formation_title,
    e.status                                                           AS enrollment_status,
    e.enrolled_at                                                      AS enrolled_at,
    e.certified_at                                                     AS certified_at,
    COALESCE(cs.cours_completes, 0)                                    AS cours_completes,
    COALESCE(cs.cours_en_cours, 0)                                     AS cours_en_cours,
    COALESCE(cs.cours_total_avec_progres, 0)                           AS cours_avec_progres,
    COALESCE(bs.blocs_valides, 0)                                      AS blocs_valides,
    COALESCE(bs.blocs_completes, 0)                                    AS blocs_completes,
    COALESCE(bs.blocs_total_avec_progres, 0)                           AS blocs_avec_progres
FROM enrollments e
JOIN profiles p ON p.id = e.learner_id
JOIN formations f ON f.id = e.formation_id
LEFT JOIN cours_stats cs ON cs.learner_id = e.learner_id AND cs.formation_id = e.formation_id
LEFT JOIN blocs_stats bs ON bs.learner_id = e.learner_id AND bs.formation_id = e.formation_id;

COMMENT ON VIEW learner_progress_view IS
'Avancement par eleve/formation : cours completes (course_progress) et blocs valides (bloc_progress.exam_passed). Soumis a la RLS des tables sous-jacentes.';


-- -----------------------------------------------------------------------------
-- learner_vault_view
-- Etat du coffre par eleve : pour chaque document de la formation a laquelle
-- l'eleve est inscrit, calcule l'etat debloque / verrouille / visible.
--
-- Regle d'ouverture (unlock_rule) :
--   - 'always'       : toujours debloque.
--   - 'status'       : debloque si le statut d'inscription a atteint
--                      vault_documents.available_from (ordre student_status :
--                      decouverte < inscrit < bloque < certifie ; on traite
--                      'bloque' comme >= 'inscrit' pour la visibilite contractuelle).
--   - 'progressive'  : debloque uniquement via une ligne vault_unlocks
--                      (declenchee par video/question/exam/manual).
-- Un deblocage explicite (vault_unlocks) force toujours l'etat 'debloque'.
-- visible_when_locked controle l'affichage du document tant qu'il est verrouille.
-- -----------------------------------------------------------------------------
CREATE VIEW learner_vault_view AS
WITH status_rank AS (
    -- rang ordinal des statuts pour comparer "le statut a-t-il atteint available_from ?"
    SELECT 'decouverte'::student_status AS status, 0 AS rank
    UNION ALL SELECT 'inscrit'::student_status, 1
    UNION ALL SELECT 'bloque'::student_status, 1
    UNION ALL SELECT 'certifie'::student_status, 2
)
SELECT
    e.learner_id                                                       AS learner_id,
    e.formation_id                                                     AS formation_id,
    e.status                                                           AS enrollment_status,
    vd.id                                                              AS vault_document_id,
    vd.category                                                        AS category,
    vd.title                                                           AS title,
    vd.file_url                                                        AS file_url,
    vd.signature_required                                              AS signature_required,
    vd.unlock_rule                                                     AS unlock_rule,
    vd.available_from                                                  AS available_from,
    vd.visible_when_locked                                             AS visible_when_locked,
    (vu.id IS NOT NULL)                                                AS has_explicit_unlock,
    vu.unlocked_at                                                     AS unlocked_at,
    -- Etat resolu du document pour cet eleve.
    CASE
        WHEN vu.id IS NOT NULL THEN true
        WHEN vd.unlock_rule = 'always' THEN true
        WHEN vd.unlock_rule = 'status'
             AND vd.available_from IS NOT NULL
             AND COALESCE(sr_cur.rank, 0) >= COALESCE(sr_req.rank, 0) THEN true
        WHEN vd.unlock_rule = 'status' AND vd.available_from IS NULL THEN true
        ELSE false
    END                                                                AS is_unlocked,
    -- Visibilite : visible si debloque, sinon depend de visible_when_locked.
    CASE
        WHEN vu.id IS NOT NULL THEN true
        WHEN vd.unlock_rule = 'always' THEN true
        WHEN vd.unlock_rule = 'status'
             AND vd.available_from IS NOT NULL
             AND COALESCE(sr_cur.rank, 0) >= COALESCE(sr_req.rank, 0) THEN true
        WHEN vd.unlock_rule = 'status' AND vd.available_from IS NULL THEN true
        ELSE vd.visible_when_locked
    END                                                                AS is_visible
FROM enrollments e
JOIN vault_documents vd ON vd.formation_id = e.formation_id
LEFT JOIN vault_unlocks vu
       ON vu.learner_id = e.learner_id AND vu.vault_document_id = vd.id
LEFT JOIN status_rank sr_cur ON sr_cur.status = e.status
LEFT JOIN status_rank sr_req ON sr_req.status = vd.available_from;

COMMENT ON VIEW learner_vault_view IS
'Etat du coffre par eleve/document : is_unlocked et is_visible resolus depuis unlock_rule, available_from (vs statut inscription), vault_unlocks et visible_when_locked. Soumis a la RLS de enrollments/vault_unlocks.';


-- -----------------------------------------------------------------------------
-- engagement_overview
-- Vue de pilotage de l'engagement. days_since_last_activity est calcule A LA
-- VOLEE (now() - last_progress_at) car perissable : il n'est volontairement PAS
-- stocke dans engagement_tracking (cf. correction 11 du contrat).
-- -----------------------------------------------------------------------------
CREATE VIEW engagement_overview AS
SELECT
    et.learner_id                                                      AS learner_id,
    p.first_name                                                       AS first_name,
    p.last_name                                                        AS last_name,
    p.email                                                            AS email,
    et.status                                                          AS status,
    et.last_connection_at                                              AS last_connection_at,
    et.last_progress_at                                                AS last_progress_at,
    -- Jours depuis la derniere progression (NULL si jamais aucune progression).
    CASE
        WHEN et.last_progress_at IS NULL THEN NULL
        ELSE floor(EXTRACT(EPOCH FROM (now() - et.last_progress_at)) / 86400)::int
    END                                                                AS days_since_last_activity,
    -- Jours depuis la derniere connexion (info complementaire).
    CASE
        WHEN et.last_connection_at IS NULL THEN NULL
        ELSE floor(EXTRACT(EPOCH FROM (now() - et.last_connection_at)) / 86400)::int
    END                                                                AS days_since_last_connection,
    et.updated_at                                                      AS updated_at
FROM engagement_tracking et
JOIN profiles p ON p.id = et.learner_id;

COMMENT ON VIEW engagement_overview IS
'Pilotage engagement : days_since_last_activity = now() - last_progress_at calcule a la volee (valeur perissable, non stockee). Soumis a la RLS de engagement_tracking.';


-- =============================================================================
-- VUES D'EXPORT QUALIOPI
-- Agregent toute la cohorte -> reservees au staff. SECURITY INVOKER : la RLS
-- des tables sous-jacentes (SELECT self OR is_staff) garantit qu'un eleve ne
-- verrait que ses propres lignes ; le REVOKE/GRANT ci-dessous bloque en plus
-- tout acces direct au role authenticated (l'export passe par le staff /
-- service_role / RPC dediee).
-- =============================================================================


-- -----------------------------------------------------------------------------
-- export_ind2_resultats  (Ind.2 : resultats obtenus / reussite)
-- Resultats aux examens (bloc + final) par eleve.
-- -----------------------------------------------------------------------------
CREATE VIEW export_ind2_resultats AS
SELECT
    ea.id                                                              AS attempt_id,
    ea.learner_id                                                      AS learner_id,
    p.first_name                                                       AS first_name,
    p.last_name                                                        AS last_name,
    p.email                                                            AS email,
    ea.exam_kind                                                       AS exam_kind,
    eb.title                                                           AS exam_bloc_title,
    ef.title                                                           AS exam_final_title,
    ea.attempt_number                                                  AS attempt_number,
    ea.score                                                           AS score,
    ea.passed                                                          AS passed,
    ea.started_at                                                      AS started_at,
    ea.completed_at                                                    AS completed_at
FROM exam_attempts ea
JOIN profiles p ON p.id = ea.learner_id
LEFT JOIN exams_bloc eb ON eb.id = ea.exam_bloc_id
LEFT JOIN exams_final ef ON ef.id = ea.exam_final_id;

COMMENT ON VIEW export_ind2_resultats IS
'Qualiopi Ind.2 : tentatives d examen (bloc/final) avec score et reussite. Export staff uniquement.';


-- -----------------------------------------------------------------------------
-- export_ind4_preinscription  (Ind.4 : analyse du besoin / pre-inscription)
-- Reponses au questionnaire de pre-inscription, horodatees.
-- -----------------------------------------------------------------------------
CREATE VIEW export_ind4_preinscription AS
SELECT
    pea.id                                                             AS pre_enrollment_id,
    pea.learner_id                                                     AS learner_id,
    p.first_name                                                       AS first_name,
    p.last_name                                                        AS last_name,
    COALESCE(p.email, pea.contact_email)                               AS email,
    pea.contact_email                                                  AS contact_email,
    pea.questionnaire_version                                          AS questionnaire_version,
    pea.answers                                                        AS answers,
    pea.completed_at                                                   AS completed_at
FROM pre_enrollment_answers pea
LEFT JOIN profiles p ON p.id = pea.learner_id;

COMMENT ON VIEW export_ind4_preinscription IS
'Qualiopi Ind.4 : analyse du besoin via questionnaire de pre-inscription horodate (learner_id nullable si prospect anonyme). Export staff uniquement.';


-- -----------------------------------------------------------------------------
-- export_ind8_positionnement  (Ind.8 : positionnement a l entree)
-- Resultats du questionnaire de positionnement, horodates.
-- -----------------------------------------------------------------------------
CREATE VIEW export_ind8_positionnement AS
SELECT
    pr.id                                                              AS positioning_id,
    pr.learner_id                                                      AS learner_id,
    p.first_name                                                       AS first_name,
    p.last_name                                                        AS last_name,
    p.email                                                            AS email,
    pr.formation_id                                                    AS formation_id,
    f.title                                                            AS formation_title,
    pr.score                                                           AS score,
    pr.starting_level                                                  AS starting_level,
    pr.recommendations                                                 AS recommendations,
    pr.questionnaire_version                                           AS questionnaire_version,
    pr.answers                                                         AS answers,
    pr.completed_at                                                    AS completed_at
FROM positioning_results pr
JOIN profiles p ON p.id = pr.learner_id
JOIN formations f ON f.id = pr.formation_id;

COMMENT ON VIEW export_ind8_positionnement IS
'Qualiopi Ind.8 : positionnement a l entree (niveau de depart, score, recommandations) horodate. Export staff uniquement.';


-- -----------------------------------------------------------------------------
-- export_ind12_engagement  (Ind.12 : engagement / assiduite des apprenants)
-- Etat d engagement par eleve + jours d inactivite calcules a la volee.
-- -----------------------------------------------------------------------------
CREATE VIEW export_ind12_engagement AS
SELECT
    et.learner_id                                                      AS learner_id,
    p.first_name                                                       AS first_name,
    p.last_name                                                        AS last_name,
    p.email                                                            AS email,
    et.status                                                          AS engagement_status,
    et.last_connection_at                                              AS last_connection_at,
    et.last_progress_at                                                AS last_progress_at,
    CASE
        WHEN et.last_progress_at IS NULL THEN NULL
        ELSE floor(EXTRACT(EPOCH FROM (now() - et.last_progress_at)) / 86400)::int
    END                                                                AS days_since_last_activity,
    et.updated_at                                                      AS updated_at
FROM engagement_tracking et
JOIN profiles p ON p.id = et.learner_id;

COMMENT ON VIEW export_ind12_engagement IS
'Qualiopi Ind.12 : assiduite/engagement par eleve, days_since_last_activity calcule a la volee. Export staff uniquement.';


-- -----------------------------------------------------------------------------
-- export_ind30_satisfaction  (Ind.30 : recueil des appreciations)
-- Enquetes de satisfaction (a chaud / a froid).
-- -----------------------------------------------------------------------------
CREATE VIEW export_ind30_satisfaction AS
SELECT
    ss.id                                                              AS survey_id,
    ss.learner_id                                                      AS learner_id,
    p.first_name                                                       AS first_name,
    p.last_name                                                        AS last_name,
    p.email                                                            AS email,
    ss.formation_id                                                    AS formation_id,
    f.title                                                            AS formation_title,
    ss.type                                                            AS survey_type,
    ss.answers                                                         AS answers,
    ss.public_review                                                   AS public_review,
    ss.wants_public_review                                             AS wants_public_review,
    ss.is_published                                                    AS is_published,
    ss.completed_at                                                    AS completed_at,
    ss.created_at                                                      AS created_at
FROM satisfaction_surveys ss
LEFT JOIN profiles p ON p.id = ss.learner_id
JOIN formations f ON f.id = ss.formation_id;

COMMENT ON VIEW export_ind30_satisfaction IS
'Qualiopi Ind.30 : recueil des appreciations (enquetes chaud/froid). access_token volontairement non expose. Export staff uniquement.';


-- -----------------------------------------------------------------------------
-- export_ind31_signalements  (Ind.31 : traitement des reclamations / aleas)
-- Signalements remontes par les eleves (bug / incoherence) et leur traitement.
-- -----------------------------------------------------------------------------
CREATE VIEW export_ind31_signalements AS
SELECT
    vr.id                                                              AS report_id,
    vr.learner_id                                                      AS learner_id,
    p.first_name                                                       AS first_name,
    p.last_name                                                        AS last_name,
    p.email                                                            AS email,
    vr.video_id                                                        AS video_id,
    v.title                                                            AS video_title,
    vr.page_url                                                        AS page_url,
    vr.report_type                                                     AS report_type,
    vr.description                                                     AS description,
    vr.status                                                          AS status,
    vr.resolution_notes                                                AS resolution_notes,
    vr.resolved_at                                                     AS resolved_at,
    vr.created_at                                                      AS created_at
FROM video_reports vr
JOIN profiles p ON p.id = vr.learner_id
LEFT JOIN videos v ON v.id = vr.video_id;

COMMENT ON VIEW export_ind31_signalements IS
'Qualiopi Ind.31 : signalements (bug/incoherence) et leur traitement (statut, notes, resolution). Export staff uniquement.';


-- -----------------------------------------------------------------------------
-- Verrouillage d acces des vues d export Qualiopi.
-- On retire l acces au role authenticated (les eleves) : ces vues agregent la
-- cohorte et ne doivent etre lues que par le staff (via service_role ou RPC).
-- La RLS sous-jacente reste la defense de fond ; ce REVOKE evite meme l acces
-- en lecture directe via PostgREST.
-- -----------------------------------------------------------------------------
REVOKE ALL ON export_ind2_resultats        FROM authenticated, anon;
REVOKE ALL ON export_ind4_preinscription   FROM authenticated, anon;
REVOKE ALL ON export_ind8_positionnement   FROM authenticated, anon;
REVOKE ALL ON export_ind12_engagement      FROM authenticated, anon;
REVOKE ALL ON export_ind30_satisfaction    FROM authenticated, anon;
REVOKE ALL ON export_ind31_signalements    FROM authenticated, anon;


-- -----------------------------------------------------------------------------
-- security_invoker = true sur TOUTES les vues (advisor 'security_definer_view').
-- Sans cela une vue s'execute avec les droits du proprietaire (postgres) et
-- BYPASSE la RLS des tables sous-jacentes -> fuite inter-eleves possible sur les
-- vues par-eleve (learner_progress_view, learner_vault_view). Avec security_invoker,
-- la vue respecte la RLS de l'appelant : un eleve ne voit que SES lignes, le staff
-- (ou service_role) voit tout. Postgres 15+.
-- -----------------------------------------------------------------------------
ALTER VIEW notion_responses_global      SET (security_invoker = true);
ALTER VIEW notion_responses_by_learner  SET (security_invoker = true);
ALTER VIEW learner_progress_view        SET (security_invoker = true);
ALTER VIEW learner_vault_view           SET (security_invoker = true);
ALTER VIEW engagement_overview          SET (security_invoker = true);
ALTER VIEW export_ind2_resultats        SET (security_invoker = true);
ALTER VIEW export_ind4_preinscription   SET (security_invoker = true);
ALTER VIEW export_ind8_positionnement   SET (security_invoker = true);
ALTER VIEW export_ind12_engagement      SET (security_invoker = true);
ALTER VIEW export_ind30_satisfaction    SET (security_invoker = true);
ALTER VIEW export_ind31_signalements    SET (security_invoker = true);
