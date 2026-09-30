"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import { NavigationArrow } from "./NavigationArrow";
import { ProductImage } from "../types";
import { isVideo } from "../utils/galleryHelpers";

interface ZoomIconProps {
  isZoomed: boolean;
  color?: string;
  size?: number;
}

const ZoomIcon: React.FC<ZoomIconProps> = ({
  isZoomed,
  color = "black",
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label={isZoomed ? "Zoom out" : "Zoom in"}
    role="img"
  >
    <path
      d="M505 442.7L405.3 343C434.8 304.3 452 255.5 452 204C452 91.3 360.7 0 248 0C135.3 0 44 91.3 44 204C44 316.7 135.3 408 248 408C299.5 408 348.3 390.8 387 361.3L486.7 461C491 465.3 497 467.9 503 467.9C509 467.9 515 465.3 519.3 461C528 452.3 528 438.7 519.3 430L505 442.7ZM248 360C155.2 360 80 284.8 80 192C80 99.2 155.2 24 248 24C340.8 24 416 99.2 416 192C416 284.8 340.8 360 248 360Z"
      fill={color}
    />
    {isZoomed ? (
      <rect x="160" y="184" width="176" height="24" fill={color} />
    ) : (
      <>
        <rect x="160" y="184" width="176" height="24" fill={color} />
        <rect x="244" y="100" width="24" height="176" fill={color} />
      </>
    )}
  </svg>
);

const CloseIconSvg: React.FC<{ color?: string }> = ({ color = "#000" }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill={color}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export interface ZoomModalProps {
  images: ProductImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  bgColor?: string;
  overlayOpacity?: number;
  zoomIconColor?: string;
}

/**
 * Fullscreen lightbox. Keyboard: Esc to close, ←/→ to navigate, +/- to toggle
 * the magnifier. Locks body scroll while open and skips video entries since
 * `next/image` can't render those.
 */
export const ZoomModal: React.FC<ZoomModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  bgColor = "rgba(255, 255, 255, 1)",
  overlayOpacity = 1,
  zoomIconColor = "#000",
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(isAnimating);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  const findNextImageIndex = useCallback(
    (startIndex: number): number => {
      for (let i = 1; i < images.length; i++) {
        const nextIndex = (startIndex + i) % images.length;
        if (!isVideo(images[nextIndex])) {
          return nextIndex;
        }
      }
      return startIndex;
    },
    [images]
  );

  const findPreviousImageIndex = useCallback(
    (startIndex: number): number => {
      for (let i = 1; i < images.length; i++) {
        const prevIndex = (startIndex - i + images.length) % images.length;
        if (!isVideo(images[prevIndex])) {
          return prevIndex;
        }
      }
      return startIndex;
    },
    [images]
  );

  // If we open on a video index, jump to the next image so the modal never
  // tries to render a video into next/image.
  useEffect(() => {
    if (isOpen && images[currentIndex] && isVideo(images[currentIndex])) {
      const nextImageIndex = findNextImageIndex(currentIndex);
      if (nextImageIndex !== currentIndex) {
        onNavigate(nextImageIndex);
      }
    }
  }, [isOpen, currentIndex, images, onNavigate, findNextImageIndex]);

  const handlePrevious = useCallback(() => {
    if (isAnimatingRef.current) {
      return;
    }
    setIsAnimating(true);
    const newIndex = findPreviousImageIndex(currentIndex);
    if (newIndex !== currentIndex) {
      onNavigate(newIndex);
    }
    setTimeout(() => setIsAnimating(false), 300);
  }, [currentIndex, findPreviousImageIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (isAnimatingRef.current) {
      return;
    }
    setIsAnimating(true);
    const newIndex = findNextImageIndex(currentIndex);
    if (newIndex !== currentIndex) {
      onNavigate(newIndex);
    }
    setTimeout(() => setIsAnimating(false), 300);
  }, [currentIndex, findNextImageIndex, onNavigate]);

  // Keyboard handling — Esc / arrows / zoom.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          handlePrevious();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "+":
        case "=":
          setIsZoomed(true);
          break;
        case "-":
          setIsZoomed(false);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrevious]);

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, [isOpen]);

  if (!isOpen || !isMounted) {
    return null;
  }
  const currentImage = images[currentIndex];
  if (!currentImage || isVideo(currentImage)) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: bgColor, opacity: overlayOpacity }}
      role="dialog"
      aria-modal="true"
      aria-label="Image zoom view"
    >
      <div className="flex gap-10 items-center absolute top-4 right-4 z-[50]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed((prev) => !prev);
          }}
          className="size-8 hover:opacity-80 transition-opacity flex items-center justify-center"
          aria-label={isZoomed ? "Zoom out" : "Zoom in"}
        >
          <ZoomIcon isZoomed={isZoomed} color={zoomIconColor} />
        </button>

        <button
          onClick={onClose}
          className="hover:opacity-80 transition-opacity"
          aria-label="Close zoom view"
        >
          <CloseIconSvg color={zoomIconColor} />
        </button>
      </div>

      <div
        className="absolute top-4 left-4 text-sm font-medium z-10"
        style={{ color: zoomIconColor }}
      >
        {currentIndex + 1} / {images.length}
      </div>

      <div className="relative size-full flex justify-center items-center">
        <div className="zoom-modal-image-container w-[100vw] h-[100vw] md:w-[768px] md:h-[768px] min-[769px]:w-[900px] min-[769px]:h-[900px] flex items-center justify-center overflow-hidden">
          <div className="w-full h-full relative">
            <Image
              src={currentImage.url}
              alt={currentImage.altText || "Product image"}
              fill
              className={`object-contain transition-transform duration-300 ease-in-out ${
                isZoomed ? "scale-125" : "scale-100"
              }`}
              sizes="90vw"
              priority
            />
          </div>
        </div>

        {images.length > 1 && (
          <>
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <NavigationArrow
                direction="left"
                onClick={handlePrevious}
                size={48}
                bgColor="rgba(255, 255, 255, 0.9)"
                iconColor="#000000"
              />
            </div>
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <NavigationArrow
                direction="right"
                onClick={handleNext}
                size={48}
                bgColor="rgba(255, 255, 255, 0.9)"
                iconColor="#000000"
              />
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};
