"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Award, Archive } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/lib/constants";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const cards = [
  {
    title: "Modules de formation",
    description: "Gérez les modules, vidéos et examens modulaires",
    icon: BookOpen,
    href: ROUTES.admin.modules,
    count: "3 modules",
  },
  {
    title: "Examen final",
    description: "Gérez les demandes et planification de l'examen final",
    icon: Award,
    href: ROUTES.admin.examenFinal,
    count: "1 en attente",
  },
  {
    title: "Coffre de révision",
    description: "Ressources complémentaires pour les apprenants",
    icon: Archive,
    href: ROUTES.admin.coffre,
    count: "6 ressources",
  },
];

export default function ContenusHubPage() {
  const router = useRouter();

  return (
    <AdminShell
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Contenus" },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl text-ivoire">Gestion des contenus</h1>
          <p className="mt-1 text-sm text-cendre">
            Modules, examens et ressources pédagogiques
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <ScrollReveal key={card.href} delay={i * 0.1}>
              <Card
                variant="interactive"
                onClick={() => router.push(card.href)}
                className="h-full"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-or/10 p-3 text-or">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-ivoire">{card.title}</h3>
                    <p className="mt-1 text-sm text-cendre">{card.description}</p>
                    <p className="mt-2 text-xs text-or">{card.count}</p>
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
