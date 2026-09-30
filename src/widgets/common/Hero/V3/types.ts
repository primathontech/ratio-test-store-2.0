import type { HeroVM } from "../contract";

/**
 * HeroVideo (v3) — "Video" hero section clone (homepage section).
 *
 * Full-bleed section (650px desktop / 422.5px mobile) with an AMBIENT YouTube
 * background video (`kAaV5gfdsG0`, autoplay/mute/loop/playsInline, NO controls),
 * overlaid centered heading + subtitle + "Explore the lookbook" CTA (entrance
 * animations: heading/subtitle rise-up, CTA fade-in).
 *
 * The live DOM has NO play button and NO modal/lightbox on the video itself —
 * its only interactive child is the "Explore the lookbook" CTA.
 *
 * Purely static content (no dataSource). Every value is editor-driven: the widget
 * reads each field off `settings` (the editor source of truth, populated from
 * en.json via `t:` keys) and falls back to the defaults in data.ts.
 */

/** Widget settings (editor-configured, flat). Each field falls back to data.ts. */
export interface HeroVideoSettings {
  /** @default 'v1' */
  variant?: string;
  /** Heading — Host Grotesk 500, 60px desktop / 30px mobile, white. */
  heading?: string;
  /** Heading font size (px, desktop). Mobile auto-scales to half (60→30). */
  headingSize?: string | number;
  /** Heading color (default white). */
  headingColor?: string;
  /** Subtitle — Fustat 400, 21px, white. */
  subtitle?: string;
  /** Subtitle color (default white). */
  subtitleColor?: string;
  /** CTA label — "Explore the lookbook". */
  ctaText?: string;
  /** Button link: a normal page link redirects; a YouTube URL opens an in-page player. */
  ctaHref?: string;
  /**
   * Ambient BACKGROUND video — a YouTube URL (full watch/share/embed URL) or a bare
   * video id. Autoplay/mute/loop/no-controls. Live: `kAaV5gfdsG0`.
   */
  backgroundVideoId?: string;
  /** Title attr for the iframe (accessibility). */
  videoTitle?: string;
  /** Text placement: `middle-left|center|right` | `bottom-left|center|right`. */
  textAlignment?: string;
  /** Text-protection black overlay opacity (0–100). 0 → none. */
  overlayOpacity?: string | number;
  /** Section height (desktop): `450|550|650|750` (px) or `full` (100vh). */
  desktopHeight?: string | number;
  /** Section height (mobile): `250|300|400|500` (px) or `full` (100vh). */
  mobileHeight?: string | number;
  /** CTA background — live inline `#edebe7 !important`. */
  ctaBackground?: string;
  /** CTA text color — live `#000`. */
  ctaTextColor?: string;
  /** Section base background behind the video — live `#ffffff`. */
  sectionBackground?: string;
  /** Subtitle scale override — library extension (default = 21px). */
  textSize?: "small" | "medium" | "large";
  /** Heading case override — library extension. */
  headingCase?: "none" | "uppercase";
  /** Heading letter-spacing override — library extension. */
  headingSpacing?: "tight" | "normal" | "wide";
  /** Content block max-width px (0 = uncapped) — library extension. */
  contentMaxWidth?: number;
}

/** No dataSource — this is a purely static section. */
export interface HeroVideoData {
  [key: string]: unknown;
}

/**
 * Props for the video hero (v3) variant — renders ONLY the VM.
 * Its typed extension (vm.v3) is this file's HeroVideoSettings.
 */
export interface HeroVideoProps {
  vm: HeroVM;
  className?: string;
  locale?: string;
}
