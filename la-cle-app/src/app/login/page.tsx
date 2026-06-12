"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { BackgroundAtmosphere } from "@/components/layout/BackgroundAtmosphere";
import { DEMO_ACCOUNTS } from "@/services/auth";
import { SITE } from "@/lib/constants";
import { isValidEmail } from "@/lib/validation";

export default function LearnerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginLearner } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setEmailError("Veuillez renseigner une adresse email valide.");
      return;
    }

    setIsLoading(true);
    try {
      await loginLearner(email.trim(), password);
      router.replace("/espace");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  }

  function fillDemo(account: "learner" | "decouverte") {
    setEmail(DEMO_ACCOUNTS[account].email);
    setPassword(DEMO_ACCOUNTS[account].password);
    setEmailError("");
    setError("");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <BackgroundAtmosphere />
      <div className="w-full max-w-md rounded-xl border border-filet bg-encre/80 p-8 backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl text-or">{SITE.name}</h1>
          <p className="mt-2 text-sm text-cendre">Espace apprenant</p>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            error={emailError || undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            placeholder="votre@email.com"
            required
          />
          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full"
          >
            Se connecter
          </Button>
        </form>

        {/* Acces rapide demo — a supprimer lors du branchement Supabase Auth */}
        <div className="mt-6 border-t border-filet pt-4">
          <p className="text-center text-xs text-pierre">Connexion rapide (démo)</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => fillDemo("learner")}>
              Apprenant inscrit
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => fillDemo("decouverte")}>
              Mode découverte
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-pierre">
          Vos identifiants vous ont été communiqués par l&apos;institut.
        </p>

        <p className="mt-3 text-center text-xs text-cendre">
          Pas encore inscrit ?{" "}
          <Link href="/inscription" className="text-or underline underline-offset-2 hover:text-or/80">
            Commencer ici
          </Link>
        </p>
      </div>
    </div>
  );
}
