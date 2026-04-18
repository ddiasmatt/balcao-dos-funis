export function GlowOrbs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div
        aria-hidden
        className="glow-orb animate-glow-pulse"
        style={{
          top: "-10%",
          left: "-5%",
          width: "560px",
          height: "560px",
          background: "radial-gradient(circle, rgba(124,111,255,0.45) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="glow-orb animate-glow-pulse"
        style={{
          top: "30%",
          right: "-10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(77,156,255,0.32) 0%, transparent 70%)",
          animationDelay: "3s",
        }}
      />
    </div>
  );
}
