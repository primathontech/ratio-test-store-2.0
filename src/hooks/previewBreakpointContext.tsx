"use client";

import React, { createContext, useContext } from "react";

export type PreviewBreakpoint = "mobile" | "tablet" | "desktop" | null;

const PreviewBreakpointContext = createContext<PreviewBreakpoint>(null);

interface PreviewBreakpointProviderProps {
  breakpoint: PreviewBreakpoint;
  children: React.ReactNode;
}

export const PreviewBreakpointProvider: React.FC<
  PreviewBreakpointProviderProps
> = ({ breakpoint, children }) => {
  return (
    <PreviewBreakpointContext.Provider value={breakpoint}>
      {children}
    </PreviewBreakpointContext.Provider>
  );
};

export const usePreviewBreakpoint = () => useContext(PreviewBreakpointContext);
