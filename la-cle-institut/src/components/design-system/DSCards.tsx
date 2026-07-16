import { SectionBlock } from "@/components/ui/SectionBlock";
import { HubCard } from "@/components/ui/HubCard";
import { FormationCard } from "@/components/ui/FormationCard";
import { ModuleCard } from "@/components/ui/ModuleCard";

/** Sections "Cartes Hub", "Cartes Formation" et "Modules" du design-system. */
export function DSCards() {
  return (
    <>
      {/* ---- CARDS HUB ---- */}
      <SectionBlock background="graphite">
        <h2 className="mb-12">Cartes Hub</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <HubCard title="Notre vocation" description="Comprendre le pourquoi profond de l'institut et sa mission de compréhension." href="#" />
          <HubCard title="Le concept" description="Le cadre méthodologique et la distinction compréhension versus transformation." href="#" />
          <HubCard title="L'équipe" description="Les garants pédagogiques et l'origine de l'institut La Clé." href="#" />
        </div>
      </SectionBlock>

      {/* ---- CARDS FORMATION ---- */}
      <SectionBlock>
        <h2 className="mb-12">Cartes Formation</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <FormationCard
            title="Praticien PNL"
            description="Formation complète de praticien PNL. Parcours distanciel structuré menant à une attestation de fin de formation."
            href="#"
            available
            label="Disponible"
          />
          <FormationCard
            title="Maître Praticien PNL"
            description="Approfondissement des mécanismes avancés de la PNL. Suite logique du parcours praticien."
            available={false}
            label="À venir"
          />
        </div>
      </SectionBlock>

      {/* ---- MODULE CARDS ---- */}
      <SectionBlock background="graphite">
        <h2 className="mb-12">Modules</h2>
        <div className="max-w-2xl">
          <ModuleCard number={1} title="Les fondations de la PNL" description="Origines, principes fondateurs et cadre épistémologique de la programmation neuro-linguistique." />
          <ModuleCard number={2} title="Systèmes de représentation" description="Comprendre les modalités sensorielles et leur influence sur la perception et la communication." />
          <ModuleCard number={3} title="Le méta-modèle" description="Structure du langage et outils de précision linguistique pour une compréhension approfondie." />
        </div>
      </SectionBlock>
    </>
  );
}
