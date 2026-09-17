import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const forwardedRequestHeaders = ["accept", "accept-language", "authorization", "content-type", "ngrok-skip-browser-warning"];
const forwardedResponseHeaders = ["cache-control", "content-disposition", "content-language", "content-type", "etag", "last-modified"];

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const apiBaseUrl = (process.env.LARAVEL_INTERNAL_API_URL ?? "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");
  const target = new URL(`${apiBaseUrl}/${path.map(encodeURIComponent).join("/")}`);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  for (const name of forwardedRequestHeaders) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const response = await fetch(target, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
    redirect: "manual",
    signal: AbortSignal.timeout(120_000),
  });

  const responseHeaders = new Headers();
  for (const name of forwardedResponseHeaders) {
    const value = response.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
