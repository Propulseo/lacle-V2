/**
 * Titres masques — Methode La Cle.
 *
 * En premiere lecture, l'apprenant ne voit que le code (ex. "1A1").
 * Apres completion, le titre devient visible.
 */

export function getCapsuleDisplayName(
  code: string,
  title: string | undefined,
  isCompleted: boolean
): string {
  return isCompleted && title ? title : code;
}

// Exemples :
// getCapsuleDisplayName('1A1', 'Introduction a la PNL', false)
// -> '1A1'
// getCapsuleDisplayName('1A1', 'Introduction a la PNL', true)
// -> 'Introduction a la PNL'
