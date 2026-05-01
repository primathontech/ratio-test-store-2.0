"use client";

import React, { memo, useState, useCallback } from "react";
import { FaqAccordionProps, FaqItem } from "../types";

/* ------------------------------------------------------------------ */
/*  Inline SVG -- Chevron icon (draws an UP arrow)                     */
/*  In collapsed state: rotated 180deg (points DOWN)                   */
/*  In expanded state: identity (points UP)                            */
/* ------------------------------------------------------------------ */

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={[
      "transition-transform duration-[400ms] delay-[100ms]",
      isOpen ? "rotate-0" : "rotate-180",
    ].join(" ")}
    xmlns="http://www.w3.org/2000/svg"
    width="11"
    height="7"
    viewBox="0 0 11 7"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M-2.40413e-07 5.5L5.5 -2.40413e-07L11 5.5L10.0237 6.47625L5.5 1.9525L0.976249 6.47625L-2.40413e-07 5.5Z"
      fill="currentColor"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Single FAQ Accordion Item                                          */
/* ------------------------------------------------------------------ */

const FaqAccordionItem = ({
  item,
  isOpen,
  onToggle,
  isFirst,
  isLast,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  isFirst: boolean;
  isLast: boolean;
}) => {
  return (
    <div
      className={[
        isFirst ? "" : "border-t border-[rgba(29,29,29,0.12)]",
        isLast ? "border-b border-[rgba(29,29,29,0.12)]" : "",
      ].join(" ")}
    >
      {/* Question row -- summary */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={[
          "w-full flex items-left justify-between",
          "cursor-pointer",
          "bg-transparent border-0 outline-none",
          "py-[14px] px-0",
          "text-left",
          "list-none",
          "[&::-webkit-details-marker]:hidden",
        ].join(" ")}
      >
        <span
          className={[
            "font-[Gotham,sans-serif]",
            "text-[14px] leading-[22px] md:text-[16px] md:leading-[26px]",
            "font-[500]",
            "text-[#000000]",
            "pr-[16px]",
          ].join(" ")}
        >
          {item.question}
        </span>
        <span
          className={[
            "flex items-center justify-center",
            "shrink-0",
            "text-[#000000]",
          ].join(" ")}
        >
          <ChevronIcon isOpen={isOpen} />
        </span>
      </button>

      {/* Answer panel */}
      <div
        className={[
          "overflow-hidden",
          "transition-all duration-[400ms] ease-in-out",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="pt-[24px] pb-[22px] px-0">
          <p
            className={[
              "font-[Gotham,sans-serif]",
              "text-[12px] leading-[19px] md:text-[14px] md:leading-[22.4px]",
              "font-[400]",
              "text-[#545454]",
              "m-0",
            ].join(" ")}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  V1 -- FaqAccordion (Collection-page FAQ section)                   */
/*  Heading "FAQ" centered + flat accordion list, one-open-at-a-time   */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ settings, className }: FaqAccordionProps) {
  const title = settings?.title || "FAQ";
  const items = settings?.items || [];

  /* Only one item open at a time -- null means all collapsed */
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggleItem = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section className={["bg-[#ffffff]", className || ""].join(" ")}>
      {/* Container -- max-width 1400px, centered, horizontal padding */}
      <div
        className={[
          "mx-auto max-w-[1400px]",
          "px-[15px] py-[24px]",
          "md:px-[50px] md:py-[24px]",
        ].join(" ")}
      >
        {/* Section heading */}
        <h5
          className={[
            "font-[Gotham,sans-serif] text-[18px] leading-[22px] md:text-[22px] md:leading-[26px] font-[400] text-[#000000]",
          ].join(" ")}
        >
          {title}
        </h5>

        {/* Accordion list */}
        <div>
          {items.map((item, index) => (
            <FaqAccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggleItem(index)}
              isFirst={index === 0}
              isLast={index === items.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
