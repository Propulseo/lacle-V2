import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { HeroSection } from "@/components/ui/HeroSection";
import { HubCard } from "@/components/ui/HubCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Nous découvrir — La Clé",
  description: "Comprendre l\u2019institut, sa vocation et les personnes qui l\u2019incarnent.",
};

export default function DiscoverHubPage() {
  return (
    <>
      <Header showBack backHref="/" backLabel="Accueil" />
      <PageWrapper>
        <HeroSection
          label="Institut La Clé"
          title="Nous découvrir"
          subtitle="Comprendre l'institut, sa vocation et les personnes qui l'incarnent."
          decorativeLine
        />
        <section className="pb-20 md:pb-28 lg:pb-32">
          <div className="mx-auto grid max-w-[1200px] gap-6 px-6 md:grid-cols-3 md:px-10 lg:px-16">
            <ScrollReveal delay={0}>
              <HubCard
                title="Notre vocation"
                description="Comprendre le pourquoi profond de l'institut et sa mission fondamentale."
                href={ROUTES.vocation}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <HubCard
                title="Le concept"
                description="Le cadre méthodologique et intellectuel qui structure notre approche."
                href={ROUTES.concept}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <HubCard
                title="L'équipe"
                description="Les garants pédagogiques et l'origine de l'institut La Clé."
                href={ROUTES.team}
              />
            </ScrollReveal>
          </div>
        </section>
        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
