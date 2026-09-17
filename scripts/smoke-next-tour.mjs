import assert from "node:assert/strict";

const origin = process.env.NEXT_SMOKE_ORIGIN ?? "http://127.0.0.1:3100";
const localePrefix = "/en";

async function get(path) {
  const localizedPath = path === "/robots.txt" || path === "/sitemap.xml" || path.startsWith("/api/") ? path : `${localePrefix}${path === "/" ? "" : path}`;
  const response = await fetch(`${origin}${localizedPath}`);
  const body = await response.text();
  assert.equal(response.status, 200, path);
  return { response, body };
}

const { body: homeHtml } = await get("/");
assert.match(homeHtml, /<h1[^>]*>Discover Armenia Together<\/h1>/);
assert.match(homeHtml, /rel="canonical" href="https:\/\/tour-armenia.com\/en"/);

const { body: catalogHtml } = await get("/tours");
assert.match(catalogHtml, /<h1[^>]*>Group tours across Armenia<\/h1>/);
assert.match(catalogHtml, /href="\/en\/tours\/[^"?]+"/);

const { body: privateHtml } = await get("/tours?format=private");
assert.match(privateHtml, /<h1[^>]*>Private tours across Armenia<\/h1>/);
assert.match(privateHtml, /rel="canonical" href="https:\/\/tour-armenia.com\/en\/tours"/);

const { body: filteredHtml } = await get("/tours?format=all&utm_source=test");
assert.match(filteredHtml, /rel="canonical" href="https:\/\/tour-armenia.com\/en\/tours"/);
assert.doesNotMatch(filteredHtml, /canonical[^>]+utm_source/);

const { body: categoryHtml } = await get("/tours/category/historical");
assert.match(categoryHtml, /<h1[^>]*>Group tours across Armenia<\/h1>/);

const { response: sitemapResponse, body: sitemapXml } = await get("/sitemap.xml");
assert.match(sitemapResponse.headers.get("content-type") ?? "", /xml/);
assert.match(sitemapXml, /https:\/\/tour-armenia.com\/en\/tours\/category\/historical/);
assert.match(sitemapXml, /https:\/\/tour-armenia.com\/fa\/tours\/category\/historical/);

const { body: robotsText } = await get("/robots.txt");
assert.match(robotsText, /Sitemap: https:\/\/tour-armenia.com\/sitemap.xml/);

const migratedRoutes = [
  ["/destinations", /Discover Armenia/], ["/cars", /Comfort for every Armenian road/],
  ["/build-your-trip", /Build Your Trip/], ["/booking", /Your Armenia journey/],
  ["/about", /Armenia is better shared/], ["/contact", /plan your Armenia trip/],
  ["/faq", /Frequently asked questions/],
];
for (const [path, content] of migratedRoutes) {
  const { body } = await get(path);
  assert.match(body, content, path);
}

const { body: adminLoginHtml } = await get("/admin/login");
assert.match(adminLoginHtml, /<title>Operations sign in \| Armenia Journeys<\/title>/);
assert.match(adminLoginHtml, /name="robots" content="noindex, nofollow, noarchive"/);

const unknownResponse = await fetch(`${origin}/en/route-that-does-not-exist`);
assert.equal(unknownResponse.status, 404);

const toursResponse = await fetch(`${origin}/api/v1/tours`);
assert.equal(toursResponse.status, 200);
const toursPayload = await toursResponse.json();
const tour = toursPayload.data?.[0];
assert.ok(tour?.slug, "The backend should expose at least one tour");

const { body: tourHtml } = await get(`/tours/${tour.slug}?utm_source=test`);
assert.match(tourHtml, new RegExp(`<h1[^>]*>${tour.title.replaceAll("&", "&amp;")}<\\/h1>`));
assert.match(tourHtml, new RegExp(`rel="canonical" href="https:\\/\\/tour-armenia.com\\/en\\/tours\\/${tour.slug}"`));
assert.match(tourHtml, /application\/ld\+json/);
assert.match(tourHtml, /href="\/en\/booking\?/);
assert.doesNotMatch(tourHtml, /canonical[^>]+utm_source/);

const missingResponse = await fetch(`${origin}/en/tours/does-not-exist`);
const missingHtml = await missingResponse.text();
assert.equal(missingResponse.status, 404);
assert.match(missingHtml, /name="robots" content="noindex"/);
assert.match(missingHtml, /Tour not found/);

console.log(JSON.stringify({
  routeCount: migratedRoutes.length + 9,
  tourSlug: tour.slug,
  rawHtmlBytes: Buffer.byteLength(tourHtml),
  serverRendered: true,
  metadata: true,
  bookingLink: true,
  structuredData: true,
}));
