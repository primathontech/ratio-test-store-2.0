"use client";

import * as React from "react";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The element type to render
   */
  as?: React.ElementType;

  /**
   * Flex direction
   */
  direction?: "row" | "column" | "row-reverse" | "column-reverse";

  /**
   * Align items
   */
  align?: "start" | "center" | "end" | "stretch" | "baseline";

  /**
   * Justify content
   */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";

  /**
   * Flex wrap
   */
  wrap?: "wrap" | "nowrap" | "wrap-reverse";

  /**
   * Gap between items
   */
  gap?: string | number;
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      as: Component = "div",
      className = "",
      direction = "row",
      align = "stretch",
      justify = "start",
      wrap = "nowrap",
      gap,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const flexStyles: React.CSSProperties = {
      display: "flex",
      flexDirection: direction,
      alignItems:
        align === "start" ? "flex-start" : align === "end" ? "flex-end" : align,
      justifyContent:
        justify === "start"
          ? "flex-start"
          : justify === "end"
            ? "flex-end"
            : justify === "between"
              ? "space-between"
              : justify === "around"
                ? "space-around"
                : justify === "evenly"
                  ? "space-evenly"
                  : justify,
      flexWrap: wrap,
      gap,
      ...style,
    };

    const combinedClassName = ["theme-flex", className]
      .filter(Boolean)
      .join(" ");

    return (
      <Component
        ref={ref}
        className={combinedClassName}
        style={flexStyles}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Flex.displayName = "Flex";
