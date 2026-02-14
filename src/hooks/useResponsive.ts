"use client";

import { useState, useEffect, useCallback } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  mobileTab: 1150, // iPad and tablet range threshold
} as const;

/**
 * Hook to detect current breakpoint and provide responsive utilities
 */
export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobileTab, setIsMobileTab] = useState(false);

  const updateBreakpoint = useCallback(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1024;

    if (width < BREAKPOINTS.tablet) {
      setBreakpoint("mobile");
      setIsMobile(true);
      setIsTablet(false);
      setIsDesktop(false);
      setIsMobileTab(true);
    } else if (width < BREAKPOINTS.mobileTab) {
      // iPad and tablet range (up to 1150px)
      setBreakpoint("tablet");
      setIsMobile(false);
      setIsTablet(true);
      setIsDesktop(false);
      setIsMobileTab(true);
    } else {
      setBreakpoint("desktop");
      setIsMobile(false);
      setIsTablet(false);
      setIsDesktop(true);
      setIsMobileTab(false);
    }
  }, []);

  useEffect(() => {
    updateBreakpoint();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateBreakpoint);
      return () => window.removeEventListener("resize", updateBreakpoint);
    }
  }, [updateBreakpoint]);

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet: isMobile || isTablet,
    isMobileTab,
  };
}

export default useResponsive;
