"use client";

import React from "react";

export interface IndicatorDotProps {
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  index?: number;
  width?: string | number;
  activeWidth?: string | number;
  height?: string | number;
  activeColor?: string;
  inactiveColor?: string;
  activeBorderColor?: string;
  inactiveBorderColor?: string;
  borderRadius?: string | number;
  borderWidth?: string | number;
  gap?: string | number;
  transition?: string;
  /** Alias for transition - accepts string or number (ms) */
  transitionDuration?: string | number;
  isShowFocusRing?: boolean;
}

/**
 * Indicator dot for carousel pagination
 */
export function IndicatorDot({
  isActive = false,
  onClick,
  className = "",
  index,
  width,
  activeWidth,
  height,
  activeColor,
  inactiveColor,
  activeBorderColor,
  inactiveBorderColor,
  borderRadius,
  borderWidth,
  gap,
  transition,
  transitionDuration,
  isShowFocusRing,
}: IndicatorDotProps) {
  // Use transition or transitionDuration (alias)
  // If transitionDuration is a number, convert to ms string
  const durationString =
    typeof transitionDuration === "number"
      ? `all ${transitionDuration}ms ease`
      : transitionDuration;
  const transitionValue = transition || durationString;
  const dotWidth = isActive && activeWidth ? activeWidth : width || "0.5rem";
  const dotHeight = height || "0.5rem";
  const bgColor = isActive ? activeColor || "#000000" : inactiveColor || "#D1D5DB";
  const borderColor = isActive ? activeBorderColor : inactiveBorderColor;

  return (
    <button
      onClick={onClick}
      className={`rounded-full transition-colors ${className}`}
      style={{
        width: dotWidth,
        height: dotHeight,
        backgroundColor: bgColor,
        borderRadius: borderRadius || "9999px",
        transition: transitionValue || "all 0.3s ease",
        border: borderColor ? `1px solid ${borderColor}` : undefined,
      }}
      aria-label={isActive ? "Current slide" : `Go to slide ${(index || 0) + 1}`}
    />
  );
}

export default IndicatorDot;
