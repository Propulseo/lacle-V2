"use client";

import { useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Tabs } from "@/components/ui/Tabs";
import { SiteContentEditor } from "@/components/admin/cms/SiteContentEditor";
import { SiteCollectionEditor } from "@/components/admin/cms/SiteCollectionEditor";
import { CONTENT_FIELDS, COLLECTION_SCHEMAS } from "@/lib/cms-schema";
import { ROUTES } from "@/lib/constants";

const VALEURS_TAB = "valeurs";

export default function SiteCmsPage() {
  const [activeTab, setActiveTab] = useState(VALEURS_TAB);

  const tabs = [
    { id: VALEURS_TAB, label: "Valeurs" },
    ...COLLECTION_SCHEMAS.map((schema) => ({ id: schema.type, label: schema.label })),
  ];

  const activeSchema = COLLECTION_SCHEMAS.find((schema) => schema.type === activeTab);

  return (
    <AdminShell
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Contenus", href: ROUTES.admin.contenus },
        { label: "Site vitrine" },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl text-ivoire">Site vitrine</h1>
          <p className="mt-1 text-sm text-cendre">
            Contenu éditable de la page de vente PNL
          </p>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === VALEURS_TAB ? (
          <SiteContentEditor fields={CONTENT_FIELDS} />
        ) : activeSchema ? (
          <SiteCollectionEditor key={activeSchema.type} schema={activeSchema} />
        ) : null}
      </div>
    </AdminShell>
  );
}
