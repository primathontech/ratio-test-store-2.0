"use client";

/**
 * Voice funnel analytics — the PILOT instrumentation that turns "does the voice
 * agent help conversion?" from opinion into data. Two sinks, both fire-and-forget
 * and both incapable of breaking the voice flow (every call is try/caught):
 *
 *  1. window.dataLayer  → GA4 / GTM pick up `voice_*` events automatically, so
 *     you can build funnels in the tools you already use, zero backend work.
 *  2. POST /api/voice-events → a structured server log (grep-able now; forward to
 *     a warehouse/Segment in production).
 *
 * NOTE: standard conversion events (AddToCart, Purchase) already flow to
 * Meta/GA4 via @shopkit/events when voice mutates the cart (see bootstrap/cart).
 * THIS layer adds the voice ATTRIBUTION + funnel (who engaged, which tools they
 * used, what they asked, where they dropped) so voice-sourced conversions can be
 * isolated and measured.
 */

let sessionId = "";

export function newVoiceSession(): string {
  const rand = Math.random().toString(36).slice(2, 8);
  sessionId = `vs_${Date.now().toString(36)}_${rand}`;
  return sessionId;
}

export function voiceSessionId(): string {
  return sessionId;
}

export function voiceTrack(
  event: string,
  props: Record<string, unknown> = {}
): void {
  try {
    const ts = Date.now();
    const w = window as any;
    // GA4 / GTM — `event` is the GTM event name; props carry the detail.
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: `voice_${event}`,
      session_id: sessionId,
      ...props,
      ts,
    });
    // Server log (fire-and-forget; never awaited, never blocks voice)
    const body = JSON.stringify({ session_id: sessionId, event, ...props, ts });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/voice-events", body);
    } else {
      fetch("/api/voice-events", {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* analytics must NEVER break the voice experience */
  }
}
