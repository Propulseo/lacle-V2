"use client";

import { useState, useEffect } from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Input } from "@/components/ui/Input";
import { scheduleFinalExam } from "@/services/final-exams";
import { collectErrors, isBlank, isTodayOrFuture, type FieldErrors } from "@/lib/validation";
import { FormValidationError } from "@/lib/errors";
import type { FinalExam } from "@/types";

interface ScheduleFinalExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  exam: FinalExam | null;
  learnerName: string;
}

export function ScheduleFinalExamModal({ isOpen, onClose, onSuccess, exam, learnerName }: ScheduleFinalExamModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    setDate("");
    setTime("09:00");
    setErrors({});
  }, [isOpen]);

  async function handleSubmit() {
    if (!exam) return;
    const errs = collectErrors([
      ["date", isBlank(date), "Veuillez renseigner une date."],
      ["date", !isBlank(date) && !isTodayOrFuture(date), "La date ne peut pas être dans le passé."],
      ["time", isBlank(time), "Veuillez renseigner une heure."],
    ]);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      throw new FormValidationError();
    }

    // TODO // Brevo: notifier l'apprenant de la date retenue (cable en Phase 6).
    await scheduleFinalExam(exam.id, new Date(`${date}T${time}:00`).toISOString());
    onSuccess();
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={`Planifier l'examen final — ${learnerName}`}
      submitLabel="Planifier"
      size="sm"
    >
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          required
          error={errors.date}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setErrors((prev) => {
              if (!("date" in prev)) return prev;
              const next = { ...prev };
              delete next.date;
              return next;
            });
          }}
        />
        <Input
          label="Heure"
          type="time"
          required
          error={errors.time}
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
    </FormModal>
  );
}
