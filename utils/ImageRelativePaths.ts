// ===========================================================================
// Public asset paths — one source of truth, mirroring the reference project's
// utils/ImageRelativePaths.ts.
//
// This panel draws its iconography inline (Components/Icons, Components/
// Illustrations) so it has no runtime image requests. What lives here is the
// small set of genuinely static files under public/, plus the folder roots so
// new assets are referenced through a constant rather than a scattered string
// literal.
// ===========================================================================

const ASSETS = "/assets";

export const AssetRoots = {
  assets: ASSETS,
  images: `${ASSETS}/images`,
  pngs: `${ASSETS}/pngs`,
  svgs: `${ASSETS}/svgs`,
} as const;

/** Static documents served straight out of public/. */
export const Documents = {
  termsAndConditions: "/terms-and-conditions.html",
  privacyPolicy: "/terms-and-conditions.html#privacy",
} as const;

/** App icon — Next.js resolves app/icon.svg into the <link rel="icon">. */
export const Icons = {
  appIcon: "/icon.svg",
} as const;

/**
 * Builds a public asset URL from one of the roots above.
 *
 *   imagePath("svgs", "brand-logo.svg") → "/assets/svgs/brand-logo.svg"
 */
export function imagePath(
  root: keyof typeof AssetRoots,
  file: string
): string {
  const base = AssetRoots[root];
  return `${base}/${file.replace(/^\/+/, "")}`;
}

export default { AssetRoots, Documents, Icons, imagePath };
