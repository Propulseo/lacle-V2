import { mockSessions } from "@/data/mock/sessions";
import type { Session, SessionRegistration } from "@/types";
import { sleep, generateId } from "@/lib/utils";

const sessions = [...mockSessions];

/**
 * Recupere toutes les sessions presentielles, triees par date decroissante.
 *
 * @returns Tableau des sessions
 */
export async function getSessions(): Promise<Session[]> {
  await sleep(300);
  return [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Recupere une session presentielle par son identifiant.
 *
 * @param id - Identifiant de la session
 * @returns La session ou null si non trouvee
 */
export async function getSession(id: string): Promise<Session | null> {
  await sleep(200);
  return sessions.find((s) => s.id === id) || null;
}

/**
 * Cree une nouvelle session presentielle.
 *
 * @param data - Donnees de la session (sans id, createdAt, registrations)
 * @returns La session creee
 */
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

/**
 * Met a jour une session presentielle existante.
 *
 * @param id - Identifiant de la session
 * @param data - Champs a modifier
 * @returns La session mise a jour
 * @throws Si la session n'existe pas
 */
export async function updateSession(id: string, data: Partial<Session>): Promise<Session> {
  await sleep(300);
  const idx = sessions.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Session non trouvée");
  sessions[idx] = { ...sessions[idx], ...data };
  return sessions[idx];
}

/**
 * Supprime une session presentielle.
 *
 * @param id - Identifiant de la session
 * @throws Si la session n'existe pas
 */
export async function deleteSession(id: string): Promise<void> {
  await sleep(300);
  const idx = sessions.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Session non trouvée");
  sessions.splice(idx, 1);
}

/**
 * Inscrit un apprenant a une session presentielle.
 *
 * @param sessionId - Identifiant de la session
 * @param learnerId - Identifiant de l'apprenant
 * @param learnerName - Nom affiche de l'apprenant
 * @returns L'inscription creee
 * @throws Si la session n'existe pas ou est complete
 */
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

/**
 * Marque la presence ou l'absence d'un apprenant a une session.
 *
 * @param sessionId - Identifiant de la session
 * @param registrationId - Identifiant de l'inscription
 * @param attended - True si present, false si absent
 * @throws Si la session ou l'inscription n'existe pas
 */
export async function markAttendance(sessionId: string, registrationId: string, attended: boolean): Promise<void> {
  await sleep(200);
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) throw new Error("Session non trouvée");
  const reg = session.registrations.find((r) => r.id === registrationId);
  if (!reg) throw new Error("Inscription non trouvée");
  reg.attended = attended;
}
