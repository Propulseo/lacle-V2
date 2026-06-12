import { SectionBlock } from "@/components/ui/SectionBlock";
import { Button } from "@/components/ui/Button";

/** Section "Boutons" de la page design-system. */
export function DSButtons() {
  return (
    <SectionBlock background="graphite">
      <h2 className="mb-12">Boutons</h2>
      <div className="space-y-10">
        <div>
          <p className="mb-6 text-xs uppercase tracking-widest text-pierre">Default</p>
          <div className="flex flex-wrap items-center gap-6">
            <Button>Découvrir</Button>
            <Button size="large">Accéder à l&apos;espace</Button>
          </div>
        </div>
        <div>
          <p className="mb-6 text-xs uppercase tracking-widest text-pierre">Ghost</p>
          <div className="flex flex-wrap items-center gap-6">
            <Button variant="ghost">En savoir plus</Button>
            <Button variant="ghost" size="large">Voir les formations</Button>
          </div>
        </div>
        {/*
          Variante "elegant" — démonstration pour comparaison directe avec
          le bouton default. Utilisée sur la page de vente PNL Praticien.
        */}
        <div>
          <p className="mb-6 text-xs uppercase tracking-widest text-pierre">
            Elegant <span className="text-bronze/60">(page de vente)</span>
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Button variant="elegant">Découvrir</Button>
            <Button variant="elegant" size="large">
              Accéder à l&apos;espace
            </Button>
          </div>
        </div>
      </div>
    </SectionBlock>
  );
}
