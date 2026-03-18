"use client";

import { useState, useEffect } from "react";
import { FileText, Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getDocuments } from "@/services/documents";
import { formatDate } from "@/lib/utils";
import type { Document } from "@/types";

const typeLabels: Record<string, string> = {
  contrat: "Contrat",
  facture: "Facture",
  attestation: "Attestation",
  autre: "Autre",
};

const typeVariants: Record<string, "default" | "info" | "gold" | "success"> = {
  contrat: "info",
  facture: "default",
  attestation: "gold",
  autre: "default",
};

export default function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    if (user?.id) getDocuments(user.id).then(setDocuments);
  }, [user?.id]);

  // Group by type
  const grouped = documents.reduce<Record<string, Document[]>>((acc, doc) => {
    if (!acc[doc.type]) acc[doc.type] = [];
    acc[doc.type].push(doc);
    return acc;
  }, {});

  return (
    <LearnerShell>
      <div className="space-y-6">
        <ScrollReveal>
          <div>
            <h1 className="font-serif text-2xl text-ivoire">Mes documents</h1>
            <p className="mt-1 text-sm text-cendre">
              Contrats, factures et attestations
            </p>
          </div>
        </ScrollReveal>

        {documents.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title="Aucun document"
            description="Vos documents apparaîtront ici."
          />
        ) : (
          Object.entries(grouped).map(([type, docs]) => (
            <ScrollReveal key={type}>
              <div>
                <h2 className="mb-3 font-serif text-lg text-ivoire">
                  {typeLabels[type] || type}
                </h2>
                <div className="space-y-2">
                  {docs.map((doc) => (
                    <Card key={doc.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-or" />
                          <div>
                            <p className="text-sm font-medium text-ivoire">{doc.title}</p>
                            <p className="text-xs text-cendre">
                              {doc.fileName} • {formatDate(doc.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={typeVariants[doc.type]}>
                            {typeLabels[doc.type]}
                          </Badge>
                          <button className="rounded-lg p-2 text-cendre hover:text-or transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))
        )}
      </div>
    </LearnerShell>
  );
}
