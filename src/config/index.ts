/**
 * Configuration exports for the starter app
 */

// Commerce config
export {
  getCommerceClient,
  shopifyConfig,
  customConfig,
  isShopify,
} from "./commerce";

// SEO config
export function getSEOConfig() {
  return {
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Your Store",
    siteUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    defaultDescription: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
    defaultImage: process.env.NEXT_PUBLIC_DEFAULT_IMAGE,
    enableStructuredData: process.env.SEO_ENABLE_STRUCTURED_DATA !== "false",
    enableOpenGraph: process.env.SEO_ENABLE_OPEN_GRAPH !== "false",
    enableTwitterCards: process.env.SEO_ENABLE_TWITTER_CARDS !== "false",
  };
}
