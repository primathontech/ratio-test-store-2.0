"use client";

import type { RouteContext, SectionConfig } from "@shopkit/builder";
import { DEFAULT_BREAKPOINTS, SECTION_TYPES } from "@shopkit/builder";
import React, { useEffect, useState } from "react";

interface SectionWrapperProps {
  section: SectionConfig;
  children: React.ReactNode[];
  styles: Record<string, any>;
  routeContext?: RouteContext;
  /** Optional breakpoint override (used in editor mode) */
  breakpoint?: "mobile" | "tablet" | "desktop";
}

/**
 * Simple Section Wrapper Component with Responsive Support
 *
 * Uses configured breakpoints from responsive-types.
 * Applies section-level settings with responsive overrides.
 * Widget layout is handled within each widget.
 */
export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  section,
  children,
  styles,
  breakpoint: overrideBreakpoint,
}) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");

  // Use override breakpoint if provided, otherwise detect from window width
  useEffect(() => {
    if (overrideBreakpoint) {
      setCurrentBreakpoint(overrideBreakpoint);
      return;
    }

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width <= DEFAULT_BREAKPOINTS.mobile.max) {
        setCurrentBreakpoint("mobile");
      } else if (
        width >= DEFAULT_BREAKPOINTS.tablet.min &&
        width <= DEFAULT_BREAKPOINTS.tablet.max
      ) {
        setCurrentBreakpoint("tablet");
      } else {
        setCurrentBreakpoint("desktop");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, [overrideBreakpoint]);

  const responsive = section.settings.responsive;

  // In editor mode, use JS-based visibility since the viewport is simulated.
  if (overrideBreakpoint) {
    const bpConfig = responsive?.[overrideBreakpoint] || null;
    const isVisible =
      bpConfig && typeof bpConfig.visible === "boolean"
        ? bpConfig.visible
        : true;
    if (!isVisible) {
      return null;
    }
  }

  // Build CSS visibility classes — applied at the element level so the browser
  // hides sections via media queries before any JS runs (no flash).
  const visibilityClasses = [
    responsive?.mobile?.visible === false ? "hidden-mobile" : null,
    responsive?.tablet?.visible === false ? "hidden-tablet" : null,
    responsive?.desktop?.visible === false ? "hidden-desktop" : null,
  ]
    .filter(Boolean)
    .join(" ");

  // Default padding values
  const defaultPadding = { top: 0, right: 0, bottom: 0, left: 0 };

  const breakpointConfig = responsive?.[currentBreakpoint] || null;
  const responsiveSpacing = {
    padding:
      breakpointConfig?.padding || section.settings.padding || defaultPadding,
    margin: breakpointConfig?.margin || section.settings.margin,
  };

  // Ensure padding is defined
  const padding = responsiveSpacing.padding || defaultPadding;

  // Layout is always from base settings (not responsive)
  const { layout } = section.settings;

  // Special handling for header sections to ensure sticky positioning works
  if (section.type === SECTION_TYPES.HEADER_SECTION) {
    // For header sections, return children directly without section wrapper
    // This prevents any container interference with sticky positioning
    return <>{children}</>;
  }

  // Apply only container-level styling - no layout logic
  const sectionStyle: React.CSSProperties = {
    width: "100%",
    padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
    ...(responsiveSpacing.margin && {
      margin: `${responsiveSpacing.margin.top}px ${responsiveSpacing.margin.right}px ${responsiveSpacing.margin.bottom}px ${responsiveSpacing.margin.left}px`,
    }),
    // Apply container width constraint only if layout is 'page'
    ...(layout === "page" && {
      maxWidth:
        styles?.spacing?.container || "var(--spacing-container-xl, 1280px)",
      margin: "0 auto",
    }),
  };

  return (
    <section
      className={visibilityClasses || undefined}
      style={sectionStyle}
      data-breakpoint={currentBreakpoint}
    >
      {children}
    </section>
  );
};

export default SectionWrapper;
