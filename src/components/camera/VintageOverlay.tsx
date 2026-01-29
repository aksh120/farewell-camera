"use client";

import React from "react";

interface VintageOverlayProps {
  intensity?: number;
}

export function VintageOverlay({ intensity = 1 }: VintageOverlayProps) {
  if (intensity <= 0) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity: intensity }}
    >
      {}
      <div
        className="absolute inset-0 film-grain opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
        }}
      />

      {}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, 0.4) 100%)",
        }}
      />

      {}
      <div
        className="absolute -top-10 -right-10 w-64 h-64 light-leak opacity-[0.05]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255, 180, 100, 0.8) 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />

      {}
      <div
        className="absolute -bottom-10 -left-10 w-48 h-48 light-leak opacity-[0.03]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255, 150, 100, 0.8) 0%, transparent 70%)",
          mixBlendMode: "screen",
          animationDelay: "2s",
        }}
      />
    </div>
  );
}

export function FilmReelEdges() {
  const sprocketCount = 20;
  const sprockets = Array.from({ length: sprocketCount });

  return (
    <div className="absolute inset-0 pointer-events-none z-5">
      {}
      <div className="absolute left-0 top-0 bottom-0 w-5 bg-vintage-black/90 flex flex-col justify-between py-2">
        {sprockets.map((_, i) => (
          <div
            key={`left-${i}`}
            className="w-3 h-2 mx-auto rounded-sm bg-vintage-charcoal/80"
          />
        ))}
      </div>

      {}
      <div className="absolute right-0 top-0 bottom-0 w-5 bg-vintage-black/90 flex flex-col justify-between py-2">
        {sprockets.map((_, i) => (
          <div
            key={`right-${i}`}
            className="w-3 h-2 mx-auto rounded-sm bg-vintage-charcoal/80"
          />
        ))}
      </div>
    </div>
  );
}

export function ShutterFlash({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-white shutter-flash pointer-events-none z-20" />
  );
}
