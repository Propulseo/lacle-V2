/**
 * Validation de formulaires — module pur, sans dépendance.
 * Les messages sont rédigés en français institutionnel et destinés à être
 * affichés sous les champs via la prop `error` des composants ui (Input,
 * Textarea, Select).
 */

export type FieldErrors = Record<string, string>;

export function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

/** Téléphone français : 0X XX XX XX XX ou +33X…, espaces, points et tirets tolérés. */
export function isValidPhoneFr(value: string): boolean {
  const digits = value.replace(/[\s.\-]/g, "");
  return /^(?:\+33|0)[1-9]\d{8}$/.test(digits);
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isPositiveInt(value: number, min = 1): boolean {
  return Number.isInteger(value) && value >= min;
}

/** Compare deux heures « HH:MM » — vrai si la fin est strictement après le début. */
export function isTimeRangeValid(start: string, end: string): boolean {
  if (!start || !end) return false;
  return end > start;
}

/** Vrai si la date ISO (YYYY-MM-DD) est aujourd'hui ou dans le futur. */
export function isTodayOrFuture(dateIso: string): boolean {
  if (!dateIso) return false;
  const now = new Date();
  const todayIso = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  return dateIso >= todayIso;
}

/** Retourne le message d'erreur si le mot de passe est trop faible, sinon null. */
export function passwordStrengthError(value: string): string | null {
  if (value.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }
  if (!/\d/.test(value)) {
    return "Le mot de passe doit contenir au moins un chiffre.";
  }
  if (!/[a-zA-Z]/.test(value)) {
    return "Le mot de passe doit contenir au moins une lettre.";
  }
  return null;
}

/**
 * Compose des vérifications en un objet d'erreurs par champ.
 * Seule la première erreur de chaque champ est retenue.
 */
export function collectErrors(
  checks: Array<[field: string, invalid: boolean, message: string]>
): FieldErrors {
  const errors: FieldErrors = {};
  for (const [field, invalid, message] of checks) {
    if (invalid && !errors[field]) {
      errors[field] = message;
    }
  }
  return errors;
}
