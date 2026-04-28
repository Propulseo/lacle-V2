"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset: _reset }: GlobalErrorProps) {
  return (
    <html lang="fr">
      <body style={{ backgroundColor: "#0a0f1e", color: "#f0ede8", fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <div style={{
              width: "4rem", height: "4rem", margin: "0 auto 1.5rem",
              borderRadius: "50%", backgroundColor: "rgba(239,68,68,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", color: "#ef4444",
            }}>
              !
            </div>

            <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem", fontWeight: 400 }}>
              Une erreur critique est survenue
            </h1>

            <p style={{ fontSize: "0.875rem", color: "#7e8094", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              L&apos;application a rencontre un probleme inattendu.
              Veuillez recharger la page.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: "rgba(196,162,101,0.1)",
                border: "1px solid #c4a265",
                color: "#c4a265",
                padding: "0.625rem 1.25rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              Recharger la page
            </button>

            {process.env.NODE_ENV === "development" && (
              <details style={{
                marginTop: "2rem", padding: "1rem", borderRadius: "0.5rem",
                border: "1px solid #1e293b", backgroundColor: "#0f1629", textAlign: "left",
              }}>
                <summary style={{ cursor: "pointer", fontSize: "0.75rem", color: "#5a5c6e" }}>
                  Details (dev)
                </summary>
                <pre style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#ef4444", overflow: "auto" }}>
                  {error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
