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
} from "@shopkit/cart";
import { createElement, useRef } from "react";
import { getCommerceClient } from "@/config/commerce";

let _initialized = false;

/**
 * Configure the cart module for this application.
 * Must be called on the client before any cart hooks are used.
 * Safe to call multiple times — only configures once.
 *
 * @param merchantName - The merchant identifier for cart storage
 */
function setupCart(merchantName: string) {
  if (_initialized) return;
  _initialized = true;

  // Use data-layer client for cart operations
  // This routes all cart API calls through the unified commerce abstraction
  const dataLayerClient = getCommerceClient();

  configureCart({
    merchantName,
    cartService: new DataLayerCartService(dataLayerClient),
    cartStorage: new DefaultCartStorage(merchantName),
    defaultCurrencyCode: "INR",
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
