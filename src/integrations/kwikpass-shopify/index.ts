/**
 * KwikPass Shopify Integration
 * Self-contained KwikPass authentication integration for Shopify platform
 */

// Main components
export { default as KwikPassShopify } from "./KwikPassShopify";
export { default as KwikPassScriptShopify } from "./KwikPassScriptShopify";
export { default as KwikpassLoginShopify } from "./KwikpassLoginShopify";

// Config
export { getKwikPassConfig } from "./config";

// Events
export {
  dispatchProductViewEvent,
  dispatchCollectionViewEvent,
  dispatchPageViewEvent,
  dispatchLoginEvent,
  dispatchLogoutEvent,
  KwikPassEventType,
} from "./events";
export type {
  KwikPassEvent,
  KwikPassProductEventData,
  KwikPassCollectionEventData,
  KwikPassPageEventData,
  KwikPassLoginEventData,
} from "./events";

// Auth utilities
export {
  decodeKpToken,
  getCustomerAccessToken,
  getCustomerAccessTokenMultipass,
} from "./AuthUtils";

// Utils
export {
  KwikPassLogo,
  Close,
  LogOut,
  ShoppingBag,
  fireUserEngagementEvent,
  handleKwikpassLogin,
  getCartToken,
} from "./utils";
