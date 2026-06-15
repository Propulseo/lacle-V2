"use client";

import { Users, Target, Activity } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getAnalytics } from "@/services/analytics";

function fullName(first: string | null, last: string | null) {
  return [first, last].filter(Boolean).join(" ") || "—";
}

export default function AnalyticsPage() {
  const { data, loading, error } = useAsyncData(() => getAnalytics(), []);

  const notions = data?.notions ?? [];
  const learners = data?.learners ?? [];
  const engagement = data?.engagement ?? [];

  const ratedNotions = notions.filter((n) => n.correct_rate_pct != null);
  const avgRate =
    ratedNotions.length > 0
      ? Math.round(ratedNotions.reduce((s, n) => s + Number(n.correct_rate_pct), 0) / ratedNotions.length)
      : null;
  const actifs = engagement.filter((e) => e.status === "actif").length;

  return (
    <AdminShell
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Analytics" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl text-ivoire">Analytics pédagogiques</h1>
          <p className="mt-1 text-sm text-cendre">
            Double lecture : réussite par notion et avancement par apprenant.
          </p>
        </div>

        {error && <Alert variant="error">Erreur de chargement : {error.message}</Alert>}
        {loading && <p className="text-sm text-cendre">Chargement…</p>}

        {data && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Apprenants suivis" value={learners.length} icon={<Users className="h-5 w-5" />} />
              <StatCard label="Taux de réussite moyen" value={avgRate != null ? `${avgRate}%` : "—"} icon={<Target className="h-5 w-5" />} />
              <StatCard label="Apprenants actifs" value={actifs} icon={<Activity className="h-5 w-5" />} />
            </div>

            {/* Par notion */}
            <Card>
              <h2 className="mb-4 font-serif text-lg text-ivoire">Réussite par notion</h2>
              {notions.length === 0 ? (
                <EmptyState title="Aucune donnée" description="Les statistiques par notion apparaîtront dès que les apprenants répondront aux questions." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-filet text-left text-pierre">
                        <th className="py-2 pr-4 font-medium">Notion</th>
                        <th className="py-2 pr-4 font-medium">Réponses</th>
                        <th className="py-2 pr-4 font-medium">Correctes</th>
                        <th className="py-2 font-medium">Taux</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notions.map((n) => (
                        <tr key={n.notion_id ?? n.notion_label} className="border-b border-filet/50">
                          <td className="py-2 pr-4 text-ivoire">{n.notion_label}</td>
                          <td className="py-2 pr-4 text-cendre">{n.total_responses ?? 0}</td>
                          <td className="py-2 pr-4 text-cendre">{n.correct_responses ?? 0}</td>
                          <td className="py-2 text-or">{n.correct_rate_pct != null ? `${n.correct_rate_pct}%` : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Par apprenant */}
            <Card>
              <h2 className="mb-4 font-serif text-lg text-ivoire">Avancement par apprenant</h2>
              {learners.length === 0 ? (
                <EmptyState title="Aucun apprenant inscrit" description="L'avancement apparaîtra dès qu'un apprenant sera inscrit à la formation." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-filet text-left text-pierre">
                        <th className="py-2 pr-4 font-medium">Apprenant</th>
                        <th className="py-2 pr-4 font-medium">Statut</th>
                        <th className="py-2 pr-4 font-medium">Cours complétés</th>
                        <th className="py-2 font-medium">Blocs validés</th>
                      </tr>
                    </thead>
                    <tbody>
                      {learners.map((l) => (
                        <tr key={`${l.learner_id}-${l.formation_id}`} className="border-b border-filet/50">
                          <td className="py-2 pr-4 text-ivoire">{fullName(l.first_name, l.last_name)}</td>
                          <td className="py-2 pr-4 text-cendre">{l.enrollment_status ?? "—"}</td>
                          <td className="py-2 pr-4 text-cendre">{l.cours_completes ?? 0}</td>
                          <td className="py-2 text-cendre">{l.blocs_valides ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Engagement */}
            <Card>
              <h2 className="mb-4 font-serif text-lg text-ivoire">Assiduité</h2>
              {engagement.length === 0 ? (
                <EmptyState title="Aucun suivi d'engagement" description="Le suivi d'assiduité se remplit au fil des connexions et de la progression." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-filet text-left text-pierre">
                        <th className="py-2 pr-4 font-medium">Apprenant</th>
                        <th className="py-2 pr-4 font-medium">Statut</th>
                        <th className="py-2 font-medium">Jours d&apos;inactivité</th>
                      </tr>
                    </thead>
                    <tbody>
                      {engagement.map((e) => (
                        <tr key={e.learner_id} className="border-b border-filet/50">
                          <td className="py-2 pr-4 text-ivoire">{fullName(e.first_name, e.last_name)}</td>
                          <td className="py-2 pr-4 text-cendre">{e.status ?? "—"}</td>
                          <td className="py-2 text-cendre">{e.days_since_last_activity ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </AdminShell>
  );
}
