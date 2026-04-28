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
      { label: "Application", value: "La Cle LMS — plateforme proprietaire" },
      { label: "Hebergement", value: "Vercel (CDN mondial, HTTPS, haute disponibilite)" },
      { label: "Base de donnees", value: "Supabase (PostgreSQL managee, chiffrement au repos)" },
      { label: "Stockage fichiers", value: "Supabase Storage (documents, videos)" },
    ],
  },
  {
    icon: Mail,
    title: "Outils emailing",
    items: [
      { label: "Service transactionnel", value: "Resend (emails automatises, securises)" },
      { label: "Adresse de contact", value: "contact@institutlacle.fr" },
      { label: "Delai de reponse", value: "48h ouvrees maximum" },
    ],
  },
  {
    icon: BookOpen,
    title: "Suivi pedagogique",
    items: [
      { label: "Progression", value: "Suivi en temps reel par capsule video et par module" },
      { label: "Evaluations", value: "QCM inter-capsules, examens de module, examen final" },
      { label: "Engagement", value: "Dashboard anti-decrochage avec alertes automatiques" },
      { label: "Satisfaction", value: "Questionnaires a chaud (post-examen) et a froid (J+90)" },
    ],
  },
  {
    icon: Shield,
    title: "Continuite de service",
    items: [
      { label: "Sauvegardes", value: "Quotidiennes automatiques (base de donnees + fichiers)" },
      { label: "Procedure panne", value: "Email contact@institutlacle.fr + message d'alerte affiche sur la plateforme" },
      { label: "Delai de retablissement", value: "24h maximum en cas d'incident majeur" },
    ],
  },
  {
    icon: HeadphonesIcon,
    title: "Support utilisateur",
    items: [
      { label: "Email", value: "contact@institutlacle.fr" },
      { label: "Signalement integre", value: "Bouton de signalement de bugs dans l'espace apprenant" },
      { label: "Referent handicap", value: "contact@institutlacle.fr (Qualiopi Ind.26)" },
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
              Ressources et outils mobilises pour la formation a distance
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
