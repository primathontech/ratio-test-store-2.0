"use client";

import React from "react";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns
   */
  columns?: number | string;

  /**
   * Gap between grid items (Tailwind gap class or CSS value)
   */
  gap?: string;

  /**
   * Align items
   */
  align?: "start" | "center" | "end" | "stretch";

  /**
   * Justify items
   */
  justify?: "start" | "center" | "end" | "stretch";

  /**
   * Additional styles
   */
  style?: React.CSSProperties;

  /**
   * Children elements
   */
  children?: React.ReactNode;
}

/**
 * Alignment class mappings
 */
const alignClasses: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

/**
 * Justify class mappings
 */
const justifyClasses: Record<string, string> = {
  start: "justify-items-start",
  center: "justify-items-center",
  end: "justify-items-end",
  stretch: "justify-items-stretch",
};

/**
 * Grid component for creating grid layouts
 * Uses CSS Grid for flexible layouts
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className = "",
      columns = 1,
      gap,
      align = "stretch",
      justify = "stretch",
      style,
      children,
      ...props
    },
    ref
  ) => {
    // Build class list
    const gridClasses = [
      "grid",
      alignClasses[align] || alignClasses.stretch,
      justifyClasses[justify] || justifyClasses.stretch,
      // If gap is a Tailwind class (e.g., "gap-4"), use it directly
      gap && gap.startsWith("gap-") ? gap : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Create grid styles for dynamic values
    const gridStyles: React.CSSProperties = {
      gridTemplateColumns:
        typeof columns === "number" ? `repeat(${columns}, 1fr)` : columns,
      // Only use inline gap if it's not a Tailwind class
      ...(gap && !gap.startsWith("gap-") ? { gap } : {}),
      ...style,
    };

    return (
      <div ref={ref} className={gridClasses} style={gridStyles} {...props}>
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";
