"use client";

import { useRef, useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  // Horodatage du montage : permet à l'API de rejeter silencieusement les
  // soumissions trop rapides pour être humaines (anti-spam).
  const mountedAtRef = useRef(Date.now());

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          website: formData.get("website"),
          elapsedMs: Date.now() - mountedAtRef.current,
        }),
      });
      if (!res.ok) throw new Error("Échec de l’envoi");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="mb-6 text-bronze">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
            className="h-10 w-10"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <path d="M22 4L12 14.01l-3-3" />
          </svg>
        </div>
        <h3 className="mb-3 font-display text-2xl text-ivoire md:text-3xl">
          Message envoyé
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-cendre">
          Nous avons bien reçu votre message et vous répondrons dans les
          meilleurs délais. Merci de votre confiance.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Row: Nom + Email */}
      <div className="grid gap-8 md:grid-cols-2">
        <Field label="Nom complet" name="name" required placeholder="Votre nom" />
        <Field
          label="Adresse e-mail"
          name="email"
          type="email"
          required
          placeholder="vous@exemple.fr"
        />
      </div>

      {/* Objet */}
      <Field label="Objet" name="subject" placeholder="L’objet de votre message" />

      {/* Honeypot anti-spam : invisible pour les humains (sr-only +
          aria-hidden + tabIndex -1), seuls les robots le remplissent. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Ne pas remplir ce champ</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="mb-3 block text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-pierre"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Votre message..."
          className="w-full resize-none border border-filet/60 bg-graphite/30 px-5 py-4 text-sm leading-relaxed text-ivoire placeholder:text-pierre/40 transition-colors duration-300 focus:border-bronze/50 focus:bg-graphite/50 focus:outline-none"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-6 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center border border-filet px-12 py-5 text-sm uppercase tracking-[0.12em] text-ivoire transition-all duration-500 ease-[var(--ease-institutional)] hover:border-bronze hover:text-bronze-clair disabled:pointer-events-none disabled:opacity-50"
        >
          {status === "sending" ? (
            <>
              <svg
                className="mr-3 h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="opacity-20"
                />
                <path
                  d="M12 2a10 10 0 019.75 7.75"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Envoi en cours
            </>
          ) : (
            "Envoyer le message"
          )}
        </button>

        {status === "error" && (
          <p className="text-xs text-erreur/80">
            Une erreur est survenue. Veuillez réessayer.
          </p>
        )}
      </div>
    </form>
  );
}

/* ---- Reusable field ---- */

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-3 block text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-pierre"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border border-filet/60 bg-graphite/30 px-5 py-4 text-sm text-ivoire placeholder:text-pierre/40 transition-colors duration-300 focus:border-bronze/50 focus:bg-graphite/50 focus:outline-none"
      />
    </div>
  );
}
