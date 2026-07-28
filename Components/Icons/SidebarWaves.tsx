/**
 * Decorative line-art swell that sits behind the sidebar footer.
 * Purely ornamental — hidden from assistive tech.
 */
export default function SidebarWaves({ className }: { className?: string }) {
  const lines = 13;

  return (
    <svg
      viewBox="0 0 300 150"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
    >
      {Array.from({ length: lines }, (_, i) => {
        const offset = i * 6.5;
        const amp = 16 + i * 1.4;
        return (
          <path
            key={i}
            d={`M-10 ${58 + offset}
                C 40 ${58 + offset - amp}, 92 ${58 + offset + amp * 0.55}, 148 ${58 + offset - amp * 0.15}
                S 250 ${58 + offset + amp * 0.85}, 312 ${58 + offset - amp * 0.35}`}
            opacity={0.16 + (i / lines) * 0.62}
          />
        );
      })}
    </svg>
  );
}
