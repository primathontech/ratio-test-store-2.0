"use client";

import * as React from "react";

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The element type to render
   */
  as?: React.ElementType;
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ as: Component = "div", className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`theme-box${className ? ` ${className}` : ""}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Box.displayName = "Box";
