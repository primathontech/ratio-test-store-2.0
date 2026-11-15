import {
  createInstalledAppsGetHandler,
  createInstalledAppsResolvers,
} from "@shopkit/apps-platform-react/server";
import { shopperForwardHeaders } from "@shopkit/data-layer";

/**
 * Same-origin install list for the Apps Platform runtime.
 *
 * The browser calls THIS route, never the App Ecosystem store directly: the storefront token and
 * the store address are credentials that must stay server-side.
 *
 * `force-dynamic` is load-bearing — the response is per-merchant and must not be cached and
 * served to another shop.
 */
export const GET = createInstalledAppsGetHandler(
  createInstalledAppsResolvers({
    // `||`, not `??`. An unset var is undefined, but a var present-and-empty
    // (`MERCHANT_ID=` — which is how .env.example ships it) is `""`, and `??`
    // only falls back on undefined. Using `??` here meant copying the example
    // env produced an empty merchant id that no fallback could rescue.
    baseUrl: process.env.RATIO_APPS_API_URL || "",
    // The store knows this merchant by one id; the storefront just happens to
    // expose it under two names — `MERCHANT_ID` here (server-only, paired with
    // the token) and `NEXT_PUBLIC_MERCHANT_ID` in the layout, which predates
    // this feature. An operator who set only the public one got an empty
    // `gk-merchant-id` header, a 400 from the store, and — because the handler
    // degrades unreachable-service errors to an empty list — no apps and no
    // visible error anywhere.
    merchantId:
      process.env.MERCHANT_ID || process.env.NEXT_PUBLIC_MERCHANT_ID || "",
    storefrontToken: process.env.RATIO_APPS_STOREFRONT_TOKEN || "",
  }),
  // Uncached and once per shopper page view: send the shopper's IP so the API
  // gateway rate-limits per shopper, not per storefront server.
  { forwardHeaders: (request) => shopperForwardHeaders(request) }
);

export const dynamic = "force-dynamic";
