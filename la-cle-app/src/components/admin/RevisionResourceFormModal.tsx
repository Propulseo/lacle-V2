"use client";

import { useState, useEffect } from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { createRevisionResource } from "@/services/revision";
import { collectErrors, isBlank, type FieldErrors } from "@/lib/validation";
import { FormValidationError } from "@/lib/errors";
import type { RevisionResourceType } from "@/types";

interface RevisionResourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const emptyForm = {
  type: "pdf" as RevisionResourceType,
  title: "",
  description: "",
  content: "",
  answer: "",
};

export function RevisionResourceFormModal({ isOpen, onClose, onSuccess }: RevisionResourceFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});

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
      ["title", isBlank(form.title), "Veuillez renseigner un titre."],
      ["description", isBlank(form.description), "Veuillez renseigner une description."],
      ["content", isBlank(form.content), "Veuillez renseigner le contenu de la ressource."],
    ]);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      throw new FormValidationError();
    }

    // TODO // Supabase: INSERT dans revision_resources + upload Storage pour les PDF
    await createRevisionResource({
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim(),
      content: form.content.trim(),
      answer: form.type === "question" && !isBlank(form.answer) ? form.answer.trim() : undefined,
      moduleId: null,
    });
    onSuccess();
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Nouvelle ressource"
      submitLabel="Ajouter"
    >
      <Select
        label="Type de ressource"
        options={[
          { value: "pdf", label: "Fiche PDF" },
          { value: "question", label: "Question de révision" },
          { value: "video", label: "Vidéo" },
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
        placeholder="Ex: Fiche — Les présupposés de la PNL"
      />
      <Textarea
        label="Description"
        required
        error={errors.description}
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        placeholder="Ce que l'apprenant trouvera dans cette ressource..."
        rows={2}
      />
      <Textarea
        label={form.type === "question" ? "Question" : "Contenu (texte ou URL)"}
        required
        error={errors.content}
        value={form.content}
        onChange={(e) => set("content", e.target.value)}
        rows={3}
      />
      {form.type === "question" && (
        <Textarea
          label="Réponse attendue (optionnel)"
          value={form.answer}
          onChange={(e) => set("answer", e.target.value)}
          rows={2}
        />
      )}
    </FormModal>
  );
}
