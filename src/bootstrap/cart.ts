"use client";

/**
 * Cart Bootstrap - @shopkit/cart Configuration
 *
 * Configures the cart module with application-specific services.
 * This is the composition root that wires together the cart package
 * with this application's storage and service implementations.
 *
 * Uses DataLayerCartService to route cart operations through the
 * unified @shopkit/data-layer client.
 *
 * @module bootstrap/cart
 */

import {
  configureCart,
  CartInitializer,
  DataLayerCartService,
  DefaultCartStorage,
  type CartEvent,
} from "@shopkit/cart";
import { startFlow } from "@shopkit/observability/client";
import { createElement, useRef } from "react";
import { getCommerceClient } from "@/config/commerce";
import { eventBus } from "@shopkit/events";
import { createCartEventHandler } from "@shopkit/events/emitters";
import { createCartMapper } from "@shopkit/events/mappers";

let _initialized = false;

/**
 * Cart outcomes for monitoring: add to cart, and a cart that failed to load.
 * `addItems` is left out: the cart reports its failures but not its successes.
 */
function trackCartOutcomes(event: CartEvent) {
  if (event.type === "ADD_TO_CART") {
    startFlow("add_to_cart").success();
  }
  if (event.type !== "CART_ERROR") {
    return;
  }
  if (event.action === "addItem") {
    startFlow("add_to_cart").fail("cart_api", event.error);
  }
  // Without a cart every add is silently skipped, so record why. Failures only: this
  // runs on every page load, and page views are already counted.
  if (event.action === "initializeCart") {
    startFlow("cart_init").fail("cart_api", event.error);
  }
}

/**
 * Configure the cart module for this application.
 * Must be called on the client before any cart hooks are used.
 * Safe to call multiple times — only configures once.
 *
 * @param merchantName - The merchant identifier for cart storage
 */
function setupCart(merchantName: string) {
  if (_initialized) {
    return;
  }
  _initialized = true;

  // Use data-layer client for cart operations
  // This routes all cart API calls through the unified commerce abstraction
  const dataLayerClient = getCommerceClient();

  // Wire cart events → analytics (AddToCart → Meta/GA4)
  const cartMapper = createCartMapper("INR", 100);
  const handleCartEvent = createCartEventHandler(eventBus, cartMapper);

  configureCart({
    merchantName,
    cartService: new DataLayerCartService(dataLayerClient),
    cartStorage: new DefaultCartStorage(merchantName),
    defaultCurrencyCode: "INR",
    onCartEvent: (event) => {
      trackCartOutcomes(event);
      handleCartEvent(event);
    },
  });
}

/**
 * App-specific cart initializer that wires up services
 * before delegating to the generic CartInitializer.
 *
 * @example
 * ```tsx
 * // In your root layout
 * import { AppCartInitializer } from "@/bootstrap/cart";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AppCartInitializer merchantName="wellversed" />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function AppCartInitializer({ merchantName }: { merchantName: string }) {
  const setupRef = useRef(false);
  if (!setupRef.current) {
    setupCart(merchantName);
    setupRef.current = true;
  }

  return createElement(CartInitializer, { merchantName });
}
