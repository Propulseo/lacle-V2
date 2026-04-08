import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export function FooterMinimal() {
  return (
    <footer className="footer-minimal relative mt-0 border-t border-filet-discret pt-10 pb-10 md:pt-12 md:pb-12">
      {/* Fond subtil */}
      <div
        className="absolute inset-0 -z-10 bg-graphite/40"
        aria-hidden="true"
      />

      {/* Gradient décoratif en haut */}
      <div
        className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-noir to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto flex max-w-[1450px] flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center md:px-10 lg:px-16">
        {/* Branding */}
        <div>
          <p className="font-display text-base font-semibold tracking-wide text-ivoire/60">
            La Clé
          </p>
          <p className="mt-1 font-display text-xs italic text-pierre/50">
            Comprendre avant d&apos;agir
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-8" aria-label="Pied de page">
          <Link
            href={ROUTES.legal}
            className="text-xs uppercase tracking-[0.1em] text-pierre transition-colors duration-300 hover:text-bronze"
          >
            Mentions légales
          </Link>
          <Link
            href={ROUTES.terms}
            className="text-xs uppercase tracking-[0.1em] text-pierre transition-colors duration-300 hover:text-bronze"
          >
            CGV
          </Link>
          <Link
            href={ROUTES.contact}
            className="text-xs uppercase tracking-[0.1em] text-pierre transition-colors duration-300 hover:text-bronze"
          >
            Contact
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-pierre/50">
          &copy; {new Date().getFullYear()} La Clé
        </p>
      </div>
    </footer>
  );
}
