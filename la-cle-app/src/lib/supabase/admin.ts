// Client Supabase SERVICE_ROLE — SERVEUR UNIQUEMENT (Server Actions / Route Handlers).
// BYPASSE la RLS. NE JAMAIS importer dans un Client Component ni exposer la cle.
// Usage : operations privilegiees (auth.admin.createUser, webhooks Stripe, jobs).
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquante (Dashboard > Settings > API > service_role).",
    );
  }
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
