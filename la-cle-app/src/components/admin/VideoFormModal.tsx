"use client";

import { useState, useEffect } from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { createVideo, updateVideo } from "@/services/videos";
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
  }, [video, nextOrder, isOpen]);

  function set(field: keyof typeof form, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (isEdit && video) {
      await updateVideo(video.id, {
        title: form.title,
        description: form.description,
        order: form.order,
        duration: form.duration,
        src: form.src || null,
        isPublished: form.isPublished,
      });
    } else {
      await createVideo({
        moduleId,
        title: form.title,
        description: form.description,
        order: form.order,
        duration: form.duration,
        src: form.src || null,
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
      title={isEdit ? "Modifier la video" : "Nouvelle video"}
      submitLabel={isEdit ? "Mettre a jour" : "Creer"}
    >
      <Input label="Titre" required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex: Introduction a la PNL" />
      <Textarea label="Description" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Contenu de la video..." />
      <div className="grid grid-cols-3 gap-4">
        <Input label="Ordre" type="number" required min={1} value={String(form.order)} onChange={(e) => set("order", Number(e.target.value))} />
        <Input label="Duree (sec)" type="number" min={0} value={String(form.duration)} onChange={(e) => set("duration", Number(e.target.value))} />
        <div className="flex items-end pb-1">
          <Toggle enabled={form.isPublished} onChange={(v) => set("isPublished", v)} label="Publiee" />
        </div>
      </div>
      <Input label="URL video" value={form.src} onChange={(e) => set("src", e.target.value)} placeholder="https://..." />
    </FormModal>
  );
}
