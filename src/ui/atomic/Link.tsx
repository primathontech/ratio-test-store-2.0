"use client";

import * as React from "react";
import NextLink from "next/link";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Whether to use Next.js Link component
   */
  asNextLink?: boolean;

  /**
   * Link variant
   */
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "underline"
    | "hover-underline";

  /**
   * Link size
   */
  size?: "sm" | "base" | "lg";

  /**
   * Whether the link is external
   */
  external?: boolean;
}

/**
 * Variant class mappings
 */
const variantClasses: Record<string, string> = {
  default: "text-primary no-underline",
  primary: "text-primary no-underline font-medium",
  secondary: "text-secondary no-underline font-medium",
  underline: "text-primary underline underline-offset-4",
  "hover-underline": "text-primary no-underline hover:underline",
};

/**
 * Size class mappings
 */
const sizeClasses: Record<string, string> = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className = "",
      href = "#",
      asNextLink = true,
      variant = "default",
      size = "base",
      external = false,
      children,
      ...props
    },
    ref
  ) => {
    // Build class list
    const linkClasses = [
      "font-body cursor-pointer",
      "transition-colors duration-150",
      variantClasses[variant] || variantClasses.default,
      sizeClasses[size] || sizeClasses.base,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const linkProps = {
      ref,
      className: linkClasses,
      ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
      ...props,
    };

    if (
      asNextLink &&
      !external &&
      typeof href === "string" &&
      href.startsWith("/")
    ) {
      return (
        <NextLink href={href} {...linkProps}>
          {children}
        </NextLink>
      );
    }

    return (
      <a href={href} {...linkProps}>
        {children}
      </a>
    );
  }
);

Link.displayName = "Link";
