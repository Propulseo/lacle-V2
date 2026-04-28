"use client";

import { ArrowLeft, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-erreur/10">
          <span className="font-serif text-2xl text-erreur">!</span>
        </div>

        <div>
          <h1 className="font-serif text-2xl text-ivoire">Erreur dans l&apos;espace admin</h1>
          <p className="mt-2 text-sm text-cendre">
            Un probleme est survenu. Vous pouvez reessayer ou revenir au dashboard.
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
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg border border-filet px-5 py-2.5 text-sm text-cendre transition-colors hover:border-filet-accent hover:text-ivoire"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au dashboard
          </a>
        </div>

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
