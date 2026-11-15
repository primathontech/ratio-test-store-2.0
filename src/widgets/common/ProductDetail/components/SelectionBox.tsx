"use client";

import React from "react";
import { GALLERY_CONFIG } from "../constants";

interface SelectionBoxProps {
  isVisible: boolean;
  mousePosition: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement>;
  containerDimensions: { width: number; height: number };
  sizeMultiplier?: number;
  borderColor?: string;
  borderWidth?: number;
  backgroundOpacity?: number;
  className?: string;
}

/**
 * Translucent rectangle drawn on the main image to mark the region currently
 * shown in the desktop hover-magnifier. The box size is the inverse of the
 * zoom factor so the selection always represents what the magnifier covers.
 */
export const SelectionBox: React.FC<SelectionBoxProps> = ({
  isVisible,
  mousePosition,
  containerRef,
  containerDimensions,
  borderColor = "#ffffff",
  borderWidth = 2,
  backgroundOpacity = 0.2,
  className,
}) => {
  if (!isVisible || !containerRef.current) {
    return null;
  }

  const containerRect = containerRef.current.getBoundingClientRect();
  const relativeX = mousePosition.x - containerRect.left;
  const relativeY = mousePosition.y - containerRect.top;

  // Must mirror HoverPreview's zoom factor for the selection to feel correct.
  const zoomFactor = 2.5;
  const selectionBoxWidth = containerDimensions.width / zoomFactor;
  const selectionBoxHeight = containerDimensions.height / zoomFactor;

  let boxLeft = relativeX - selectionBoxWidth / 2;
  let boxTop = relativeY - selectionBoxHeight / 2;
  boxLeft = Math.max(
    0,
    Math.min(boxLeft, containerDimensions.width - selectionBoxWidth)
  );
  boxTop = Math.max(
    0,
    Math.min(boxTop, containerDimensions.height - selectionBoxHeight)
  );

  const selectionBoxStyle: React.CSSProperties = {
    position: "absolute",
    left: `${boxLeft}px`,
    top: `${boxTop}px`,
    width: `${selectionBoxWidth}px`,
    height: `${selectionBoxHeight}px`,
    border: `${borderWidth}px solid ${borderColor}`,
    backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
    pointerEvents: "none",
    zIndex: GALLERY_CONFIG.Z_INDEX.ARROWS + 1,
    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div
      className={`selection-box ${className || ""}`}
      style={selectionBoxStyle}
      role="presentation"
      aria-hidden="true"
    />
  );
};
