"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

export function DropdownMenu({ trigger, items, align = "right" }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>{trigger}</button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-2 min-w-[180px] rounded-lg border border-filet bg-encre py-1 shadow-xl ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors ${
                  item.danger
                    ? "text-erreur hover:bg-erreur/10"
                    : "text-cendre hover:bg-ivoire/5 hover:text-ivoire"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
