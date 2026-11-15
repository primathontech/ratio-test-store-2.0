import { describe, it, expect, mock, afterEach } from "bun:test";
import type { AddToCartPayload } from "@shopkit/events";
import { buildAddToCartEvent, trackAddToCart } from "./kwikAnalytics";

const payload: AddToCartPayload = {
  content_ids: ["prod_1"],
  content_type: "product_group",
  content_name: "Test Product",
  value: 499,
  currency: "INR",
  contents: [
    { id: "prod_1", quantity: 2, item_price: 249.5, name: "Test Product" },
  ],
  num_items: 2,
};

describe("buildAddToCartEvent", () => {
  it("maps the ad payload into a KwikAnalytics event", () => {
    const event = buildAddToCartEvent(payload);
    // The values shipped with #2135 (live on every store since 9-Sep-2026); the test had kept an earlier draft's.
    expect(event.category).toBe("cart_event");
    expect(event.name).toBe("add_to_cart");
    expect(event.action).toBe("click");
    expect(event.attributes).toEqual(
      payload as unknown as Record<string, unknown>
    );
  });

  it("deep-copies attributes so the source payload cannot be mutated", () => {
    const event = buildAddToCartEvent(payload);
    (event.attributes.contents as AddToCartPayload["contents"])[0].quantity =
      999;
    expect(payload.contents[0].quantity).toBe(2);
  });

  it("still deep-copies via the JSON fallback when structuredClone is unavailable", () => {
    const g = globalThis as { structuredClone?: typeof structuredClone };
    const original = g.structuredClone;
    g.structuredClone = undefined;
    try {
      const event = buildAddToCartEvent(payload);
      (event.attributes.contents as AddToCartPayload["contents"])[0].quantity =
        999;
      expect(payload.contents[0].quantity).toBe(2);
    } finally {
      g.structuredClone = original;
    }
  });
});

describe("trackAddToCart", () => {
  const globalRef = globalThis as { window?: unknown };
  afterEach(() => {
    delete globalRef.window;
  });

  it("calls window.KwikAnalytics.trackEvent once when the SDK is present", () => {
    const trackEvent = mock(() => {});
    globalRef.window = { KwikAnalytics: { trackEvent } };
    trackAddToCart(payload);
    expect(trackEvent).toHaveBeenCalledTimes(1);
    const arg = trackEvent.mock.calls[0][0] as { name: string };
    expect(arg.name).toBe("add_to_cart");
  });

  it("no-ops (does not throw) when KwikAnalytics is absent", () => {
    globalRef.window = {};
    expect(() => trackAddToCart(payload)).not.toThrow();
  });
});
