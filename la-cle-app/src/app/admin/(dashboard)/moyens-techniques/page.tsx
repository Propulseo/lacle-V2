"use client";

import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Server,
  Mail,
  BookOpen,
  Shield,
  HeadphonesIcon,
  Printer,
} from "lucide-react";

// TODO // Qualiopi Ind.17: cette page documente les moyens techniques pour preuve d'audit

const sections = [
  {
    icon: Server,
    title: "Plateforme LMS",
    items: [
      { label: "Application", value: "La Clé LMS — plateforme propriétaire" },
      { label: "Hébergement", value: "Vercel (CDN mondial, HTTPS, haute disponibilité)" },
      { label: "Base de données", value: "Supabase (PostgreSQL managée, chiffrement au repos)" },
      { label: "Stockage fichiers", value: "Supabase Storage (documents, vidéos)" },
    ],
  },
  {
    icon: Mail,
    title: "Outils emailing",
    items: [
      { label: "Service transactionnel", value: "Resend (emails automatisés, sécurisés)" },
      { label: "Adresse de contact", value: "contact@institutlacle.fr" },
      { label: "Délai de réponse", value: "48h ouvrées maximum" },
    ],
  },
  {
    icon: BookOpen,
    title: "Suivi pédagogique",
    items: [
      { label: "Progression", value: "Suivi en temps réel par capsule vidéo et par module" },
      { label: "Évaluations", value: "QCM inter-capsules, examens de module, examen final" },
      { label: "Engagement", value: "Dashboard anti-décrochage avec alertes automatiques" },
      { label: "Satisfaction", value: "Questionnaires à chaud (post-examen) et à froid (J+90)" },
    ],
  },
  {
    icon: Shield,
    title: "Continuité de service",
    items: [
      { label: "Sauvegardes", value: "Quotidiennes automatiques (base de données + fichiers)" },
      { label: "Procédure panne", value: "Email contact@institutlacle.fr + message d'alerte affiché sur la plateforme" },
      { label: "Délai de rétablissement", value: "24h maximum en cas d'incident majeur" },
    ],
  },
  {
    icon: HeadphonesIcon,
    title: "Support utilisateur",
    items: [
      { label: "Email", value: "contact@institutlacle.fr" },
      { label: "Signalement intégré", value: "Bouton de signalement de bugs dans l'espace apprenant" },
      { label: "Référent handicap", value: "contact@institutlacle.fr (Qualiopi Ind.26)" },
    ],
  },
];

export default function MoyensTechniquesPage() {
  return (
    <AdminShell
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Moyens techniques" },
      ]}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl text-ivoire">Moyens techniques</h1>
            <p className="mt-1 text-sm text-cendre">
              Ressources et outils mobilisés pour la formation à distance
            </p>
          </div>
          <Button
            variant="default"
            size="sm"
            icon={<Printer className="h-4 w-4" />}
            onClick={() => window.print()}
          >
            Imprimer
          </Button>
        </div>

        {sections.map((section) => (
          <Card key={section.title}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-or/10">
                <section.icon className="h-4 w-4 text-or" />
              </div>
              <h3 className="font-serif text-lg text-ivoire">{section.title}</h3>
            </div>
            <dl className="space-y-3">
              {section.items.map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                  <dt className="shrink-0 text-sm font-medium text-cendre sm:w-48">
                    {item.label}
                  </dt>
                  <dd className="text-sm text-ivoire">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
