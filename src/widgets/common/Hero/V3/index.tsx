"use client";

/**
 * Video hero — V1 of the "Video" hero (homepage video section).
 *
 * An ambient YouTube background video (autoplay/mute/loop, no controls) behind a
 * centered heading + subtitle + CTA. Editor-driven ("Video" hero parity):
 * Heading + Heading text size (px), Subtitle, Button text/link/bg, Text alignment
 * (6-position), Background video (YouTube URL), Text-protection overlay, Desktop /
 * Mobile height (presets + Full screen).
 *
 * Button link is dual-mode: a normal page link redirects; a YouTube link opens the
 * video in an in-page lightbox (fixed sibling at the widget root — NO createPortal).
 *
 * Layout = CSS table (table / table-cell) so the content vertical-aligns; the media
 * is an absolute oversized iframe (cover overscan) behind the relative text layer.
 * Composition only: defaults ← data.ts. No `import React`, no module.css, no
 * <img>. Animations motion-reduce-guarded. `lm` = 769px.
 */

import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { HeroVideoProps } from "./types";
import { DEFAULT_HERO_VIDEO } from "./sample-data";
import "./style.css";

/** Extract a YouTube video id from a full URL or a bare id ("" if none). */
function youTubeId(input: string): string {
  const s = (input ?? "").trim();
  if (!s) {
    return "";
  }
  // Bare id (no slashes/dots) → use as-is.
  if (!/[/.]/.test(s)) {
    return s;
  }
  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return u.pathname.slice(1);
    }
    if (host.endsWith("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.split("/")[2] ?? "";
      }
      return u.searchParams.get("v") ?? "";
    }
    return "";
  } catch {
    return "";
  }
}

/** Section height value → CSS length ("full" → 100vh, else px). */
function heightCss(
  value: string | number | undefined,
  fallback: string
): string {
  const s = String(value ?? "").trim();
  if (!s) {
    return `${fallback}px`;
  }
  if (s.toLowerCase() === "full") {
    return "100vh";
  }
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : `${fallback}px`;
}

export const V3 = memo(function V3({ vm, className }: HeroVideoProps) {
  const settings = vm.v3; // the VM seam: body below reads only the extension
  const [mounted, setMounted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const bgIframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Settings (editor) over data.ts defaults ──
  const heading = settings?.heading ?? DEFAULT_HERO_VIDEO.heading;
  const subtitle = settings?.subtitle ?? DEFAULT_HERO_VIDEO.subtitle;
  const ctaText = settings?.ctaText ?? DEFAULT_HERO_VIDEO.ctaText;
  const ctaHref = settings?.ctaHref ?? DEFAULT_HERO_VIDEO.ctaHref;
  const videoTitle = settings?.videoTitle ?? DEFAULT_HERO_VIDEO.videoTitle;
  const ctaBackground =
    settings?.ctaBackground ?? DEFAULT_HERO_VIDEO.ctaBackground;
  const ctaTextColor =
    settings?.ctaTextColor ?? DEFAULT_HERO_VIDEO.ctaTextColor;
  const sectionBackground =
    settings?.sectionBackground ?? DEFAULT_HERO_VIDEO.sectionBackground;

  // Heading size (px) — desktop = value, mobile auto-scales to half (clone 60→30).
  const headingPx = Number.parseFloat(
    String(settings?.headingSize ?? DEFAULT_HERO_VIDEO.headingSize)
  );
  const headingDesktop =
    Number.isFinite(headingPx) && headingPx > 0 ? headingPx : 60;
  const headingMobile = Math.round(headingDesktop / 2);

  // Library-extension overrides (shared headingCase/headingSpacing/textSize/
  // contentWidth) — undefined keeps the look's original values.
  const headingSpacing = settings?.headingSpacing
    ? { tight: "-0.5px", normal: "0", wide: "4px" }[settings.headingSpacing]
    : undefined;
  const subtitleSize = settings?.textSize
    ? { small: "17px", medium: "21px", large: "25px" }[settings.textSize]
    : undefined;
  const contentMaxWidth =
    settings?.contentMaxWidth === undefined
      ? undefined
      : settings.contentMaxWidth === 0
        ? "none"
        : `${settings.contentMaxWidth}px`;

  // Heights.
  const heightDesktop = heightCss(settings?.desktopHeight, "650");
  const heightMobile = heightCss(settings?.mobileHeight, "400");

  // Text-protection overlay (0–100 → 0–1).
  const overlayRaw = Number.parseFloat(
    String(settings?.overlayOpacity ?? DEFAULT_HERO_VIDEO.overlayOpacity)
  );
  const overlayOpacity = Number.isFinite(overlayRaw)
    ? Math.min(100, Math.max(0, overlayRaw)) / 100
    : 0;

  // 6-position text alignment (vertical middle/bottom + horizontal left/center/right).
  const [vPart, hPart] = (
    settings?.textAlignment ?? DEFAULT_HERO_VIDEO.textAlignment
  ).split("-");
  const vAlign = vPart === "bottom" ? "align-bottom" : "align-middle";
  const hAlign =
    hPart === "left"
      ? "text-left"
      : hPart === "right"
        ? "text-right"
        : "text-center";

  // Background video id (from a URL or bare id).
  const bgVideoId =
    youTubeId(String(settings?.backgroundVideoId ?? "")) ||
    DEFAULT_HERO_VIDEO.backgroundVideoId;
  // NO `loop=1&playlist=` — that combo makes YouTube render prev/next NAVIGATION arrows
  // on hover (the live site does not show them). We loop via the IFrame API instead
  // (see the effect below). autoplay+mute stay URL-driven.
  const bgSrc =
    `https://www.youtube.com/embed/${bgVideoId}` +
    `?autoplay=1&mute=1` +
    `&autohide=0&cc_load_policy=0&controls=0&fs=0&iv_load_policy=3` +
    `&modestbranding=1&playsinline=1&rel=0&enablejsapi=1`;

  // CTA dual-mode: a YouTube link opens the in-page player; otherwise it's a link.
  const ctaVideoId = youTubeId(ctaHref);
  const ctaIsVideo = Boolean(ctaVideoId);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  // Ambient background loop via the YouTube IFrame API (replaces the `loop`+`playlist`
  // URL params that would show prev/next nav arrows). Subscribe to player state over
  // postMessage and, when the video ENDS (state 0), seek back to the start and replay.
  useEffect(() => {
    if (!mounted) {
      return;
    }
    const target = "https://www.youtube.com";
    const send = (msg: object) =>
      bgIframeRef.current?.contentWindow?.postMessage(
        JSON.stringify(msg),
        target
      );
    // Handshake so the player streams state updates back to us.
    const subscribe = () =>
      send({ event: "listening", id: 1, channel: "widget" });
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== target || typeof e.data !== "string") {
        return;
      }
      let data: { info?: { playerState?: number } };
      try {
        data = JSON.parse(e.data);
      } catch {
        return;
      }
      if (data.info?.playerState === 0) {
        send({ event: "command", func: "seekTo", args: [0, true] });
        send({ event: "command", func: "playVideo", args: [] });
      }
    };
    window.addEventListener("message", onMessage);
    // The player isn't ready on first paint — re-send the handshake briefly.
    subscribe();
    const handshake = setInterval(subscribe, 1000);
    const stopHandshake = setTimeout(() => clearInterval(handshake), 6000);
    return () => {
      window.removeEventListener("message", onMessage);
      clearInterval(handshake);
      clearTimeout(stopHandshake);
    };
  }, [mounted]);

  const ctaClass =
    "cs-hero-v3__cta pointer-events-auto relative mb-[2px] mr-[3px] mt-[4px] inline-block cursor-pointer overflow-hidden bg-[var(--cs-hero-v3-cta-bg)] px-[17px] py-[9px] text-center align-top font-body text-[13px] font-[700] uppercase leading-[15.62px] tracking-[2.6px] text-[var(--cs-hero-v3-cta-text)] transition-[background] duration-200 after:pointer-events-none after:absolute after:inset-y-0 after:left-[-150%] after:w-[60%] after:-skew-x-[20deg] after:bg-white/25 after:content-[''] lm:mr-[5px] lm:mt-0 lm:px-[20px] lm:py-[11px] lm:text-[15px] lm:leading-[18.46px]";

  return (
    <section
      data-testid="hero"
      className={`cs-hero-v3 relative block h-[var(--hv-h-m)] w-full overflow-hidden text-[17px] leading-[21px] tracking-[0.375px] lm:h-[var(--hv-h-d)] lm:text-[18px] lm:leading-[22.4px] lm:tracking-[0.4px] ${className ?? ""}`}
      style={
        {
          ["--hv-h-m" as string]: heightMobile,
          ["--hv-h-d" as string]: heightDesktop,
          ["--hv-hs-m" as string]: `${headingMobile}px`,
          ["--hv-hs-d" as string]: `${headingDesktop}px`,
          ["--cs-hero-v3-cta-bg" as string]: ctaBackground,
          ["--cs-hero-v3-cta-text" as string]: ctaTextColor,
          backgroundColor: sectionBackground,
        } as React.CSSProperties
      }
    >
      {/* Media layer — absolute oversized iframe (cover overscan). */}
      <div
        data-testid="hero-media"
        className="cs-hero-v3__media pointer-events-none absolute inset-0 z-[1] block text-black motion-reduce:animate-none"
      >
        <div className="cs-hero-v3__mediaContainer absolute inset-0 block text-black">
          {mounted ? (
            // eslint-disable-next-line no-restricted-syntax
            <iframe
              ref={bgIframeRef}
              title={videoTitle}
              src={bgSrc}
              tabIndex={-1}
              aria-hidden="true"
              width={1280}
              height={720}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              // COVER: a 16:9 iframe scaled to overflow the section in BOTH axes
              // (min-w/h-full + aspect-video, width/height auto so the aspect drives
              // the size), centered, with the overflow cropped by the section's
              // overflow-hidden. Avoids the black letterbox bars a w-full/tall iframe
              // produced (the YouTube player letterboxes the 16:9 video inside it).
              className="absolute left-1/2 top-1/2 aspect-video h-auto w-auto min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
            />
          ) : null}
        </div>
      </div>

      {/* Text-protection overlay (black scrim) — between media (z-1) and text (z-3). */}
      {overlayOpacity > 0 ? (
        <div
          aria-hidden="true"
          data-testid="hero-overlay"
          className="cs-hero-v3__overlay pointer-events-none absolute inset-0 z-[2] bg-black"
          style={{ opacity: overlayOpacity }}
        />
      ) : null}

      {/* Text layer — CSS table for vertical alignment. */}
      <div className="cs-hero-v3__textWrap relative z-[3] block h-full text-white">
        <div className="cs-hero-v3__pageWidth table h-full w-full px-[17px] lm:px-[40px]">
          <div
            className={`cs-hero-v3__textContent relative z-[4] table-cell py-[15px] text-white lm:py-[45px] ${vAlign} ${hAlign}`}
          >
            <div
              className="cs-hero-v3__textShadow relative inline-block"
              style={
                contentMaxWidth ? { maxWidth: contentMaxWidth } : undefined
              }
            >
              <h2
                data-testid="hero-heading"
                className="cs-hero-v3__title m-0 font-heading text-[length:var(--hv-hs-m)] font-[500] leading-[1.1] text-white lm:text-[length:var(--hv-hs-d)]"
                style={{
                  ...(settings?.headingColor
                    ? { color: settings.headingColor }
                    : {}),
                  ...(settings?.headingCase
                    ? { textTransform: settings.headingCase }
                    : {}),
                  ...(headingSpacing ? { letterSpacing: headingSpacing } : {}),
                }}
              >
                <div className="cs-hero-v3__cropper inline-flex overflow-hidden">
                  <div className="cs-hero-v3__contents cs-hero-v3__rise block [animation-delay:0.3s] [animation-duration:0.8s] motion-reduce:animate-none motion-reduce:[transform:none]">
                    {heading}
                  </div>
                </div>
              </h2>

              {subtitle ? (
                <div
                  data-testid="hero-subtitle"
                  className="cs-hero-v3__subtitle mb-[30px] mt-[15px] font-body text-[21px] font-[400] leading-[29.4px] tracking-[0.4px] text-white"
                  style={{
                    ...(settings?.subtitleColor
                      ? { color: settings.subtitleColor }
                      : {}),
                    ...(subtitleSize
                      ? { fontSize: subtitleSize, lineHeight: 1.4 }
                      : {}),
                  }}
                >
                  <div className="cs-hero-v3__cropper inline-flex overflow-hidden">
                    <div className="cs-hero-v3__contents cs-hero-v3__rise block [animation-delay:0.7s] [animation-duration:1s] motion-reduce:animate-none motion-reduce:[transform:none]">
                      {subtitle}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="cs-hero-v3__link relative mt-[15px] block">
                <div className="cs-hero-v3__cropper inline-flex overflow-hidden">
                  <div className="cs-hero-v3__contents cs-hero-v3__fade block opacity-0 [animation-delay:1.3s] [animation-duration:2s] motion-reduce:animate-none motion-reduce:opacity-100">
                    {ctaIsVideo ? (
                      <button
                        type="button"
                        data-testid="hero-cta"
                        onClick={() => setLightboxOpen(true)}
                        className={ctaClass}
                      >
                        {ctaText}
                      </button>
                    ) : (
                      <a
                        href={ctaHref}
                        data-testid="hero-cta"
                        className={ctaClass}
                      >
                        {ctaText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA video lightbox — fixed sibling at the widget root (NO createPortal). */}
      {ctaIsVideo && lightboxOpen ? (
        <div
          data-testid="hero-lightbox"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-[20px]"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={videoTitle}
        >
          <button
            type="button"
            aria-label="Close video"
            onClick={closeLightbox}
            className="cs-hero-v3__close absolute right-[20px] top-[20px] z-[1] flex h-[40px] w-[40px] items-center justify-center bg-white/15 text-[24px] leading-none text-white hover:bg-white/25"
          >
            ×
          </button>
          <div
            className="aspect-video w-full max-w-[1100px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line no-restricted-syntax */}
            <iframe
              title={videoTitle}
              src={`https://www.youtube.com/embed/${ctaVideoId}?autoplay=1&rel=0&playsinline=1`}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
});

export { V3 as default };
