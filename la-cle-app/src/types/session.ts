export interface Session {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  maxParticipants: number;
  registrations: SessionRegistration[];
  createdAt: string;
}

export interface SessionRegistration {
  id: string;
  sessionId: string;
  learnerId: string;
  learnerName: string;
  registeredAt: string;
  attended: boolean | null; // null = not yet marked
}
