/**
 * Ornamental background layers for the auth aside: flowing gold contour lines
 * and a small dot grid. Both are decorative only.
 */

export function AuthWaves({ className }: { className?: string }) {
  const lines = 16;

  return (
    <svg
      viewBox="0 0 520 620"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      preserveAspectRatio="xMidYMax slice"
    >
      {Array.from({ length: lines }, (_, i) => {
        const offset = i * 17;
        const amp = 52 - i * 1.4;
        return (
          <path
            key={i}
            d={`M-40 ${210 + offset}
                C 70 ${210 + offset - amp}, 150 ${210 + offset + amp * 0.7}, 260 ${210 + offset - amp * 0.2}
                S 440 ${210 + offset + amp * 0.9}, 560 ${210 + offset - amp * 0.4}`}
            opacity={0.1 + (i / lines) * 0.34}
          />
        );
      })}
    </svg>
  );
}

export function AuthDots({ className }: { className?: string }) {
  const cols = 7;
  const rows = 6;
  const gap = 13;

  return (
    <svg
      viewBox={`0 0 ${cols * gap} ${rows * gap}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <circle
            key={`${r}-${c}`}
            cx={c * gap + 2.5}
            cy={r * gap + 2.5}
            r="2.1"
            fill="currentColor"
            opacity={0.5 - r * 0.05}
          />
        ))
      )}
    </svg>
  );
}
