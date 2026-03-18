import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { HeroSection } from "@/components/ui/HeroSection";
import { SectionBlock } from "@/components/ui/SectionBlock";
import { VideoPlaceholder } from "@/components/ui/VideoPlaceholder";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Notre vocation — La Clé",
  description: "Comprendre le pourquoi profond de l\u2019institut La Clé et sa mission de compréhension des mécanismes humains.",
};

const SECTIONS = [
  {
    title: "L\u2019excellence n\u2019est pas un slogan",
    text: "Elle se manifeste dans la rigueur d\u2019une structure pensée pour la profondeur. Chaque élément de notre approche a été construit pour servir un objectif unique : permettre une compréhension réelle des mécanismes qui gouvernent nos comportements, nos décisions et nos interactions.",
    video: "excellence",
  },
  {
    title: "Aller au c\u0153ur des mécanismes",
    text: "La surface ne suffit pas. Comprendre véritablement, c\u2019est accéder aux structures profondes qui sous-tendent l\u2019expérience humaine. Notre pédagogie est conçue pour accompagner cette descente vers l\u2019essentiel, avec méthode et sans précipitation.",
    video: "mecanismes",
  },
  {
    title: "L\u2019humain comme horizon",
    text: "Au-delà des outils et des méthodes, c\u2019est l\u2019humain qui reste au centre. La compréhension des mécanismes n\u2019est pas une fin en soi — elle est un moyen d\u2019accéder à une maîtrise plus consciente de soi et de ses interactions avec le monde.",
    video: "humain",
  },
];

export default function VocationPage() {
  return (
    <>
      <Header showBack backHref={ROUTES.discover} backLabel="Nous découvrir" />
      <PageWrapper>
        <HeroSection
          title="Notre vocation"
          subtitle="Un institut fondé sur une conviction : la compréhension précède l'action."
        />

        {SECTIONS.map((section, i) => (
          <SectionBlock key={section.video} background={i % 2 === 0 ? "graphite" : "noir"}>
            <ScrollReveal>
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <h2 className="mb-6">{section.title}</h2>
                  <p className="max-w-xl">{section.text}</p>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <VideoPlaceholder label={`Vidéo — ${section.title}`} />
                </div>
              </div>
            </ScrollReveal>
          </SectionBlock>
        ))}

        <SectionBlock>
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-6">La compréhension comme fondation</h2>
              <p className="mb-12">
                Chaque parcours proposé par La Clé repose sur ce principe fondateur.
                Les personnes qui incarnent cette vision sont le reflet de cet engagement.
              </p>
              <Button href={ROUTES.team} size="large">
                Découvrir l&apos;équipe fondatrice
              </Button>
            </div>
          </ScrollReveal>
        </SectionBlock>

        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
