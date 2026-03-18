"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, GripVertical } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getModules } from "@/services/modules";
import { formatDuration } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { Module } from "@/types";

export default function ModulesListPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const router = useRouter();

  useEffect(() => {
    getModules().then(setModules);
  }, []);

  return (
    <AdminShell
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Contenus", href: "/admin/contenus" },
        { label: "Modules" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-ivoire">Modules de formation</h1>
            <p className="mt-1 text-sm text-cendre">{modules.length} modules</p>
          </div>
          <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
            Nouveau module
          </Button>
        </div>

        <div className="space-y-3">
          {modules.map((mod, i) => (
            <ScrollReveal key={mod.id} delay={i * 0.05}>
              <Card
                variant="interactive"
                onClick={() => router.push(ROUTES.admin.module(mod.id))}
              >
                <div className="flex items-center gap-4">
                  <GripVertical className="h-5 w-5 shrink-0 text-pierre cursor-grab" />
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-or/10 font-serif text-lg text-or">
                    {mod.order}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-ivoire">{mod.title}</h3>
                    <p className="mt-0.5 text-sm text-cendre line-clamp-1">
                      {mod.description}
                    </p>
                  </div>
                  <div className="hidden items-center gap-3 sm:flex">
                    <span className="text-sm text-cendre">{mod.videosCount} vidéos</span>
                    <span className="text-sm text-pierre">•</span>
                    <span className="text-sm text-cendre">{formatDuration(mod.totalDuration)}</span>
                    <Badge variant={mod.isPublished ? "success" : "default"}>
                      {mod.isPublished ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
