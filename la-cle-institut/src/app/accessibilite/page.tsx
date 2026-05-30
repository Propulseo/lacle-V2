import { Header } from "@/components/layout/Header";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { HeroSection } from "@/components/ui/HeroSection";
import { SectionBlock } from "@/components/ui/SectionBlock";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HANDICAP_REFERENT_EMAIL } from "@/lib/qualiopi";

export const metadata = {
  title: "Accessibilité et handicap | La Clé",
  description:
    "Accueil, accompagnement et orientation des personnes en situation de handicap à l'institut La Clé (Qualiopi indicateur 26).",
};

const PROCEDURE: { num: string; titre: string; texte: string }[] = [
  {
    num: "01",
    titre: "Signalement du besoin",
    texte:
      "Vous pouvez signaler une situation de handicap avant l'inscription, à l'entrée en formation ou à tout moment du parcours, par e-mail, par téléphone ou via le formulaire de contact.",
  },
  {
    num: "02",
    titre: "Entretien de clarification",
    texte:
      "Un échange confidentiel permet d'identifier les contraintes rencontrées, les besoins spécifiques, les outils déjà efficaces et le niveau d'autonomie numérique.",
  },
  {
    num: "03",
    titre: "Analyse d'adéquation",
    texte:
      "Le référent étudie la compatibilité avec la formation distancielle, les aménagements internes possibles et la nécessité éventuelle d'un partenaire externe.",
  },
  {
    num: "04",
    titre: "Mise en place d'aménagements",
    texte:
      "Lorsque c'est possible, des adaptations sont proposées (rythme libre, séquences courtes, relecture illimitée, supports synthétiques).",
  },
  {
    num: "05",
    titre: "Suivi pendant la formation",
    texte:
      "Un point peut être réalisé à votre demande, à tout moment, pour ajuster les aménagements.",
  },
];

const RESEAU = [
  "Agefiph",
  "Cap Emploi 35",
  "MDPH d'Ille-et-Vilaine",
  "Ressource Handicap Formation Bretagne",
];

export default function AccessibilitePage() {
  return (
    <>
      <Header showBack backHref="/" backLabel="Accueil" />
      <PageWrapper>
        <HeroSection
          label="Accessibilité"
          title="Handicap et accessibilité"
          subtitle="Accueillir, écouter, adapter quand c'est possible, orienter quand c'est nécessaire."
          decorativeLine
        />

        {/* ---- Engagement ---- */}
        <SectionBlock>
          <ScrollReveal>
            <div className="max-w-2xl">
              <h2 className="mb-6">Notre engagement</h2>
              <p className="mb-4">
                L&apos;institut La Clé favorise l&apos;accès à ses formations pour les
                personnes en situation de handicap, dans le respect du principe
                d&apos;égalité d&apos;accès à la formation professionnelle.
              </p>
              <p>
                La nature 100% distancielle de la formation constitue déjà un
                premier levier d&apos;accessibilité&nbsp;: apprentissage depuis le
                domicile, rythme individualisé, accès à vie, possibilité de
                pause et de reprise, réduction des contraintes de déplacement.
                Chaque situation est étudiée individuellement afin de rechercher
                les aménagements raisonnablement possibles.
              </p>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- Référent handicap ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="max-w-2xl">
              <p className="mb-3 text-label tracking-[0.25em] text-bronze/70">
                Référent handicap
              </p>
              <h2 className="mb-6">Une personne dédiée</h2>
              <p className="mb-6">
                Le référent handicap de l&apos;institut est Marien Jesson. Il assure
                le premier contact, le recueil des besoins, l&apos;analyse de la
                compatibilité avec la formation, la proposition d&apos;aménagements,
                la mobilisation de partenaires externes si nécessaire et le suivi
                pendant le parcours.
              </p>
              <a
                href={`mailto:${HANDICAP_REFERENT_EMAIL}`}
                className="inline-flex items-center gap-2 text-sm text-bronze transition-colors duration-300 hover:text-bronze-clair"
              >
                {HANDICAP_REFERENT_EMAIL}
              </a>
            </div>
          </ScrollReveal>
        </SectionBlock>

        {/* ---- Procédure ---- */}
        <SectionBlock>
          <ScrollReveal>
            <h2 className="mb-12">La procédure d&apos;accueil</h2>
          </ScrollReveal>
          <div className="grid gap-px md:grid-cols-2 lg:grid-cols-3">
            {PROCEDURE.map((etape) => (
              <ScrollReveal key={etape.num}>
                <div className="card-elevated h-full border border-filet bg-graphite/30 p-8">
                  <span className="mb-6 block font-display text-5xl font-extralight text-bronze/15">
                    {etape.num}
                  </span>
                  <h3 className="mb-4 font-display text-xl text-ivoire">
                    {etape.titre}
                  </h3>
                  <p className="text-sm leading-relaxed text-cendre">
                    {etape.texte}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </SectionBlock>

        {/* ---- Réseau mobilisable ---- */}
        <SectionBlock background="graphite">
          <ScrollReveal>
            <div className="max-w-2xl">
              <h2 className="mb-6">Un réseau de partenaires</h2>
              <p className="mb-8">
                Lorsque la situation l&apos;exige (besoin technique spécifique,
                compensation complexe, expertise particulière), l&apos;institut
                mobilise les acteurs spécialisés&nbsp;:
              </p>
              <ul className="flex flex-wrap gap-3">
                {RESEAU.map((acteur) => (
                  <li
                    key={acteur}
                    className="border border-filet bg-graphite/40 px-4 py-2 text-sm text-cendre"
                  >
                    {acteur}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm leading-relaxed text-pierre">
                L&apos;institut La Clé n&apos;est pas un organisme spécialisé du
                handicap médicalisé. Son engagement&nbsp;: accueillir, écouter,
                adapter quand c&apos;est possible, orienter quand c&apos;est nécessaire,
                et ne jamais laisser une demande sans réponse.
              </p>
            </div>
          </ScrollReveal>
        </SectionBlock>

        <FooterMinimal />
      </PageWrapper>
    </>
  );
}
