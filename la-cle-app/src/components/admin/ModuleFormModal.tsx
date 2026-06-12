"use client";

import { useState, useEffect } from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { createModule, updateModule } from "@/services/modules";
import { collectErrors, isBlank, isPositiveInt, type FieldErrors } from "@/lib/validation";
import { FormValidationError } from "@/lib/errors";
import type { LegacyModule } from "@/types";

interface ModuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  module?: LegacyModule | null;
  nextOrder?: number;
}

const emptyForm = {
  title: "",
  description: "",
  order: 1,
  isPublished: false,
};

export function ModuleFormModal({ isOpen, onClose, onSuccess, module, nextOrder = 1 }: ModuleFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const isEdit = !!module;

  useEffect(() => {
    if (module) {
      setForm({
        title: module.title,
        description: module.description,
        order: module.order,
        isPublished: module.isPublished,
      });
    } else {
      setForm({ ...emptyForm, order: nextOrder });
    }
    setErrors({});
  }, [module, nextOrder, isOpen]);

  function set(field: keyof typeof form, value: string | number | boolean) {
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
      ["order", !isPositiveInt(form.order), "L'ordre doit être un entier supérieur ou égal à 1."],
    ]);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      throw new FormValidationError();
    }

    if (isEdit && module) {
      await updateModule(module.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        order: form.order,
        isPublished: form.isPublished,
      });
    } else {
      await createModule({
        title: form.title.trim(),
        description: form.description.trim(),
        order: form.order,
        isPublished: form.isPublished,
        accessLevel: "all",
        videosCount: 0,
        totalDuration: 0,
        examId: null,
      });
    }
    onSuccess();
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEdit ? "Modifier le module" : "Nouveau module"}
      submitLabel={isEdit ? "Mettre à jour" : "Créer"}
    >
      <Input label="Titre" required error={errors.title} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex: Les fondamentaux de la PNL" />
      <Textarea label="Description" required error={errors.description} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Objectifs pédagogiques du module..." />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Ordre" type="number" required min={1} error={errors.order} value={String(form.order)} onChange={(e) => set("order", Number(e.target.value))} />
        <div className="flex items-end pb-1">
          <Toggle enabled={form.isPublished} onChange={(v) => set("isPublished", v)} label="Publié" />
        </div>
      </div>
    </FormModal>
  );
}
