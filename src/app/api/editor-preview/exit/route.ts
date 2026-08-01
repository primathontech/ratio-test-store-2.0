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

/**
 * GET /api/editor-preview/exit?to=/path
 *
 * Shareable-preview EXIT point. The middleware redirects ?editorPreview=false
 * here so this handler can disable Draft Mode (clearing `__prerender_bypass`)
 * and drop the preview cookies. The visitor then lands back on a fully static,
 * live page.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = publicOrigin(request);
  const to = sanitizeTo(searchParams.get("to"));

  (await draftMode()).disable();

  const jar = await cookies();
  jar.delete(PREVIEW_ID_COOKIE);
  jar.delete(PREVIEW_VERSION_COOKIE);
  jar.delete(PREVIEW_ACTIVE_COOKIE);

  // The suffix cookie is path-scoped to the previewed resource (set with
  // `path: to` on enter), so a bare delete (which targets path "/") would miss
  // it. Delete it at the same path — `to` is that resource path.
  jar.delete({ name: PREVIEW_SUFFIX_COOKIE, path: to });

  return NextResponse.redirect(new URL(to, origin));
}

/** Only allow same-origin path redirects (block open-redirect via `to`). */
function sanitizeTo(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/";
  }
  return raw;
}
