"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_SMOOTH } from "@/lib/animations";

interface ExpandableProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Expandable({
  title,
  children,
  defaultOpen = false,
}: ExpandableProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-filet">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left transition-colors duration-300 hover:text-bronze-clair"
        aria-expanded={isOpen}
      >
        <span className="pr-8 font-serif text-xl text-ivoire md:text-2xl">
          {title}
        </span>
        <span
          className={`shrink-0 text-lg text-bronze transition-transform duration-500 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_SMOOTH }}
            className="overflow-hidden"
          >
            <div className="pb-8 leading-relaxed text-cendre">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
