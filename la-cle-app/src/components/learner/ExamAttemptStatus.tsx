"use client";

import { useState, useEffect } from "react";
import { Clock, Lock, Mail } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import type { ExamStatus } from "@/lib/exam-logic";
import type { ExamType } from "@/types";

interface ExamAttemptStatusProps {
  status: ExamStatus;
  examType: ExamType;
}

function Countdown({ until }: { until: Date }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, until.getTime() - Date.now()));

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setInterval(() => {
      const diff = Math.max(0, until.getTime() - Date.now());
      setRemaining(diff);
      if (diff <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [until, remaining]);

  const totalSec = Math.ceil(remaining / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;

  return (
    <span className="tabular-nums font-medium text-or">
      {String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}
    </span>
  );
}

function formatBlockDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function ExamAttemptStatus({ status, examType }: ExamAttemptStatusProps) {
  if (status.canAttempt) return null;

  if (status.isDefinitivelyBlocked) {
    return (
      <Card className="text-center">
        <Lock className="mx-auto h-10 w-10 text-erreur" />
        <h3 className="mt-3 font-serif text-lg text-ivoire">
          Toutes les tentatives utilisees
        </h3>
        <p className="mt-2 text-sm text-cendre">
          {examType === "final"
            ? "Vous avez utilise vos 4 tentatives pour l'examen final. Contactez l'institut pour convenir de la suite."
            : "Vous avez atteint le nombre maximum de tentatives. Contactez-nous pour en discuter."}
        </p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => window.location.href = "mailto:contact@institutlacle.fr"}
        >
          <Mail className="mr-2 h-4 w-4" />
          Nous contacter
        </Button>
      </Card>
    );
  }

  if (status.isBlocked && status.blockedUntil) {
    const remaining = status.blockedUntil.getTime() - Date.now();
    const isShortWait = remaining > 0 && remaining <= 60 * 60 * 1000;

    return (
      <Alert variant="warning" title="Tentative en attente">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0" />
          {isShortWait ? (
            <span>
              Prochaine tentative dans <Countdown until={status.blockedUntil} />
            </span>
          ) : (
            <span>
              Prochaine tentative le {formatBlockDate(status.blockedUntil)}
            </span>
          )}
        </div>
        {examType === "module" && status.attemptsToday >= 5 && (
          <p className="mt-2 text-xs">
            Vous avez utilise vos 5 tentatives sur 24h. Profitez de ce temps pour revoir vos cours.
          </p>
        )}
      </Alert>
    );
  }

  return null;
}
