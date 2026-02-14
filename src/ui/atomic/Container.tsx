"use client";

import * as React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Container size
   */
  size?: "sm" | "md" | "lg" | "xl" | "full";

  /**
   * Whether to center the container
   */
  centered?: boolean;

  /**
   * Padding size
   */
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

/**
 * Size class mappings (using Tailwind max-width)
 */
const sizeClasses: Record<string, string> = {
  sm: "max-w-screen-sm", // 640px
  md: "max-w-screen-md", // 768px
  lg: "max-w-screen-lg", // 1024px
  xl: "max-w-screen-xl", // 1280px
  full: "max-w-full",
};

/**
 * Padding class mappings
 */
const paddingClasses: Record<string, string> = {
  none: "px-0",
  xs: "px-2",
  sm: "px-3",
  md: "px-4",
  lg: "px-6",
  xl: "px-8",
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className = "",
      size = "lg",
      centered = true,
      padding = "md",
      children,
      ...props
    },
    ref
  ) => {
    const containerClasses = [
      "w-full",
      sizeClasses[size] || sizeClasses.lg,
      paddingClasses[padding] || paddingClasses.md,
      centered && "mx-auto",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";
