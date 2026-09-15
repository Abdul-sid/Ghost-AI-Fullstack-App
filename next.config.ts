import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Clerk-hosted avatars shown in the share dialog.
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
