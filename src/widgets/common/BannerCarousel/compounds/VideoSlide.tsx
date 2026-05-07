"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { IBannerCarouselItem } from "../types";

export interface VideoSlideProps {
  item: IBannerCarouselItem;
  index: number;
  desktopAspectRatio?: string | number;
  mobileAspectRatio?: string | number;
  isActive?: boolean;
  indicatorType?: "media" | "simple";
}

export const VideoSlide: React.FC<VideoSlideProps> = ({
  item,
  index,
  desktopAspectRatio = "182/57",
  mobileAspectRatio = "1/1",
  isActive = false,
  indicatorType = "media",
}) => {
  const {
    mobileSrc,
    desktopSrc,
    href,
    alt,
    target = "_self",
    posterSrc,
  } = item;

  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Apply scale effect only on mobile when indicatorType is "simple"
  const shouldApplyMobileScale = indicatorType === "simple";
  const mobileScaleClass = shouldApplyMobileScale
    ? `transition-transform duration-300 ease-in-out ${isActive ? "scale-100" : "scale-y-[82%]"}`
    : "";

  // Lazy load video after 1 second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // IntersectionObserver to play video when in view
  useEffect(() => {
    if (!shouldLoadVideo || !containerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isActive) {
            // Play video when visible and active
            mobileVideoRef.current?.play().catch(() => {
              // Ignore play errors (e.g., user hasn't interacted yet)
            });
            desktopVideoRef.current?.play().catch(() => {
              // Ignore play errors
            });
          } else {
            // Pause video when not visible to save resources
            mobileVideoRef.current?.pause();
            desktopVideoRef.current?.pause();
          }
        });
      },
      {
        threshold: 0.5, // Play when 50% visible
        rootMargin: "50px",
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoadVideo, isActive]);

  // Handle video ready state
  const handleCanPlay = () => {
    setIsVideoReady(true);
  };

  const content = (
    <>
      {/* Mobile Video */}
      <div
        data-testid={`banner-carousel-video-slide-mobile-${index}`}
        className={`w-full relative md:hidden ${mobileScaleClass}`}
        style={{ aspectRatio: mobileAspectRatio }}
      >
        {/* Poster Image - Always show first for LCP */}
        {posterSrc && (
          <Image
            src={posterSrc}
            alt={alt || `Banner ${index + 1}`}
            fill
            className={`object-cover object-[center_20%] rounded ${isVideoReady && shouldLoadVideo ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
            priority={index === 0}
            sizes="100vw"
          />
        )}

        {/* Video - Loads after delay */}
        {shouldLoadVideo && (
          // eslint-disable-next-line no-restricted-syntax
          <video
            ref={mobileVideoRef}
            src={mobileSrc}
            style={{ aspectRatio: mobileAspectRatio }}
            className="object-cover object-[center_20%] w-full h-full rounded absolute inset-0"
            muted
            loop
            playsInline
            preload="none"
            onCanPlay={handleCanPlay}
            aria-label={alt || `Video banner ${index + 1}`}
          />
        )}
      </div>

      {/* Desktop Video */}
      <div
        data-testid={`banner-carousel-video-slide-desktop-${index}`}
        className="w-full relative hidden md:block"
        style={{ aspectRatio: desktopAspectRatio }}
      >
        {/* Poster Image - Always show first for LCP */}
        {posterSrc && (
          <Image
            src={posterSrc}
            alt={alt || `Banner ${index + 1}`}
            fill
            className={`object-cover object-[center_25%] rounded-none lg:rounded-lg ${isVideoReady && shouldLoadVideo ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
            priority={index === 0}
            sizes="100vw"
          />
        )}

        {/* Video - Loads after delay */}
        {shouldLoadVideo && (
          // eslint-disable-next-line no-restricted-syntax
          <video
            ref={desktopVideoRef}
            src={desktopSrc}
            style={{ aspectRatio: desktopAspectRatio }}
            className="object-cover object-[center_25%] w-full h-full rounded-none lg:rounded-[10px] absolute inset-0"
            muted
            loop
            playsInline
            preload="none"
            onCanPlay={handleCanPlay}
            aria-label={alt || `Video banner ${index + 1}`}
          />
        )}
      </div>
    </>
  );

  return (
    <div
      data-testid={`banner-carousel-video-slide-${index}`}
      ref={containerRef}
      className="w-full h-full"
    >
      {!href || href === "#" ? (
        <div
          data-testid={`banner-carousel-video-slide-link-${index}`}
          className="block relative w-full h-full"
        >
          {content}
        </div>
      ) : (
        <Link
          href={href}
          target={target}
          data-testid={`banner-carousel-video-slide-link-${index}`}
          className="block relative w-full h-full"
        >
          {content}
        </Link>
      )}
    </div>
  );
};
