import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionBlock } from "@/components/ui/SectionBlock";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PNLHero } from "@/components/formations/PNLHero";
import { PNLModules } from "@/components/formations/PNLModules";
import { ParcoursSteps } from "@/components/formations/ParcoursSteps";
import { PNLFAQ } from "@/components/formations/PNLFAQ";
import { PNLCtaFinal } from "@/components/formations/PNLCtaFinal";
import { FormationDocuments } from "@/components/formations/FormationDocuments";
import { FormationResultats } from "@/components/formations/FormationResultats";
import { ROUTES } from "@/lib/constants";
import {
  getPnlModules,
  getPnlFaq,
  getResultatsPnl,
  getPageLastUpdated,
  getFormationPrice,
} from "@/lib/cms/content";

export const metadata = {
  title: "PNL Praticien | La Clé",
  description:
    "Formation complète de Praticien PNL. Parcours distanciel structuré en sept modules, menant à la certification.",
};

// ISR : les éditions admin (Supabase) se propagent en <= 60 s.
export const revalidate = 60;

export default async function PNLPraticienPage() {
  const [modules, faq, resultats, lastUpdated, price] = await Promise.all([
    getPnlModules(),
    getPnlFaq(),
    getResultatsPnl(),
    getPageLastUpdated(),
    getFormationPrice(),
  ]);

  return (
    <>
      <Header showBack backHref={ROUTES.formations} backLabel="Formations" />
      <PageWrapper>
        {/* ---- HERO CINÉMATIQUE ---- */}
        <PNLHero />

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
            <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
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
                  compréhension, pas comme un catalogue de techniques à
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
            <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
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
                  exigeante. L&apos;objectif est la maîtrise, pas la collection
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
          <PNLModules modules={modules} />
        </SectionBlock>

        {/* ---- Certification (présentiel retiré : non disponible, retour A13) ---- */}
        <SectionBlock>
          <ScrollReveal>
            <div className="card-elevated mx-auto max-w-2xl border border-filet bg-graphite/30 p-8 md:p-12">
              <p className="mb-2 text-label tracking-[0.25em] text-bronze/70">
                Aboutissement
              </p>
              <h3 className="mb-5 font-display text-2xl text-ivoire md:text-3xl">
                Certification
              </h3>
              <p className="leading-relaxed text-cendre">
                À l&apos;issue du parcours distanciel, une certification de
                Praticien PNL est délivrée par l&apos;institut La Clé. Elle
                atteste d&apos;une maîtrise des fondamentaux acquise avec
                exigence et profondeur.
              </p>
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

        {/* ---- Indicateurs de résultats (Qualiopi indicateur 2) ---- */}
        <SectionBlock background="graphite">
          <FormationResultats resultats={resultats} lastUpdated={lastUpdated} />
        </SectionBlock>

        {/* ---- Documents pédagogiques (Qualiopi indicateur 1) ---- */}
        <SectionBlock>
          <FormationDocuments price={price} lastUpdated={lastUpdated} />
        </SectionBlock>

        {/* ---- FAQ ---- */}
        <SectionBlock background="graphite">
          <PNLFAQ items={faq} />
        </SectionBlock>

        {/* ---- CTA FINAL ---- */}
        <PNLCtaFinal />

        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
