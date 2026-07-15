/**
 * The voice module's OBSERVABILITY seam.
 *
 * The engine must not scatter direct calls to the host's error reporter — that
 * couples every tool/hook to `@/lib/sentry/utils` and blocks extraction. Instead
 * the engine calls `captureVoiceError()` from HERE, and this one file adapts to the
 * host reporter. To move the voice code into a standalone repo/SDK you replace only
 * this file (or, in the SDK pass, promote it to an injected logger port) — nothing
 * else in the engine imports Sentry.
 *
 * Behaviour is identical to calling the Sentry util directly (same signature, same
 * tags), so this is a pure decoupling with zero functional change.
 */
import { captureSentryException } from "@/lib/sentry/utils";

/** Report a non-fatal voice error to the host's monitoring. `scope` is a short
 *  free-text label (e.g. "tool", "session", "boundary") merged into the tags. */
export function captureVoiceError(
  error: unknown,
  context?: { scope?: string; [tag: string]: unknown }
): void {
  const { scope, ...rest } = context ?? {};
  captureSentryException(error, {
    tags: { flow: "voice", ...(scope ? { scope } : {}), ...rest },
  });
}
