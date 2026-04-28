"use client";

import { useState, useEffect } from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createSession, updateSession } from "@/services/sessions";
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
  }, [session, isOpen]);

  function set(field: keyof typeof form, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (isEdit && session) {
      await updateSession(session.id, {
        title: form.title,
        description: form.description,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location,
        maxParticipants: form.maxParticipants,
      });
    } else {
      await createSession({
        title: form.title,
        description: form.description,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location,
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
      submitLabel={isEdit ? "Mettre a jour" : "Creer"}
    >
      <Input label="Titre" required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex: Journee de pratique PNL" />
      <Textarea label="Description" required value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Objectifs et contenu de la session..." />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Date" type="date" required value={form.date} onChange={(e) => set("date", e.target.value)} />
        <Input label="Lieu" required value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Ex: Paris 11e" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Input label="Debut" type="time" required value={form.startTime} onChange={(e) => set("startTime", e.target.value)} />
        <Input label="Fin" type="time" required value={form.endTime} onChange={(e) => set("endTime", e.target.value)} />
        <Input label="Places max" type="number" required min={1} value={String(form.maxParticipants)} onChange={(e) => set("maxParticipants", Number(e.target.value))} />
      </div>
    </FormModal>
  );
}
