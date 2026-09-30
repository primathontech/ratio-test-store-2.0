"use client";

import { useState, useEffect, useCallback } from "react";
import { usePreviewBreakpoint } from "@/hooks/previewBreakpointContext";

export type Breakpoint = "mobile" | "tablet" | "desktop";

const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  tabletWide: 992, // bblunt.com card-count split inside the tablet range
  desktop: 1024,
  mobileTab: 1150, // iPad and tablet range threshold
} as const;

/**
 * Hook to detect current breakpoint and provide responsive utilities.
 * When rendered inside the editor preview iframe, reads the breakpoint
 * from PreviewBreakpointContext instead of measuring window.innerWidth.
 */
export function useResponsive() {
  const previewBreakpoint = usePreviewBreakpoint();

  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isTabletWide, setIsTabletWide] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobileTab, setIsMobileTab] = useState(false);

  const updateBreakpoint = useCallback(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1024;

    if (width < BREAKPOINTS.tablet) {
      setBreakpoint("mobile");
      setIsMobile(true);
      setIsTablet(false);
      setIsTabletWide(false);
      setIsDesktop(false);
      setIsMobileTab(true);
    } else if (width < BREAKPOINTS.tabletWide) {
      // Lower tablet range (768–991)
      setBreakpoint("tablet");
      setIsMobile(false);
      setIsTablet(true);
      setIsTabletWide(false);
      setIsDesktop(false);
      setIsMobileTab(true);
    } else if (width < BREAKPOINTS.mobileTab) {
      // Upper tablet range (992–1149) — bblunt.com bumps to 4 cards here
      setBreakpoint("tablet");
      setIsMobile(false);
      setIsTablet(true);
      setIsTabletWide(true);
      setIsDesktop(false);
      setIsMobileTab(true);
    } else {
      setBreakpoint("desktop");
      setIsMobile(false);
      setIsTablet(false);
      setIsTabletWide(false);
      setIsDesktop(true);
      setIsMobileTab(false);
    }
  }, []);

  // Editor path: toolbar breakpoint drives state inside the preview iframe.
  useEffect(() => {
    if (!previewBreakpoint) {
      return;
    }
    const mobile = previewBreakpoint === "mobile";
    const tablet = previewBreakpoint === "tablet";
    setBreakpoint(previewBreakpoint);
    setIsMobile(mobile);
    setIsTablet(tablet);
    setIsTabletWide(false);
    setIsDesktop(previewBreakpoint === "desktop");
    setIsMobileTab(mobile || tablet);
  }, [previewBreakpoint]);

  // Core path: measure window width and listen for resize events.
  // Skipped when the editor is controlling the breakpoint.
  useEffect(() => {
    if (previewBreakpoint) {
      return;
    }
    updateBreakpoint();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateBreakpoint);
      return () => window.removeEventListener("resize", updateBreakpoint);
    }
  }, [previewBreakpoint, updateBreakpoint]);

  return {
    breakpoint,
    isMobile,
    isTablet,
    isTabletWide,
    isDesktop,
    isMobileOrTablet: isMobile || isTablet,
    isMobileTab,
  };
}

export default useResponsive;
