"use client";

import * as React from "react";
import type { BaseComponentProps } from "./types";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    BaseComponentProps {
  /**
   * Badge content
   */
  children: React.ReactNode;
}

/**
 * Variant class mappings using Tailwind CSS variables
 */
const variantClasses: Record<string, string> = {
  primary: "bg-primary text-on-primary",
  secondary: "bg-secondary text-on-secondary",
  accent: "bg-accent text-on-accent",
  success: "bg-success text-on-success",
  warning: "bg-warning text-on-warning",
  error: "bg-error text-on-error",
  info: "bg-info text-on-info",
  outline: "bg-transparent text-text border border-text-lighter",
  ghost: "bg-surface-2 text-text",
  filter: "bg-filter-group text-text rounded-[3px]",
};

/**
 * Size class mappings
 */
const sizeClasses: Record<string, string> = {
  xs: "px-2 py-0.5 text-xs",
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-1.5 text-base",
  lg: "px-6 py-2 text-md",
  xl: "px-8 py-2.5 text-lg",
  filter: "px-2.5 py-2.5 text-body-small",
};

/**
 * Base badge classes shared across all variants
 */
const baseClasses =
  "inline-flex items-center justify-center whitespace-nowrap font-medium leading-tight rounded-full";

/**
 * Badge Component
 *
 * A flexible badge component that uses Tailwind CSS classes with CSS variables
 * for theming. No direct theme config access needed.
 *
 * @example
 * ```tsx
 * <Badge variant="primary">New</Badge>
 * <Badge variant="success" size="sm">Active</Badge>
 * <Badge variant="outline">Draft</Badge>
 * ```
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    // Combine all classes
    const combinedClassName = [
      baseClasses,
      variantClasses[variant] || variantClasses.primary,
      sizeClasses[size] || sizeClasses.md,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={combinedClassName} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
