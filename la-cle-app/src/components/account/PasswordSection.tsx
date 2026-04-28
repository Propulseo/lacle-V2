"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { changePassword } from "@/services/auth";

interface PasswordSectionProps {
  userId: string;
}

export function PasswordSection({ userId }: PasswordSectionProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres");
      return;
    }
    await changePassword(userId, newPassword);
    setSaved(true);
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <Lock className="h-5 w-5 text-or" />
        <h2 className="font-serif text-lg text-ivoire">Changer le mot de passe</h2>
      </div>
      {saved && <Alert variant="success" className="mb-4">Mot de passe modifie.</Alert>}
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="Nouveau mot de passe" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <Input label="Confirmer" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <Button type="submit" variant="primary" size="sm">Modifier</Button>
      </form>
    </Card>
  );
}
