import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (process.env.SITE_URL ?? "https://tour-armenia.com").replace(/\/$/, "");
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/driver/", "/api/", "/bff/", "/internal/"] }, sitemap: `${siteUrl}/sitemap.xml`, host: siteUrl };
}
