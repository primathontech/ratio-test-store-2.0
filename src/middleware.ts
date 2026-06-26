/**
 * Next.js Middleware
 *
 * Runs the core middleware (locale detection + A/B testing). The shareable
 * preview routing that used to layer on top is disabled (see commented block
 * below) — it was rolled back on 2026-06-23.
 *
 * @module middleware
 */

// `NextResponse` was only used by the shareable-preview routing below, which is
// now disabled (rolled back 2026-06-23). Keep `NextRequest` for the typing.
import type { NextRequest } from "next/server";

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
  // Shareable-preview routing rolled back (2026-06-23): disabled so it can
  // never affect storefront-starter traffic. Commented out (not deleted) for an
  // easy restore. With it off, every request goes straight to the core
  // middleware below — the in-editor live preview (?editor=true / ?previewKey)
  // is unaffected since it always fell through to baseMiddleware anyway.
  //
  // const previewRedirect = resolvePreviewRedirect(request);
  // if (previewRedirect) {
  //   return previewRedirect;
  // }

  // Core middleware (locale detection, A/B-test rewrites) for every request.
  return baseMiddleware(request);
}

// --- Shareable-preview routing DISABLED (rolled back 2026-06-23) ------------
// Commented out (not deleted) so it can never run against storefront-starter
// traffic. To restore the feature, uncomment this block, restore the
// `NextResponse` import above, and re-enable the call in `middleware()`.
//
// /**
//  * Shareable preview routing via Next.js Draft Mode.
//  *   ?previewKey            → editor live edit (postMessage); untouched.
//  *   ?editor=true           → editor bridge / manifest select; untouched.
//  *   ?editorPreview=false   → redirect to /api/editor-preview/exit (disable).
//  *   ?editorPreview=true
//  *     &previewId=…[&version] → redirect to /api/editor-preview/enter (enable).
//  * Returns null when there is nothing preview-related to do.
//  */
// function resolvePreviewRedirect(request: NextRequest): NextResponse | null {
//   const { searchParams } = request.nextUrl;
//
//   // Editor live edit / editor bridge drive rendering themselves — never touch.
//   if (searchParams.has("previewKey") || searchParams.get("editor") === "true") {
//     return null;
//   }
//
//   const flag = searchParams.get("editorPreview");
//
//   if (flag === "false") {
//     const exit = new URL("/api/editor-preview/exit", request.url);
//     exit.searchParams.set("to", cleanPath(request.nextUrl));
//     return NextResponse.redirect(exit);
//   }
//
//   if (flag === "true") {
//     const previewId = searchParams.get("previewId");
//     if (!previewId) {
//       return null;
//     }
//     const enter = new URL("/api/editor-preview/enter", request.url);
//     enter.searchParams.set("previewId", previewId);
//     const version = searchParams.get("version");
//     if (version) {
//       enter.searchParams.set("version", version);
//     }
//     enter.searchParams.set("to", cleanPath(request.nextUrl));
//     return NextResponse.redirect(enter);
//   }
//
//   return null;
// }
//
// /**
//  * The path to return to after toggling preview: the original pathname plus any
//  * non-preview query (e.g. ?q= on /search), with the preview-control params
//  * stripped so re-entering the link doesn't loop through the handler again.
//  */
// function cleanPath(url: URL): string {
//   const clean = new URL(url.toString());
//   clean.searchParams.delete("editorPreview");
//   clean.searchParams.delete("previewId");
//   clean.searchParams.delete("version");
//   return `${clean.pathname}${clean.search}`;
// }
// ----------------------------------------------------------------------------

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
