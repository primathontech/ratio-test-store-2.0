import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const base = siteUrl.replace(/\/+$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account",
        "/orders",
        "/pages/orders",
        "/cart",
        "/checkout",
        "/api/",
        "/pages/searchtap-search",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
