"use client";

import { useState } from "react";
import { FormModal } from "@/components/ui/FormModal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormValidationError } from "@/lib/errors";
import type { CollectionSchema } from "@/lib/cms-schema";
import type { Json } from "@/services/site-cms";

interface CollectionItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  schema: CollectionSchema;
  /** Valeurs initiales (edition) ; vide pour une creation. */
  initial?: Record<string, string>;
  /** Recoit le data jsonb valide a soumettre. */
  onSubmit: (data: Json) => Promise<void>;
}

type FormState = Record<string, string>;

function buildState(schema: CollectionSchema, initial?: Record<string, string>): FormState {
  const out: FormState = {};
  for (const field of schema.itemFields) {
    out[field.name] = initial?.[field.name] ?? "";
  }
  return out;
}

export function CollectionItemFormModal({
  isOpen,
  onClose,
  schema,
  initial,
  onSubmit,
}: CollectionItemFormModalProps) {
  const [values, setValues] = useState<FormState>(() => buildState(schema, initial));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Resynchronise quand on ouvre la modale sur un autre item.
  const [openedFor, setOpenedFor] = useState<string | undefined>(undefined);
  const itemKey = initial ? JSON.stringify(initial) : "__new__";
  if (isOpen && openedFor !== itemKey) {
    setOpenedFor(itemKey);
    setValues(buildState(schema, initial));
    setErrors({});
  }

  function setValue(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    const nextErrors: Record<string, string> = {};
    for (const field of schema.itemFields) {
      if (!values[field.name]?.trim()) {
        nextErrors[field.name] = "Ce champ est requis.";
      }
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      throw new FormValidationError();
    }
    setErrors({});
    const data: Record<string, string> = {};
    for (const field of schema.itemFields) {
      data[field.name] = values[field.name].trim();
    }
    await onSubmit(data as Json);
  }

  const title = initial ? `Modifier — ${schema.label}` : `Ajouter — ${schema.label}`;

  return (
    <FormModal isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title={title}>
      {schema.itemFields.map((field) =>
        field.type === "textarea" ? (
          <Textarea
            key={field.name}
            label={field.label}
            value={values[field.name] ?? ""}
            error={errors[field.name]}
            onChange={(e) => setValue(field.name, e.target.value)}
          />
        ) : (
          <Input
            key={field.name}
            label={field.label}
            value={values[field.name] ?? ""}
            error={errors[field.name]}
            onChange={(e) => setValue(field.name, e.target.value)}
          />
        )
      )}
    </FormModal>
  );
}
