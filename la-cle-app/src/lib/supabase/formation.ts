// Helper partage : id de la formation active (single-formation pour l'instant).
// TODO multi-formation : exposer un selecteur de formation cote UI.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export async function getActiveFormationId(
  supabase: SupabaseClient<Database>,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("formations")
    .select("id")
    .eq("is_published", true)
    .order("position", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}
