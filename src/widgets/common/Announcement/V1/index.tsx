"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import type { AnnouncementBasicProps } from "./types";
import { resolveLogic } from "../../../_resolve";
import { useAnnouncementRotation } from "../logic";
import { schemeColorVars } from "../_shared/scheme-vars";
import "./style.css";

/**
 * AnnouncementBasic — V1 (minimal centered bar).
 *
 * Renders ONLY the VM (vm.v1 = its native settings, fully resolved by
 * logic.ts). Rotation state comes from the section's shared
 * useAnnouncementRotation hook (fork-wrappable via
 * "Announcement:useAnnouncementRotation"); this look adds manual prev/next
 * carets and a slide ±15px + fade entrance (0.25s) per move. 1 message =
 * static, zero rotation chrome. Typography extensions default to the look's
 * original values (13px / 1px tracking / no transform / centered).
 */

/** Message size buckets → the look's scale (medium = the original 12/13px). */
const TEXT_SIZE: Record<string, { mobile: string; desktop: string }> = {
  small: { mobile: "11px", desktop: "12px" },
  medium: { mobile: "12px", desktop: "13px" },
  large: { mobile: "14px", desktop: "15px" },
};

const LETTER_SPACING: Record<string, string> = {
  tight: "0.5px",
  normal: "1px",
  loose: "2px",
};

/** Inline arrow icon shown when a message has a link. */
const ArrowIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 14 10"
    fill="none"
    className="ml-[8px] h-[10px] w-[14px] shrink-0"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.537.808a.5.5 0 0 1 .817-.162l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 1 1-.708-.708L11.793 5.5H1a.5.5 0 0 1 0-1h10.793L8.646 1.354a.5.5 0 0 1-.109-.546Z"
      fill="currentColor"
    />
  </svg>
);

/** Caret used by the prev/next controls. */
const CaretIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 10 6"
    className="h-[6px] w-[10px]"
    fill="none"
  >
    <path
      d="M9.354.646a.5.5 0 0 0-.708 0L5 4.293 1.354.646A.5.5 0 0 0 .646 1.354l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708Z"
      fill="currentColor"
    />
  </svg>
);

const Message = ({
  title,
  text,
  link,
  style,
  newTab,
}: {
  title?: string;
  text: string;
  link?: string;
  style: React.CSSProperties;
  newTab: boolean;
}) => {
  // A title means the stacked (two-line) layout: bold lead over lighter text.
  const inner = title ? (
    <p
      className="m-0 inline-flex flex-col items-center justify-center px-0 font-normal"
      style={style}
      data-testid="announcement-message"
    >
      <span className="inline-flex items-center" style={{ fontWeight: 600 }}>
        {title}
        {link ? <ArrowIcon /> : null}
      </span>
      <span style={{ fontSize: "0.92em", opacity: 0.8 }}>{text}</span>
    </p>
  ) : (
    <p
      className="m-0 inline-flex items-center justify-center px-0 font-normal"
      style={style}
      data-testid="announcement-message"
    >
      <span>{text}</span>
      {link ? <ArrowIcon /> : null}
    </p>
  );

  if (link) {
    return (
      <a
        href={link}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        data-testid="announcement-link"
        className="inline-flex items-center justify-center no-underline transition-[text-decoration] hover:underline"
        style={{ color: "inherit" }}
      >
        {inner}
      </a>
    );
  }
  return inner;
};

export const V1 = memo(function V1({ vm, className }: AnnouncementBasicProps) {
  const s = vm.v1 ?? {};
  const announcements = s.announcements ?? [];
  const isCarousel = announcements.length > 1;

  const useRotation = resolveLogic(
    "Announcement:useAnnouncementRotation",
    useAnnouncementRotation
  );
  const rotation = useRotation({
    count: announcements.length,
    intervalSeconds: s.changeSlidesSpeed ?? 5,
    autoRotate: (s.autoRotate ?? false) && isCarousel,
  });

  // Slide-in animation class per move (the hook owns WHICH slide is active;
  // this look owns HOW it enters).
  const [animClass, setAnimClass] = useState("");
  const animTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevIndex = useRef(rotation.index);
  useEffect(() => {
    if (rotation.index === prevIndex.current) {
      return;
    }
    prevIndex.current = rotation.index;
    if (rotation.reducedMotion) {
      return;
    }
    setAnimClass(
      rotation.direction === "previous"
        ? "cs-announcement-v1-slide--in-previous"
        : "cs-announcement-v1-slide--in-next"
    );
    if (animTimer.current) {
      clearTimeout(animTimer.current);
    }
    animTimer.current = setTimeout(() => setAnimClass(""), 260);
  }, [rotation.index, rotation.direction, rotation.reducedMotion]);
  useEffect(
    () => () => {
      if (animTimer.current) {
        clearTimeout(animTimer.current);
      }
    },
    []
  );

  const size = TEXT_SIZE[s.textSize ?? "medium"] ?? TEXT_SIZE.medium;
  const messageStyle: React.CSSProperties = {
    fontFamily: "var(--font-body--family)",
    // Original scale: 12px @mobile / 13px @desktop. Single computed size keeps
    // the extension simple; the medium default matches desktop-original.
    fontSize: size.desktop,
    lineHeight: 1.3,
    letterSpacing: LETTER_SPACING[s.letterSpacing ?? "normal"],
    textTransform: s.textCase === "uppercase" ? "uppercase" : undefined,
    paddingTop: `${s.paddingTop ?? 10}px`,
    paddingBottom: `${s.paddingBottom ?? 10}px`,
  };

  const align = s.textAlign ?? "center";
  const justify =
    align === "left"
      ? "justify-start"
      : align === "right"
        ? "justify-end"
        : "justify-center";

  const showArrows = s.showArrows ?? true;
  // "edges" (original) spreads the carets to the bar edges; "text" hugs them
  // around the message.
  const arrowsAtEdges = (s.arrowPosition ?? "edges") !== "text";
  const pauseOnHover = s.pauseOnHover ?? false;
  const dividerColor =
    s.dividerColor ||
    "color-mix(in srgb, var(--color-foreground) 8%, transparent)";

  return (
    <div
      data-testid="announcement"
      role="region"
      aria-label="Announcement"
      className={["w-full", className ?? ""].filter(Boolean).join(" ")}
      style={{
        ...schemeColorVars(s.colorScheme),
        backgroundColor: s.backgroundColor || "var(--color-background)",
        color: s.textColor || "var(--color-foreground)",
        borderBottom:
          (s.showLineSeparator ?? true)
            ? `${s.dividerWidth ?? 1}px solid ${dividerColor}`
            : undefined,
      }}
      onMouseEnter={pauseOnHover ? () => rotation.setPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => rotation.setPaused(false) : undefined}
    >
      <div
        className={`mx-auto flex min-h-[38px] w-full max-w-[1200px] items-center ${justify} px-[30px] md:px-[32px] lg:px-[50px]`}
      >
        {!isCarousel ? (
          announcements[0] ? (
            <Message
              title={announcements[0].title}
              text={announcements[0].text ?? ""}
              link={announcements[0].link}
              style={messageStyle}
              newTab={s.openInNewTab ?? false}
            />
          ) : null
        ) : (
          <div
            className={`flex ${arrowsAtEdges ? "w-full" : ""} items-center ${justify} gap-[8px]`}
          >
            {showArrows ? (
              <button
                type="button"
                aria-label="Previous announcement"
                data-testid="announcement-prev"
                onClick={rotation.prev}
                className="flex h-[44px] w-[44px] shrink-0 rotate-90 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
                style={{ color: "inherit" }}
              >
                <CaretIcon />
              </button>
            ) : null}

            <div
              className={`flex min-w-0 ${showArrows && arrowsAtEdges ? "flex-1" : ""} items-center ${justify} overflow-hidden`}
            >
              <div
                key={rotation.index}
                className={`flex items-center justify-center ${animClass}`}
              >
                <Message
                  title={announcements[rotation.index]?.title}
                  text={announcements[rotation.index]?.text ?? ""}
                  link={announcements[rotation.index]?.link}
                  style={messageStyle}
                  newTab={s.openInNewTab ?? false}
                />
              </div>
            </div>

            {showArrows ? (
              <button
                type="button"
                aria-label="Next announcement"
                data-testid="announcement-next"
                onClick={rotation.next}
                className="flex h-[44px] w-[44px] shrink-0 -rotate-90 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
                style={{ color: "inherit" }}
              >
                <CaretIcon />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
});

export { V1 as default };
