import { NextResponse } from "next/server";

/**
 * POST /api/contact
 *
 * Reçoit le formulaire de contact ({ name, email, subject?, message,
 * website, elapsedMs }) depuis <ContactForm />.
 *
 * Anti-spam (rejet silencieux — réponse 200 identique au succès pour ne
 * donner aucun signal aux robots) :
 *   - `website` : champ honeypot invisible pour les humains ; s'il est
 *     rempli, c'est un robot.
 *   - `elapsedMs` : durée entre l'affichage du formulaire et la soumission ;
 *     en dessous de MIN_ELAPSED_MS, c'est une soumission automatisée.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_ELAPSED_MS = 3000;

const SUCCESS_RESPONSE = { ok: true } as const;

function readString(payload: Record<string, unknown>, key: string): string {
  const value = payload[key];
  return typeof value === "string" ? value.trim() : "";
}

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

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json(
      { error: "Payload JSON invalide" },
      { status: 400 },
    );
  }

  const data = payload as Record<string, unknown>;
  const name = readString(data, "name");
  const email = readString(data, "email");
  const message = readString(data, "message");
  const website = readString(data, "website");
  const elapsedMs = typeof data.elapsedMs === "number" ? data.elapsedMs : null;

  // ---- Anti-spam : rejet silencieux (même réponse que le succès) ----
  const honeypotFilled = website.length > 0;
  const tooFast = elapsedMs !== null && elapsedMs < MIN_ELAPSED_MS;
  if (honeypotFilled || tooFast) {
    return NextResponse.json(SUCCESS_RESPONSE);
  }

  // ---- Validation des champs requis ----
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Champs requis manquants" },
      { status: 400 },
    );
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  // TODO // Resend: envoyer le message de contact à contact@institutlacle.fr
  // (reply-to: `email`, sujet: readString(data, "subject") ou
  // "Message du site", corps: `name` + `message`).

  return NextResponse.json(SUCCESS_RESPONSE);
}
