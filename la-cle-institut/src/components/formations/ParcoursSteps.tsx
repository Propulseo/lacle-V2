"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";

const STEPS = [
  {
    number: "01",
    title: "Distanciel",
    subtitle: "7 modules structurés",
    description: "Fondations théoriques à votre rythme. Chaque module construit sur le précédent.",
  },
  {
    number: "02",
    title: "Attestation",
    subtitle: "Pré-praticien PNL",
    description: "Validation des acquis. Attestation de fin de formation délivrée par l\u2019institut La Clé.",
  },
];

export function ParcoursSteps() {
  return (
    <div className="grid gap-px md:grid-cols-2">
      {STEPS.map((step, i) => (
        <ScrollReveal key={step.number} delay={i * 0.12}>
          <div className="card-elevated group relative border border-filet bg-graphite/60 p-8 transition-all duration-500 hover:bg-ardoise/60 md:p-10">
            {/* Step number */}
            <span className="mb-6 block font-display text-5xl font-light text-bronze/20 md:text-6xl">
              {step.number}
            </span>

            {/* Connector line (hidden on last) */}
            {i < STEPS.length - 1 && (
              <div className="absolute right-0 top-1/2 hidden h-px w-6 -translate-y-1/2 translate-x-full bg-filet md:block" />
            )}

            <p className="mb-1 text-label text-bronze">
              {step.subtitle}
            </p>
            <h3 className="mb-4 font-display text-2xl text-ivoire md:text-3xl">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-cendre/80">
              {step.description}
            </p>

            {/* Bottom accent */}
            <div className="mt-8 h-px w-8 bg-bronze/20 transition-all duration-500 group-hover:w-16 group-hover:bg-bronze/40" />
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
