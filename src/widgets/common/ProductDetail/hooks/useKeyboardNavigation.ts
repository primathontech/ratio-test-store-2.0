"use client";

import { useEffect } from "react";

interface UseKeyboardNavigationProps {
  isZoomOpen: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Wires `←` / `→` keys to slide navigation while the zoom modal is closed.
 * The zoom modal owns its own keyboard handler, so we early-return when it's open.
 */
export const useKeyboardNavigation = ({
  isZoomOpen,
  onPrevious,
  onNext,
}: UseKeyboardNavigationProps): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomOpen) {
        return;
      }
      if (e.key === "ArrowLeft") {
        onPrevious();
      } else if (e.key === "ArrowRight") {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen, onPrevious, onNext]);
};
