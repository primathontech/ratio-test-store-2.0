import React from "react";
import { BottomBarProps, DEFAULT_COPYRIGHT_TEXT } from "../types";
import "../style.css";

/**
 * BottomBar V1 Component
 *
 * A minimal copyright bar at the very bottom of the page.
 * Cloned from nintarababy.in bottom bar.
 *
 * Features:
 * - Centered copyright text
 * - Warm cream background (#f5ead3)
 * - Responsive padding (desktop vs mobile)
 * - Mobile safe-area margin bottom
 * - No interactivity, purely static
 */
export function V1({ data, settings, className }: BottomBarProps) {
  const copyrightText =
    settings?.copyrightText ?? data?.copyrightText ?? DEFAULT_COPYRIGHT_TEXT;

  return (
    <section
      className={`nintara-bottom-bar ${className ?? ""}`}
      aria-label="Copyright"
    >
      <div className="nintara-bottom-bar__container">
        <p className="nintara-bottom-bar__copyright">{copyrightText}</p>
      </div>
    </section>
  );
}

export { V1 as default };
