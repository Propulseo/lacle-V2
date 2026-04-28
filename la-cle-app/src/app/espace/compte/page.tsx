"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAsyncData } from "@/hooks/useAsyncData";
import { LearnerShell } from "@/components/layout/LearnerShell";
import { AsyncBoundary } from "@/components/ui/AsyncBoundary";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ProfileSection } from "@/components/account/ProfileSection";
import { PasswordSection } from "@/components/account/PasswordSection";
import { SupportSection } from "@/components/account/SupportSection";
import { getLearner } from "@/services/learners";
import { getSupportMessages } from "@/services/documents";

export default function ComptePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const accountState = useAsyncData(async () => {
    const [learner, messages] = await Promise.all([
      getLearner(user!.id),
      getSupportMessages(user!.id),
    ]);
    return { learner: learner!, messages };
  }, [user?.id]);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <LearnerShell>
      <AsyncBoundary state={accountState}>
        {({ learner, messages }) => (
          <div className="mx-auto max-w-2xl space-y-6">
            <ScrollReveal>
              <div>
                <h1 className="font-serif text-2xl text-ivoire">Mon compte</h1>
                <p className="mt-1 text-sm text-cendre">Informations et support</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <ProfileSection learner={learner} />
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <PasswordSection userId={user!.id} />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <SupportSection
                userId={user!.id}
                userName={`${user!.firstName} ${user!.lastName}`}
                messages={messages}
                onMessageSent={accountState.refetch}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <Button variant="danger" className="w-full" icon={<LogOut className="h-4 w-4" />} onClick={handleLogout}>
                Deconnexion
              </Button>
            </ScrollReveal>
          </div>
        )}
      </AsyncBoundary>
    </LearnerShell>
  );
}
