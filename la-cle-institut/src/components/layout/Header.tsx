import Link from "next/link";
import { BackLink } from "./BackLink";

interface HeaderProps {
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function Header({
  showBack = false,
  backHref = "/",
  backLabel = "Retour",
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-filet-discret bg-noir/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 md:px-10 lg:px-16">
        <Link
          href="/"
          className="font-serif text-xl tracking-wide text-ivoire transition-colors duration-300 hover:text-bronze-clair"
          aria-label="La Clé — Retour à l'accueil"
        >
          La Clé
        </Link>
        <div className="flex items-center gap-4">
          {showBack && <BackLink href={backHref} label={backLabel} />}
          <Link
            href="/acces-espace"
            className="group flex items-center gap-2 rounded-full border border-filet-discret px-3 py-1.5 transition-all duration-500 ease-[var(--ease-institutional)] hover:border-bronze/50 hover:bg-bronze/5"
            aria-label="Se connecter"
            title="Se connecter"
          >
            <UserIcon className="h-4 w-4 text-cendre transition-colors duration-300 group-hover:text-bronze-clair" />
            <span className="hidden text-[10px] uppercase tracking-[0.12em] text-cendre transition-colors duration-300 group-hover:text-bronze-clair sm:block">
              Connexion
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
