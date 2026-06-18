// Point d'entree du module email. Importer depuis "@/lib/email".
export { sendEmail, isEmailConfigured } from "./client";
export type { SendEmailParams, SendEmailResult } from "./client";
export * as emailTemplates from "./templates";
export type { EmailContent } from "./templates";
