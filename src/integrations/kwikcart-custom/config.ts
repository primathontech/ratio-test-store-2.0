/**
 * KwikCart Custom Configuration
 */

export function getKwikCartConfig() {
  const scriptUrl = process.env.NEXT_PUBLIC_KWIKCART_SCRIPT_URL;
  if (!scriptUrl) {
    throw new Error("NEXT_PUBLIC_KWIKCART_SCRIPT_URL is required");
  }

  return {
    scriptUrl,
    currency: process.env.NEXT_PUBLIC_KWIKCART_CURRENCY || "INR",
    currencyFormat: process.env.NEXT_PUBLIC_KWIKCART_CURRENCY_FORMAT || "en-IN",
  };
}

/**
 * Get Checkout Custom configuration object
 */
export function getCheckoutConfig() {
  const mid = process.env.NEXT_PUBLIC_GOKWIK_MID;
  const type = process.env.NEXT_PUBLIC_GOKWIK_TYPE;
  const scriptUrl = process.env.NEXT_PUBLIC_GOKWIK_SCRIPT_URL;

  if (!mid || !type || !scriptUrl) {
    throw new Error(
      "Missing required env vars: NEXT_PUBLIC_GOKWIK_MID, NEXT_PUBLIC_GOKWIK_TYPE, NEXT_PUBLIC_GOKWIK_SCRIPT_URL"
    );
  }

  return {
    enabled: process.env.NEXT_PUBLIC_GOKWIK_ENABLED === "true",
    mid,
    merchantCheckoutId: mid,
    environment: process.env.NEXT_PUBLIC_GOKWIK_ENVIRONMENT,
    type,
    scriptUrl,
    storeId: process.env.NEXT_PUBLIC_STORE_ID,
    fbPixelId: process.env.NEXT_PUBLIC_MULTI_PIXEL_IDS,
    debug: process.env.NEXT_PUBLIC_GOKWIK_DEBUG === "true",
    message1: process.env.NEXT_PUBLIC_GOKWIK_BANNER_MESSAGE_1,
    message2: process.env.NEXT_PUBLIC_GOKWIK_BANNER_MESSAGE_2,
  };
}
