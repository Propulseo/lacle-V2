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

/** Les 7 modules du parcours, dans l'ordre d'affichage. */
export const PNL_MODULES: PnlModule[] = [
  {
    title: "Les fondations de la PNL",
    description:
      "Origines, principes fondateurs et cadre épistémologique de la programmation neuro-linguistique.",
  },
  {
    title: "Systèmes de représentation",
    description:
      "Comprendre les modalités sensorielles et leur influence sur la perception et la communication.",
  },
  {
    title: "Le méta-modèle",
    description:
      "Structure du langage et outils de précision linguistique pour une compréhension approfondie.",
  },
  {
    title: "Les ancrages",
    description:
      "Mécanismes d'association stimulus-réponse et leur rôle dans les processus cognitifs.",
  },
  {
    title: "Les sous-modalités",
    description:
      "Exploration des distinctions fines au sein des systèmes de représentation sensorielle.",
  },
  {
    title: "Les stratégies mentales",
    description:
      "Modélisation des séquences cognitives et compréhension des processus décisionnels.",
  },
  {
    title: "Intégration et synthèse",
    description:
      "Articulation de l'ensemble des concepts dans un cadre cohérent de compréhension.",
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
      "Oui. Le parcours se déroule entièrement à distance, en 7 modules structurés et progressifs. Chaque module pose les fondations théoriques, valide les acquis et mène à la certification.",
  },
  {
    question: "Faut-il des prérequis pour s’inscrire ?",
    answer:
      "Aucun prérequis académique n’est nécessaire. La formation s’adresse à toute personne souhaitant comprendre les mécanismes humains avec exigence et profondeur.",
  },
  {
    question: "Combien de temps dure la formation complète ?",
    answer:
      "Le rythme est volontairement progressif. La formation se déroule à votre rythme, chaque module nécessitant un temps d’assimilation. Comptez environ soixante heures au total, selon votre cadence de visionnage, d’exercices et d’évaluations.",
  },
  {
    question: "La formation est-elle certifiante ?",
    answer:
      "Oui. À l’issue du parcours distanciel, une certification de Praticien PNL est délivrée, attestant de la maîtrise des fondamentaux de la discipline tels qu’enseignés par l’institut La Clé.",
  },
];
