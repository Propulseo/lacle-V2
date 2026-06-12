import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const alt = `La Clé Institut — ${SITE.baseline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Image Open Graph générée (route metadata Next.js, 1200×630).
 *
 * Exception aux tokens du design system : ImageResponse (next/og) rend
 * l'image hors du DOM et ne charge pas globals.css — les variables CSS
 * (--color-noir, --color-ivoire, etc.) sont donc inaccessibles ici.
 * Les valeurs hexadécimales ci-dessous sont recopiées depuis
 * `src/app/globals.css` (thème sombre).
 */
const NOIR = "#0B0B0B";
const NUIT = "#0e162a";
const IVOIRE = "#F5F0EB";
const CENDRE = "#A09A93";
const BRONZE = "#B08D57";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: NOIR,
        backgroundImage: `radial-gradient(ellipse 70% 60% at 50% 35%, ${NUIT}, ${NOIR})`,
        fontFamily: "Georgia, serif",
      }}
    >
      {/* Symbole de la clé (cf. KeySymbol.tsx) */}
      <svg
        width={52}
        height={130}
        viewBox="0 0 48 120"
        fill="none"
        stroke={BRONZE}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="24" cy="18" r="14" />
        <line x1="24" y1="32" x2="24" y2="100" />
        <line x1="24" y1="78" x2="36" y2="78" />
        <line x1="24" y1="92" x2="32" y2="92" />
      </svg>

      <div
        style={{
          marginTop: 44,
          fontSize: 84,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: IVOIRE,
        }}
      >
        La Clé Institut
      </div>

      {/* Filet bronze de séparation */}
      <div
        style={{
          marginTop: 36,
          width: 110,
          height: 1,
          backgroundColor: BRONZE,
        }}
      />

      <div
        style={{
          marginTop: 36,
          fontSize: 34,
          fontStyle: "italic",
          color: CENDRE,
        }}
      >
        {SITE.baseline}
      </div>

      <div
        style={{
          marginTop: 56,
          fontSize: 17,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: BRONZE,
        }}
      >
        {SITE.tagline}
      </div>
    </div>,
    { ...size },
  );
}
