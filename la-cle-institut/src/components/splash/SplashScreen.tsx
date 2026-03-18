"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeySymbol } from "./KeySymbol";
import { EASE_INSTITUTIONAL, EASE_SMOOTH } from "@/lib/animations";
import { SPLASH_DURATION, SITE } from "@/lib/constants";

interface SplashScreenProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function SplashScreen({ isVisible, onComplete }: SplashScreenProps) {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onComplete, SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-noir"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_SMOOTH }}
          aria-hidden="true"
        >
          <KeySymbol className="w-12 h-auto text-ivoire mb-8" animate />
          <motion.p
            className="font-serif text-lg md:text-xl text-cendre tracking-[0.15em]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6, ease: EASE_INSTITUTIONAL }}
          >
            {SITE.baseline}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
