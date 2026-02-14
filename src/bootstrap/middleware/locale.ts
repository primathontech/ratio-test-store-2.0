/**
 * Locale Middleware Utilities
 *
 * Utilities for locale detection and cookie management in middleware.
 *
 * @module bootstrap/middleware
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import type { LocaleResult } from "./types";

/**
 * Get current locale from cookie or detect from headers
 */
export function getLocale(
  request: NextRequest,
  cookieName: string,
  defaultLocale: string,
  validLocales: readonly string[]
): LocaleResult {
  const currentLocaleCookie = request.cookies.get(cookieName)?.value;

  // Check if we have a valid locale cookie
  if (currentLocaleCookie && validLocales.includes(currentLocaleCookie)) {
    return { locale: currentLocaleCookie, fromCookie: true };
  }

  // Detect locale from header if no valid cookie
  const headerLocale = request.headers
    .get("accept-language")
    ?.split(",")[0]
    ?.split("-")[0];

  let locale = defaultLocale;
  if (headerLocale && validLocales.includes(headerLocale)) {
    locale = headerLocale;
  }

  return { locale, fromCookie: false };
}

/**
 * Set locale cookie with standard configuration
 */
export function setLocaleCookie(
  response: NextResponse,
  cookieName: string,
  locale: string
): void {
  response.cookies.set(cookieName, locale, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    secure: process.env.NODE_ENV === "production",
  });
}
