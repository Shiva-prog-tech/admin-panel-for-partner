/**
 * Sign-in artwork: a gold shield with a padlock resting on a stacked podium,
 * with floating spheres. Built as SVG so the auth screens stay asset-free.
 */
export default function ShieldLockArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="A padlocked shield on a podium"
    >
      <defs>
        <linearGradient id="sl-shield" x1="88" y1="76" x2="232" y2="212" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F5D68B" />
          <stop offset="0.45" stopColor="#E4B152" />
          <stop offset="1" stopColor="#C98A14" />
        </linearGradient>
        <linearGradient id="sl-podium-top" x1="64" y1="196" x2="256" y2="232" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFDF8" />
          <stop offset="1" stopColor="#F6EEDF" />
        </linearGradient>
        <linearGradient id="sl-podium-side" x1="64" y1="214" x2="256" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F1E7D5" />
          <stop offset="1" stopColor="#E4D7BF" />
        </linearGradient>
        <radialGradient id="sl-ball" cx="0.34" cy="0.3" r="0.78">
          <stop offset="0" stopColor="#FBE7B4" />
          <stop offset="0.55" stopColor="#E9BC5C" />
          <stop offset="1" stopColor="#C1840F" />
        </radialGradient>
        <radialGradient id="sl-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#E8B84E" stopOpacity="0.28" />
          <stop offset="1" stopColor="#E8B84E" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ambient glow */}
      <circle cx="160" cy="150" r="130" fill="url(#sl-glow)" />

      {/* podium — lower tier */}
      <ellipse cx="160" cy="268" rx="104" ry="27" fill="#EADFCB" opacity="0.55" />
      <path d="M56 244a104 27 0 0 0 208 0v14a104 27 0 0 1-208 0Z" fill="url(#sl-podium-side)" />
      <ellipse cx="160" cy="244" rx="104" ry="27" fill="url(#sl-podium-top)" />

      {/* podium — upper tier */}
      <path d="M84 224a76 20 0 0 0 152 0v13a76 20 0 0 1-152 0Z" fill="url(#sl-podium-side)" />
      <ellipse cx="160" cy="224" rx="76" ry="20" fill="url(#sl-podium-top)" />

      {/* contact shadow */}
      <ellipse cx="160" cy="222" rx="46" ry="11" fill="#D9C7A6" opacity="0.45" />

      {/* shield */}
      <path
        d="M160 62l70 27v52c0 33-28 55-70 68-42-13-70-35-70-68V89Z"
        fill="url(#sl-shield)"
      />
      <path
        d="M160 76l57 22v43c0 26-23 45-57 56-34-11-57-30-57-56V98Z"
        fill="#F6DFA6"
        opacity="0.55"
      />

      {/* padlock */}
      <path
        d="M143 140v-13a17 17 0 0 1 34 0v13"
        fill="none"
        stroke="#2C2A28"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <rect x="132" y="138" width="56" height="46" rx="11" fill="#2C2A28" />
      <circle cx="160" cy="156" r="5.5" fill="#F3D68F" />
      <path d="M160 160.5l-2.6 12h5.2Z" fill="#F3D68F" />

      {/* floating spheres */}
      <circle cx="252" cy="118" r="13" fill="url(#sl-ball)" />
      <circle cx="72" cy="286" r="11" fill="url(#sl-ball)" />
      <circle cx="236" cy="206" r="7" fill="url(#sl-ball)" opacity="0.9" />
      <circle cx="222" cy="146" r="18" fill="#F7E6BE" opacity="0.5" />
      <circle cx="66" cy="130" r="6" fill="url(#sl-ball)" opacity="0.75" />
    </svg>
  );
}
