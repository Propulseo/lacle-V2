// Rafraichissement de la session Supabase a chaque requete (cookies a jour pour
// les Server Components / Server Actions). Ne fait PAS de redirection : le gating
// d'affichage reste cote client (useRequireAuth) et la securite des donnees est
// assuree par la RLS serveur.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT : appeler getUser() (et non getSession()) pour revalider le token.
  await supabase.auth.getUser();

  return response;
}
