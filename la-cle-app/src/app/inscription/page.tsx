"use client";

// TODO // Supabase: sauvegarder dans pre_enrollment_answers
// avec userId + answers + createdAt (horodatage Qualiopi Ind.4)

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { BackgroundAtmosphere } from "@/components/layout/BackgroundAtmosphere";
import { Button } from "@/components/ui/Button";
import {
  PreEnrollmentQuestionnaire,
  type PreEnrollmentSubmission,
} from "@/components/enrollment/PreEnrollmentQuestionnaire";

export default function InscriptionPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/espace");
    }
  }, [user, isLoading, router]);

  async function handleSubmit(data: PreEnrollmentSubmission) {
    setIsSubmitting(true);
    try {
      localStorage.setItem("pre_enrollment_data", JSON.stringify(data));
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || user) return null;

  if (submitted) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <BackgroundAtmosphere />
        <div className="w-full max-w-md rounded-xl border border-filet bg-encre/80 p-8 text-center backdrop-blur-sm">
          <CheckCircle className="mx-auto h-12 w-12 text-succes" />
          <h1 className="mt-4 font-serif text-2xl text-ivoire">
            Votre profil a bien ete enregistre.
          </h1>
          <p className="mt-2 text-sm text-cendre">
            Creez votre compte pour continuer.
          </p>
          <Button
            variant="primary"
            className="mt-6 w-full"
            onClick={() => router.push("/login")}
          >
            Creer mon compte
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <BackgroundAtmosphere />
      <PreEnrollmentQuestionnaire
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
