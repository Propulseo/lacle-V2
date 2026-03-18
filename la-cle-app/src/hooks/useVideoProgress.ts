"use client";

import { useState, useCallback, useRef } from "react";
import type { VideoQuestion } from "@/types";

export function useVideoProgress(questions: VideoQuestion[]) {
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [activeQuestion, setActiveQuestion] = useState<VideoQuestion | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const lastTriggeredRef = useRef<string | null>(null);

  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      for (const q of questions) {
        if (
          !answeredQuestions.has(q.id) &&
          Math.abs(currentTime - q.timestamp) < 1 &&
          lastTriggeredRef.current !== q.id
        ) {
          lastTriggeredRef.current = q.id;
          setActiveQuestion(q);
          setIsPaused(true);
          break;
        }
      }
    },
    [questions, answeredQuestions]
  );

  const handleAnswer = useCallback((questionId: string) => {
    setAnsweredQuestions((prev) => new Set(prev).add(questionId));
    setActiveQuestion(null);
    setIsPaused(false);
    lastTriggeredRef.current = null;
  }, []);

  const dismissQuestion = useCallback(() => {
    if (activeQuestion) {
      setAnsweredQuestions((prev) => new Set(prev).add(activeQuestion.id));
    }
    setActiveQuestion(null);
    setIsPaused(false);
    lastTriggeredRef.current = null;
  }, [activeQuestion]);

  return {
    activeQuestion,
    answeredQuestions,
    isPaused,
    handleTimeUpdate,
    handleAnswer,
    dismissQuestion,
  };
}
