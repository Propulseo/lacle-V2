import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionBlock } from "@/components/ui/SectionBlock";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = {
  title: "Mentions légales — La Clé",
  description: "Mentions légales de l\u2019institut La Clé.",
};

export default function LegalPage() {
  return (
    <>
      <Header showBack backHref="/" backLabel="Accueil" />
      <PageWrapper>
        <SectionBlock className="pt-32">
          <ScrollReveal>
            <p className="mb-4 text-label tracking-[0.3em] text-bronze">
              Information juridique
            </p>
            <h1 className="mb-12">Mentions légales</h1>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="max-w-2xl space-y-8">
              <div>
                <h3 className="mb-3">Éditeur du site</h3>
                <p className="text-sm">
                  Institut La Clé<br />
                  [Adresse à compléter]<br />
                  [SIRET à compléter]<br />
                  [Email de contact à compléter]
                </p>
              </div>
              <div>
                <h3 className="mb-3">Directeur de la publication</h3>
                <p className="text-sm">[Nom à compléter]</p>
              </div>
              <div>
                <h3 className="mb-3">Hébergement</h3>
                <p className="text-sm">
                  [Hébergeur à compléter]<br />
                  [Adresse hébergeur à compléter]
                </p>
              </div>
              <div>
                <h3 className="mb-3">Propriété intellectuelle</h3>
                <p className="text-sm">
                  L&apos;ensemble du contenu de ce site (textes, images, vidéos,
                  structure) est la propriété exclusive de l&apos;institut La Clé,
                  sauf mention contraire. Toute reproduction, même partielle,
                  est interdite sans autorisation préalable.
                </p>
              </div>
              <div>
                <h3 className="mb-3">Données personnelles</h3>
                <p className="text-sm">
                  Ce site ne collecte aucune donnée personnelle. Aucun cookie
                  de suivi n&apos;est utilisé. Le sessionStorage utilisé pour
                  l&apos;animation d&apos;entrée est purement technique et ne
                  contient aucune information personnelle.
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
