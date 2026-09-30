"use client";

import { useResponsive } from "@/hooks";
import React, { useState, useEffect } from "react";

interface CustomCursorProps {
  isVisible: boolean;
}

/**
 * CustomCursor Component
 * Shows a custom cursor with close icon that follows the mouse
 * Only visible on tablet and desktop devices
 */
export const CustomCursor: React.FC<CustomCursorProps> = ({ isVisible }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInViewport, setIsMouseInViewport] = useState(true);
  const { isMobile } = useResponsive();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
      // Check if mouse is within viewport boundaries
      const isInViewport =
        e.clientX >= 0 &&
        e.clientX <= window.innerWidth &&
        e.clientY >= 0 &&
        e.clientY <= window.innerHeight;

      setIsMouseInViewport(isInViewport);
    };

    const handleMouseLeave = () => {
      setIsMouseInViewport(false);
    };

    const handleMouseEnter = () => {
      setIsMouseInViewport(true);
    };

    if (isVisible && !isMobile) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);
      document.addEventListener("mouseenter", handleMouseEnter);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, isMobile]);

  if (!isVisible || isMobile || !isMouseInViewport) {
    return null;
  }

  return (
    <div
      className="fixed pointer-events-none z-[22402] transition-opacity duration-200 hidden md:block"
      style={{
        left: mousePosition.x - 12,
        top: mousePosition.y - 12,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 p-4">
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          className="text-black"
        >
          <path
            d="M16 1.4L14.6 0L8 6.6L1.4 0L0 1.4L6.6 8L0 14.6L1.4 16L8 9.4L14.6 16L16 14.6L9.4 8L16 1.4Z"
            fill="currentColor"
            strokeWidth="0.9"
            stroke="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};
