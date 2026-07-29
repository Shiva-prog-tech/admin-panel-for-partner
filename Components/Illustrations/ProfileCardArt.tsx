/**
 * Sign-up artwork: a profile card on a podium with a gold "add" badge.
 * Shares the podium and sphere language with ShieldLockArt.
 */
export default function ProfileCardArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="A new profile card being created"
    >
      <defs>
        <linearGradient id="pc-badge" x1="196" y1="176" x2="260" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F2CA72" />
          <stop offset="0.5" stopColor="#E0A932" />
          <stop offset="1" stopColor="#C1840F" />
        </linearGradient>
        <linearGradient id="pc-avatar" x1="76" y1="118" x2="112" y2="154" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F3D389" />
          <stop offset="1" stopColor="#DDA22C" />
        </linearGradient>
        <linearGradient id="pc-podium-top" x1="64" y1="196" x2="256" y2="232" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFDF8" />
          <stop offset="1" stopColor="#F6EEDF" />
        </linearGradient>
        <linearGradient id="pc-podium-side" x1="64" y1="214" x2="256" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F1E7D5" />
          <stop offset="1" stopColor="#E4D7BF" />
        </linearGradient>
        <radialGradient id="pc-ball" cx="0.34" cy="0.3" r="0.78">
          <stop offset="0" stopColor="#FBE7B4" />
          <stop offset="0.55" stopColor="#E9BC5C" />
          <stop offset="1" stopColor="#C1840F" />
        </radialGradient>
        <radialGradient id="pc-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#E8B84E" stopOpacity="0.26" />
          <stop offset="1" stopColor="#E8B84E" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="160" cy="152" r="130" fill="url(#pc-glow)" />

      {/* podium */}
      <ellipse cx="160" cy="268" rx="104" ry="27" fill="#EADFCB" opacity="0.55" />
      <path d="M56 244a104 27 0 0 0 208 0v14a104 27 0 0 1-208 0Z" fill="url(#pc-podium-side)" />
      <ellipse cx="160" cy="244" rx="104" ry="27" fill="url(#pc-podium-top)" />
      <path d="M84 224a76 20 0 0 0 152 0v13a76 20 0 0 1-152 0Z" fill="url(#pc-podium-side)" />
      <ellipse cx="160" cy="224" rx="76" ry="20" fill="url(#pc-podium-top)" />
      <ellipse cx="152" cy="222" rx="52" ry="12" fill="#D9C7A6" opacity="0.42" />

      {/* profile card */}
      <g transform="rotate(-3 150 158)">
        <rect x="56" y="98" width="188" height="118" rx="16" fill="#FFFFFF" />
        <rect
          x="56"
          y="98"
          width="188"
          height="118"
          rx="16"
          fill="none"
          stroke="#F0E4CC"
          strokeWidth="1.6"
        />

        {/* avatar */}
        <circle cx="94" cy="136" r="19" fill="url(#pc-avatar)" />
        <circle cx="94" cy="131" r="6.4" fill="#FFFFFF" opacity="0.95" />
        <path d="M83.5 147a11.5 11.5 0 0 1 21 0Z" fill="#FFFFFF" opacity="0.95" />

        {/* text lines beside the avatar */}
        <rect x="124" y="126" width="86" height="8" rx="4" fill="#EFE3CB" />
        <rect x="124" y="141" width="58" height="7" rx="3.5" fill="#F5EDDD" />

        {/* body lines */}
        <rect x="76" y="174" width="150" height="8" rx="4" fill="#F2E7D2" />
        <rect x="76" y="190" width="106" height="8" rx="4" fill="#F7F0E2" />
      </g>

      {/* add badge */}
      <circle cx="228" cy="208" r="31" fill="url(#pc-badge)" />
      <circle cx="228" cy="208" r="31" fill="none" stroke="#FFFFFF" strokeWidth="4" opacity="0.55" />
      <path
        d="M228 194v28M214 208h28"
        stroke="#FFFFFF"
        strokeWidth="5.5"
        strokeLinecap="round"
      />

      {/* floating spheres */}
      <circle cx="60" cy="234" r="12" fill="url(#pc-ball)" />
      <circle cx="256" cy="120" r="9" fill="url(#pc-ball)" />
      <circle cx="264" cy="176" r="14" fill="#F7E6BE" opacity="0.55" />
      <circle cx="46" cy="150" r="6" fill="url(#pc-ball)" opacity="0.8" />
      <circle cx="212" cy="92" r="6.5" fill="url(#pc-ball)" opacity="0.85" />
    </svg>
  );
}
