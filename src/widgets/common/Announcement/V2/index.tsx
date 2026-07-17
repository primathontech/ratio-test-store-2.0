"use client";

import React, { memo } from "react";
import type { AnnouncementFadeProps, AnnouncementFadeItem } from "./types";
import { resolveLogic } from "../../../_resolve";
import { useAnnouncementRotation } from "../logic";
import { schemeColorVars } from "../_shared/scheme-vars";
import "./style.css";

/**
 * AnnouncementFade — V2 (crossfade bar).
 *
 * Renders ONLY the VM (vm.v2 = its native settings, fully resolved by
 * logic.ts). Rotation state comes from the section's shared
 * useAnnouncementRotation hook (fork-wrappable via
 * "Announcement:useAnnouncementRotation"); this look renders ALL slides
 * stacked and crossfades via aria-hidden opacity (0.5s), pauses on
 * hover/focus, and adds chevron prev/next arrows. A single message renders
 * statically with no rotation chrome.
 */

const LETTER_SPACING: Record<string, string> = {
  tight: "-0.02em",
  normal: "normal",
  loose: "0.1em",
};

/** Strip HTML for the empty-message guard and link labels. */
const stripHtml = (html: string | undefined): string =>
  (html ?? "").replace(/<[^>]*>/g, "").trim();

/** Bulk text-size buckets (a message's own `font_size` wins). */
const TEXT_SIZE: Record<string, string> = {
  small: "12px",
  medium: "var(--font-paragraph--size, 0.875rem)",
  large: "16px",
};

/** Bulk section-level typography defaults (extensions). */
interface BulkTypography {
  size?: "small" | "medium" | "large";
  case?: "none" | "uppercase";
  spacing?: "tight" | "normal" | "loose";
  align?: "left" | "center" | "right";
}

/** Per-message typography — the message's own values win over the bulk. */
function typographyStyle(
  item: AnnouncementFadeItem,
  bulk: BulkTypography
): React.CSSProperties {
  const style: React.CSSProperties = {
    fontSize:
      item.font_size || (bulk.size ? TEXT_SIZE[bulk.size] : TEXT_SIZE.medium),
    letterSpacing:
      LETTER_SPACING[item.letter_spacing ?? bulk.spacing ?? "normal"],
    textTransform:
      (item.case ?? bulk.case) === "uppercase" ? "uppercase" : undefined,
    textAlign: bulk.align,
  };
  if (item.weight) {
    style.fontWeight = Number(item.weight) || undefined;
  }
  return style;
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12.5 4.5 7 10l5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.5 4.5 13 10l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A single slide — rich text plus an optional link covering the slide. */
function Slide({
  item,
  active,
  bulk,
  newTab,
}: {
  item: AnnouncementFadeItem;
  active: boolean;
  bulk: BulkTypography;
  newTab: boolean;
}) {
  const label = stripHtml(item.text);
  return (
    <div
      className="cs-announcement-v2__slide"
      style={typographyStyle(item, bulk)}
      aria-hidden={active ? undefined : true}
      data-testid="announcement-message"
    >
      <p
        className="cs-announcement-v2__text"
        // Inline rich-text authored in the editor — intentional HTML injection.
        // eslint-disable-next-line react/no-danger, no-restricted-syntax
        dangerouslySetInnerHTML={{ __html: item.text ?? "" }}
      />
      {item.link ? (
        <a
          href={item.link}
          target={newTab ? "_blank" : undefined}
          rel={newTab ? "noopener noreferrer" : undefined}
          className="cs-announcement-v2__link"
          aria-label={label}
          data-testid="announcement-link"
        >
          <span className="cs-announcement-v2__visually-hidden">{label}</span>
        </a>
      ) : null}
    </div>
  );
}

export const V2 = memo(function V2({ vm, className }: AnnouncementFadeProps) {
  const s = vm.v2 ?? {};
  const announcements = (s.announcements ?? []).filter((a) =>
    stripHtml(a.text)
  );
  const multiple = announcements.length > 1;

  const useRotation = resolveLogic(
    "Announcement:useAnnouncementRotation",
    useAnnouncementRotation
  );
  const rotation = useRotation({
    count: announcements.length,
    intervalSeconds: s.speed ?? 5,
    autoRotate: (s.auto_rotate ?? true) && multiple,
  });

  if (announcements.length === 0) {
    return null;
  }

  const bulk: BulkTypography = {
    size: s.text_size,
    case: s.text_case,
    spacing: s.letter_spacing_all,
    align: s.text_align,
  };
  const newTab = s.open_in_new_tab ?? false;
  const showArrows = s.show_arrows ?? true;
  const pauseOnHover = s.pause_on_hover ?? true; // the look's original behavior

  const vars: Record<string, string> = {
    ...schemeColorVars(s.color_scheme),
    "--cs-announcement-v2-divider-width": `${s.divider_width ?? 0}px`,
  };
  if (s.background_color) {
    vars["--cs-announcement-v2-bg"] = s.background_color;
  }
  if (s.text_color) {
    vars["--cs-announcement-v2-text"] = s.text_color;
  }
  if (s.divider_color) {
    vars["--cs-announcement-v2-divider"] = s.divider_color;
  }

  const rootClass = [
    "cs-announcement-v2",
    s.section_width === "full-width"
      ? "cs-announcement-v2--full-width"
      : "cs-announcement-v2--page-width",
    // "text" hugs the arrows around the slide; default spreads to the edges.
    s.arrow_position === "text" ? "cs-announcement-v2--arrows-text" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside
      className={rootClass}
      style={
        {
          ...vars,
          paddingBlockStart: `${s["padding-block-start"] ?? 15}px`,
          paddingBlockEnd: `${s["padding-block-end"] ?? 15}px`,
        } as React.CSSProperties
      }
      aria-label="Announcements"
      data-testid="announcement"
    >
      {multiple ? (
        <div
          className="cs-announcement-v2__slider"
          onMouseEnter={
            pauseOnHover ? () => rotation.setPaused(true) : undefined
          }
          onMouseLeave={
            pauseOnHover ? () => rotation.setPaused(false) : undefined
          }
          onFocusCapture={
            pauseOnHover ? () => rotation.setPaused(true) : undefined
          }
          onBlurCapture={
            pauseOnHover ? () => rotation.setPaused(false) : undefined
          }
        >
          {showArrows ? (
            <button
              type="button"
              className="cs-announcement-v2__arrow"
              aria-label="Previous announcement"
              data-testid="announcement-prev"
              onClick={rotation.prev}
            >
              <ChevronLeft />
            </button>
          ) : null}

          <div className="cs-announcement-v2__slides" aria-live="polite">
            {announcements.map((item, i) => (
              <Slide
                key={item.id ?? i}
                item={item}
                active={i === rotation.index}
                bulk={bulk}
                newTab={newTab}
              />
            ))}
          </div>

          {showArrows ? (
            <button
              type="button"
              className="cs-announcement-v2__arrow"
              aria-label="Next announcement"
              data-testid="announcement-next"
              onClick={rotation.next}
            >
              <ChevronRight />
            </button>
          ) : null}
        </div>
      ) : (
        <div className="cs-announcement-v2__slider">
          <div className="cs-announcement-v2__slides">
            <Slide item={announcements[0]} active bulk={bulk} newTab={newTab} />
          </div>
        </div>
      )}
    </aside>
  );
});

export { V2 as default };
