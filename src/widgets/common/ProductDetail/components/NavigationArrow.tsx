import React from "react";
import Image from "next/image";

export interface NavigationArrowProps {
  direction: "left" | "right" | "up" | "down";
  onClick: () => void;
  size?: number;
  bgColor?: string;
  iconColor?: string;
  shape?: "circle" | "square" | "rounded";
  customIcon?: string;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
  enableHoverPreview?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Round / square / rounded chevron button used by both the main image slider
 * and the thumbnail strip. Hover events bubble up only when hover-preview is
 * enabled — the parent uses these to suspend the magnifier while an arrow is
 * focused.
 */
export const NavigationArrow: React.FC<NavigationArrowProps> = ({
  direction,
  onClick,
  size = 40,
  bgColor = "#ffffff",
  iconColor = "#000000",
  shape = "circle",
  customIcon,
  className = "",
  ariaLabel,
  disabled = false,
  enableHoverPreview = false,
  onMouseEnter,
  onMouseLeave,
}) => {
  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-none",
    rounded: "rounded-lg",
  };

  // No rotation needed since we have separate left/right SVGs
  const rotationMap = {
    left: "",
    right: "",
    up: "rotate-90",
    down: "-rotate-90",
  };

  const defaultAriaLabels = {
    left: "Previous image",
    right: "Next image",
    up: "Scroll up",
    down: "Scroll down",
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick();
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (enableHoverPreview && onMouseEnter) {
      onMouseEnter();
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (enableHoverPreview && onMouseLeave) {
      onMouseLeave();
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      className={`flex items-center justify-center transition-all ${
        disabled ? "cursor-not-allowed" : "hover:opacity-80"
      } ${shapeClasses[shape]} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        // backgroundColor: customIcon ? "" : bgColor,
        color: iconColor,
      }}
      aria-label={ariaLabel || defaultAriaLabels[direction]}
      aria-disabled={disabled}
    >
      {customIcon ? (
        <Image
          src={customIcon}
          alt={direction}
          width={size * 0.6}
          height={size * 0.6}
        />
      ) : (
        <>
          {direction === "left" && (
            <svg
              width="12"
              height="22"
              viewBox="0 0 12 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={rotationMap[direction]}
            >
              <path
                d="M11 21L1 11L11 0.999999"
                stroke={disabled ? "#00000066" : "#000000"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {direction === "right" && (
            <svg
              width="12"
              height="22"
              viewBox="0 0 12 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={rotationMap[direction]}
            >
              <path
                d="M1 1L11 11L1 21"
                stroke={disabled ? "#00000066" : "#000000"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {(direction === "up" || direction === "down") && (
            <svg
              width="12"
              height="22"
              viewBox="0 0 12 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={rotationMap[direction]}
            >
              <path
                d="M1 1L11 11L1 21"
                stroke={disabled ? "#00000066" : "#000000"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </>
      )}
    </button>
  );
};
