"use client";

import { AdminShell } from "@/components/layout/AdminShell";
import { StatsOverview } from "@/components/admin/StatsOverview";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { AlertsPanel } from "@/components/admin/AlertsPanel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function AdminDashboardPage() {
  const stats = {
    totalLearners: 5,
    activeLearners: 4,
    completedModules: 7,
    pendingActions: 3,
  };

  return (
    <AdminShell breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl text-ivoire">Dashboard</h1>
          <p className="mt-1 text-sm text-cendre">
            Vue d&apos;ensemble de la plateforme
          </p>
        </div>

        <ScrollReveal>
          <StatsOverview stats={stats} />
        </ScrollReveal>

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
