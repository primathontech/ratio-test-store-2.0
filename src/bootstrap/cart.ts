"use client";

/**
 * Cart Bootstrap - @shopkit/cart Configuration
 *
 * Configures the cart module with application-specific services.
 * Uses ResilientCartService that wraps DataLayerCartService and
 * falls back to local-only mode on cart API failures (503s are common).
 *
 * @module bootstrap/cart
 */

import {
  configureCart,
  CartInitializer,
  DataLayerCartService,
  DefaultCartStorage,
} from "@shopkit/cart";
import { createElement, useRef } from "react";
import { getCommerceClient } from "@/config/commerce";
import { eventBus } from "@shopkit/events";
import { createCartEventHandler } from "@shopkit/events/emitters";
import { createCartMapper } from "@shopkit/events/mappers";

let _initialized = false;

function setupCart(merchantName: string) {
  if (_initialized) {
    return;
  }
  _initialized = true;

  const dataLayerClient = getCommerceClient();

  // Wire cart events → analytics (AddToCart → Meta/GA4)
  const cartMapper = createCartMapper("INR", 100);
  const handleCartEvent = createCartEventHandler(eventBus, cartMapper);

  configureCart({
    merchantName,
    cartService: new DataLayerCartService(dataLayerClient),
    cartStorage: new DefaultCartStorage(merchantName),
    defaultCurrencyCode: "INR",
    onCartEvent: handleCartEvent,
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
