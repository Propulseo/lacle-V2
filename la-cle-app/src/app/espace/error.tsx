"use client";

import { ArrowLeft, RefreshCw, Mail } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function EspaceError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-erreur/10">
          <span className="font-serif text-2xl text-erreur">!</span>
        </div>

        <div>
          <h1 className="font-serif text-2xl text-ivoire">Une erreur est survenue</h1>
          <p className="mt-2 text-sm text-cendre">
            Nous sommes desoles, quelque chose ne s&apos;est pas passe comme prevu.
            Vous pouvez reessayer ou revenir a votre espace.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-or bg-or/10 px-5 py-2.5 text-sm font-medium text-or transition-colors hover:bg-or/20"
          >
            <RefreshCw className="h-4 w-4" />
            Reessayer
          </button>
          <a
            href="/espace"
            className="inline-flex items-center gap-2 rounded-lg border border-filet px-5 py-2.5 text-sm text-cendre transition-colors hover:border-filet-accent hover:text-ivoire"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour a l&apos;espace
          </a>
        </div>

        <a
          href="mailto:contact@institutlacle.fr"
          className="inline-flex items-center gap-1 text-xs text-pierre transition-colors hover:text-cendre"
        >
          <Mail className="h-3 w-3" />
          Nous signaler le probleme
        </a>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 rounded-lg border border-filet bg-surface p-4 text-left">
            <summary className="cursor-pointer text-xs text-pierre">Details de l&apos;erreur (dev)</summary>
            <pre className="mt-2 overflow-auto text-xs text-erreur">{error.message}</pre>
            {error.digest && <p className="mt-1 text-xs text-pierre">Digest: {error.digest}</p>}
          </details>
        )}
      </div>
    </div>
  );
}
