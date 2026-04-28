"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

export function BugReportButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [showToast, setShowToast] = useState(false);

  function handleSubmit() {
    if (description.length < 10) return;
    // TODO // Supabase: INSERT dans bug_reports (userId, url, description, createdAt)
    // TODO // Resend: notifier contact@institutlacle.fr avec les details
    setDescription("");
    setIsOpen(false);
    setShowToast(true);
  }

  function handleClose() {
    setDescription("");
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Signaler un probleme"
        className="fixed bottom-20 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-filet bg-encre/80 text-cendre backdrop-blur-sm transition-colors hover:text-ivoire md:bottom-4"
      >
        <TriangleAlert className="h-4 w-4" />
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="Signaler un probleme" size="md">
        <div className="space-y-4">
          <Textarea
            label="Decrivez le probleme rencontre"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Decrivez ce qui ne fonctionne pas..."
            rows={4}
          />
          <Input
            label="Page concernee"
            value={pathname}
            readOnly
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={description.length < 10}
            >
              Envoyer le signalement
            </Button>
          </div>
        </div>
      </Modal>

      <Toast
        message="Signalement envoye — merci, on s'en occupe !"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
