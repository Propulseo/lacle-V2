"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { BackgroundAtmosphere } from "@/components/layout/BackgroundAtmosphere";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/espace");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) return null;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <BackgroundAtmosphere />
      <div className="w-full max-w-sm space-y-8 text-center">
        <div>
          <h1 className="font-serif text-4xl text-or">{SITE.name}</h1>
          <p className="mt-2 text-sm text-cendre">{SITE.tagline}</p>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => router.push("/login")}
          >
            Se connecter
          </Button>

          <p className="text-xs text-cendre">
            Pas encore inscrit ?{" "}
            <Link
              href="/inscription"
              className="text-or underline underline-offset-2 hover:text-or/80"
            >
              Commencer ici
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
