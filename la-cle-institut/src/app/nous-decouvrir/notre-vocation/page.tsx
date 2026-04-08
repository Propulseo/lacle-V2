import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionBlock } from "@/components/ui/SectionBlock";
import { VideoPlaceholder } from "@/components/ui/VideoPlaceholder";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Notre vocation — La Clé",
  description:
    "Comprendre le pourquoi profond de l\u2019institut La Clé et sa mission de compréhension des mécanismes humains.",
};

const SECTIONS = [
  {
    number: "01",
    title: "L\u2019excellence n\u2019est pas un slogan",
    text: "Elle se manifeste dans la rigueur d\u2019une structure pensée pour la profondeur. Chaque élément de notre approche a été construit pour servir un objectif unique : permettre une compréhension réelle des mécanismes qui gouvernent nos comportements, nos décisions et nos interactions.",
    quote:
      "La rigueur n\u2019est pas une contrainte — c\u2019est une condition de la profondeur.",
    video: "excellence",
  },
  {
    number: "02",
    title: "Aller au c\u0153ur des mécanismes",
    text: "La surface ne suffit pas. Comprendre véritablement, c\u2019est accéder aux structures profondes qui sous-tendent l\u2019expérience humaine. Notre pédagogie est conçue pour accompagner cette descente vers l\u2019essentiel, avec méthode et sans précipitation.",
    quote:
      "Ce qui se voit n\u2019est jamais que la surface de ce qui se comprend.",
    video: "mecanismes",
  },
  {
    number: "03",
    title: "L\u2019humain comme horizon",
    text: "Au-delà des outils et des méthodes, c\u2019est l\u2019humain qui reste au centre. La compréhension des mécanismes n\u2019est pas une fin en soi — elle est un moyen d\u2019accéder à une maîtrise plus consciente de soi et de ses interactions avec le monde.",
    quote:
      "Comprendre l\u2019humain, c\u2019est d\u2019abord accepter sa complexité.",
    video: "humain",
  },
];

export default function VocationPage() {
  return (
    <>
      <Header showBack backHref={ROUTES.discover} backLabel="Nous découvrir" />
      <PageWrapper>
        {/* ---- HERO IMMERSIF ---- */}
        <section className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
          <div
            className="absolute inset-0 bg-gradient-to-b from-graphite/50 via-noir to-noir"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(176,141,87,0.05),transparent)]"
            aria-hidden="true"
          />

          <div className="relative mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-16">
            <ScrollReveal>
              <p className="text-label tracking-[0.3em] text-bronze">
                Institut La Clé
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="mt-6 max-w-5xl font-display text-5xl font-semibold leading-[1.02] text-ivoire md:text-7xl lg:text-8xl xl:text-[6.5rem]">
                Notre vocation
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-12 flex items-start gap-6 md:mt-16">
                <div className="mt-3 hidden h-px w-20 shrink-0 bg-gradient-to-r from-bronze/60 to-transparent md:block" />
                <p className="max-w-lg font-display text-xl font-light italic leading-relaxed text-cendre/90 md:text-2xl">
                  Un institut fondé sur une conviction&nbsp;: la compréhension
                  précède l&apos;action.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="mt-28 flex items-center gap-4 md:mt-36">
                <div className="h-14 w-px bg-gradient-to-b from-bronze/40 to-transparent" />
                <span className="text-[0.6rem] uppercase tracking-[0.35em] text-pierre/60">
                  Défiler
                </span>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ---- MANIFESTO ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl py-8 text-center md:py-12">
              <p className="font-display text-2xl font-light leading-[1.5] text-ivoire/80 md:text-3xl lg:text-[2.5rem] lg:leading-[1.45]">
                Nous n&apos;enseignons pas des techniques.{" "}
                <span className="text-bronze">
                  Nous donnons accès à la compréhension
                </span>{" "}
                des mécanismes qui façonnent l&apos;expérience humaine.
              </p>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- SECTIONS ALTERNÉES ---- */}
        {SECTIONS.map((section, i) => {
          const textFirst = i % 2 === 0;
          return (
            <SectionBlock
              key={section.video}
              background={i % 2 === 0 ? "noir" : "graphite"}
            >
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                {/* Texte */}
                <div className={textFirst ? "lg:order-1" : "lg:order-2"}>
                  <ScrollReveal>
                    <span
                      className="mb-6 block font-display text-[5rem] font-extralight leading-none text-ivoire/[0.04] md:text-[7rem]"
                      aria-hidden="true"
                    >
                      {section.number}
                    </span>
                    <p className="mb-4 text-label tracking-[0.25em] text-bronze/70">
                      {section.number} — Conviction
                    </p>
                    <h2 className="mb-8 max-w-md font-display text-3xl leading-[1.15] text-ivoire md:text-4xl lg:text-[2.75rem]">
                      {section.title}
                    </h2>
                    <p className="max-w-lg leading-[1.85] text-cendre">
                      {section.text}
                    </p>

                    <blockquote className="mt-10 border-l-2 border-bronze/30 pl-6 md:mt-14">
                      <p className="font-display text-lg font-light italic leading-relaxed text-ivoire/60 md:text-xl">
                        &laquo;&nbsp;{section.quote}&nbsp;&raquo;
                      </p>
                    </blockquote>
                  </ScrollReveal>
                </div>

                {/* Vidéo */}
                <div className={textFirst ? "lg:order-2" : "lg:order-1"}>
                  <ScrollReveal delay={0.2}>
                    <VideoPlaceholder label={`Vidéo — ${section.title}`} />
                  </ScrollReveal>
                </div>
              </div>
            </SectionBlock>
          );
        })}

        {/* ---- CONCLUSION CINÉMATIQUE ---- */}
        <SectionBlock>
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div
                className="mx-auto mb-16 h-px w-32 bg-gradient-to-r from-transparent via-bronze/30 to-transparent"
                aria-hidden="true"
              />

              <p className="mb-6 text-label tracking-[0.3em] text-bronze/50">
                Ce qui nous lie
              </p>
              <h2 className="mb-8 font-display text-3xl leading-[1.2] text-ivoire md:text-4xl lg:text-5xl">
                La compréhension comme fondation
              </h2>
              <p className="mx-auto mb-16 max-w-lg leading-relaxed text-cendre">
                Chaque parcours proposé par La Clé repose sur ce principe
                fondateur. Les personnes qui incarnent cette vision sont le
                reflet de cet engagement.
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
