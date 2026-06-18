// Transport email — Brevo (ex-Sendinblue) via son API REST transactionnelle.
// SERVEUR UNIQUEMENT : la cle BREVO_API_KEY ne doit jamais atteindre le client.
// No-op GRACIEUX : si la cle est absente, on ne tente aucun envoi et on retourne
// { sent: false } sans jeter — la plateforme reste fonctionnelle sans email configure.
//
// Activation : poser BREVO_API_KEY (+ optionnel BREVO_SENDER_EMAIL / BREVO_SENDER_NAME).
import "server-only";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

const DEFAULT_SENDER_EMAIL = "contact@institutlacle.fr";
const DEFAULT_SENDER_NAME = "La Clé Institut";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  /** Adresse de reponse optionnelle. */
  replyTo?: string;
}

export interface SendEmailResult {
  sent: boolean;
  /** Renseigne quand sent = false : "no_api_key" (non configure) ou "error". */
  reason?: "no_api_key" | "error";
}

/** True si l'integration email est configuree (cle presente). */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY);
}

/**
 * Envoie un email transactionnel via Brevo. No-op gracieux si non configure.
 *
 * @returns { sent: true } si l'email est parti, sinon { sent: false, reason }
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    // Non configure : on ne bloque pas le flux metier.
    return { sent: false, reason: "no_api_key" };
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || DEFAULT_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || DEFAULT_SENDER_NAME;

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email: params.to }],
        subject: params.subject,
        htmlContent: params.html,
        ...(params.replyTo ? { replyTo: { email: params.replyTo } } : {}),
      }),
    });
    if (!res.ok) {
      return { sent: false, reason: "error" };
    }
    return { sent: true };
  } catch {
    // Erreur reseau/transport : on n'interrompt jamais le parcours metier pour un email.
    return { sent: false, reason: "error" };
  }
}
