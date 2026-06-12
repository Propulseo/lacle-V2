"use client";

import { useState, useEffect } from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { addExamQuestion } from "@/services/exams";
import { collectErrors, isBlank, isPositiveInt, type FieldErrors } from "@/lib/validation";
import { FormValidationError } from "@/lib/errors";

interface ExamQuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  examId: string;
}

const emptyForm = {
  type: "qcm" as "qcm" | "vrai_faux",
  question: "",
  options: "",
  correctAnswer: "",
  points: 20,
};

export function ExamQuestionFormModal({ isOpen, onClose, onSuccess, examId }: ExamQuestionFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    setForm(emptyForm);
    setErrors({});
  }, [isOpen]);

  function set(field: keyof typeof form, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  const isQcm = form.type === "qcm";
  const optionList = form.options
    .split("\n")
    .map((o) => o.trim())
    .filter(Boolean);

  async function handleSubmit() {
    const errs = collectErrors([
      ["question", isBlank(form.question), "Veuillez renseigner l'intitulé de la question."],
      ["options", isQcm && optionList.length < 2, "Veuillez renseigner au moins deux options (une par ligne)."],
      [
        "correctAnswer",
        isQcm
          ? !optionList.includes(form.correctAnswer.trim())
          : form.correctAnswer !== "vrai" && form.correctAnswer !== "faux",
        isQcm
          ? "La bonne réponse doit correspondre exactement à l'une des options."
          : "Veuillez choisir vrai ou faux.",
      ],
      ["points", !isPositiveInt(form.points), "Les points doivent être un entier supérieur ou égal à 1."],
    ]);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      throw new FormValidationError();
    }

    await addExamQuestion(examId, {
      type: form.type,
      question: form.question.trim(),
      options: isQcm ? optionList : undefined,
      correctAnswer: form.correctAnswer.trim(),
      points: form.points,
    });
    onSuccess();
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Nouvelle question"
      submitLabel="Ajouter"
    >
      <Select
        label="Type de question"
        options={[
          { value: "qcm", label: "QCM" },
          { value: "vrai_faux", label: "Vrai / Faux" },
        ]}
        value={form.type}
        onChange={(e) => {
          set("type", e.target.value);
          set("correctAnswer", "");
        }}
      />
      <Textarea
        label="Question"
        required
        error={errors.question}
        value={form.question}
        onChange={(e) => set("question", e.target.value)}
        placeholder="Ex: Quel est le présupposé central de la PNL ?"
        rows={2}
      />
      {isQcm && (
        <Textarea
          label="Options (une par ligne)"
          required
          error={errors.options}
          value={form.options}
          onChange={(e) => set("options", e.target.value)}
          placeholder={"Première option\nDeuxième option"}
          rows={4}
        />
      )}
      <div className="grid grid-cols-2 gap-4">
        {isQcm ? (
          <Input
            label="Bonne réponse"
            required
            error={errors.correctAnswer}
            value={form.correctAnswer}
            onChange={(e) => set("correctAnswer", e.target.value)}
            placeholder="Copie exacte de l'option correcte"
          />
        ) : (
          <Select
            label="Bonne réponse"
            error={errors.correctAnswer}
            options={[
              { value: "", label: "Choisir..." },
              { value: "vrai", label: "Vrai" },
              { value: "faux", label: "Faux" },
            ]}
            value={form.correctAnswer}
            onChange={(e) => set("correctAnswer", e.target.value)}
          />
        )}
        <Input
          label="Points"
          type="number"
          required
          min={1}
          error={errors.points}
          value={String(form.points)}
          onChange={(e) => set("points", Number(e.target.value))}
        />
      </div>
    </FormModal>
  );
}
