import { cookies, draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import {
  PREVIEW_ACTIVE_COOKIE,
  PREVIEW_ID_COOKIE,
  PREVIEW_SUFFIX_COOKIE,
  PREVIEW_VERSION_COOKIE,
  publicOrigin,
} from "@/editor-integration/preview-link/cookies";

export const dynamic = "force-dynamic";

const COOKIE_BASE = { sameSite: "lax" as const, path: "/" };

/**
 * GET /api/editor-preview/enter?previewId=…&version=…&to=/path
 *
 * Shareable-preview ENTRY point. The middleware redirects preview links
 * (?editorPreview=true&previewId=…) here so this Route Handler can enable
 * Next.js Draft Mode — middleware cannot, as enabling sets the signed
 * `__prerender_bypass` cookie. Draft mode bypasses the static cache for this
 * browsing session only, letting the template loader read the previewId cookie
 * and render the saved snapshot while normal traffic stays fully static.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = publicOrigin(request);
  const previewId = searchParams.get("previewId");
  const version = searchParams.get("version");
  const view = searchParams.get("view");
  const type = searchParams.get("type");
  const to = sanitizeTo(searchParams.get("to"));
  const destination = new URL(to, origin);

  // No id → nothing to preview; just send the visitor on without touching state.
  if (!previewId) {
    return NextResponse.redirect(destination);
  }

  (await draftMode()).enable();

  const jar = await cookies();
  jar.set(PREVIEW_ID_COOKIE, previewId, { httpOnly: true, ...COOKIE_BASE });
  if (version) {
    jar.set(PREVIEW_VERSION_COOKIE, version, {
      httpOnly: true,
      ...COOKIE_BASE,
    });
  } else {
    jar.delete(PREVIEW_VERSION_COOKIE);
  }
  // Client-readable flag for the "Exit preview" bar (no secret, just "1").
  jar.set(PREVIEW_ACTIVE_COOKIE, "1", COOKIE_BASE);

  // Force a specific template ONLY on the previewed resource. The cookie `path`
  // is the target URL, so the browser sends it just for that product/collection
  // page — every other resource renders its default. Value "{type}:{suffix}"
  // lets the loader force it only for the matching page type (not chrome).
  // Skipped for "default" previews; cleared (path-scoped) otherwise.
  if (view && view !== "default" && type) {
    jar.set(PREVIEW_SUFFIX_COOKIE, `${type}:${view}`, {
      httpOnly: true,
      sameSite: "lax",
      path: to,
    });
  } else {
    jar.set(PREVIEW_SUFFIX_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      path: to,
      maxAge: 0,
    });
  }

  return NextResponse.redirect(destination);
}

/** Only allow same-origin path redirects (block open-redirect via `to`). */
function sanitizeTo(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/";
  }
  return raw;
}
