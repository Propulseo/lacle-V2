"use client";

import type { RefObject } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { ROUTES } from "@/lib/constants";

const MOBILE_LINKS = [
  { label: "Accueil", href: ROUTES.home },
  { label: "Nous découvrir", href: ROUTES.discover },
  { label: "Formations", href: ROUTES.formations },
  { label: "Contact", href: ROUTES.contact },
  { label: "Espace apprenant", href: ROUTES.accessSpace },
];

export const MOBILE_MENU_ID = "header-mobile-menu";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
  /** Bouton focalisé à l'ouverture (gestion du focus dans Header). */
  closeButtonRef: RefObject<HTMLButtonElement | null>;
}

export function MobileNav({
  open,
  onClose,
  isActive,
  closeButtonRef,
}: MobileNavProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={MOBILE_MENU_ID}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          className="fixed inset-0 z-[60] flex flex-col bg-noir/[0.98] backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Close */}
          <div className="flex justify-end px-6 pt-6 pb-4">
            <button
              ref={closeButtonRef}
              onClick={onClose}
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
            {MOBILE_LINKS.map((link, i) => {
              const active = isActive(link.href);
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`block border-b border-ivoire/[0.04] py-4 font-display text-3xl transition-colors duration-300 ${
                      active
                        ? "font-semibold text-bronze underline decoration-bronze/50 decoration-1 underline-offset-[6px]"
                        : "font-medium text-ivoire/70 hover:text-bronze-clair"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}

            {/* Theme toggle */}
            <motion.div
              className="mt-8 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: MOBILE_LINKS.length * 0.06 + 0.1, duration: 0.3 }}
            >
              <ThemeToggle />
              <span className="text-sm text-ivoire/30">Changer de thème</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
