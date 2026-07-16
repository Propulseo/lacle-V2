-- =============================================================================
-- 20260716000100_cms_retours_client_juin.sql
-- [CMS vitrine : application des retours client Marien du 23/06/2026]
--
-- Le seed 20260615000100 a peuplé site_collections avec le contenu de la page
-- de vente PNL. Sa garde NOT EXISTS empêche toute correction par re-seed :
-- cette migration met donc à jour les lignes DÉJÀ en base. Sans elle, le CMS
-- continuerait de surcharger le fallback code avec l'ancien contenu.
--
-- Le fallback en dur (la-cle-institut/src/lib/pnl-content.ts) a été corrigé en
-- parallèle et porte exactement les mêmes textes.
--
-- Contenu :
--   1. FAQ #2 et #5 — retour 14 : le distanciel ne certifie pas, il atteste.
--   2. FAQ #4       — volume horaire tranché par Marien (60 h vidéos / 100 h estimées).
--   3. modules_pnl  — retour 15 : remplacement par les 7 phases du document
--                     « Architecture des cours ».
--
-- Idempotent : les UPDATE ne matchent que l'ancienne formulation ; le bloc
-- modules_pnl est un DELETE + INSERT complet. Réexécutée, la migration est
-- sans effet de bord.
-- Dépend de : 20260615000100_seed_site_cms.sql.
-- =============================================================================

-- ----------------------------------------------------------------------------
-- 1. FAQ — retour 14 : « à l'issue du distanciel il n'y a PAS de certification ;
--    il y a une attestation de fin de formation. La certification est en présentiel. »
-- ----------------------------------------------------------------------------

-- Item #2 — « Le parcours est-il entièrement à distance ? » : seule la fin change.
UPDATE site_collections
SET data = jsonb_set(
  data,
  '{answer}',
  to_jsonb($$Oui. Le parcours se déroule entièrement à distance, en 7 modules structurés et progressifs. Chaque module pose les fondations théoriques, valide les acquis et mène à une attestation de fin de formation.$$::text)
)
WHERE type = 'faq'
  AND data->>'question' = 'Le parcours est-il entièrement à distance ?'
  AND data->>'answer' LIKE '%mène à la certification%';

-- Item #5 — la question « La formation est-elle certifiante ? » répondue « Oui »
-- était la mention la plus explicitement fausse : question + réponse reformulées.
UPDATE site_collections
SET data = jsonb_set(
  jsonb_set(
    data,
    '{question}',
    to_jsonb($$Que valide le parcours distanciel ?$$::text)
  ),
  '{answer}',
  to_jsonb($$À l’issue du parcours distanciel, une attestation de fin de formation est délivrée. Elle atteste du suivi complet du parcours et de la validation des acquis, avec exigence et profondeur. La certification, elle, s’obtient lors de la mise en pratique en présentiel.$$::text)
)
WHERE type = 'faq'
  AND data->>'question' = 'La formation est-elle certifiante ?';

-- ----------------------------------------------------------------------------
-- 2. FAQ #4 — volume horaire. Décision Marien (16/07/2026) : ~60 h de vidéos,
--    ~100 h de temps de réalisation estimé côté élève. Lève la contradiction
--    entre PROGRAMME DE FORMATION.docx (60 h) et ATTESTATION (100 h).
-- ----------------------------------------------------------------------------
UPDATE site_collections
SET data = jsonb_set(
  data,
  '{answer}',
  to_jsonb($$Le parcours compte environ soixante heures de vidéos. Le temps de réalisation estimé est d’environ cent heures : le rythme est volontairement progressif, chaque module nécessitant un temps d’assimilation, d’exercices et d’évaluations. Vous avancez à votre rythme.$$::text)
)
WHERE type = 'faq'
  AND data->>'question' = 'Combien de temps dure la formation complète ?'
  AND data->>'answer' LIKE '%soixante heures au total%';

-- ----------------------------------------------------------------------------
-- 3. modules_pnl — retour 15 : « à la place de ces sept étapes tu pourras mettre
--    le document Architecture des cours ». Les 7 titres seedés étaient une
--    invention du site et ne correspondaient à aucun document client.
--    Remplacement intégral par les 7 phases (cours 1 à 60), objectifs et
--    compétences clés repris mot pour mot du document.
--
--    DELETE + INSERT plutôt qu'UPDATE : les 7 lignes changent en totalité.
--    Aucune édition admin n'est écrasée (le CMS vitrine n'a jamais été édité).
-- ----------------------------------------------------------------------------
DELETE FROM site_collections WHERE type = 'modules_pnl';

INSERT INTO site_collections (type, position, data, published)
SELECT 'modules_pnl'::site_collection_type, x.pos, x.data, true
FROM (VALUES
  (1::numeric, jsonb_build_object(
    'title', $$Comprendre la carte$$,
    'description', $$Cours 1 à 7. Poser les fondations et changer de regard : origines et principes de la PNL, modélisation et systémique, filtres de la perception, structure de l’expérience. Compétence clé : comprendre que toute perception est un modèle, jamais la réalité elle-même.$$)),
  (2::numeric, jsonb_build_object(
    'title', $$Lire l’humain$$,
    'description', $$Cours 8 à 12. Affiner la perception et l’observation : calibration, synchronisation, rapport, systèmes sensoriels et sous-modalités, indices linguistiques et accès oculaires. Compétence clé : voir derrière les mots et repérer la structure de l’expérience de l’autre.$$)),
  (3::numeric, jsonb_build_object(
    'title', $$Structurer le changement$$,
    'description', $$Cours 13 à 23. Comprendre et guider les états internes : objectifs et écologie, cadres de perception, association et dissociation, positions perceptuelles, feedback et guidage. Compétence clé : identifier où se situe une personne et comment structurer un changement cohérent.$$)),
  (4::numeric, jsonb_build_object(
    'title', $$Maîtriser le langage et l’apprentissage$$,
    'description', $$Cours 24 à 32. Développer précision et conscience des processus : métamodèle du langage, biais et présuppositions, apprentissages de niveau 1, 2 et 3, ancrages et congruence. Compétence clé : utiliser le langage comme un outil de compréhension et d’ajustement fin.$$)),
  (5::numeric, jsonb_build_object(
    'title', $$Valeurs, croyances et identité$$,
    'description', $$Cours 33 à 40. Travailler les couches profondes du fonctionnement humain : niveaux logiques, valeurs et critères, croyances aidantes et limitantes, rapport au temps et identité. Compétence clé : lire et travailler les mécanismes profonds qui orientent les choix et les comportements.$$)),
  (6::numeric, jsonb_build_object(
    'title', $$Posture et éthique de l’accompagnant$$,
    'description', $$Cours 41 à 48. Passer de l’outil à la posture : présupposés PNL revisités, responsabilité et limites, dangers des déséquilibres, supervision et apprentissage continu. Compétence clé : incarner une posture lucide, responsable et éthique.$$)),
  (7::numeric, jsonb_build_object(
    'title', $$Maîtrise et intégration$$,
    'description', $$Cours 49 à 60. Construire une vision stratégique et intégrée : stratégies avancées et modélisation, niveaux d’apprentissage et illusions de compétence, conflits internes et cohérence, lois systémiques. Compétence clé : penser en PNL et accompagner avec finesse.$$))
) AS x(pos, data);
