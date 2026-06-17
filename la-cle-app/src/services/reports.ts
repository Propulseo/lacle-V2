// Service signalements (Qualiopi Ind.31 — registre des dysfonctionnements).
// Le bouton de signalement ecrit dans video_reports (RLS INSERT self) ; la vue
// export_ind31_signalements alimente l'export d'audit cote admin.
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type ReportType = Database["public"]["Enums"]["report_type"];

/**
 * Enregistre un signalement (bug / incoherence) lie ou non a une video.
 * Horodate cote serveur (created_at default now()).
 */
export async function createVideoReport(args: {
  learnerId: string;
  pageUrl: string;
  description: string;
  reportType?: ReportType;
  videoId?: string | null;
}): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("video_reports").insert({
    learner_id: args.learnerId,
    video_id: args.videoId ?? null,
    page_url: args.pageUrl,
    report_type: args.reportType ?? "bug",
    description: args.description,
  });
  if (error) throw error;
}
