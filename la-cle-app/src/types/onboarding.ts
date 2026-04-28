export interface OnboardingAnswer {
  questionId: string;
  answer: string;
  answeredAt: Date;
}

export interface OnboardingResult {
  answers: OnboardingAnswer[];
  recommendedPace: "lent" | "normal" | "intensif";
  pnlLevel: "debutant" | "initie" | "avance";
  completedAt: Date;
}

export interface PositioningTestResult {
  answers: OnboardingAnswer[];
  startingLevel: string;
  recommendations: string[];
  completedAt: Date;
}
