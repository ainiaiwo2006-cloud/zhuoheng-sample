// Product image placeholder — pure SVG, deterministic per palette.
// Used until the merchant uploads real product photography.
//
// IMPORTANT: this is a *placeholder*, not the production visual. Replace by
// passing `images={[…]}` to ProductCard once you have CDN URLs.

import type { Palette, VisualType } from "@/lib/types";

type Props = {
  type: VisualType;
  palette: Palette;
  className?: string;
  /** small SKU label printed in the corner — gives the figure a catalog feel */
  sku?: string;
};

export function ProductVisual({ type, palette, className, sku }: Props) {
  const id = `pv-${palette.metal.replace("#", "")}-${type}`;

  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      className={className ?? "w-full h-full block"}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="42%" r="78%">
          <stop offset="0%"  stopColor={palette.bg1} />
          <stop offset="60%" stopColor={palette.bg1} />
          <stop offset="100%" stopColor={palette.bg2} />
        </radialGradient>
        <linearGradient id={`${id}-metal`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={lighten(palette.metal, 0.25)} />
          <stop offset="50%"  stopColor={palette.metal} />
          <stop offset="100%" stopColor={darken(palette.metal, 0.3)} />
        </linearGradient>
        <radialGradient id={`${id}-light`} cx="30%" cy="22%" r="42%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      <rect width="400" height="400" fill={`url(#${id}-bg)`} />
      <rect width="400" height="400" fill={`url(#${id}-light)`} />

      {/* faint catalog frame */}
      <g stroke={palette.accent} strokeWidth="0.4" opacity="0.15" fill="none">
        <line x1="34" y1="0"  x2="34"  y2="400" />
        <line x1="366" y1="0" x2="366" y2="400" />
        <line x1="0" y1="40"  x2="400" y2="40" />
        <line x1="0" y1="360" x2="400" y2="360" />
      </g>

      {renderMotif(type, id, palette)}

      {sku && (
        <text
          x="34" y="384"
          fontFamily="ui-monospace, monospace" fontSize="9"
          fill={palette.accent} opacity="0.55" letterSpacing="2"
        >{sku}</text>
      )}
      <text
        x="366" y="384" textAnchor="end"
        fontFamily="ui-monospace, monospace" fontSize="9"
        fill={palette.accent} opacity="0.45" letterSpacing="2"
      >ZHUOHENG</text>
    </svg>
  );
}

// ─── motif library ─────────────────────────────────────────────
function renderMotif(type: VisualType, id: string, p: Palette) {
  const metal = `url(#${id}-metal)`;

  switch (type) {
    case "ring":
      return (
        <g>
          <ellipse cx="200" cy="260" rx="92" ry="26" fill="none" stroke={metal} strokeWidth="11" />
          <ellipse cx="200" cy="260" rx="92" ry="26" fill="none" stroke={darken(p.metal, 0.4)} strokeWidth="0.8" opacity="0.6" />
          <path d="M180 195 L196 215 M220 195 L204 215 M186 190 L210 205 M214 190 L190 205"
            stroke={metal} strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <ellipse cx="200" cy="200" rx="22" ry="20" fill={metal} />
          <ellipse cx="194" cy="195" rx="6" ry="4" fill="rgba(255,255,255,0.65)" />
          <ellipse cx="200" cy="298" rx="68" ry="6" fill={p.accent} opacity="0.18" />
        </g>
      );

    case "stud":
      return (
        <g>
          {[150, 250].map((cx, i) => (
            <g key={i}>
              <circle cx={cx} cy="200" r="16" fill={metal} />
              <circle cx={cx - 4} cy="196" r="4" fill="rgba(255,255,255,0.6)" />
              <ellipse cx={cx} cy="226" rx="16" ry="2.5" fill={p.accent} opacity="0.18" />
            </g>
          ))}
        </g>
      );

    case "earring":
      return (
        <g>
          {[150, 250].map((cx, i) => (
            <g key={i}>
              <path d={`M${cx} 130 Q ${cx - 10} 145 ${cx} 162 Q ${cx + 10} 178 ${cx} 195`}
                fill="none" stroke={metal} strokeWidth="2" strokeLinecap="round" />
              <circle cx={cx} cy="245" r="22" fill={metal} />
              <circle cx={cx - 7} cy="237" r="6" fill="rgba(255,255,255,0.5)" />
              <ellipse cx={cx} cy="280" rx="20" ry="3" fill={p.accent} opacity="0.2" />
            </g>
          ))}
        </g>
      );

    case "necklace":
      return (
        <g>
          <path d="M60 110 Q 200 320 340 110" fill="none" stroke={metal} strokeWidth="2.4" strokeLinecap="round" />
          {[0.18, 0.34, 0.5, 0.66, 0.82].map((t, i) => {
            const x = (1 - t) ** 2 * 60 + 2 * (1 - t) * t * 200 + t * t * 340;
            const y = (1 - t) ** 2 * 110 + 2 * (1 - t) * t * 320 + t * t * 110;
            return <circle key={i} cx={x} cy={y} r="2.4" fill={metal} />;
          })}
          <circle cx="200" cy="305" r="6" fill={metal} />
          <ellipse cx="200" cy="345" rx="60" ry="5" fill={p.accent} opacity="0.18" />
        </g>
      );

    case "bracelet":
      return (
        <g>
          <ellipse cx="200" cy="240" rx="130" ry="48" fill="none" stroke={metal} strokeWidth="9" />
          <ellipse cx="200" cy="240" rx="130" ry="48" fill="none" stroke={darken(p.metal, 0.4)} strokeWidth="0.6" opacity="0.55" />
          <g stroke={lighten(p.metal, 0.3)} strokeWidth="0.6" opacity="0.6">
            {Array.from({ length: 14 }).map((_, i) => {
              const a = (i / 14) * Math.PI * 2;
              return (
                <line key={i}
                  x1={200 + Math.cos(a) * 124} y1={240 + Math.sin(a) * 42}
                  x2={200 + Math.cos(a) * 134} y2={240 + Math.sin(a) * 54}
                />
              );
            })}
          </g>
          <ellipse cx="200" cy="312" rx="110" ry="6" fill={p.accent} opacity="0.18" />
        </g>
      );

    case "pendant":
      return (
        <g>
          <path d="M120 100 Q 200 130 280 100" fill="none" stroke={metal} strokeWidth="1.2" />
          <ellipse cx="200" cy="170" rx="9" ry="13" fill="none" stroke={metal} strokeWidth="2" />
          <circle cx="200" cy="245" r="55" fill={metal} />
          <ellipse cx="184" cy="227" rx="14" ry="9" fill="rgba(255,255,255,0.4)" />
          <circle cx="200" cy="245" r="55" fill="none" stroke={darken(p.metal, 0.35)} strokeWidth="0.6" opacity="0.7" />
          <ellipse cx="200" cy="320" rx="55" ry="5" fill={p.accent} opacity="0.2" />
        </g>
      );

    case "set":
      return (
        <g>
          {/* a small composition: necklace + earring + ring */}
          <path d="M70 90 Q 200 200 330 90" fill="none" stroke={metal} strokeWidth="1.6" />
          <circle cx="200" cy="170" r="10" fill={metal} />
          {/* earring left */}
          <g transform="translate(110, 260)">
            <circle cx="0" cy="0" r="14" fill={metal} />
            <ellipse cx="-3" cy="-3" rx="4" ry="3" fill="rgba(255,255,255,0.5)" />
          </g>
          {/* earring right */}
          <g transform="translate(290, 260)">
            <circle cx="0" cy="0" r="14" fill={metal} />
            <ellipse cx="-3" cy="-3" rx="4" ry="3" fill="rgba(255,255,255,0.5)" />
          </g>
          {/* small ring center-bottom */}
          <ellipse cx="200" cy="290" rx="40" ry="13" fill="none" stroke={metal} strokeWidth="6" />
          <ellipse cx="200" cy="335" rx="100" ry="6" fill={p.accent} opacity="0.18" />
        </g>
      );
  }
}

// ─── color utils ─────────────────────────────────────────────
function clamp(n: number) { return Math.max(0, Math.min(255, Math.round(n))); }
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r,g,b].map((n) => clamp(n).toString(16).padStart(2,"0")).join("");
}
function lighten(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
}
function darken(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amt), g * (1 - amt), b * (1 - amt));
}
