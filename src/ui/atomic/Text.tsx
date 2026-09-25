"use client";

import * as React from "react";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "div" | "label";
  size?:
    | "xs"
    | "sm"
    | "base"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right" | "justify";
  color?:
    | "default"
    | "light"
    | "lighter"
    | "subtle"
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "error"
    | "info";
  truncate?: boolean;
  lineClamp?: number;
}

/**
 * Size class mappings using Tailwind CSS variables
 */
const sizeClasses: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
};

/**
 * Weight class mappings
 */
const weightClasses: Record<string, string> = {
  light: "font-light",
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
  justify: "text-justify",
};

/**
 * Color class mappings using Tailwind CSS variables
 */
const colorClasses: Record<string, string> = {
  default: "text-text",
  light: "text-text-light",
  lighter: "text-text-lighter",
  subtle: "text-text-subtle",
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  info: "text-info",
};

/**
 * Text Component
 *
 * A flexible text component that uses Tailwind CSS classes with CSS variables
 * for theming. No direct theme config access needed.
 *
 * @example
 * ```tsx
 * <Text size="lg" color="primary">Large primary text</Text>
 * <Text as="span" weight="bold" truncate>Bold truncated text</Text>
 * <Text lineClamp={2}>Text limited to 2 lines...</Text>
 * ```
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as: Component = "p",
      className,
      size = "base",
      weight = "normal",
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
    // Build class list
    const classes = [
      "font-body leading-base",
      sizeClasses[size] || sizeClasses.base,
      weightClasses[weight] || weightClasses.normal,
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
        ref={ref as any}
        className={classes}
        style={{ ...lineClampStyle, ...style }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text";
