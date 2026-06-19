import type { NextConfig } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

// En-tetes de securite HTTP appliques a toutes les reponses. SAMEORIGIN cote
// vitrine (publique). CSP a ajouter en Report-Only apres audit des inline.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async rewrites() {
    if (!appUrl) {
      console.warn(
        "[la-cle-institut] NEXT_PUBLIC_APP_URL non défini — rewrites vers la-cle-app désactivés"
      );
      return [];
    }

    return [
      {
        source: "/acces-espace",
        destination: `${appUrl}/acces-espace`,
      },
      {
        source: "/acces-espace/:path*",
        destination: `${appUrl}/acces-espace/:path*`,
      },
    ];
  },
};

export default nextConfig;
