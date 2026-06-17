"use client";

import { FAQAccordion } from "@/components/ui/FAQAccordion";
import type { FaqItem } from "@/lib/pnl-content";

export function PNLFAQ({ items }: { items: FaqItem[] }) {
  return (
    <div>
      <h2 className="mb-10">Questions fréquentes</h2>
      <div className="max-w-2xl">
        <FAQAccordion items={items} />
      </div>
    </div>
  );
}
