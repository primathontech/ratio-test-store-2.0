/**
 * KwikPass Custom Integration
 * Self-contained KwikPass authentication integration for Custom platform
 */

// Main components
export { default as KwikPassCustom } from "./KwikPassCustom";
export { default as KwikPassScriptCustom } from "./KwikPassScriptCustom";
export { default as KwikpassLoginCustom } from "./KwikpassLoginCustom";
export { default as KwikPassProductView } from "./KwikPassProductView";
export { default as KwikPassCollectionView } from "./KwikPassCollectionView";

// Config
export { getKwikPassConfig } from "./config";

// Events
export {
  dispatchProductViewEvent,
  dispatchCollectionViewEvent,
  dispatchPageViewEvent,
  KwikPassEventType,
} from "./events";
export type {
  KwikPassProductEventData,
  KwikPassCollectionEventData,
  KwikPassPageEventData,
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
} from "./utils";
