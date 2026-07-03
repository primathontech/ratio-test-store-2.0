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

export function middleware(request: NextRequest) {
  // Shareable-preview links must be handled BEFORE the core middleware: they
  // redirect to a Route Handler that toggles Next.js Draft Mode (middleware
  // cannot enable draft mode). Locale/A-B processing then re-runs on the final
  // redirected request, so nothing is lost.
  const previewRedirect = resolvePreviewRedirect(request);
  if (previewRedirect) {
    return previewRedirect;
  }
  // Core middleware (locale detection, A/B-test rewrites) for everything else.
  // Sticky preview navigation needs nothing here: Draft Mode's __prerender_bypass
  // cookie persists and the template loader reads the editorPreview cookie.
  return baseMiddleware(request);
}

/**
 * Shareable preview routing via Next.js Draft Mode.
 *   ?previewKey            → editor live edit (postMessage); untouched.
 *   ?editor=true           → editor bridge / manifest select; untouched.
 *   ?editorPreview=false   → redirect to /api/editor-preview/exit (disable).
 *   ?editorPreview=true
 *     &previewId=…[&version] → redirect to /api/editor-preview/enter (enable).
 * Returns null when there is nothing preview-related to do.
 */
function resolvePreviewRedirect(request: NextRequest): NextResponse | null {
  const { searchParams } = request.nextUrl;

  // Editor live edit / editor bridge drive rendering themselves — never touch.
  if (searchParams.has("previewKey") || searchParams.get("editor") === "true") {
    return null;
  }

  const flag = searchParams.get("editorPreview");

  if (flag === "false") {
    const exit = new URL("/api/editor-preview/exit", request.url);
    exit.searchParams.set("to", cleanPath(request.nextUrl));
    return NextResponse.redirect(exit);
  }

  if (flag === "true") {
    const previewId = searchParams.get("previewId");
    if (!previewId) {
      return null;
    }
    const enter = new URL("/api/editor-preview/enter", request.url);
    enter.searchParams.set("previewId", previewId);
    const version = searchParams.get("version");
    if (version) {
      enter.searchParams.set("version", version);
    }
    enter.searchParams.set("to", cleanPath(request.nextUrl));
    return NextResponse.redirect(enter);
  }

  return null;
}

/**
 * The path to return to after toggling preview: the original pathname plus any
 * non-preview query (e.g. ?q= on /search), with the preview-control params
 * stripped so re-entering the link doesn't loop through the handler again.
 */
function cleanPath(url: URL): string {
  const clean = new URL(url.toString());
  clean.searchParams.delete("editorPreview");
  clean.searchParams.delete("previewId");
  clean.searchParams.delete("version");
  return `${clean.pathname}${clean.search}`;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
