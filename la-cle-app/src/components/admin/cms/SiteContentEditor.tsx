"use client";

import { useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Toast } from "@/components/ui/Toast";
import {
  listSiteContent,
  updateSiteContent,
  type Json,
  type SiteContentRow,
} from "@/services/site-cms";
import type { ContentFieldDef } from "@/lib/cms-schema";

interface SiteContentEditorProps {
  fields: ContentFieldDef[];
}

type ValueMap = Record<string, string>;

/** Construit l'etat de formulaire initial (string) a partir des lignes site_content. */
function buildInitialValues(
  fields: ContentFieldDef[],
  rows: SiteContentRow[]
): ValueMap {
  const byKey = new Map(rows.map((row) => [row.key, row.value]));
  const out: ValueMap = {};
  for (const field of fields) {
    const value = byKey.get(field.key);
    if (field.kind === "text") {
      out[field.key] = typeof value === "string" ? value : "";
    } else {
      const obj = value && typeof value === "object" && !Array.isArray(value) ? value : {};
      for (const sub of field.fields ?? []) {
        const raw = (obj as Record<string, Json | undefined>)[sub.name];
        out[`${field.key}.${sub.name}`] = raw === undefined || raw === null ? "" : String(raw);
      }
    }
  }
  return out;
}

export function SiteContentEditor({ fields }: SiteContentEditorProps) {
  const state = useAsyncData(() => listSiteContent(), []);

  return (
    <AsyncBoundary state={state} loadingLabel="Chargement des valeurs…">
      {(rows) => <ContentForm fields={fields} rows={rows} />}
    </AsyncBoundary>
  );
}

function ContentForm({
  fields,
  rows,
}: {
  fields: ContentFieldDef[];
  rows: SiteContentRow[];
}) {
  const [values, setValues] = useState<ValueMap>(() => buildInitialValues(fields, rows));
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [savedLabel, setSavedLabel] = useState<string | null>(null);

  function setValue(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(field: ContentFieldDef) {
    setErrorKey(null);
    setSavingKey(field.key);
    try {
      let payload: Json;
      if (field.kind === "text") {
        payload = values[field.key] ?? "";
      } else {
        const obj: Record<string, number> = {};
        for (const sub of field.fields ?? []) {
          obj[sub.name] = Number(values[`${field.key}.${sub.name}`] ?? "0");
        }
        payload = obj;
      }
      await updateSiteContent(field.key, payload, {
        label: field.label,
        group: field.group,
      });
      setSavedLabel(field.label);
    } catch {
      setErrorKey(field.key);
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <Card key={field.key}>
          <h3 className="mb-4 font-serif text-lg text-ivoire">{field.label}</h3>

          {field.kind === "text" ? (
            <Input
              label="Valeur"
              value={values[field.key] ?? ""}
              onChange={(e) => setValue(field.key, e.target.value)}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {(field.fields ?? []).map((sub) => (
                <Input
                  key={sub.name}
                  label={sub.label}
                  type="number"
                  value={values[`${field.key}.${sub.name}`] ?? ""}
                  onChange={(e) => setValue(`${field.key}.${sub.name}`, e.target.value)}
                />
              ))}
            </div>
          )}

          {errorKey === field.key && (
            <Alert variant="error" className="mt-4">
              La sauvegarde a échoué. Veuillez réessayer.
            </Alert>
          )}

          <div className="mt-4 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              isLoading={savingKey === field.key}
              onClick={() => handleSave(field)}
            >
              Enregistrer
            </Button>
          </div>
        </Card>
      ))}

      <Toast
        message={`« ${savedLabel} » enregistré.`}
        isVisible={savedLabel !== null}
        onClose={() => setSavedLabel(null)}
      />
    </div>
  );
}
