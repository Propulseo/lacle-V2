"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Alert } from "./Alert";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  /** Message affiché si onConfirm échoue. */
  errorMessage?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "danger",
  errorMessage = "L'opération a échoué. Veuillez réessayer.",
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  async function handleConfirm() {
    setConfirmError(null);
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      setConfirmError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setConfirmError(null);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="sm">
      <div className="space-y-4">
        {variant === "danger" && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-erreur/10">
            <AlertTriangle className="h-6 w-6 text-erreur" />
          </div>
        )}
        <p className="text-sm text-cendre">{message}</p>
        {confirmError && <Alert variant="error">{confirmError}</Alert>}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            size="sm"
            isLoading={loading}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
