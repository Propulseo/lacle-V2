import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ProgramEmailForm } from "./ProgramEmailForm";

/*
 * TODO: remplacer par le PDF réel une fois déposé dans public/documents/.
 * Voir public/documents/README.md pour le nom de fichier attendu.
 *
 * Le référentiel de compétences a été RETIRÉ du site (décision Marien,
 * 16/07/2026) : il relève du dossier d'audit Qualiopi, pas de l'information
 * au public. Ind.1 n'exige que le programme.
 */
const PROGRAM_PDF = "/documents/pnl-praticien-programme.pdf";

interface DocumentItem {
  href: string;
  label: string;
  description: string;
  cta: string;
}

const DOCUMENTS: DocumentItem[] = [
  {
    href: PROGRAM_PDF,
    label: "Programme de formation",
    description:
      "Contenu complet du parcours, objectifs p\u00E9dagogiques, modalit\u00E9s d'\u00E9valuation et dur\u00E9es.",
    cta: "T\u00E9l\u00E9charger le programme",
  },
];

/**
 * Section "Documents pédagogiques" — conformité Qualiopi indicateur 1.
 *
 * Expose :
 *  - le téléchargement direct du programme
 *  - un formulaire e-mail alternatif (via /api/send-program)
 *  - la date de dernière actualisation de la page
 */
export function FormationDocuments({
  price,
  lastUpdated,
}: {
  price: string;
  lastUpdated: string;
}) {
  return (
    <div>
      <ScrollReveal>
        <div className="mb-12">
          <p className="mb-3 text-label tracking-[0.25em] text-bronze/70">
            Documents p&eacute;dagogiques
          </p>
          <h2 className="font-display text-3xl text-ivoire md:text-4xl">
            Programme de formation
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cendre">
            Le programme d&eacute;taill&eacute; de la formation est librement
            consultable. Vous pouvez le t&eacute;l&eacute;charger directement ou
            le recevoir par e-mail.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="grid max-w-md gap-px">
          {DOCUMENTS.map((doc) => (
            <DocumentCard key={doc.href} {...doc} />
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="mt-14 border-t border-filet/60 pt-12">
          <p className="mb-3 text-label tracking-[0.25em] text-bronze/70">
            Ou par e-mail
          </p>
          <p className="mb-6 max-w-xl text-sm leading-relaxed text-cendre/80">
            Renseignez votre adresse pour recevoir le programme complet.
          </p>
          <ProgramEmailForm />
        </div>
      </ScrollReveal>

      {/* Date de mise à jour — Qualiopi indicateur 1 (obligatoire). */}
      <ScrollReveal delay={0.3}>
        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-2 text-[0.65rem] uppercase tracking-[0.3em] text-pierre/60">
          <span>Tarif&nbsp;: {price}</span>
          <span>Actualis&eacute; en {lastUpdated}</span>
        </div>
      </ScrollReveal>
    </div>
  );
}

function DocumentCard({ href, label, description, cta }: DocumentItem) {
  return (
    <a
      href={href}
      download
      className="group flex h-full flex-col border border-filet bg-graphite/40 p-8 transition-all duration-500 ease-[var(--ease-institutional)] hover:border-filet-accent hover:bg-ardoise/60 md:p-10"
    >
      <DocumentIcon />
      <p className="mt-8 text-label tracking-[0.25em] text-bronze/70">
        {label}
      </p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-cendre">
        {description}
      </p>
      <span className="mt-8 inline-flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-pierre transition-all duration-500 group-hover:gap-5 group-hover:text-bronze">
        {cta}
        <DownloadArrow />
      </span>
    </a>
  );
}

function DocumentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      className="h-8 w-8 text-pierre transition-colors duration-500 group-hover:text-bronze"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6M9 9h2" />
    </svg>
  );
}

function DownloadArrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 transition-transform duration-500 group-hover:translate-y-0.5"
      aria-hidden="true"
    >
      <path d="M8 2v10M3 8l5 5 5-5" />
    </svg>
  );
}
