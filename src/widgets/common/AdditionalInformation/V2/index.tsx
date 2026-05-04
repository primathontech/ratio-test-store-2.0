"use client";

import React, { memo, useState, useCallback } from "react";
import { AdditionalInformationProps, ProseBlock } from "../types";

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
/*  ProseRenderer -- renders structured content blocks as React        */
/* ------------------------------------------------------------------ */

function ProseRenderer({ blocks }: { blocks: ProseBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        const key = `prose-${i}`;
        switch (block.type) {
          case "h1":
            return (
              <h1
                key={key}
                className="text-[22px] leading-[28px] md:text-[28px] md:leading-[34px] font-[700] m-0 mb-[10px]"
              >
                {block.text}
              </h1>
            );
          case "h2":
            return (
              <h2
                key={key}
                className="text-[18px] leading-[24px] md:text-[22px] md:leading-[28px] font-[700] mt-[20px] mb-[10px]"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={key}
                className="text-[16px] leading-[22px] md:text-[18px] md:leading-[24px] font-[700] mt-[16px] mb-[8px]"
              >
                {block.text}
              </h3>
            );
          case "p":
            return (
              <p
                key={key}
                className="text-[14px] leading-[22px] font-[400] m-0 mb-[10px]"
              >
                {block.text}
              </p>
            );
          case "ol":
            return (
              <ol
                key={key}
                className="list-decimal pl-[24px] m-0 mb-[10px] text-[14px] leading-[22px]"
              >
                {block.items?.map((item, j) => (
                  <li key={`${key}-li-${j}`} className="mb-[8px]">
                    {item}
                  </li>
                ))}
              </ol>
            );
          case "ul":
            return (
              <ul
                key={key}
                className="list-disc pl-[24px] m-0 mb-[10px] text-[14px] leading-[22px]"
              >
                {block.items?.map((item, j) => (
                  <li key={`${key}-li-${j}`} className="mb-[8px]">
                    {item}
                  </li>
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  V2 -- AdditionalInformation (SEO prose accordion)                  */
/*  Collapsed: heading row with chevron, 1px border bottom             */
/*  Expanded: rich prose content fades in (opacity transition)         */
/* ------------------------------------------------------------------ */

export const V2 = memo(function V2({
  settings,
  className,
}: AdditionalInformationProps) {
  const title = settings?.title || "Additional Information";
  const proseBlocks = settings?.proseBlocks || [];
  const defaultExpanded = settings?.defaultExpanded ?? false;

  const [isOpen, setIsOpen] = useState(defaultExpanded);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <section className={className || ""}>
      <div className="mx-auto max-w-[1400px] px-[15px] md:px-[50px]">
        <div>
          {/* Summary / trigger button */}
          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={isOpen}
            className={[
              "w-full flex items-center justify-between",
              "cursor-pointer bg-transparent border-0 outline-none",
              "py-[15px] md:py-[27px]",
              "border-b border-[rgba(29,29,29,0.12)]",
              "text-left",
            ].join(" ")}
          >
            <span className="text-[22px] leading-[26px] md:text-[28px] md:leading-[34px] font-[700] text-[#1d1d1d]">
              {title}
            </span>
            <span className="flex items-center justify-center w-[18px] h-[18px] text-[#1d1d1d] shrink-0 ml-[16px]">
              <ChevronIcon isOpen={isOpen} />
            </span>
          </button>

          {/* Collapsible rich-text content */}
          <div
            className={[
              "overflow-hidden transition-all duration-[400ms] ease-in-out",
              isOpen ? "max-h-[20000px] opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            {proseBlocks.length > 0 ? (
              <div className="text-[#1d1d1d] pt-[20px] pb-[20px]">
                <ProseRenderer blocks={proseBlocks} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
});
