"use client";

import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { LazyLoadShimmerProps } from "../types";

/* ------------------------------------------------------------------ */
/*  V1 -- LazyLoadShimmer (Tailwind)                                   */
/*  Matches bblunt.com `.lazyload-shimmer--home`:                      */
/*    skeleton-products + skeleton-reels + skeleton-newsletter         */
/*    + skeleton-testimonials.                                         */
/*                                                                     */
/*  How the "hide-after-shimmer" trick works:                          */
/*  Each widget on this page is wrapped by the renderer in its own     */
/*  <section>. When this widget mounts we tag its parent section with  */
/*  `ratio-shimmer-host`. A global CSS rule in globals.css then       */
/*  collapses every `section ~ section` that follows. When the         */
/*  IntersectionObserver fires (or reduced-motion fallback), we set    */
/*  `hidden` -> render null, useEffect cleanup strips the class,       */
/*  and the real sections take over.                                   */
/* ------------------------------------------------------------------ */

const PRODUCT_CARD_COUNT = 5;
const REEL_CARD_COUNT = 4;
const TESTIMONIAL_CARD_COUNT = 4;

const HOST_CLASS = "ratio-shimmer-host";

/* Tailwind utility chunks reused across many bars */
const SHIMMER_BASE =
  "relative overflow-hidden bg-[#eaeaea] " +
  "after:content-[''] after:absolute after:inset-0 after:-translate-x-full " +
  "after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] " +
  "after:animate-shimmer motion-reduce:after:hidden";

const SECTION_CARD =
  "bg-white rounded-2xl p-4 shadow-[0_6px_18px_rgba(0,0,0,0.04)]";

/* Use layout effect on the client, no-op on the server. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const V1 = memo(function V1({ settings }: LazyLoadShimmerProps) {
  // Negative top margin: only count as "intersecting" once the shimmer
  // is genuinely inside the viewport, not 200px before. Otherwise the
  // user never sees it animate.
  const rootMarginPx = settings?.rootMarginPx ?? -80;
  const minVisibleMs = settings?.minVisibleMs ?? 700;
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<Element | null>(null);
  const [hidden, setHidden] = useState(false);

  /* Tag the enclosing <section> so the global sibling-hide rule
     kicks in before paint. We hold a ref to the host so we can also
     strip the class once `hidden` flips to true (see effect below) --
     simply returning null from this component does NOT unmount it,
     so we can't rely solely on the cleanup function here. */
  useIsomorphicLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) {
      return;
    }
    const host = el.closest("section");
    if (!host) {
      return;
    }
    hostRef.current = host;
    host.classList.add(HOST_CLASS);
    return () => {
      host.classList.remove(HOST_CLASS);
      hostRef.current = null;
    };
  }, []);

  /* When `hidden` flips, strip the host class so siblings come back.
     V1 stays mounted (parent keeps rendering it) -- the layout-effect
     cleanup above only runs on full unmount, not on hide. */
  useEffect(() => {
    if (hidden && hostRef.current) {
      hostRef.current.classList.remove(HOST_CLASS);
    }
  }, [hidden]);

  /* Hide on first intersection (with rootMargin pre-roll). */
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const el = rootRef.current;
    if (!el) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      // No animation -> no point delaying. Hide quickly.
      const t = setTimeout(() => setHidden(true), 200);
      return () => clearTimeout(t);
    }

    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setHidden(true), minVisibleMs);
      return () => clearTimeout(t);
    }

    let dismissTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && dismissTimer === null) {
            // First time we're in view -- arm the dismiss timer so the
            // user gets at least one full shimmer sweep before content
            // swaps in.
            dismissTimer = setTimeout(() => {
              setHidden(true);
              observer.disconnect();
            }, minVisibleMs);
            break;
          }
        }
      },
      { rootMargin: `${rootMarginPx}px 0px ${rootMarginPx}px 0px` }
    );
    observer.observe(el);
    return () => {
      if (dismissTimer !== null) {
        clearTimeout(dismissTimer);
      }
      observer.disconnect();
    };
  }, [rootMarginPx, minVisibleMs]);

  if (hidden) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="flex flex-col gap-7 py-6 overflow-hidden mt-[25px] md:mt-14"
    >
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 flex flex-col gap-7">
        {/* ── Products skeleton ── */}
        <div className={`${SECTION_CARD} bg-white px-4 py-6`}>
          <div
            className={`${SHIMMER_BASE} w-[45%] h-[18px] rounded-[10px] mx-auto mb-1.5`}
          />
          <div className="flex gap-4 mt-4 mb-5 overflow-hidden">
            {Array.from({ length: PRODUCT_CARD_COUNT }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col bg-white rounded-lg overflow-hidden flex-none w-[calc(50%-12px)] lg:w-[calc(25%-12px)] xl:w-[calc(20%-13px)]"
              >
                <div className={`${SHIMMER_BASE} w-full aspect-[3/4] mb-3`} />
                <div className="flex flex-col gap-2 px-1">
                  <div className={`${SHIMMER_BASE} w-full h-[14px] rounded`} />
                  <div className={`${SHIMMER_BASE} w-[90%] h-3 rounded`} />
                  <div className={`${SHIMMER_BASE} w-[60%] h-2.5 rounded`} />
                  <div className={`${SHIMMER_BASE} w-2/5 h-4 rounded mt-1`} />
                  <div
                    className={`${SHIMMER_BASE} w-full h-10 rounded-lg mt-2`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            className={`${SHIMMER_BASE} w-[200px] h-10 rounded-[20px] mx-auto mt-4`}
          />
        </div>

        {/* ── Reels skeleton (>=768px) ── */}
        <div className={`hidden md:block ${SECTION_CARD} bg-white px-4 py-6`}>
          <div
            className={`${SHIMMER_BASE} w-[45%] h-[18px] rounded-[10px] mx-auto mb-1.5`}
          />
          <div className="grid grid-cols-4 gap-4 mt-4">
            {Array.from({ length: REEL_CARD_COUNT }).map((_, i) => (
              <div
                key={i}
                className="relative aspect-[9/16] rounded-xl overflow-hidden"
              >
                <div className={`${SHIMMER_BASE} w-full h-full`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Newsletter / banner skeleton ── */}
        <div className={`${SECTION_CARD} p-6`}>
          <div
            className={`${SHIMMER_BASE} w-full aspect-[16/7] rounded-xl mb-4`}
          />
          <div
            className={`${SHIMMER_BASE} w-[45%] h-[18px] rounded-[10px] mx-auto mb-1.5`}
          />
          <div className={`${SHIMMER_BASE} w-3/5 h-2.5 rounded-lg mx-auto`} />
        </div>

        {/* ── Testimonials skeleton ── */}
        <div className={SECTION_CARD}>
          <div
            className={`${SHIMMER_BASE} w-[45%] h-[18px] rounded-[10px] mx-auto mb-[18px]`}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: TESTIMONIAL_CARD_COUNT }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2.5 bg-white rounded-xl p-3 items-center text-center"
              >
                <div className={`${SHIMMER_BASE} w-14 h-14 rounded-full`} />
                <div className={`${SHIMMER_BASE} w-full h-2.5 rounded-lg`} />
                <div className={`${SHIMMER_BASE} w-3/5 h-2.5 rounded-lg`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
