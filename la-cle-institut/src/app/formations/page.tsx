import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionBlock } from "@/components/ui/SectionBlock";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FormationCard } from "@/components/ui/FormationCard";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Catalogue des formations — La Clé",
  description: "Les formations proposées par l\u2019institut La Clé. Une progression structurée au service de la compréhension.",
};

export default function FormationsPage() {
  return (
    <>
      <Header showBack backHref="/" backLabel="Accueil" />
      <PageWrapper>
        {/* ---- HERO enrichi ---- */}
        <section className="flex min-h-[70vh] flex-col justify-center pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-16">
            <ScrollReveal>
              <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze">
                Catalogue
              </p>
              <h1 className="max-w-3xl font-serif text-4xl font-light leading-[1.1] text-ivoire md:text-5xl lg:text-6xl xl:text-7xl">
                Formations
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-cendre md:text-xl">
                Une progression structurée au service de la compréhension.
              </p>
            </ScrollReveal>
            {/* Key facts */}
            <ScrollReveal delay={0.2}>
              <div className="mt-16 grid max-w-2xl gap-px border border-filet md:grid-cols-3">
                <div className="bg-graphite/60 p-6 md:p-8">
                  <span className="mb-2 block font-serif text-3xl text-ivoire md:text-4xl">01</span>
                  <p className="text-xs uppercase tracking-widest text-cendre">Formation active</p>
                </div>
                <div className="bg-graphite/60 p-6 md:p-8">
                  <span className="mb-2 block font-serif text-3xl text-pierre/40 md:text-4xl">02</span>
                  <p className="text-xs uppercase tracking-widest text-pierre/60">À venir</p>
                </div>
                <div className="bg-graphite/60 p-6 md:p-8">
                  <span className="mb-2 block font-serif text-3xl text-bronze/30 md:text-4xl">&infin;</span>
                  <p className="text-xs uppercase tracking-widest text-pierre/60">En évolution</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ---- Progression pédagogique ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze">
                  Philosophie
                </p>
                <h2 className="mb-6">Progression pédagogique</h2>
                <p className="max-w-lg">
                  Les formations de l&apos;institut La Clé s&apos;inscrivent dans une
                  logique de progression. Chaque niveau approfondit le précédent.
                  Il n&apos;y a pas de raccourci : la compréhension se construit
                  étape par étape, dans un ordre pensé pour la solidité des acquis.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {["Fondations", "Approfondissement", "Maîtrise"].map((level, i) => (
                  <div key={level} className="flex items-center gap-6 border-b border-filet pb-4 last:border-0">
                    <span className={`font-serif text-2xl ${i === 0 ? "text-bronze" : "text-pierre/30"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`text-sm uppercase tracking-widest ${i === 0 ? "text-ivoire" : "text-pierre/40"}`}>
                      {level}
                    </span>
                    {i === 0 && (
                      <span className="ml-auto text-[10px] uppercase tracking-widest text-bronze">
                        Actif
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- Formations disponibles ---- */}
        <SectionBlock>
          <ScrollReveal>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze">
              Parcours
            </p>
            <h2 className="mb-12">Formations disponibles</h2>
          </ScrollReveal>

          {/* Formation principale — pleine largeur */}
          <ScrollReveal delay={0.1}>
            <FormationCard
              title="PNL — Praticien"
              description="Formation complète de praticien en Programmation Neuro-Linguistique. Parcours distanciel structuré en 7 modules suivi d'une phase présentielle intensive menant à la certification."
              href={ROUTES.pnlPractitioner}
              available
              label="Disponible"
              tags={["Distanciel + Présentiel", "7 modules", "Certifiante"]}
            />
          </ScrollReveal>

          {/* Formations à venir — grille */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <ScrollReveal delay={0.2}>
              <FormationCard
                title="PNL — Maître Praticien"
                description="Approfondissement des mécanismes avancés. Suite logique du parcours praticien."
                available={false}
                label="À venir"
                tags={["Niveau 2"]}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <FormationCard
                title="Hypnose Ericksonienne"
                description="Exploration des mécanismes hypnotiques et des processus inconscients."
                available={false}
                label="À venir"
                tags={["Nouvelle discipline"]}
              />
            </ScrollReveal>
          </div>
        </SectionBlock>

        {/* ---- CTA final ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-6">Commencer le parcours</h2>
              <p className="mb-12">
                Découvrez en détail la formation PNL Praticien —
                son contenu, sa structure et ses exigences.
              </p>
              <Button href={ROUTES.pnlPractitioner} size="large">
                Découvrir PNL — Praticien
              </Button>
            </div>
          </ScrollReveal>
        </SectionBlock>

        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
