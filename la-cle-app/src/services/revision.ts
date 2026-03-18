import { mockRevisionResources } from "@/data/mock/revision";
import type { RevisionResource } from "@/types";
import { sleep, generateId } from "@/lib/utils";

const resources = [...mockRevisionResources];

export async function getRevisionResources(): Promise<RevisionResource[]> {
  await sleep(300);
  return [...resources];
}

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

export async function deleteRevisionResource(id: string): Promise<void> {
  await sleep(300);
  const idx = resources.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Ressource non trouvée");
  resources.splice(idx, 1);
}
