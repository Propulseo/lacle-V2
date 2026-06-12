"use client";

import { useState, useEffect } from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createDocument } from "@/services/documents";
import { getLearners } from "@/services/learners";
import { useAsyncData } from "@/hooks/useAsyncData";
import { collectErrors, isBlank, type FieldErrors } from "@/lib/validation";
import { FormValidationError } from "@/lib/errors";
import type { DocumentType } from "@/types";

interface DocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const emptyForm = {
  learnerId: "",
  type: "facture" as DocumentType,
  title: "",
  fileName: "",
};

export function DocumentFormModal({ isOpen, onClose, onSuccess }: DocumentFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const learnersState = useAsyncData(() => getLearners(), []);

  useEffect(() => {
    setForm(emptyForm);
    setErrors({});
  }, [isOpen]);

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit() {
    const errs = collectErrors([
      ["learnerId", isBlank(form.learnerId), "Veuillez choisir un apprenant."],
      ["title", isBlank(form.title), "Veuillez renseigner un titre."],
      ["fileName", isBlank(form.fileName), "Veuillez renseigner le nom du fichier."],
    ]);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      throw new FormValidationError();
    }

    const learner = learnersState.data?.find((l) => l.id === form.learnerId);

    // TODO // Supabase: upload du fichier dans Storage + INSERT dans documents (fileSize reel)
    await createDocument({
      learnerId: form.learnerId,
      learnerName: learner ? `${learner.firstName} ${learner.lastName}` : "",
      type: form.type,
      title: form.title.trim(),
      fileName: form.fileName.trim(),
      fileSize: 0,
      uploadedBy: "admin",
    });
    onSuccess();
  }

  const learnerOptions = (learnersState.data ?? []).map((l) => ({
    value: l.id,
    label: `${l.firstName} ${l.lastName}`,
  }));

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Ajouter un document"
      submitLabel="Ajouter"
    >
      <Select
        label="Apprenant"
        placeholder="Choisir un apprenant..."
        error={errors.learnerId}
        options={learnerOptions}
        value={form.learnerId}
        onChange={(e) => set("learnerId", e.target.value)}
      />
      <Select
        label="Type de document"
        options={[
          { value: "facture", label: "Facture" },
          { value: "contrat", label: "Contrat" },
          { value: "attestation", label: "Attestation" },
          { value: "autre", label: "Autre" },
        ]}
        value={form.type}
        onChange={(e) => set("type", e.target.value)}
      />
      <Input
        label="Titre"
        required
        error={errors.title}
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
        placeholder="Ex: Facture — Formation PNL Praticien"
      />
      <Input
        label="Nom du fichier"
        required
        error={errors.fileName}
        value={form.fileName}
        onChange={(e) => set("fileName", e.target.value)}
        placeholder="Ex: facture-2026-001.pdf"
      />
    </FormModal>
  );
}
