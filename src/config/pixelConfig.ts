/**
 * Pixel Configuration — bblunt
 *
 * Maps SDK names → their config (or null to disable).
 * Each key must match the `name` in the corresponding SDK script's
 * `window.__OPEN_STORE_PIXEL_RUNTIME__.register({ name })` call.
 *
 * SDK scripts live in public/scripts/ and load via <script> tags in layout.tsx.
 */

import type { PixelConfigMap } from "@shopkit/events/pixel-runtime";
import type { ProductIdentifier } from "@shopkit/events";

export const pixelConfig: PixelConfigMap = {
  "meta-pixel": process.env.NEXT_PUBLIC_MULTI_PIXEL_IDS
    ? {
        pixelId: process.env.NEXT_PUBLIC_MULTI_PIXEL_IDS,
        capiEndpoint: "/api/events/capi",
        capiSecret: process.env.NEXT_PUBLIC_CAPI_HMAC_SECRET || undefined,
        gokwikEnabled: process.env.NEXT_PUBLIC_GOKWIK_ENABLED === "true",
      }
    : null,

  ga4: process.env.NEXT_PUBLIC_GA_ID
    ? {
        measurementId: process.env.NEXT_PUBLIC_GA_ID,
        isolated: process.env.NEXT_PUBLIC_GA_ISOLATED === "yes",
        gokwikEnabled: process.env.NEXT_PUBLIC_GA_ID_GOKWIK_ENABLED === "true",
      }
    : null,

  "google-ads": process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
    ? {
        conversionId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
        conversionLabel:
          process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || "",
        isolated: process.env.NEXT_PUBLIC_GA_ISOLATED === "yes",
        events: JSON.parse(process.env.NEXT_PUBLIC_GOOGLE_ADS_EVENTS || "{}"),
        gokwikEnabled: process.env.NEXT_PUBLIC_GA_ADS_GOKWIK_ENABLED === "true",
      }
    : null,

  // GTM (Google Tag Manager) — loads a merchant-controlled container and
  // mirrors PixelRuntime events into window.dataLayer using GA4 Enhanced
  // Ecommerce schema. The merchant configures all downstream tags (Meta,
  // Moengage, custom HTML, etc.) in the GTM web dashboard.
  //
  // Optional env vars:
  //   NEXT_PUBLIC_GTM_AUTH     — GTM Server-Side env auth token
  //   NEXT_PUBLIC_GTM_PREVIEW  — GTM Server-Side env preview name
  //   NEXT_PUBLIC_CURRENCY     — ISO 4217 currency for ecommerce events
  //                              (default "INR" — set per merchant)
  //   NEXT_PUBLIC_GTM_DEBUG    — "true" to force verbose console logs in
  //                              production (otherwise auto-on only on
  //                              localhost / window.__shopkit_debug)
  gtm: process.env.NEXT_PUBLIC_GTM_ID
    ? {
        containerId: process.env.NEXT_PUBLIC_GTM_ID,
        auth: process.env.NEXT_PUBLIC_GTM_AUTH || undefined,
        preview: process.env.NEXT_PUBLIC_GTM_PREVIEW || undefined,
        defaultCurrency: process.env.NEXT_PUBLIC_CURRENCY || undefined,
        debug: process.env.NEXT_PUBLIC_GTM_DEBUG === "true" || undefined,
      }
    : null,

  // Ratio Meta app (GoKwik-hosted). The SDK is merchant-specific — the token
  // in its script URL identifies the store — and it pulls its own settings
  // from the app, so no config keys are needed here. `{}` just enables it.
  "meta-ratio": {},
  "google-ratio": {},
};

/**
 * Which product identifier to send in content_ids for Meta Ads catalog matching.
 * Must match the setting in Meta Ads → Product Identifier.
 * Options: "product_id" | "sku" | "variant_id"
 */
export const productIdentifier: ProductIdentifier =
  (process.env.NEXT_PUBLIC_PRODUCT_IDENTIFIER as ProductIdentifier) ||
  "product_id";
