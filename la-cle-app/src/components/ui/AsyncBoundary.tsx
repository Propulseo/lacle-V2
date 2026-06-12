import type { ReactNode } from "react";
import type { AsyncState } from "@/hooks/useAsyncData";
import { NotFoundError } from "@/lib/errors";
import { NotFound } from "./NotFound";

interface AsyncBoundaryProps<T> {
  state: AsyncState<T>;
  /** Fallback pendant le chargement */
  loading?: ReactNode;
  /** Libellé contextualisé du chargement (ex. « Chargement de votre parcours… ») */
  loadingLabel?: string;
  /** Fallback en cas d'erreur */
  error?: (err: Error, retry: () => void) => ReactNode;
  /** Libellé contextualisé de l'erreur (ex. « Impossible de charger vos documents. ») */
  errorLabel?: string;
  /** Fallback si data est un tableau vide */
  empty?: ReactNode;
  children: (data: T) => ReactNode;
}

function DefaultLoading({ label }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-64 flex-col items-center justify-center gap-3"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-or border-t-transparent" />
      {label ? (
        <p className="text-sm text-cendre">{label}</p>
      ) : (
        <span className="sr-only">Chargement en cours</span>
      )}
    </div>
  );
}

function DefaultError({
  label,
  retry,
}: {
  label?: string;
  retry: () => void;
}) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm text-cendre">
        {label ?? "Une erreur est survenue lors du chargement."}
      </p>
      <button
        type="button"
        onClick={retry}
        className="rounded-lg border border-filet px-4 py-2 text-sm text-or transition-colors hover:border-or/50 hover:bg-or/5"
      >
        Réessayer
      </button>
    </div>
  );
}

function DefaultEmpty() {
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-sm text-cendre">Aucune donnée disponible</p>
    </div>
  );
}

export function AsyncBoundary<T>({
  state,
  loading: loadingFallback,
  loadingLabel,
  error: errorFallback,
  errorLabel,
  empty: emptyFallback,
  children,
}: AsyncBoundaryProps<T>) {
  if (state.loading) {
    return <>{loadingFallback ?? <DefaultLoading label={loadingLabel} />}</>;
  }

  if (state.error) {
    if (state.error instanceof NotFoundError) {
      return <NotFound message={state.error.message} />;
    }
    return (
      <>
        {errorFallback
          ? errorFallback(state.error, state.refetch)
          : <DefaultError label={errorLabel} retry={state.refetch} />}
      </>
    );
  }

  if (state.data === null || state.data === undefined) {
    return <>{emptyFallback ?? <DefaultEmpty />}</>;
  }

  if (Array.isArray(state.data) && state.data.length === 0) {
    return <>{emptyFallback ?? <DefaultEmpty />}</>;
  }

  return <>{children(state.data)}</>;
}
