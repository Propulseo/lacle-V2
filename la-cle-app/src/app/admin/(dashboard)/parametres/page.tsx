"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { getSettings, updateSettings } from "@/services/settings";
import type { Settings } from "@/types";

export default function ParametresPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  async function handleSave() {
    if (!settings) return;
    await updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (!settings) return null;

  return (
    <AdminShell
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Paramètres" },
      ]}
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-serif text-2xl text-ivoire">Paramètres</h1>
          <p className="mt-1 text-sm text-cendre">Configuration globale de la plateforme</p>
        </div>

        {saved && <Alert variant="success">Paramètres sauvegardés avec succès.</Alert>}

        <Card>
          <h3 className="mb-4 font-serif text-lg text-ivoire">Général</h3>
          <div className="space-y-4">
            <Input
              label="Nom du site"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
            <Input
              label="Email de support"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            />
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-serif text-lg text-ivoire">Examens</h3>
          <div className="space-y-4">
            <Input
              label="Score de réussite (%)"
              type="number"
              value={String(settings.examPassingScore)}
              onChange={(e) => setSettings({ ...settings, examPassingScore: Number(e.target.value) })}
            />
            <Input
              label="Nombre de tentatives maximum"
              type="number"
              value={String(settings.maxExamAttempts)}
              onChange={(e) => setSettings({ ...settings, maxExamAttempts: Number(e.target.value) })}
            />
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-serif text-lg text-ivoire">Sessions</h3>
          <Input
            label="Délai d'inscription (jours avant)"
            type="number"
            value={String(settings.sessionRegistrationDeadlineDays)}
            onChange={(e) => setSettings({ ...settings, sessionRegistrationDeadlineDays: Number(e.target.value) })}
          />
        </Card>

        <Card>
          <h3 className="mb-4 font-serif text-lg text-ivoire">Maintenance</h3>
          <Toggle
            enabled={settings.maintenanceMode}
            onChange={(v) => setSettings({ ...settings, maintenanceMode: v })}
            label="Mode maintenance"
          />
          <p className="mt-2 text-xs text-cendre">
            Empêche l&apos;accès à l&apos;espace apprenant.
          </p>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave}>
            Sauvegarder
          </Button>
        </div>
      </div>
    </AdminShell>
  );
}
