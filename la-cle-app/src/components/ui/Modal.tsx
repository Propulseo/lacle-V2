"use client";

import { useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { EASE_INSTITUTIONAL } from "@/lib/animations";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
}: ModalProps) {
  const focusTrapRef = useFocusTrap(isOpen);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-nuit-profond/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            ref={focusTrapRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: EASE_INSTITUTIONAL }}
            className={`relative w-full ${sizeStyles[size]} rounded-xl border border-filet bg-encre p-6 shadow-2xl`}
          >
            {title && (
              <div className="mb-4 flex items-center justify-between">
                <h3 id={titleId} className="font-serif text-xl text-ivoire">
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fermer la modale"
                  className="rounded-lg p-1 text-cendre hover:text-ivoire hover:bg-ivoire/5 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            {description && (
              <p id={descId} className="sr-only">
                {description}
              </p>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
