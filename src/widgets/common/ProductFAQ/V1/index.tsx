"use client";

import React, { memo, useState, useCallback } from "react";
import { ProductFAQProps, FAQItem } from "../types";

/* ------------------------------------------------------------------ */
/*  Inline SVG -- Chevron icon for outer accordion header              */
/* ------------------------------------------------------------------ */

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="14"
    height="8"
    viewBox="0 0 14 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={[
      "transition-transform duration-300",
      isOpen ? "rotate-180" : "rotate-0",
    ].join(" ")}
  >
    <path
      d="M1 1L7 7L13 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Plus / Minus icon for individual FAQ items                         */
/* ------------------------------------------------------------------ */

const PlusMinusIcon = ({ isOpen }: { isOpen: boolean }) => (
  <span
    className={[
      "flex items-center justify-center",
      "w-[20px] h-[20px]",
      "text-[20px] leading-[20px]",
      "font-[Gotham,sans-serif] font-[400]",
      "text-[#1d1d1d]",
      "select-none shrink-0",
      "transition-transform duration-300",
    ].join(" ")}
    aria-hidden="true"
  >
    {isOpen ? "\u2212" : "+"}
  </span>
);

/* ------------------------------------------------------------------ */
/*  Single FAQ Accordion Item                                          */
/* ------------------------------------------------------------------ */

const FAQAccordionItem = ({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <li className="border-b border-[rgba(29,29,29,0.12)] last:border-b-0">
      {/* Question row */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={[
          "w-full flex items-center justify-between",
          "cursor-pointer",
          "bg-transparent border-0 outline-none",
          "py-[20px] px-[32px]",
          "text-left",
          "transition-all duration-300",
        ].join(" ")}
      >
        <span
          className={[
            "font-[Gotham,sans-serif]",
            "text-[14px] leading-[22px] md:text-[16px] md:leading-[26px]",
            "font-[700]",
            "text-[#1d1d1d]",
            "pr-[16px]",
          ].join(" ")}
        >
          {item.question}
        </span>
        <PlusMinusIcon isOpen={isOpen} />
      </button>

      {/* Answer panel */}
      <div
        className={[
          "overflow-hidden",
          "transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="px-[32px] pb-[14px]">
          <p
            className={[
              "font-[Gotham,sans-serif]",
              "text-[14px] leading-[22px] md:text-[16px] md:leading-[26px]",
              "font-[400]",
              "text-[#555555]",
              "m-0",
            ].join(" ")}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </li>
  );
};

/* ------------------------------------------------------------------ */
/*  V1 -- ProductFAQ (Outer accordion + inner FAQ list)                */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ settings, className }: ProductFAQProps) {
  const title = settings?.title || "Product FAQs";
  const items = settings?.items || [];
  const defaultExpanded = settings?.defaultExpanded ?? true;

  const [sectionOpen, setSectionOpen] = useState(defaultExpanded);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggleSection = useCallback(() => {
    setSectionOpen((prev) => !prev);
  }, []);

  const handleToggleItem = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section className={["bg-[#f4f6f8]", className || ""].join(" ")}>
      {/* Container -- max-width 1400px, centered */}
      <div className="mx-auto max-w-[1400px]">
        {/* Outer accordion wrapper */}
        <div>
          {/* Section header -- "Product FAQs" + chevron */}
          <button
            type="button"
            onClick={handleToggleSection}
            aria-expanded={sectionOpen}
            className={[
              "w-full flex items-center justify-between",
              "cursor-pointer",
              "bg-transparent border-0 outline-none",
              "py-[40px] px-[32px]",
              "md:py-[40px] md:px-[32px]",
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
                "w-[24px] h-[24px]",
                "text-[#1d1d1d]",
                "transition-colors duration-300",
              ].join(" ")}
            >
              <ChevronIcon isOpen={sectionOpen} />
            </span>
          </button>

          {/* Collapsible FAQ list */}
          <div
            className={[
              "overflow-hidden",
              "transition-all duration-300 ease-in-out",
              sectionOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div className="px-[0px]">
              <ul className="list-none m-0 p-0">
                {items.map((item, index) => (
                  <FAQAccordionItem
                    key={index}
                    item={item}
                    isOpen={openIndex === index}
                    onToggle={() => handleToggleItem(index)}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
