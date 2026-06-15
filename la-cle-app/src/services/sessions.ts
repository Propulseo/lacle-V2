// Service sessions — cable Supabase (tables presentiel_sessions + session_registrations)
// avec adaptateur vers les DTO Session / SessionRegistration (pages inchangees).
// NB DB -> DTO : session_date->date, start_time->startTime, end_time->endTime.
// learnerName n'a pas de colonne propre : derive du profil joint (first_name last_name).
// NB PostgREST : session_registrations est une relation 1-a-N -> embed en TABLEAU ;
//   profiles (learner_id FK) est une relation 1-a-1 -> embed en OBJET.
import { createClient } from "@/lib/supabase/client";
import { getActiveFormationId } from "@/lib/supabase/formation";
import type { Session, SessionRegistration } from "@/types";
import type { Database } from "@/types/database.types";

type RegistrationRow = {
  id: string;
  session_id: string;
  learner_id: string;
  registered_at: string;
  attended: boolean | null;
  profiles: { first_name: string; last_name: string } | null;
};

type SessionRow = {
  id: string;
  title: string;
  description: string | null;
  session_date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants: number;
  created_at: string;
  session_registrations: RegistrationRow[];
};

const REGISTRATION_SELECT =
  "id, session_id, learner_id, registered_at, attended, profiles(first_name, last_name)";

const SESSION_SELECT =
  `id, title, description, session_date, start_time, end_time, location, max_participants, created_at, session_registrations(${REGISTRATION_SELECT})`;

function mapRegistration(r: RegistrationRow): SessionRegistration {
  const name = r.profiles ? `${r.profiles.first_name} ${r.profiles.last_name}`.trim() : "";
  return {
    id: r.id,
    sessionId: r.session_id,
    learnerId: r.learner_id,
    learnerName: name,
    registeredAt: r.registered_at,
    attended: r.attended,
  };
}

function mapSession(s: SessionRow): Session {
  return {
    id: s.id,
    title: s.title,
    description: s.description ?? "",
    date: s.session_date,
    startTime: s.start_time,
    endTime: s.end_time,
    location: s.location,
    maxParticipants: s.max_participants,
    registrations: (s.session_registrations ?? []).map(mapRegistration),
    createdAt: s.created_at,
  };
}

/**
 * Recupere toutes les sessions presentielles de la formation active,
 * triees par date decroissante.
 *
 * @returns Tableau des sessions
 */
export async function getSessions(): Promise<Session[]> {
  const supabase = createClient();
  const formationId = await getActiveFormationId(supabase);
  if (!formationId) return [];
  const { data, error } = await supabase
    .from("presentiel_sessions")
    .select(SESSION_SELECT)
    .eq("formation_id", formationId)
    .order("session_date", { ascending: false });
  if (error) throw error;
  return (data as unknown as SessionRow[]).map(mapSession);
}

/**
 * Recupere une session presentielle par son identifiant.
 *
 * @param id - Identifiant de la session
 * @returns La session ou null si non trouvee
 */
export async function getSession(id: string): Promise<Session | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("presentiel_sessions")
    .select(SESSION_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapSession(data as unknown as SessionRow) : null;
}

/**
 * Cree une nouvelle session presentielle dans la formation active.
 *
 * @param data - Donnees de la session (sans id, createdAt, registrations)
 * @returns La session creee
 */
export async function createSession(
  data: Omit<Session, "id" | "createdAt" | "registrations">,
): Promise<Session> {
  const supabase = createClient();
  const formationId = await getActiveFormationId(supabase);
  if (!formationId) throw new Error("Aucune formation active");
  const insert: Database["public"]["Tables"]["presentiel_sessions"]["Insert"] = {
    formation_id: formationId,
    title: data.title,
    description: data.description,
    session_date: data.date,
    start_time: data.startTime,
    end_time: data.endTime,
    location: data.location,
    max_participants: data.maxParticipants,
  };
  const { data: row, error } = await supabase
    .from("presentiel_sessions")
    .insert(insert)
    .select(SESSION_SELECT)
    .single();
  if (error) throw error;
  return mapSession(row as unknown as SessionRow);
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
  const supabase = createClient();
  const patch: Database["public"]["Tables"]["presentiel_sessions"]["Update"] = {};
  if (data.title !== undefined) patch.title = data.title;
  if (data.description !== undefined) patch.description = data.description;
  if (data.date !== undefined) patch.session_date = data.date;
  if (data.startTime !== undefined) patch.start_time = data.startTime;
  if (data.endTime !== undefined) patch.end_time = data.endTime;
  if (data.location !== undefined) patch.location = data.location;
  if (data.maxParticipants !== undefined) patch.max_participants = data.maxParticipants;
  const { data: row, error } = await supabase
    .from("presentiel_sessions")
    .update(patch)
    .eq("id", id)
    .select(SESSION_SELECT)
    .single();
  if (error) throw error;
  return mapSession(row as unknown as SessionRow);
}

/**
 * Supprime une session presentielle — cascade sur les inscriptions.
 *
 * @param id - Identifiant de la session
 */
export async function deleteSession(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("presentiel_sessions").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Inscrit un apprenant a une session presentielle (insertion self via RLS).
 *
 * @param sessionId - Identifiant de la session
 * @param learnerId - Identifiant de l'apprenant
 * @param learnerName - Nom affiche de l'apprenant (non persiste, derive du profil)
 * @returns L'inscription creee
 * @throws Si la session n'existe pas ou est complete
 */
export async function registerForSession(
  sessionId: string,
  learnerId: string,
  learnerName: string,
): Promise<SessionRegistration> {
  const supabase = createClient();

  // Verifie l'existence + la capacite avant l'insert.
  const session = await getSession(sessionId);
  if (!session) throw new Error("Session non trouvée");
  if (session.registrations.length >= session.maxParticipants) throw new Error("Session complète");

  const insert: Database["public"]["Tables"]["session_registrations"]["Insert"] = {
    session_id: sessionId,
    learner_id: learnerId,
  };
  const { data, error } = await supabase
    .from("session_registrations")
    .insert(insert)
    .select(REGISTRATION_SELECT)
    .single();
  if (error) throw error;

  // learnerName fourni par l'appelant : on l'utilise si le profil n'est pas joint.
  const mapped = mapRegistration(data as unknown as RegistrationRow);
  return { ...mapped, learnerName: mapped.learnerName || learnerName };
}

/**
 * Marque la presence ou l'absence d'un apprenant a une session.
 *
 * @param sessionId - Identifiant de la session (conserve pour la signature ; l'inscription est ciblee par son id)
 * @param registrationId - Identifiant de l'inscription
 * @param attended - True si present, false si absent
 * @throws Si l'inscription n'existe pas
 */
export async function markAttendance(
  sessionId: string,
  registrationId: string,
  attended: boolean,
): Promise<void> {
  const supabase = createClient();
  const patch: Database["public"]["Tables"]["session_registrations"]["Update"] = { attended };
  const { error } = await supabase
    .from("session_registrations")
    .update(patch)
    .eq("id", registrationId)
    .eq("session_id", sessionId);
  if (error) throw error;
}
