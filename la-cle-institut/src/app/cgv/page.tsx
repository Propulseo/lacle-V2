import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionBlock } from "@/components/ui/SectionBlock";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = {
  title: "Conditions générales de vente — La Clé",
  description: "Conditions générales de vente de l\u2019institut La Clé.",
};

export default function CGVPage() {
  return (
    <>
      <Header showBack backHref="/" backLabel="Accueil" />
      <PageWrapper>
        <SectionBlock className="pt-32">
          <ScrollReveal>
            <p className="mb-4 text-label tracking-[0.3em] text-bronze">
              Information juridique
            </p>
            <h1 className="mb-12">Conditions générales de vente</h1>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="max-w-2xl space-y-8">
              <div>
                <h3 className="mb-3">Objet</h3>
                <p className="text-sm">
                  Les présentes conditions générales de vente régissent les
                  relations contractuelles entre l&apos;institut La Clé et
                  toute personne s&apos;inscrivant à une formation proposée
                  par l&apos;institut.
                </p>
              </div>
              <div>
                <h3 className="mb-3">Formations</h3>
                <p className="text-sm">
                  Les formations proposées par l&apos;institut La Clé sont
                  décrites dans le catalogue accessible sur ce site. Le
                  contenu, la durée et les modalités de chaque formation
                  sont détaillés dans la fiche formation correspondante.
                </p>
              </div>
              <div>
                <h3 className="mb-3">Inscription</h3>
                <p className="text-sm">
                  L&apos;inscription aux formations se fait exclusivement via
                  l&apos;espace apprenant dédié. L&apos;inscription est considérée
                  comme définitive après validation du paiement.
                </p>
              </div>
              <div>
                <h3 className="mb-3">Tarifs et paiement</h3>
                <p className="text-sm">
                  [Tarifs et modalités de paiement à compléter]
                </p>
              </div>
              <div>
                <h3 className="mb-3">Droit de rétractation</h3>
                <p className="text-sm">
                  [Conditions de rétractation à compléter conformément
                  au Code de la consommation]
                </p>
              </div>
            </div>
          </ScrollReveal>
        </SectionBlock>
        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
