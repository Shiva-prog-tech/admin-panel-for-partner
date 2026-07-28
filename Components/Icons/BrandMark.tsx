interface BrandMarkProps {
  size?: number;
  className?: string;
}

/**
 * The isometric gold cube used as the Partner Portal mark. Pure SVG so it
 * stays crisp at any density and needs no asset pipeline.
 */
export default function BrandMark({ size = 34, className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Partner Portal"
    >
      <defs>
        <linearGradient id="pa-cube-top" x1="4" y1="4" x2="28" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F7DEA4" />
          <stop offset="1" stopColor="#E3B45C" />
        </linearGradient>
        <linearGradient id="pa-cube-left" x1="4" y1="11" x2="16" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C98A14" />
          <stop offset="1" stopColor="#9C6A0D" />
        </linearGradient>
        <linearGradient id="pa-cube-right" x1="16" y1="14" x2="28" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#EFB63F" />
          <stop offset="1" stopColor="#CE9013" />
        </linearGradient>
      </defs>

      {/* top face */}
      <path d="M16 3.2 28.6 10.5 16 17.8 3.4 10.5Z" fill="url(#pa-cube-top)" />
      <path d="M16 3.2 28.6 10.5 16 17.8Z" fill="#E7BC63" />

      {/* left face */}
      <path d="M3.4 10.5 16 17.8v11L3.4 21.5Z" fill="url(#pa-cube-left)" />

      {/* right face */}
      <path d="M28.6 10.5v11L16 28.8v-11Z" fill="url(#pa-cube-right)" />

      {/* inner ribbon cut — reads as a folded facet */}
      <path
        d="M9.7 14.1 16 17.8v6.1l-6.3-3.6Z"
        fill="#EFC469"
        opacity="0.55"
      />
      <path
        d="M22.3 14.1 16 17.8v6.1l6.3-3.6Z"
        fill="#FBE6B4"
        opacity="0.4"
      />

      {/* crisp silhouette */}
      <path
        d="M16 3.2 28.6 10.5v11L16 28.8 3.4 21.5v-11Z"
        fill="none"
        stroke="#B9800F"
        strokeOpacity="0.35"
        strokeWidth="0.7"
      />
    </svg>
  );
}
