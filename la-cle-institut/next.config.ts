import type { NextConfig } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const nextConfig: NextConfig = {
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
