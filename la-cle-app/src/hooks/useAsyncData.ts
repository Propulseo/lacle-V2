import { useCallback, useEffect, useRef, useState, type DependencyList } from "react";

/**
 * Generic hook for fetching async data with loading/error states.
 *
 * Replaces the `useState(null) + useEffect + .then(set)` pattern
 * with built-in error handling and race-condition protection via AbortController.
 *
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useAsyncData(
 *   () => getLearner(user!.id),
 *   [user?.id]
 * );
 *
 * return (
 *   <AsyncBoundary state={{ data, loading, error, refetch }}>
 *     {(learner) => <div>{learner.firstName}</div>}
 *   </AsyncBoundary>
 * );
 * ```
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const counterRef = useRef(0);

  const execute = useCallback(() => {
    const id = ++counterRef.current;
    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (id === counterRef.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (id === counterRef.current) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}
