"use client";

import * as React from "react";
import type { BaseComponentProps } from "./types";

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    BaseComponentProps {
  error?: boolean;
  helperText?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Size class mappings
 */
const sizeClasses: Record<string, string> = {
  xs: "h-7 text-xs",
  sm: "h-8 text-sm",
  md: "h-10 text-base",
  lg: "h-11 text-md",
  xl: "h-12 text-lg",
};

/**
 * Size-based padding classes
 */
const paddingClasses: Record<
  string,
  { normal: string; withLeftIcon: string; withRightIcon: string }
> = {
  xs: { normal: "px-2", withLeftIcon: "pl-8", withRightIcon: "pr-8" },
  sm: { normal: "px-3", withLeftIcon: "pl-9", withRightIcon: "pr-9" },
  md: { normal: "px-4", withLeftIcon: "pl-10", withRightIcon: "pr-10" },
  lg: { normal: "px-5", withLeftIcon: "pl-11", withRightIcon: "pr-11" },
  xl: { normal: "px-6", withLeftIcon: "pl-12", withRightIcon: "pr-12" },
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      type = "text",
      size = "md",
      error = false,
      helperText,
      label,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const padding = paddingClasses[size] || paddingClasses.md;
    const leftPadding = leftIcon
      ? padding.withLeftIcon
      : padding.normal.replace("px-", "pl-");
    const rightPadding = rightIcon
      ? padding.withRightIcon
      : padding.normal.replace("px-", "pr-");

    // Build input classes
    const inputClasses = [
      // Base styles
      "w-full font-body leading-base",
      "bg-background text-text",
      "border border-solid rounded-md",
      "outline-none transition-colors duration-150",
      // Size classes
      sizeClasses[size] || sizeClasses.md,
      // Padding
      leftPadding,
      rightPadding,
      // Border color based on error state
      error ? "border-error" : "border-text-lighter",
      // Hover/focus states
      !disabled && "hover:border-text-light",
      "focus:border-primary focus:ring-1 focus:ring-primary",
      // Disabled state
      disabled && "opacity-50 cursor-not-allowed bg-surface-2",
      // Placeholder
      "placeholder:text-text-lighter",
      // File input styles
      "file:mr-4 file:py-2 file:px-4 file:border-0 file:border-r file:border-surface-3",
      "file:text-sm file:font-medium file:bg-surface file:text-text",
      "file:cursor-pointer file:hover:bg-surface-2",
    ]
      .filter(Boolean)
      .join(" ");

    // Label classes
    const labelClasses = "block font-body text-sm font-medium text-text mb-2";

    // Helper text classes
    const helperTextClasses = [
      "block font-body text-xs mt-2",
      error ? "text-error" : "text-text-light",
    ].join(" ");

    // Icon classes
    const iconClasses =
      "absolute top-1/2 -translate-y-1/2 text-text-light pointer-events-none";

    return (
      <div className="relative">
        {label && <label className={labelClasses}>{label}</label>}

        <div className="relative">
          {leftIcon && (
            <span className={`${iconClasses} left-3`}>{leftIcon}</span>
          )}

          <input
            type={type}
            className={`${inputClasses} ${className}`}
            ref={ref}
            disabled={disabled}
            {...props}
          />

          {rightIcon && (
            <span className={`${iconClasses} right-3`}>{rightIcon}</span>
          )}
        </div>

        {helperText && <span className={helperTextClasses}>{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
