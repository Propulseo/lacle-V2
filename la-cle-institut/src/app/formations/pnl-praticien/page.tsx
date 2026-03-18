import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionBlock } from "@/components/ui/SectionBlock";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { PNLModules } from "@/components/formations/PNLModules";
import { ParcoursSteps } from "@/components/formations/ParcoursSteps";
import { PNLFAQ } from "@/components/formations/PNLFAQ";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "PNL Praticien — La Clé",
  description: "Formation compl\u00e8te de Praticien PNL. Parcours distanciel structur\u00e9 et phase pr\u00e9sentielle intensive.",
};

export default function PNLPraticienPage() {
  return (
    <>
      <Header showBack backHref={ROUTES.formations} backLabel="Formations" />
      <PageWrapper>
        {/* ---- HERO enrichi avec métriques ---- */}
        <section className="flex min-h-[80vh] flex-col justify-center pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-16">
            <ScrollReveal>
              <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze">
                Formation certifiante
              </p>
              <h1 className="max-w-4xl font-serif text-4xl font-light leading-[1.1] text-ivoire md:text-5xl lg:text-6xl xl:text-7xl">
                PNL — Praticien
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-cendre md:text-xl">
                Comprendre les mécanismes fondamentaux de la Programmation
                Neuro-Linguistique avec rigueur et profondeur.
              </p>
            </ScrollReveal>

            {/* Métriques clés */}
            <ScrollReveal delay={0.2}>
              <div className="mt-16 flex flex-wrap gap-12 border-t border-filet pt-10 md:gap-16">
                <div>
                  <span className="block font-serif text-3xl text-ivoire md:text-4xl">7</span>
                  <p className="mt-1 text-xs uppercase tracking-widest text-pierre">Modules</p>
                </div>
                <div>
                  <span className="block font-serif text-3xl text-ivoire md:text-4xl">2</span>
                  <p className="mt-1 text-xs uppercase tracking-widest text-pierre">Phases</p>
                </div>
                <div>
                  <span className="block font-serif text-3xl text-ivoire md:text-4xl">1</span>
                  <p className="mt-1 text-xs uppercase tracking-widest text-pierre">Certification</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ---- Qu'est-ce que la PNL ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="grid items-start gap-12 lg:grid-cols-[1fr,1.5fr]">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze">
                  Discipline
                </p>
                <h2>Qu&apos;est-ce que la PNL ?</h2>
              </div>
              <div className="space-y-4">
                <p>
                  La Programmation Neuro-Linguistique est un cadre de compréhension
                  des mécanismes par lesquels nous percevons, traitons et communiquons
                  l&apos;information. Développée à partir de la modélisation de
                  l&apos;excellence, elle offre des outils d&apos;observation et
                  d&apos;analyse des processus cognitifs.
                </p>
                <p>
                  Chez La Clé, elle est enseignée comme une discipline de
                  compréhension — pas comme un catalogue de techniques
                  à appliquer mécaniquement.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- Pourquoi La Clé ---- */}
        <SectionBlock>
          <ScrollReveal>
            <div className="grid items-start gap-12 lg:grid-cols-[1fr,1.5fr]">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze">
                  Approche
                </p>
                <h2>Pourquoi La Clé</h2>
              </div>
              <div>
                <p>
                  La plupart des formations PNL privilégient la rapidité et
                  l&apos;accumulation de techniques. L&apos;institut La Clé fait le
                  choix inverse : chaque concept est enseigné dans sa profondeur,
                  avec le temps nécessaire à une compréhension véritable. Le rythme
                  est progressif. La structure est rigoureuse. L&apos;objectif est
                  la maîtrise, pas la collection de certificats.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- Parcours visuel 3 étapes ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="mb-12">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze">
                Structure
              </p>
              <h2>Le parcours</h2>
            </div>
          </ScrollReveal>
          <ParcoursSteps />
        </SectionBlock>

        {/* ---- 7 Modules (grille) ---- */}
        <SectionBlock>
          <PNLModules />
        </SectionBlock>

        {/* ---- Présentiel + Certification ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="grid gap-px md:grid-cols-2">
              <div className="border border-filet bg-noir/40 p-8 md:p-12">
                <span className="mb-6 block font-serif text-5xl font-light text-bronze/20">02</span>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze">
                  Phase présentielle
                </p>
                <h3 className="mb-4 font-serif text-2xl text-ivoire md:text-3xl">
                  Intégration pratique
                </h3>
                <p className="text-sm leading-relaxed text-cendre">
                  La phase présentielle est le moment où les connaissances théoriques
                  prennent corps. Encadrée par les formateurs de l&apos;institut, elle
                  permet une mise en pratique supervisée et un approfondissement
                  par l&apos;expérience directe.
                </p>
              </div>
              <div className="border border-filet bg-noir/40 p-8 md:p-12">
                <span className="mb-6 block font-serif text-5xl font-light text-bronze/20">03</span>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze">
                  Aboutissement
                </p>
                <h3 className="mb-4 font-serif text-2xl text-ivoire md:text-3xl">
                  Certification
                </h3>
                <p className="text-sm leading-relaxed text-cendre">
                  À l&apos;issue du parcours complet, une certification de Praticien
                  PNL est délivrée par l&apos;institut La Clé. Elle atteste d&apos;une
                  maîtrise des fondamentaux acquise avec rigueur et profondeur.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- Décider en connaissance de cause ---- */}
        <SectionBlock>
          <ScrollReveal>
            <div className="mx-auto max-w-2xl">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze">
                Engagement
              </p>
              <h2 className="mb-6">Décider en connaissance de cause</h2>
              <p>
                Cette page a pour objectif de vous donner toutes les informations
                nécessaires. La décision de vous engager dans ce parcours vous
                appartient entièrement. Elle doit être éclairée, réfléchie, et
                prise en pleine conscience de ce qui vous attend.
              </p>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- FAQ ---- */}
        <SectionBlock background="graphite">
          <PNLFAQ />
        </SectionBlock>

        {/* ---- CTA final ---- */}
        <SectionBlock>
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="mb-6 block font-serif text-6xl font-light text-bronze/10 md:text-8xl">
                &rarr;
              </span>
              <h2 className="mb-6">Prêt à commencer</h2>
              <p className="mb-12">
                L&apos;espace de formation vous attend. Vous y trouverez le
                parcours complet et tout ce dont vous avez besoin pour démarrer.
              </p>
              <Button href={ROUTES.accessSpace} size="large">
                Accéder à l&apos;espace de formation
              </Button>
            </div>
          </ScrollReveal>
        </SectionBlock>

        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
