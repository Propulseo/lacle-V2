"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Toast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { createSupportMessage } from "@/services/documents";

const MIN_DESCRIPTION_LENGTH = 10;

export function BugReportButton() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const tooShort = description.trim().length < MIN_DESCRIPTION_LENGTH;

  async function handleSubmit() {
    if (tooShort || !user) return;
    setError("");
    setIsLoading(true);
    try {
      // TODO // Supabase: INSERT dans bug_reports (userId, url, description, createdAt)
      // TODO // Resend: notifier contact@institutlacle.fr avec les details
      // TODO // Qualiopi Ind.31: le signalement alimente le registre des dysfonctionnements
      await createSupportMessage(
        user.id,
        `${user.firstName} ${user.lastName}`,
        "Signalement de bug",
        `Page concernée : ${pathname}\n\n${description.trim()}`
      );
      setDescription("");
      setIsOpen(false);
      setShowToast(true);
    } catch {
      setError("L'envoi du signalement a échoué. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    setDescription("");
    setError("");
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Signaler un problème"
        className="fixed bottom-20 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-filet bg-encre/80 text-cendre backdrop-blur-sm transition-colors hover:text-ivoire md:bottom-4"
      >
        <TriangleAlert className="h-4 w-4" />
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="Signaler un problème" size="md">
        <div className="space-y-4">
          <Textarea
            label="Décrivez le problème rencontré"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez ce qui ne fonctionne pas..."
            rows={4}
          />
          <p className="text-xs text-pierre">
            {MIN_DESCRIPTION_LENGTH} caractères minimum
            {tooShort && description.trim().length > 0
              ? ` — encore ${MIN_DESCRIPTION_LENGTH - description.trim().length} caractère(s)`
              : ""}
            .
          </p>
          <Input
            label="Page concernée"
            value={pathname}
            readOnly
          />
          {error && <Alert variant="error">{error}</Alert>}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={tooShort}
            >
              Envoyer le signalement
            </Button>
          </div>
        </div>
      </Modal>

      <Toast
        message="Signalement envoyé — merci, on s'en occupe !"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
