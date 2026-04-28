"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Formulaire léger permettant de recevoir le programme de formation
 * par e-mail. Option complémentaire au téléchargement direct, utile
 * pour les prospects qui n'ont pas le PDF sous la main.
 *
 * Le endpoint `/api/send-program` reçoit { email } en JSON.
 * Le branchement Resend est à finaliser côté serveur (TODO dans la route).
 */
export function ProgramEmailForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    try {
      const res = await fetch("/api/send-program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm leading-relaxed text-cendre">
        Merci. Le programme vient de vous être envoyé à l&apos;adresse{" "}
        <span className="text-ivoire">{email}</span>. Pensez à vérifier vos
        courriers indésirables si vous ne le recevez pas dans les prochaines
        minutes.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 sm:flex-row sm:items-stretch"
      noValidate
    >
      <label htmlFor="program-email" className="sr-only">
        Adresse e-mail
      </label>
      <input
        id="program-email"
        name="email"
        type="email"
        required
        placeholder="vous@exemple.fr"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 border border-filet/60 bg-graphite/30 px-5 py-4 text-sm text-ivoire placeholder:text-pierre/40 transition-colors duration-300 focus:border-bronze/50 focus:bg-graphite/50 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex shrink-0 items-center justify-center border border-filet px-8 py-4 text-xs uppercase tracking-[0.15em] text-ivoire transition-all duration-500 ease-[var(--ease-institutional)] hover:border-bronze hover:text-bronze-clair disabled:pointer-events-none disabled:opacity-50"
      >
        {status === "sending" ? "Envoi…" : "Recevoir le programme"}
      </button>

      {status === "error" && (
        <p className="text-xs text-red-400/80 sm:self-center">
          Une erreur est survenue. Veuillez r&eacute;essayer.
        </p>
      )}
    </form>
  );
}
