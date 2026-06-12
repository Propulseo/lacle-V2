"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Alert } from "./Alert";
import { FormValidationError } from "@/lib/errors";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
  title: string;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  size?: "sm" | "md" | "lg";
}

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitLabel = "Enregistrer",
  cancelLabel = "Annuler",
  size = "md",
}: FormModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setLoading(true);
    try {
      await onSubmit();
      onClose();
    } catch (err) {
      // FormValidationError : les erreurs par champ sont déjà affichées inline.
      if (!(err instanceof FormValidationError)) {
        setSubmitError(
          "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setSubmitError(null);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size={size}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
        {submitError && <Alert variant="error">{submitError}</Alert>}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={loading} type="button">
            {cancelLabel}
          </Button>
          <Button variant="primary" size="sm" isLoading={loading} type="submit">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
