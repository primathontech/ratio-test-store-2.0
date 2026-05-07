"use client";

import { useEffect } from "react";

/** Lock background body scroll while an overlay/modal is open. */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}
