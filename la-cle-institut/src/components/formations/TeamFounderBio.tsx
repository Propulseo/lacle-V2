"use client";

import { Expandable } from "@/components/ui/Expandable";

export function TeamFounderBio() {
  return (
    <div>
      <h2 className="mb-6">Parcours du fondateur</h2>
      {/* COPY — validé Marien : ostéo + anatomie depuis 2018, « dix ans de thérapie / huit ans d'enseignement », prénom seul. */}
      <p className="mb-8 max-w-2xl">
        Ostéopathe, Marien cumule plus de dix ans d&apos;expérience en thérapie
        et huit ans d&apos;enseignement&nbsp;: il enseigne l&apos;anatomie et la
        physiologie depuis 2018. Cet ancrage clinique nourrit son regard sur les
        mécanismes cognitifs et comportementaux, qu&apos;il étudie en parallèle.
        Formé aux approches les plus exigeantes, il a développé une conviction
        profonde&nbsp;: la compréhension véritable demande un cadre structuré,
        du temps, et une pédagogie sans compromis.
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
              De cette synthèse naît la conviction qui fonde La Clé&nbsp;:
              enseigner la PNL (et plus largement les mécanismes humains)
              avec l&apos;exigence d&apos;un institut, pas avec l&apos;énergie d&apos;un
              séminaire. Comprendre avant d&apos;agir. Toujours.
            </p>
          </div>
        </Expandable>
      </div>
    </div>
  );
}
