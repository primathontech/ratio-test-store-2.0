import { NextResponse } from "next/server";
import { getNavMenu } from "@shopkit/navigation";

/**
 * On-demand single nav-menu fetch — the server hop behind NavigationProvider's
 * `endpoint` read-through store.
 *
 * The gokwik nav API isn't browser-callable (CORS + the `gk-merchant-id` header),
 * so the client can't fetch a menu directly. When a consumer asks for a handle that
 * wasn't preloaded at SSR (e.g. the visual editor switching `menuHandle` at runtime),
 * the provider hits this SAME-ORIGIN route, which proxies the server-only
 * `getNavMenu`. Reuses the package fetch — so the menu is Data-Cache-backed and
 * tagged ("nav-menu"), and webhook revalidation still applies.
 *
 * Returns the NavMenu JSON, or `null` when the handle is unknown/unavailable.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;

  // This route is a public proxy to an internal API — constrain the handle to a
  // safe charset so it can't be used for path traversal / SSRF via the URL tail.
  if (!/^[a-zA-Z0-9_-]+$/.test(handle)) {
    return NextResponse.json(null, { status: 400 });
  }

  const menu = await getNavMenu(handle);
  return NextResponse.json(menu);
}
