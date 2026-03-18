"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Users, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getSessions, registerForSession } from "@/services/sessions";
import { getLearner } from "@/services/learners";
import { hasAccess } from "@/lib/status";
import { formatDate } from "@/lib/utils";
import type { Session, Learner } from "@/types";

export default function PresentielPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [learner, setLearner] = useState<Learner | null>(null);

  useEffect(() => {
    getSessions().then(setSessions);
    if (user?.id) getLearner(user.id).then(setLearner);
  }, [user?.id]);

  const canAccess = learner && hasAccess(learner.status, "valide");
  const isPast = (date: string) => new Date(date) < new Date();

  async function handleRegister(sessionId: string) {
    if (!user) return;
    await registerForSession(sessionId, user.id, `${user.firstName} ${user.lastName}`);
    getSessions().then(setSessions);
  }

  return (
    <LearnerShell>
      <div className="space-y-6">
        <ScrollReveal>
          <div>
            <h1 className="font-serif text-2xl text-ivoire">Sessions présentielles</h1>
            <p className="mt-1 text-sm text-cendre">
              Ateliers pratiques en présentiel
            </p>
          </div>
        </ScrollReveal>

        {!canAccess && (
          <ScrollReveal delay={0.1}>
            <Alert variant="warning" title="Accès restreint">
              Les sessions présentielles sont accessibles aux apprenants ayant validé tous les modules.
            </Alert>
          </ScrollReveal>
        )}

        <div className="space-y-4">
          {sessions.map((session, i) => {
            const past = isPast(session.date);
            const isRegistered = session.registrations.some((r) => r.learnerId === user?.id);
            const isFull = session.registrations.length >= session.maxParticipants;

            return (
              <ScrollReveal key={session.id} delay={i * 0.1}>
                <Card className={!canAccess ? "opacity-60" : ""}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-serif text-lg text-ivoire">{session.title}</h3>
                    <Badge variant={past ? "default" : isRegistered ? "success" : "info"}>
                      {past ? "Passée" : isRegistered ? "Inscrit" : "À venir"}
                    </Badge>
                  </div>
                  <p className="text-sm text-cendre">{session.description}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-cendre">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> {formatDate(session.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {session.startTime} - {session.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {session.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> {session.registrations.length}/{session.maxParticipants}
                    </span>
                  </div>
                  {canAccess && !past && !isRegistered && !isFull && (
                    <div className="mt-4">
                      <Button variant="primary" size="sm" onClick={() => handleRegister(session.id)}>
                        S&apos;inscrire
                      </Button>
                    </div>
                  )}
                  {isFull && !isRegistered && !past && (
                    <p className="mt-3 text-xs text-attention">Session complète</p>
                  )}
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </LearnerShell>
  );
}
