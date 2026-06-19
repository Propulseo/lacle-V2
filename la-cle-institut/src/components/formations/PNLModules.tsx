"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { PnlModule } from "@/lib/pnl-content";

export function PNLModules({ modules }: { modules: PnlModule[] }) {
  return (
    <div>
      <div className="mb-16 flex items-end justify-between">
        <div>
          <p className="mb-2 text-label text-bronze">
            Phase distancielle
          </p>
          <h2>7 modules structur&eacute;s</h2>
        </div>
        <span className="hidden font-display text-6xl font-light text-ivoire/[0.04] md:block lg:text-7xl">
          07
        </span>
      </div>

      {/* Timeline layout */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-[1.1rem] top-2 bottom-2 w-px bg-filet md:left-[1.6rem]"
          aria-hidden="true"
        />

        <div className="space-y-0">
          {modules.map((mod, i) => (
            <ScrollReveal key={i} delay={i * 0.06}>
              <div className="group relative flex gap-6 py-6 md:gap-10 md:py-8">
                {/* Node */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-filet bg-noir transition-all duration-500 group-hover:border-bronze/40 group-hover:bg-ardoise md:h-13 md:w-13">
                    <span className="font-display text-sm text-pierre transition-colors duration-500 group-hover:text-bronze md:text-base">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 pt-1 md:pt-2">
                  <h4 className="font-display text-xl text-ivoire transition-colors duration-500 group-hover:text-bronze-clair md:text-2xl">
                    {mod.title}
                  </h4>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-cendre/60 transition-colors duration-500 group-hover:text-cendre">
                    {mod.description}
                  </p>

                  {/* Accent line on hover */}
                  <div className="mt-4 h-px w-0 bg-bronze/30 transition-all duration-500 group-hover:w-12" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
