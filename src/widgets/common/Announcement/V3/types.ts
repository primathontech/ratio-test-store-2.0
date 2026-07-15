import type { AnnouncementVM } from "../contract";

/**
 * AnnouncementTicker (v3) — marquee announcement bar look.
 *
 * Full-bleed tinted bar above the header: two-part messages (bold uppercase
 * lead + regular trailing text, stacking vertically on mobile) that slide
 * left one-per-hold on a seamless clone-wrap track (300ms ease-out, 5s hold),
 * with a visually-hidden pause/play toggle. "Compact" OFF renders every
 * message side by side instead (no rotation). Optional sticky pinning per
 * viewport with a flow spacer.
 */

/** One message (flat — editor objectArray friendly). */
export interface AnnouncementTickerSlide {
  /** Bold uppercase lead text. */
  Heading: string;
  /** Trailing regular-weight text. Optional. */
  Text?: string;
  /** Optional href — wraps the whole slide in a link when present. */
  Link?: string;
}

/**
 * AnnouncementTicker native settings — v3's typed VM extension (vm.v3).
 * Colors are real settings whose defaults are the look's original values.
 */
export interface AnnouncementTickerSettings {
  /** @default 'v1' */
  variant?: string;
  /** The rotating messages (flat scalar rows). */
  slides?: AnnouncementTickerSlide[];
  /** Autoplay rotation interval in seconds. @default 5 */
  autoplaySeconds?: number;
  /** Pause autoplay entirely (extension; the look originally always rotated). */
  autoRotate?: boolean;
  /**
   * Compact style: ON → rotating ticker (one message at a time).
   * OFF → all messages side by side (equal-width columns). @default true
   */
  compactStyle?: boolean;
  /** Master sticky toggle. @default false */
  sticky?: boolean;
  /** Pin at widths ≤1023px (needs `sticky`). @default false */
  stickyMobile?: boolean;
  /** Pin at widths ≥1024px (needs `sticky`). @default true */
  stickyDesktop?: boolean;
  /** Bar background. @default #edebe7 */
  backgroundColor?: string;
  /** Bar text color. @default #2a3743 */
  textColor?: string;
  /** Bottom border color. @default #e0dfdf */
  borderColor?: string;

  /* ---- Extensions (the source hardcoded these) ---- */
  /** Text scale: small 0.9× · medium 1× (original 10.8/12px) · large 1.2×. */
  textSize?: "small" | "medium" | "large";
  /** Slide text alignment. @default center */
  textAlign?: "left" | "center" | "right";
  /** Lead-text case. @default uppercase (the look's signature) */
  textCase?: "none" | "uppercase";
  /** Lead letter spacing: tight 1px · normal 2.16px (original) · loose 3.2px. */
  letterSpacing?: "tight" | "normal" | "loose";
  /** Bottom border thickness in px. @default 1 (original) */
  dividerWidth?: number;
  /** Open slide links in a new tab. @default false */
  openInNewTab?: boolean;
  /** Suspend the marquee while hovered. @default false (original) */
  pauseOnHover?: boolean;
  /** Bar block padding in px. @default 10 (original) */
  paddingTop?: number;
  paddingBottom?: number;
}

/** Props for the v3 look — renders ONLY the VM (vm.v3 is its extension). */
export interface AnnouncementTickerProps {
  vm: AnnouncementVM;
  className?: string;
  locale?: string;
}
