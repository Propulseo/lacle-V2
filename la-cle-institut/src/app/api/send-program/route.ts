import { NextResponse } from "next/server";

/**
 * POST /api/send-program
 *
 * Reçoit { email: string } et déclenche l'envoi du programme de formation
 * à l'adresse renseignée. Utilisé par <ProgramEmailForm /> sur la page de
 * vente PNL Praticien.
 *
 * État actuel : validation d'entrée + accusé de réception. L'envoi réel
 * n'est pas encore branché.
 *
 * TODO (Resend) :
 *   1. Installer @resend/node : `npm i resend`
 *   2. Renseigner RESEND_API_KEY dans .env.local et en prod (Vercel).
 *   3. Remplacer le bloc "console.log" ci-dessous par :
 *        import { Resend } from "resend";
 *        const resend = new Resend(process.env.RESEND_API_KEY);
 *        await resend.emails.send({
 *          from: "La Clé <contact@institutlacle.fr>",
 *          to: email,
 *          subject: "Votre programme de formation — Praticien PNL",
 *          html: "<p>Bonjour, vous trouverez ci-joint le programme…</p>",
 *          attachments: [{
 *            filename: "pnl-praticien-programme.pdf",
 *            path: "https://institutlacle.fr/documents/pnl-praticien-programme.pdf",
 *          }],
 *        });
 *   4. Gérer les erreurs Resend (quotas, adresse invalide) et retourner
 *      un code HTTP adapté.
 */
export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Payload JSON invalide" },
      { status: 400 },
    );
  }

  const email =
    typeof payload === "object" &&
    payload !== null &&
    "email" in payload &&
    typeof (payload as { email: unknown }).email === "string"
      ? (payload as { email: string }).email.trim()
      : "";

  // Validation e-mail minimale ; Resend rejettera de toute façon les
  // adresses mal formées en production.
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  // TODO (Resend) : remplacer ce log par l'envoi réel (cf. bloc ci-dessus).
  console.log("[send-program] demande reçue pour :", email);

  return NextResponse.json({ ok: true });
}
