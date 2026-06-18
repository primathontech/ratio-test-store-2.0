"use client";

import { useEffect, useState } from "react";

/**
 * "Exit preview" control shown on the merchant site while viewing a shareable
 * preview link (?editorPreview=true&previewId=…), including across sticky
 * navigation (the middleware keeps a session via cookies).
 *
 * Deliberately a CLIENT component with ZERO server work:
 *   • It never calls next/headers, so it does NOT make the layout dynamic and
 *     cannot affect the editor's live-preview (editor-bridge) patching.
 *   • It renders null on the server and first paint, then resolves on mount —
 *     no hydration mismatch, no layout shift on normal pages.
 *   • It hides itself inside the editor iframe (?editor=true / ?previewKey),
 *     so the editing experience is untouched.
 *
 * Exit = navigate to ?editorPreview=false; the middleware clears the preview
 * cookies and the page reloads in normal (live) mode. No other app behavior
 * is touched.
 */
export function PreviewExitBar() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    // Never show inside the editor's own live preview.
    if (sp.get("editor") === "true" || sp.has("previewKey")) {
      return;
    }
    const fromLink = sp.get("editorPreview") === "true";
    const fromCookie = document.cookie
      .split("; ")
      .some((c) => c === "editorPreviewActive=1");
    setActive(fromLink || fromCookie);
  }, []);

  if (!active) {
    return null;
  }

  const exit = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("editorPreview", "false");
    url.searchParams.delete("previewId");
    url.searchParams.delete("version");
    // Full navigation so the middleware runs and clears the preview cookies.
    window.location.href = url.toString();
  };

  return (
    <div
      role="region"
      aria-label="Preview mode"
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2147483646,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 14px",
        borderRadius: 9999,
        background: "rgba(17, 24, 39, 0.95)",
        color: "#fff",
        fontSize: 13,
        fontWeight: 500,
        lineHeight: 1,
        boxShadow: "0 6px 24px rgba(0,0,0,0.28)",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#f5b301",
          display: "inline-block",
        }}
      />
      <span>Preview mode</span>
      <button
        type="button"
        onClick={exit}
        style={{
          appearance: "none",
          border: "1px solid rgba(255,255,255,0.35)",
          background: "transparent",
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          padding: "5px 12px",
          borderRadius: 9999,
          cursor: "pointer",
        }}
      >
        Exit preview
      </button>
    </div>
  );
}

export default PreviewExitBar;
