import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionBlock } from "@/components/ui/SectionBlock";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { PNLModules } from "@/components/formations/PNLModules";
import { ParcoursSteps } from "@/components/formations/ParcoursSteps";
import { PNLFAQ } from "@/components/formations/PNLFAQ";
import { FormationDocuments } from "@/components/formations/FormationDocuments";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "PNL Praticien — La Clé",
  description:
    "Formation complète de Praticien PNL. Parcours distanciel structuré et phase présentielle intensive.",
};

const METRICS = [
  { value: "7", label: "Modules distanciels" },
  { value: "2", label: "Phases complémentaires" },
  { value: "1", label: "Certification délivrée" },
];

export default function PNLPraticienPage() {
  return (
    <>
      <Header showBack backHref={ROUTES.formations} backLabel="Formations" />
      <PageWrapper>
        {/* ---- HERO CINÉMATIQUE ---- */}
        <section className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
          <div
            className="absolute inset-0 bg-gradient-to-b from-graphite/40 via-noir to-noir"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_35%,rgba(176,141,87,0.04),transparent)]"
            aria-hidden="true"
          />

          <div className="relative mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-16">
            <ScrollReveal>
              <p className="text-label tracking-[0.3em] text-bronze">
                Formation certifiante
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-ivoire md:text-7xl lg:text-8xl xl:text-[6.5rem]">
                PNL — Praticien
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-12 flex items-start gap-6 md:mt-16">
                <div className="mt-3 hidden h-px w-20 shrink-0 bg-gradient-to-r from-bronze/60 to-transparent md:block" />
                <p className="max-w-xl text-lg leading-relaxed text-cendre md:text-xl">
                  Comprendre les mécanismes fondamentaux de la Programmation
                  Neuro-Linguistique avec rigueur et profondeur.
                </p>
              </div>
            </ScrollReveal>

            {/* Métriques */}
            <ScrollReveal delay={0.3}>
              <div className="mt-20 grid grid-cols-3 gap-8 border-t border-filet/60 pt-10 md:mt-24 md:max-w-lg md:gap-16">
                {METRICS.map((m) => (
                  <div key={m.label}>
                    <span className="block font-display text-4xl font-light text-ivoire md:text-5xl">
                      {m.value}
                    </span>
                    <p className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-pierre md:text-xs md:tracking-widest">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ---- INTRO / MANIFESTO ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl py-6 text-center md:py-10">
              <p className="font-display text-2xl font-light leading-[1.5] text-ivoire/80 md:text-3xl lg:text-[2.25rem] lg:leading-[1.45]">
                Une formation qui privilégie{" "}
                <span className="text-bronze">la profondeur à la rapidité</span>
                , la compréhension à l&apos;accumulation, la maîtrise à la
                collection de certificats.
              </p>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- Qu'est-ce que la PNL ---- */}
        <SectionBlock>
          <ScrollReveal>
            <div className="grid items-start gap-12 lg:grid-cols-[1fr,1.5fr] lg:gap-20">
              <div>
                <p className="mb-3 text-label tracking-[0.25em] text-bronze/70">
                  Discipline
                </p>
                <h2 className="font-display text-3xl text-ivoire md:text-4xl">
                  Qu&apos;est-ce que la PNL&nbsp;?
                </h2>
              </div>
              <div className="space-y-5">
                <p className="leading-[1.85]">
                  La Programmation Neuro-Linguistique est un cadre de
                  compréhension des mécanismes par lesquels nous percevons,
                  traitons et communiquons l&apos;information. Développée à
                  partir de la modélisation de l&apos;excellence, elle offre des
                  outils d&apos;observation et d&apos;analyse des processus
                  cognitifs.
                </p>
                <p className="leading-[1.85]">
                  Chez La Clé, elle est enseignée comme une discipline de
                  compréhension — pas comme un catalogue de techniques à
                  appliquer mécaniquement.
                </p>
                <blockquote className="mt-6 border-l-2 border-bronze/30 pl-6 pt-2">
                  <p className="font-display text-lg font-light italic text-ivoire/60">
                    &laquo;&nbsp;Observer, comprendre, puis seulement
                    agir.&nbsp;&raquo;
                  </p>
                </blockquote>
              </div>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- Pourquoi La Clé ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="grid items-start gap-12 lg:grid-cols-[1fr,1.5fr] lg:gap-20">
              <div>
                <p className="mb-3 text-label tracking-[0.25em] text-bronze/70">
                  Approche
                </p>
                <h2 className="font-display text-3xl text-ivoire md:text-4xl">
                  Pourquoi La Clé
                </h2>
              </div>
              <div>
                <p className="leading-[1.85]">
                  La plupart des formations PNL privilégient la rapidité et
                  l&apos;accumulation de techniques. L&apos;institut La Clé fait
                  le choix inverse : chaque concept est enseigné dans sa
                  profondeur, avec le temps nécessaire à une compréhension
                  véritable. Le rythme est progressif. La structure est
                  rigoureuse. L&apos;objectif est la maîtrise, pas la collection
                  de certificats.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- Parcours visuel 3 étapes ---- */}
        <SectionBlock>
          <ScrollReveal>
            <div className="mb-14">
              <p className="mb-3 text-label tracking-[0.25em] text-bronze/70">
                Structure
              </p>
              <h2 className="font-display text-3xl text-ivoire md:text-4xl">
                Le parcours
              </h2>
            </div>
          </ScrollReveal>
          <ParcoursSteps />
        </SectionBlock>

        {/* ---- 7 Modules ---- */}
        <SectionBlock background="graphite">
          <PNLModules />
        </SectionBlock>

        {/* ---- Présentiel + Certification ---- */}
        <SectionBlock>
          <ScrollReveal>
            <div className="grid gap-px md:grid-cols-2">
              <div className="card-elevated border border-filet bg-graphite/30 p-8 md:p-12">
                <span className="mb-8 block font-display text-6xl font-extralight text-bronze/15 md:text-7xl">
                  02
                </span>
                <p className="mb-2 text-label tracking-[0.25em] text-bronze/70">
                  Phase présentielle
                </p>
                <h3 className="mb-5 font-display text-2xl text-ivoire md:text-3xl">
                  Intégration pratique
                </h3>
                <p className="leading-relaxed text-cendre">
                  La phase présentielle est le moment où les connaissances
                  théoriques prennent corps. Encadrée par les formateurs de
                  l&apos;institut, elle permet une mise en pratique supervisée et
                  un approfondissement par l&apos;expérience directe.
                </p>
              </div>
              <div className="card-elevated border border-filet bg-graphite/30 p-8 md:p-12">
                <span className="mb-8 block font-display text-6xl font-extralight text-bronze/15 md:text-7xl">
                  03
                </span>
                <p className="mb-2 text-label tracking-[0.25em] text-bronze/70">
                  Aboutissement
                </p>
                <h3 className="mb-5 font-display text-2xl text-ivoire md:text-3xl">
                  Certification
                </h3>
                <p className="leading-relaxed text-cendre">
                  À l&apos;issue du parcours complet, une certification de
                  Praticien PNL est délivrée par l&apos;institut La Clé. Elle
                  atteste d&apos;une maîtrise des fondamentaux acquise avec
                  rigueur et profondeur.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- Décider en connaissance de cause ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div
                className="mx-auto mb-14 h-px w-28 bg-gradient-to-r from-transparent via-bronze/30 to-transparent"
                aria-hidden="true"
              />
              <p className="mb-3 text-label tracking-[0.25em] text-bronze/70">
                Engagement
              </p>
              <h2 className="mb-8 font-display text-3xl text-ivoire md:text-4xl lg:text-5xl">
                Décider en connaissance de cause
              </h2>
              <p className="mx-auto max-w-xl leading-[1.85] text-cendre">
                Cette page a pour objectif de vous donner toutes les
                informations nécessaires. La décision de vous engager dans ce
                parcours vous appartient entièrement. Elle doit être éclairée,
                réfléchie, et prise en pleine conscience de ce qui vous attend.
              </p>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- Documents pédagogiques (Qualiopi indicateur 1) ---- */}
        <SectionBlock>
          <FormationDocuments />
        </SectionBlock>

        {/* ---- FAQ ---- */}
        <SectionBlock background="graphite">
          <PNLFAQ />
        </SectionBlock>

        {/* ---- CTA FINAL ---- */}
        <section className="relative overflow-hidden py-28 md:py-36">
          <div
            className="absolute inset-0 bg-gradient-to-b from-noir via-graphite/60 to-noir"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(176,141,87,0.04),transparent)]"
            aria-hidden="true"
          />
          <ScrollReveal>
            <div className="relative mx-auto max-w-[1200px] px-6 text-center md:px-10 lg:px-16">
              <span
                className="mb-8 block font-display text-7xl font-extralight text-bronze/10 md:text-9xl"
                aria-hidden="true"
              >
                &rarr;
              </span>
              <h2 className="mb-6 font-display text-3xl text-ivoire md:text-4xl lg:text-5xl">
                Prêt à commencer
              </h2>
              <p className="mx-auto mb-14 max-w-lg leading-relaxed text-cendre">
                L&apos;espace de formation vous attend. Vous y trouverez le
                parcours complet et tout ce dont vous avez besoin pour démarrer.
              </p>
              {/*
                CTA principal de la page de vente — variante "elegant".
                Pour revenir au bouton d'origine, retirer simplement la prop
                `variant="elegant"` (ou la remettre à "default").
                Définition de la variante : globals.css → .btn-elegant
              */}
              <Button
                href={ROUTES.accessSpace}
                size="large"
                variant="elegant"
              >
                Accéder à l&apos;espace de formation
              </Button>
            </div>
          </ScrollReveal>
        </section>

        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
