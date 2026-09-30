"use client";

/**
 * Shared, bounded HTTP helpers for the voice widget + tools. Every call has a
 * timeout so a hung backend can never hang a tool (which would make the agent go
 * silent mid-conversation), and none of them throw — they degrade to null / the
 * raw text so callers fall back gracefully.
 */

/**
 * Read the voice access code for a gated/shared demo URL: from `?vc=` on first load,
 * remembered in sessionStorage so it survives client navigation. Returns "" on a
 * normal deployment (no code in the link) — callers then send no gate header, and the
 * server gate is a no-op unless VOICE_ACCESS_CODE is set. The code is never embedded
 * in the bundle; it travels only on the shared link the team is given.
 */
export function voiceAccessCode(): string {
  let fromUrl: string | null = null;
  try {
    fromUrl = new URLSearchParams(window.location.search).get("vc");
  } catch {
    /* no window / unparseable */
  }
  // A code in the URL wins and is returned even if persisting it fails — otherwise a
  // storage-blocked browser (e.g. Safari Private Mode) would throw on setItem and drop
  // a VALID code, making a gated demo URL unusable there.
  if (fromUrl) {
    try {
      sessionStorage.setItem("voiceAccessCode", fromUrl);
    } catch {
      /* storage blocked — the URL code is still returned below */
    }
    return fromUrl;
  }
  try {
    return sessionStorage.getItem("voiceAccessCode") || "";
  } catch {
    return "";
  }
}

/**
 * A time-limited AbortSignal that works on EVERY target browser. The native
 * `AbortSignal.timeout()` only shipped in Chrome 103 / Safari 15.4 / Firefox 100
 * (mid-2022) — calling it directly threw on anything older (iOS 15.0–15.3, older
 * Samsung Internet / Android WebView), which killed the voice token mint and every
 * voice fetch outright. This uses the native method when present and otherwise
 * falls back to an AbortController + setTimeout (supported since Chrome 66 /
 * Safari 12.1 / Firefox 57). The timer is cleared on abort so it can't leak.
 */
export function timeoutSignal(ms: number): AbortSignal {
  const AS = AbortSignal as typeof AbortSignal & {
    timeout?: (ms: number) => AbortSignal;
  };
  if (typeof AS.timeout === "function") return AS.timeout(ms);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  controller.signal.addEventListener("abort", () => clearTimeout(timer), {
    once: true,
  });
  return controller.signal;
}

/** Bounded GET returning parsed JSON, or null on any failure/timeout. */
export async function fetchJson(url: string, ms = 6000): Promise<any | null> {
  try {
    const res = await fetch(url, { signal: timeoutSignal(ms) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Like fetchJson but SURFACES the HTTP status (and lets you pass headers), so
 * callers can tell an auth failure (401/403) apart from an empty/other result —
 * used by the authenticated account tools to detect an expired/invalid session.
 * Still never throws.
 */
export async function fetchJsonWithStatus(
  url: string,
  init: RequestInit = {},
  ms = 6000
): Promise<{ ok: boolean; status: number; data: any | null }> {
  try {
    const res = await fetch(url, { ...init, signal: timeoutSignal(ms) });
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      /* non-JSON / empty body */
    }
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

/**
 * Normalize a spoken query into the catalog's language (English by default; the
 * server route honors VOICE_CATALOG_LANGUAGE). Plain-ASCII passes straight
 * through with no network call; anything else is translated server-side. Never
 * blocks the shopper — on any failure it returns the original text.
 */
export async function toCatalogQuery(raw: string): Promise<string> {
  const q = (raw ?? "").trim();
  if (!q) return q;
  if (!/[^\x00-\x7F]/.test(q)) return q; // fast path: already Latin/ASCII
  try {
    // Forward the access code so the SERVER gate authorizes this (LLM-cost) call on a
    // gated demo URL. On failure (incl. a 401 gate) the caller falls back to `q`, so
    // an ungated/uncoded load simply skips translation rather than breaking.
    const code = voiceAccessCode();
    const res = await fetch("/api/voice-normalize-query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(code ? { "x-voice-access-code": code } : {}),
      },
      body: JSON.stringify({ text: q }),
      signal: timeoutSignal(4000),
    });
    if (!res.ok) return q;
    const { query } = await res.json();
    return typeof query === "string" && query.trim() ? query.trim() : q;
  } catch {
    return q;
  }
}
