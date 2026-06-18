// Client Stripe — SERVEUR UNIQUEMENT. La cle secrete ne doit jamais atteindre le client.
// No-op GRACIEUX : getStripe() retourne null si STRIPE_SECRET_KEY est absente, ce qui
// permet aux Server Actions / route webhook de se desactiver proprement (la plateforme
// reste fonctionnelle sans paiement configure).
//
// Activation : poser STRIPE_SECRET_KEY (+ STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID,
// NEXT_PUBLIC_SITE_URL). Voir .env.example.
import "server-only";
import Stripe from "stripe";

let cached: Stripe | null = null;

/** Retourne l'instance Stripe, ou null si non configure. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cached) {
    // apiVersion non epinglee : on suit la version par defaut du SDK installe (type-safe).
    cached = new Stripe(key);
  }
  return cached;
}

/** True si l'integration paiement est configuree. */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
