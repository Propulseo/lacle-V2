// Service settings — cable Supabase. Table platform_settings : singleton
// (cle primaire booleenne id=true, une seule ligne). Mapping direct snake_case
// (DB) -> camelCase (DTO Settings). Lecture publique, ecriture reservee au staff (RLS).
import { createClient } from "@/lib/supabase/client";
import type { Settings } from "@/types";
import type { Database } from "@/types/database.types";

type SettingsRow = Database["public"]["Tables"]["platform_settings"]["Row"];

const SETTINGS_SELECT =
  "site_name, support_email, exam_passing_score, max_exam_attempts, session_registration_deadline_days, maintenance_mode";

function mapSettings(row: SettingsRow): Settings {
  return {
    siteName: row.site_name,
    supportEmail: row.support_email,
    examPassingScore: row.exam_passing_score,
    maxExamAttempts: row.max_exam_attempts,
    sessionRegistrationDeadlineDays: row.session_registration_deadline_days,
    maintenanceMode: row.maintenance_mode,
  };
}

/**
 * Recupere les reglages globaux de la plateforme (ligne unique du singleton).
 *
 * @returns Les reglages actuels
 */
export async function getSettings(): Promise<Settings> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("platform_settings")
    .select(SETTINGS_SELECT)
    .eq("id", true)
    .single();
  if (error) throw error;
  return mapSettings(data as unknown as SettingsRow);
}

/**
 * Met a jour les reglages globaux de la plateforme (staff uniquement, RLS).
 *
 * @param data - Champs a modifier
 * @returns Les reglages mis a jour
 */
export async function updateSettings(data: Partial<Settings>): Promise<Settings> {
  const supabase = createClient();
  const patch: Database["public"]["Tables"]["platform_settings"]["Update"] = {};
  if (data.siteName !== undefined) patch.site_name = data.siteName;
  if (data.supportEmail !== undefined) patch.support_email = data.supportEmail;
  if (data.examPassingScore !== undefined) patch.exam_passing_score = data.examPassingScore;
  if (data.maxExamAttempts !== undefined) patch.max_exam_attempts = data.maxExamAttempts;
  if (data.sessionRegistrationDeadlineDays !== undefined)
    patch.session_registration_deadline_days = data.sessionRegistrationDeadlineDays;
  if (data.maintenanceMode !== undefined) patch.maintenance_mode = data.maintenanceMode;

  const { data: row, error } = await supabase
    .from("platform_settings")
    .update(patch)
    .eq("id", true)
    .select(SETTINGS_SELECT)
    .single();
  if (error) throw error;
  return mapSettings(row as unknown as SettingsRow);
}
