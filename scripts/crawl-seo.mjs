import assert from "node:assert/strict";

const origin = (process.env.NEXT_SMOKE_ORIGIN ?? "http://127.0.0.1:3100").replace(/\/$/, "");

function decode(value) {
  return value.replaceAll("&amp;", "&");
}

function matches(html, pattern) {
  return pattern.exec(html)?.[1];
}

const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
assert.equal(sitemapResponse.status, 200, "sitemap.xml");
const sitemap = await sitemapResponse.text();
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
assert.ok(sitemapUrls.length > 0, "The sitemap must contain URLs");
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "The sitemap must not contain duplicate URLs");

const internalPaths = new Set(["/robots.txt"]);
const canonicalPaths = new Map();
const failures = [];

for (const sitemapUrl of sitemapUrls) {
  const publicUrl = new URL(sitemapUrl);
  const path = `${publicUrl.pathname}${publicUrl.search}`;
  const response = await fetch(`${origin}${path}`);
  const html = await response.text();
  const title = matches(html, /<title>([^<]+)<\/title>/i);
  const description = matches(html, /<meta name="description" content="([^"]+)"/i);
  const canonical = matches(html, /<link rel="canonical" href="([^"]+)"/i);
  const robots = matches(html, /<meta name="robots" content="([^"]+)"/i) ?? "";

  if (response.status !== 200) failures.push(`${path}: HTTP ${response.status}`);
  if (!title) failures.push(`${path}: missing title`);
  if (!description) failures.push(`${path}: missing meta description`);
  if (!canonical) failures.push(`${path}: missing canonical URL`);
  if (/noindex/i.test(robots)) failures.push(`${path}: sitemap URL is noindex`);

  if (canonical) {
    const canonicalUrl = new URL(decode(canonical));
    const canonicalPath = `${canonicalUrl.pathname}${canonicalUrl.search}`;
    if (canonicalPath !== path) failures.push(`${path}: canonical points to ${canonicalPath}`);
    const previous = canonicalPaths.get(canonical);
    if (previous && previous !== path) failures.push(`${path}: canonical duplicates ${previous}`);
    canonicalPaths.set(canonical, path);
  }

  for (const match of html.matchAll(/href="([^"#]+)"/g)) {
    const href = decode(match[1]);
    if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/_next/") && !href.startsWith("/api/")) {
      internalPaths.add(href);
    }
  }
}

for (const path of internalPaths) {
  const response = await fetch(`${origin}${path}`, { redirect: "manual" });
  if (response.status >= 400) failures.push(`${path}: broken internal link (HTTP ${response.status})`);
}

if (failures.length) {
  throw new Error(`SEO crawl failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}

console.log(JSON.stringify({
  sitemapUrls: sitemapUrls.length,
  internalLinks: internalPaths.size,
  uniqueCanonicals: canonicalPaths.size,
  failures: 0,
}));
