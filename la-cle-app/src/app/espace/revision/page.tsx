"use client";

import { useState } from "react";
import { FileText, HelpCircle, Video, ExternalLink } from "lucide-react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { Expandable } from "@/components/ui/Expandable";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getRevisionResources } from "@/services/revision";
import type { RevisionResource } from "@/types";

const typeIcons = {
  pdf: FileText,
  question: HelpCircle,
  video: Video,
};

export default function RevisionPage() {
  const [activeTab, setActiveTab] = useState("all");
  const resourcesState = useAsyncData(() => getRevisionResources(), []);

  return (
    <LearnerShell>
      <div className="space-y-6">
        <ScrollReveal>
          <div>
            <h1 className="font-serif text-2xl text-ivoire">Coffre de revision</h1>
            <p className="mt-1 text-sm text-cendre">
              Ressources complementaires pour consolider vos apprentissages
            </p>
          </div>
        </ScrollReveal>

        <AsyncBoundary state={resourcesState}>
          {(resources) => <RevisionContent resources={resources} activeTab={activeTab} setActiveTab={setActiveTab} />}
        </AsyncBoundary>
      </div>
    </LearnerShell>
  );
}

function RevisionContent({ resources, activeTab, setActiveTab }: {
  resources: RevisionResource[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const filtered = activeTab === "all" ? resources : resources.filter((r) => r.type === activeTab);

  const tabs = [
    { id: "all", label: "Tout", count: resources.length },
    { id: "pdf", label: "Fiches", count: resources.filter((r) => r.type === "pdf").length },
    { id: "question", label: "Questions", count: resources.filter((r) => r.type === "question").length },
    { id: "video", label: "Videos", count: resources.filter((r) => r.type === "video").length },
  ];

  return (
    <>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((resource, i) => {
          const Icon = typeIcons[resource.type];
          return (
            <ScrollReveal key={resource.id} delay={i * 0.05}>
              <Card className="h-full">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-or/10 p-2.5 text-or">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-ivoire">{resource.title}</h3>
                    <p className="mt-1 text-xs text-cendre">{resource.description}</p>
                    {resource.type === "question" && resource.answer && (
                      <Expandable title="Voir la reponse" defaultOpen={false}>
                        <p className="text-sm">{resource.answer}</p>
                      </Expandable>
                    )}
                    {resource.type !== "question" && (
                      <button type="button" className="mt-2 inline-flex items-center gap-1 text-xs text-or hover:text-or-doux transition-colors">
                        <ExternalLink className="h-3 w-3" />
                        Ouvrir
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          );
        })}
      </div>
    </>
  );
}
