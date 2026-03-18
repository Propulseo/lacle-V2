"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin, Clock, Users, Check, X } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getSessions, markAttendance } from "@/services/sessions";
import { formatDate } from "@/lib/utils";
import type { Session } from "@/types";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    getSessions().then(setSessions);
  }, []);

  const isPast = (date: string) => new Date(date) < new Date();

  return (
    <AdminShell
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Sessions présentielles" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-ivoire">Sessions présentielles</h1>
            <p className="mt-1 text-sm text-cendre">{sessions.length} sessions</p>
          </div>
          <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
            Nouvelle session
          </Button>
        </div>

        <div className="space-y-4">
          {sessions.map((session, i) => {
            const past = isPast(session.date);
            return (
              <ScrollReveal key={session.id} delay={i * 0.1}>
                <Card>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-lg text-ivoire">{session.title}</h3>
                      <p className="mt-1 text-sm text-cendre">{session.description}</p>
                    </div>
                    <Badge variant={past ? "default" : "info"}>
                      {past ? "Passée" : "À venir"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-cendre">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(session.date)} • {session.startTime} - {session.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {session.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {session.registrations.length}/{session.maxParticipants} inscrits
                    </span>
                  </div>

                  {session.registrations.length > 0 && (
                    <div className="mt-4 border-t border-filet pt-4">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-pierre">Inscrits</p>
                      <div className="space-y-2">
                        {session.registrations.map((reg) => (
                          <div key={reg.id} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
                            <span className="text-sm text-ivoire">{reg.learnerName}</span>
                            <div className="flex items-center gap-2">
                              {reg.attended === null && past ? (
                                <>
                                  <button
                                    onClick={() => markAttendance(session.id, reg.id, true).then(() => getSessions().then(setSessions))}
                                    className="rounded p-1 text-succes hover:bg-succes/10"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => markAttendance(session.id, reg.id, false).then(() => getSessions().then(setSessions))}
                                    className="rounded p-1 text-erreur hover:bg-erreur/10"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              ) : reg.attended === true ? (
                                <Badge variant="success">Présent</Badge>
                              ) : reg.attended === false ? (
                                <Badge variant="error">Absent</Badge>
                              ) : (
                                <Badge variant="default">Inscrit</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}
