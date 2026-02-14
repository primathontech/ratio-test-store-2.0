"use client";

import * as React from "react";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
  color?: "default" | "primary" | "secondary" | "accent" | "light" | "lighter";
  truncate?: boolean;
  lineClamp?: number;
}

/**
 * Default size classes for each heading level
 */
const defaultSizeByLevel: Record<string, string> = {
  h1: "text-5xl",
  h2: "text-4xl",
  h3: "text-3xl",
  h4: "text-2xl",
  h5: "text-xl",
  h6: "text-lg",
};

/**
 * Explicit size class mappings
 */
const sizeClasses: Record<string, string> = {
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-[4.5rem]",
  "7xl": "text-[5rem]",
  "8xl": "text-[6rem]",
  "9xl": "text-[8rem]",
};

/**
 * Weight class mappings
 */
const weightClasses: Record<string, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

/**
 * Alignment class mappings
 */
const alignClasses: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/**
 * Color class mappings using Tailwind CSS variables
 */
const colorClasses: Record<string, string> = {
  default: "text-text",
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  light: "text-text-light",
  lighter: "text-text-lighter",
};

/**
 * Heading Component
 *
 * A flexible heading component that uses Tailwind CSS classes with CSS variables
 * for theming. No direct theme config access needed.
 *
 * @example
 * ```tsx
 * <Heading as="h1">Page Title</Heading>
 * <Heading as="h2" size="3xl" color="primary">Section Title</Heading>
 * <Heading as="h3" weight="medium" truncate>Truncated Heading</Heading>
 * ```
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      as: Component = "h2",
      className = "",
      size,
      weight = "bold",
      align = "left",
      color = "default",
      truncate = false,
      lineClamp,
      style,
      children,
      ...props
    },
    ref
  ) => {
    // Determine size class: explicit size takes precedence, otherwise use default for heading level
    const sizeClass = size
      ? sizeClasses[size] || sizeClasses["2xl"]
      : defaultSizeByLevel[Component] || defaultSizeByLevel.h2;

    // Build class list
    const classes = [
      "font-heading leading-tight tracking-tight mt-0",
      sizeClass,
      weightClasses[weight] || weightClasses.bold,
      alignClasses[align] || alignClasses.left,
      colorClasses[color] || colorClasses.default,
      truncate && "truncate",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Line clamp requires inline style
    const lineClampStyle: React.CSSProperties | undefined = lineClamp
      ? {
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: lineClamp,
          WebkitBoxOrient: "vertical" as const,
        }
      : undefined;

    return (
      <Component
        ref={ref}
        className={classes}
        style={{ ...lineClampStyle, ...style }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";
