"use client";

import { LearnerHeader } from "./LearnerHeader";
import { LearnerMobileNav } from "./LearnerMobileNav";
import { BackgroundAtmosphere } from "./BackgroundAtmosphere";

interface LearnerShellProps {
  children: React.ReactNode;
}

export function LearnerShell({ children }: LearnerShellProps) {
  return (
    <div className="min-h-screen">
      <BackgroundAtmosphere />
      <LearnerHeader />
      <main className="mx-auto max-w-5xl px-4 py-6 pb-20 sm:px-6 md:pb-6">
        {children}
      </main>
      <LearnerMobileNav />
    </div>
  );
}
