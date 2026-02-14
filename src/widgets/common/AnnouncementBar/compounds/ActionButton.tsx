import React from "react";
import Link from "next/link";
import { TActionButtonPosition } from "../types";

interface ActionButtonProps {
  text: string;
  href?: string;
  target?: "_self" | "_blank" | "_parent" | "_top";
  position?: TActionButtonPosition;
  height?: string | number;
  width?: string | number;
  borderRadius?: string | number;
  borderColor?: string | number;
  textColor?: string;
  backgroundColor?: string;
  onClick?: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  href,
  target = "_self",
  height = "32px",
  width = "auto",
  borderRadius = "4px",
  borderColor = "transparent",
  textColor = "#ffffff",
  backgroundColor = "#007bff",
  onClick,
}) => {
  const buttonStyles: React.CSSProperties = {
    height: typeof height === "number" ? `${height}px` : height,
    width: typeof width === "number" ? `${width}px` : width,
    borderRadius:
      typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
    borderColor:
      typeof borderColor === "number" ? `${borderColor}px` : borderColor,
    color: textColor,
    backgroundColor,
    border: `1px solid ${borderColor}`,
    padding: "6px 12px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
  };

  if (href) {
    return (
      <div className="shrink-0">
        <Link
          href={href}
          target={target}
          className="action-button"
          style={buttonStyles}
          onClick={onClick}
        >
          {text}
        </Link>
      </div>
    );
  }

  return (
    <div className="shrink-0">
      <button
        className="action-button"
        style={buttonStyles}
        onClick={onClick}
        type="button"
      >
        {text}
      </button>
    </div>
  );
};
