"use client";

import { usePathname } from "next/navigation";

/**
 * Hook to get context-aware home URL
 * Handles locale prefixes and other context-specific URL transformations
 */
export function useContextAwareHomeURL(): string {
  const pathname = usePathname();

  // Extract locale from pathname if present
  const localeMatch = pathname.match(/^\/([a-z]{2}(-[A-Z]{2})?)\//);
  const locale = localeMatch ? localeMatch[1] : null;

  return locale ? `/${locale}` : "/";
}

/**
 * Get context-aware URL for a given path
 */
export function useContextAwareURL(path: string): string {
  const homeURL = useContextAwareHomeURL();

  if (path.startsWith("/")) {
    return homeURL === "/" ? path : `${homeURL}${path}`;
  }

  return homeURL === "/" ? `/${path}` : `${homeURL}/${path}`;
}

/**
 * Generate product navigation URL
 * @param handle - Product handle
 * @param collectionHandle - Optional collection handle
 * @returns URL path for the product
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
