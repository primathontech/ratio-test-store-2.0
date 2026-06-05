/**
 * KwikPass Custom Integration
 * Self-contained KwikPass authentication integration for Custom platform
 */

// Main components
export { default as KwikPassCustom } from "./KwikPassCustom";
export { default as KwikPassScriptCustom } from "./KwikPassScriptCustom";
export { default as KwikpassLoginCustom } from "./KwikpassLoginCustom";

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

// Utils
export {
  KwikPassLogo,
  Close,
  LogOut,
  ShoppingBag,
  fireUserEngagementEvent,
  handleKwikpassLogin,
  getCartToken,
  clearKwikpassAuthStorage,
  KWIKPASS_TOKEN_KEYS,
} from "./utils";

// Hooks
export { useCheckoutToken } from "./useCheckoutToken";
