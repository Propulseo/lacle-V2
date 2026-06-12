"use client";

import { AdminShell } from "@/components/layout/AdminShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { StatsOverview } from "@/components/admin/StatsOverview";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { AlertsPanel } from "@/components/admin/AlertsPanel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getLearnerStats } from "@/services/learners";
import { getPassedModuleExamCount } from "@/services/exams";
import { getFinalExams } from "@/services/final-exams";
import { getSupportMessages } from "@/services/documents";

export default function AdminDashboardPage() {
  const statsState = useAsyncData(async () => {
    const [learnerStats, finalExams, supportMessages, completedModules] = await Promise.all([
      getLearnerStats(),
      getFinalExams(),
      getSupportMessages(),
      getPassedModuleExamCount(),
    ]);
    return {
      totalLearners: learnerStats.total,
      activeLearners: learnerStats.active,
      completedModules,
      pendingActions:
        finalExams.filter((e) => e.status === "requested").length +
        supportMessages.filter((m) => !m.reply).length,
    };
  }, []);

  return (
    <AdminShell breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl text-ivoire">Dashboard</h1>
          <p className="mt-1 text-sm text-cendre">
            Vue d&apos;ensemble de la plateforme
          </p>
        </div>

        <AsyncBoundary state={statsState} loadingLabel="Chargement des statistiques…">
          {(stats) => (
            <ScrollReveal>
              <StatsOverview stats={stats} />
            </ScrollReveal>
          )}
        </AsyncBoundary>

        <div className="grid gap-6 lg:grid-cols-2">
          <ScrollReveal delay={0.1}>
            <RecentActivity />
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <AlertsPanel />
          </ScrollReveal>
        </div>
      </div>
    </AdminShell>
  );
}
