"use client";

/**
 * Voice Assistant — the SMART CONTAINER. It maps the live session onto the
 * presentational <VoiceWidget/> and owns nothing else. All real machinery stays
 * where it belongs:
 *   - useVoiceSession  → connect/disconnect, token cache, cost caps, analytics,
 *     mute, activity, error — the whole session view-model.
 *   - ui/VoiceWidget   → the approved "Ratio Voice AI" design (pure UI).
 *   - providers/tools/ → the AI backend + tool business logic.
 *
 * Mic disclosure is the browser's own permission prompt (fired by getUserMedia on
 * first connect), so there's no in-widget consent gate. Nothing merchant- or
 * provider-specific is hardcoded here: the brand tint is one token (`--rv-accent`)
 * and every behavior knob lives in voiceConfig.
 */

import { useCallback, useMemo } from "react";
import { getVoiceConfig } from "./voiceConfig";
import { useVoiceSession } from "./hooks/useVoiceSession";
import { VoiceWidget, type VoiceView } from "./ui/VoiceWidget";

const APPEARANCE = getVoiceConfig().appearance;
const SIDE: "left" | "right" =
  APPEARANCE.position === "bottom-left" ? "left" : "right";
// Optional merchant tint — one CSS color drives the whole widget (strong/soft/live
// shades derive from it). Absent → the design's built-in teal.
const ACCENT = process.env.NEXT_PUBLIC_VOICE_ACCENT || undefined;
const BRAND = process.env.NEXT_PUBLIC_VOICE_NAME || "Ratio";

/** Drop a leading status emoji so the bar's status line reads as clean text
 *  ("🔎 Searching…" → "Searching…"); captions keep their emoji elsewhere. */
function cleanCaption(c: string): string {
  // Strip a leading run of whitespace + emoji/symbol code units (no /u flag, so we
  // match the surrogate + common-symbol ranges directly — enough to drop a status
  // emoji prefix). If that would empty the string (e.g. a non-Latin caption), the
  // caller falls back to an activity label.
  return c.replace(/^[\s‍️←-⯿☀-➿\ud800-\udfff]+/, "").trim();
}

export function VoiceAssistant() {
  const {
    status,
    caption,
    activity,
    muted,
    toggleMute,
    error,
    start,
    stop,
    prewarm,
  } = useVoiceSession();

  // Map the session lifecycle onto the 4 visual states. `error` (terminal) wins,
  // then the connection status.
  const view: VoiceView = useMemo(() => {
    if (error) return "error";
    if (status === "connecting") return "connecting";
    if (status === "live") return "live";
    return "idle";
  }, [error, status]);

  // The bar's status line: granular phases (searching / navigating / adding to
  // cart / opening checkout …) already arrive via `caption`; speaking/listening/
  // thinking come from `activity`; muted overrides.
  const statusText = useMemo(() => {
    // connecting: show the live caption when it's meaningful (e.g. "Reconnecting…")
    // else a plain label.
    if (view === "connecting") return cleanCaption(caption) || "Connecting…";
    if (view === "error")
      return cleanCaption(caption) || "Something went wrong";
    if (muted) return "Muted";
    if (activity === "speaking") return `${BRAND} is speaking`;
    // thinking = a tool is running → the caption IS the progress message
    // ("Searching…", "Opening…", "Adding to cart…"); the spinner sits beside it.
    if (activity === "thinking") return cleanCaption(caption) || "Thinking…";
    // listening: keep it clean — never let a prior action's caption (a long product
    // name, etc.) linger as the resting label.
    return "Listening…";
  }, [view, caption, muted, activity]);

  const handleLaunch = useCallback(() => {
    if (status === "connecting") return; // connect already in flight
    void start();
  }, [status, start]);

  const handleEnd = useCallback(() => void stop(), [stop]);
  const handleRetry = useCallback(() => void start(), [start]);

  return (
    <VoiceWidget
      view={view}
      activity={activity}
      muted={muted}
      statusText={statusText}
      brandName={BRAND}
      side={SIDE}
      accent={ACCENT}
      launchDisabled={status === "connecting"}
      onLaunch={handleLaunch}
      onPrewarm={prewarm}
      onToggleMute={toggleMute}
      onEnd={handleEnd}
      onRetry={handleRetry}
    />
  );
}
