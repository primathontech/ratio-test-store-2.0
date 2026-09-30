import type { AnnouncementVM } from "../contract";

/**
 * AnnouncementFade (v2) — crossfade announcement bar look.
 *
 * A slim bar whose messages are inline RICH TEXT with per-message typography
 * (size / weight / letter-spacing / case). One message renders with zero
 * client JS; 2+ crossfade on a timer (hover/focus pauses) with chevron
 * prev/next arrows. Page-width or full-width container, configurable
 * bottom-divider thickness and block padding.
 */

/** One announcement slide (flat — editor objectArray friendly). */
export interface AnnouncementFadeItem {
  id?: string;
  /** Inline rich text (HTML allowed). */
  text?: string;
  /** Optional link covering the whole slide. */
  link?: string;
  /** Font size (CSS size string), "" = body default. */
  font_size?: string;
  /** Font weight ("" = default, else 100..900). */
  weight?: string;
  letter_spacing?: "tight" | "normal" | "loose";
  case?: "none" | "uppercase";
}

/**
 * AnnouncementFade native settings — v2's typed VM extension (vm.v2).
 * `background_color` / `text_color` / `divider_color` are extensions (the
 * source drove colors purely from the scheme; empty keeps the scheme default).
 */
export interface AnnouncementFadeSettings {
  variant?: string;
  /** Autoplay rotation speed in seconds (only when >1 announcement). */
  speed?: number;
  /** Pause autoplay entirely (extension; the look originally always rotated). */
  auto_rotate?: boolean;
  /** Arrow placement: bar edges (original) or hugging the slide text. */
  arrow_position?: "edges" | "text";
  section_width?: "page-width" | "full-width";
  color_scheme?: string;
  /** Bottom divider thickness (px). */
  divider_width?: number;
  "padding-block-start"?: number;
  "padding-block-end"?: number;
  announcements?: AnnouncementFadeItem[];
  /** Bar background (hex). Empty = scheme background. */
  background_color?: string;
  /** Bar text color (hex). Empty = scheme foreground. */
  text_color?: string;
  /** Divider color (hex). Empty = scheme border. */
  divider_color?: string;

  /* ---- Extensions (bulk defaults; a message's own typography wins) ---- */
  /** Text size for messages without their own `font_size`. */
  text_size?: "small" | "medium" | "large";
  /** Alignment of the slide text. @default center */
  text_align?: "left" | "center" | "right";
  /** Case for messages without their own `case`. */
  text_case?: "none" | "uppercase";
  /** Spacing for messages without their own `letter_spacing`. */
  letter_spacing_all?: "tight" | "normal" | "loose";
  /** Show the chevron prev/next arrows (2+ messages). @default true */
  show_arrows?: boolean;
  /** Suspend autoplay while hovered/focused. @default true (original) */
  pause_on_hover?: boolean;
  /** Open message links in a new tab. @default false */
  open_in_new_tab?: boolean;
}

/** Props for the v2 look — renders ONLY the VM (vm.v2 is its extension). */
export interface AnnouncementFadeProps {
  vm: AnnouncementVM;
  className?: string;
  locale?: string;
}
