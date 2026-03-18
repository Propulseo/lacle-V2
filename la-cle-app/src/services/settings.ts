import { mockSettings } from "@/data/mock/settings";
import type { Settings } from "@/types";
import { sleep } from "@/lib/utils";

let settings = { ...mockSettings };

export async function getSettings(): Promise<Settings> {
  await sleep(200);
  return { ...settings };
}

export async function updateSettings(data: Partial<Settings>): Promise<Settings> {
  await sleep(300);
  settings = { ...settings, ...data };
  return { ...settings };
}
