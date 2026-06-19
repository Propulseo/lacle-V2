import type { NextConfig } from "next";

// En-tetes de securite HTTP appliques a toutes les reponses. CSP volontairement
// omise ici (necessite un audit fin des scripts/styles inline + un report-uri) :
// a ajouter en Content-Security-Policy-Report-Only apres tests.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  basePath: "/acces-espace",
  assetPrefix: "/acces-espace",
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
