"use client";

import { useState, useEffect } from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { createModule, updateModule } from "@/services/modules";
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
  }, [module, nextOrder, isOpen]);

  function set(field: keyof typeof form, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (isEdit && module) {
      await updateModule(module.id, {
        title: form.title,
        description: form.description,
        order: form.order,
        isPublished: form.isPublished,
      });
    } else {
      await createModule({
        title: form.title,
        description: form.description,
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
      submitLabel={isEdit ? "Mettre a jour" : "Creer"}
    >
      <Input label="Titre" required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex: Les fondamentaux de la PNL" />
      <Textarea label="Description" required value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Objectifs pedagogiques du module..." />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Ordre" type="number" required min={1} value={String(form.order)} onChange={(e) => set("order", Number(e.target.value))} />
        <div className="flex items-end pb-1">
          <Toggle enabled={form.isPublished} onChange={(v) => set("isPublished", v)} label="Publie" />
        </div>
      </div>
    </FormModal>
  );
}
