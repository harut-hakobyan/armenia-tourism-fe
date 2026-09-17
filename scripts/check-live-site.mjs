import assert from "node:assert/strict";

const origin = (process.env.PRODUCTION_ORIGIN ?? "https://tour-armenia.com").replace(/\/$/, "");
const canonicalOrigin = process.env.EXPECTED_CANONICAL_ORIGIN?.replace(/\/$/, "") ?? origin;
const robotsOrigin = process.env.EXPECTED_ROBOTS_ORIGIN?.replace(/\/$/, "") ?? canonicalOrigin;

async function request(path, options = {}) {
  const response = await fetch(`${origin}${path}`, { signal: AbortSignal.timeout(20_000), ...options });
  return { response, body: await response.text() };
}

const root = await fetch(`${origin}/`, { redirect: "manual", signal: AbortSignal.timeout(20_000) });
assert.equal(root.status, 308, "The unlocalized homepage must permanently redirect");
assert.equal(new URL(root.headers.get("location"), origin).pathname, "/en");

for (const locale of ["en", "ru", "hy", "fa"]) {
  const { response, body } = await request(`/${locale}`);
  assert.equal(response.status, 200, `/${locale}`);
  assert.match(body, new RegExp(`<html lang="${locale}"`));
  assert.match(body, new RegExp(`rel="canonical" href="${canonicalOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/${locale}"`));
  for (const alternate of ["en", "ru", "hy", "fa", "x-default"]) {
    assert.match(body, new RegExp(`hrefLang="${alternate}"`));
  }
  if (locale === "fa") assert.match(body, /<html lang="fa" dir="rtl"/);
}

const { response: robotsResponse, body: robots } = await request("/robots.txt");
assert.equal(robotsResponse.status, 200);
assert.match(robots, new RegExp(`Sitemap: ${robotsOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap.xml`));
assert.match(robots, /Disallow: \/admin\//);
assert.match(robots, /Disallow: \/api\//);

const { response: sitemapResponse, body: sitemap } = await request("/sitemap.xml");
assert.equal(sitemapResponse.status, 200);
assert.match(sitemapResponse.headers.get("content-type") ?? "", /xml/);
assert.match(sitemap, new RegExp(`${canonicalOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/fa`));

const api = await fetch(`${origin}/api/v1/tours?locale=fa&per_page=1`, { signal: AbortSignal.timeout(20_000) });
assert.equal(api.status, 200, "Same-origin API proxy");
assert.match(api.headers.get("content-type") ?? "", /json/);

console.log(JSON.stringify({ origin, https: new URL(origin).protocol === "https:", locales: 4, robots: true, sitemap: true, apiProxy: true }));
