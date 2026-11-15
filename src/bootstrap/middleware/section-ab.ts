/**
 * Section-level A/B testing — the edge half. Assigns an arm and rewrites to the
 * route's `/variant/[arm]` mirror; the render half lives in those pages.
 *
 * Best-effort throughout: no experiment, unreachable backend or malformed
 * manifest all return the response untouched.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  ARM_COOKIE,
  ARM_COOKIE_MAX_AGE_S,
  drawArm,
  getManifestSync,
  isExcludedPath,
  matchExperiment,
  pageTypeOf,
  readArmCookie,
  serialiseArmCookie,
} from "@shopkit/ab";

import { abBaseUrl, abMerchantId, abThemeId } from "../ab";

/**
 * Skip the older page-level ("PRT") variant routes. Both systems firing on one
 * URL yields a result neither can attribute.
 */
/** Route segments owned by the older page-level ("PRT") variant routes. */
const LEGACY_VARIANT_SEGMENTS = new Set([
  "home-b",
  "products-b",
  "collections-b",
]);

function alreadyRewritten(request: NextRequest, pathname: string): boolean {
  // Matched per SEGMENT, not as a substring. `includes("-b/")` and
  // `endsWith("-b")` also catch real handles — /products/vitamin-b, plan-b,
  // hair-serum-b — and silently drop them from every experiment, under-sampling
  // exactly those URLs with nothing in the logs to say so.
  //
  // The third clause of the old version compared `request.nextUrl.pathname` with
  // `pathname`, which is the same value, so it was always false.
  return pathname
    .split("/")
    .some((segment) => LEGACY_VARIANT_SEGMENTS.has(segment));
}

/**
 * Bucket the visitor and rewrite to the matching `/variant/[arm]` mirror.
 *
 * A request no experiment covers returns `response` untouched — no cookie, no
 * rewrite, same cache entry. That is every request for every merchant not
 * running a test.
 */
export async function handleSectionAbTest(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  try {
    const { pathname } = request.nextUrl;

    if (isExcludedPath(pathname)) {
      // A DIRECT hit on an arm URL — only reachable by guessing the path, since
      // nothing links there and the sitemap is built from commerce data. Metadata
      // cannot carry the noindex (a rewrite would put it on the canonical page
      // too), so it goes on the header, which only this branch sets.
      if (pathname.includes("/variant/")) {
        response.headers.set("X-Robots-Tag", "noindex, nofollow");
      }
      return response;
    }
    if (alreadyRewritten(request, pathname)) {
      return response;
    }

    // Before anything else: a pure string test for whether this URL could ever
    // carry an experiment. /cart, /search, /account and every other route return
    // null here, and used to reach the manifest only to be told the same thing.
    if (!pageTypeOf(pathname)) {
      return response;
    }

    const theme = abThemeId();
    if (!theme) {
      return response;
    }

    // Reads cache only — never awaits the network. Middleware runs ahead of every
    // render, so a blocking fetch here is added to a shopper's TTFB, and during a
    // backend outage that is the full timeout on a share of ALL traffic,
    // including merchants running no experiment. A cold pod reports "no
    // experiments" for its first requests and warms behind them.
    const manifest = getManifestSync({
      baseUrl: abBaseUrl(),
      themeId: theme,
      merchantId: abMerchantId(),
    });
    const experiment = matchExperiment(pathname, manifest);
    if (!experiment) {
      return response;
    }

    const stored = readArmCookie(request.cookies.get(ARM_COOKIE)?.value);
    const { arm, position } = drawArm(experiment, stored);

    // BOTH arms are rewritten, including "a": after a promote `liveVariantId`
    // is "b", so the untouched route would serve B to an arm-A visitor and the
    // test would compare B with B. The manifest carries no live orientation, so
    // the edge cannot tell a promoted slot from a fresh one.

    // Mirror routes are children of the real route, so params carry over.
    const url = request.nextUrl.clone();
    url.pathname = `${pathname === "/" ? "" : pathname}/variant/${arm}`;

    // Build the response that will be SENT before writing to it: rewrite()
    // creates a new object and silently drops anything set on the old one.
    const out = NextResponse.rewrite(url, { request });

    // Two headers are EXCLUDED from the copy.
    //
    // `set-cookie` is the one multi-value header whose behaviour through
    // forEach + set is runtime-dependent, and this runs on the edge. Cookies go
    // through the cookie API below instead.
    //
    // `x-middleware-rewrite` IS the rewrite. Copying it would overwrite the one
    // `out` was just created with, and the earlier destination would win —
    // measured: a page-level (PRT) rewrite already on `response` replaced the
    // section mirror, so the visitor got the PRT page while `_ab_arm` pinned
    // them for 90 days to a section experiment they could never see.
    const SKIP = new Set(["set-cookie", "x-middleware-rewrite"]);
    response.headers.forEach((value, key) => {
      if (!SKIP.has(key.toLowerCase())) {
        out.headers.set(key, value);
      }
    });
    response.cookies.getAll().forEach((c) => out.cookies.set(c));

    // Written LAST, onto the response being returned, so no copy step can lose
    // it — and for BOTH arms: an unpinned arm-A visitor is re-rolled every
    // request and drifts between arms mid-session.
    // The current experiment is REMOVED before being re-added, so it lands last
    // in insertion order. Object spread keeps an existing key at its original
    // position, so a long-running experiment assigned months ago would sit at
    // index 0 and be trimmed by serialiseArmCookie's newest-N cap — the visitor
    // would then read as unassigned and re-roll on every request, mid-test.
    const { [experiment.id]: _previous, ...others } = stored;
    out.cookies.set(
      ARM_COOKIE,
      // The POSITION is stored, not the arm: re-aiming the test re-reads it
      // against the new split, so only the visitors the split crossed move.
      //
      // A draw with no position means the split was not a number. Nothing worth
      // remembering, so the entry is left out rather than written and dropped
      // again on the next read.
      serialiseArmCookie(
        position === undefined
          ? others
          : { ...others, [experiment.id]: { position } }
      ),
      {
        maxAge: ARM_COOKIE_MAX_AGE_S,
        path: "/",
        sameSite: "lax",
        httpOnly: false, // the analytics enrichment reads it client-side
      }
    );

    // The reporting dimensions are NOT written here, and this is the third time
    // that has been settled — so the reasoning is recorded rather than the
    // conclusion alone.
    //
    // Middleware runs for EVERY request to the origin, including the RSC
    // prefetch Next fires for every link on the page. Cookies are per-origin,
    // not per-page, so a prefetch of an untested route clobbers the values for
    // the page the shopper is actually looking at. Observed directly: on a
    // tested home page the three cookies were wiped by background prefetches of
    // untested collections while `window.__ab` stayed correct.
    //
    // Middleware also matches on page type alone — it has a URL, and a
    // product's template suffix lives on the product — so it cannot know whether
    // the render will apply the experiment at all.
    //
    // The render is the only writer that corresponds to the page being shown.
    // See bootstrap/ab/ArmSync.
    return out;
  } catch {
    // Never break a request over an experiment. A bug here, a malformed
    // manifest, a backend outage — the visitor still gets their page.
    return response;
  }
}
