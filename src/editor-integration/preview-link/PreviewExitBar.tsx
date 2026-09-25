"use client";

import { useEffect, useState } from "react";

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
      className="fixed bottom-4 left-1/2 z-[2147483647] flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#374151] bg-[#111827] px-3.5 py-2 font-[system-ui] text-[13px] font-medium leading-none text-white shadow-lg"
    >
      <span
        aria-hidden
        className="inline-block h-2 w-2 rounded-full bg-[#f5b301]"
      />
      <span>Preview mode</span>
      <button
        type="button"
        onClick={exit}
        className="cursor-pointer appearance-none rounded-full border border-[#111827] bg-white px-3 py-[5px] text-xs font-semibold text-[#111827]"
      >
        Exit preview
      </button>
    </div>
  );
}

export default PreviewExitBar;
