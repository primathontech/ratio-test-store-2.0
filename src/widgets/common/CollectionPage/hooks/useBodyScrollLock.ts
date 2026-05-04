import { useEffect } from "react";

export const useBodyScrollLock = (isOpen: boolean) => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalStyle;
    }

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);
};
