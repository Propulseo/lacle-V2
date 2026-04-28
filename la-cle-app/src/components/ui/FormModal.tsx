"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading} type="button">
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
