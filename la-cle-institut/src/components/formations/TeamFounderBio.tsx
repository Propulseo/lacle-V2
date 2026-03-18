"use client";

import { Expandable } from "@/components/ui/Expandable";

export function TeamFounderBio() {
  return (
    <div>
      <h2 className="mb-6">Parcours du fondateur</h2>
      <p className="mb-8 max-w-2xl">
        Marien a consacré plus de quinze années à l&apos;étude des mécanismes
        cognitifs et comportementaux. Formé aux approches les plus exigeantes,
        il a développé une conviction profonde : la compréhension véritable
        exige un cadre structuré, du temps, et une pédagogie sans compromis.
      </p>
      <div className="max-w-2xl">
        <Expandable title="Parcours détaillé">
          <div className="space-y-4">
            <p>
              Son parcours commence par une formation approfondie en
              Programmation Neuro-Linguistique, où il obtient ses
              certifications de Praticien puis de Maître Praticien. Mais
              très vite, il ressent les limites d&apos;un enseignement trop
              centré sur la technique et insuffisamment ancré dans la
              compréhension des mécanismes fondamentaux.
            </p>
            <p>
              Cette insatisfaction le pousse à approfondir ses connaissances
              en sciences cognitives, en linguistique et en épistémologie
              de l&apos;apprentissage. Il étudie les travaux fondateurs de
              Bandler et Grinder, mais aussi les recherches contemporaines
              sur les processus attentionnels et la plasticité cognitive.
            </p>
            <p>
              De cette synthèse naît la conviction qui fonde La Clé :
              enseigner la PNL — et plus largement les mécanismes humains —
              avec la rigueur d&apos;un institut, pas avec l&apos;énergie d&apos;un
              séminaire. Comprendre avant d&apos;agir. Toujours.
            </p>
          </div>
        </Expandable>
      </div>
    </div>
  );
}
