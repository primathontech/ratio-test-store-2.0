import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/editor-preview/enter?previewId=…&version=…&to=/path
 *
 * DISABLED — the shareable storefront preview feature was rolled back
 * (2026-06-23) because it was not working reliably. This handler intentionally
 * no longer enables Next.js Draft Mode and sets no preview cookies, so preview
 * mode can never activate. Old/shared preview links degrade gracefully: the
 * visitor is forwarded to the target path and simply sees the normal live page.
 *
 * Normal storefront traffic is unaffected (draft mode never turns on, so the
 * template loader's preview branch is never reached). To restore the feature,
 * revert this commit.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const to = sanitizeTo(searchParams.get("to"));
  return NextResponse.redirect(new URL(to, origin));
}

/** Only allow same-origin path redirects (block open-redirect via `to`). */
function sanitizeTo(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/";
  }
  return raw;
}
