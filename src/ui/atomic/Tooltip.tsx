"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import type { BaseComponentProps } from "./types";

export interface TooltipProps extends BaseComponentProps {
  /**
   * The content to display inside the tooltip
   */
  content: React.ReactNode;

  /**
   * The element that will trigger the tooltip
   */
  children: React.ReactNode;

  /**
   * The side of the trigger where the tooltip will appear
   */
  side?: "top" | "right" | "bottom" | "left";

  /**
   * The alignment of the tooltip relative to the trigger
   */
  align?: "start" | "center" | "end";

  /**
   * The delay in milliseconds before showing the tooltip
   */
  delayDuration?: number;

  /**
   * The delay in milliseconds before hiding the tooltip
   */
  skipDelayDuration?: number;

  /**
   * Whether the tooltip should be disabled
   */
  disabled?: boolean;

  /**
   * Whether the tooltip should be open by default
   */
  defaultOpen?: boolean;

  /**
   * Custom styles for the tooltip
   */
  style?: React.CSSProperties;

  /**
   * Control the open state of the tooltip
   */
  open?: boolean;

  /**
   * Callback when the open state changes
   */
  onOpenChange?: (open: boolean) => void;
}

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  const contentClasses = [
    "tooltip-content z-50 overflow-hidden",
    "bg-black text-white",
    "font-body text-xs font-medium leading-tight",
    "px-3 py-1.5 rounded",
    "shadow-md",
    "max-w-xs",
    "animate-in fade-in-0 zoom-in-95",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <style jsx global>{`
        .tooltip-arrow {
          position: absolute;
          width: 8px;
          height: 8px;
          z-index: -1;
          background-color: #000000;
          transform: rotate(45deg);
          border: none;
        }

        .tooltip-content[data-side="top"] .tooltip-arrow {
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
        }

        .tooltip-content[data-side="bottom"] .tooltip-arrow {
          top: -4px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
        }

        .tooltip-content[data-side="left"] .tooltip-arrow {
          right: -4px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        }

        .tooltip-content[data-side="right"] .tooltip-arrow {
          left: -4px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
        }

        .tooltip-content[data-side="top"][data-align="start"] .tooltip-arrow,
        .tooltip-content[data-side="bottom"][data-align="start"] .tooltip-arrow {
          left: 12px;
          transform: rotate(45deg);
        }

        .tooltip-content[data-side="top"][data-align="end"] .tooltip-arrow,
        .tooltip-content[data-side="bottom"][data-align="end"] .tooltip-arrow {
          right: 12px;
          left: auto;
          transform: rotate(45deg);
        }

        .tooltip-content[data-side="left"][data-align="start"] .tooltip-arrow,
        .tooltip-content[data-side="right"][data-align="start"] .tooltip-arrow {
          top: 12px;
          transform: rotate(45deg);
        }

        .tooltip-content[data-side="left"][data-align="end"] .tooltip-arrow,
        .tooltip-content[data-side="right"][data-align="end"] .tooltip-arrow {
          bottom: 12px;
          top: auto;
          transform: rotate(45deg);
        }
      `}</style>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={contentClasses}
        {...props}
      >
        {props.children}
        <div className="tooltip-arrow" />
      </TooltipPrimitive.Content>
    </>
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children,
      content,
      side = "top",
      align = "center",
      delayDuration = 300,
      skipDelayDuration = 300,
      disabled = false,
      defaultOpen,
      open,
      onOpenChange,
      className,
      style,
      ...props
    },
    ref
  ) => {
    if (disabled) {
      return <>{children}</>;
    }

    return (
      <TooltipProvider
        delayDuration={delayDuration}
        skipDelayDuration={skipDelayDuration}
      >
        <TooltipRoot
          defaultOpen={defaultOpen}
          open={open}
          onOpenChange={onOpenChange}
        >
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent
            ref={ref}
            side={side}
            align={align}
            className={className}
            style={style}
            {...props}
          >
            {content}
            <div className="tooltip-arrow" />
          </TooltipContent>
        </TooltipRoot>
      </TooltipProvider>
    );
  }
);

Tooltip.displayName = "Tooltip";

export { Tooltip };
