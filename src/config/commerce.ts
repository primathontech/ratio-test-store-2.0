/**
 * Commerce Configuration
 *
 * Provides unified interface for accessing commerce data from various platforms.
 */

import { createCommerceClient, IClientConfig } from "@shopkit/data-layer";

export const shopifyConfig: IClientConfig = {
  type: "shopify",
  config: {
    domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
    storefrontAccessToken:
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    apiVersion: "2025-04" as const,
  },
};

export const customConfig: IClientConfig = {
  type: "custom",
  config: {
    merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID!,
    storeId: process.env.NEXT_PUBLIC_STORE_ID!,
    services: {
      product: {
        apiBaseUrl: process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL!,
      },
      order: {
        apiBaseUrl: process.env.NEXT_PUBLIC_CUSTOM_API_CUSTOMER_URL!,
      },
      cart: {
        apiBaseUrl: process.env.NEXT_PUBLIC_CUSTOM_API_CART_URL!,
      },
    },
  },
};

export const isShopify = process.env.NEXT_PUBLIC_PLATFORM === "shopify";

/**
 * Get the commerce client instance
 * @returns The CommerceClient instance for the configured platform
 */
export function getCommerceClient() {
  try {
    const config = isShopify ? shopifyConfig : customConfig;
    return createCommerceClient(config);
  } catch (error) {
    console.error("Error getting commerce client:", error);
    throw new Error(
      `Failed to get commerce client: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
