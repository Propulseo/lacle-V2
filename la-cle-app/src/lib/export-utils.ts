// TODO // Qualiopi Ind.12 : cet export est requis pour audit
// TODO // Supabase: remplacer la mock data par une query
// sur la table students + engagement_tracking

import { SITE } from "./constants";

export interface CsvExportOptions {
  /** Indicateur Qualiopi prouvé par cet export (ex. « Ind.12 — Suivi de l'engagement »). */
  qualiopiIndicator?: string;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Exporte des données en CSV, avec horodatage automatique du nom de fichier
 * et lignes de métadonnées d'audit en tête (date d'export, plateforme,
 * indicateur Qualiopi concerné).
 */
export function exportToCsv(data: object[], filename: string, options?: CsvExportOptions): void {
  if (data.length === 0) return;

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const timeStr = `${pad(now.getHours())}h${pad(now.getMinutes())}`;

  const metaRows = [
    `"Export généré le","${dateStr} ${timeStr}"`,
    `"Plateforme","${SITE.fullName} — LMS"`,
    ...(options?.qualiopiIndicator
      ? [`"Indicateur Qualiopi","${options.qualiopiIndicator}"`]
      : []),
    "",
  ];

  const headers = Object.keys(data[0]);
  const csvRows = [
    ...metaRows,
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = (row as Record<string, unknown>)[h];
          const str = val === null || val === undefined ? "" : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ];

  const baseName = filename.endsWith(".csv") ? filename.slice(0, -4) : filename;
  const stampedName = `${baseName}_${dateStr}_${timeStr}.csv`;

  // BOM (U+FEFF) pour qu'Excel ouvre le CSV en UTF-8 (accents corrects)
  const blob = new Blob([String.fromCharCode(0xfeff) + csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = stampedName;
  link.click();
  URL.revokeObjectURL(url);
}
