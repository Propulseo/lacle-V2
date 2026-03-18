import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export function FooterMinimal() {
  return (
    <footer className="border-t border-filet py-12 md:py-16">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-6 md:flex-row md:px-10 lg:px-16">
        <nav className="flex items-center gap-8" aria-label="Pied de page">
          <Link
            href={ROUTES.legal}
            className="text-xs uppercase tracking-[0.1em] text-pierre transition-colors duration-300 hover:text-cendre"
          >
            Mentions légales
          </Link>
          <Link
            href={ROUTES.terms}
            className="text-xs uppercase tracking-[0.1em] text-pierre transition-colors duration-300 hover:text-cendre"
          >
            CGV
          </Link>
          <Link
            href={ROUTES.contact}
            className="text-xs uppercase tracking-[0.1em] text-pierre transition-colors duration-300 hover:text-cendre"
          >
            Contact
          </Link>
        </nav>
        <p className="text-xs text-pierre/50">
          &copy; {new Date().getFullYear()} La Clé
        </p>
      </div>
    </footer>
  );
}
