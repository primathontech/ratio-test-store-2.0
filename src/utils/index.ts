/**
 * Shared utilities for the starter app
 */

export { useContextAwareHomeURL, useContextAwareURL } from "./navigation";

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = "INR",
  locale: string = "en-IN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

/**
 * Format paise to INR currency string
 * @param paise - Amount in paise (1 rupee = 100 paise)
 * @returns Formatted currency string like "₹100.00"
 */
export function formatPaiseToINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Generate product navigation URL
 */
export function generateProductNavigationURL(
  handle: string,
  collectionHandle?: string
): string {
  if (collectionHandle) {
    return `/collections/${collectionHandle}/products/${handle}`;
  }
  return `/products/${handle}`;
}

/**
 * Truncate a string to a maximum length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Utility functions for the starter app
 */

// Translation utilities
export { getRouteTranslations } from "./translations";

// Theme name — defined in its own module so the A/B edge middleware can import
// it without pulling this barrel's React hooks into the edge bundle.
export { getThemeName } from "./theme-name";

/**
 * Get the merchant name from environment variables
 */
export function getMerchantName(): string {
  return (
    process.env.NEXT_PUBLIC_MERCHANT_NAME ||
    process.env.NEXT_PUBLIC_SITE_NAME ||
    "merchant"
  );
}

/**
 * Format a price with currency
 */
export function formatPrice(
  amount: number,
  currencyCode: string = "INR"
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
