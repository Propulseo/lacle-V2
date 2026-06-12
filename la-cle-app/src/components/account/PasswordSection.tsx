"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { changePassword } from "@/services/auth";
import { passwordStrengthError, type FieldErrors } from "@/lib/validation";

interface PasswordSectionProps {
  userId: string;
}

export function PasswordSection({ userId }: PasswordSectionProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const errs: FieldErrors = {};
    const strengthError = passwordStrengthError(newPassword);
    if (strengthError) errs.newPassword = strengthError;
    if (newPassword !== confirmPassword) {
      errs.confirmPassword = "Les mots de passe ne correspondent pas.";
    }
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(userId, newPassword);
      setSaved(true);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("La modification du mot de passe a échoué. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <Lock className="h-5 w-5 text-or" />
        <h2 className="font-serif text-lg text-ivoire">Changer le mot de passe</h2>
      </div>
      {saved && <Alert variant="success" className="mb-4">Mot de passe modifié.</Alert>}
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Nouveau mot de passe"
          type="password"
          value={newPassword}
          error={fieldErrors.newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            clearFieldError("newPassword");
          }}
          required
        />
        <p className="text-xs text-pierre">
          8 caractères minimum, avec au moins une lettre et un chiffre.
        </p>
        <Input
          label="Confirmer"
          type="password"
          value={confirmPassword}
          error={fieldErrors.confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            clearFieldError("confirmPassword");
          }}
          required
        />
        <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
          Modifier
        </Button>
      </form>
    </Card>
  );
}
