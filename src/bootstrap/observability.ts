import { readFileSync } from "node:fs";

/** Unique per `next build`, so every deploy is told apart with no setup. */
function buildId(): string | undefined {
  try {
    return readFileSync(".next/BUILD_ID", "utf8").trim();
  } catch {
    return undefined; // next dev writes no BUILD_ID
  }
}

/**
 * Server-trusted identity of this deploy, stamped on browser signals (by /api/obs)
 * and server traces (by instrumentation.ts). Node only.
 */
export function observabilityResource() {
  return {
    "merchant.id": process.env.NEXT_PUBLIC_MERCHANT_ID,
    // Readable, for alerts; the id stays the key.
    "merchant.name":
      process.env.NEXT_PUBLIC_MERCHANT_NAME ||
      process.env.NEXT_PUBLIC_SITE_NAME,
    "service.version": buildId(),
    "deployment.environment": process.env.NEXT_PUBLIC_GOKWIK_ENVIRONMENT,
  };
}
