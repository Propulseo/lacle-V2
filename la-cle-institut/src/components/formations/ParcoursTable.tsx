import Link from "next/link";
import {
  type Formation,
  type FormationStatus,
  type FormationType,
  type Parcours,
} from "@/lib/formations";

/* ── Libellés ───────────────────────────────────────────────────────── */

const STATUS_LABEL: Record<FormationStatus, string> = {
  disponible: "Disponible",
  cohorte_pilote: "Cohorte pilote",
  en_developpement: "En développement pédagogique",
};

const TYPE_LABEL: Record<FormationType, string> = {
  distanciel: "Distanciel",
  presentiel: "Présentiel",
};

const STATUS_BADGE: Record<FormationStatus, string> = {
  disponible: "border-bronze/60 bg-bronze/10 text-bronze-clair",
  cohorte_pilote: "border-ambre/60 bg-ambre/10 text-ambre-clair",
  en_developpement: "border-filet bg-graphite/60 text-pierre",
};

/**
 * Tableau séquentiel d'un parcours (retours 9 et 10).
 *
 * Les étapes se lisent de haut en bas, dans l'ordre du cursus : l'utilisateur
 * comprend d'un coup d'œil qu'on commence en distanciel (attestation) avant
 * la mise en pratique en présentiel (certification). Remplace la roue, dont
 * la disposition circulaire ne rendait aucun ordre lisible.
 */
export function ParcoursTable({ parcours }: { parcours: Parcours }) {
  return (
    <div>
      <div className="mb-8 max-w-md">
        <h3 className="font-display text-xl text-ivoire md:text-2xl">
          {parcours.label}
        </h3>
        {parcours.description && (
          <p className="mt-2 text-sm leading-relaxed text-pierre">
            {parcours.description}
          </p>
        )}
      </div>

      <ol className="border border-filet">
        {parcours.steps.map((step) => (
          <li key={step.id} className="border-b border-filet last:border-b-0">
            <StepRow formation={step} />
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── Ligne d'une étape ──────────────────────────────────────────────── */

function StepRow({ formation }: { formation: Formation }) {
  const { title, type, status, etape, delivrable, href } = formation;
  // Cliquable = une page existe. Le statut n'informe que le badge : une
  // cohorte pilote dotée d'une page de vente doit rester accessible.
  const linked = Boolean(href);

  const inner = (
    <div
      className={`grid gap-3 p-6 transition-all duration-500 ease-[var(--ease-institutional)] md:grid-cols-[7rem_1fr_auto_1.5rem] md:items-center md:gap-8 md:p-8 ${
        linked
          ? "bg-graphite/40 group-hover:bg-ardoise/60"
          : "bg-graphite/20"
      }`}
    >
      {/* Rang dans le cursus */}
      <p
        className={`text-[10px] uppercase tracking-[0.2em] ${
          etape ? "text-bronze/70" : "text-pierre/30"
        }`}
      >
        {etape ?? "—"}
      </p>

      {/* Intitulé + modalité → délivrable */}
      <div className="min-w-0">
        <h4
          className={`font-display text-lg leading-tight transition-colors duration-500 md:text-xl ${
            linked
              ? "text-ivoire group-hover:text-bronze-clair"
              : "text-pierre/70"
          }`}
        >
          {title}
        </h4>
        <p
          className={`mt-1 text-[10px] uppercase tracking-[0.2em] ${
            linked ? "text-cendre" : "text-pierre/50"
          }`}
        >
          {TYPE_LABEL[type]}
          {delivrable && ` → ${delivrable}`}
        </p>
      </div>

      {/* Statut */}
      <span
        className={`inline-block w-fit border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${STATUS_BADGE[status]}`}
      >
        {STATUS_LABEL[status]}
      </span>

      {/* Affordance : seule une étape dotée d'une page mène quelque part. */}
      {linked && <StepArrow />}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="card-elevated group block">
        {inner}
      </Link>
    );
  }
  return (
    <div
      className="group block cursor-not-allowed"
      aria-disabled="true"
      title={STATUS_LABEL[status]}
    >
      {inner}
    </div>
  );
}

function StepArrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="hidden h-3 w-3 text-pierre transition-all duration-500 group-hover:translate-x-1 group-hover:text-bronze md:block"
      aria-hidden="true"
    >
      <path d="M2 8h12M9 3l5 5-5 5" />
    </svg>
  );
}
