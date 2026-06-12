"use client";

import { useState, useEffect } from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Input } from "@/components/ui/Input";
import { updateLearner } from "@/services/learners";
import {
  collectErrors,
  isBlank,
  isValidEmail,
  isValidPhoneFr,
  type FieldErrors,
} from "@/lib/validation";
import { FormValidationError } from "@/lib/errors";
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
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    setForm({
      firstName: learner.firstName,
      lastName: learner.lastName,
      email: learner.email,
      phone: learner.phone,
    });
    setErrors({});
  }, [learner, isOpen]);

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
      ["firstName", isBlank(form.firstName), "Veuillez renseigner un prénom."],
      ["lastName", isBlank(form.lastName), "Veuillez renseigner un nom."],
      ["email", !isValidEmail(form.email), "Veuillez renseigner une adresse email valide."],
      ["phone", !isBlank(form.phone) && !isValidPhoneFr(form.phone), "Veuillez renseigner un numéro de téléphone français valide."],
    ]);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      throw new FormValidationError();
    }

    await updateLearner(learner.id, {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
    onSuccess();
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Modifier l'apprenant"
      submitLabel="Mettre à jour"
      size="sm"
    >
      <div className="grid grid-cols-2 gap-4">
        <Input label="Prénom" required error={errors.firstName} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
        <Input label="Nom" required error={errors.lastName} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
      </div>
      <Input label="Email" type="email" required error={errors.email} value={form.email} onChange={(e) => set("email", e.target.value)} />
      <Input label="Téléphone" error={errors.phone} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
    </FormModal>
  );
}
