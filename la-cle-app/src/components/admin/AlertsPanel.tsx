"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { getEngagementLearners } from "@/services/engagement";
import { getAbandonCount } from "@/services/engagement";

interface AlertItem {
  id: string;
  label: string;
  type: "warning" | "info" | "error";
  href: string;
}

const staticAlerts: AlertItem[] = [
  {
    id: "1",
    label: "1 message support sans réponse",
    type: "warning",
    href: ROUTES.admin.documents,
  },
  {
    id: "2",
    label: "1 demande d'examen final en attente",
    type: "info",
    href: ROUTES.admin.examenFinal,
  },
  {
    id: "3",
    label: "1 apprenant avec premier mot de passe non changé",
    type: "warning",
    href: ROUTES.admin.apprenants,
  },
];

const badgeVariants: Record<string, "warning" | "info" | "error"> = {
  warning: "warning",
  info: "info",
  error: "error",
};

export function AlertsPanel() {
  const [abandonCount, setAbandonCount] = useState(0);

  useEffect(() => {
    getEngagementLearners().then((list) => setAbandonCount(getAbandonCount(list)));
  }, []);

  const alerts: AlertItem[] = [
    ...(abandonCount > 0
      ? [{
          id: "abandon-alert",
          label: `${abandonCount} apprenant${abandonCount > 1 ? "s" : ""} inactif${abandonCount > 1 ? "s" : ""} depuis 42 jours — action requise`,
          type: "error" as const,
          href: ROUTES.admin.engagement,
        }]
      : []),
    ...staticAlerts,
  ];

  if (alerts.length === 0) return null;

  return (
    <Card>
      <h3 className="mb-4 font-serif text-lg text-ivoire">Actions en attente</h3>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <Link
            key={alert.id}
            href={alert.href}
            className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-ivoire/5"
          >
            <span className="text-sm text-cendre">{alert.label}</span>
            <Badge variant={badgeVariants[alert.type]}>
              {alert.type === "error" ? "Urgent" : alert.type === "warning" ? "À traiter" : "Info"}
            </Badge>
          </Link>
        ))}
      </div>
    </Card>
  );
}
