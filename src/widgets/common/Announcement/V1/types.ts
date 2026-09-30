import type { AnnouncementVM } from "../contract";

/**
 * AnnouncementBasic (v1) — minimal announcement bar look.
 *
 * White scheme bar, ~38px tall, 13px letter-spaced message centered in a
 * 1200px container. One message renders statically; 2+ messages become a
 * carousel with prev/next carets (slide ±15px + fade, 0.25s) and optional
 * auto-rotate (default OFF — the look's original behavior).
 */

/** One announcement message (flat — editor-friendly). */
export interface AnnouncementBasicMessage {
  /** Bold lead line — set only in the stacked (two-line) layout. */
  title?: string;
  /** Message text. */
  text?: string;
  /** Optional URL — when set the message becomes a link with an arrow icon. */
  link?: string;
}

/**
 * AnnouncementBasic native settings — v1's typed VM extension (vm.v1).
 * `dividerColor` is an extension (the source hardcoded a foreground-tinted
 * hairline; empty keeps that default).
 */
export interface AnnouncementBasicSettings {
  /** @default 'v1' */
  variant?: string;

  /** Messages. 1 = static; 2+ = carousel with prev/next controls. */
  announcements?: AnnouncementBasicMessage[];
  /** Auto-rotate slides (2+ messages only). The look's default is OFF. */
  autoRotate?: boolean;
  /** Seconds between slide changes (3–10). */
  changeSlidesSpeed?: number;

  /** Bar background. Empty = scheme background. */
  backgroundColor?: string;
  /** Bar text color. Empty = scheme foreground. */
  textColor?: string;
  /** Show the 1px bottom hairline. */
  showLineSeparator?: boolean;
  /** Hairline color (extension). Empty = foreground-tinted default. */
  dividerColor?: string;
  /** Hairline thickness in px (extension). @default 1 */
  dividerWidth?: number;
  colorScheme?: string;

  /* ---- Extensions (the source hardcoded these) ---- */
  /** Message size: small 11/12px · medium 12/13px (original) · large 14/15px. */
  textSize?: "small" | "medium" | "large";
  /** Message alignment inside the bar. @default center */
  textAlign?: "left" | "center" | "right";
  /** Message case. @default none */
  textCase?: "none" | "uppercase";
  /** Letter spacing: tight 0.5px · normal 1px (original) · loose 2px. */
  letterSpacing?: "tight" | "normal" | "loose";
  /** Show the prev/next carets (2+ messages). @default true */
  showArrows?: boolean;
  /** Caret placement: bar edges (original) or hugging the message. */
  arrowPosition?: "edges" | "text";
  /** Suspend auto-rotate while hovered. @default false (original) */
  pauseOnHover?: boolean;
  /** Open message links in a new tab. @default false */
  openInNewTab?: boolean;
  /** Bar block padding in px. @default 10 (original) */
  paddingTop?: number;
  paddingBottom?: number;
}

/** Props for the v1 look — renders ONLY the VM (vm.v1 is its extension). */
export interface AnnouncementBasicProps {
  vm: AnnouncementVM;
  className?: string;
  locale?: string;
}
