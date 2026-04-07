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
          className="splash-force-dark fixed inset-0 z-50 flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_SMOOTH }}
          aria-hidden="true"
        >
          <KeySymbol className="w-12 h-auto text-[#F5F0EB] mb-8" animate />
          <motion.p
            className="font-display text-lg md:text-xl text-[#A09A93] tracking-[0.15em]"
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
