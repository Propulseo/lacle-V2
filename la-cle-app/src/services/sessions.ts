import { mockSessions } from "@/data/mock/sessions";
import type { Session, SessionRegistration } from "@/types";
import { sleep, generateId } from "@/lib/utils";

const sessions = [...mockSessions];

export async function getSessions(): Promise<Session[]> {
  await sleep(300);
  return [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getSession(id: string): Promise<Session | null> {
  await sleep(200);
  return sessions.find((s) => s.id === id) || null;
}

export async function createSession(data: Omit<Session, "id" | "createdAt" | "registrations">): Promise<Session> {
  await sleep(400);
  const newSession: Session = {
    ...data,
    id: `session-${generateId()}`,
    registrations: [],
    createdAt: new Date().toISOString(),
  };
  sessions.push(newSession);
  return newSession;
}

export async function updateSession(id: string, data: Partial<Session>): Promise<Session> {
  await sleep(300);
  const idx = sessions.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Session non trouvée");
  sessions[idx] = { ...sessions[idx], ...data };
  return sessions[idx];
}

export async function deleteSession(id: string): Promise<void> {
  await sleep(300);
  const idx = sessions.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Session non trouvée");
  sessions.splice(idx, 1);
}

export async function registerForSession(sessionId: string, learnerId: string, learnerName: string): Promise<SessionRegistration> {
  await sleep(300);
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) throw new Error("Session non trouvée");
  if (session.registrations.length >= session.maxParticipants) throw new Error("Session complète");

  const reg: SessionRegistration = {
    id: `reg-${generateId()}`,
    sessionId,
    learnerId,
    learnerName,
    registeredAt: new Date().toISOString(),
    attended: null,
  };
  session.registrations.push(reg);
  return reg;
}

export async function markAttendance(sessionId: string, registrationId: string, attended: boolean): Promise<void> {
  await sleep(200);
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) throw new Error("Session non trouvée");
  const reg = session.registrations.find((r) => r.id === registrationId);
  if (!reg) throw new Error("Inscription non trouvée");
  reg.attended = attended;
}
