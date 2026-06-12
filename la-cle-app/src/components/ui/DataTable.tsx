"use client";

import { useState, type ReactNode } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "./Pagination";

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  sortValue?: (item: T) => string | number;
  className?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  /** Rendu riche affiché quand data est vide (prioritaire sur emptyMessage). */
  emptyState?: ReactNode;
  /** Active la pagination côté client. Absent = comportement inchangé. */
  pageSize?: number;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  emptyMessage = "Aucune donnée",
  emptyState,
  pageSize,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return 0;
    const aVal = col.sortValue(a);
    const bVal = col.sortValue(b);
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  // Clamp : si les données rétrécissent (filtre), on reste sur une page valide sans useEffect.
  const totalPages = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const currentPage = Math.min(page, totalPages);
  const paged = pageSize
    ? sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sorted;

  if (data.length === 0) {
    if (emptyState) return <>{emptyState}</>;
    return (
      <div className="py-12 text-center text-cendre">{emptyMessage}</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-filet">
        <table className="w-full text-sm">
          <thead className="sticky top-0 border-b border-filet bg-surface">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-cendre",
                    col.sortable && "cursor-pointer select-none hover:text-ivoire",
                    col.hideOnMobile && "hidden md:table-cell",
                    col.className
                  )}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      sortDir === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-filet/50">
            {paged.map((item) => (
              <tr
                key={keyExtractor(item)}
                className={cn(
                  "transition-colors",
                  onRowClick && "cursor-pointer hover:bg-ivoire/[0.03]"
                )}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-ivoire",
                      col.hideOnMobile && "hidden md:table-cell",
                      col.className
                    )}
                  >
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageSize !== undefined && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
