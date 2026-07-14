import { LOCAL_LOGIC } from "./_overrides";

/**
 * Resolve a section's logic: a fork-registered local wrapper wins over the
 * common implementation. Type-safe from the caller's side — the fallback fixes
 * T, and a registered override must be assignment-compatible (wrappers pin
 * `typeof buildXxxVM`, so upstream signature drift fails the FORK's tsc).
 */
export function resolveLogic<T>(sectionName: string, common: T): T {
  return (LOCAL_LOGIC[sectionName] as T | undefined) ?? common;
}
