"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ProductCardToastProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  duration?: number;
}
/**
 * Returns the current top offset required to render elements immediately below the header.
 * Falls back to the provided spacing when no header is present.
 */
export function useHeaderOffset(spacing = 0) {
  const [offset, setOffset] = useState(spacing);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const calculateOffset = () => {
      const headerElement =
        (document.querySelector("[data-header]") as HTMLElement | null) ??
        (document.querySelector("header") as HTMLElement | null);

      if (headerElement) {
        const rect = headerElement.getBoundingClientRect();
        setOffset(rect.bottom + spacing);
      } else {
        setOffset(spacing);
      }
    };

    calculateOffset();
    window.addEventListener("resize", calculateOffset);
    window.addEventListener("scroll", calculateOffset, { passive: true });

    return () => {
      window.removeEventListener("resize", calculateOffset);
      window.removeEventListener("scroll", calculateOffset);
    };
  }, [spacing]);

  return offset;
}
export function ProductCardToast({
  show,
  onClose,
  title = "Item added to your cart",
  duration = 3000,
}: ProductCardToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const headerOffset = useHeaderOffset(-1);

  useEffect(() => {
    if (show) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
      // If toast is already visible, immediately hide it and show new one
      if (isVisible) {
        setIsVisible(false);
        setTimeout(() => {
          setToastKey((prev) => prev + 1);
          setIsVisible(true);
          timerRef.current = setTimeout(() => {
            setIsVisible(false);
            closeTimerRef.current = setTimeout(() => onClose(), 0);
          }, duration);
        }, 300);
      } else {
        setToastKey((prev) => prev + 1);
        setIsVisible(true);
        timerRef.current = setTimeout(() => {
          setIsVisible(false);
          closeTimerRef.current = setTimeout(() => onClose(), 0);
        }, duration);
      }
    } else {
      // When show becomes false, hide the toast immediately
      setIsVisible(false);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, [show, duration]);

  if (!show && !isVisible) {
    return null;
  }

  return createPortal(
    <div
      key={toastKey}
      data-testid="product-card-toast-container"
      className={`fixed left-1/2 z-[21475] flex w-full max-w-[400px] h-[40px] p-[10px] justify-between text-white shadow-lg transition-all duration-300 ease-out ${
        isVisible
          ? "opacity-100 -translate-x-1/2 translate-y-0"
          : "opacity-0 -translate-x-1/2 -translate-y-full"
      }`}
      style={{ backgroundColor: "#008001", top: `${headerOffset}px` }}
    >
      <div
        data-testid="product-card-toast-content"
        className="flex items-center gap-[10px] flex-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 12 9"
          width="20"
          height="20"
          fill="none"
          className="flex-shrink-0"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.35.643a.5.5 0 01.006.707l-6.77 6.886a.5.5 0 01-.719-.006L.638 4.845a.5.5 0 11.724-.69l2.872 3.011 6.41-6.517a.5.5 0 01.707-.006z"
            fill="currentColor"
          />
        </svg>
        <h2
          data-testid="product-card-toast-title"
          className="m-0 text-[14px] font-normal !text-white"
        >
          {title}
        </h2>
      </div>

      <button
        type="button"
        data-testid="product-card-toast-close-button"
        className="bg-transparent border-none cursor-pointer text-white p-0 flex items-center justify-center hover:opacity-80 transition-opacity"
        onClick={() => {
          // Clear any existing timers
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
          }
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
      >
        <svg fill="none" width="16" height="16" viewBox="0 0 16 16">
          <path
            d="M16 1.4L14.6 0L8 6.6L1.4 0L0 1.4L6.6 8L0 14.6L1.4 16L8 9.4L14.6 16L16 14.6L9.4 8L16 1.4Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>,
    document.body
  );
}
