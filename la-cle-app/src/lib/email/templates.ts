// Gabarits d'emails transactionnels (HTML inline simple, compatible clients mail).
// Ton institutionnel La Clé Institut. Chaque template retourne { subject, html }.
// Pas de dependance : interpolation sobre, styles inline minimaux.

const SUPPORT_EMAIL = "contact@institutlacle.fr";

export interface EmailContent {
  subject: string;
  html: string;
}

/**
 * Echappe les valeurs dynamiques interpolees dans le HTML des emails.
 * Empeche l'injection HTML (ex: description libre d'un signalement eleve ->
 * faux liens / images de tracking dans l'email recu par le staff).
 */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function shell(title: string, bodyHtml: string): string {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#0a0f1e;font-family:Helvetica,Arial,sans-serif;color:#f0ede8;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <p style="font-size:13px;letter-spacing:2px;color:#c9a96e;text-transform:uppercase;margin:0 0 24px;">La Clé Institut</p>
    <h1 style="font-size:20px;font-weight:600;color:#f0ede8;margin:0 0 16px;">${title}</h1>
    <div style="font-size:15px;line-height:1.6;color:#cfc9c0;">${bodyHtml}</div>
    <hr style="border:none;border-top:1px solid #2a3142;margin:32px 0 16px;" />
    <p style="font-size:12px;color:#8a8478;margin:0;">La Clé Institut — Organisme de formation certifié Qualiopi.<br/>
    Une question ? <a href="mailto:${SUPPORT_EMAIL}" style="color:#c9a96e;">${SUPPORT_EMAIL}</a></p>
  </div></body></html>`;
}

/** Bienvenue + mot de passe temporaire (creation d'un compte eleve par le staff). */
export function welcomeLearner(firstName: string, email: string, tempPassword: string, loginUrl: string): EmailContent {
  return {
    subject: "Bienvenue à La Clé Institut — vos accès",
    html: shell(
      `Bienvenue, ${esc(firstName)}`,
      `<p>Votre espace apprenant a été créé. Voici vos accès :</p>
       <p style="background:#141a2b;border:1px solid #2a3142;border-radius:8px;padding:16px;">
         <strong>Identifiant :</strong> ${esc(email)}<br/>
         <strong>Mot de passe temporaire :</strong> <code style="color:#c9a96e;">${esc(tempPassword)}</code>
       </p>
       <p>Pour des raisons de sécurité, il vous sera demandé de modifier ce mot de passe à votre première connexion.</p>
       <p style="margin-top:24px;"><a href="${esc(loginUrl)}" style="display:inline-block;background:#c9a96e;color:#0a0f1e;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:8px;">Accéder à mon espace</a></p>`,
    ),
  };
}

/** Notification au staff d'un signalement (Qualiopi Ind.31). */
export function bugReportNotice(learnerName: string, pageUrl: string, description: string): EmailContent {
  return {
    subject: "Nouveau signalement sur la plateforme",
    html: shell(
      "Signalement reçu",
      `<p>Un apprenant a signalé un problème.</p>
       <p style="background:#141a2b;border:1px solid #2a3142;border-radius:8px;padding:16px;">
         <strong>Apprenant :</strong> ${esc(learnerName)}<br/>
         <strong>Page :</strong> ${esc(pageUrl)}
       </p>
       <p><strong>Description :</strong><br/>${esc(description)}</p>`,
    ),
  };
}

/** Date d'examen final retenue, notifiee a l'apprenant. */
export function finalExamScheduled(firstName: string, when: string): EmailContent {
  return {
    subject: "Votre examen final est planifié",
    html: shell(
      `Bonjour ${esc(firstName)}`,
      `<p>Votre examen final a été planifié pour le :</p>
       <p style="font-size:18px;color:#c9a96e;font-weight:600;">${esc(when)}</p>
       <p>Vous retrouverez tous les détails dans votre espace apprenant.</p>`,
    ),
  };
}

/** Certification obtenue — attestation deposee au coffre. */
export function certificationGranted(firstName: string): EmailContent {
  return {
    subject: "Félicitations — vous êtes certifié·e",
    html: shell(
      `Félicitations, ${esc(firstName)}`,
      `<p>Vous avez réussi votre examen final. Votre attestation de fin de formation est désormais disponible dans votre coffre documentaire.</p>
       <p>Une invitation à la session présentielle vous y attend également.</p>`,
    ),
  };
}

/** Lien vers le questionnaire de satisfaction (a chaud / a froid). */
export function satisfactionInvite(firstName: string, surveyUrl: string): EmailContent {
  return {
    subject: "Votre avis compte — questionnaire de satisfaction",
    html: shell(
      `Bonjour ${esc(firstName)}`,
      `<p>Nous aimerions recueillir votre retour sur votre parcours de formation.</p>
       <p style="margin-top:24px;"><a href="${esc(surveyUrl)}" style="display:inline-block;background:#c9a96e;color:#0a0f1e;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:8px;">Répondre au questionnaire</a></p>`,
    ),
  };
}

/** Confirmation de paiement / activation d'inscription. */
export function paymentConfirmed(firstName: string): EmailContent {
  return {
    subject: "Inscription confirmée",
    html: shell(
      `Merci, ${esc(firstName)}`,
      `<p>Votre paiement a bien été reçu et votre inscription est désormais active. L'intégralité du parcours vous est ouverte selon votre progression.</p>`,
    ),
  };
}
