import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { DiscoverNav } from "@/components/layout/DiscoverNav";
import { HeroSection } from "@/components/ui/HeroSection";
import { SectionBlock } from "@/components/ui/SectionBlock";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Le concept — La Clé",
  description: "Le cadre méthodologique et intellectuel qui structure l\u2019approche de l\u2019institut La Clé.",
};

const SECTIONS: {
  bg: "graphite" | "noir";
  num: string;
  title: string;
  text: string;
  quote?: string;
}[] = [
  {
    bg: "graphite",
    num: "01",
    title: "Le cadre méthodologique",
    text: "L\u2019institut La Clé repose sur un cadre méthodologique rigoureux, construit pour structurer l\u2019apprentissage de la compréhension humaine. Chaque formation, chaque module, chaque exercice s\u2019inscrit dans une progression pensée pour la profondeur — jamais pour la rapidité.",
  },
  {
    bg: "noir",
    num: "02",
    title: "Compréhension, pas transformation",
    text: "La distinction est fondamentale. Nous ne promettons pas de changer qui vous êtes. Nous proposons un cadre pour comprendre comment vous fonctionnez. La transformation peut être une conséquence naturelle de la compréhension — mais elle n\u2019est jamais l\u2019objectif affiché, ni la promesse faite.",
    quote: "Comprendre n\u2019est pas transformer. C\u2019est éclairer.",
  },
  {
    bg: "graphite",
    num: "03",
    title: "La logique de progression",
    text: "Chaque étape du parcours pédagogique a été conçue dans un ordre précis. Les fondations précèdent les applications. La théorie nourrit la pratique. Le rythme est volontairement progressif, car la compréhension profonde exige du temps et de la répétition structurée.",
  },
  {
    bg: "noir",
    num: "04",
    title: "La place de la PNL",
    text: "La Programmation Neuro-Linguistique constitue le premier pilier de notre offre pédagogique. Elle est enseignée ici non comme une boîte à outils de techniques, mais comme un cadre d\u2019observation et de compréhension des mécanismes cognitifs et comportementaux. D\u2019autres disciplines viendront compléter cette fondation.",
    quote: "Observer, comprendre, puis seulement agir.",
  },
  {
    bg: "graphite",
    num: "05",
    title: "Une posture non thérapeutique",
    text: "L\u2019institut La Clé n\u2019est pas un espace thérapeutique. Nous ne soignons pas. Nous ne diagnostiquons pas. Nous enseignons la compréhension des mécanismes — avec rigueur, méthode et respect du cadre académique qui structure nos formations.",
  },
];

export default function ConceptPage() {
  return (
    <>
      <Header showBack backHref={ROUTES.discover} backLabel="Nous découvrir" />
      <PageWrapper>
        <HeroSection
          label="Philosophie"
          title="Le concept"
          subtitle="Un cadre structuré pour comprendre, jamais pour transformer."
          decorativeLine
        />

        {SECTIONS.map((section) => (
          <SectionBlock key={section.title} background={section.bg}>
            <ScrollReveal>
              <div className="grid items-start gap-10 lg:grid-cols-[auto,1fr] lg:gap-16">
                <span
                  className="hidden font-display text-6xl font-extralight text-bronze/10 lg:block lg:text-7xl"
                  aria-hidden="true"
                >
                  {section.num}
                </span>
                <div>
                  <h2 className="mb-6">{section.title}</h2>
                  <p className="max-w-2xl">{section.text}</p>
                  {section.quote && (
                    <blockquote className="mt-8 border-l-2 border-bronze/30 pl-6">
                      <p className="font-display text-lg font-light italic text-ivoire/60">
                        &laquo;&nbsp;{section.quote}&nbsp;&raquo;
                      </p>
                    </blockquote>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </SectionBlock>
        ))}

        {/* Gradient separator */}
        <div className="flex justify-center">
          <div
            className="h-px w-32 bg-gradient-to-r from-transparent via-bronze/30 to-transparent"
            aria-hidden="true"
          />
        </div>

        <SectionBlock>
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-6">Un cadre incarné</h2>
              <p className="mb-12">
                Ce cadre méthodologique prend vie à travers les personnes qui
                l&apos;ont construit et qui le transmettent au quotidien.
              </p>
              <Button href={ROUTES.team} size="large">
                Découvrir l&apos;équipe
              </Button>
            </div>
          </ScrollReveal>
        </SectionBlock>

        <DiscoverNav current="concept" />

        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
