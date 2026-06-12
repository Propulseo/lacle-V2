import type { Metadata } from "next";
import { Cormorant_Garamond, Libre_Franklin } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { BackgroundAtmosphere } from "@/components/layout/BackgroundAtmosphere";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const SITE_TITLE = "La Clé | Institut de compréhension des mécanismes humains";
const SITE_DESCRIPTION =
  "Institut de formation dédié à la compréhension et à la maîtrise des mécanismes humains.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.institutlacle.fr"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  // icon.tsx et opengraph-image.tsx (convention de fichiers Next.js) sont
  // référencés automatiquement — aucune déclaration manuelle nécessaire.
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "La Clé Institut",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${libreFranklin.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("la-cle-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className="font-body bg-noir text-ivoire antialiased"
      >
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
            <BackgroundAtmosphere />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-bronze focus:text-noir focus:px-4 focus:py-2 focus:text-sm"
            >
              Aller au contenu principal
            </a>
            {children}
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
