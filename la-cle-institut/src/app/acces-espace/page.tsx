import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { KeySymbol } from "@/components/splash/KeySymbol";
import { SITE } from "@/lib/constants";
import { AccesEspaceContent } from "@/components/acces-espace/AccesEspaceContent";

export const metadata = {
  title: "Connexion — La Clé",
  description:
    "Accédez à votre espace de formation ou d\u2019administration. Institut La Clé.",
};

export default function AccessSpacePage() {
  return (
    <>
      <Header showBack backHref="/" backLabel="Accueil" />
      <PageWrapper>
        <section className="flex min-h-screen flex-col items-center justify-center pb-20 pt-28 md:pt-32">
          <div className="mx-auto w-full max-w-[860px] px-6 md:px-10">
            <ScrollReveal>
              <KeySymbol
                className="mx-auto mb-8 h-8 w-auto text-ivoire/15"
                animate={false}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="mb-12 text-center">
                <p className="mb-4 text-label tracking-[0.3em] text-bronze">
                  Portail de connexion
                </p>
                <h1 className="font-display text-3xl font-semibold text-ivoire md:text-4xl lg:text-5xl">
                  Accéder à la plateforme
                </h1>
                <p className="mt-6 text-lg text-cendre">
                  Connectez-vous avec les identifiants démo ci-dessous.
                </p>
              </div>
            </ScrollReveal>

            <AccesEspaceContent />

            <ScrollReveal delay={0.4}>
              <p className="mt-12 text-center font-display text-base italic text-bronze-clair">
                {SITE.baseline}
              </p>
            </ScrollReveal>
          </div>
        </section>
        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
