import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { BackgroundAtmosphere } from "@/components/layout/BackgroundAtmosphere";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "La Clé — Institut de compréhension des mécanismes humains",
  description:
    "Institut de formation dédié à la compréhension et à la maîtrise des mécanismes humains.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${cormorant.variable} ${dmSans.variable} font-body bg-noir text-ivoire antialiased`}
      >
        <BackgroundAtmosphere />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-bronze focus:text-noir focus:px-4 focus:py-2 focus:text-sm"
        >
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  );
}
