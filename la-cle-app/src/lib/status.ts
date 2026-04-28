import type { StudentStatus } from "@/types";

export const STATUS_CONFIG: Record<
  StudentStatus,
  { label: string; color: string; bgColor: string }
> = {
  decouverte: {
    label: "Decouverte",
    color: "text-info",
    bgColor: "bg-info/10",
  },
  inscrit: {
    label: "Inscrit",
    color: "text-succes",
    bgColor: "bg-succes/10",
  },
  bloque: {
    label: "Bloque",
    color: "text-erreur",
    bgColor: "bg-erreur/10",
  },
  certifie: {
    label: "Certifie",
    color: "text-or",
    bgColor: "bg-or/10",
  },
};

export const STATUS_HIERARCHY: StudentStatus[] = [
  "decouverte",
  "inscrit",
  "certifie",
];

export function hasAccess(
  status: StudentStatus,
  requiredStatus: StudentStatus
): boolean {
  const currentIndex = STATUS_HIERARCHY.indexOf(status);
  const requiredIndex = STATUS_HIERARCHY.indexOf(requiredStatus);
  if (currentIndex === -1 || requiredIndex === -1) return false;
  return currentIndex >= requiredIndex;
}
