"use client";

import { useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AdminShell } from "@/components/layout/AdminShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Toast } from "@/components/ui/Toast";
import { getSettings, updateSettings } from "@/services/settings";
import type { Settings } from "@/types";

export default function ParametresPage() {
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState<Settings | null>(null);
  const settingsState = useAsyncData(() => getSettings(), []);

  const settings = localSettings ?? settingsState.data;

  function update(partial: Partial<Settings>) {
    if (!settings) return;
    setLocalSettings({ ...settings, ...partial });
  }

  async function handleSave() {
    if (!settings) return;
    setSaveError("");
    setSaving(true);
    try {
      await updateSettings(settings);
      setSaved(true);
    } catch {
      setSaveError("La sauvegarde a échoué. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Paramètres" },
      ]}
    >
      <AsyncBoundary state={settingsState}>
        {(fetchedSettings) => {
          const s = localSettings ?? fetchedSettings;

          return (
            <div className="mx-auto max-w-2xl space-y-6">
              <div>
                <h1 className="font-serif text-2xl text-ivoire">Paramètres</h1>
                <p className="mt-1 text-sm text-cendre">Configuration globale de la plateforme</p>
              </div>

              {saveError && <Alert variant="error">{saveError}</Alert>}

              <Card>
                <h3 className="mb-4 font-serif text-lg text-ivoire">Général</h3>
                <div className="space-y-4">
                  <Input label="Nom du site" value={s.siteName} onChange={(e) => update({ siteName: e.target.value })} />
                  <Input label="Email de support" type="email" value={s.supportEmail} onChange={(e) => update({ supportEmail: e.target.value })} />
                </div>
              </Card>

              <Card>
                <h3 className="mb-4 font-serif text-lg text-ivoire">Examens</h3>
                <div className="space-y-4">
                  <Input label="Score de réussite (%)" type="number" value={String(s.examPassingScore)} onChange={(e) => update({ examPassingScore: Number(e.target.value) })} />
                  <Input label="Nombre de tentatives maximum" type="number" value={String(s.maxExamAttempts)} onChange={(e) => update({ maxExamAttempts: Number(e.target.value) })} />
                </div>
              </Card>

              <Card>
                <h3 className="mb-4 font-serif text-lg text-ivoire">Sessions</h3>
                <Input label="Délai d'inscription (jours avant)" type="number" value={String(s.sessionRegistrationDeadlineDays)} onChange={(e) => update({ sessionRegistrationDeadlineDays: Number(e.target.value) })} />
              </Card>

              <Card>
                <h3 className="mb-4 font-serif text-lg text-ivoire">Maintenance</h3>
                <Toggle enabled={s.maintenanceMode} onChange={(v) => update({ maintenanceMode: v })} label="Mode maintenance" />
                <p className="mt-2 text-xs text-cendre">Empêche l&apos;accès à l&apos;espace apprenant.</p>
              </Card>

              <div className="flex justify-end">
                <Button variant="primary" onClick={handleSave} isLoading={saving}>Sauvegarder</Button>
              </div>
            </div>
          );
        }}
      </AsyncBoundary>

      <Toast
        message="Paramètres sauvegardés."
        isVisible={saved}
        onClose={() => setSaved(false)}
      />
    </AdminShell>
  );
}
