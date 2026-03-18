"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, HelpCircle, Video, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getRevisionResources } from "@/services/revision";
import type { RevisionResource } from "@/types";

const typeIcons = {
  pdf: FileText,
  question: HelpCircle,
  video: Video,
};

const typeLabels = {
  pdf: "PDF",
  question: "Question",
  video: "Vidéo",
};

export default function CoffrePage() {
  const [resources, setResources] = useState<RevisionResource[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    getRevisionResources().then(setResources);
  }, []);

  const filtered =
    activeTab === "all" ? resources : resources.filter((r) => r.type === activeTab);

  const tabs = [
    { id: "all", label: "Tout", count: resources.length },
    { id: "pdf", label: "PDF", count: resources.filter((r) => r.type === "pdf").length },
    { id: "question", label: "Questions", count: resources.filter((r) => r.type === "question").length },
    { id: "video", label: "Vidéos", count: resources.filter((r) => r.type === "video").length },
  ];

  return (
    <AdminShell
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Contenus", href: "/admin/contenus" },
        { label: "Coffre de révision" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-ivoire">Coffre de révision</h1>
            <p className="mt-1 text-sm text-cendre">
              Ressources complémentaires pour les apprenants
            </p>
          </div>
          <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>
            Ajouter
          </Button>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {filtered.length === 0 ? (
          <EmptyState title="Aucune ressource" description="Ajoutez des ressources de révision." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((resource, i) => {
              const Icon = typeIcons[resource.type];
              return (
                <ScrollReveal key={resource.id} delay={i * 0.05}>
                  <Card className="h-full">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-or/10 p-2 text-or">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-ivoire">{resource.title}</h3>
                        <p className="mt-1 text-xs text-cendre line-clamp-2">{resource.description}</p>
                        <Badge variant="default" className="mt-2">
                          {typeLabels[resource.type]}
                        </Badge>
                      </div>
                      <button className="text-pierre hover:text-erreur transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
