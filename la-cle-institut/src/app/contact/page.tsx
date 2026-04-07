import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionBlock } from "@/components/ui/SectionBlock";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact — La Clé",
  description:
    "Contactez l\u2019institut La Clé pour toute question relative aux formations ou à votre parcours.",
};

const CONTACT_BLOCKS = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        className="h-6 w-6"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4L12 13 2 4" />
      </svg>
    ),
    title: "Nous écrire",
    text: "Pour toute question relative à l\u2019institut, à nos formations ou à votre parcours.",
    detail: "contact@la-cle-institut.fr",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        className="h-6 w-6"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Délai de réponse",
    text: "Nous nous engageons à répondre à chaque message avec l\u2019attention qu\u2019il mérite. Comme pour nos formations, nous privilégions la qualité à la rapidité.",
    detail: "Sous 48 heures ouvrées",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        className="h-6 w-6"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Nous trouver",
    text: "L\u2019institut accueille ses apprenants dans un cadre pensé pour la concentration et la profondeur.",
    detail: "Adresse communiquée sur demande",
  },
];

export default function ContactPage() {
  return (
    <>
      <Header showBack backHref="/" backLabel="Accueil" />
      <PageWrapper>
        {/* ---- HERO ---- */}
        <section className="relative flex min-h-[70vh] flex-col justify-center overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
          <div
            className="absolute inset-0 bg-gradient-to-b from-graphite/40 via-noir to-noir"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(176,141,87,0.04),transparent)]"
            aria-hidden="true"
          />

          <div className="relative mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-16">
            <ScrollReveal>
              <p className="text-label tracking-[0.3em] text-bronze">
                Institut La Clé
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-ivoire md:text-7xl lg:text-8xl">
                Nous contacter
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-12 flex items-start gap-6">
                <div className="mt-3 hidden h-px w-20 shrink-0 bg-gradient-to-r from-bronze/60 to-transparent md:block" />
                <p className="max-w-lg text-lg leading-relaxed text-cendre md:text-xl">
                  Chaque échange est traité avec la même exigence que celle que
                  nous portons à nos formations.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ---- PHILOSOPHIE ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl py-4 text-center md:py-8">
              <p className="font-display text-xl font-light leading-[1.6] text-ivoire/70 md:text-2xl lg:text-3xl lg:leading-[1.5]">
                Nous ne cherchons pas à convaincre.{" "}
                <span className="text-bronze/80">
                  Nous répondons à ceux qui cherchent à comprendre.
                </span>
              </p>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- BLOCS CONTACT ---- */}
        <SectionBlock>
          <div className="grid gap-px md:grid-cols-3">
            {CONTACT_BLOCKS.map((block, i) => (
              <ScrollReveal key={block.title} delay={i * 0.1}>
                <div className="group flex h-full flex-col border border-filet/60 bg-graphite/20 p-8 transition-all duration-500 hover:border-filet-accent hover:bg-graphite/40 md:p-10 lg:p-12">
                  {/* Icon */}
                  <div className="mb-8 text-pierre transition-colors duration-500 group-hover:text-bronze">
                    {block.icon}
                  </div>

                  <h3 className="mb-4 font-display text-xl text-ivoire md:text-2xl">
                    {block.title}
                  </h3>
                  <p className="mb-8 flex-1 text-sm leading-relaxed text-cendre/80">
                    {block.text}
                  </p>

                  {/* Detail */}
                  <div className="border-t border-filet/40 pt-6">
                    <p className="text-sm font-medium tracking-wide text-ivoire/90">
                      {block.detail}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </SectionBlock>

        {/* ---- FORMULAIRE ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl">
              <div className="mb-12">
                <p className="mb-3 text-label tracking-[0.25em] text-bronze/70">
                  Formulaire
                </p>
                <h2 className="font-display text-3xl text-ivoire md:text-4xl">
                  Nous écrire directement
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-cendre/70">
                  Remplissez le formulaire ci-dessous. Nous reviendrons vers
                  vous avec l&apos;attention que mérite votre démarche.
                </p>
              </div>
              <ContactForm />
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- NOTE INSTITUTIONNELLE ---- */}
        <SectionBlock>
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <div
                className="mx-auto mb-12 h-px w-24 bg-gradient-to-r from-transparent via-bronze/25 to-transparent"
                aria-hidden="true"
              />
              <p className="mb-4 text-label tracking-[0.3em] text-pierre/50">
                Une précision
              </p>
              <p className="font-display text-lg leading-relaxed text-ivoire/60 md:text-xl">
                L&apos;institut La Clé ne pratique ni démarchage, ni relance. Si
                vous nous écrivez, nous vous répondrons. Si vous ne le faites
                pas, nous respectons ce choix. La porte reste ouverte.
              </p>
            </div>
          </ScrollReveal>
        </SectionBlock>

        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
