/**
 * Session-scoped backend-health tracker.
 *
 * Voice tools call external, per-merchant services (search, catalog, …) whose
 * wiring differs by deployment. When one is misconfigured or unreachable it must
 * degrade HONESTLY — e.g. a broken search backend must never masquerade as an empty
 * catalog ("no products found"), which reads as "the agent is broken/says the store
 * is empty." This tracks per-service health with a short cooldown so a failing
 * service is briefly skipped (and reported as unavailable) instead of hammered on
 * every turn, then automatically retried once the cooldown lapses.
 *
 * Merchant-agnostic by construction: keyed by a LOGICAL service name, never by any
 * merchant identity, URL, or config. One tracker per session (created in the tool
 * factory), so health never leaks across shoppers.
 */

export type ServiceName =
  "search" | "catalog" | "product" | "reviews" | "offers";

export interface ServiceHealth {
  /** True while the service is in its post-failure cooldown (treat as unavailable). */
  isDown(service: ServiceName): boolean;
  /** Record a failure — starts the cooldown. */
  markDown(service: ServiceName): void;
  /** Record a success — clears any cooldown (service recovered). */
  markUp(service: ServiceName): void;
}

/** Default cooldown: long enough to stop hammering a down service within a turn or
 *  two, short enough that a transient blip self-heals within the same conversation. */
const DEFAULT_COOLDOWN_MS = 30_000;

export function createServiceHealth(
  cooldownMs: number = DEFAULT_COOLDOWN_MS,
  now: () => number = () => Date.now()
): ServiceHealth {
  const downUntil = new Map<ServiceName, number>();
  return {
    isDown: (service) => (downUntil.get(service) ?? 0) > now(),
    markDown: (service) => {
      downUntil.set(service, now() + cooldownMs);
    },
    markUp: (service) => {
      downUntil.delete(service);
    },
  };
}
