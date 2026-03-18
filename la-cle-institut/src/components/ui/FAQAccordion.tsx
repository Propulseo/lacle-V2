"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_SMOOTH } from "@/lib/animations";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-filet border-t border-filet">
      {items.map((item, index) => (
        <div key={index}>
          <button
            onClick={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
            className="flex w-full items-center justify-between py-6 text-left transition-colors duration-300 hover:text-bronze-clair"
            aria-expanded={openIndex === index}
          >
            <span className="pr-8 font-body text-base text-ivoire md:text-lg">
              {item.question}
            </span>
            <span
              className={`shrink-0 text-lg text-bronze transition-transform duration-500 ${
                openIndex === index ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE_SMOOTH }}
                className="overflow-hidden"
              >
                <p className="pb-6 text-sm leading-relaxed text-cendre md:text-base">
                  {item.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
