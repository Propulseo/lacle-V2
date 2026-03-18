"use client";

import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "login" | "exam_passed" | "registration" | "message";
  description: string;
  date: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "login",
    description: "Marie Dupont s'est connectée",
    date: "2026-03-17T14:30:00Z",
  },
  {
    id: "2",
    type: "exam_passed",
    description: "Thomas Martin a validé l'examen du module 3",
    date: "2026-03-16T11:00:00Z",
  },
  {
    id: "3",
    type: "registration",
    description: "Thomas Martin s'est inscrit à la session du 12 avril",
    date: "2026-03-15T09:00:00Z",
  },
  {
    id: "4",
    type: "message",
    description: "Emma Leroy a envoyé un message au support",
    date: "2026-03-17T09:00:00Z",
  },
  {
    id: "5",
    type: "login",
    description: "Emma Leroy s'est connectée",
    date: "2026-03-18T08:00:00Z",
  },
];

const typeColors: Record<ActivityItem["type"], string> = {
  login: "bg-info/10 text-info",
  exam_passed: "bg-succes/10 text-succes",
  registration: "bg-or/10 text-or",
  message: "bg-attention/10 text-attention",
};

export function RecentActivity() {
  return (
    <Card>
      <h3 className="mb-4 font-serif text-lg text-ivoire">Activité récente</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`mt-0.5 h-2 w-2 rounded-full ${typeColors[activity.type].split(" ")[0]?.replace("/10", "")}`} />
            <div className="flex-1">
              <p className="text-sm text-ivoire">{activity.description}</p>
              <p className="text-xs text-pierre">{formatDate(activity.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
