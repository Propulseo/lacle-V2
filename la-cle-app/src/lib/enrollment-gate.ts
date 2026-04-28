/**
 * Conditions d'acces au cours 8 (module 2).
 *
 * 3 conditions cumulatives :
 * 1. Contrat de formation distancielle signe
 * 2. CGV acceptees
 * 3. Paiement confirme (Stripe)
 *
 * TODO // Supabase: lire contract_signed, cgv_accepted FROM students WHERE id = userId
 * TODO // Stripe: lire payment_status depuis customer.subscription
 */

const CONTRACT_KEY = "enrollment_contract_signed";
const CGV_KEY = "enrollment_cgv_accepted";
const PAYMENT_KEY = "enrollment_payment_status";

export interface EnrollmentConditions {
  contractSigned: boolean;
  cgvAccepted: boolean;
  paymentActive: boolean;
}

export function getEnrollmentConditions(): EnrollmentConditions {
  if (typeof window === "undefined") {
    return { contractSigned: false, cgvAccepted: false, paymentActive: false };
  }
  return {
    contractSigned: localStorage.getItem(CONTRACT_KEY) === "true",
    cgvAccepted: localStorage.getItem(CGV_KEY) === "true",
    paymentActive: localStorage.getItem(PAYMENT_KEY) === "active",
  };
}

export function isEnrollmentComplete(): boolean {
  const c = getEnrollmentConditions();
  return c.contractSigned && c.cgvAccepted && c.paymentActive;
}

export function markContractSigned(): void {
  if (typeof window === "undefined") return;
  // TODO // Supabase: UPDATE students SET contract_signed = true, contract_signed_at = now() WHERE id = userId
  localStorage.setItem(CONTRACT_KEY, "true");
}

export function markCgvAccepted(): void {
  if (typeof window === "undefined") return;
  // TODO // Supabase: UPDATE students SET cgv_accepted = true, cgv_accepted_at = now() WHERE id = userId
  localStorage.setItem(CGV_KEY, "true");
}

export function getPaymentStatus(): "trial" | "active" | "failed" {
  if (typeof window === "undefined") return "trial";
  // TODO // Stripe: lire depuis customer.subscription.status via webhook
  const val = localStorage.getItem(PAYMENT_KEY);
  if (val === "active" || val === "failed") return val;
  return "trial";
}
