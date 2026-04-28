"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  FORMATIONS,
  type Formation,
  type FormationStatus,
  type FormationType,
} from "@/lib/formations";

/* ── Libellés affichés ──────────────────────────────────────────────── */

const STATUS_LABEL: Record<FormationStatus, string> = {
  disponible: "Disponible",
  en_cours_de_creation: "En cours de cr\u00E9ation",
  en_projet: "En projet",
};

const TYPE_LABEL: Record<FormationType, string> = {
  distanciel: "Distanciel",
  presentiel: "Pr\u00E9sentiel",
};

/**
 * Classes de badge par statut.
 * `disponible`       → ton bronze (accent primaire du site)
 * `en_cours_de_creation` → ton ambre (token dédié, défini dans globals.css)
 * `en_projet`        → ton neutre (filet + pierre)
 */
const STATUS_BADGE: Record<FormationStatus, string> = {
  disponible: "border-bronze/60 bg-bronze/10 text-bronze-clair",
  en_cours_de_creation: "border-ambre/60 bg-ambre/10 text-ambre-clair",
  en_projet: "border-filet bg-graphite/60 text-pierre",
};

/* ── Carrousel ──────────────────────────────────────────────────────── */

export function FormationCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateBounds = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const atStart = el.scrollLeft <= 2;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setCanPrev(!atStart);
    setCanNext(!atEnd);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateBounds();
    el.addEventListener("scroll", updateBounds, { passive: true });
    window.addEventListener("resize", updateBounds);
    return () => {
      el.removeEventListener("scroll", updateBounds);
      window.removeEventListener("resize", updateBounds);
    };
  }, [updateBounds]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-formation-card]");
    // Largeur d'un item + gap (24px / gap-6). Fallback : 80% du viewport.
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({
      left: step * direction,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className="relative">
      {/* En-tête : compteur + contrôles */}
      <div className="mb-10 flex items-end justify-between gap-6">
        <p className="text-label tracking-[0.25em] text-pierre">
          {FORMATIONS.length} parcours
        </p>
        <div className="flex items-center gap-2">
          <CarouselButton
            direction="prev"
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
          />
          <CarouselButton
            direction="next"
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
          />
        </div>
      </div>

      {/*
        Piste scrollable :
        - snap-x mandatory + snap-start = arrêts alignés sur chaque carte
        - overflow-x-auto = swipe tactile natif sur mobile/touchpad
        - .formation-carousel-track (globals.css) masque la scrollbar visuelle
          tout en conservant le scroll natif et l'accessibilité clavier.
      */}
      <div
        ref={scrollerRef}
        role="region"
        aria-label="Catalogue des formations"
        className="formation-carousel-track flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4"
      >
        {FORMATIONS.map((formation) => (
          <div
            key={formation.id}
            data-formation-card
            className="w-[85%] shrink-0 snap-start sm:w-[60%] md:w-[46%] lg:w-[32%]"
          >
            <FormationItem formation={formation} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Contrôles (flèches) ────────────────────────────────────────────── */

interface CarouselButtonProps {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}

function CarouselButton({ direction, disabled, onClick }: CarouselButtonProps) {
  const label =
    direction === "prev" ? "Formation pr\u00E9c\u00E9dente" : "Formation suivante";
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-10 w-10 items-center justify-center border border-filet text-ivoire transition-all duration-500 ease-[var(--ease-institutional)] hover:border-bronze hover:text-bronze-clair disabled:pointer-events-none disabled:opacity-25"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={direction === "prev" ? "-scale-x-100" : ""}
        aria-hidden="true"
      >
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </button>
  );
}

/* ── Carte ──────────────────────────────────────────────────────────── */

interface FormationItemProps {
  formation: Formation;
}

function FormationItem({ formation }: FormationItemProps) {
  const { title, type, status, href } = formation;
  const available = status === "disponible";

  const cardInner = (
    <div
      className={`relative flex h-full min-h-[320px] flex-col justify-between border p-8 transition-all duration-500 ease-[var(--ease-institutional)] md:min-h-[360px] md:p-10 ${
        available
          ? "border-filet bg-graphite/60 group-hover:border-filet-accent group-hover:bg-ardoise/60"
          : "border-filet-discret/60 bg-graphite/25"
      }`}
    >
      {/* Filet bronze vertical pour les formations disponibles */}
      {available && (
        <div
          className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-bronze via-bronze/40 to-transparent"
          aria-hidden="true"
        />
      )}

      <div className={available ? "pl-6" : ""}>
        <StatusBadge status={status} />

        <h3
          className={`mt-6 font-display text-2xl leading-[1.2] transition-colors duration-500 md:text-[1.75rem] ${
            available
              ? "text-ivoire group-hover:text-bronze-clair"
              : "text-pierre/70"
          }`}
        >
          {title}
        </h3>

        <p
          className={`mt-4 text-[10px] uppercase tracking-[0.25em] ${
            available ? "text-cendre" : "text-pierre/50"
          }`}
        >
          {TYPE_LABEL[type]}
        </p>
      </div>

      {/* CTA / État */}
      <div className={`mt-8 ${available ? "pl-6" : ""}`}>
        {available ? (
          <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-pierre transition-all duration-500 group-hover:gap-5 group-hover:text-bronze">
            D&eacute;couvrir
            <span className="inline-block h-px w-8 bg-current transition-all duration-500 group-hover:w-12" />
          </span>
        ) : (
          <span className="text-[10px] uppercase tracking-[0.2em] text-pierre/40">
            Bient&ocirc;t disponible
          </span>
        )}
      </div>
    </div>
  );

  if (available && href) {
    return (
      <Link href={href} className="card-elevated group block h-full">
        {cardInner}
      </Link>
    );
  }

  return (
    <div
      className="group block h-full cursor-not-allowed"
      aria-disabled="true"
      title="Bientôt disponible"
    >
      {cardInner}
    </div>
  );
}

/* ── Badge de statut ────────────────────────────────────────────────── */

interface StatusBadgeProps {
  status: FormationStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${STATUS_BADGE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
