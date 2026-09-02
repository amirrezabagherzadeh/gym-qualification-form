import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  agentRules: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com; script-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com; connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com; font-src 'self' data:;",
          },
        ],
      },
    ];
  },
};

export default withBotId(nextConfig);
