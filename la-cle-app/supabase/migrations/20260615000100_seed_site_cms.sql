-- =============================================================================
-- 20260615000100_seed_site_cms.sql  [Seed CMS site vitrine v1]
-- Peuple site_content + site_collections avec le contenu actuellement EN DUR
-- dans la-cle-institut, pour que le staff (Marien) voie/edite l'existant et que
-- la vitrine lise les memes valeurs que son fallback.
--
-- Idempotent : ON CONFLICT (site_content) + garde NOT EXISTS (site_collections).
-- Garde-fou : seuls les contenus structures de la page de vente PNL sont semes.
-- Le hero anime, les textes legaux et les formulations de conformite restent
-- FIGES en code (jamais dans ces tables).
--
-- Depend de : 20260613001200_site_cms.sql (tables + RLS + triggers).
-- =============================================================================

-- ----------------------------------------------------------------------------
-- site_content : valeurs cle/valeur de la page de vente PNL
-- ----------------------------------------------------------------------------
INSERT INTO site_content (key, group_name, label, value) VALUES
  ('page_last_updated', 'formation_pnl', 'Date de derniere actualisation',
    to_jsonb($$juin 2026$$::text)),
  ('formation_price', 'formation_pnl', 'Tarif formation PNL',
    to_jsonb($$2 200 € TTC$$::text)),
  ('resultats_pnl', 'formation_pnl', 'Indicateurs de resultats (PNL)',
    jsonb_build_object(
      'satisfactionSur5', 4.8,
      'tauxReussite', 92,
      'tauxCompletion', 87,
      'nombreApprenants', 12,
      'tauxRecommandation', 95
    ))
ON CONFLICT (key) DO NOTHING;

-- ----------------------------------------------------------------------------
-- site_collections : modules_pnl (7 items ordonnes)
-- ----------------------------------------------------------------------------
INSERT INTO site_collections (type, position, data, published)
SELECT 'modules_pnl'::site_collection_type, x.pos, x.data, true
FROM (VALUES
  (1::numeric, jsonb_build_object(
    'title', $$Les fondations de la PNL$$,
    'description', $$Origines, principes fondateurs et cadre épistémologique de la programmation neuro-linguistique.$$)),
  (2::numeric, jsonb_build_object(
    'title', $$Systèmes de représentation$$,
    'description', $$Comprendre les modalités sensorielles et leur influence sur la perception et la communication.$$)),
  (3::numeric, jsonb_build_object(
    'title', $$Le méta-modèle$$,
    'description', $$Structure du langage et outils de précision linguistique pour une compréhension approfondie.$$)),
  (4::numeric, jsonb_build_object(
    'title', $$Les ancrages$$,
    'description', $$Mécanismes d'association stimulus-réponse et leur rôle dans les processus cognitifs.$$)),
  (5::numeric, jsonb_build_object(
    'title', $$Les sous-modalités$$,
    'description', $$Exploration des distinctions fines au sein des systèmes de représentation sensorielle.$$)),
  (6::numeric, jsonb_build_object(
    'title', $$Les stratégies mentales$$,
    'description', $$Modélisation des séquences cognitives et compréhension des processus décisionnels.$$)),
  (7::numeric, jsonb_build_object(
    'title', $$Intégration et synthèse$$,
    'description', $$Articulation de l'ensemble des concepts dans un cadre cohérent de compréhension.$$))
) AS x(pos, data)
WHERE NOT EXISTS (SELECT 1 FROM site_collections WHERE type = 'modules_pnl');

-- ----------------------------------------------------------------------------
-- site_collections : faq (5 items ordonnes)
-- ----------------------------------------------------------------------------
INSERT INTO site_collections (type, position, data, published)
SELECT 'faq'::site_collection_type, x.pos, x.data, true
FROM (VALUES
  (1::numeric, jsonb_build_object(
    'question', $$Qu’est-ce que la PNL telle qu’enseignée par La Clé ?$$,
    'answer', $$La PNL est un cadre de compréhension des mécanismes cognitifs et comportementaux. Chez La Clé, elle est enseignée comme un outil d’observation, de compréhension, voire d’altruisme. Jamais comme une technique de manipulation ou de transformation rapide.$$)),
  (2::numeric, jsonb_build_object(
    'question', $$Le parcours est-il entièrement à distance ?$$,
    'answer', $$Oui. Le parcours se déroule entièrement à distance, en 7 modules structurés et progressifs. Chaque module pose les fondations théoriques, valide les acquis et mène à la certification.$$)),
  (3::numeric, jsonb_build_object(
    'question', $$Faut-il des prérequis pour s’inscrire ?$$,
    'answer', $$Aucun prérequis académique n’est nécessaire. La formation s’adresse à toute personne souhaitant comprendre les mécanismes humains avec exigence et profondeur.$$)),
  (4::numeric, jsonb_build_object(
    'question', $$Combien de temps dure la formation complète ?$$,
    'answer', $$Le rythme est volontairement progressif. La formation se déroule à votre rythme, chaque module nécessitant un temps d’assimilation. Comptez environ soixante heures au total, selon votre cadence de visionnage, d’exercices et d’évaluations.$$)),
  (5::numeric, jsonb_build_object(
    'question', $$La formation est-elle certifiante ?$$,
    'answer', $$Oui. À l’issue du parcours distanciel, une certification de Praticien PNL est délivrée, attestant de la maîtrise des fondamentaux de la discipline tels qu’enseignés par l’institut La Clé.$$))
) AS x(pos, data)
WHERE NOT EXISTS (SELECT 1 FROM site_collections WHERE type = 'faq');
