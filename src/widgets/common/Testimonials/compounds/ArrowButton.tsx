import { Image } from "@/ui/atomic";
import React, { useState } from "react";

export interface ArrowButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  arrowSize?: number;
  customIcon?: string;
  customHoverIcon?: string;
  shape?: "circle" | "square" | "rounded";
  position?: {
    offsetX?: number | string;
    offsetY?: number | string;
  };
  disabled?: boolean;
  arrowBackgroundColor?: string;
  arrowActiveBackgroundColor?: string;
  arrowHoverBackgroundColor?: string;
}

/**
 * Navigation arrow button for testimonials carousel
 */
export const ArrowButton = ({
  direction,
  onClick,
  arrowSize = 40,
  customIcon,
  customHoverIcon,
  shape = "circle",
  position = {},
  disabled = false,
  arrowBackgroundColor = "#fff",
  arrowActiveBackgroundColor = "#fff",
  arrowHoverBackgroundColor = "#000",
}: ArrowButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const { offsetX = 16, offsetY = 0 } = position;

  // Calculate position styles
  const positionStyle: React.CSSProperties = {
    [direction === "left" ? "left" : "right"]:
      typeof offsetX === "number" ? `${offsetX}px` : offsetX,
    top: "50%",
    transform: `translateY(${typeof offsetY === "number" ? `calc(-50% + ${offsetY}px)` : `calc(-50% + ${offsetY})`})`,
  };

  // Calculate shape styles
  const shapeClass =
    shape === "circle"
      ? "rounded-full"
      : shape === "rounded"
        ? "rounded-lg"
        : "rounded-none";

  // Default SVG arrow
  const defaultArrow = (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  );

  return (
    <button
      data-testid={`testimonials-arrow-button-${direction}`}
      className={`flex justify-center items-center absolute z-10 shadow-lg transition-all duration-200 border border-black ${shapeClass} ${
        disabled
          ? "opacity-40 !bg-transparent !text-black cursor-not-allowed"
          : "cursor-pointer"
      }`}
      style={{
        ...positionStyle,
        width: `${arrowSize}px`,
        height: `${arrowSize}px`,
        backgroundColor: isHovered
          ? arrowHoverBackgroundColor
          : arrowActiveBackgroundColor,
        color: isHovered ? arrowBackgroundColor : arrowHoverBackgroundColor,
      }}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      aria-label={`${direction === "left" ? "Previous" : "Next"} testimonial`}
      disabled={disabled}
    >
      {customIcon || customHoverIcon ? (
        <Image
          src={
            isHovered && customHoverIcon ? customHoverIcon : customIcon || ""
          }
          alt={direction}
          className="w-6 h-6"
        />
      ) : (
        defaultArrow
      )}
    </button>
  );
};
