import { cx } from "@/utils/helper";

interface AvatarProps {
  size?: number;
  name?: string;
  className?: string;
  ring?: boolean;
}

/**
 * Illustrated placeholder portrait. Rendered inline (no network asset) so the
 * shell has zero external image dependencies; swap `src` in when the profile
 * service returns a real photo.
 */
export default function Avatar({
  size = 38,
  name = "John Doe",
  className,
  ring = false,
}: AvatarProps) {
  return (
    <span
      className={cx("avatar", className)}
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        borderRadius: "999px",
        overflow: "hidden",
        flex: "0 0 auto",
        boxShadow: ring ? "0 0 0 2px var(--bg-panel), 0 0 0 3px var(--border)" : undefined,
      }}
      title={name}
      aria-label={name}
      role="img"
    >
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="pa-av-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#E9EDF3" />
            <stop offset="1" stopColor="#D6DDE7" />
          </linearGradient>
          <linearGradient id="pa-av-shirt" x1="12" y1="44" x2="52" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3B4658" />
            <stop offset="1" stopColor="#28303D" />
          </linearGradient>
          <clipPath id="pa-av-clip">
            <circle cx="32" cy="32" r="32" />
          </clipPath>
        </defs>

        <g clipPath="url(#pa-av-clip)">
          <rect width="64" height="64" fill="url(#pa-av-bg)" />

          {/* shoulders / jacket */}
          <path
            d="M32 40c11.5 0 20.5 7.4 22.5 18.4L56 64H8l1.5-5.6C11.5 47.4 20.5 40 32 40Z"
            fill="url(#pa-av-shirt)"
          />
          {/* collar */}
          <path d="M32 40c3 0 5.8.4 8.4 1.2L32 52l-8.4-10.8A31 31 0 0 1 32 40Z" fill="#F2F4F8" />
          <path d="M32 52 27 45h10Z" fill="#C79320" />

          {/* neck */}
          <path d="M27 33h10v9c0 1.4-2.2 2.4-5 2.4S27 43.4 27 42Z" fill="#E7B58F" />
          {/* head */}
          <ellipse cx="32" cy="25" rx="11" ry="12.4" fill="#F0C39C" />
          {/* ears */}
          <ellipse cx="21" cy="26" rx="1.7" ry="2.4" fill="#E4B189" />
          <ellipse cx="43" cy="26" rx="1.7" ry="2.4" fill="#E4B189" />
          {/* hair */}
          <path
            d="M32 10c7.2 0 11.6 4.4 11.6 10.6 0 1.9-.3 3.4-.8 4.6l-1.6-6.4c-3-1.6-5.9-2.3-9.2-2.3s-6.2.7-9.2 2.3l-1.6 6.4c-.5-1.2-.8-2.7-.8-4.6C20.4 14.4 24.8 10 32 10Z"
            fill="#2E2A28"
          />
          {/* beard */}
          <path
            d="M22.6 27c.9 6.4 4.6 10.6 9.4 10.6s8.5-4.2 9.4-10.6c.6 4.6-.4 8.6-2.6 11.2-1.8 2.1-4.2 3.2-6.8 3.2s-5-1.1-6.8-3.2c-2.2-2.6-3.2-6.6-2.6-11.2Z"
            fill="#332E2B"
            opacity="0.9"
          />
          {/* brows + eyes */}
          <path d="M26.4 22.6c1.4-.7 2.9-.7 4.3 0" stroke="#2E2A28" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <path d="M33.3 22.6c1.4-.7 2.9-.7 4.3 0" stroke="#2E2A28" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <circle cx="28.2" cy="26.2" r="1.5" fill="#2C2A2A" />
          <circle cx="35.8" cy="26.2" r="1.5" fill="#2C2A2A" />
          {/* mouth */}
          <path d="M29.6 32.4c1.5.9 3.3.9 4.8 0" stroke="#8E5B45" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </span>
  );
}
