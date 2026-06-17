"use client";

/**
 * Frontiere d'erreur racine : remplace tout le document (y compris <html>),
 * donc le CSS du theme peut ne pas etre charge -> styles inline volontaires
 * (hex justifie, cas documente dans l'audit). Couvre les erreurs du layout racine.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "0 1.5rem",
          textAlign: "center",
          background: "#0c0c0e",
          color: "#ece7dd",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <h1 style={{ fontSize: "1.875rem", fontWeight: 400, margin: 0 }}>
          Une erreur est survenue
        </h1>
        <p style={{ maxWidth: "28rem", lineHeight: 1.7, color: "#a8a299", margin: 0 }}>
          Le site a rencontré un problème inattendu. Vous pouvez réessayer.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            border: "1px solid #8a7a5c",
            background: "transparent",
            color: "#d8c9a8",
            padding: "0.6rem 1.4rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "0.95rem",
          }}
        >
          Réessayer
        </button>
      </body>
    </html>
  );
}
