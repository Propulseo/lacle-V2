"use client";

import { motion } from "framer-motion";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { useSplashSession } from "@/components/splash/useSplashSession";
import { FooterMinimal } from "@/components/layout/FooterMinimal";
import { Button } from "@/components/ui/Button";
import { KeySymbol } from "@/components/splash/KeySymbol";
import { SITE, ROUTES } from "@/lib/constants";
import { EASE_INSTITUTIONAL } from "@/lib/animations";

export function HomeContent() {
  const { showSplash, isReady, completeSplash } = useSplashSession();

  if (!isReady) {
    return <div className="min-h-screen" />;
  }

  return (
    <>
      <SplashScreen isVisible={showSplash} onComplete={completeSplash} />
      <div className="flex min-h-screen flex-col">
        <main id="main-content" className="flex flex-1 flex-col items-center justify-center px-6">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: showSplash ? 0 : 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: EASE_INSTITUTIONAL }}
          >
            <KeySymbol className="mb-10 h-16 w-auto text-ivoire/20" animate={false} />
            <h1 className="mb-4 font-serif text-5xl text-ivoire md:text-6xl lg:text-7xl">
              {SITE.name}
            </h1>
            <p className="mb-16 max-w-lg text-lg text-cendre md:text-xl">
              {SITE.tagline}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button href={ROUTES.discover} size="large">
                Nous découvrir
              </Button>
              <Button href={ROUTES.formations} size="large">
                Catalogue des formations
              </Button>
              <Button href={ROUTES.accessSpace} size="large">
                Espace apprenant
              </Button>
            </div>
          </motion.div>
        </main>
        <FooterMinimal />
      </div>
    </>
  );
}
