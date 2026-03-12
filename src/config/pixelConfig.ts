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
      }
    : null,

  ga4: process.env.NEXT_PUBLIC_GA_ID
    ? { measurementId: process.env.NEXT_PUBLIC_GA_ID }
    : null,

  "google-ads": process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID
    ? {
        conversionId: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID,
        conversionLabel:
          process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || "",
      }
    : null,
};

/**
 * Which product identifier to send in content_ids for Meta Ads catalog matching.
 * Must match the setting in Meta Ads → Product Identifier.
 * Options: "product_id" | "sku" | "variant_id"
 */
export const productIdentifier: ProductIdentifier =
  (process.env.NEXT_PUBLIC_PRODUCT_IDENTIFIER as ProductIdentifier) ||
  "product_id";
