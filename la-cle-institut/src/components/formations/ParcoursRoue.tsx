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
  beta_test: "Créé, en bêta test",
  en_cours_de_creation: "En cours de création",
  en_projet: "En projet",
};

const TYPE_LABEL: Record<FormationType, string> = {
  distanciel: "Distanciel",
  presentiel: "Présentiel",
};

const STATUS_BADGE: Record<FormationStatus, string> = {
  disponible: "border-bronze/60 bg-bronze/10 text-bronze-clair",
  beta_test: "border-bronze/40 bg-bronze/5 text-bronze/80",
  en_cours_de_creation: "border-ambre/60 bg-ambre/10 text-ambre-clair",
  en_projet: "border-filet bg-graphite/60 text-pierre",
};

/**
 * Roue d'un parcours (retour A14) : les étapes sont disposées en cercle
 * autour d'un cœur décoratif (écho au motif orbital du site). Sur écran
 * large, c'est une vraie roue ; en dessous de lg, on retombe sur une pile
 * de cartes (lisible sur mobile). Étape « disponible » cliquable, les
 * autres signalent « Bientôt disponible ».
 */
export function ParcoursRoue({ parcours }: { parcours: Parcours }) {
  const steps = parcours.steps;
  const isWheel = steps.length >= 2;

  return (
    <div>
      <div className="mb-10 max-w-md">
        <h3 className="font-display text-xl text-ivoire md:text-2xl">
          {parcours.label}
        </h3>
        {parcours.description && (
          <p className="mt-2 text-sm leading-relaxed text-pierre">
            {parcours.description}
          </p>
        )}
      </div>

      {/* Roue (écran large, parcours à plusieurs étapes) */}
      {isWheel && (
        <div className="relative mx-auto hidden aspect-square w-full max-w-[540px] lg:block">
          <Ring sizePct={76} className="border-filet-discret" />
          <Ring sizePct={52} className="border-dashed border-bronze/15" />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bronze/40"
          />
          {steps.map((formation, i) => {
            const angle = (-90 + (360 / steps.length) * i) * (Math.PI / 180);
            const left = 50 + 38 * Math.cos(angle);
            const top = 50 + 38 * Math.sin(angle);
            return (
              <div
                key={formation.id}
                className="absolute w-44 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <FormationNode formation={formation} />
              </div>
            );
          })}
        </div>
      )}

      {/* Pile : mobile/tablette des roues, ou parcours à une seule étape */}
      {isWheel ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:hidden">
          {steps.map((formation) => (
            <FormationNode key={formation.id} formation={formation} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-sm">
          {steps.map((formation) => (
            <FormationNode key={formation.id} formation={formation} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Anneau décoratif ───────────────────────────────────────────────── */

function Ring({ sizePct, className }: { sizePct: number; className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border ${className}`}
      style={{ width: `${sizePct}%` }}
    />
  );
}

/* ── Carte d'une étape ──────────────────────────────────────────────── */

function FormationNode({ formation }: { formation: Formation }) {
  const { title, type, status, href } = formation;
  const available = status === "disponible";

  const inner = (
    <div
      className={`flex h-full flex-col items-center gap-4 border p-6 text-center transition-all duration-500 ease-[var(--ease-institutional)] ${
        available
          ? "border-filet bg-graphite/70 group-hover:border-bronze/60 group-hover:bg-ardoise/60"
          : "border-filet-discret/60 bg-graphite/30"
      }`}
    >
      <span
        className={`inline-block border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${STATUS_BADGE[status]}`}
      >
        {STATUS_LABEL[status]}
      </span>
      <h4
        className={`font-display text-lg leading-tight transition-colors duration-500 md:text-xl ${
          available
            ? "text-ivoire group-hover:text-bronze-clair"
            : "text-pierre/70"
        }`}
      >
        {title}
      </h4>
      <p
        className={`text-[10px] uppercase tracking-[0.2em] ${
          available ? "text-cendre" : "text-pierre/50"
        }`}
      >
        {TYPE_LABEL[type]}
      </p>
    </div>
  );

  if (available && href) {
    return (
      <Link href={href} className="card-elevated group block h-full">
        {inner}
      </Link>
    );
  }
  return (
    <div
      className="group block h-full cursor-not-allowed"
      aria-disabled="true"
      title={STATUS_LABEL[status]}
    >
      {inner}
    </div>
  );
}
