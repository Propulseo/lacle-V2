"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "/acces-espace";

function GraduationIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function CredentialRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] text-pierre">{label}</span>
      <button
        onClick={handleCopy}
        className="group/copy flex items-center gap-1.5 rounded bg-charbon/40 px-2.5 py-1 font-body text-[12px] tracking-wide text-cendre transition-colors duration-200 hover:bg-charbon/60 hover:text-ivoire"
        title="Copier"
      >
        <span className="font-mono">{value}</span>
        {copied ? (
          <span className="text-[10px] text-bronze-clair">copié</span>
        ) : (
          <CopyIcon className="h-3 w-3 opacity-40 transition-opacity group-hover/copy:opacity-100" />
        )}
      </button>
    </div>
  );
}

export function AccesEspaceContent() {
  return (
    <div className="mx-auto w-full max-w-[820px]">
      <div className="grid gap-6 sm:grid-cols-2">
        {/* ---- ESPACE APPRENANT ---- */}
        <ScrollReveal delay={0.1}>
          <div className="card-elevated group flex h-full flex-col border border-filet bg-graphite/30 transition-all duration-500 ease-[var(--ease-institutional)] hover:border-bronze/40 hover:bg-graphite/50">
            {/* Top */}
            <div className="flex flex-col items-center px-8 pt-10 pb-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-filet transition-colors duration-500 group-hover:border-bronze/30 group-hover:bg-bronze/5">
                <GraduationIcon className="h-7 w-7 text-cendre transition-colors duration-300 group-hover:text-bronze-clair" />
              </div>
              <p className="font-display text-xl text-ivoire">Espace Apprenant</p>
              <p className="mt-2 text-sm text-cendre">
                Parcours, vidéos, examens et documents
              </p>
            </div>

            {/* Credentials */}
            <div className="mx-6 space-y-2 border-t border-filet pt-5 pb-5">
              <p className="mb-3 text-label-sm text-pierre">
                Identifiants démo
              </p>
              <CredentialRow label="Email" value="marie.dupont@email.com" />
              <CredentialRow label="Mot de passe" value="demo" />
              <p className="pt-1 text-[10px] leading-relaxed text-pierre/60">
                5 comptes disponibles — tout email d&apos;apprenant fonctionne avec 3&nbsp;caractères minimum.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-auto px-6 pb-8">
              <a
                href={`${APP_URL}/login`}
                className="flex w-full items-center justify-center gap-2 bg-bronze px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-noir transition-all duration-500 ease-[var(--ease-institutional)] hover:bg-bronze-clair"
              >
                Se connecter
                <ArrowIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* ---- ESPACE ADMINISTRATION ---- */}
        <ScrollReveal delay={0.2}>
          <div className="card-elevated group flex h-full flex-col border border-filet bg-graphite/30 transition-all duration-500 ease-[var(--ease-institutional)] hover:border-bronze/40 hover:bg-graphite/50">
            {/* Top */}
            <div className="flex flex-col items-center px-8 pt-10 pb-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-filet transition-colors duration-500 group-hover:border-bronze/30 group-hover:bg-bronze/5">
                <ShieldIcon className="h-7 w-7 text-cendre transition-colors duration-300 group-hover:text-bronze-clair" />
              </div>
              <p className="font-display text-xl text-ivoire">Administration</p>
              <p className="mt-2 text-sm text-cendre">
                Gestion apprenants, contenus et sessions
              </p>
            </div>

            {/* Credentials */}
            <div className="mx-6 space-y-2 border-t border-filet pt-5 pb-5">
              <p className="mb-3 text-label-sm text-pierre">
                Identifiants démo
              </p>
              <CredentialRow label="Email" value="admin@lacleformation.fr" />
              <CredentialRow label="Mot de passe" value="admin123" />
            </div>

            {/* CTA */}
            <div className="mt-auto px-6 pb-8">
              <a
                href={`${APP_URL}/admin/login`}
                className="flex w-full items-center justify-center gap-2 border border-filet px-6 py-3.5 text-[11px] uppercase tracking-[0.14em] text-ivoire transition-all duration-500 ease-[var(--ease-institutional)] hover:border-bronze hover:text-bronze-clair"
              >
                Se connecter
                <ArrowIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
