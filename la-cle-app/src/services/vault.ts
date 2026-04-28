import { mockVaultDocuments } from "@/data/mock/vault";
import type { VaultDocument, DocumentCategory } from "@/types";
import { sleep } from "@/lib/utils";

// TODO // Supabase: SELECT * FROM vault_documents WHERE student_id = $userId

/**
 * Recupere tous les documents du coffre personnel de l'apprenant.
 *
 * @returns Tableau des documents du coffre (5 categories)
 */
export async function getVaultDocuments(): Promise<VaultDocument[]> {
  await sleep(300);
  return [...mockVaultDocuments];
}

/**
 * Recupere les documents du coffre filtres par categorie.
 *
 * @param category - Categorie de documents (contractuels, financiers, pedagogiques, qualite, pratiques)
 * @returns Documents de la categorie demandee
 */
export async function getVaultDocumentsByCategory(
  category: DocumentCategory
): Promise<VaultDocument[]> {
  await sleep(200);
  return mockVaultDocuments.filter((d) => d.category === category);
}
