import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/constants";

const BASE_URL = "https://www.institutlacle.fr";

/** Routes exclues de l'indexation publique. */
const EXCLUDED: ReadonlyArray<string> = [
  ROUTES.accessSpace, // /acces-espace — portail LMS (proxy, non indexé)
  "/design-system", // page de démo interne
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return Object.values(ROUTES)
    .filter((path) => !EXCLUDED.includes(path))
    .map((path) => ({
      url: `${BASE_URL}${path === "/" ? "" : path}`,
      lastModified,
    }));
}
