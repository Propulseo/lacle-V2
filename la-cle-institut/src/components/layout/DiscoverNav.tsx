import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

export type DiscoverNavCurrent = "vocation" | "concept" | "team";

interface DiscoverNavProps {
  /** Clé de la page courante, mise en avant dans la navigation. */
  current: DiscoverNavCurrent;
  /**
   * Affiche, sous la navigation, un CTA secondaire vers les formations.
   * Utilisé uniquement sur la page Équipe pour inviter à la suite du parcours.
   */
  showFormationCTA?: boolean;
}

const ITEMS: { key: DiscoverNavCurrent; label: string; href: string }[] = [
  { key: "vocation", label: "Vocation", href: ROUTES.vocation },
  { key: "concept", label: "Concept", href: ROUTES.concept },
  { key: "team", label: "\u00C9quipe", href: ROUTES.team },
];

/**
 * Navigation transverse aux trois sous-pages "Nous découvrir".
 * Sobre par construction : mêmes tokens que le reste du site
 * (filet-discret, pierre, bronze, ivoire, ease institutional).
 * S'insère en bas de page, avant le footer, avec un espacement
 * volontairement large pour ne pas "coller" au contenu précédent.
 */
export function DiscoverNav({
  current,
  showFormationCTA = false,
}: DiscoverNavProps) {
  return (
    <section
      aria-label="Navigation entre les pages Nous d\u00E9couvrir"
      className="border-t border-filet-discret py-16 md:py-20 lg:py-24"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 px-6 md:gap-12 md:px-10 lg:px-16">
        <nav
          aria-label="Nous d\u00E9couvrir"
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.3em] md:text-[12px]"
        >
          {ITEMS.map((item, i) => {
            const isActive = item.key === current;
            return (
              <span key={item.key} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" className="text-pierre/40">
                    &rsaquo;
                  </span>
                )}
                {isActive ? (
                  <span
                    aria-current="page"
                    className="font-medium text-bronze"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-pierre transition-colors duration-300 ease-[var(--ease-institutional)] hover:text-ivoire"
                  >
                    {item.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>

        {showFormationCTA && (
          <Button href={ROUTES.formations}>
            D&eacute;couvrir la formation
          </Button>
        )}
      </div>
    </section>
  );
}
