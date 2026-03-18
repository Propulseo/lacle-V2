"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { BackgroundAtmosphere } from "@/components/layout/BackgroundAtmosphere";
import { SITE } from "@/lib/constants";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await loginAdmin(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <BackgroundAtmosphere />
      <div className="w-full max-w-md rounded-xl border border-filet bg-encre/80 p-8 backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl text-or">{SITE.name}</h1>
          <p className="mt-2 text-sm text-cendre">Administration</p>
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@lacleformation.fr"
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

        <p className="mt-6 text-center text-xs text-pierre">
          Accès réservé aux administrateurs
        </p>
      </div>
    </div>
  );
}
