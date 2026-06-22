/**
 * Next.js Middleware
 *
 * Runs the core middleware (locale detection + A/B testing), then layers
 * shareable/editor preview routing on top.
 *
 * @module middleware
 */

import { NextResponse, type NextRequest } from "next/server";

import { createMiddleware } from "@/bootstrap/middleware";
import { i18nConfig } from "@/bootstrap/i18n-config";

const baseMiddleware = createMiddleware({
  i18n: {
    locales: i18nConfig.locales,
    defaultLocale: i18nConfig.defaultLocale,
    cookieName: i18nConfig.localeDetection.cookieName,
  },
  abTestCookies: {
    home: "_prima_ptr_ab_home",
    collection: "_prima_ptr_ab_collection",
    product: "_prima_ptr_ab_product",
  },
});

// Sticky shareable-preview session cookies (survive in-app navigation, since
// internal links drop the query string). The id/version are httpOnly
// (server-only); ACTIVE is a non-httpOnly mirror flag the client "Exit preview"
// bar reads to know a preview is active. ACTIVE carries no secret — just "1".
const PREVIEW_COOKIE = "editorPreviewId";
const PREVIEW_VERSION_COOKIE = "editorPreviewVersion";
const PREVIEW_ACTIVE_COOKIE = "editorPreviewActive";
const COOKIE_BASE = { sameSite: "lax" as const, path: "/" };

export function middleware(request: NextRequest) {
  // Core middleware first (locale detection, A/B-test rewrites)…
  const response = baseMiddleware(request);
  // …then layer preview routing on its result.
  return applyPreviewRouting(request, response);
}

/**
 * Shareable / editor preview routing: forwards the active previewId as the
 * `x-editor-preview-id` request header so the loader serves the snapshot.
 * ?previewKey = editor live edit (untouched); ?editorPreview=false = exit;
 * ?editorPreview=true&previewId = enter (+persist); sticky cookie = stay.
 * ?editor=true is a transient session (query-only, never persisted).
 */
function applyPreviewRouting(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const searchParams = request.nextUrl.searchParams;

  // Editor-bridge live edit drives the body via postMessage — never inject here.
  if (searchParams.has("previewKey")) {
    return response;
  }

  const isEditorBridge = searchParams.get("editor") === "true";
  const flag = searchParams.get("editorPreview");

  // Exit → drop the whole sticky session (delete is idempotent).
  if (flag === "false") {
    response.cookies.delete(PREVIEW_COOKIE);
    response.cookies.delete(PREVIEW_VERSION_COOKIE);
    response.cookies.delete(PREVIEW_ACTIVE_COOKIE);
    return response;
  }

  // Resolve the active previewId/version: the link's query wins; otherwise the
  // sticky cookie (read for NORMAL browsing only — the editor never uses it).
  const queryPreviewId = flag === "true" ? searchParams.get("previewId") : null;
  const queryVersion = flag === "true" ? searchParams.get("version") : null;
  const cookiePreviewId = isEditorBridge
    ? null
    : (request.cookies.get(PREVIEW_COOKIE)?.value ?? null);
  const cookieVersion = isEditorBridge
    ? null
    : (request.cookies.get(PREVIEW_VERSION_COOKIE)?.value ?? null);

  const previewId = queryPreviewId ?? cookiePreviewId;
  if (!previewId) {
    return response;
  }

  // Version pins to the link's value when entering; sticky reuses the cookie.
  // Null/absent → backend serves the latest version.
  const version = queryPreviewId
    ? queryVersion
    : (queryVersion ?? cookieVersion);

  // Forward the previewId to the app as a request header, re-emitting base's
  // response so its locale/A-B output survives (see carryOver).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-editor-preview-id", previewId);
  if (version) {
    requestHeaders.set("x-editor-preview-version", version);
  }

  const rewriteTo = response.headers.get("x-middleware-rewrite");
  const forwarded = carryOver(
    response,
    rewriteTo
      ? NextResponse.rewrite(new URL(rewriteTo), {
          request: { headers: requestHeaders },
        })
      : NextResponse.next({ request: { headers: requestHeaders } })
  );

  // Persist the sticky session for NORMAL browsing only (never the editor).
  if (!isEditorBridge) {
    // Client-readable flag for the "Exit preview" bar (session cookie).
    forwarded.cookies.set(PREVIEW_ACTIVE_COOKIE, "1", COOKIE_BASE);
    // Entering via a link → persist (or refresh) the httpOnly session so
    // param-less navigations stay in preview at the same version.
    if (queryPreviewId) {
      const opts = { httpOnly: true, ...COOKIE_BASE };
      forwarded.cookies.set(PREVIEW_COOKIE, queryPreviewId, opts);
      if (queryVersion) {
        forwarded.cookies.set(PREVIEW_VERSION_COOKIE, queryVersion, opts);
      } else {
        forwarded.cookies.delete(PREVIEW_VERSION_COOKIE);
      }
    }
  }

  return forwarded;
}

/**
 * Re-emit base middleware's response (locale/A-B headers + cookies) onto a
 * forwarded next()/rewrite() that injects the preview request header. Next's
 * internal `x-middleware-*` control headers are skipped — `to` sets its own.
 */
function carryOver(from: NextResponse, to: NextResponse): NextResponse {
  from.headers.forEach((value, key) => {
    if (!key.startsWith("x-middleware-")) {
      to.headers.set(key, value);
    }
  });
  from.cookies.getAll().forEach((cookie) => to.cookies.set(cookie));
  return to;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
