"use client";

import { Button } from "@/components/ui/Button";

/**
 * Error boundary de route (vitrine). Affiche un ecran de marque avec
 * possibilite de reessayer. Le contenu CMS ne leve jamais (fallback), donc
 * cette frontiere couvre surtout les erreurs de rendu inattendues.
 */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-noir px-6 text-center"
    >
      <p className="text-label tracking-[0.25em] text-bronze/70">Erreur</p>
      <h1 className="font-display text-3xl text-ivoire md:text-4xl">
        Une erreur est survenue
      </h1>
      <p className="max-w-md leading-relaxed text-cendre">
        Quelque chose s&apos;est mal passé de notre côté. Vous pouvez réessayer ou
        revenir à l&apos;accueil.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button variant="elegant" onClick={reset}>
          Réessayer
        </Button>
        <Button variant="ghost" href="/">
          Retour à l&apos;accueil
        </Button>
      </div>
    </main>
  );
}
