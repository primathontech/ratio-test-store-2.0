/**
 * Voice agent GUARDRAILS — the abuse policy the tool dispatcher enforces BEFORE it
 * runs any call. Kept in its own module (pure, no React/DOM/provider) so the whole
 * "how the agent can be misused, and what stops it" story is one auditable,
 * unit-testable unit rather than scattered through runTool.
 *
 * Governing principle: the agent's authority == the shopper's own browser
 * authority (it cannot complete a payment — checkout hands off to GoKwik + a
 * human). So these guardrails are about COST/LOAD (loops, bulk, fan-out) and
 * INTEGRITY (a single injected instruction can't fire an irreversible action),
 * NOT privilege. Every limit is sized so a REAL shopping session never trips it —
 * the responses are soft pacing the agent reads out, never a crash the shopper
 * hears.
 *
 * Three enforcement points:
 *   1. checkRate     — per-session ceiling + sliding-window rate → kills loops/bulk.
 *   2. checkConfirm  — arm-then-execute for high-impact actions → forces an audible
 *                      checkpoint; the FIRST call can never execute checkout/remove.
 *   3. sanitizeUntrusted — neutralises prompt-injection in user/catalog text.
 */

export interface GuardLimits {
  /** Hard per-session ceiling on EXECUTED tool calls. Once passed, all further
   *  calls are refused for the rest of the session (functional circuit breaker). */
  maxToolCalls: number;
  /** Max executed tool calls inside a rolling `toolRateWindowMs`. */
  toolRateMax: number;
  toolRateWindowMs: number;
  /** How long an armed high-impact confirmation stays valid (ms). */
  confirmTtlMs: number;
}

export interface GuardState {
  /** Timestamps of recently EXECUTED calls (pruned in place by checkRate). */
  window: number[];
  /** The single high-impact action currently awaiting the shopper's "yes".
   *  `batch` is the tool-call batch it was armed in — it can only be CONSUMED in a
   *  strictly later batch, so the model can't arm-and-execute in one turn. */
  pendingConfirm: { key: string; ts: number; batch: number } | null;
}

export function newGuardState(): GuardState {
  return { window: [], pendingConfirm: null };
}

type Blocked = {
  blocked: true;
  reason: string;
  result: Record<string, unknown>;
};
type Allowed = { blocked: false };

/**
 * Budget + sliding-window rate limit. `plannedCount` is what the session's
 * executed-call count WOULD become if this call runs (i.e. current + 1) — so
 * refused calls never push the session toward the ceiling. Mutates `state.window`.
 * On allow it records the timestamp; on block it does not.
 */
export function checkRate(
  state: GuardState,
  limits: GuardLimits,
  plannedCount: number,
  now: number
): Blocked | Allowed {
  const cutoff = now - limits.toolRateWindowMs;
  state.window = state.window.filter((t) => t > cutoff);

  if (plannedCount > limits.maxToolCalls) {
    return {
      blocked: true,
      reason: "ceiling",
      result: {
        ok: false,
        rate_limited: true,
        message:
          "We've done quite a lot this session, so I'll hold off on more actions for now. You can keep browsing, or tap the mic again in a moment to start fresh.",
      },
    };
  }
  if (state.window.length >= limits.toolRateMax) {
    return {
      blocked: true,
      reason: "rate",
      result: {
        ok: false,
        rate_limited: true,
        message:
          "Let's take those one at a time — tell me the next thing you'd like and I'll do it.",
      },
    };
  }
  state.window.push(now);
  return { blocked: false };
}

export interface ConfirmSpec {
  /** Stable identity of the action (tool + the args that define it), so the second
   *  call is recognised as the confirmation of the first. */
  key: string;
  /** The one-line question the agent must read out and get a "yes" to. */
  summary: string;
}

/**
 * High-impact confirmation. `spec` is null for non-high-impact tools (proceed).
 * For a high-impact tool: if there is a fresh armed confirmation whose key matches,
 * it is consumed and the call proceeds; otherwise the call is ARMED (never executed
 * on the first attempt) and a needs_confirmation result is returned for the agent
 * to voice. This makes the "confirm before checkout/remove/large qty" rule
 * structural — a single (possibly injected) instruction cannot fire the action,
 * and the real shopper always hears the summary between the two calls.
 */
export function checkConfirm(
  state: GuardState,
  spec: ConfirmSpec | null,
  limits: GuardLimits,
  now: number,
  batch: number
):
  | { needConfirm: true; result: Record<string, unknown> }
  | { needConfirm: false } {
  if (!spec) return { needConfirm: false };
  const p = state.pendingConfirm;
  // Consume only if the key matches, it hasn't expired, AND we're in a strictly
  // later batch than the arm — so two identical calls in ONE turn can never
  // arm-then-execute; the shopper's "yes" always lands in a new batch between them.
  const fresh =
    !!p &&
    p.key === spec.key &&
    now - p.ts < limits.confirmTtlMs &&
    batch > p.batch;
  if (fresh) {
    state.pendingConfirm = null; // consume → execute now
    return { needConfirm: false };
  }
  state.pendingConfirm = { key: spec.key, ts: now, batch };
  return {
    needConfirm: true,
    result: {
      ok: false,
      needs_confirmation: true,
      summary: spec.summary,
      message: spec.summary,
    },
  };
}

// Prompt-injection markers commonly planted in user-generated content (reviews)
// or, in theory, catalog copy. Conservative on purpose: we neutralise clear
// instruction framing without mangling ordinary prose.
const CONTROL_TOKENS =
  /<\|[^>]*\|>|\[\/?(?:INST|SYS|SYSTEM|ASSISTANT|USER)\]/gi;
const ROLE_PREFIX = /^\s*(?:system|assistant|developer|user)\s*:\s*/gim;
const INJECTION_DIRECTIVE =
  /\b(?:ignore|disregard|forget|override)\b[^.!?\n]{0,40}\b(?:previous|prior|above|earlier|all|the)\b[^.!?\n]{0,40}\b(?:instruction|prompt|message|rule|direction)s?\b/gi;
// ASCII control chars (nulls / escapes) that can smuggle role framing past a
// human reader.
const CONTROL_CHARS = /[\x00-\x1f\x7f]/g;

/**
 * Neutralise prompt-injection in untrusted text (reviews, descriptions, on-page
 * content) before it enters the model context. Defence-in-depth on top of the
 * persona's "tool text is DATA" rule — and the confirmation + rate guards bound
 * the blast radius of anything that still slips through.
 */
export function sanitizeUntrusted(input: unknown, maxLen = 600): string {
  let s = String(input ?? "");
  s = s
    .replace(CONTROL_TOKENS, " ")
    .replace(INJECTION_DIRECTIVE, "[removed]")
    .replace(ROLE_PREFIX, "")
    .replace(CONTROL_CHARS, " ")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
  if (s.length > maxLen) s = s.slice(0, maxLen).trim();
  return s;
}

/** Bounded-concurrency map — caps a fan-out (e.g. sort-by-rating over the working
 *  set) so it can't burst N backend calls at once. Preserves input order. */
export async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from(
    { length: Math.max(1, Math.min(limit, items.length)) },
    async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    }
  );
  await Promise.all(workers);
  return out;
}
