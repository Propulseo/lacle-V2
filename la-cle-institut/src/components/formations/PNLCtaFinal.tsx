import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

/** Section CTA finale de la page de vente PNL Praticien. */
export function PNLCtaFinal() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div
        className="absolute inset-0 bg-gradient-to-b from-noir via-graphite/60 to-noir"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(176,141,87,0.04),transparent)]"
        aria-hidden="true"
      />
      <ScrollReveal>
        <div className="relative mx-auto max-w-[1200px] px-6 text-center md:px-10 lg:px-16">
          <span
            className="mb-8 block font-display text-7xl font-extralight text-bronze/10 md:text-9xl"
            aria-hidden="true"
          >
            &rarr;
          </span>
          <h2 className="mb-6 font-display text-3xl text-ivoire md:text-4xl lg:text-5xl">
            Prêt à commencer
          </h2>
          <p className="mx-auto mb-14 max-w-lg leading-relaxed text-cendre">
            L&apos;espace de formation vous attend. Vous y trouverez le
            parcours complet et tout ce dont vous avez besoin pour démarrer.
          </p>
          {/*
            CTA principal de la page de vente — variante "elegant".
            Pour revenir au bouton d'origine, retirer simplement la prop
            `variant="elegant"` (ou la remettre à "default").
            Définition de la variante : globals.css → .btn-elegant
          */}
          <Button href={ROUTES.accessSpace} size="large" variant="elegant">
            Accéder à l&apos;espace de formation
          </Button>
        </div>
      </ScrollReveal>
    </section>
  );
}
