import type { MetadataRoute } from "next";

const BASE_URL = "https://www.institutlacle.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/acces-espace", "/design-system"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
