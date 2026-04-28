"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AdminShell } from "@/components/layout/AdminShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { SatisfactionTable } from "@/components/admin/SatisfactionTable";
import { getSatisfactionSurveys, togglePublicReview } from "@/services/satisfaction";
import { exportToCsv } from "@/lib/export-utils";
import { formatDate } from "@/lib/utils";
import type { SatisfactionSurvey, SatisfactionType } from "@/types";

const HOT_LABELS: Record<string, string> = {
  "hot-1": "Qualite globale",
  "hot-2": "Contenu / attentes",
  "hot-3": "Facilite d'utilisation",
  "hot-4": "Recommandation",
};

const COLD_LABELS: Record<string, string> = {
  "cold-1": "Mise en pratique",
  "cold-2": "Impact quotidien",
  "cold-3": "Progression PNL",
};

function avgByQuestion(surveys: SatisfactionSurvey[], questionId: string): string {
  const ratings = surveys.flatMap((s) => s.answers).filter((a) => a.questionId === questionId && a.rating !== undefined).map((a) => a.rating!);
  if (ratings.length === 0) return "-";
  return (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1);
}

function getStudentLabel(id: string): string {
  const names: Record<string, string> = {
    "learner-1": "Marie Dupont", "learner-2": "Thomas Martin", "learner-3": "Sophie Bernard",
    "learner-5": "Emma Leroy", "learner-6": "Julie Moreau",
  };
  return names[id] ?? id;
}

export default function SatisfactionPage() {
  const [activeTab, setActiveTab] = useState<SatisfactionType>("chaud");
  const surveysState = useAsyncData(() => getSatisfactionSurveys(), []);

  return (
    <AdminShell breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Satisfaction" }]}>
      <div className="space-y-6">
        <AsyncBoundary state={surveysState}>
          {(surveys) => {
            const filtered = surveys.filter((s) => s.type === activeTab);
            const labels = activeTab === "chaud" ? HOT_LABELS : COLD_LABELS;

            const tabs = [
              { id: "chaud", label: "A chaud", count: surveys.filter((s) => s.type === "chaud").length },
              { id: "froid", label: "A froid", count: surveys.filter((s) => s.type === "froid").length },
            ];

            async function handleToggle(id: string) {
              await togglePublicReview(id);
              surveysState.refetch();
            }

            function handleExport() {
              // TODO // Qualiopi Ind.30: export requis pour audit
              const rows = filtered.map((s) => ({
                nom: getStudentLabel(s.studentId),
                date: s.completedAt ? formatDate(s.completedAt) : "",
                ...Object.fromEntries(
                  Object.entries(labels).map(([qId, label]) => {
                    const a = s.answers.find((a) => a.questionId === qId);
                    return [label, a?.rating ?? a?.text ?? ""];
                  })
                ),
                avis_public: s.publicReview ?? "",
              }));
              exportToCsv(rows, `satisfaction-${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`);
            }

            return (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-serif text-2xl text-ivoire">Satisfaction</h1>
                    <p className="mt-1 text-sm text-cendre">{surveys.length} reponses au total</p>
                  </div>
                  <Button variant="ghost" size="sm" icon={<Download className="h-4 w-4" />} onClick={handleExport}>Exporter CSV</Button>
                </div>

                <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as SatisfactionType)} />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Object.entries(labels).map(([qId, label]) => (
                    <StatCard key={qId} label={label} value={`${avgByQuestion(filtered, qId)} / 5`} />
                  ))}
                </div>

                <SatisfactionTable surveys={filtered} onTogglePublic={handleToggle} />
              </>
            );
          }}
        </AsyncBoundary>
      </div>
    </AdminShell>
  );
}
