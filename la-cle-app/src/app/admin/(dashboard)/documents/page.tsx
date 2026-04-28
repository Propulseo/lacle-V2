"use client";

import { useState } from "react";
import { FileText, Plus, Reply } from "lucide-react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { AdminShell } from "@/components/layout/AdminShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { SearchInput } from "@/components/ui/SearchInput";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getDocuments, getSupportMessages } from "@/services/documents";
import { formatDate } from "@/lib/utils";

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("documents");
  const [search, setSearch] = useState("");

  const pageState = useAsyncData(async () => {
    const [documents, messages] = await Promise.all([
      getDocuments(),
      getSupportMessages(),
    ]);
    return { documents, messages };
  }, []);

  return (
    <AdminShell
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Documents" },
      ]}
    >
      <div className="space-y-6">
        <AsyncBoundary state={pageState}>
          {({ documents, messages }) => {
            const unreplied = messages.filter((m) => !m.reply);
            const filteredDocs = search
              ? documents.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()) || d.learnerName.toLowerCase().includes(search.toLowerCase()))
              : documents;

            const tabs = [
              { id: "documents", label: "Documents", count: documents.length },
              { id: "support", label: "Support", count: unreplied.length },
            ];

            return (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-serif text-2xl text-ivoire">Documents & Support</h1>
                    <p className="mt-1 text-sm text-cendre">{documents.length} documents &bull; {unreplied.length} message(s) en attente</p>
                  </div>
                  <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>Ajouter un document</Button>
                </div>

                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                {activeTab === "documents" && (
                  <>
                    <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un document..." />
                    <div className="space-y-2">
                      {filteredDocs.map((doc, i) => (
                        <ScrollReveal key={doc.id} delay={i * 0.03}>
                          <Card>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-or" />
                                <div>
                                  <p className="text-sm font-medium text-ivoire">{doc.title}</p>
                                  <p className="text-xs text-cendre">{doc.learnerName} &bull; {doc.fileName} &bull; {formatDate(doc.uploadedAt)}</p>
                                </div>
                              </div>
                              <Badge variant="default">{doc.type}</Badge>
                            </div>
                          </Card>
                        </ScrollReveal>
                      ))}
                    </div>
                  </>
                )}

                {activeTab === "support" && (
                  <div className="space-y-3">
                    {messages.map((msg, i) => (
                      <ScrollReveal key={msg.id} delay={i * 0.05}>
                        <Card>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-ivoire">{msg.subject}</p>
                              <p className="text-xs text-cendre">{msg.learnerName} &bull; {formatDate(msg.createdAt)}</p>
                            </div>
                            <Badge variant={msg.reply ? "success" : "warning"}>{msg.reply ? "Repondu" : "En attente"}</Badge>
                          </div>
                          <p className="text-sm text-cendre">{msg.message}</p>
                          {msg.reply && (
                            <div className="mt-3 rounded-lg bg-surface p-3">
                              <p className="text-xs text-pierre mb-1 flex items-center gap-1"><Reply className="h-3 w-3" /> Reponse</p>
                              <p className="text-sm text-ivoire">{msg.reply}</p>
                            </div>
                          )}
                          {!msg.reply && (
                            <div className="mt-3"><Button size="sm" icon={<Reply className="h-4 w-4" />}>Repondre</Button></div>
                          )}
                        </Card>
                      </ScrollReveal>
                    ))}
                  </div>
                )}
              </>
            );
          }}
        </AsyncBoundary>
      </div>
    </AdminShell>
  );
}
