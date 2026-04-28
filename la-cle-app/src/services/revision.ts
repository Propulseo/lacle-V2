import { mockRevisionResources } from "@/data/mock/revision";
import type { RevisionResource } from "@/types";
import { sleep, generateId } from "@/lib/utils";

const resources = [...mockRevisionResources];

/**
 * Recupere toutes les ressources du coffre de revision (fiches, questions, videos).
 *
 * @returns Tableau des ressources de revision
 */
export async function getRevisionResources(): Promise<RevisionResource[]> {
  await sleep(300);
  return [...resources];
}

/**
 * Cree une nouvelle ressource de revision.
 *
 * @param data - Donnees de la ressource (sans id ni createdAt)
 * @returns La ressource creee
 */
export async function createRevisionResource(
  data: Omit<RevisionResource, "id" | "createdAt">
): Promise<RevisionResource> {
  await sleep(400);
  const resource: RevisionResource = {
    ...data,
    id: `rev-${generateId()}`,
    createdAt: new Date().toISOString(),
  };
  resources.push(resource);
  return resource;
}

/**
 * Met a jour une ressource de revision existante.
 *
 * @param id - Identifiant de la ressource
 * @param data - Champs a modifier
 * @returns La ressource mise a jour
 * @throws Si la ressource n'existe pas
 */
export async function updateRevisionResource(
  id: string,
  data: Partial<RevisionResource>
): Promise<RevisionResource> {
  await sleep(300);
  const idx = resources.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Ressource non trouvée");
  resources[idx] = { ...resources[idx], ...data };
  return resources[idx];
}

/**
 * Supprime une ressource de revision.
 *
 * @param id - Identifiant de la ressource
 * @throws Si la ressource n'existe pas
 */
export async function deleteRevisionResource(id: string): Promise<void> {
  await sleep(300);
  const idx = resources.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Ressource non trouvée");
  resources.splice(idx, 1);
}
