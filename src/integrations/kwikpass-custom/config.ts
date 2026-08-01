/**
 * KwikPass Custom Configuration
 * Self-contained configuration for KwikPass Custom platform integration
 */

/**
 * Validate KwikPass environment variables
 */
function validateKwikPassEnv(): void {
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
  if (!process.env.NEXT_PUBLIC_MULTI_PIXEL_IDS) {
    console.warn(
      "NEXT_PUBLIC_MULTI_PIXEL_IDS is not set. Facebook conversion tracking will be disabled."
    );
  }
}

/**
 * Get KwikPass Custom configuration object
 */
export function getKwikPassConfig() {
  validateKwikPassEnv();

  return {
    enabled: process.env.NEXT_PUBLIC_KP_EVENT_ALLOWED !== "no", // yes or no
    merchantName: process.env.NEXT_PUBLIC_GOKWIK_MID!,
    environment: process.env.NEXT_PUBLIC_GOKWIK_ENVIRONMENT,
    type: process.env.NEXT_PUBLIC_GOKWIK_TYPE!,
    scriptUrl: process.env.NEXT_PUBLIC_GOKWIK_SCRIPT_URL!,
    fbPixelId: process.env.NEXT_PUBLIC_MULTI_PIXEL_IDS,
    debug: process.env.NEXT_PUBLIC_GOKWIK_DEBUG || false,
  };
}
