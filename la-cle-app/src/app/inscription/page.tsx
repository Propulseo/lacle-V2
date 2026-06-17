"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { BackgroundAtmosphere } from "@/components/layout/BackgroundAtmosphere";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { savePreEnrollment } from "@/services/learner-journey";
import type { Json } from "@/types/database.types";
import {
  PreEnrollmentQuestionnaire,
  type PreEnrollmentSubmission,
} from "@/components/enrollment/PreEnrollmentQuestionnaire";

export default function InscriptionPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/espace");
    }
  }, [user, isLoading, router]);

  async function handleSubmit(data: PreEnrollmentSubmission) {
    setError("");
    setIsSubmitting(true);
    try {
      // Persistance horodatee (Qualiopi Ind.4) : INSERT pre_enrollment_answers
      // (anon autorise, learner_id NULL si pas encore de compte).
      await savePreEnrollment({
        answers: data.answers as unknown as Json,
        contactEmail: data.email,
        learnerId: user?.id ?? null,
      });
      localStorage.setItem("pre_enrollment_data", JSON.stringify(data));
      setSubmitted(true);
    } catch {
      setError("L'enregistrement de vos réponses a échoué. Veuillez réessayer.");
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
            Votre profil a bien été enregistré.
          </h1>
          <p className="mt-2 text-sm text-cendre">
            Créez votre compte pour continuer.
          </p>
          <Button
            variant="primary"
            className="mt-6 w-full"
            onClick={() => router.push("/login")}
          >
            Créer mon compte
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <BackgroundAtmosphere />
      <div className="w-full max-w-2xl space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        <PreEnrollmentQuestionnaire
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
