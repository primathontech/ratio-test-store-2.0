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
// Non-httpOnly companion flag: the previewId cookie is httpOnly (server-only),
// so the client "Exit preview" bar can't read it. This readable flag lets the
// bar know preview mode is active across sticky navigation. It carries NO
// secret — just "1" — and is cleared on exit alongside the real cookies.
const PREVIEW_ACTIVE_COOKIE = "editorPreviewActive";

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

  // Editor-bridge SOFT-NAV (?previewKey=…): the editor pushes config over
  // postMessage and the body reads it via readEditorPreviewState; the layout
  // (chrome) persists from the initial render. Never inject a preview snapshot
  // here — it would override the live edits.
  if (sp.has("previewKey")) {
    return response;
  }

  // Editor-bridge INITIAL load is ?editor=true. We DO resolve a draft for that
  // first paint when the editor passes editorPreview=true&previewId, so the
  // iframe renders the draft directly instead of flashing live→draft. But the
  // editor session is TRANSIENT: only the explicit query previewId counts (no
  // sticky cookie read) and we never persist preview cookies for it (so it
  // can't leak preview mode into the user's normal browsing).
  const isEditorBridge = sp.get("editor") === "true";

  const flag = sp.get("editorPreview");
  const cookiePreviewId = isEditorBridge
    ? null
    : (request.cookies.get(PREVIEW_COOKIE)?.value ?? null);
  const cookieVersion = isEditorBridge
    ? null
    : (request.cookies.get(PREVIEW_VERSION_COOKIE)?.value ?? null);

  // Explicit exit clears the sticky session and returns to normal browsing.
  if (flag === "false") {
    if (cookiePreviewId) {
      response.cookies.delete(PREVIEW_COOKIE);
    }
    if (cookieVersion) {
      response.cookies.delete(PREVIEW_VERSION_COOKIE);
    }
    response.cookies.delete(PREVIEW_ACTIVE_COOKIE);
    return response;
  }

  // Query (entering) wins over the cookie (sticky); null when neither applies.
  const queryPreviewId = flag === "true" ? sp.get("previewId") : null;
  const queryVersion = flag === "true" ? sp.get("version") : null;
  const previewId = queryPreviewId ?? cookiePreviewId;
  if (!previewId) {
    return response;
  }
  // Version pins to the link's value; sticky navigations reuse the cookie.
  // Null/absent → backend serves the latest version.
  const version = queryPreviewId
    ? queryVersion
    : (queryVersion ?? cookieVersion);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-editor-preview-id", previewId);
  if (version) {
    requestHeaders.set("x-editor-preview-version", version);
  }

  const rewriteTo = response.headers.get("x-middleware-rewrite");
  const forwarded = rewriteTo
    ? NextResponse.rewrite(new URL(rewriteTo), {
        request: { headers: requestHeaders },
      })
    : NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.forEach((value, key) => {
    // Skip Next's internal control headers — they belong to `response`'s own
    // emit and are re-set correctly by the forwarded next()/rewrite() above.
    if (!key.startsWith("x-middleware-")) {
      forwarded.headers.set(key, value);
    }
  });
  response.cookies.getAll().forEach((c) => forwarded.cookies.set(c));

  // Sticky-session cookies are for NORMAL shareable browsing only. The editor
  // session is transient (its previewId rides the iframe URL on every load), so
  // we never persist cookies for it — that keeps preview mode out of the user's
  // regular browsing and the "Exit preview" bar out of the editor iframe.
  if (!isEditorBridge) {
    // Client-readable flag so the "Exit preview" bar can show across sticky
    // navigation (the real previewId cookie is httpOnly). Session cookie.
    forwarded.cookies.set(PREVIEW_ACTIVE_COOKIE, "1", {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });

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
  }

  return forwarded;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
