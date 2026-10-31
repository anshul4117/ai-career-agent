import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL &&
    !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
      ? process.env.NEXT_PUBLIC_APP_URL
      : process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NODE_ENV === "production"
              ? "https://ai-career-agent-web.vercel.app"
              : "http://localhost:3000";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/profile/",
        "/settings/",
        "/resume/",
        "/cover-letters/",
        "/applications/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
