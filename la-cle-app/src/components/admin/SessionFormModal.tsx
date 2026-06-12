"use client";

import { useState, useEffect } from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createSession, updateSession } from "@/services/sessions";
import {
  collectErrors,
  isBlank,
  isPositiveInt,
  isTimeRangeValid,
  isTodayOrFuture,
  type FieldErrors,
} from "@/lib/validation";
import { FormValidationError } from "@/lib/errors";
import type { Session } from "@/types";

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  session?: Session | null;
}

const emptyForm = {
  title: "",
  description: "",
  date: "",
  startTime: "09:00",
  endTime: "17:00",
  location: "",
  maxParticipants: 20,
};

export function SessionFormModal({ isOpen, onClose, onSuccess, session }: SessionFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const isEdit = !!session;

  useEffect(() => {
    if (session) {
      setForm({
        title: session.title,
        description: session.description,
        date: session.date.split("T")[0],
        startTime: session.startTime,
        endTime: session.endTime,
        location: session.location,
        maxParticipants: session.maxParticipants,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [session, isOpen]);

  function set(field: keyof typeof form, value: string | number) {
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
      ["date", isBlank(form.date), "Veuillez renseigner une date."],
      // En modification, une session passée reste éditable (présences, etc.).
      ["date", !isEdit && !isBlank(form.date) && !isTodayOrFuture(form.date), "La date ne peut pas être dans le passé."],
      ["location", isBlank(form.location), "Veuillez renseigner un lieu."],
      ["endTime", !isTimeRangeValid(form.startTime, form.endTime), "L'heure de fin doit être postérieure à l'heure de début."],
      ["maxParticipants", !isPositiveInt(form.maxParticipants), "Le nombre de places doit être au moins 1."],
    ]);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      throw new FormValidationError();
    }

    if (isEdit && session) {
      await updateSession(session.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location.trim(),
        maxParticipants: form.maxParticipants,
      });
    } else {
      await createSession({
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location.trim(),
        maxParticipants: form.maxParticipants,
      });
    }
    onSuccess();
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEdit ? "Modifier la session" : "Nouvelle session"}
      submitLabel={isEdit ? "Mettre à jour" : "Créer"}
    >
      <Input label="Titre" required error={errors.title} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex: Journée de pratique PNL" />
      <Textarea label="Description" required error={errors.description} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Objectifs et contenu de la session..." />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Date" type="date" required error={errors.date} value={form.date} onChange={(e) => set("date", e.target.value)} />
        <Input label="Lieu" required error={errors.location} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Ex: Paris 11e" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Input label="Début" type="time" required value={form.startTime} onChange={(e) => set("startTime", e.target.value)} />
        <Input label="Fin" type="time" required error={errors.endTime} value={form.endTime} onChange={(e) => set("endTime", e.target.value)} />
        <Input label="Places max" type="number" required min={1} error={errors.maxParticipants} value={String(form.maxParticipants)} onChange={(e) => set("maxParticipants", Number(e.target.value))} />
      </div>
    </FormModal>
  );
}
