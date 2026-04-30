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

  const rotationMap = {
    left: "rotate-180",
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
        <svg
          width={size * 0.7}
          height={size * 0.7}
          viewBox="0 0 24 24"
          fill="none"
          className={rotationMap[direction]}
        >
          <path
            d="M9 18l6-6-6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};
