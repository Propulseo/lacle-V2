// Client Supabase cote NAVIGATEUR (Client Components, hooks).
// Utilise la cle publishable (anon) : soumis a la RLS. Jamais de service_role ici.
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
