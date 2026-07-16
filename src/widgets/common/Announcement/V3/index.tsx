"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import type { AnnouncementTickerProps, AnnouncementTickerSlide } from "./types";
import { resolveLogic } from "../../../_resolve";
import { useAnnouncementRotation } from "../logic";

/**
 * AnnouncementTicker — V3 (marquee bar).
 *
 * Renders ONLY the VM (vm.v3 = its native settings, fully resolved by
 * logic.ts). Rotation state comes from the section's shared
 * useAnnouncementRotation hook (fork-wrappable via
 * "Announcement:useAnnouncementRotation"); this look turns each advance into
 * a leftward translateX slide on a track holding the real slides plus a
 * trailing CLONE of the first (300ms ease-out, then a transition-less snap
 * back once the clone is reached — a seamless forward marquee). A
 * visually-hidden pause/play button toggles autoplay. Compact OFF renders
 * every message side by side with no rotation.
 *
 * Structure (two elements, faithfully split): the ROOT is a transparent
 * static block carrying the type scale; the BAR carries the tinted
 * background, 10px block padding and 1px bottom border, and optionally pins
 * per-viewport (sticky master + mobile/desktop flags) with a flow spacer
 * reserving its height.
 */

const SLIDE_MS = 300;
const SLIDE_EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

const PauseIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <rect x="5" y="4" width="3" height="12" fill="currentColor" />
    <rect x="12" y="4" width="3" height="12" fill="currentColor" />
  </svg>
);
const PlayIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path d="M6 4l10 6-10 6V4z" fill="currentColor" />
  </svg>
);

/** Text-scale buckets (medium = the original 10.8/12px pair). */
const SCALE: Record<string, number> = { small: 0.9, medium: 1, large: 1.2 };
const LEAD_SPACING: Record<string, string> = {
  tight: "1px",
  normal: "2.16px",
  loose: "3.2px",
};

/** Section-level slide styling (extensions with the original defaults). */
interface TickerText {
  scale: number;
  align: "left" | "center" | "right";
  uppercase: boolean;
  leadSpacing: string;
  newTab: boolean;
}

function SlideContent({
  slide,
  text,
}: {
  slide: AnnouncementTickerSlide;
  text: TickerText;
}) {
  return (
    <>
      {/* base (≤768): block (stacked) → inline (≥769) */}
      <span
        className={`block font-[700] min-[769px]:inline ${text.uppercase ? "uppercase" : ""}`}
        style={{
          fontSize: `${10.8 * text.scale}px`,
          lineHeight: `${15.12 * text.scale}px`,
          letterSpacing: text.leadSpacing,
        }}
      >
        {slide.Heading}
      </span>
      {slide.Text ? (
        <span
          className="block font-[400] min-[769px]:inline min-[769px]:pl-[5px]"
          style={{
            fontSize: `${12 * text.scale}px`,
            lineHeight: `${16.8 * text.scale}px`,
            letterSpacing: "0.4px",
          }}
        >
          {slide.Text}
        </span>
      ) : null}
    </>
  );
}

function Slide({
  slide,
  text,
}: {
  slide: AnnouncementTickerSlide;
  text: TickerText;
}) {
  const inner = <SlideContent slide={slide} text={text} />;
  return (
    <div
      className="w-full shrink-0 px-[5px]"
      style={{ textAlign: text.align }}
      data-testid="announcement-message"
    >
      {slide.Link ? (
        <a
          href={slide.Link}
          target={text.newTab ? "_blank" : undefined}
          rel={text.newTab ? "noopener noreferrer" : undefined}
          className="text-current no-underline hover:text-current"
          data-testid="announcement-link"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}

export const V3 = memo(function V3({ vm, className }: AnnouncementTickerProps) {
  const s = vm.v3 ?? {};
  const slides = s.slides ?? [];
  const single = slides.length <= 1;
  const compact = s.compactStyle ?? true;

  const useRotation = resolveLogic(
    "Announcement:useAnnouncementRotation",
    useAnnouncementRotation
  );
  const rotation = useRotation({
    count: slides.length,
    intervalSeconds: s.autoplaySeconds ?? 5,
    autoRotate: (s.autoRotate ?? true) && compact && !single,
  });

  // Track position: advances one slot per hook index change; when it reaches
  // the trailing clone (pos === N), snap back (no transition) to slide 0.
  const [pos, setPos] = useState(0);
  const [animate, setAnimate] = useState(true);
  const prevIndex = useRef(rotation.index);
  useEffect(() => {
    if (rotation.index === prevIndex.current) {
      return;
    }
    prevIndex.current = rotation.index;
    setAnimate(!rotation.reducedMotion);
    setPos((p) => p + 1);
  }, [rotation.index, rotation.reducedMotion]);
  useEffect(() => {
    if (single || pos !== slides.length) {
      return;
    }
    const id = window.setTimeout(() => {
      setAnimate(false);
      setPos(0);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimate(true))
      );
    }, SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [pos, single, slides.length]);

  const sticky = s.sticky ?? false;
  const stickyEnabled =
    sticky && ((s.stickyMobile ?? false) || (s.stickyDesktop ?? true));

  // Pin ON SCROLL, not always: the source look pinned unconditionally because
  // its bar was the topmost page element (where both behaviors are identical).
  // As a placeable section, unconditional `fixed` would teleport the bar to
  // the viewport top and leave a blank hole in the flow. A zero-height
  // sentinel marks the section's natural position; the bar pins only once
  // that position scrolls past the viewport top (and unpins on the way back).
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    if (!stickyEnabled || !sentinelRef.current) {
      setPinned(false);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) =>
        setPinned(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [stickyEnabled]);

  if (slides.length === 0) {
    return null;
  }

  const fixedMobile = pinned && sticky && (s.stickyMobile ?? false);
  const fixedDesktop = pinned && sticky && (s.stickyDesktop ?? true);

  const text: TickerText = {
    scale: SCALE[s.textSize ?? "medium"] ?? 1,
    align: s.textAlign ?? "center",
    uppercase: (s.textCase ?? "uppercase") === "uppercase",
    leadSpacing: LEAD_SPACING[s.letterSpacing ?? "normal"],
    newTab: s.openInNewTab ?? false,
  };
  const pauseOnHover = s.pauseOnHover ?? false;

  const track = single ? slides : [...slides, slides[0]];

  return (
    <section
      className={[
        // ROOT: transparent static block carrying the type scale
        // (15px/21px ≤768 → 16px/22.4px ≥769); the bar below carries the color.
        "static block w-full bg-transparent p-0",
        "text-[15px] leading-[21px] tracking-[0.4px] min-[769px]:text-[16px] min-[769px]:leading-[22.4px]",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ fontFamily: "var(--font-body--family, inherit)" }}
      aria-label="Announcement"
      data-testid="announcement"
    >
      {/* Zero-height sentinel at the section's natural position — drives the
          pin-on-scroll IntersectionObserver. */}
      <div ref={sentinelRef} aria-hidden="true" className="h-0 w-full" />
      <div
        className={[
          "block w-full border-b border-solid",
          "relative",
          // z-[100]: a pinned announcement must clear the host's sticky
          // chrome (headers commonly sit at z-40/50).
          fixedMobile
            ? "max-[1023px]:fixed max-[1023px]:left-0 max-[1023px]:right-0 max-[1023px]:top-0 max-[1023px]:z-[100]"
            : "",
          fixedDesktop
            ? "min-[1024px]:fixed min-[1024px]:left-0 min-[1024px]:right-0 min-[1024px]:top-0 min-[1024px]:z-[100]"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          backgroundColor: s.backgroundColor ?? "#edebe7",
          color: s.textColor ?? "#2a3743",
          borderBottomColor: s.borderColor ?? "#e0dfdf",
          borderBottomWidth: `${s.dividerWidth ?? 1}px`,
          paddingTop: `${s.paddingTop ?? 10}px`,
          paddingBottom: `${s.paddingBottom ?? 10}px`,
        }}
        data-block-count={slides.length}
        onMouseEnter={pauseOnHover ? () => rotation.setPaused(true) : undefined}
        onMouseLeave={
          pauseOnHover ? () => rotation.setPaused(false) : undefined
        }
      >
        <div className="w-full px-[17px] min-[769px]:px-[40px]">
          {!compact ? (
            // Side-by-side: every message in equal-width columns.
            <div className="flex w-full items-center">
              {slides.map((slide, i) => (
                <div
                  key={`${slide.Heading}-${i}`}
                  className="min-w-0 flex-1 px-[5px]"
                  style={{ textAlign: text.align }}
                >
                  <SlideContent slide={slide} text={text} />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              {!single ? (
                <button
                  type="button"
                  onClick={() => rotation.setPaused(!rotation.paused)}
                  aria-live="polite"
                  aria-label={
                    rotation.paused
                      ? "Play announcements"
                      : "Pause announcements"
                  }
                  data-testid="announcement-pause"
                  className="absolute -m-px h-px w-px overflow-hidden border-0 p-0 [clip:rect(0,0,0,0)]"
                >
                  {rotation.paused ? (
                    <PlayIcon className="inline-block h-[20px] w-[20px]" />
                  ) : (
                    <PauseIcon className="inline-block h-[20px] w-[20px]" />
                  )}
                </button>
              ) : null}

              <div className="relative w-full overflow-hidden" aria-live="off">
                {single ? (
                  <Slide slide={slides[0]} text={text} />
                ) : (
                  <div
                    className="flex w-full will-change-transform motion-reduce:!transition-none"
                    style={{
                      transform: `translateX(-${pos * 100}%)`,
                      transition: animate
                        ? `transform ${SLIDE_MS}ms ${SLIDE_EASE}`
                        : "none",
                    }}
                  >
                    {track.map((slide, i) => (
                      <Slide
                        key={`${slide.Heading}-${i}`}
                        slide={slide}
                        text={text}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Flow spacer while pinned — reserves the bar's height per viewport. */}
      {fixedMobile || fixedDesktop ? (
        <div
          aria-hidden="true"
          className={[
            fixedMobile ? "max-[1023px]:h-[53px]" : "max-[1023px]:h-0",
            fixedDesktop ? "min-[1024px]:h-[38px]" : "min-[1024px]:h-0",
          ].join(" ")}
        />
      ) : null}
    </section>
  );
});

export { V3 as default };
