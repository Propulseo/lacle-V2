"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { createLearnerAction } from "../actions";
import { ROUTES } from "@/lib/constants";
import {
  collectErrors,
  isBlank,
  isValidEmail,
  isValidPhoneFr,
  type FieldErrors,
} from "@/lib/validation";

export default function NouvelApprenantPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [created, setCreated] = useState<{ learnerId: string; tempPassword: string } | null>(null);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const errs = collectErrors([
      ["firstName", isBlank(form.firstName), "Veuillez renseigner un prénom."],
      ["lastName", isBlank(form.lastName), "Veuillez renseigner un nom."],
      ["email", !isValidEmail(form.email), "Veuillez renseigner une adresse email valide."],
      ["phone", !isBlank(form.phone) && !isValidPhoneFr(form.phone), "Veuillez renseigner un numéro de téléphone français valide."],
    ]);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      const result = await createLearnerAction({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      setCreated(result);
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
            Un mot de passe temporaire est généré automatiquement.
          </p>
        </div>

        {created ? (
          <Card>
            <div className="space-y-4">
              <Alert variant="success">Compte créé avec succès.</Alert>
              <p className="text-sm text-cendre">
                Communiquez ces identifiants à l&apos;apprenant (mot de passe à changer à la première connexion) :
              </p>
              <div className="rounded-lg border border-filet bg-nuit/40 p-4 text-sm">
                <p className="text-pierre">Email</p>
                <p className="mb-3 font-mono text-ivoire">{form.email.trim().toLowerCase()}</p>
                <p className="text-pierre">Mot de passe temporaire</p>
                <p className="font-mono text-or">{created.tempPassword}</p>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => router.push(ROUTES.admin.apprenants)}>
                  Liste des apprenants
                </Button>
                <Link href={ROUTES.admin.apprenant(created.learnerId)}>
                  <Button type="button" variant="primary">Voir la fiche</Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <>
            {error && <Alert variant="error">{error}</Alert>}
            <Card>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Prénom"
                    value={form.firstName}
                    error={fieldErrors.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    required
                  />
                  <Input
                    label="Nom"
                    value={form.lastName}
                    error={fieldErrors.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    required
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  value={form.email}
                  error={fieldErrors.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
                <Input
                  label="Téléphone"
                  type="tel"
                  value={form.phone}
                  error={fieldErrors.phone}
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
          </>
        )}
      </div>
    </AdminShell>
  );
}
