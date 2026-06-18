// Route webhook Stripe. Verifie la signature (STRIPE_WEBHOOK_SECRET), puis traite les
// evenements de paiement : ecrit payment_transactions (idempotent via l'index unique sur
// stripe_payment_intent) et met a jour l'enrollment (active / bloque) en service_role.
// enrollments n'a pas de policy d'ecriture authenticated : le service_role est requis.
//
// No-op gracieux : si Stripe n'est pas configure, repond 200 sans rien faire.
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, emailTemplates } from "@/lib/email";

// Body brut requis pour la verification de signature : on desactive le cache.
export const dynamic = "force-dynamic";

type TxnStatus = "succeeded" | "failed";

/** Met a jour payment_transactions (idempotent) + enrollment selon l'issue du paiement. */
async function recordPayment(
  intent: Stripe.PaymentIntent,
  outcome: TxnStatus,
): Promise<void> {
  const admin = createAdminClient();
  const learnerId = intent.metadata?.learner_id || "";
  const enrollmentId = intent.metadata?.enrollment_id || "";
  if (!learnerId) return; // sans learner_id, on ne peut rien rattacher

  // 1. Trace de transaction — GARDE D'IDEMPOTENCE. Avec ignoreDuplicates, PostgREST
  //    renvoie un tableau vide sur conflit (re-livraison Stripe deja traitee) : dans ce
  //    cas on s'arrete AVANT tout effet de bord (update enrollment, email), pour ne pas
  //    ecraser un etat administratif pose entre-temps ni renvoyer un email en double.
  const { data: inserted } = await admin
    .from("payment_transactions")
    .upsert(
      {
        learner_id: learnerId,
        enrollment_id: enrollmentId || null,
        stripe_payment_intent: intent.id,
        amount_cents: intent.amount ?? 0,
        currency: intent.currency ?? "eur",
        status: outcome,
      },
      { onConflict: "stripe_payment_intent", ignoreDuplicates: true },
    )
    .select("id");
  if (!inserted || inserted.length === 0) return; // re-livraison : deja traite

  // 2. Mise a jour de l'enrollment CIBLE (source de verite du gating cours 8).
  //    On exige enrollment_id : sans cible fiable, on NE touche AUCUNE inscription
  //    (le fallback par learner_id activerait toutes les formations de l'eleve).
  if (!enrollmentId) return;
  const patch =
    outcome === "succeeded"
      ? {
          payment_status: "active" as const,
          status: "inscrit" as const,
          payment_confirmed_at: new Date(intent.created * 1000).toISOString(),
          enrolled_at: new Date(intent.created * 1000).toISOString(),
        }
      : { payment_status: "failed" as const, status: "bloque" as const };
  await admin.from("enrollments").update(patch).eq("id", enrollmentId);

  // 3. Email de confirmation (no-op gracieux) — uniquement sur succes, une seule fois
  //    (garanti par la garde d'idempotence ci-dessus).
  if (outcome === "succeeded") {
    const { data: learner } = await admin
      .from("profiles")
      .select("first_name, email")
      .eq("id", learnerId)
      .maybeSingle();
    if (learner?.email) {
      const t = emailTemplates.paymentConfirmed(learner.first_name ?? "");
      await sendEmail({ to: learner.email, subject: t.subject, html: t.html });
    }
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  // Non configure : on accuse reception sans traiter (no-op gracieux).
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ received: true, configured: false });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  // Corps brut indispensable pour la verification de signature.
  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await recordPayment(event.data.object, "succeeded");
        break;
      case "payment_intent.payment_failed":
        await recordPayment(event.data.object, "failed");
        break;
      case "checkout.session.completed": {
        // Recuperer le PaymentIntent rattache pour disposer du montant/metadata.
        const session = event.data.object;
        // Paiements asynchrones (SEPA, etc.) : ne PAS activer tant que non paye.
        // payment_intent.succeeded fera foi quand le reglement arrivera.
        if (session.payment_status !== "paid") break;
        const intentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;
        if (intentId) {
          const intent = await stripe.paymentIntents.retrieve(intentId);
          // Reporter les metadata de la session si l'intent n'en a pas.
          intent.metadata = { ...session.metadata, ...intent.metadata };
          await recordPayment(intent, "succeeded");
        }
        break;
      }
      default:
        // Evenement non gere : on accuse reception.
        break;
    }
  } catch {
    // Echec de traitement : 500 pour que Stripe re-livre (le traitement est idempotent).
    return NextResponse.json({ error: "Traitement échoué." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
