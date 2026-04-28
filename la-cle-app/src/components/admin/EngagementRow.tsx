"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";
import type { EngagementLearner } from "@/types";
import type { EngagementStatus } from "@/types";

function relativeDays(days: number): string {
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days} jours`;
  if (days < 14) return "il y a 1 semaine";
  if (days < 30) return `il y a ${Math.floor(days / 7)} semaines`;
  if (days < 60) return "il y a 1 mois";
  return `il y a ${Math.floor(days / 30)} mois`;
}

const statusBadge: Record<EngagementStatus, { label: string; variant: "success" | "warning" | "error" }> = {
  actif: { label: "Actif", variant: "success" },
  inactif_7j: { label: "Inactif 7j", variant: "warning" },
  inactif_14j: { label: "Inactif 14j", variant: "warning" },
  inactif_28j: { label: "Inactif 28j", variant: "warning" },
  inactif_42j: { label: "Inactif 42j+", variant: "error" },
  abandonne: { label: "Abandonne", variant: "error" },
};

export function EngagementRow({ learner }: { learner: EngagementLearner }) {
  const { engagement } = learner;
  const badge = statusBadge[engagement.status];
  const reminders = engagement.remindersSent;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-filet px-4 py-3 transition-colors hover:bg-ivoire/5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-ivoire">
            {learner.firstName} {learner.lastName}
          </p>
          <Badge variant={badge.variant}>{badge.label}</Badge>
          {learner.isReprise && <Badge variant="info">Reprise</Badge>}
        </div>
        <p className="text-xs text-cendre">{learner.email}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-pierre">
          <span>Derniere activite : {relativeDays(engagement.daysSinceLastActivity)}</span>
          <span>Module {learner.currentModule} — Cours {learner.currentCourse} sur {learner.totalCourses}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Relances */}
        <div className="flex items-center gap-1" title={`${reminders.length} relance(s) envoyee(s)`}>
          {[1, 2, 3].map((level) => {
            const sent = reminders.some((r) => r.level === level);
            return (
              <Mail
                key={level}
                className={`h-3.5 w-3.5 ${sent ? "text-attention" : "text-filet"}`}
              />
            );
          })}
          {(() => {
            const called = reminders.some((r) => r.level === 4);
            return (
              <Phone
                className={`h-3.5 w-3.5 ${called ? "text-erreur" : "text-filet"}`}
              />
            );
          })()}
        </div>

        <Link href={ROUTES.admin.apprenant(learner.id)}>
          <Button variant="ghost" size="sm">
            Voir le profil
          </Button>
        </Link>
      </div>
    </div>
  );
}
