"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import { GALLERY_CONFIG } from "../constants";
import { ProductImage } from "../types";

interface HoverPreviewProps {
  image: ProductImage;
  isVisible: boolean;
  mousePosition: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement>;
  containerDimensions: { width: number; height: number };
  sizeMultiplier?: number;
  radius?: number;
  borderColor?: string;
  borderWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  opacity?: number;
  animationDuration?: number;
  delay?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "right"
    | "left";
  offset?: number;
  className?: string;
}

/**
 * Desktop-only floating magnifier panel. Renders to a body portal so it
 * escapes the gallery's stacking context and can overlay every other
 * widget on the PDP.
 */
export const HoverPreview: React.FC<HoverPreviewProps> = ({
  image,
  isVisible,
  mousePosition,
  containerRef,
  containerDimensions,
  sizeMultiplier = GALLERY_CONFIG.HOVER_PREVIEW.DEFAULT_SIZE_MULTIPLIER,
  opacity = GALLERY_CONFIG.HOVER_PREVIEW.DEFAULT_OPACITY,
  animationDuration = GALLERY_CONFIG.HOVER_PREVIEW.DEFAULT_ANIMATION_DURATION,
  delay = GALLERY_CONFIG.HOVER_PREVIEW.DEFAULT_DELAY,
  position = GALLERY_CONFIG.HOVER_PREVIEW.DEFAULT_POSITION,
  offset = GALLERY_CONFIG.HOVER_PREVIEW.DEFAULT_OFFSET,
  className,
}) => {
  const [shouldShow, setShouldShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Disable on touch devices — iPad reports >=768 width but has no real hover.
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice =
        (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) ||
        (typeof window !== "undefined" &&
          window.matchMedia?.("(hover: none), (pointer: coarse)")?.matches);
      const mobileByWidth =
        window.innerWidth < GALLERY_CONFIG.MOBILE_BREAKPOINT;
      setIsMobile(Boolean(mobileByWidth || isTouchDevice));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Watch the body's `zoom-modal-open` class so the magnifier hides while the
  // lightbox is up — observing it via MutationObserver keeps the two stateless.
  useEffect(() => {
    const checkZoomState = () => {
      setIsZoomOpen(document.body.classList.contains("zoom-modal-open"));
    };

    checkZoomState();
    const observer = new MutationObserver(checkZoomState);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const effectiveVisible = isVisible === true && !isMobile;

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (effectiveVisible) {
      timeoutRef.current = setTimeout(() => setShouldShow(true), delay);
    } else {
      setShouldShow(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [effectiveVisible, delay]);

  const shouldRender = shouldShow && !isMobile && !isZoomOpen;

  if (!image?.url) {
    return null;
  }
  if (!containerRef.current) {
    return null;
  }
  if (containerDimensions.width === 0 || containerDimensions.height === 0) {
    return null;
  }

  // Cap preview at 400×400 so very wide source images don't push off-screen.
  const baseWidth = containerDimensions.width * sizeMultiplier;
  const baseHeight = containerDimensions.height * sizeMultiplier;
  const maxWidth = 550;
  const maxHeight = 500;
  const previewWidth = Math.min(baseWidth, maxWidth);
  const previewHeight = Math.min(baseHeight, maxHeight);

  if (previewWidth <= 0 || previewHeight <= 0) {
    return null;
  }

  const containerRect = containerRef.current.getBoundingClientRect();
  if (containerRect.width === 0 || containerRect.height === 0) {
    return null;
  }

  let left = 0;
  let top = 0;

  switch (position) {
    case "right":
    case "top-right":
      left = containerRect.right + offset;
      top = containerRect.top;
      break;
    case "left":
    case "top-left":
      left = containerRect.left - previewWidth - offset;
      top = containerRect.top;
      break;
    case "bottom-right":
      left = containerRect.right + offset;
      top = containerRect.bottom - previewHeight;
      break;
    case "bottom-left":
      left = containerRect.left - previewWidth - offset;
      top = containerRect.bottom - previewHeight;
      break;
    default:
      left = containerRect.right + offset;
      top = containerRect.top;
  }

  // Keep within viewport.
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;

  if (left + previewWidth > viewportWidth) {
    left = viewportWidth - previewWidth - 20;
  }
  if (left < 20) {
    left = 20;
  }
  if (top + previewHeight > viewportHeight) {
    top = viewportHeight - previewHeight - 20;
  }
  if (top < 20) {
    top = 20;
  }

  // Background-position trick: scale the source image to (zoomFactor × container)
  // and shift it to the cursor's relative position. Must mirror SelectionBox's
  // zoom factor so the marker matches what's shown.
  const zoomFactor = 2.5;
  const relativeX = mousePosition.x - containerRect.left;
  const relativeY = mousePosition.y - containerRect.top;

  const clampedX = Math.max(0, Math.min(relativeX, containerDimensions.width));
  const clampedY = Math.max(0, Math.min(relativeY, containerDimensions.height));

  const xPercent =
    containerDimensions.width > 0
      ? (clampedX / containerDimensions.width) * 100
      : 50;
  const yPercent =
    containerDimensions.height > 0
      ? (clampedY / containerDimensions.height) * 100
      : 50;

  const backdropLeft = containerRect.right + offset;
  const backdropTop = containerRect.top;
  const backdropWidth = Math.max(0, viewportWidth - backdropLeft - 20);
  const backdropHeight = containerRect.height;

  const backdropStyle: React.CSSProperties = {
    position: "fixed",
    left: `${backdropLeft}px`,
    top: `${backdropTop}px`,
    width: `${backdropWidth}px`,
    height: `${backdropHeight}px`,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    opacity: shouldRender ? 1 : 0,
    transition: `opacity ${animationDuration}ms ease-out`,
    zIndex: 21473,
    pointerEvents: "none",
    display: shouldRender ? "block" : "none",
    visibility: shouldRender ? "visible" : "hidden",
  };

  const previewStyle: React.CSSProperties = {
    position: "fixed",
    left: `${left}px`,
    top: `${top}px`,
    width: `${previewWidth}px`,
    height: `${previewHeight}px`,
    borderRadius: "0",
    border: "none",
    boxShadow: "none",
    opacity: shouldRender ? opacity : 0,
    transform: shouldRender ? "scale(1)" : "scale(0.8)",
    transition: `opacity ${animationDuration}ms ease-out, transform ${animationDuration}ms ease-out`,
    zIndex: 21474,
    pointerEvents: "none",
    overflow: "hidden",
    backgroundImage: `url(${image.url})`,
    backgroundSize: `${containerDimensions.width * zoomFactor}px ${containerDimensions.height * zoomFactor}px`,
    backgroundPosition: `${xPercent}% ${yPercent}%`,
    backgroundRepeat: "no-repeat",
    backgroundColor: "#ffffff",
    isolation: "isolate",
    display: shouldRender ? "block" : "none",
    visibility: shouldRender ? "visible" : "hidden",
  };

  const previewElement = (
    <>
      <div
        className="hover-preview-backdrop"
        style={backdropStyle}
        aria-hidden="true"
      />
      <div
        className={`hover-preview ${className || ""}`}
        style={previewStyle}
        role="img"
        aria-label={`Magnified view of ${image.altText || "product image"}`}
      />
    </>
  );

  if (typeof document !== "undefined" && document.body) {
    return ReactDOM.createPortal(previewElement, document.body);
  }
  return previewElement;
};
