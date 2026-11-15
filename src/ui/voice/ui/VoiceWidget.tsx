"use client";

/**
 * Ratio Voice AI — the PRESENTATIONAL widget (approved design, artifact 637ac59f).
 * Pure UI: it renders the launcher tile OR the live call bar from the props it's
 * given and reports taps back through callbacks. It holds NO session state and
 * knows nothing about the engine — the smart container (VoiceAssistant) maps the
 * live session onto these props. That keeps this file trivially reusable and the
 * business logic in exactly one place.
 *
 * Everything visual is token-driven (`--rv-*`, scoped to `.rv-root` so it can
 * never collide with or leak into the storefront's own CSS variables). A merchant
 * tints the whole widget by overriding ONE token, `--rv-accent` (see `accent`
 * prop); strong/soft/live shades derive from it via color-mix. Light + dark,
 * reduced-motion, and keyboard focus are all handled here.
 */

import React from "react";
import type { VoiceActivity } from "../hooks/useVoiceSession";
import {
  HangUpIcon,
  MicOffIcon,
  MicOnIcon,
  RatioMark,
  SlashIcon,
} from "./icons";

/** The VISUAL states of the widget. The engine's richer lifecycle collapses onto
 *  these; granular phases (searching, navigating, adding to cart, …) ride the
 *  `statusText` line. `paused` = the session was suspended when the tab was
 *  backgrounded and can be resumed. */
export type VoiceView = "idle" | "connecting" | "live" | "error" | "paused";

export interface VoiceWidgetProps {
  view: VoiceView;
  activity: VoiceActivity;
  muted: boolean;
  /** The line shown under the brand name while the call bar is up. */
  statusText: string;
  /** Assistant brand name (defaults to "Ratio"). */
  brandName?: string;
  side: "left" | "right";
  /** Optional merchant tint — any CSS color; becomes `--rv-accent`. */
  accent?: string;
  /** Disable the launcher (connect in flight). */
  launchDisabled?: boolean;
  onLaunch: () => void;
  onPrewarm: () => void;
  onToggleMute: () => void;
  onEnd: () => void;
  onRetry: () => void;
  /** Resume a backgrounded (paused) session — shown only in the paused state. */
  onResume: () => void;
  /** Idle-only overlay content (consent / adoption-hint bubbles), stacked above
   *  the launcher by the container. */
  children?: React.ReactNode;
}

function VoiceWidgetImpl({
  view,
  activity,
  muted,
  statusText,
  brandName = "Ratio",
  side,
  accent,
  launchDisabled,
  onLaunch,
  onPrewarm,
  onToggleMute,
  onEnd,
  onRetry,
  onResume,
  children,
}: VoiceWidgetProps) {
  const rootStyle = accent
    ? ({ ["--rv-accent" as string]: accent } as React.CSSProperties)
    : undefined;

  return (
    <div
      className={"rv-root " + (side === "left" ? "rv-left" : "rv-right")}
      data-state={view}
      data-activity={activity}
      data-muted={muted ? "true" : "false"}
      style={rootStyle}
    >
      {view === "idle" && children}

      {view === "idle" ? (
        <button
          type="button"
          className="rv-launch"
          disabled={launchDisabled}
          onPointerEnter={onPrewarm}
          onFocus={onPrewarm}
          onPointerDown={onPrewarm}
          onClick={onLaunch}
          aria-label={`Talk to ${brandName} Voice AI`}
        >
          <span className="rv-launch-mark">
            <RatioMark className="rv-logo" />
          </span>
          <span>{brandName}&nbsp;Voice&nbsp;AI</span>
        </button>
      ) : (
        <div
          className="rv-bar"
          role="group"
          aria-label={`${brandName} voice call`}
        >
          <div className="rv-status">
            <span className="rv-avatar" aria-hidden="true">
              <span className="rv-ring" />
              <RatioMark className="rv-logo" />
              <span className="rv-mutebadge">
                <SlashIcon />
              </span>
            </span>
            <span className="rv-text">
              <span className="rv-nm">{brandName}</span>
              <span className="rv-st" aria-live="polite">
                <span className="rv-st-label" title={statusText}>
                  {statusText}
                </span>
                <span className="rv-work" aria-hidden="true" />
                <span className="rv-eq" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </span>
            </span>
          </div>
          <div className="rv-actions">
            <button
              type="button"
              className="rv-icon-btn rv-mute"
              onClick={onToggleMute}
              aria-label={muted ? "Unmute microphone" : "Mute microphone"}
              aria-pressed={muted}
            >
              {muted ? <MicOffIcon /> : <MicOnIcon />}
            </button>
            <button
              type="button"
              className="rv-icon-btn rv-end"
              onClick={onEnd}
              aria-label="End call"
            >
              <HangUpIcon />
            </button>
            <button type="button" className="rv-retry" onClick={onRetry}>
              Retry
            </button>
            <button type="button" className="rv-resume" onClick={onResume}>
              Resume
            </button>
          </div>
        </div>
      )}

      <style>{WIDGET_CSS}</style>
    </div>
  );
}

/** Presentational + prop-driven → memoize so streaming captions / activity flips
 *  only re-render when a prop actually changes. */
export const VoiceWidget = React.memo(VoiceWidgetImpl);

// ---------------------------------------------------------------------------
// Styles — ported from the approved artifact. Tokens are `--rv-*` and scoped to
// `.rv-root`; the desktop float vs mobile bottom-sheet is a media query (no UA
// sniffing). A single override of `--rv-accent` re-tints the whole widget.
// ---------------------------------------------------------------------------
const WIDGET_CSS = `
.rv-root, .rv-root *, .rv-root *::before, .rv-root *::after { box-sizing: border-box; }
.rv-root {
  --rv-surface:#FFFFFF; --rv-surface-2:#F3F4F8; --rv-bg-2:#ECEEF3;
  --rv-ink:#14171C; --rv-ink-2:#565D6B; --rv-ink-3:#878E9C;
  --rv-line:#E4E7EC; --rv-line-2:#D5DAE2;
  --rv-accent:#0E8C7F;
  /* strong/soft derive from --rv-accent via color-mix so ONE token re-tints the
     whole widget. The static line before each is the fallback for browsers without
     color-mix (Chrome <111 / Safari <16.2 / Firefox <113) — they keep the default
     palette (a custom --rv-accent still applies where it's used directly). */
  --rv-accent-strong: #0B6F65;
  --rv-accent-strong: color-mix(in srgb, var(--rv-accent) 78%, #000);
  --rv-accent-soft: #E3F3F0;
  --rv-accent-soft: color-mix(in srgb, var(--rv-accent) 14%, var(--rv-surface));
  --rv-live: var(--rv-accent);
  --rv-danger:#DE474C; --rv-danger-strong:#C23A3F;
  --rv-shadow: 0 12px 34px -12px rgba(20,23,28,.28), 0 2px 6px -2px rgba(20,23,28,.10);
  --rv-font: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  position: fixed; z-index: 2147483000; bottom: 20px;
  display: flex; flex-direction: column; gap: 8px;
  font-family: var(--rv-font); line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}
@media (prefers-color-scheme: dark) {
  .rv-root {
    --rv-surface:#171B22; --rv-surface-2:#1E242E; --rv-bg-2:#12161D;
    --rv-ink:#EAECEF; --rv-ink-2:#A5ACBA; --rv-ink-3:#6C7484;
    --rv-line:#262C36; --rv-line-2:#333B48;
    --rv-accent:#1FB8A6;
    /* dark fallbacks (static) + the color-mix override for modern browsers — same
       pattern as the light block, so dark degrades cleanly without color-mix. */
    --rv-accent-strong: #4FD8C7;
    --rv-accent-strong: color-mix(in srgb, var(--rv-accent) 78%, #000);
    --rv-accent-soft: #12312D;
    --rv-accent-soft: color-mix(in srgb, var(--rv-accent) 14%, var(--rv-surface));
    --rv-danger:#FF5C61; --rv-danger-strong:#FF8488;
    --rv-shadow: 0 16px 38px -14px rgba(0,0,0,.62), 0 2px 8px -3px rgba(0,0,0,.5);
  }
}
.rv-root.rv-right { right: 20px; align-items: flex-end; }
.rv-root.rv-left  { left: 20px;  align-items: flex-start; }

/* idle launcher — one branded tile */
.rv-launch {
  display: inline-flex; align-items: center; gap: 11px; cursor: pointer;
  background: var(--rv-surface); border: 1px solid var(--rv-line);
  border-radius: 999px; padding: 8px 20px 8px 8px; box-shadow: var(--rv-shadow);
  font: inherit; font-size: .96rem; font-weight: 600; color: var(--rv-ink);
  letter-spacing: -.01em;
  transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
}
.rv-launch:hover { transform: translateY(-2px); border-color: var(--rv-accent);
  box-shadow: 0 16px 38px -14px color-mix(in srgb, var(--rv-accent) 40%, rgba(20,23,28,.4)); }
.rv-launch:active { transform: translateY(0) scale(.98); }
.rv-launch[disabled] { cursor: default; opacity: .72; }
.rv-launch-mark {
  position: relative; flex: none; width: 40px; height: 40px; border-radius: 50%;
  display: grid; place-items: center; color: #fff;
  /* solid fallback first → browsers without color-mix keep a filled accent disc
     (never an invisible/transparent mark); modern browsers get the gradient. */
  background: var(--rv-accent);
  background: radial-gradient(120% 120% at 30% 25%, color-mix(in srgb, var(--rv-accent) 88%, #fff) 0%, var(--rv-accent) 55%, var(--rv-accent-strong) 100%);
  box-shadow: 0 4px 14px -4px rgba(0,0,0,.28);
  box-shadow: 0 4px 14px -4px color-mix(in srgb, var(--rv-accent) 60%, transparent);
}
.rv-logo { width: 22px; height: 22px; }
.rv-launch-mark .rv-logo { width: 22px; height: 22px; }

/* live/connecting/error call bar */
.rv-bar {
  display: flex; align-items: center; gap: 12px; background: var(--rv-surface);
  border: 1px solid var(--rv-line); box-shadow: var(--rv-shadow);
  border-radius: 999px; padding: 8px 8px 8px 12px;
  /* FIXED footprint: the bar never grows to fit content — long captions truncate
     inside it instead (see .rv-st-label). Caps at 360px, but shrinks on tiny
     desktop viewports so it can't overflow the screen. */
  width: 320px; min-width: 250px; max-width: min(360px, calc(100vw - 40px));
}

/* brand avatar — carries identity + state */
.rv-avatar {
  position: relative; flex: none; width: 40px; height: 40px; border-radius: 50%;
  display: grid; place-items: center; background: var(--rv-accent-soft); color: var(--rv-accent);
}
.rv-avatar .rv-logo { width: 22px; height: 22px; }
.rv-avatar::after { content: ""; position: absolute; inset: 0; border-radius: 50%;
  border: 2px solid var(--rv-live); opacity: 0; }
.rv-root[data-state="live"] .rv-avatar::after { opacity: 1; animation: rv-pulse 1.9s ease-out infinite; }
.rv-root[data-activity="speaking"] .rv-avatar::after { border-color: var(--rv-accent); animation-duration: 1s; }
@keyframes rv-pulse { 0% { transform: scale(1); opacity: .55; } 100% { transform: scale(1.6); opacity: 0; } }
.rv-avatar .rv-ring { position: absolute; inset: -3px; border-radius: 50%;
  border: 2px solid transparent; border-top-color: var(--rv-accent); display: none; }
.rv-root[data-state="connecting"] .rv-avatar .rv-ring { display: block; animation: rv-spin .75s linear infinite; }
.rv-root[data-state="connecting"] .rv-avatar { background: var(--rv-surface-2); color: var(--rv-ink-3); }
@keyframes rv-spin { to { transform: rotate(360deg); } }
.rv-avatar .rv-mutebadge { position: absolute; right: -2px; bottom: -2px; width: 17px; height: 17px;
  border-radius: 50%; background: var(--rv-danger); color: #fff; display: none; place-items: center;
  border: 2px solid var(--rv-surface); }
.rv-avatar .rv-mutebadge svg { width: 9px; height: 9px; }
.rv-root[data-muted="true"] .rv-avatar { background: var(--rv-surface-2); color: var(--rv-ink-3); }
.rv-root[data-muted="true"] .rv-avatar::after { display: none; }
.rv-root[data-muted="true"] .rv-avatar .rv-mutebadge { display: grid; }
.rv-root[data-state="error"] .rv-avatar { background: color-mix(in srgb, var(--rv-danger) 14%, var(--rv-surface)); color: var(--rv-danger-strong); }

/* status text + equalizer */
.rv-status { display: flex; align-items: center; gap: 11px; flex: 1; min-width: 0; }
.rv-text { display: flex; flex-direction: column; line-height: 1.25; flex: 1; min-width: 0; }
.rv-text .rv-nm { font-size: .72rem; letter-spacing: .04em; color: var(--rv-ink-3); font-weight: 600; text-transform: uppercase; }
.rv-text .rv-st { display: flex; align-items: center; gap: 8px; min-width: 0;
  font-size: .92rem; font-weight: 550; color: var(--rv-ink); }
/* The label is the ONLY growing/shrinking part — it ellipsises; the spinner/eq
   stay a fixed size beside it. This is what keeps the bar's width constant. */
.rv-text .rv-st-label { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
/* Errors are terminal + actionable — let the message wrap to 2 lines instead of
   truncating away the "how to fix" half. Bar height grows a little; that's fine. */
.rv-root[data-state="error"] .rv-text .rv-st-label {
  white-space: normal; display: -webkit-box; -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; line-clamp: 2; overflow: hidden;
}
/* Working spinner — shown while the agent is running a tool ("thinking"), so the
   shopper always sees it's busy. Auto-hidden the moment activity leaves thinking. */
.rv-work { display: none; flex: none; width: 13px; height: 13px; border-radius: 50%;
  border: 2px solid var(--rv-line-2); border-top-color: var(--rv-accent); }
.rv-root[data-state="live"][data-activity="thinking"]:not([data-muted="true"]) .rv-work {
  display: inline-block; animation: rv-spin .7s linear infinite;
}
.rv-eq { display: none; align-items: flex-end; gap: 2px; height: 13px; flex: none; }
.rv-eq i { width: 3px; border-radius: 2px; background: var(--rv-accent); height: 5px; }
.rv-root[data-activity="speaking"]:not([data-muted="true"]) .rv-eq { display: inline-flex; }
.rv-root[data-activity="speaking"]:not([data-muted="true"]) .rv-eq i:nth-child(1) { animation: rv-eq .6s ease-in-out infinite; }
.rv-root[data-activity="speaking"]:not([data-muted="true"]) .rv-eq i:nth-child(2) { animation: rv-eq .6s ease-in-out infinite .15s; }
.rv-root[data-activity="speaking"]:not([data-muted="true"]) .rv-eq i:nth-child(3) { animation: rv-eq .6s ease-in-out infinite .3s; }
.rv-root[data-activity="speaking"]:not([data-muted="true"]) .rv-eq i:nth-child(4) { animation: rv-eq .6s ease-in-out infinite .05s; }
@keyframes rv-eq { 0%, 100% { height: 4px; } 50% { height: 13px; } }

/* controls */
.rv-actions { display: flex; align-items: center; gap: 8px; flex: none; }
.rv-root[data-state="connecting"] .rv-actions { display: none; }
.rv-icon-btn { display: inline-grid; place-items: center; cursor: pointer; border: none;
  width: 42px; height: 42px; border-radius: 50%; background: var(--rv-surface-2); color: var(--rv-ink);
  transition: background .15s ease, color .15s ease, transform .12s ease; }
.rv-icon-btn:hover { transform: translateY(-1px); }
.rv-icon-btn:active { transform: scale(.94); }
.rv-icon-btn svg { width: 20px; height: 20px; }
.rv-root[data-muted="true"] .rv-icon-btn.rv-mute { background: color-mix(in srgb, var(--rv-danger) 15%, var(--rv-surface)); color: var(--rv-danger-strong); }
.rv-icon-btn.rv-end { background: var(--rv-danger); color: #fff; }
.rv-icon-btn.rv-end:hover { background: var(--rv-danger-strong); }
.rv-root[data-state="error"] .rv-icon-btn.rv-mute,
.rv-root[data-state="paused"] .rv-icon-btn.rv-mute { display: none; }
.rv-retry, .rv-resume { display: none; border: none; cursor: pointer; background: var(--rv-accent);
  color: #fff; border-radius: 999px; padding: 9px 16px; font: inherit; font-size: .84rem; font-weight: 550; }
.rv-retry:hover, .rv-resume:hover { background: var(--rv-accent-strong); }
.rv-root[data-state="error"] .rv-retry { display: inline-block; }
.rv-root[data-state="paused"] .rv-resume { display: inline-block; }
/* paused (backgrounded): the avatar rests quietly (no pulse/ring/eq — those key
   off live/connecting/speaking), signalling the call is held, not lost. */
.rv-root[data-state="paused"] .rv-avatar { background: var(--rv-surface-2); color: var(--rv-ink-3); }

.rv-root button:focus-visible { outline: 2px solid var(--rv-accent); outline-offset: 2px; }

/* mobile: idle tile lifts above the bottom nav; live/connecting/error become a
   full-width bottom sheet that slides up */
@media (max-width: 768px) {
  .rv-root[data-state="idle"] { bottom: calc(72px + env(safe-area-inset-bottom, 0px)); }
  .rv-root[data-state="idle"].rv-right { right: calc(12px + env(safe-area-inset-right, 0px)); }
  .rv-root[data-state="idle"].rv-left  { left:  calc(12px + env(safe-area-inset-left, 0px)); }
  .rv-root:not([data-state="idle"]) { left: 0; right: 0; bottom: 0; align-items: stretch; gap: 0; }
  .rv-root:not([data-state="idle"]) .rv-bar {
    position: relative; width: auto; min-width: 0; max-width: none; border-radius: 20px 20px 0 0;
    padding: 20px 16px calc(16px + env(safe-area-inset-bottom, 0px));
    border-left: none; border-right: none; border-bottom: none;
    animation: rv-slideup .3s cubic-bezier(.2, .8, .2, 1);
  }
  .rv-root:not([data-state="idle"]) .rv-bar::before {
    content: ""; position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
    width: 34px; height: 4px; border-radius: 4px; background: var(--rv-line-2);
  }
  .rv-icon-btn { width: 46px; height: 46px; }
}
@keyframes rv-slideup { from { transform: translateY(100%); } to { transform: translateY(0); } }

@media (prefers-reduced-motion: reduce) {
  .rv-root *, .rv-root *::before, .rv-root *::after {
    animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important;
  }
  .rv-root[data-state="live"] .rv-avatar::after { opacity: .3; }
  .rv-root .rv-eq i { height: 9px !important; }
}
`;
