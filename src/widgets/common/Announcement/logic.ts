/**
 * Announcement logic — the section's single logic entry (PRD §5.1).
 *
 * buildAnnouncementVM(data, settings) → AnnouncementVM:
 *   - vm.shared     semantic, variant-agnostic resolution of the shared
 *                   editor-facing settings (contract.ts settingsSchema)
 *   - vm.v1/v2/v3   the selected variant's typed extension = its faithful
 *                   native settings interface (design decision D2/approach A),
 *                   built from the shared fields + native-key passthrough
 *                   (native values win over generated ones)
 *
 * ALL THREE looks are stateful (rotating messages), so alongside the pure,
 * server-safe builder this file exports ONE shared rotation state machine —
 * useAnnouncementRotation — that every variant consumes; only the motion
 * styling (slide/crossfade/marquee) lives per variant. Merchant forks can
 * wrap EITHER seam via widgets/_overrides.ts:
 *   - "Announcement"                          → wrap buildAnnouncementVM
 *   - "Announcement:useAnnouncementRotation"  → wrap the hook (analytics on
 *     rotate, custom cadence, …) — decorating pattern, pin `typeof`.
 */
import { useCallback, useEffect, useState } from "react";
import type {
  AnnouncementSharedSettings,
  AnnouncementVM,
  AnnouncementVMShared,
  AnnouncementMessage,
} from "./contract";
import type { AnnouncementData } from "./types";
import type {
  AnnouncementBasicSettings,
  AnnouncementBasicMessage,
} from "./V1/types";
import type {
  AnnouncementFadeSettings,
  AnnouncementFadeItem,
} from "./V2/types";
import type {
  AnnouncementTickerSettings,
  AnnouncementTickerSlide,
} from "./V3/types";
import { V1_SAMPLE_MESSAGES } from "./V1/sample-data";
import { V2_SAMPLE_ITEMS } from "./V2/sample-data";
import { V3_SAMPLE_SLIDES } from "./V3/sample-data";
import { SAMPLE_MESSAGES } from "./_shared/sample-messages";

const SHARED_KEYS = [
  "variant",
  "colorScheme",
  "messages",
  "openInNewTab",
  "autoRotate",
  "rotationSpeed",
  "pauseOnHover",
  "showArrows",
  "arrowPosition",
  "messageLayout",
  "displayMode",
  "textSize",
  "textAlign",
  "textCase",
  "letterSpacing",
  "sectionWidth",
  "sticky",
  "stickyMobile",
  "stickyDesktop",
  "backgroundColor",
  "textColor",
  "dividers",
  "dividerColor",
  "dividerWidth",
  "paddingTop",
  "paddingBottom",
] as const;

/** Drop undefined values so variant-internal fallbacks still apply. */
const compact = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

/** "default" (and empty) select values mean "keep the variant's own default". */
const opt = <T extends string>(v: T | undefined): T | undefined =>
  !v || v === "default" ? undefined : v;

const nativeRest = (s: AnnouncementSharedSettings) => {
  const rest: Record<string, unknown> = { ...s };
  for (const k of SHARED_KEYS) {
    delete rest[k];
  }
  return rest;
};

/** Configured messages with content, or null when the merchant has set none. */
const configuredMessages = (
  s: AnnouncementSharedSettings
): AnnouncementMessage[] | null => {
  const items = Array.isArray(s.messages)
    ? s.messages.filter((m) => (m?.title ?? m?.text ?? "").trim().length > 0)
    : [];
  return items.length > 0 ? items : null;
};

/** Single-line rendering of a two-part message (v1's plain-text look). */
const joined = (m: AnnouncementMessage): string =>
  [m.title, m.text].filter(Boolean).join(" — ");

/** "default"|"on"|"off" → boolean|undefined (undefined keeps the variant's). */
const onOff = (v: "default" | "on" | "off" | undefined): boolean | undefined =>
  v === "on" ? true : v === "off" ? false : undefined;

/** Divider thickness: OFF → 0; else the explicit px (undefined keeps native). */
const dividerPx = (s: AnnouncementSharedSettings): number | undefined =>
  s.dividers === false ? 0 : s.dividerWidth;

/* ── v1: minimal bar ───────────────────────────────────────────────────── */
function toV1Ext(s: AnnouncementSharedSettings): AnnouncementBasicSettings {
  const items = configuredMessages(s);
  // Stacked layout keeps title/text separate; otherwise the look's original
  // single joined line ("title — text").
  const stacked = opt(s.messageLayout) === "stacked";
  const announcements: AnnouncementBasicMessage[] = items
    ? items.map((m) =>
        stacked && m.title && m.text
          ? { title: m.title, text: m.text, link: m.link }
          : { text: joined(m), link: m.link }
      )
    : V1_SAMPLE_MESSAGES;
  return {
    ...compact({
      announcements,
      arrowPosition: opt(s.arrowPosition),
      autoRotate: s.autoRotate,
      changeSlidesSpeed: s.rotationSpeed,
      backgroundColor: s.backgroundColor || undefined,
      textColor: s.textColor || undefined,
      showLineSeparator: s.dividers,
      dividerColor: s.dividerColor || undefined,
      dividerWidth: s.dividerWidth,
      colorScheme: s.colorScheme,
      textSize: opt(s.textSize),
      textAlign: opt(s.textAlign),
      textCase: opt(s.textCase),
      letterSpacing: opt(s.letterSpacing),
      showArrows: s.showArrows,
      pauseOnHover: onOff(s.pauseOnHover),
      openInNewTab: s.openInNewTab,
      paddingTop: s.paddingTop,
      paddingBottom: s.paddingBottom,
    }),
    ...nativeRest(s),
  } as AnnouncementBasicSettings;
}

/* ── v2: crossfade slider ──────────────────────────────────────────────── */
function toV2Ext(s: AnnouncementSharedSettings): AnnouncementFadeSettings {
  const items = configuredMessages(s);
  // Stacked layout breaks the two parts onto separate lines; otherwise the
  // look's original single joined line ("title — text").
  const stacked = opt(s.messageLayout) === "stacked";
  const announcements: AnnouncementFadeItem[] = items
    ? items.map((m, i) => ({
        id: `msg-${i}`,
        text: m.title
          ? `<strong>${m.title}</strong>${
              m.text ? `${stacked ? "<br>" : " — "}${m.text}` : ""
            }`
          : (m.text ?? ""),
        link: m.link,
      }))
    : V2_SAMPLE_ITEMS;
  const sectionWidthMap: Record<string, "page-width" | "full-width"> = {
    page: "page-width",
    full: "full-width",
  };
  const sectionWidth = opt(s.sectionWidth);
  return {
    ...compact({
      announcements,
      speed: s.rotationSpeed,
      auto_rotate: s.autoRotate,
      arrow_position: opt(s.arrowPosition),
      section_width: sectionWidth ? sectionWidthMap[sectionWidth] : undefined,
      color_scheme: s.colorScheme,
      divider_width: dividerPx(s) ?? (s.dividers === undefined ? undefined : 1),
      divider_color: s.dividerColor || undefined,
      "padding-block-start": s.paddingTop,
      "padding-block-end": s.paddingBottom,
      background_color: s.backgroundColor || undefined,
      text_color: s.textColor || undefined,
      text_size: opt(s.textSize),
      text_align: opt(s.textAlign),
      text_case: opt(s.textCase),
      letter_spacing_all: opt(s.letterSpacing),
      show_arrows: s.showArrows,
      pause_on_hover: onOff(s.pauseOnHover),
      open_in_new_tab: s.openInNewTab,
    }),
    ...nativeRest(s),
  } as AnnouncementFadeSettings;
}

/* ── v3: marquee ticker ────────────────────────────────────────────────── */
function toV3Ext(s: AnnouncementSharedSettings): AnnouncementTickerSettings {
  const items = configuredMessages(s);
  const slides: AnnouncementTickerSlide[] = items
    ? items.map((m) => ({
        Heading: m.title ?? m.text ?? "",
        Text: m.title ? m.text : undefined,
        Link: m.link,
      }))
    : V3_SAMPLE_SLIDES;
  const displayMode = opt(s.displayMode);
  return {
    ...compact({
      slides,
      autoplaySeconds: s.rotationSpeed,
      autoRotate: s.autoRotate,
      compactStyle: displayMode ? displayMode !== "inline" : undefined,
      sticky: s.sticky,
      stickyMobile: s.stickyMobile,
      stickyDesktop: s.stickyDesktop,
      backgroundColor: s.backgroundColor || undefined,
      textColor: s.textColor || undefined,
      borderColor: s.dividerColor || undefined,
      dividerWidth: dividerPx(s),
      textSize: opt(s.textSize),
      textAlign: opt(s.textAlign),
      textCase: opt(s.textCase),
      letterSpacing: opt(s.letterSpacing),
      openInNewTab: s.openInNewTab,
      pauseOnHover: onOff(s.pauseOnHover),
      paddingTop: s.paddingTop,
      paddingBottom: s.paddingBottom,
    }),
    ...nativeRest(s),
  } as AnnouncementTickerSettings;
}

/* ── shared semantics ──────────────────────────────────────────────────── */
function buildShared(s: AnnouncementSharedSettings): AnnouncementVMShared {
  const items = configuredMessages(s);
  return {
    messages: items ?? SAMPLE_MESSAGES,
    rotation: {
      auto: s.autoRotate !== false,
      intervalSeconds: s.rotationSpeed ?? 5,
      pauseOnHover: onOff(s.pauseOnHover),
      showArrows: s.showArrows !== false,
      arrowPosition: opt(
        s.arrowPosition
      ) as AnnouncementVMShared["rotation"]["arrowPosition"],
    },
    text: {
      size: opt(s.textSize) as AnnouncementVMShared["text"]["size"],
      align: opt(s.textAlign) as AnnouncementVMShared["text"]["align"],
      case: opt(s.textCase) as AnnouncementVMShared["text"]["case"],
      letterSpacing: opt(
        s.letterSpacing
      ) as AnnouncementVMShared["text"]["letterSpacing"],
      layout: opt(s.messageLayout) as AnnouncementVMShared["text"]["layout"],
      openInNewTab: !!s.openInNewTab,
    },
    appearance: {
      colorScheme: s.colorScheme ?? "scheme-1",
      backgroundColor: s.backgroundColor || undefined,
      textColor: s.textColor || undefined,
      dividers: s.dividers !== false,
      dividerColor: s.dividerColor || undefined,
    },
    layout: {
      displayMode: opt(
        s.displayMode
      ) as AnnouncementVMShared["layout"]["displayMode"],
      sectionWidth: opt(
        s.sectionWidth
      ) as AnnouncementVMShared["layout"]["sectionWidth"],
      sticky: !!s.sticky,
      paddingTop: s.paddingTop,
      paddingBottom: s.paddingBottom,
    },
  };
}

/** The section's single logic entry — pure and server-safe. */
export function buildAnnouncementVM(
  _data: AnnouncementData | undefined, // no data source — uniform logic signature
  settings: AnnouncementSharedSettings | undefined
): AnnouncementVM {
  const s = settings ?? {};
  const variant = s.variant === "v2" || s.variant === "v3" ? s.variant : "v1";
  const shared = buildShared(s);
  if (variant === "v2") {
    return { variant, shared, v2: toV2Ext(s) };
  }
  if (variant === "v3") {
    return { variant, shared, v3: toV3Ext(s) };
  }
  return { variant, shared, v1: toV1Ext(s) };
}

/* ── useAnnouncementRotation — the shared stateful seam ────────────────── */

export interface AnnouncementRotationOptions {
  /** Number of messages. <2 disables rotation entirely. */
  count: number;
  /** Seconds between automatic advances. */
  intervalSeconds: number;
  /** Whether the timer runs at all (manual prev/next always work). */
  autoRotate: boolean;
}

/** What the hook hands every variant to render rotation from. */
export interface AnnouncementRotation {
  /** Index of the active message. */
  index: number;
  /** Direction of the last move (drives per-variant entrance motion). */
  direction: "next" | "previous";
  next: () => void;
  prev: () => void;
  /** Timer suspension (hover/focus pause, the ticker's pause button). */
  paused: boolean;
  setPaused: (paused: boolean) => void;
  /** prefers-reduced-motion — variants also disable their transitions. */
  reducedMotion: boolean;
}

/**
 * Shared rotation state machine. Client-only (every variant consumes it);
 * the pure builder above stays importable from server code — this hook is
 * only evaluated inside "use client" variants. Respects
 * prefers-reduced-motion by not auto-advancing.
 */
export function useAnnouncementRotation(
  options: AnnouncementRotationOptions
): AnnouncementRotation {
  const { count, intervalSeconds, autoRotate } = options;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Clamp when the message list shrinks under the active index.
  useEffect(() => {
    setIndex((current) => (current >= count ? 0 : current));
  }, [count]);

  const next = useCallback(() => {
    if (count < 2) {
      return;
    }
    setDirection("next");
    setIndex((current) => (current + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (count < 2) {
      return;
    }
    setDirection("previous");
    setIndex((current) => (current - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (!autoRotate || count < 2 || paused || reducedMotion) {
      return;
    }
    const id = window.setInterval(next, Math.max(1, intervalSeconds) * 1000);
    return () => window.clearInterval(id);
  }, [autoRotate, count, paused, reducedMotion, intervalSeconds, next]);

  return { index, direction, next, prev, paused, setPaused, reducedMotion };
}
