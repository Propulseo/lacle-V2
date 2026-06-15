// Client Supabase cote SERVEUR (Server Components, Server Actions, Route Handlers).
// Lit/ecrit la session via les cookies. Soumis a la RLS (cle anon + JWT user).
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Appele depuis un Server Component : ignore. Le middleware rafraichit la session.
          }
        },
      },
    },
  );
}
