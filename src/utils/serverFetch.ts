/**
 * Server-side fetch with a bounded upstream wait.
 *
 * A bare `fetch` in a server route handler has no timeout: if the upstream
 * hangs, the awaiting request — and every closure it captures (request body,
 * headers, render scope) — stays pinned in heap forever. Under load these
 * accumulate and exhaust memory. @shopkit/data-layer bounds its own requests
 * the same way (see resolveRequestSignal in its custom adapter).
 *
 * `AbortSignal.timeout` is preferred over a manual AbortController + setTimeout
 * because the timer is owned by the signal and cannot itself leak.
 */
export const DEFAULT_SERVER_FETCH_TIMEOUT_MS = 10_000;

export function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_SERVER_FETCH_TIMEOUT_MS
): Promise<Response> {
  // Respect a caller-supplied signal if present; otherwise bound the wait.
  const signal = init.signal ?? AbortSignal.timeout(timeoutMs);
  return fetch(input, { ...init, signal });
}
