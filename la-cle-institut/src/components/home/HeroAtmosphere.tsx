export function HeroAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className="hero-atmosphere-glow-1"
        style={{
          position: "absolute", width: 700, height: 700,
          top: "33%", left: "33%", transform: "translate(-50%, -50%)",
          background: "radial-gradient(ellipse, var(--hero-glow-1), transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute", width: 400, height: 400,
          bottom: "25%", left: "25%",
          background: "radial-gradient(ellipse, var(--hero-glow-2), transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute", width: 500, height: 500,
          top: "25%", right: "25%",
          background: "radial-gradient(ellipse, var(--hero-glow-3), transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage:
            `linear-gradient(var(--hero-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid-line) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: "var(--hero-grid-opacity)" as unknown as number,
        }}
      />
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 320,
          background: "linear-gradient(to bottom, var(--hero-depth-top), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute", width: 800, height: 800,
          top: "50%", left: "76%", transform: "translate(-50%, -50%)",
          background: "radial-gradient(ellipse, var(--hero-focal) 0%, var(--hero-focal-outer) 40%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 160,
          background: "linear-gradient(to bottom, transparent, var(--hero-bottom-gradient))",
        }}
      />
    </div>
  );
}
