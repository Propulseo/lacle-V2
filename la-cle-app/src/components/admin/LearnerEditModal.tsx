"use client";

import { useState, useEffect } from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Input } from "@/components/ui/Input";
import { updateLearner } from "@/services/learners";
import type { Learner } from "@/types";

interface LearnerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  learner: Learner;
}

export function LearnerEditModal({ isOpen, onClose, onSuccess, learner }: LearnerEditModalProps) {
  const [form, setForm] = useState({
    firstName: learner.firstName,
    lastName: learner.lastName,
    email: learner.email,
    phone: learner.phone,
  });

  useEffect(() => {
    setForm({
      firstName: learner.firstName,
      lastName: learner.lastName,
      email: learner.email,
      phone: learner.phone,
    });
  }, [learner, isOpen]);

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    await updateLearner(learner.id, form);
    onSuccess();
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Modifier l'apprenant"
      submitLabel="Mettre a jour"
      size="sm"
    >
      <div className="grid grid-cols-2 gap-4">
        <Input label="Prenom" required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
        <Input label="Nom" required value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
      </div>
      <Input label="Email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
      <Input label="Telephone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
    </FormModal>
  );
}
