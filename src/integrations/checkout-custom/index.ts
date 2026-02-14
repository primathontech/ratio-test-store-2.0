/**
 * Checkout Custom Integration
 * Self-contained Gokwik checkout integration for Custom platform
 */

// Main components
export { default as CheckoutCustom } from "./CheckoutCustom";

// Service
export { CustomCheckoutService } from "./CustomCheckoutService";
export type {
  CartItem,
  CheckoutConfig,
  CheckoutEventHandlers,
} from "./CustomCheckoutService";

// Hook
export {
  useCustomCheckout,
  convertCartItemsForCheckout,
} from "./useCustomCheckout";
export type {
  UseCustomCheckoutOptions,
  UseCustomCheckoutReturn,
} from "./useCustomCheckout";

// Button Components
export { CheckoutButtonCustom } from "./CheckoutButtonCustom";
export { BuyNowButtonCustom } from "./BuyNowButtonCustom";

// Types
export type {
  CheckoutButtonCustomProps,
  BuyNowButtonCustomProps,
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
