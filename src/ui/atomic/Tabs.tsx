"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const listClasses = [
    "inline-flex h-10 items-center justify-center",
    "bg-surface-2 rounded-md p-1",
    "text-text-light",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <TabsPrimitive.List ref={ref} className={listClasses} {...props} />;
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const triggerClasses = [
    "inline-flex items-center justify-center whitespace-nowrap",
    "px-3 py-1.5 rounded-sm",
    "font-body text-sm font-medium",
    "transition-all duration-200",
    "ring-offset-background",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[state=active]:bg-background data-[state=active]:text-text data-[state=active]:shadow-sm",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TabsPrimitive.Trigger ref={ref} className={triggerClasses} {...props} />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => {
  const contentClasses = [
    "mt-4",
    "ring-offset-background",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TabsPrimitive.Content ref={ref} className={contentClasses} {...props} />
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
