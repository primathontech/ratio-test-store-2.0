"use client";

/**
 * Customer authentication — READ-ONLY view of the shopper's KwikPass login.
 *
 * KwikPass is the universal auth for every merchant on this platform (a platform
 * invariant, like GoKwik checkout), so there is deliberately NO pluggable
 * provider registry here. The voice agent NEVER performs or triggers login — it
 * only OBSERVES whether the shopper is already signed in, so it can gate the
 * account tools (profile, orders). Logging in is entirely KwikPass's job via the
 * normal storefront flow.
 *
 * This is the single place that knows how KwikPass stores its token. It is a
 * port injected into ToolContext, so the tool logic and the AI provider stay
 * completely decoupled from auth. The token is used ONLY to build the BFF request
 * headers inside a tool handler; it never enters a tool RESULT, the model, or the
 * transcript.
 *
 * Token source (mirrors the storefront's own useCheckoutToken / useAuth logic):
 *   1. localStorage["customerAccessToken"]  — the app's @shopkit/core useAuth mirror
 *   2. the *KWIKUSERTOKEN cookie             — GoKwik SDK source of truth (env-prefixed)
 */

export interface CustomerAuthState {
  status: "authenticated" | "anonymous";
}

export interface CustomerCredential {
  /** KwikPass access token — for BFF headers ONLY, never surfaced to the model. */
  accessToken: string;
  /** Merchant id (env; per-deployment today). */
  merchantId: string;
}

export interface CustomerAuthPort {
  /** Synchronous snapshot — read at tool-call time so it's always current. */
  getState: () => CustomerAuthState;
  /** Credential for the account BFF, or null when not signed in. */
  getCredential: () => CustomerCredential | null;
}

const APP_TOKEN_KEY = "customerAccessToken";

/** useAuth stores JSON.stringify(data); data may be a raw string or an object
 *  carrying the token — normalize both shapes to a plain token string. */
function normalizeToken(v: unknown): string {
  if (typeof v === "string") return v;
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o.accessToken === "string") return o.accessToken;
    if (typeof o.token === "string") return o.token;
  }
  return "";
}

function readAppToken(): string {
  try {
    const raw = localStorage.getItem(APP_TOKEN_KEY);
    if (!raw) return "";
    try {
      return normalizeToken(JSON.parse(raw));
    } catch {
      return raw; // stored as a bare (unquoted) string
    }
  } catch {
    return "";
  }
}

/** Case-insensitive so it matches KWIKUSERTOKEN / SANDBOXKWIKUSERTOKEN / QA… /
 *  DEV… without hardcoding the environment prefix (same match the app uses). */
function readCookieToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split("; ")
    .find((c) => /KWIKUSERTOKEN=/i.test(c));
  if (!match) return "";
  const value = match.split("=")[1];
  return value ? decodeURIComponent(value) : "";
}

function readToken(): string {
  if (typeof window === "undefined") return "";
  return readAppToken() || readCookieToken();
}

/** The concrete KwikPass auth port (read-only). */
export const customerAuth: CustomerAuthPort = {
  getState: () => ({ status: readToken() ? "authenticated" : "anonymous" }),
  getCredential: () => {
    const accessToken = readToken();
    if (!accessToken) return null;
    return {
      accessToken,
      merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID || "",
    };
  },
};
