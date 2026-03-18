"use client";

import { FAQAccordion } from "@/components/ui/FAQAccordion";

const FAQ_ITEMS = [
  {
    question: "Qu\u2019est-ce que la PNL telle qu\u2019enseignée par La Clé ?",
    answer:
      "La PNL est un cadre de compréhension des mécanismes cognitifs et comportementaux. Chez La Clé, elle est enseignée comme un outil d\u2019observation et de compréhension, jamais comme une technique de manipulation ou de transformation rapide.",
  },
  {
    question: "Le parcours est-il entièrement à distance ?",
    answer:
      "Non. Le parcours combine une phase distancielle structurée en 7 modules et une phase présentielle intensive. La partie distancielle pose les fondations théoriques, le présentiel permet l\u2019intégration pratique et mène à la certification.",
  },
  {
    question: "Faut-il des prérequis pour s\u2019inscrire ?",
    answer:
      "Aucun prérequis académique n\u2019est nécessaire. La formation s\u2019adresse à toute personne souhaitant comprendre les mécanismes humains avec rigueur et profondeur.",
  },
  {
    question: "Combien de temps dure la formation complète ?",
    answer:
      "Le rythme est volontairement progressif. La phase distancielle se déroule à votre rythme, chaque module nécessitant un temps d\u2019assimilation. La phase présentielle est planifiée sur des sessions intensives dont les dates sont communiquées via l\u2019espace apprenant.",
  },
  {
    question: "La formation est-elle certifiante ?",
    answer:
      "Oui. À l\u2019issue du parcours complet — distanciel et présentiel — une certification de Praticien PNL est délivrée, attestant de la maîtrise des fondamentaux de la discipline tels qu\u2019enseignés par l\u2019institut La Clé.",
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
