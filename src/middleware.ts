/**
 * Next.js Middleware
 *
 * Handles locale detection and A/B testing rewrites.
 * Add custom logic before/after the core middleware as needed.
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

// Persists the active shareable-preview session so it survives in-app
// navigation (internal links drop the query string).
const PREVIEW_COOKIE = "editorPreviewId";
const PREVIEW_VERSION_COOKIE = "editorPreviewVersion";

export function middleware(request: NextRequest) {
  // Add custom logic BEFORE core middleware here

  // Core middleware (locale detection, A/B tests)
  const response = baseMiddleware(request);

  // Add custom logic AFTER core middleware here

  // Shareable preview links (?editorPreview=true&previewId=…). To keep the user
  // in preview mode across in-app navigation (internal links drop the query
  // string), the active previewId is persisted in a cookie:
  //   • ?editorPreview=true&previewId=…  → enter / refresh preview (set cookie)
  //   • no params, cookie present        → stay in preview (sticky)
  //   • ?editorPreview=false             → exit preview (clear cookie)
  // The resolved id is forwarded as the x-editor-preview-id REQUEST header so
  // the template loader (single chokepoint) serves the editor snapshot on any
  // route. We re-emit base's response (next or A/B rewrite) with the augmented
  // request headers, copying its headers + cookies so locale/A/B is preserved.
  const sp = request.nextUrl.searchParams;

  // Editor LIVE preview (editor-bridge: ?editor=true / ?previewKey=…) is a
  // separate mechanism — the editor pushes config over postMessage and the
  // page reads it via readEditorPreviewState. The shareable-preview cookie/
  // header must never touch those requests, or it would override the live edits
  // with a stale shared snapshot. Leave editor-bridge requests untouched.
  if (sp.get("editor") === "true" || sp.has("previewKey")) {
    return response;
  }

  const flag = sp.get("editorPreview");
  const cookiePreviewId = request.cookies.get(PREVIEW_COOKIE)?.value ?? null;
  const cookieVersion =
    request.cookies.get(PREVIEW_VERSION_COOKIE)?.value ?? null;

  // Explicit exit clears the sticky session and returns to normal browsing.
  if (flag === "false") {
    if (cookiePreviewId) response.cookies.delete(PREVIEW_COOKIE);
    if (cookieVersion) response.cookies.delete(PREVIEW_VERSION_COOKIE);
    return response;
  }

  // Query (entering) wins over the cookie (sticky); null when neither applies.
  const queryPreviewId = flag === "true" ? sp.get("previewId") : null;
  const queryVersion = flag === "true" ? sp.get("version") : null;
  const previewId = queryPreviewId ?? cookiePreviewId;
  if (!previewId) return response;
  // Version pins to the link's value; sticky navigations reuse the cookie.
  // Null/absent → backend serves the latest version.
  const version = queryPreviewId
    ? queryVersion
    : (queryVersion ?? cookieVersion);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-editor-preview-id", previewId);
  if (version) requestHeaders.set("x-editor-preview-version", version);

  const rewriteTo = response.headers.get("x-middleware-rewrite");
  const forwarded = rewriteTo
    ? NextResponse.rewrite(new URL(rewriteTo), {
        request: { headers: requestHeaders },
      })
    : NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.forEach((value, key) => {
    // Skip Next's internal control headers — they belong to `response`'s own
    // emit and are re-set correctly by the forwarded next()/rewrite() above.
    if (!key.startsWith("x-middleware-")) forwarded.headers.set(key, value);
  });
  response.cookies.getAll().forEach((c) => forwarded.cookies.set(c));

  // When arriving via an explicit preview link, persist (or refresh) the
  // session so subsequent param-less navigations stay in preview at the same
  // version. Session cookies (no maxAge) — clear on browser close;
  // ?editorPreview=false exits sooner. httpOnly: only the server reads them.
  if (queryPreviewId) {
    const opts = { httpOnly: true, sameSite: "lax" as const, path: "/" };
    forwarded.cookies.set(PREVIEW_COOKIE, queryPreviewId, opts);
    if (queryVersion) {
      forwarded.cookies.set(PREVIEW_VERSION_COOKIE, queryVersion, opts);
    } else {
      forwarded.cookies.delete(PREVIEW_VERSION_COOKIE);
    }
  }

  return forwarded;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
