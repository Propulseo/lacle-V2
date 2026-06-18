"use server";

// Server Action : creation d'une session Stripe Checkout pour l'inscription (cours 8).
// L'apprenant courant paie son inscription ; le webhook activera l'enrollment a la
// reception de l'evenement. learner_id + enrollment_id sont passes en metadata pour
// que le webhook (sans session utilisateur) sache quel enrollment activer.
//
// No-op gracieux : si Stripe n'est pas configure, retourne { configured: false } sans
// jeter (le front affiche alors un fallback "contactez-nous").
import { getStripe } from "./client";
import { createClient } from "@/lib/supabase/server";

export interface CheckoutResult {
  configured: boolean;
  /** URL de redirection Stripe Checkout si configured = true. */
  url?: string;
}

/**
 * Cree une session Checkout pour l'apprenant courant et retourne l'URL de redirection.
 *
 * @returns { configured:false } si Stripe non configure, sinon { configured:true, url }
 */
export async function createCheckoutSession(): Promise<CheckoutResult> {
  const stripe = getStripe();
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!stripe || !priceId) {
    return { configured: false };
  }

  // 1. Identifier l'apprenant + son enrollment (RLS self).
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Authentification requise.");

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("learner_id", auth.user.id)
    .maybeSingle();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  // 2. Creer la session Checkout (mode paiement unique).
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: auth.user.email ?? undefined,
    success_url: `${siteUrl}/espace/parcours?paiement=succes`,
    cancel_url: `${siteUrl}/espace/parcours?paiement=annule`,
    client_reference_id: auth.user.id,
    metadata: {
      learner_id: auth.user.id,
      enrollment_id: enrollment?.id ?? "",
    },
    payment_intent_data: {
      metadata: {
        learner_id: auth.user.id,
        enrollment_id: enrollment?.id ?? "",
      },
    },
  });

  if (!session.url) throw new Error("Impossible d'initialiser le paiement.");
  return { configured: true, url: session.url };
}
