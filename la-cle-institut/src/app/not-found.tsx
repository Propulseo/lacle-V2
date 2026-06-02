import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Page introuvable | La Clé",
  description:
    "La page que vous cherchez n’existe pas ou a été déplacée. Institut La Clé.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Header showBack backHref={ROUTES.home} backLabel="Accueil" />
      <PageWrapper>
        <section className="flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-28 text-center md:pt-32">
          <div className="mx-auto w-full max-w-[640px]">
            <p
              className="mb-8 font-display text-7xl font-extralight text-bronze/15 md:text-8xl"
              aria-hidden="true"
            >
              404
            </p>
            <p className="mb-4 text-label tracking-[0.3em] text-bronze">
              Page introuvable
            </p>
            <h1 className="font-display text-3xl font-semibold text-ivoire md:text-4xl lg:text-5xl">
              Cette page n&apos;existe pas
            </h1>
            <p className="mx-auto mt-6 max-w-md leading-relaxed text-cendre">
              La page que vous recherchez a peut-être été déplacée, ou son
              adresse a été saisie de manière incomplète. Nous vous invitons à
              regagner l&apos;une de nos pages principales.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                href={ROUTES.home}
                className="inline-flex items-center justify-center border border-filet px-8 py-3.5 font-body text-xs uppercase tracking-[0.12em] text-ivoire transition-all duration-500 ease-[var(--ease-institutional)] hover:border-bronze hover:text-bronze-clair"
              >
                Retour à l&apos;accueil
              </Link>
              <Link
                href={ROUTES.formations}
                className="inline-flex items-center justify-center font-body text-xs uppercase tracking-[0.12em] text-cendre underline decoration-filet underline-offset-4 transition-colors duration-500 ease-[var(--ease-institutional)] hover:text-ivoire hover:decoration-bronze"
              >
                Voir les formations
              </Link>
            </div>
          </div>
        </section>
        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
