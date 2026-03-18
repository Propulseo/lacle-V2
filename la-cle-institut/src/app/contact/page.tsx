import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionBlock } from "@/components/ui/SectionBlock";

export const metadata = {
  title: "Contact — La Clé",
  description: "Contactez l\u2019institut La Clé.",
};

export default function ContactPage() {
  return (
    <>
      <Header showBack backHref="/" backLabel="Accueil" />
      <PageWrapper>
        <SectionBlock className="pt-32">
          <h1 className="mb-12">Contact</h1>
          <div className="max-w-2xl space-y-8">
            <div>
              <h3 className="mb-3">Nous écrire</h3>
              <p className="text-sm">
                Pour toute question relative à l&apos;institut, à nos formations
                ou à votre parcours, vous pouvez nous contacter à l&apos;adresse
                suivante :
              </p>
              <p className="mt-4 text-lg text-ivoire">
                contact@la-cle-institut.fr
              </p>
            </div>
            <div>
              <h3 className="mb-3">Délai de réponse</h3>
              <p className="text-sm">
                Nous nous engageons à répondre à chaque message dans un
                délai raisonnable. Comme pour nos formations, nous
                privilégions la qualité de la réponse à la rapidité.
              </p>
            </div>
            <div>
              <h3 className="mb-3">Adresse</h3>
              <p className="text-sm">
                Institut La Clé<br />
                [Adresse à compléter]
              </p>
            </div>
          </div>
        </SectionBlock>
        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
