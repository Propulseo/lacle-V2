import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { DiscoverNav } from "@/components/layout/DiscoverNav";
import { HeroSection } from "@/components/ui/HeroSection";
import { SectionBlock } from "@/components/ui/SectionBlock";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { VideoPlaceholder } from "@/components/ui/VideoPlaceholder";
import { TeamFounderBio } from "@/components/formations/TeamFounderBio";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "L'équipe — La Clé",
  description:
    "Les garants pédagogiques de l'institut La Clé et l'origine du projet.",
};

const teamMembers = [
  {
    name: "Marien",
    role: "Garant pédagogique",
    bio: "Marien est le garant de la rigueur pédagogique de l'institut. Sa mission\u00a0: s'assurer que chaque parcours respecte les exigences de profondeur et de structure qui fondent l'identité de La Clé.",
  },
  {
    name: "Titi",
    role: "Co-garant symbolique",
    bio: "Titi incarne la dimension humaine et symbolique du projet. Sa présence rappelle que derrière la rigueur méthodologique, il y a une vision profondément humaine de l'apprentissage.",
  },
];

export default function TeamPage() {
  return (
    <>
      <Header showBack backHref={ROUTES.discover} backLabel="Nous découvrir" />
      <PageWrapper>
        <HeroSection
          label="Les personnes"
          title="L'équipe"
          subtitle="Les personnes qui incarnent le cadre."
          decorativeLine
        />

        {/* ---- Diptyque : les garants ---- */}
        <SectionBlock>
          <ScrollReveal>
            <p className="mb-16 text-center text-label tracking-[0.3em] text-bronze">
              Les garants
            </p>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-2 md:gap-10 lg:gap-14">
            {teamMembers.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.15}>
                <div className="card-elevated group border border-filet bg-graphite/20 p-8 transition-colors duration-500 hover:border-filet-accent md:p-10">
                  <div className="mb-8 h-px w-12 bg-bronze" />
                  <h3 className="mb-3 transition-colors duration-500 group-hover:text-bronze-clair">
                    {member.name}
                  </h3>
                  <p className="mb-6 text-label-sm tracking-[0.2em] text-bronze">
                    {member.role}
                  </p>
                  <p>{member.bio}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock background="graphite">
          <VideoPlaceholder
            label="Vidéo — Introduction équipe"
            aspectRatio="21/9"
          />
        </SectionBlock>

        {/* ---- Séparateur gradient ---- */}
        <div className="flex justify-center">
          <div className="h-20 w-px bg-gradient-to-b from-transparent via-bronze/30 to-transparent" />
        </div>

        {/* ---- L'origine ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <p className="mb-6 text-label tracking-[0.3em] text-pierre">
              Aux origines
            </p>
            <h2 className="mb-8 max-w-2xl">L&apos;origine de La Clé</h2>
            <p className="max-w-2xl text-lg leading-relaxed text-ivoire/80">
              La Clé est née d&apos;un constat simple.
            </p>
            <p className="mt-4 max-w-2xl">
              Les formations existantes manquent souvent de profondeur
              structurelle. L&apos;institut a été créé pour combler ce manque
              &mdash;&nbsp;avec rigueur et sans compromis.
            </p>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- Parcours du fondateur ---- */}
        <SectionBlock>
          <TeamFounderBio />
        </SectionBlock>

        {/* ---- Évolution ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-10 h-px w-12 bg-bronze/40" />
              <h2 className="mb-6">Une équipe appelée à évoluer</h2>
              <p>
                L&apos;institut La Clé est conçu pour grandir. L&apos;équipe actuelle
                constitue le noyau fondateur, mais d&apos;autres personnes viendront
                enrichir ce cadre &mdash;&nbsp;toujours dans le respect des
                exigences qui fondent notre identité.
              </p>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/*
          Navigation "Nous découvrir" + CTA unique vers la formation.
          Remplace l'ancien bloc CTA de conclusion pour éviter un doublon
          visuel avec le bouton "Découvrir la formation" porté par DiscoverNav.
        */}
        <DiscoverNav current="team" showFormationCTA />

        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
