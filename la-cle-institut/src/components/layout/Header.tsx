"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav, MOBILE_MENU_ID } from "./MobileNav";
import { KeySymbol } from "@/components/splash/KeySymbol";
import { ROUTES } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Accueil", href: ROUTES.home },
  { label: "Nous découvrir", href: ROUTES.discover },
  { label: "Formations", href: ROUTES.formations },
  { label: "Contact", href: ROUTES.contact },
];

interface HeaderProps {
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
  /**
   * Contrôle le déclenchement de la micro-animation d'entrée du ThemeToggle.
   * La home l'utilise pour synchroniser le hint avec la fin de l'animation hero
   * (sinon l'anneau se joue pendant que le Header est encore invisible).
   * Par défaut `true` : les autres pages déclenchent au montage.
   */
  toggleHint?: boolean;
}

export function Header({
  showBack,
  backHref,
  backLabel,
  toggleHint = true,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Fermeture du menu mobile à la navigation : on ajuste l'état pendant le
  // rendu (pattern officiel React « storing info from previous renders »)
  // plutôt que dans un effet — évite un setState en effet et applique la
  // fermeture sans frame intermédiaire, en n'utilisant que du state.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  // Restauration du focus : élément actif avant ouverture du menu mobile.
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Gestion du focus + fermeture clavier (Escape) pour le menu mobile.
  useEffect(() => {
    if (!mobileOpen) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 pt-5 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* ── Logo ── */}
          <div className="flex items-center gap-5 shrink-0">
            {showBack && backHref && (
              <Link
                href={backHref}
                className="hidden items-center gap-1.5 text-[12px] text-pierre transition-colors duration-300 hover:text-cendre lg:flex"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                {backLabel || "Retour"}
              </Link>
            )}
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-lg font-semibold tracking-wide text-ivoire/80 transition-colors duration-300 hover:text-ivoire"
              aria-label="La Clé, retour à l’accueil"
            >
              <KeySymbol className="h-5 w-auto text-bronze/60" animate={false} />
              La Clé
            </Link>
          </div>

          {/* ── Nav pill ── */}
          <nav
            aria-label="Navigation principale"
            className={`rounded-full backdrop-blur-lg transition-all duration-500 ${
              scrolled
                ? "bg-noir/90 border border-ivoire/[0.08]"
                : "bg-noir/70 border border-ivoire/[0.05]"
            }`}
            style={{
              boxShadow: scrolled
                ? "var(--pill-shadow-active)"
                : "var(--pill-shadow)",
            }}
          >
            {/* Desktop links */}
            <div className="hidden items-center gap-8 px-8 py-2.5 lg:flex lg:px-10">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`whitespace-nowrap font-body text-[13px] transition-colors duration-300 ${
                      active
                        ? "font-medium text-ivoire/90 underline decoration-bronze/60 decoration-1 underline-offset-[6px]"
                        : "text-ivoire/40 hover:text-ivoire/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile burger */}
            <button
              ref={burgerRef}
              className="flex items-center px-5 py-2.5 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
              aria-controls={MOBILE_MENU_ID}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                className="text-ivoire/50"
              >
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          </nav>

          {/* ── Right zone ── */}
          <div className="hidden shrink-0 items-center gap-4 lg:flex">
            <ThemeToggle hintEnabled={toggleHint} />
            <Link
              href={ROUTES.accessSpace}
              className="inline-flex items-center gap-2 text-[13px] text-bronze/50 transition-colors duration-300 hover:text-bronze/70"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-50"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Espace apprenant
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ── */}
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isActive={isActive}
        closeButtonRef={closeButtonRef}
      />
    </>
  );
}
