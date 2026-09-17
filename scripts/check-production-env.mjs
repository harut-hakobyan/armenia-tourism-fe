const required = ["SITE_URL", "LARAVEL_INTERNAL_API_URL", "NEXT_PUBLIC_API_BASE_URL"];
const failures = [];

for (const name of required) {
  if (!process.env[name]) failures.push(`${name} is required`);
}

if (process.env.SITE_URL) {
  const site = new URL(process.env.SITE_URL);
  if (site.protocol !== "https:") failures.push("SITE_URL must use HTTPS");
  if (site.pathname !== "/") failures.push("SITE_URL must contain only the origin");
  if (["localhost", "127.0.0.1"].includes(site.hostname)) failures.push("SITE_URL cannot use localhost in production");
}

if (process.env.NEXT_PUBLIC_API_BASE_URL && process.env.NEXT_PUBLIC_API_BASE_URL !== "/api/v1") {
  failures.push("NEXT_PUBLIC_API_BASE_URL must be /api/v1 so browser requests remain same-origin");
}

if (process.env.LARAVEL_INTERNAL_API_URL && !process.env.LARAVEL_INTERNAL_API_URL.endsWith("/api/v1")) {
  failures.push("LARAVEL_INTERNAL_API_URL must end with /api/v1");
}

if (failures.length) {
  throw new Error(`Production environment is invalid:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}

console.log(JSON.stringify({ valid: true, siteUrl: process.env.SITE_URL, sameOriginApi: true }));
