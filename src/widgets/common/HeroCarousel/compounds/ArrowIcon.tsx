"use client";

import React from "react";

interface ArrowIconProps {
  direction: "left" | "right" | "top" | "bottom";
  className?: string;
  onClick?: () => void;
  size?: number;
}

/**
 * Arrow icon for carousel navigation
 */
export function ArrowIcon({
  direction,
  className = "",
  onClick,
  size = 24,
}: ArrowIconProps) {
  // Determine rotation based on direction
  const getRotation = () => {
    switch (direction) {
      case "left":
        return "rotate-180";
      case "top":
        return "-rotate-90";
      case "bottom":
        return "rotate-90";
      default:
        return "";
    }
  };

  const getAriaLabel = () => {
    switch (direction) {
      case "left":
        return "Previous";
      case "right":
        return "Next";
      case "top":
        return "Up";
      case "bottom":
        return "Down";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors ${className}`}
      aria-label={getAriaLabel()}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={getRotation()}
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}

export default ArrowIcon;
