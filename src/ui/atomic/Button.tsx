"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { BaseComponentProps } from "./types";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, BaseComponentProps {
  /**
   * If true, the button will render as a child slot
   */
  asChild?: boolean;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Icon to display before the button text
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to display after the button text
   */
  rightIcon?: React.ReactNode;
}

/**
 * Variant class mappings using Tailwind CSS variables
 */
const variantClasses: Record<string, string> = {
  primary:
    "bg-primary text-on-primary border-none hover:bg-primary-dark focus-visible:ring-primary",
  secondary:
    "bg-secondary text-on-secondary border-none hover:bg-secondary-dark focus-visible:ring-secondary",
  accent:
    "bg-accent text-on-accent border-none hover:bg-accent-dark focus-visible:ring-accent",
  success:
    "bg-success text-on-success border-none hover:bg-success-dark focus-visible:ring-success",
  warning:
    "bg-warning text-on-warning border-none hover:bg-warning-light focus-visible:ring-warning",
  error:
    "bg-error text-on-error border-none hover:bg-error-light focus-visible:ring-error",
  info: "bg-info text-on-info border-none hover:bg-info-dark focus-visible:ring-info",
  outline:
    "bg-transparent text-text border border-text-lighter hover:bg-surface hover:border-primary focus-visible:ring-primary",
  ghost:
    "bg-transparent text-text border-none hover:bg-surface-2 focus-visible:ring-primary",
  link: "bg-transparent text-primary border-none underline underline-offset-4 hover:text-primary-dark focus-visible:ring-primary",
};

/**
 * Size class mappings using Tailwind CSS variables
 */
const sizeClasses: Record<string, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-2.5 text-md",
  xl: "px-8 py-3 text-lg",
};

/**
 * Base button classes shared across all variants
 */
const baseClasses =
  "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

/**
 * Button Component
 *
 * A flexible button component that uses Tailwind CSS classes with CSS variables
 * for theming. No direct theme config access needed.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="outline" loading>Loading...</Button>
 * <Button variant="ghost" leftIcon={<Icon />}>With Icon</Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    // Combine all classes
    const combinedClassName = [
      baseClasses,
      variantClasses[variant] || variantClasses.primary,
      sizeClasses[size] || sizeClasses.md,
      isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Comp
        className={combinedClassName}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
