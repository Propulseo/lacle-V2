"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getVaultDocuments } from "@/services/vault";
import type { VaultDocument } from "@/types";

const VAULT_TABS = [
  { id: "contractuels", label: "Contractuels" },
  { id: "financiers", label: "Financiers" },
  { id: "pedagogiques", label: "Pedagogiques" },
  { id: "qualite", label: "Qualite" },
  { id: "pratiques", label: "Pratiques" },
];

type DocStatus = "disponible" | "en_attente" | "a_signer";

function getDocStatus(doc: VaultDocument): DocStatus {
  if (doc.signatureRequired && !doc.isSigned) return "a_signer";
  if (doc.fileUrl) return "disponible";
  return "en_attente";
}

const STATUS_LABEL: Record<DocStatus, string> = {
  disponible: "Disponible",
  en_attente: "En attente",
  a_signer: "A signer",
};

const STATUS_VARIANT: Record<DocStatus, "success" | "default" | "error"> = {
  disponible: "success",
  en_attente: "default",
  a_signer: "error",
};

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("contractuels");
  // TODO // Supabase: filtrer par student_id et availableFrom selon le statut
  const docsState = useAsyncData(() => getVaultDocuments(), []);

  return (
    <LearnerShell>
      <div className="space-y-6">
        <ScrollReveal>
          <div>
            <h1 className="font-serif text-2xl text-ivoire">Mes documents</h1>
            <p className="mt-1 text-sm text-cendre">
              Contrats, factures, attestations et documents pratiques
            </p>
          </div>
        </ScrollReveal>

        <AsyncBoundary state={docsState}>
          {(documents) => {
            const filtered = documents.filter((d) => d.category === activeTab);
            const tabsWithCount = VAULT_TABS.map((t) => ({
              ...t,
              count: documents.filter((d) => d.category === t.id).length,
            }));

            return (
              <>
                <Tabs tabs={tabsWithCount} activeTab={activeTab} onChange={setActiveTab} className="overflow-x-auto" />

                {filtered.length === 0 ? (
                  <EmptyState
                    icon={<FileText className="h-12 w-12" />}
                    title="Aucun document"
                    description="Les documents de cette categorie apparaitront ici."
                  />
                ) : (
                  <div className="space-y-2">
                    {filtered.map((doc, i) => (
                      <ScrollReveal key={doc.id} delay={i * 0.05}>
                        <VaultDocRow doc={doc} />
                      </ScrollReveal>
                    ))}
                  </div>
                )}
              </>
            );
          }}
        </AsyncBoundary>
      </div>
    </LearnerShell>
  );
}

function VaultDocRow({ doc }: { doc: VaultDocument }) {
  const status = getDocStatus(doc);

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="h-5 w-5 shrink-0 text-or" />
          <p className="truncate text-sm font-medium text-ivoire">{doc.title}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
          {status === "disponible" && (
            <button
              type="button"
              aria-label="Telecharger"
              className="rounded-lg p-2 text-cendre transition-colors hover:text-or"
              onClick={() => {
                // TODO // Supabase Storage: URL reelle du fichier
                if (doc.fileUrl) window.open(doc.fileUrl, "_blank");
              }}
            >
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
