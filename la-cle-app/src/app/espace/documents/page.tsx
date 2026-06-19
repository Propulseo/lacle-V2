"use client";

import { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Toast } from "@/components/ui/Toast";
import { getVaultDocuments } from "@/services/vault";
import { VaultDocRow } from "./VaultDocRow";
import type { VaultDocument } from "@/types";

const VAULT_TABS = [
  { id: "contractuels", label: "Contractuels" },
  { id: "financiers", label: "Financiers" },
  { id: "pedagogiques", label: "Pédagogiques" },
  { id: "qualite", label: "Qualité" },
  { id: "pratiques", label: "Pratiques" },
];

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("contractuels");
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null);
  // Etat local des signatures effectuees pendant la session (re-render immediat sans refetch).
  const [signedNow, setSignedNow] = useState<Map<string, Date>>(new Map());

  const docsState = useAsyncData(() => getVaultDocuments(), []);

  function handleSigned(vaultDocumentId: string, signedAt: Date) {
    setSignedNow((prev) => new Map(prev).set(vaultDocumentId, signedAt));
  }

  // Fusionne les signatures faites pendant la session avec l'etat charge.
  const documents = useMemo<VaultDocument[]>(() => {
    const base = docsState.data ?? [];
    if (signedNow.size === 0) return base;
    return base.map((d) => {
      const at = signedNow.get(d.id);
      return at ? { ...d, isSigned: true, signedAt: at } : d;
    });
  }, [docsState.data, signedNow]);

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

        <AsyncBoundary state={docsState} loadingLabel="Chargement de vos documents…">
          {() => {
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
                    description="Les documents de cette catégorie apparaîtront ici."
                  />
                ) : (
                  <div className="space-y-2">
                    {filtered.map((doc, i) => (
                      <ScrollReveal key={doc.id} delay={i * 0.05}>
                        <VaultDocRow
                          doc={doc}
                          onNotify={(message, variant) => setToast({ message, variant })}
                          onSigned={handleSigned}
                        />
                      </ScrollReveal>
                    ))}
                  </div>
                )}
              </>
            );
          }}
        </AsyncBoundary>
      </div>

      <Toast
        message={toast?.message ?? ""}
        isVisible={toast !== null}
        variant={toast?.variant ?? "success"}
        onClose={() => setToast(null)}
      />
    </LearnerShell>
  );
}
