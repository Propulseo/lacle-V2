import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon généré (route metadata Next.js).
 *
 * Exception aux tokens du design system : ImageResponse (next/og) rend
 * l'image hors du DOM et ne charge pas globals.css — les variables CSS
 * (--color-noir, --color-bronze) sont donc inaccessibles ici. Les valeurs
 * hexadécimales ci-dessous sont recopiées depuis `src/app/globals.css`.
 */
const NOIR = "#0B0B0B";
const BRONZE = "#B08D57";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: NOIR,
        borderRadius: 6,
      }}
    >
      {/* Symbole de la clé simplifié (cf. KeySymbol.tsx, viewBox 0 0 48 120).
          strokeWidth épaissi pour rester lisible à 32 px. */}
      <svg
        width={11}
        height={27}
        viewBox="0 0 48 120"
        fill="none"
        stroke={BRONZE}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="24" cy="18" r="14" />
        <line x1="24" y1="32" x2="24" y2="100" />
        <line x1="24" y1="78" x2="36" y2="78" />
        <line x1="24" y1="92" x2="32" y2="92" />
      </svg>
    </div>,
    { ...size },
  );
}
