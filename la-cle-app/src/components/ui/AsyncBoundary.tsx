import type { ReactNode } from "react";
import type { AsyncState } from "@/hooks/useAsyncData";
import { NotFoundError } from "@/lib/errors";
import { NotFound } from "./NotFound";

interface AsyncBoundaryProps<T> {
  state: AsyncState<T>;
  /** Fallback pendant le chargement */
  loading?: ReactNode;
  /** Fallback en cas d'erreur */
  error?: (err: Error, retry: () => void) => ReactNode;
  /** Fallback si data est un tableau vide */
  empty?: ReactNode;
  children: (data: T) => ReactNode;
}

function DefaultLoading() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-or border-t-transparent" />
    </div>
  );
}

function DefaultError({ error: _error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm text-cendre">
        Une erreur est survenue lors du chargement.
      </p>
      <button
        type="button"
        onClick={retry}
        className="rounded-lg border border-filet px-4 py-2 text-sm text-or transition-colors hover:border-or/50 hover:bg-or/5"
      >
        Reessayer
      </button>
    </div>
  );
}

function DefaultEmpty() {
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-sm text-cendre">Aucune donnee disponible</p>
    </div>
  );
}

export function AsyncBoundary<T>({
  state,
  loading: loadingFallback,
  error: errorFallback,
  empty: emptyFallback,
  children,
}: AsyncBoundaryProps<T>) {
  if (state.loading) {
    return <>{loadingFallback ?? <DefaultLoading />}</>;
  }

  if (state.error) {
    if (state.error instanceof NotFoundError) {
      return <NotFound message={state.error.message} />;
    }
    return (
      <>
        {errorFallback
          ? errorFallback(state.error, state.refetch)
          : <DefaultError error={state.error} retry={state.refetch} />}
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
