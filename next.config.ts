import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(process.cwd(), "styles")],
    silenceDeprecations: ["legacy-js-api"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  env: {
    APP_NAME: "Partner Portal",
  },
};

export default nextConfig;
