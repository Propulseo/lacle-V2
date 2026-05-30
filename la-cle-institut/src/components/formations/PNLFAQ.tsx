"use client";

import { FAQAccordion } from "@/components/ui/FAQAccordion";

const FAQ_ITEMS = [
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

export function PNLFAQ() {
  return (
    <div>
      <h2 className="mb-10">Questions fréquentes</h2>
      <div className="max-w-2xl">
        <FAQAccordion items={FAQ_ITEMS} />
      </div>
    </div>
  );
}
