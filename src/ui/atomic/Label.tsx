"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

/**
 * Label Component
 *
 * A label component built on Radix UI Label primitive that uses Tailwind CSS
 * classes with CSS variables for theming.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email">Email</Label>
 * <Label className="text-primary">Custom Label</Label>
 * ```
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className = "", ...props }, ref) => {
  const baseClasses =
    "text-sm font-medium leading-base text-text font-body peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

  const combinedClassName = [baseClasses, className].filter(Boolean).join(" ");

  return (
    <LabelPrimitive.Root ref={ref} className={combinedClassName} {...props} />
  );
});

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
