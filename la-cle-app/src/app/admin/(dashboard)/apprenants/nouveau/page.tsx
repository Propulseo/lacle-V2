"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { createLearner } from "@/services/learners";
import { ROUTES } from "@/lib/constants";

export default function NouvelApprenantPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const learner = await createLearner(form);
      router.push(ROUTES.admin.apprenant(learner.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AdminShell
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Apprenants", href: "/admin/apprenants" },
        { label: "Nouveau" },
      ]}
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-serif text-2xl text-ivoire">Nouvel apprenant</h1>
          <p className="mt-1 text-sm text-cendre">
            Un mot de passe temporaire sera généré automatiquement.
          </p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Prénom"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                required
              />
              <Input
                label="Nom"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                required
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />
            <Input
              label="Téléphone"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Annuler
              </Button>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Créer l&apos;apprenant
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminShell>
  );
}
