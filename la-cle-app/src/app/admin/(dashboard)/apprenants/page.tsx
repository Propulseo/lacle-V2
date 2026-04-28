"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AdminShell } from "@/components/layout/AdminShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getLearners } from "@/services/learners";
import { STATUS_CONFIG } from "@/lib/status";
import { formatDate } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { Learner } from "@/types";

const columns: Column<Learner>[] = [
  {
    key: "name", header: "Apprenant", sortable: true,
    sortValue: (l) => `${l.lastName} ${l.firstName}`,
    render: (l) => (<div><p className="font-medium">{l.firstName} {l.lastName}</p><p className="text-xs text-cendre">{l.email}</p></div>),
  },
  {
    key: "status", header: "Statut", sortable: true, sortValue: (l) => l.status,
    render: (l) => {
      const cfg = STATUS_CONFIG[l.status];
      return <Badge variant={l.status === "certifie" ? "gold" : l.status === "inscrit" ? "success" : l.status === "bloque" ? "error" : "info"}>{cfg.label}</Badge>;
    },
  },
  {
    key: "progression", header: "Progression", className: "w-48",
    render: (l) => <ProgressBar value={l.progression.overallPercent} showLabel size="sm" />,
  },
  {
    key: "createdAt", header: "Inscrit le", sortable: true, sortValue: (l) => l.createdAt,
    render: (l) => <span className="text-sm text-cendre">{formatDate(l.createdAt)}</span>,
  },
  {
    key: "active", header: "Actif", className: "w-16",
    render: (l) => <span className={`h-2 w-2 rounded-full inline-block ${l.isActive ? "bg-succes" : "bg-erreur"}`} />,
  },
];

export default function ApprenantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const router = useRouter();
  const learnersState = useAsyncData(() => getLearners(), []);

  return (
    <AdminShell breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Apprenants" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-ivoire">Apprenants</h1>
            <p className="mt-1 text-sm text-cendre">{learnersState.data?.length ?? 0} inscrits</p>
          </div>
          <Button variant="primary" icon={<Plus className="h-4 w-4" />} href={ROUTES.admin.nouveauApprenant}>Nouveau</Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher par nom ou email..." className="flex-1" />
          <Select
            options={[{ value: "", label: "Tous les statuts" }, ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48"
          />
        </div>

        <AsyncBoundary state={learnersState}>
          {(learners) => {
            let filtered = learners;
            if (search) {
              const s = search.toLowerCase();
              filtered = filtered.filter((l) => l.firstName.toLowerCase().includes(s) || l.lastName.toLowerCase().includes(s) || l.email.toLowerCase().includes(s));
            }
            if (statusFilter) filtered = filtered.filter((l) => l.status === statusFilter);

            return (
              <DataTable data={filtered} columns={columns} keyExtractor={(l) => l.id} onRowClick={(l) => router.push(ROUTES.admin.apprenant(l.id))} emptyMessage="Aucun apprenant trouve" />
            );
          }}
        </AsyncBoundary>
      </div>
    </AdminShell>
  );
}
