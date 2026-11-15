/**
 * Service layer barrel.
 *
 * Use these services directly from client components — they call the upstream
 * commerce APIs via `commerceClient.fetchRequest`. No BFF / proxy routes.
 */

export * from "./order.service";
export * from "./customer.service";
export * from "./address.service";
export {
  getMerchantId,
  resolveAccessToken,
  resolvePhone,
  buildAuthHeaders,
} from "./_helpers";
