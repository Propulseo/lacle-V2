/**
 * Contenu éditorial de la page formation Praticien PNL.
 *
 * Sert de FALLBACK en dur lorsque Supabase n'expose aucune donnée (ou n'est
 * pas configuré). Les getters de src/lib/cms/ surchargent ces valeurs par
 * défaut quand une ligne existe en base.
 *
 * // TODO // Supabase: collections site_collections type 'modules_pnl' et 'faq'.
 */

/** Un module du parcours distanciel (timeline « 7 modules »). */
export interface PnlModule {
  title: string;
  description: string;
}

/** Une question fréquente affichée dans l'accordéon FAQ. */
export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Les 7 modules du parcours, dans l'ordre d'affichage.
 *
 * Source de vérité : « Architecture des cours » (document Marien, retour 15).
 * Les 7 phases y couvrent les cours 1 à 60 ; chaque phase porte un objectif et
 * une compétence clé, repris ici mot pour mot. Les titres précédents étaient
 * une invention du site et ne correspondaient à aucun document.
 */
export const PNL_MODULES: PnlModule[] = [
  {
    title: "Comprendre la carte",
    description:
      "Cours 1 à 7. Poser les fondations et changer de regard : origines et principes de la PNL, modélisation et systémique, filtres de la perception, structure de l’expérience. Compétence clé : comprendre que toute perception est un modèle, jamais la réalité elle-même.",
  },
  {
    title: "Lire l’humain",
    description:
      "Cours 8 à 12. Affiner la perception et l’observation : calibration, synchronisation, rapport, systèmes sensoriels et sous-modalités, indices linguistiques et accès oculaires. Compétence clé : voir derrière les mots et repérer la structure de l’expérience de l’autre.",
  },
  {
    title: "Structurer le changement",
    description:
      "Cours 13 à 23. Comprendre et guider les états internes : objectifs et écologie, cadres de perception, association et dissociation, positions perceptuelles, feedback et guidage. Compétence clé : identifier où se situe une personne et comment structurer un changement cohérent.",
  },
  {
    title: "Maîtriser le langage et l’apprentissage",
    description:
      "Cours 24 à 32. Développer précision et conscience des processus : métamodèle du langage, biais et présuppositions, apprentissages de niveau 1, 2 et 3, ancrages et congruence. Compétence clé : utiliser le langage comme un outil de compréhension et d’ajustement fin.",
  },
  {
    title: "Valeurs, croyances et identité",
    description:
      "Cours 33 à 40. Travailler les couches profondes du fonctionnement humain : niveaux logiques, valeurs et critères, croyances aidantes et limitantes, rapport au temps et identité. Compétence clé : lire et travailler les mécanismes profonds qui orientent les choix et les comportements.",
  },
  {
    title: "Posture et éthique de l’accompagnant",
    description:
      "Cours 41 à 48. Passer de l’outil à la posture : présupposés PNL revisités, responsabilité et limites, dangers des déséquilibres, supervision et apprentissage continu. Compétence clé : incarner une posture lucide, responsable et éthique.",
  },
  {
    title: "Maîtrise et intégration",
    description:
      "Cours 49 à 60. Construire une vision stratégique et intégrée : stratégies avancées et modélisation, niveaux d’apprentissage et illusions de compétence, conflits internes et cohérence, lois systémiques. Compétence clé : penser en PNL et accompagner avec finesse.",
  },
];

/** Les 5 questions fréquentes, dans l'ordre d'affichage. */
export const PNL_FAQ: FaqItem[] = [
  {
    question: "Qu’est-ce que la PNL telle qu’enseignée par La Clé ?",
    answer:
      "La PNL est un cadre de compréhension des mécanismes cognitifs et comportementaux. Chez La Clé, elle est enseignée comme un outil d’observation, de compréhension, voire d’altruisme. Jamais comme une technique de manipulation ou de transformation rapide.",
  },
  {
    question: "Le parcours est-il entièrement à distance ?",
    answer:
      "Oui. Le parcours se déroule entièrement à distance, en 7 modules structurés et progressifs. Chaque module pose les fondations théoriques, valide les acquis et mène à une attestation de fin de formation.",
  },
  {
    question: "Faut-il des prérequis pour s’inscrire ?",
    answer:
      "Aucun prérequis académique n’est nécessaire. La formation s’adresse à toute personne souhaitant comprendre les mécanismes humains avec exigence et profondeur.",
  },
  {
    question: "Combien de temps dure la formation complète ?",
    answer:
      "Le parcours compte environ soixante heures de vidéos. Le temps de réalisation estimé est d’environ cent heures : le rythme est volontairement progressif, chaque module nécessitant un temps d’assimilation, d’exercices et d’évaluations. Vous avancez à votre rythme.",
  },
  {
    question: "Que valide le parcours distanciel ?",
    answer:
      "À l’issue du parcours distanciel, une attestation de fin de formation est délivrée. Elle atteste du suivi complet du parcours et de la validation des acquis, avec exigence et profondeur. La certification, elle, s’obtient lors de la mise en pratique en présentiel.",
  },
];
