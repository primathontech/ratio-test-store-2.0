/**
 * Editor settings schema for the common Announcement widget — the SHARED
 * surface.
 *
 * One semantic field set for all variants; logic.ts adapts each field onto
 * the selected variant's native settings. Fields a variant doesn't use are
 * simply ignored by it — labels carry a variant hint where a field is
 * variant-specific, since the editor's DynamicForm has no conditional-field
 * support.
 *
 * Field order = sidebar order (messages → rotation → layout → appearance).
 * Color fields are hex text inputs (the editor has no color picker); empty
 * string = keep the variant's own default.
 *
 * This file is the schema source of truth: app widget-registries import it,
 * so the folder stays the portable unit.
 */
import type { AnnouncementBasicSettings } from "./V1/types";
import type { AnnouncementFadeSettings } from "./V2/types";
import type { AnnouncementTickerSettings } from "./V3/types";
import { SAMPLE_MESSAGES } from "./_shared/sample-messages";

/* ── Shared editor-facing settings (drives settingsSchema below) ────────── */

/** One message — title (bold lead), text, optional link. Flat for the editor. */
export interface AnnouncementMessage {
  /** Bold lead (the ticker look renders it uppercase). Optional. */
  title?: string;
  /** Message text. */
  text?: string;
  /** Optional URL for the message. */
  link?: string;
}

/** The shared, editor-facing settings surface (one field set, all variants). */
export interface AnnouncementSharedSettings {
  variant?: string;
  colorScheme?: string; // scheme-1..5
  messages?: AnnouncementMessage[];
  /** Open message links in a new tab. */
  openInNewTab?: boolean;
  autoRotate?: boolean;
  rotationSpeed?: number; // seconds between slides
  /** Suspend rotation while hovered ("default" = the variant's own behavior). */
  pauseOnHover?: "default" | "on" | "off";
  /** Show the prev/next arrows (v1/v2; the ticker has none). */
  showArrows?: boolean;
  /** Arrow placement: bar edges vs hugging the message (v1/v2). */
  arrowPosition?: "default" | "edges" | "text";
  /** Two-part messages: single joined line vs title stacked above text (v1/v2). */
  messageLayout?: "default" | "inline" | "stacked";
  displayMode?: "default" | "rotate" | "inline"; // v3 compact vs side-by-side
  /* text styling ("default" = keep the variant's original) */
  textSize?: "default" | "small" | "medium" | "large";
  textAlign?: "default" | "left" | "center" | "right";
  textCase?: "default" | "none" | "uppercase";
  letterSpacing?: "default" | "tight" | "normal" | "loose";
  sectionWidth?: "default" | "page" | "full"; // v2
  sticky?: boolean; // v3
  stickyMobile?: boolean; // v3 (needs sticky)
  stickyDesktop?: boolean; // v3 (needs sticky)
  backgroundColor?: string;
  textColor?: string;
  dividers?: boolean;
  dividerColor?: string;
  /** Divider thickness in px. */
  dividerWidth?: number;
  paddingTop?: number; // v2/v3 bar padding
  paddingBottom?: number; // v2/v3 bar padding
  [key: string]: unknown; // native passthrough → routed into the extension
}

/* ── View-model (the stable seam variants render) ──────────────────────── */

export interface AnnouncementVMShared {
  /** Normalized messages (post sample fall-through — never empty). */
  messages: AnnouncementMessage[];
  rotation: {
    auto: boolean;
    intervalSeconds: number;
    pauseOnHover?: boolean;
    showArrows: boolean;
    arrowPosition?: "edges" | "text";
  };
  text: {
    size?: "small" | "medium" | "large";
    align?: "left" | "center" | "right";
    case?: "none" | "uppercase";
    letterSpacing?: "tight" | "normal" | "loose";
    layout?: "inline" | "stacked";
    openInNewTab: boolean;
  };
  appearance: {
    colorScheme: string; // scheme id — variants resolve via schemeColorVars()
    backgroundColor?: string;
    textColor?: string;
    dividers: boolean;
    dividerColor?: string;
  };
  layout: {
    displayMode?: "rotate" | "inline";
    sectionWidth?: "page" | "full";
    sticky: boolean;
    paddingTop?: number;
    paddingBottom?: number;
  };
}

/**
 * The Announcement view-model. Variants receive ONLY this (never raw
 * settings). Typed extensions = each variant's faithful native settings
 * interface (design decision D2/approach A); only the selected variant's
 * slot is set.
 */
export interface AnnouncementVM {
  variant: "v1" | "v2" | "v3";
  shared: AnnouncementVMShared;
  v1?: AnnouncementBasicSettings;
  v2?: AnnouncementFadeSettings;
  v3?: AnnouncementTickerSettings;
}

export const AnnouncementContract = {
  type: "Announcement",
  name: "Announcement Bar",
  description:
    "Common announcement bar — minimal centered bar (v1), crossfade slider (v2), or marquee ticker with sticky option (v3)",
  /** Every data-testid the section renders (normalized across variants). */
  testIds: [
    "announcement",
    "announcement-message",
    "announcement-link",
    "announcement-prev",
    "announcement-next",
    "announcement-pause",
  ] as const,
  /** No block region — messages are settings-driven (objectArray). */
  acceptedBlocks: [] as const,
  /** Fully editor-driven — no data source. */
  data: { required: false } as const,
  settingsSchema: {
    variant: {
      type: "select" as const,
      label: "Widget Variant",
      options: [
        { value: "v1", label: "Version 1 (Minimal Bar)" },
        { value: "v2", label: "Version 2 (Crossfade Slider)" },
        { value: "v3", label: "Version 3 (Marquee Ticker)" },
      ],
      default: "v1",
    },

    /* ── Messages ────────────────────────────────────────────────────── */
    messages: {
      type: "objectArray" as const,
      label: "Messages",
      fields: ["title", "text", "link"],
      default: SAMPLE_MESSAGES,
    },
    openInNewTab: {
      type: "boolean" as const,
      label: "Open Links in New Tab",
      default: false,
    },

    /* ── Rotation ────────────────────────────────────────────────────── */
    autoRotate: {
      type: "boolean" as const,
      label: "Auto-rotate Messages",
      default: true,
    },
    rotationSpeed: {
      type: "number" as const,
      label: "Seconds Between Messages",
      default: 5,
      min: 1,
      max: 15,
      step: 1,
    },
    pauseOnHover: {
      type: "select" as const,
      label: "Pause on Hover",
      options: [
        { value: "default", label: "Variant default" },
        { value: "on", label: "On" },
        { value: "off", label: "Off" },
      ],
      default: "default",
    },
    showArrows: {
      type: "boolean" as const,
      label: "Show Prev/Next Arrows (Minimal Bar, Crossfade Slider)",
      default: true,
    },
    arrowPosition: {
      type: "select" as const,
      label: "Arrow Position (needs Arrows)",
      options: [
        { value: "default", label: "Variant default" },
        { value: "edges", label: "Bar edges" },
        { value: "text", label: "Next to text" },
      ],
      default: "default",
    },
    messageLayout: {
      type: "select" as const,
      label: "Message Layout (title + text)",
      options: [
        { value: "default", label: "Variant default" },
        { value: "inline", label: "Single line" },
        { value: "stacked", label: "Two lines (title above text)" },
      ],
      default: "default",
    },
    displayMode: {
      type: "select" as const,
      label: "Messages Layout (Marquee Ticker)",
      options: [
        { value: "default", label: "Variant default (rotate)" },
        { value: "rotate", label: "Rotate one at a time" },
        { value: "inline", label: "All side by side" },
      ],
      default: "default",
    },

    /* ── Text style ──────────────────────────────────────────────────── */
    textSize: {
      type: "select" as const,
      label: "Text Size",
      options: [
        { value: "default", label: "Variant default" },
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
      default: "default",
    },
    textAlign: {
      type: "select" as const,
      label: "Text Alignment",
      options: [
        { value: "default", label: "Variant default (center)" },
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
      default: "default",
    },
    textCase: {
      type: "select" as const,
      label: "Text Case",
      options: [
        { value: "default", label: "Variant default" },
        { value: "none", label: "Normal" },
        { value: "uppercase", label: "Uppercase" },
      ],
      default: "default",
    },
    letterSpacing: {
      type: "select" as const,
      label: "Letter Spacing",
      options: [
        { value: "default", label: "Variant default" },
        { value: "tight", label: "Tight" },
        { value: "normal", label: "Normal" },
        { value: "loose", label: "Loose" },
      ],
      default: "default",
    },

    /* ── Layout ──────────────────────────────────────────────────────── */
    sectionWidth: {
      type: "select" as const,
      label: "Content Width (Crossfade Slider)",
      options: [
        { value: "default", label: "Variant default" },
        { value: "page", label: "Page width" },
        { value: "full", label: "Full width" },
      ],
      default: "default",
    },
    sticky: {
      type: "boolean" as const,
      label: "Sticky Bar (Marquee Ticker)",
      default: false,
    },
    stickyMobile: {
      type: "boolean" as const,
      label: "Sticky on Mobile (needs Sticky Bar)",
      default: false,
    },
    stickyDesktop: {
      type: "boolean" as const,
      label: "Sticky on Desktop (needs Sticky Bar)",
      default: true,
    },
    paddingTop: {
      type: "number" as const,
      label: "Top Padding (px)",
      default: 15,
    },
    paddingBottom: {
      type: "number" as const,
      label: "Bottom Padding (px)",
      default: 15,
    },

    /* ── Appearance ──────────────────────────────────────────────────── */
    colorScheme: {
      type: "select" as const,
      label: "Color Scheme",
      options: [
        { value: "scheme-1", label: "Scheme 1" },
        { value: "scheme-2", label: "Scheme 2" },
        { value: "scheme-3", label: "Scheme 3" },
        { value: "scheme-4", label: "Scheme 4" },
        { value: "scheme-5", label: "Scheme 5" },
      ],
      default: "scheme-1",
    },
    backgroundColor: {
      type: "text" as const,
      label: "Bar Background (hex, empty = default)",
      placeholder: "#edebe7",
      default: "",
    },
    textColor: {
      type: "text" as const,
      label: "Text Color (hex, empty = default)",
      placeholder: "#2a3743",
      default: "",
    },
    dividers: {
      type: "boolean" as const,
      label: "Bottom Divider",
      default: true,
    },
    dividerColor: {
      type: "text" as const,
      label: "Divider Color (hex, empty = default)",
      placeholder: "#e0dfdf",
      default: "",
    },
    dividerWidth: {
      type: "number" as const,
      label: "Divider Thickness (px)",
      default: 1,
      min: 0,
      max: 8,
      step: 1,
    },
  },
} as const;

export default AnnouncementContract;
