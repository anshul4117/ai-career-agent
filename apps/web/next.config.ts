import type { NextConfig } from "next";
import path from "path";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, "../../"),
  async rewrites() {
    // In production with Vercel Services enabled, the edge router directs /api/v1/:path*
    // directly to the NestJS api service before reaching Next.js.
    // In local development, Next.js proxies /api/v1/:path* to the local NestJS dev server.
    // Production traffic MUST NEVER be routed to localhost.
    if (process.env.NODE_ENV === "production") {
      const backendUrl =
        process.env.INTERNAL_API_URL || process.env.BACKEND_URL;
      if (backendUrl && !backendUrl.includes("localhost")) {
        return [
          {
            source: "/api/v1/:path*",
            destination: `${backendUrl.replace(/\/+$/, "")}/api/v1/:path*`,
          },
        ];
      }
      return [];
    }

    const devBackendUrl =
      process.env.INTERNAL_API_URL ||
      process.env.BACKEND_URL ||
      "http://localhost:4000";

    return [
      {
        source: "/api/v1/:path*",
        destination: `${devBackendUrl.replace(/\/+$/, "")}/api/v1/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
