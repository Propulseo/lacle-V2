"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && items.length > 0) {
      setFocusedIndex(0);
      requestAnimationFrame(() => itemRefs.current[0]?.focus());
    } else {
      setFocusedIndex(-1);
    }
  }, [isOpen, items.length]);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true);
    }
  }

  function handleMenuKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = (focusedIndex + 1) % items.length;
        setFocusedIndex(next);
        itemRefs.current[next]?.focus();
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = (focusedIndex - 1 + items.length) % items.length;
        setFocusedIndex(prev);
        itemRefs.current[prev]?.focus();
        break;
      }
      case "Home": {
        e.preventDefault();
        setFocusedIndex(0);
        itemRefs.current[0]?.focus();
        break;
      }
      case "End": {
        e.preventDefault();
        const last = items.length - 1;
        setFocusedIndex(last);
        itemRefs.current[last]?.focus();
        break;
      }
      case "Escape": {
        e.preventDefault();
        close();
        break;
      }
      case "Tab": {
        close();
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        if (focusedIndex >= 0) {
          items[focusedIndex].onClick();
          close();
        }
        break;
      }
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            onKeyDown={handleMenuKeyDown}
            className={`absolute z-50 mt-2 min-w-[180px] rounded-lg border border-filet bg-encre py-1 shadow-xl ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {items.map((item, i) => (
              <button
                key={item.label}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="menuitem"
                type="button"
                tabIndex={-1}
                onClick={() => {
                  item.onClick();
                  close();
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
