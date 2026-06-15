// Service analytics — lecture des vues d'analyse (staff, RLS security_invoker).
// notion_responses_global : reussite par notion (toutes cohortes).
// learner_progress_view   : avancement par eleve/formation.
// engagement_overview     : assiduite par eleve (jours d'inactivite a la volee).
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

export type NotionStat = Database["public"]["Views"]["notion_responses_global"]["Row"];
export type LearnerProgressRow = Database["public"]["Views"]["learner_progress_view"]["Row"];
export type EngagementRow = Database["public"]["Views"]["engagement_overview"]["Row"];

export interface AnalyticsData {
  notions: NotionStat[];
  learners: LearnerProgressRow[];
  engagement: EngagementRow[];
}

/** Charge les trois vues d'analyse en parallele. Reservee au staff (RLS). */
export async function getAnalytics(): Promise<AnalyticsData> {
  const supabase = createClient();
  const [n, l, e] = await Promise.all([
    supabase.from("notion_responses_global").select("*").order("notion_label", { ascending: true }),
    supabase.from("learner_progress_view").select("*").order("last_name", { ascending: true }),
    supabase.from("engagement_overview").select("*").order("days_since_last_activity", { ascending: false, nullsFirst: false }),
  ]);
  if (n.error) throw n.error;
  if (l.error) throw l.error;
  if (e.error) throw e.error;
  return { notions: n.data ?? [], learners: l.data ?? [], engagement: e.data ?? [] };
}
