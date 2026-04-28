"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { EASE_INSTITUTIONAL } from "@/lib/animations";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, isVisible, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isVisible, onClose, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: EASE_INSTITUTIONAL }}
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 md:bottom-6"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2 rounded-lg border border-filet bg-encre px-4 py-3 text-sm text-ivoire shadow-lg">
            <CheckCircle className="h-4 w-4 shrink-0 text-succes" />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
