export function VfxBackground() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {/* True deep black base */}
      <div className="absolute inset-0 bg-background" />

      {/* Blueprint engineering grid */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-60" />

      {/* Silver shimmer gradient — top centre glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.82 0.010 248 / 0.6) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Silver shimmer gradient — bottom left */}
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[250px] opacity-8"
        style={{
          background:
            "radial-gradient(ellipse at bottom left, oklch(0.82 0.010 248 / 0.3) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Radial vignette — centre remains clear */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 40%, oklch(0.07 0.003 260 / 0.8) 100%)",
        }}
      />

      {/* Top and bottom edge fades */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
