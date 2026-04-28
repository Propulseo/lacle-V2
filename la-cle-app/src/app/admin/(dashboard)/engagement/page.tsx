"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AdminShell } from "@/components/layout/AdminShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { EngagementRow } from "@/components/admin/EngagementRow";
import { getEngagementLearners } from "@/services/engagement";
import { exportToCsv } from "@/lib/export-utils";
import type { EngagementLearner } from "@/types";

type TabId = "actifs" | "risque" | "abandons" | "reprises";

function classifyTab(l: EngagementLearner): TabId {
  if (l.isReprise) return "reprises";
  const s = l.engagement.status;
  if (s === "actif") return "actifs";
  if (s === "inactif_42j" || s === "abandonne") return "abandons";
  return "risque";
}

function relativeDaysLabel(days: number): string {
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days} jours`;
  if (days < 14) return "il y a 1 semaine";
  if (days < 30) return `il y a ${Math.floor(days / 7)} semaines`;
  return `il y a ${Math.floor(days / 30)} mois`;
}

function buildCsvRows(list: EngagementLearner[]) {
  return list.map((l) => ({
    nom: l.lastName,
    prenom: l.firstName,
    email: l.email,
    statut: l.engagement.status,
    derniere_activite: relativeDaysLabel(l.engagement.daysSinceLastActivity),
    progression: `Module ${l.currentModule} — Cours ${l.currentCourse}/${l.totalCourses}`,
    relances_envoyees: l.engagement.remindersSent.length,
  }));
}

export default function EngagementPage() {
  const [activeTab, setActiveTab] = useState<TabId>("actifs");
  const learnersState = useAsyncData(() => getEngagementLearners(), []);

  return (
    <AdminShell
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Engagement" },
      ]}
    >
      <div className="space-y-6">
        <AsyncBoundary state={learnersState}>
          {(learners) => {
            const grouped: Record<TabId, EngagementLearner[]> = { actifs: [], risque: [], abandons: [], reprises: [] };
            for (const l of learners) grouped[classifyTab(l)].push(l);

            const tabs = [
              { id: "actifs" as const, label: "Actifs", count: grouped.actifs.length },
              { id: "risque" as const, label: "A risque", count: grouped.risque.length },
              { id: "abandons" as const, label: "Abandons", count: grouped.abandons.length },
              { id: "reprises" as const, label: "Reprises", count: grouped.reprises.length },
            ];

            const currentList = grouped[activeTab];

            function handleExport() {
              const rows = buildCsvRows(currentList);
              // TODO // Qualiopi Ind.12 : cet export est requis pour audit
              exportToCsv(rows, `engagement-${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`);
            }

            return (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-serif text-2xl text-ivoire">Suivi d&apos;engagement</h1>
                    <p className="mt-1 text-sm text-cendre">{learners.length} apprenants suivis</p>
                  </div>
                  <Button variant="ghost" size="sm" icon={<Download className="h-4 w-4" />} onClick={handleExport}>
                    Exporter CSV
                  </Button>
                </div>

                <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />

                <div className="space-y-2">
                  {currentList.length === 0 ? (
                    <EmptyState title="Aucun apprenant dans cette categorie" />
                  ) : (
                    currentList.map((l) => <EngagementRow key={l.id} learner={l} />)
                  )}
                </div>
              </>
            );
          }}
        </AsyncBoundary>
      </div>
    </AdminShell>
  );
}
