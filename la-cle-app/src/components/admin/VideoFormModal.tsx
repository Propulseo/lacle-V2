"use client";

import { useState, useEffect } from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { createVideo, updateVideo } from "@/services/videos";
import {
  collectErrors,
  isBlank,
  isPositiveInt,
  isValidHttpUrl,
  type FieldErrors,
} from "@/lib/validation";
import { FormValidationError } from "@/lib/errors";
import type { Video } from "@/types";

interface VideoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  moduleId: string;
  video?: Video | null;
  nextOrder?: number;
}

const emptyForm = {
  title: "",
  description: "",
  order: 1,
  duration: 0,
  src: "",
  isPublished: false,
};

export function VideoFormModal({ isOpen, onClose, onSuccess, moduleId, video, nextOrder = 1 }: VideoFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const isEdit = !!video;

  useEffect(() => {
    if (video) {
      setForm({
        title: video.title,
        description: video.description,
        order: video.order,
        duration: video.duration,
        src: video.src || "",
        isPublished: video.isPublished,
      });
    } else {
      setForm({ ...emptyForm, order: nextOrder });
    }
    setErrors({});
  }, [video, nextOrder, isOpen]);

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
      ["order", !isPositiveInt(form.order), "L'ordre doit être un entier supérieur ou égal à 1."],
      ["duration", !isPositiveInt(form.duration, 0), "La durée doit être un nombre entier positif (en secondes)."],
      ["src", !isBlank(form.src) && !isValidHttpUrl(form.src), "L'URL doit commencer par http(s)://."],
    ]);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      throw new FormValidationError();
    }

    if (isEdit && video) {
      await updateVideo(video.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        order: form.order,
        duration: form.duration,
        src: form.src.trim() || null,
        isPublished: form.isPublished,
      });
    } else {
      await createVideo({
        moduleId,
        title: form.title.trim(),
        description: form.description.trim(),
        order: form.order,
        duration: form.duration,
        src: form.src.trim() || null,
        thumbnailUrl: null,
        isPublished: form.isPublished,
      });
    }
    onSuccess();
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEdit ? "Modifier la vidéo" : "Nouvelle vidéo"}
      submitLabel={isEdit ? "Mettre à jour" : "Créer"}
    >
      <Input label="Titre" required error={errors.title} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex: Introduction à la PNL" />
      <Textarea label="Description" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Contenu de la vidéo..." />
      <div className="grid grid-cols-3 gap-4">
        <Input label="Ordre" type="number" required min={1} error={errors.order} value={String(form.order)} onChange={(e) => set("order", Number(e.target.value))} />
        <Input label="Durée (sec)" type="number" min={0} error={errors.duration} value={String(form.duration)} onChange={(e) => set("duration", Number(e.target.value))} />
        <div className="flex items-end pb-1">
          <Toggle enabled={form.isPublished} onChange={(v) => set("isPublished", v)} label="Publiée" />
        </div>
      </div>
      <Input label="URL vidéo" error={errors.src} value={form.src} onChange={(e) => set("src", e.target.value)} placeholder="https://..." />
    </FormModal>
  );
}
