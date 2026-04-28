import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { DemoBanner } from "@/components/layout/DemoBanner";
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
  title: "La Clé — Espace de formation",
  description:
    "Plateforme de formation de l'Institut La Clé — Espace apprenant et administration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${cormorant.variable} ${dmSans.variable} font-body bg-nuit text-ivoire antialiased`}
      >
        <AuthProvider>
          <DemoBanner />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
