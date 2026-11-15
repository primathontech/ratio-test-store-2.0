/**
 * `gk-merchant-id` for OS API calls the app makes itself. The API gateway applies
 * per-merchant rate limits on it. Constant per deployment, so a cached fetch
 * keeps a single Data Cache key.
 */
export function osMerchantHeaders(): Record<string, string> {
  const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;
  return merchantId ? { "gk-merchant-id": merchantId } : {};
}
