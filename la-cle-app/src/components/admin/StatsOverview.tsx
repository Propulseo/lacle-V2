"use client";

import { Users, BookOpen, Award, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

interface StatsOverviewProps {
  stats: {
    totalLearners: number;
    activeLearners: number;
    completedModules: number;
    pendingActions: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Apprenants inscrits"
        value={stats.totalLearners}
        icon={<Users className="h-5 w-5" />}
      />
      <StatCard
        label="Apprenants actifs"
        value={stats.activeLearners}
        icon={<Users className="h-5 w-5" />}
        trend={{ value: "+2 ce mois", positive: true }}
      />
      <StatCard
        label="Modules complétés"
        value={stats.completedModules}
        icon={<BookOpen className="h-5 w-5" />}
      />
      <StatCard
        label="Actions en attente"
        value={stats.pendingActions}
        icon={<AlertCircle className="h-5 w-5" />}
      />
    </div>
  );
}
