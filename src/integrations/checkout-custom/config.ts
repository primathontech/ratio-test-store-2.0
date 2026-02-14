/**
 * Checkout Custom Configuration
 * Self-contained configuration for Gokwik Checkout Custom platform integration
 */

/**
 * Validate checkout environment variables
 */
function validateCheckoutEnv(): void {
  // Check if GoKwik is enabled
  if (!process.env.NEXT_PUBLIC_GOKWIK_ENABLED) {
    console.warn("GoKwik is disabled via NEXT_PUBLIC_GOKWIK_ENABLED");
    return;
  }

  // Validate required environment variables
  if (!process.env.NEXT_PUBLIC_GOKWIK_MID) {
    throw new Error(
      "NEXT_PUBLIC_GOKWIK_MID (Merchant ID) is required when GoKwik is enabled"
    );
  }

  // Validate environment
  if (!process.env.NEXT_PUBLIC_GOKWIK_ENVIRONMENT) {
    throw new Error(
      `Invalid NEXT_PUBLIC_GOKWIK_ENVIRONMENT: ${process.env.NEXT_PUBLIC_GOKWIK_ENVIRONMENT}`
    );
  }

  // Warn about missing optional but recommended variables
  if (!process.env.NEXT_PUBLIC_STORE_ID) {
    console.warn(
      "NEXT_PUBLIC_STORE_ID is not set. Checkout functionality may not work correctly."
    );
  }

  if (!process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
    console.warn(
      "NEXT_PUBLIC_FB_PIXEL_ID is not set. Facebook conversion tracking will be disabled."
    );
  }
}

/**
 * Get Checkout Custom configuration object
 */
export function getCheckoutConfig() {
  validateCheckoutEnv();

  return {
    enabled: process.env.NEXT_PUBLIC_GOKWIK_ENABLED || true,
    mid: process.env.NEXT_PUBLIC_GOKWIK_MID!,
    environment: process.env.NEXT_PUBLIC_GOKWIK_ENVIRONMENT,
    type: process.env.NEXT_PUBLIC_GOKWIK_TYPE!,
    scriptUrl: process.env.NEXT_PUBLIC_GOKWIK_SCRIPT_URL!,
    storeId: process.env.NEXT_PUBLIC_STORE_ID,
    fbPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID,
    debug: process.env.NEXT_PUBLIC_GOKWIK_DEBUG || false,
    message1: process.env.NEXT_PUBLIC_GOKWIK_BANNER_MESSAGE_1,
    message2: process.env.NEXT_PUBLIC_GOKWIK_BANNER_MESSAGE_2,
  };
}
