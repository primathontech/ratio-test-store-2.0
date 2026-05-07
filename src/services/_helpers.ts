/**
 * Shared helpers for the service layer.
 *
 * All services in this folder talk to upstream commerce APIs directly via
 * `commerceClient.fetchRequest({ url, method, headers, body })`. They rely on
 * `NEXT_PUBLIC_*` env vars only, since they run client-side.
 *
 * The helpers here centralise:
 *  - resolving the GoKwik access token from various storage locations
 *  - resolving the customer phone (for endpoints that need it)
 *  - building the standard merchant-id / token / phone header set
 */

const KWIKUSERTOKEN_KEY = "KWIKUSERTOKEN";
const GUESTUSERDATA_KEY = "GUESTUSERDATA";

export function getMerchantId(): string {
  return (
    process.env.NEXT_PUBLIC_MERCHANT_ID ||
    process.env.NEXT_PUBLIC_GOKWIK_MID ||
    ""
  );
}

/**
 * Resolves the GoKwik access token, in priority order:
 *   1. explicit `accessToken` arg (e.g. from `useAuth().accessToken`)
 *   2. `localStorage.KWIKUSERTOKEN`
 *   3. `localStorage.GUESTUSERDATA.user_token`
 *   4. `sessionStorage.gk_access_token` / `gkAccessToken`
 */
export function resolveAccessToken(
  explicitToken?: string | null
): string | null {
  if (typeof window === "undefined") {
    return explicitToken ?? null;
  }
  try {
    const kwikToken = localStorage.getItem(KWIKUSERTOKEN_KEY);
    if (kwikToken) {
      return kwikToken;
    }

    if (explicitToken) {
      return explicitToken;
    }

    const guestRaw = localStorage.getItem(GUESTUSERDATA_KEY);
    if (guestRaw) {
      const guestData = JSON.parse(guestRaw);
      if (guestData?.user_token) {
        return guestData.user_token;
      }
    }

    const sessionToken =
      sessionStorage.getItem("gk_access_token") ||
      sessionStorage.getItem("gkAccessToken");
    if (sessionToken) {
      return sessionToken;
    }
  } catch {
    // storage unavailable — silently ignore
  }
  return explicitToken ?? null;
}

/**
 * Resolves the customer phone from GuestUserStorage if the caller didn't
 * provide one explicitly.
 */
export function resolvePhone(explicitPhone?: string | null): string {
  if (explicitPhone) {
    return explicitPhone;
  }
  if (typeof window === "undefined") {
    return "";
  }
  try {
    const guestRaw = localStorage.getItem(GUESTUSERDATA_KEY);
    if (guestRaw) {
      const guestData = JSON.parse(guestRaw);
      return guestData?.phone || "";
    }
  } catch {
    // ignore
  }
  return "";
}

/**
 * Builds the common header set for GoKwik authenticated requests.
 * Caller may add or override additional headers as needed.
 */
export function buildAuthHeaders(opts: {
  accessToken?: string | null;
  phone?: string | null;
  requestId?: string;
  customerId?: string;
  extra?: Record<string, string>;
}): Record<string, string> {
  const token = resolveAccessToken(opts.accessToken);
  const merchantId = getMerchantId();

  const headers: Record<string, string> = {
    accept: "application/json",
    "gk-merchant-id": merchantId,
    "merchant-mid": merchantId,
  };

  if (token) {
    headers["gk-access-token"] = token;
  }
  if (opts.phone) {
    headers["gk-phone"] = opts.phone;
  }
  if (opts.requestId) {
    headers["Gk-Request-Id"] = opts.requestId;
  }
  if (opts.customerId) {
    headers["Gk-Customer-Id"] = opts.customerId;
  }

  return { ...headers, ...(opts.extra || {}) };
}
