"use client";

import { useState } from "react";
import { FileText, Download, PenLine } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { signVaultDocument } from "@/services/vault";
import { getVaultDownloadUrl } from "./actions";
import type { VaultDocument } from "@/types";

type DocStatus = "disponible" | "en_attente" | "a_signer";

function getDocStatus(doc: VaultDocument): DocStatus {
  if (doc.signatureRequired && !doc.isSigned) return "a_signer";
  if (doc.fileUrl) return "disponible";
  return "en_attente";
}

const STATUS_LABEL: Record<DocStatus, string> = {
  disponible: "Disponible",
  en_attente: "En attente",
  a_signer: "À signer",
};

const STATUS_VARIANT: Record<DocStatus, "success" | "default" | "error"> = {
  disponible: "success",
  en_attente: "default",
  a_signer: "error",
};

interface VaultDocRowProps {
  doc: VaultDocument;
  /** Notifie un message a afficher (toast) au parent. */
  onNotify: (message: string, variant: "success" | "error") => void;
  /** Notifie une signature reussie pour rafraichir l'etat. */
  onSigned: (vaultDocumentId: string, signedAt: Date) => void;
}

export function VaultDocRow({ doc, onNotify, onSigned }: VaultDocRowProps) {
  const status = getDocStatus(doc);
  const [downloading, setDownloading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      // URL signee generee server-side apres verification du deverrouillage.
      const { url } = await getVaultDownloadUrl(doc.id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      onNotify("Le téléchargement a échoué. Réessayez dans un instant.", "error");
    } finally {
      setDownloading(false);
    }
  }

  async function handleSign() {
    const signedAt = await signVaultDocument(doc.id);
    onSigned(doc.id, signedAt);
    onNotify("Document signé. Une copie horodatée est conservée dans votre coffre.", "success");
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <FileText className="h-5 w-5 shrink-0 text-or" />
          <p className="truncate text-sm font-medium text-ivoire">{doc.title}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
          {status === "a_signer" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => setConfirmOpen(true)}
            >
              <PenLine className="mr-1 h-4 w-4" />
              Signer
            </Button>
          )}
          {status === "disponible" && (
            <button
              type="button"
              aria-label={`Télécharger ${doc.title}`}
              disabled={downloading}
              className="rounded-lg p-2 text-cendre transition-colors hover:text-or disabled:opacity-50"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSign}
        title="Signer ce document"
        message={`En signant « ${doc.title} », vous reconnaissez en avoir pris connaissance et l'accepter. Cette signature est horodatée et conservée à des fins de conformité.`}
        confirmLabel="Je signe"
        variant="default"
        errorMessage="La signature a échoué. Vérifiez que le document est bien disponible."
      />
    </Card>
  );
}
