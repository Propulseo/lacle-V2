"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

interface AlertItem {
  id: string;
  label: string;
  type: "warning" | "info" | "error";
  href: string;
}

const alerts: AlertItem[] = [
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
              {alert.type === "warning" ? "À traiter" : "Info"}
            </Badge>
          </Link>
        ))}
      </div>
    </Card>
  );
}
