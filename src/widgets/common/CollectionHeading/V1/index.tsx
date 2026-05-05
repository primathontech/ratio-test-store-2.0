"use client";

import React, { memo } from "react";
import { CollectionHeadingProps } from "../types";

/**
 * CollectionHeading V1
 *
 * Simple collection title with a horizontal divider (border-bottom).
 *
 * Layout by breakpoint:
 * - 360px (mobile):  pt-[25px] pb-3.5, px-[15px], left-aligned, 20px/24px font, no visible divider
 * - 768px (tablet):  pt-12 pb-[27px], px-[30px], left-aligned, 32px/38px font, 1px divider
 * - 1024px (desktop): pt-12 pb-[27px], px-[30px], left-aligned, 32px/38px font, 1px divider
 * - 1440px (desktop): pt-14 pb-8, px-[50px], centered, 32px/38px font, 1px divider
 *
 * Container: max-width 1400px at 1440px, auto-centered
 */
export const V1 = memo(function V1({ settings }: CollectionHeadingProps) {
  const title = settings?.title || "Shampoo";
  const showDivider = settings?.showDivider !== false;
  const dividerColor = settings?.dividerColor || "rgb(217, 217, 217)";

  return (
    <section
      className="w-full"
      style={{ backgroundColor: "#ffffff" }}
      aria-label={title}
    >
      {/* Outer wrapper — section vertical padding */}
      <div
        className="pt-[25px] pb-3.5 md:pt-12 md:pb-[27px] xl:pt-14 xl:pb-8"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Container — horizontal padding + max-width + auto center */}
        <div
          className="mx-auto px-[15px] md:px-[30px] xl:px-[50px]"
          style={{ maxWidth: "1400px" }}
        >
          {/* Content flex column — left-aligned by default, centered at xl */}
          <div
            className={`flex flex-col items-start xl:items-center gap-2.5${
              showDivider ? "" : ""
            }`}
            style={{
              position: "relative",
              zIndex: 3,
              borderBottom: showDivider ? `1px solid ${dividerColor}` : "none",
            }}
          >
            {/* H1 — the collection title */}
            <h1
              className="text-xl leading-[24px] md:text-[32px] md:leading-[38px] pb-0 md:pb-8"
              style={{
                fontWeight: 700,
                color: "#000000",
                letterSpacing: 0,
                margin: 0,
              }}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
});
