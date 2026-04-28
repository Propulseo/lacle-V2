"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { createSupportMessage } from "@/services/documents";
import { formatDate } from "@/lib/utils";
import type { SupportMessage } from "@/types";

interface SupportSectionProps {
  userId: string;
  userName: string;
  messages: SupportMessage[];
  onMessageSent: () => void;
}

export function SupportSection({ userId, userName, messages, onMessageSent }: SupportSectionProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createSupportMessage(userId, userName, subject, message);
    setSubject("");
    setMessage("");
    setSent(true);
    onMessageSent();
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="h-5 w-5 text-or" />
        <h2 className="font-serif text-lg text-ivoire">Contacter le support</h2>
      </div>
      {sent && <Alert variant="success" className="mb-4">Message envoye.</Alert>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="Sujet" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        <Textarea label="Message" value={message} onChange={(e) => setMessage(e.target.value)} required />
        <Button type="submit" variant="primary" size="sm">Envoyer</Button>
      </form>

      {messages.length > 0 && (
        <div className="mt-6 border-t border-filet pt-4 space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-pierre">Historique</p>
          {messages.map((msg) => (
            <div key={msg.id} className="rounded-lg bg-surface p-3">
              <p className="text-sm font-medium text-ivoire">{msg.subject}</p>
              <p className="text-xs text-cendre">{formatDate(msg.createdAt)}</p>
              {msg.reply ? (
                <p className="mt-2 text-sm text-succes">Repondu : {msg.reply}</p>
              ) : (
                <Badge variant="warning" className="mt-1">En attente</Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
