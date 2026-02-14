/**
 * Checkout Shopify Integration
 * Self-contained Gokwik checkout integration for Shopify platform
 */

// Main components
export { default as CheckoutShopify } from "./CheckoutShopify";

// Service
export { ShopifyCheckoutService } from "./ShopifyCheckoutService";
export type {
  CartItem,
  CheckoutConfig,
  CheckoutEventHandlers,
} from "./ShopifyCheckoutService";

// Hook
export {
  useShopifyCheckout,
  convertCartItemsForCheckout,
} from "./useShopifyCheckout";
export type {
  UseShopifyCheckoutOptions,
  UseShopifyCheckoutReturn,
} from "./useShopifyCheckout";

// Button Components
export { CheckoutButtonShopify } from "./CheckoutButtonShopify";
export { BuyNowButtonShopify } from "./BuyNowButtonShopify";

// Types
export type {
  CheckoutButtonShopifyProps,
  BuyNowButtonShopifyProps,
} from "./types";

// Config
export { getCheckoutConfig } from "./config";

// Events
export {
  dispatchCartViewEvent,
  dispatchCheckoutStartEvent,
  dispatchCheckoutCompleteEvent,
  CheckoutEventType,
} from "./events";
export type {
  CheckoutEvent,
  CheckoutCartEventData,
  CheckoutEventData,
} from "./events";
