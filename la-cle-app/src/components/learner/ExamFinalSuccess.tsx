"use client";

import { useState, useEffect } from "react";
import { Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SatisfactionSurveyHot } from "@/components/satisfaction/SatisfactionSurveyHot";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";

interface ExamFinalSuccessProps {
  score: number;
  notes?: string | null;
}

const STORAGE_KEY = "satisfaction_hot_completed";

export function ExamFinalSuccess({ score, notes }: ExamFinalSuccessProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [showSurvey, setShowSurvey] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    setShowSurvey(completed !== "true");
  }, []);

  return (
    <>
      <ScrollReveal>
        <Card variant="elevated" className="text-center py-8">
          <Award className="mx-auto h-14 w-14 text-or" />
          <h2 className="mt-4 font-serif text-2xl text-ivoire">
            Felicitations !
          </h2>
          <p className="mt-2 text-lg text-or">{score}%</p>
          {notes && (
            <p className="mt-2 text-sm text-cendre italic">
              &laquo; {notes} &raquo;
            </p>
          )}
          <p className="mt-4 text-sm text-cendre">
            Votre attestation de fin de formation est disponible dans votre Coffre.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="primary"
              onClick={() => router.push(ROUTES.espace.documents)}
            >
              Acceder a mon Coffre
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push(ROUTES.espace.presentiel)}
            >
              S&apos;inscrire au presentiel
            </Button>
          </div>
        </Card>
      </ScrollReveal>

      {showSurvey && user && (
        <SatisfactionSurveyHot
          studentId={user.id}
          onComplete={() => setShowSurvey(false)}
        />
      )}
    </>
  );
}
