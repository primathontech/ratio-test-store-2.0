"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  VideoAndBrandValuesProps,
  DEFAULT_HEADING,
  DEFAULT_MOBILE_HEADING,
  DEFAULT_DESCRIPTION,
  DEFAULT_FEATURES,
  DEFAULT_VIDEO_SRC,
  DEFAULT_VIDEO_POSTER,
  IMAGE_PATHS,
} from "../types";
import "../style.css";

/**
 * VideoAndBrandValues V1
 *
 * Two-column layout on a sage green (#e4edd3) background. Left column: a
 * 253px-wide video with a play button overlay. Right column: flex:1,
 * centered heading, description, and 3-col-wrap brand value list.
 *
 * Video behavior:
 * - Initial: muted, poster shown, play button overlay visible
 * - Click play: lazy-load src, unmute, show native controls, hide overlay
 * - Video ends: pause, reset to 0, show overlay again
 * - IntersectionObserver: pause when scrolled out of view
 *
 * Mobile (<=850px): single column, text-wrap hidden, mobile heading shown.
 */
export function V1({ data, className }: VideoAndBrandValuesProps) {
  const heading = data?.heading || DEFAULT_HEADING;
  const mobileHeading = data?.mobileHeading || DEFAULT_MOBILE_HEADING;
  const description = data?.description || DEFAULT_DESCRIPTION;
  const features = data?.features || DEFAULT_FEATURES;
  const videoSrc = data?.videoSrc || DEFAULT_VIDEO_SRC;
  const videoPoster = data?.videoPoster || DEFAULT_VIDEO_POSTER;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  /**
   * Handle play button click: load video, unmute, play, hide overlay
   */
  const handlePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    // Lazy-load: if src not yet set on <source>, set it
    const source = video.querySelector("source");
    if (source && source.getAttribute("data-src")) {
      source.src = source.getAttribute("data-src") || "";
      source.removeAttribute("data-src");
      video.load();
    }

    video.muted = false;
    video.controls = true;
    video
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        // Autoplay policy might block unmuted play; fallback to muted
        video.muted = true;
        video.play().then(() => setIsPlaying(true));
      });
  }, []);

  /**
   * Handle keyboard activation (Enter / Space)
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handlePlay();
      }
    },
    [handlePlay]
  );

  /**
   * When video ends: pause, reset, show overlay
   */
  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
  }, []);

  /**
   * Also restore overlay when paused at time=0 or when ended
   */
  const handlePause = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (video.currentTime === 0 || video.ended) {
      setIsPlaying(false);
    }
  }, []);

  /**
   * IntersectionObserver: pause video when scrolled out of view
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
          }
        });
      },
      { rootMargin: "200px", threshold: 0.3 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  const sectionCls =
    "nintara-vbv__section" + (className ? " " + className : "");

  return (
    <section className={sectionCls}>
      {/* Mobile-only heading */}
      <div className="nintara-vbv__mobile-head">
        <h2 className="nintara-vbv__mobile-head-h2">{mobileHeading}</h2>
      </div>

      {/* White inner card */}
      <div className="nintara-vbv__card">
        <div className="nintara-vbv__inner">
          {/* Left column: Video */}
          <div className="nintara-vbv__video-box">
            {/* eslint-disable-next-line no-restricted-syntax */}
            <video
              ref={videoRef}
              className="nintara-vbv__video"
              width={253}
              height={512}
              muted
              playsInline
              preload="metadata"
              poster={videoPoster}
              onEnded={handleEnded}
              onPause={handlePause}
            >
              <source data-src={videoSrc} type="video/mp4" />
            </video>

            {/* Play button overlay */}
            {!isPlaying && (
              <div
                className="nintara-vbv__play-btn"
                onClick={handlePlay}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-label="Play video"
              >
                <Image
                  src={IMAGE_PATHS.playButton}
                  alt="Play"
                  width={55}
                  height={55}
                  className="nintara-vbv__play-img"
                />
              </div>
            )}
          </div>

          {/* Right column: Brand Values */}
          <div className="nintara-vbv__text-wrap">
            <h2 className="nintara-vbv__heading">{heading}</h2>
            <p className="nintara-vbv__description">{description}</p>

            <div className="nintara-vbv__features">
              <ul className="nintara-vbv__feature-list">
                {features?.map((feature) => (
                  <li key={feature.id} className="nintara-vbv__feature-item">
                    <Image
                      src={IMAGE_PATHS.bulletIcon}
                      alt="Bullet point"
                      width={25}
                      height={25}
                      className="nintara-vbv__bullet-icon"
                    />
                    <p className="nintara-vbv__feature-label">
                      {feature.label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
