"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, MessageSquare, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getLearner } from "@/services/learners";
import { changePassword } from "@/services/auth";
import { createSupportMessage, getSupportMessages } from "@/services/documents";
import { STATUS_CONFIG } from "@/lib/status";
import { formatDate } from "@/lib/utils";
import type { Learner, SupportMessage } from "@/types";

export default function ComptePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [learner, setLearner] = useState<Learner | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    if (user?.id) {
      getLearner(user.id).then(setLearner);
      getSupportMessages(user.id).then(setMessages);
    }
  }, [user?.id]);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    await changePassword(user!.id, newPassword);
    setPasswordSaved(true);
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 3000);
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    await createSupportMessage(user.id, `${user.firstName} ${user.lastName}`, subject, message);
    setSubject("");
    setMessage("");
    setMessageSent(true);
    getSupportMessages(user.id).then(setMessages);
    setTimeout(() => setMessageSent(false), 3000);
  }

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (!learner) return <LearnerShell><div /></LearnerShell>;

  const statusCfg = STATUS_CONFIG[learner.status];

  return (
    <LearnerShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <ScrollReveal>
          <div>
            <h1 className="font-serif text-2xl text-ivoire">Mon compte</h1>
            <p className="mt-1 text-sm text-cendre">Informations et support</p>
          </div>
        </ScrollReveal>

        {/* Profile */}
        <ScrollReveal delay={0.1}>
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <User className="h-5 w-5 text-or" />
              <h2 className="font-serif text-lg text-ivoire">Informations personnelles</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-cendre">Nom</p>
                <p className="text-ivoire">{learner.firstName} {learner.lastName}</p>
              </div>
              <div>
                <p className="text-cendre">Email</p>
                <p className="text-ivoire">{learner.email}</p>
              </div>
              <div>
                <p className="text-cendre">Téléphone</p>
                <p className="text-ivoire">{learner.phone}</p>
              </div>
              <div>
                <p className="text-cendre">Statut</p>
                <Badge variant={learner.status === "certifie" ? "gold" : learner.status === "valide" ? "success" : "info"}>
                  {statusCfg.label}
                </Badge>
              </div>
              <div>
                <p className="text-cendre">Inscrit le</p>
                <p className="text-ivoire">{formatDate(learner.createdAt)}</p>
              </div>
            </div>
          </Card>
        </ScrollReveal>

        {/* Password */}
        <ScrollReveal delay={0.15}>
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-5 w-5 text-or" />
              <h2 className="font-serif text-lg text-ivoire">Changer le mot de passe</h2>
            </div>
            {passwordSaved && <Alert variant="success" className="mb-4">Mot de passe modifié.</Alert>}
            {passwordError && <Alert variant="error" className="mb-4">{passwordError}</Alert>}
            <form onSubmit={handleChangePassword} className="space-y-3">
              <Input
                label="Nouveau mot de passe"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                label="Confirmer"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" size="sm">
                Modifier
              </Button>
            </form>
          </Card>
        </ScrollReveal>

        {/* Support */}
        <ScrollReveal delay={0.2}>
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="h-5 w-5 text-or" />
              <h2 className="font-serif text-lg text-ivoire">Contacter le support</h2>
            </div>
            {messageSent && <Alert variant="success" className="mb-4">Message envoyé.</Alert>}
            <form onSubmit={handleSendMessage} className="space-y-3">
              <Input
                label="Sujet"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
              <Textarea
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" size="sm">
                Envoyer
              </Button>
            </form>

            {messages.length > 0 && (
              <div className="mt-6 border-t border-filet pt-4 space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-pierre">Historique</p>
                {messages.map((msg) => (
                  <div key={msg.id} className="rounded-lg bg-surface p-3">
                    <p className="text-sm font-medium text-ivoire">{msg.subject}</p>
                    <p className="text-xs text-cendre">{formatDate(msg.createdAt)}</p>
                    {msg.reply && (
                      <p className="mt-2 text-sm text-succes">Répondu : {msg.reply}</p>
                    )}
                    {!msg.reply && (
                      <Badge variant="warning" className="mt-1">En attente</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </ScrollReveal>

        {/* Logout */}
        <ScrollReveal delay={0.25}>
          <Button variant="danger" className="w-full" icon={<LogOut className="h-4 w-4" />} onClick={handleLogout}>
            Déconnexion
          </Button>
        </ScrollReveal>
      </div>
    </LearnerShell>
  );
}
