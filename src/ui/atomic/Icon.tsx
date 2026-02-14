"use client";

import React from "react";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | string;
  color?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Size class mappings
 */
const sizeClasses: Record<string, string> = {
  xs: "w-3 h-3", // 12px
  sm: "w-4 h-4", // 16px
  md: "w-5 h-5", // 20px
  lg: "w-6 h-6", // 24px
  xl: "w-8 h-8", // 32px
};

/**
 * Size value mappings for SVG cloning
 */
const sizeValues: Record<string, string> = {
  xs: "12px",
  sm: "16px",
  md: "20px",
  lg: "24px",
  xl: "32px",
};

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ className = "", size = "md", color, style, children, ...props }, ref) => {
    const sizeClass = sizeClasses[size] || "";
    const iconSize = sizeValues[size] || size;

    // Build class list
    const iconClasses = [
      "inline-flex items-center justify-center shrink-0",
      sizeClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Inline styles for custom sizes and colors
    const iconStyles: React.CSSProperties = {
      // Only set width/height if using a custom size (not a preset)
      ...(!sizeClasses[size] && { width: size, height: size }),
      // Use color if provided, otherwise inherit from parent
      ...(color && { color }),
      ...style,
    };

    return (
      <span ref={ref} className={iconClasses} style={iconStyles} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === "svg") {
            return React.cloneElement(child as React.ReactElement<any>, {
              width: iconSize,
              height: iconSize,
              fill: child.props.fill || "none",
              stroke: child.props.stroke || "currentColor",
              style: {
                width: "100%",
                height: "100%",
                ...child.props.style,
              },
            });
          }
          return child;
        })}
      </span>
    );
  }
);

Icon.displayName = "Icon";
