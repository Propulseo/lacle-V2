import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { HeroSection } from "@/components/ui/HeroSection";
import { HubCard } from "@/components/ui/HubCard";
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
          title="Nous découvrir"
          subtitle="Comprendre l'institut, sa vocation et les personnes qui l'incarnent."
        />
        <section className="pb-20 md:pb-28 lg:pb-32">
          <div className="mx-auto grid max-w-[1200px] gap-6 px-6 md:grid-cols-3 md:px-10 lg:px-16">
            <HubCard
              title="Notre vocation"
              description="Comprendre le pourquoi profond de l'institut et sa mission fondamentale."
              href={ROUTES.vocation}
            />
            <HubCard
              title="Le concept"
              description="Le cadre méthodologique et intellectuel qui structure notre approche."
              href={ROUTES.concept}
            />
            <HubCard
              title="L'équipe"
              description="Les garants pédagogiques et l'origine de l'institut La Clé."
              href={ROUTES.team}
            />
          </div>
        </section>
        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
