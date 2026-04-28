"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { KeySymbol } from "@/components/splash/KeySymbol";
import { ROUTES } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Accueil", href: ROUTES.home },
  { label: "Nous d\écouvrir", href: ROUTES.discover },
  { label: "Formations", href: ROUTES.formations },
  { label: "Contact", href: ROUTES.contact },
];

const MOBILE_LINKS = [
  ...NAV_LINKS,
  { label: "Espace apprenant", href: ROUTES.accessSpace },
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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 pt-5 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* ── Logo ── */}
          <div className="flex items-center gap-3 shrink-0">
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
              aria-label="La Clé — Retour à l’accueil"
            >
              <KeySymbol className="h-5 w-auto text-bronze/60" animate={false} />
              La Clé
            </Link>
          </div>

          {/* ── Nav pill ── */}
          <nav
            className={`rounded-full backdrop-blur-2xl transition-all duration-500 ${
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
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap font-body text-[13px] transition-colors duration-300 ${
                    isActive(link.href)
                      ? "text-ivoire/90"
                      : "text-ivoire/40 hover:text-ivoire/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile burger */}
            <button
              className="flex items-center px-5 py-2.5 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
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
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-noir/[0.98] backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close */}
            <div className="flex justify-end px-6 pt-6 pb-4">
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Fermer le menu"
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
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-1 flex-col justify-center gap-1 px-10">
              {MOBILE_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block border-b border-ivoire/[0.04] py-4 font-display text-3xl font-medium transition-colors duration-300 ${
                      isActive(link.href)
                        ? "text-bronze"
                        : "text-ivoire/70 hover:text-bronze-clair"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Theme toggle */}
              <motion.div
                className="mt-8 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: MOBILE_LINKS.length * 0.06 + 0.1, duration: 0.3 }}
              >
                <ThemeToggle />
                <span className="text-sm text-ivoire/30">Changer de th\ème</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
