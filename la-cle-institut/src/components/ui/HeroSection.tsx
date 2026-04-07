"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  label?: string;
  decorativeLine?: boolean;
  children?: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export function HeroSection({
  title,
  subtitle,
  label,
  decorativeLine = false,
  children,
  className = "",
  fullHeight = false,
}: HeroSectionProps) {
  return (
    <section
      className={`flex flex-col justify-center ${
        fullHeight
          ? "min-h-screen"
          : "pb-20 pt-32 md:pb-28 md:pt-40"
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-16">
        {label && (
          <ScrollReveal>
            <p className="mb-5 text-label tracking-[0.3em] text-bronze">
              {label}
            </p>
          </ScrollReveal>
        )}
        <ScrollReveal delay={label ? 0.1 : 0}>
          <h1 className="max-w-4xl font-display text-4xl text-ivoire md:text-5xl lg:text-6xl xl:text-7xl">
            {title}
          </h1>
        </ScrollReveal>
        {decorativeLine && (
          <ScrollReveal delay={0.2}>
            <div
              className="mt-8 h-px w-20 bg-gradient-to-r from-bronze/60 to-transparent"
              aria-hidden="true"
            />
          </ScrollReveal>
        )}
        {subtitle && (
          <ScrollReveal delay={decorativeLine ? 0.3 : 0.1}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-cendre md:text-xl">
              {subtitle}
            </p>
          </ScrollReveal>
        )}
        {children}
      </div>
    </section>
  );
}
