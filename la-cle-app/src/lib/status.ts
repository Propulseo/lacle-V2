export type LearnerStatusType =
  | "en_cours"
  | "valide"
  | "certifie"
  | "abandonne"
  | "suspendu";

export const STATUS_CONFIG: Record<
  LearnerStatusType,
  { label: string; color: string; bgColor: string }
> = {
  en_cours: {
    label: "En cours",
    color: "text-info",
    bgColor: "bg-info/10",
  },
  valide: {
    label: "Validé",
    color: "text-succes",
    bgColor: "bg-succes/10",
  },
  certifie: {
    label: "Certifié",
    color: "text-or",
    bgColor: "bg-or/10",
  },
  abandonne: {
    label: "Abandonné",
    color: "text-erreur",
    bgColor: "bg-erreur/10",
  },
  suspendu: {
    label: "Suspendu",
    color: "text-attention",
    bgColor: "bg-attention/10",
  },
};

export const STATUS_HIERARCHY: LearnerStatusType[] = [
  "en_cours",
  "valide",
  "certifie",
];

export function hasAccess(
  status: LearnerStatusType,
  requiredStatus: LearnerStatusType
): boolean {
  const currentIndex = STATUS_HIERARCHY.indexOf(status);
  const requiredIndex = STATUS_HIERARCHY.indexOf(requiredStatus);
  if (currentIndex === -1 || requiredIndex === -1) return false;
  return currentIndex >= requiredIndex;
}
