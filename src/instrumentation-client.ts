import { initObservability } from "@shopkit/observability/client";
import { browserObservability } from "@/bootstrap/observability-client";
import { PREVIEW_ACTIVE_COOKIE } from "@/editor-integration/preview-link/cookies";

// Browser errors, failed requests and web vitals → /api/obs → SigNoz.
// OBS_ENABLED is derived in next-config from OTEL_EXPORTER_OTLP_TRACES_ENDPOINT.
// Release and environment are stamped by /api/obs on the server.
// Page kinds for filtering. A/B mirrors (`-b`, `/variant/`) count as the page they test.
function pageType(path: string): string | undefined {
  if (path === "/") {
    return "home";
  }
  if (/^\/(collections(-b)?\/[^/]+\/)?products(-b)?\//.test(path)) {
    return "product";
  }
  if (/^\/collections(-b)?\//.test(path)) {
    return "collection";
  }
  if (path.startsWith("/pages/")) {
    return "page";
  }
  if (path.startsWith("/orders")) {
    return "order";
  }
  return "other";
}

if (process.env.OBS_ENABLED === "true") {
  initObservability({
    ...browserObservability,
    pageType,
    // The commerce backend (see config/commerce.ts): its 5xx and slow calls are ours.
    apiOrigins: [
      process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL,
      process.env.NEXT_PUBLIC_CUSTOM_API_CART_URL,
      process.env.NEXT_PUBLIC_CUSTOM_API_CUSTOMER_URL,
    ].filter((url): url is string => Boolean(url)),
    ignore: {
      // Editor live edit and bridge (see middleware.ts): not shopper traffic.
      params: ["previewKey", "editor"],
      // Shareable preview session (set by /api/editor-preview/enter, cleared on exit).
      cookies: [PREVIEW_ACTIVE_COOKIE],
      errors: [
        /ResizeObserver loop/,
        // Cross-origin script errors arrive with no detail; nothing to act on.
        /^Script error\.?$/,
        // A request that never got a response: almost always the shopper's network.
        /^(Failed to fetch|Load failed|NetworkError when attempting to fetch resource\.?)$/,
      ],
    },
  });
}
