/**
 * KwikPass Custom — KwikAnalytics bridge
 *
 * Forwards the storefront AddToCart analytics event to GoKwik's KwikAnalytics
 * SDK (`window.KwikAnalytics`, provided by the loaded KwikPass script), reusing
 * the same mapped payload the ad pixels (Meta/GA4) already receive.
 */

import type { AddToCartPayload } from "@shopkit/events";

export interface KwikTrackEvent {
  category: string;
  name: string;
  action: string;
  attributes: Record<string, unknown>;
}

interface KwikAnalyticsSDK {
  trackEvent: (event: KwikTrackEvent) => void;
}

declare global {
  interface Window {
    KwikAnalytics?: KwikAnalyticsSDK;
  }
}

function cloneAttributes(data: AddToCartPayload): Record<string, unknown> {
  try {
    return structuredClone(data) as unknown as Record<string, unknown>;
  } catch {
    // structuredClone unavailable (older browsers): a JSON round-trip still
    // yields a fully independent deep copy for this plain payload — a shallow
    // copy would leave nested contents[] shared (the RC-38 hazard).
    return JSON.parse(JSON.stringify(data)) as Record<string, unknown>;
  }
}

export function buildAddToCartEvent(data: AddToCartPayload): KwikTrackEvent {
  return {
    category: "cart_event",
    name: "add_to_cart",
    action: "click",
    // Deep-copy: KwikAnalytics is an external SDK and must not be able to mutate
    // the payload the other pixel subscribers (Meta/GA4) also read — see RC-38.
    attributes: cloneAttributes(data),
  };
}

export function trackAddToCart(data: AddToCartPayload): void {
  if (typeof window === "undefined") {
    return;
  }
  const sdk = window.KwikAnalytics;
  if (typeof sdk?.trackEvent !== "function") {
    return;
  }
  sdk.trackEvent(buildAddToCartEvent(data));
}
