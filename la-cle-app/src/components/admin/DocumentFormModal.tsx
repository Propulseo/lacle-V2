"use client";

import { useState, useEffect } from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FileUploadZone } from "@/components/ui/FileUploadZone";
import { getLearners } from "@/services/learners";
import { uploadLearnerDocumentAction } from "@/app/admin/(dashboard)/documents/actions";
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
};

export function DocumentFormModal({ isOpen, onClose, onSuccess }: DocumentFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const learnersState = useAsyncData(() => getLearners(), []);

  useEffect(() => {
    setForm(emptyForm);
    setFile(null);
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
      ["file", file === null, "Veuillez joindre un fichier."],
    ]);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      throw new FormValidationError();
    }

    // Upload reel dans Storage (bucket prive user-uploads) + INSERT, via Server Action staff.
    const fd = new FormData();
    fd.set("learnerId", form.learnerId);
    fd.set("type", form.type);
    fd.set("title", form.title.trim());
    fd.set("file", file as File);
    await uploadLearnerDocumentAction(fd);
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
      <div>
        <FileUploadZone
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          label="Glissez le document ici ou cliquez pour parcourir"
          onFiles={(files) => {
            setFile(files[0] ?? null);
            setErrors((prev) => {
              if (!("file" in prev)) return prev;
              const next = { ...prev };
              delete next.file;
              return next;
            });
          }}
        />
        {errors.file && <p className="mt-1 text-xs text-erreur">{errors.file}</p>}
      </div>
    </FormModal>
  );
}
