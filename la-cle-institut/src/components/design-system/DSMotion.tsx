import { SectionBlock } from "@/components/ui/SectionBlock";
import { Expandable } from "@/components/ui/Expandable";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const FAQ_ITEMS = [
  { question: "Qu'est-ce que la PNL telle qu'enseignée par La Clé ?", answer: "La PNL est un cadre de compréhension des mécanismes cognitifs et comportementaux. Chez La Clé, elle est enseignée comme un outil d'observation et de compréhension, jamais comme une technique de manipulation ou de transformation rapide." },
  { question: "Le parcours est-il entièrement à distance ?", answer: "Oui. Le parcours se déroule entièrement à distance, en modules structurés et progressifs, jusqu'à l'attestation de fin de formation." },
  { question: "Faut-il des prérequis pour s'inscrire ?", answer: "Aucun prérequis académique n'est nécessaire. La formation s'adresse à toute personne souhaitant comprendre les mécanismes humains avec exigence et profondeur." },
];

/** Sections "Scroll Reveal", "Expandable & FAQ" et "Section type". */
export function DSMotion() {
  return (
    <>
      {/* ---- SCROLL REVEAL ---- */}
      <SectionBlock>
        <h2 className="mb-12">Scroll Reveal</h2>
        <div className="space-y-8">
          <ScrollReveal>
            <div className="border border-filet p-8">
              <p className="text-cendre">Ce bloc apparaît avec un fade-in vertical au scroll.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="border border-filet p-8">
              <p className="text-cendre">Deuxième bloc avec délai de 150ms.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="border border-filet p-8">
              <p className="text-cendre">Troisième bloc avec délai de 300ms.</p>
            </div>
          </ScrollReveal>
        </div>
      </SectionBlock>

      {/* ---- EXPANDABLE ---- */}
      <SectionBlock background="graphite">
        <h2 className="mb-12">Expandable &amp; FAQ</h2>
        <div className="max-w-2xl">
          <p className="mb-6 text-xs uppercase tracking-widest text-pierre">Bloc dépliable</p>
          <Expandable title="Parcours du fondateur">
            <p>
              Marien a consacré plus de quinze années à l&apos;étude des mécanismes cognitifs
              et comportementaux. Son parcours l&apos;a mené de la pratique clinique à
              l&apos;enseignement structuré, avec une conviction constante : la compréhension
              précède toujours l&apos;action efficace.
            </p>
          </Expandable>
          <Expandable title="Philosophie pédagogique">
            <p>
              La pédagogie de La Clé repose sur un principe fondamental : chaque concept
              doit être compris dans sa profondeur avant d&apos;être mis en pratique.
              Le rythme est volontairement progressif.
            </p>
          </Expandable>
        </div>
        <div className="mt-16 max-w-2xl">
          <p className="mb-6 text-xs uppercase tracking-widest text-pierre">FAQ Accordéon</p>
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </SectionBlock>

      {/* ---- SECTION BLOCK DEMO ---- */}
      <SectionBlock>
        <h2 className="mb-6">Section type — Rythme vertical</h2>
        <p className="mb-12 max-w-2xl">
          Chaque section respecte un rythme vertical généreux : 80px mobile, 112px tablette,
          128px desktop. La respiration entre les blocs est un élément fondamental du design system.
        </p>
        <div className="grid gap-px border border-filet md:grid-cols-3">
          <div className="bg-graphite p-10">
            <p className="text-xs uppercase tracking-widest text-bronze">py-20</p>
            <p className="mt-2 text-sm text-cendre">80px — Mobile</p>
          </div>
          <div className="bg-graphite p-10">
            <p className="text-xs uppercase tracking-widest text-bronze">md:py-28</p>
            <p className="mt-2 text-sm text-cendre">112px — Tablette</p>
          </div>
          <div className="bg-graphite p-10">
            <p className="text-xs uppercase tracking-widest text-bronze">lg:py-32</p>
            <p className="mt-2 text-sm text-cendre">128px — Desktop</p>
          </div>
        </div>
      </SectionBlock>
    </>
  );
}
