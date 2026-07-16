import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionBlock } from "@/components/ui/SectionBlock";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FormationCarousel } from "@/components/formations/FormationCarousel";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";
import { FORMATIONS } from "@/lib/formations";

export const metadata = {
  title: "Catalogue des formations | La Clé",
  description: "Les formations proposées par l\u2019institut La Clé. Une progression structurée au service de la compréhension.",
};

/** Chiffres du hero dérivés du catalogue : jamais désynchronisés des statuts. */
const countByStatus = (status: string) =>
  String(FORMATIONS.filter((f) => f.status === status).length).padStart(2, "0");

export default function FormationsPage() {
  return (
    <>
      <Header showBack backHref="/" backLabel="Accueil" />
      <PageWrapper>
        {/* ---- HERO enrichi ---- */}
        <section className="flex min-h-[70vh] flex-col justify-center pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-16">
            <ScrollReveal>
              <p className="mb-6 text-label tracking-[0.3em] text-bronze">
                Catalogue
              </p>
              <h1 className="max-w-3xl font-display text-4xl text-ivoire md:text-5xl lg:text-6xl xl:text-7xl">
                Formations
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-cendre md:text-xl">
                Une progression structurée au service de la compréhension.
              </p>
            </ScrollReveal>
            {/* Key facts */}
            <ScrollReveal delay={0.2}>
              <div className="mt-16 grid max-w-2xl gap-px border border-filet md:grid-cols-3">
                <div className="card-elevated bg-graphite/60 p-6 md:p-8">
                  <span className="mb-2 block font-display text-3xl text-ivoire md:text-4xl">
                    {countByStatus("cohorte_pilote")}
                  </span>
                  <p className="text-xs uppercase tracking-widest text-cendre">En cohorte pilote</p>
                </div>
                <div className="card-elevated bg-graphite/60 p-6 md:p-8">
                  <span className="mb-2 block font-display text-3xl text-pierre/40 md:text-4xl">
                    {countByStatus("en_developpement")}
                  </span>
                  <p className="text-xs uppercase tracking-widest text-pierre/60">En développement</p>
                </div>
                <div className="card-elevated bg-graphite/60 p-6 md:p-8">
                  <span className="mb-2 block font-display text-3xl text-bronze/30 md:text-4xl">&infin;</span>
                  <p className="text-xs uppercase tracking-widest text-pierre/60">En évolution</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/*
          ---- Progression pédagogique ----
          Le triptyque « Fondations / Approfondissement / Maîtrise » a été
          retiré (retour 9 : Marien en questionnait la pertinence). Il n'était
          branché sur aucune donnée et faisait doublon avec la progression
          réelle, désormais portée par les étapes 1/2 et 2/2 des cartes.
        */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-2 text-label text-bronze">Philosophie</p>
              <h2 className="mb-6">Progression pédagogique</h2>
              <p>
                Les formations de l&apos;institut La Clé s&apos;inscrivent dans une
                logique de progression. Chaque niveau approfondit le précédent.
                Il n&apos;y a pas de raccourci : la compréhension se construit
                étape par étape, dans un ordre pensé pour la solidité des acquis.
              </p>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- Formations disponibles ---- */}
        <SectionBlock>
          <ScrollReveal>
            <p className="mb-2 text-label text-bronze">
              Parcours
            </p>
            <h2 className="mb-12">Formations disponibles</h2>
          </ScrollReveal>

          {/*
            Un tableau séquentiel par parcours (src/lib/formations.ts, PARCOURS).
            Les étapes se lisent dans l'ordre du cursus, chacune portant sa
            modalité, son délivrable et son statut. Seules les étapes dotées
            d'une page sont cliquables.
          */}
          <ScrollReveal delay={0.1}>
            <FormationCarousel />
          </ScrollReveal>
        </SectionBlock>

        {/* ---- CTA final ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-6">Commencer le parcours</h2>
              <p className="mb-12">
                Découvrez en détail le Pré-praticien PNL, première étape du
                cursus : son contenu, sa structure et ses exigences.
              </p>
              <Button href={ROUTES.pnlPractitioner} size="large">
                Découvrir le Pré-praticien PNL
              </Button>
            </div>
          </ScrollReveal>
        </SectionBlock>

        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
