"use client";

import React, { memo, useState, useCallback } from "react";
import { AdditionalInformationProps, InfoBlock } from "../types";
import { ProductMetadataKey } from "@/widgets/common/ProductDetail/types";

/* ------------------------------------------------------------------ */
/*  Inline SVG -- Chevron icon (upward arrow, rotates on open)         */
/* ------------------------------------------------------------------ */

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={[
      "transition-transform duration-[400ms] delay-[100ms]",
      isOpen ? "rotate-180" : "rotate-0",
    ].join(" ")}
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 11 7"
    fill="none"
  >
    <path
      d="M-2.40413e-07 5.5L5.5 -2.40413e-07L11 5.5L10.0237 6.47625L5.5 1.9525L0.976249 6.47625L-2.40413e-07 5.5Z"
      fill="currentColor"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  V1 -- AdditionalInformation (Collapsible accordion with info grid) */
/* ------------------------------------------------------------------ */

/** Build info blocks from API product metadata */
function buildInfoFromApi(metadata: Record<string, unknown>): InfoBlock[] {
  const blocks: InfoBlock[] = [];
  const m = metadata as Record<string, { value?: unknown }>;

  if (m[ProductMetadataKey.MANUFACTURER]?.value) {
    blocks.push({
      label: "MANUFACTURER",
      value: String(m[ProductMetadataKey.MANUFACTURER]!.value).trim(),
    });
  }
  if (m[ProductMetadataKey.LICENSE_NUMBER]?.value) {
    blocks.push({
      label: "LICENSE NUMBER",
      value: String(m[ProductMetadataKey.LICENSE_NUMBER]!.value),
    });
  }
  if (m[ProductMetadataKey.BEST_BEFORE]?.value) {
    blocks.push({
      label: "BEST BEFORE",
      value: String(m[ProductMetadataKey.BEST_BEFORE]!.value),
    });
  }
  if (m[ProductMetadataKey.DIMENSIONS]?.value) {
    blocks.push({
      label: "DIMENSIONS",
      value: String(m[ProductMetadataKey.DIMENSIONS]!.value),
    });
  }
  if (m[ProductMetadataKey.GENERIC_NAME]?.value) {
    blocks.push({
      label: "GENERIC NAME",
      value: String(m[ProductMetadataKey.GENERIC_NAME]!.value),
    });
  }
  return blocks;
}

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: AdditionalInformationProps) {
  const product = data?.success ? data.data : null;

  const title = settings?.title || "Additional Information";
  const defaultExpanded = settings?.defaultExpanded ?? false;

  // Build items from API metadata or fall back to settings
  const items: InfoBlock[] = product?.metadata
    ? buildInfoFromApi(product.metadata)
    : settings?.items || [];

  const [isOpen, setIsOpen] = useState(defaultExpanded);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Hide widget when no info blocks are available
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={["bg-[#ffffff]", className || ""].join(" ")}>
      {/* Container -- max-width 1400px, centered */}
      <div
        className={[
          "mx-auto max-w-[1400px]",
          "px-[15px] py-[24px]",
          "md:px-[50px] md:py-[32px]",
        ].join(" ")}
      >
        {/* Accordion wrapper */}
        <div>
          {/* Summary / trigger button */}
          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={isOpen}
            className={[
              "w-full flex items-center justify-between",
              "cursor-pointer",
              "bg-transparent border-0 outline-none",
              "pb-[10px]",
              "border-b border-[#1d1d1d]",
              "text-left",
              "transition-all duration-300",
            ].join(" ")}
          >
            <span
              className={[
                "font-[Gotham,sans-serif]",
                "text-[20px] leading-[26px] md:text-[24px] md:leading-[29px]",
                "font-[700]",
                "text-[#1d1d1d]",
              ].join(" ")}
            >
              {title}
            </span>
            <span
              className={[
                "flex items-center justify-center",
                "w-[18px] h-[18px]",
                "text-[#1d1d1d]",
                "shrink-0 ml-[16px]",
              ].join(" ")}
            >
              <ChevronIcon isOpen={isOpen} />
            </span>
          </button>

          {/* Collapsible content */}
          <div
            className={[
              "overflow-hidden",
              "transition-all duration-[400ms] ease-in-out",
              isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div
              className={[
                "pt-[20px]",
                "grid grid-cols-1 md:grid-cols-2",
                "gap-[20px]",
              ].join(" ")}
            >
              {items.map((item, index) => (
                <div key={index}>
                  <h4
                    className={[
                      "font-[Gotham,sans-serif]",
                      "text-[12px] leading-[14px]",
                      "font-[700]",
                      "uppercase",
                      "text-[#1d1d1d]",
                      "m-0 mb-[6px]",
                    ].join(" ")}
                  >
                    {item.label}
                  </h4>
                  <p
                    className={[
                      "font-[Gotham,sans-serif]",
                      "text-[12px] leading-[19px]",
                      "font-[400]",
                      "text-[#1d1d1d]",
                      "m-0",
                      "whitespace-pre-line",
                    ].join(" ")}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
