"use client";

import { User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { STATUS_CONFIG } from "@/lib/status";
import { formatDate } from "@/lib/utils";
import type { Learner } from "@/types";

interface ProfileSectionProps {
  learner: Learner;
}

export function ProfileSection({ learner }: ProfileSectionProps) {
  const statusCfg = STATUS_CONFIG[learner.status];

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <User className="h-5 w-5 text-or" />
        <h2 className="font-serif text-lg text-ivoire">Informations personnelles</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 text-sm">
        <div>
          <p className="text-cendre">Nom</p>
          <p className="text-ivoire">{learner.firstName} {learner.lastName}</p>
        </div>
        <div>
          <p className="text-cendre">Email</p>
          <p className="text-ivoire">{learner.email}</p>
        </div>
        <div>
          <p className="text-cendre">Telephone</p>
          <p className="text-ivoire">{learner.phone}</p>
        </div>
        <div>
          <p className="text-cendre">Statut</p>
          <Badge
            variant={
              learner.status === "certifie" ? "gold"
                : learner.status === "inscrit" ? "success"
                : learner.status === "bloque" ? "error"
                : "info"
            }
          >
            {statusCfg.label}
          </Badge>
        </div>
        <div>
          <p className="text-cendre">Inscrit le</p>
          <p className="text-ivoire">{formatDate(learner.createdAt)}</p>
        </div>
      </div>
    </Card>
  );
}
