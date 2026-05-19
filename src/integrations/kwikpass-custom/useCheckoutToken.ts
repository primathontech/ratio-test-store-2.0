"use client";

import { useAuth } from "@shopkit/core/context";

const GOKWIK_GUEST_DATA_KEY = "GUESTUSERDATA";

function readGokwikCheckoutToken(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem(GOKWIK_GUEST_DATA_KEY);
    const data = raw ? JSON.parse(raw) : null;
    return data?.user_token ?? "";
  } catch {
    return "";
  }
}

function readKwikTokenFromCookie(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split("; ")
    .find((c) => /KWIKUSERTOKEN=/i.test(c));
  if (!match) return "";
  const value = match.split("=")[1];
  return value ? decodeURIComponent(value) : "";
}

function normalizeToken(accessToken: unknown): string {
  if (typeof accessToken === "string") return accessToken;
  if (accessToken && typeof accessToken === "object") {
    const obj = accessToken as Record<string, unknown>;
    if (typeof obj.accessToken === "string") return obj.accessToken;
    if (typeof obj.token === "string") return obj.token;
  }
  return "";
}

/**
 * Returns the GoKwik access token for post-checkout API calls.
 * Use ONLY on thank-you / order-confirmation pages — not on account pages.
 *
 * Priority:
 * 1. GUESTUSERDATA.user_token  — GoKwik checkout token (handles different-phone checkout)
 * 2. useAuth().accessToken     — KwikPass storefront token
 * 3. KWIKUSERTOKEN cookie      — last resort fallback
 */
export function useCheckoutToken(): string {
  const { accessToken } = useAuth();
  return (
    readGokwikCheckoutToken() ||
    normalizeToken(accessToken) ||
    readKwikTokenFromCookie()
  );
}
