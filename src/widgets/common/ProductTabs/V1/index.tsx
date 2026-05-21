"use client";

import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";

import { ProductTabsProps } from "../types";
import { ProductMetadataKey } from "@/widgets/common/ProductDetail/types";
import {
  filterValidTabs,
  transformProductDetailsData,
  type NormalizedCard,
  type NormalizedTab,
} from "../utils";

/* ------------------------------------------------------------------ */
/*  Inline SVG — Chevron icon (down arrow)                             */
/* ------------------------------------------------------------------ */

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    viewBox="0 0 14 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-3 h-2 md:w-4 md:h-2.5 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
  >
    <path
      d="M1 1L7 7L13 1"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Safe HTML renderer using ref + innerHTML                           */
/* ------------------------------------------------------------------ */

function SafeHtmlContent({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = html;
    }
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="rich-text-content text-sm leading-[24.4px] font-normal text-primary [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-bold [&_em]:italic [&_br]:block"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Renderers                                                          */
/* ------------------------------------------------------------------ */

const ListContent = ({ cards }: { cards: NormalizedCard[] }) => (
  <ul className="flex flex-col list-none p-0 m-0">
    {cards.map((card, i) => {
      const hasTitle = card.title && card.title.trim() !== "";
      const hasText = card.text && card.text.trim() !== "";
      if (!hasTitle && !hasText) {
        return null;
      }
      return (
        <li
          key={i}
          className="text-sm md:text-base leading-[22px] font-normal text-primary mt-4 first:mt-0"
        >
          {hasTitle && (
            <span className="font-bold">
              {card.title}
              {hasText ? " " : ""}
            </span>
          )}
          {hasText && <span>{card.text}</span>}
        </li>
      );
    })}
  </ul>
);

const CardsContent = ({ cards }: { cards: NormalizedCard[] }) => (
  <div className="flex flex-col gap-6">
    {cards.map((card, i) => {
      const hasTitle = card.title && card.title.trim() !== "";
      const hasText = card.text && card.text.trim() !== "";
      const hasImage = card.imageUrl && card.imageUrl.trim() !== "";
      if (!hasTitle && !hasText && !hasImage) {
        return null;
      }
      return (
        <div key={i} className="flex items-center gap-4">
          {hasImage && (
            <div className="shrink-0 w-[58px] md:w-[108px] h-[58px] md:h-[108px] relative">
              <Image
                src={card.imageUrl}
                alt={card.title || ""}
                fill
                className="object-cover rounded-[50%]"
                sizes="108px"
              />
            </div>
          )}
          <div className="flex flex-col">
            {hasTitle && (
              <span className="text-sm leading-[22px] font-bold text-loading-blue">
                {card.title}
              </span>
            )}
            {hasText && (
              <span className="text-sm md:text-base leading-[22px] font-normal text-primary mt-1">
                {card.text}
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Single Accordion Item                                              */
/* ------------------------------------------------------------------ */

const AccordionItem = ({
  tab,
  isOpen,
  onToggle,
}: {
  tab: NormalizedTab;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="bg-secondary rounded-[15px] mb-2 md:mb-4 overflow-hidden">
      {/* Summary / Header row */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group w-full flex items-center justify-between cursor-pointer bg-secondary rounded-[15px] border-0 outline-none transition-colors duration-300"
      >
        <span
          className={`text-base leading-[26px] md:text-2xl md:leading-[38px] font-normal md:font-bold py-6 px-4 md:pt-[38px] xl:px-6 transition-colors duration-300 ${isOpen ? "md:pb-4" : "md:pb-[38px]"} text-black group-hover:text-loading-blue`}
        >
          {tab.title}
        </span>
        <span className="flex items-center justify-center w-[10px] md:w-[54px] h-2 md:h-5 mr-6 xl:mr-6 text-[rgba(0,0,0,0.8)] group-hover:text-loading-blue transition-colors duration-300">
          <ChevronIcon isOpen={isOpen} />
        </span>
      </button>

      {/* Content panel */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className={`px-5 ${isOpen ? "pb-5" : "pb-0"}`}>
            {tab.type === "html" && <SafeHtmlContent html={tab.html} />}
            {tab.type === "list" && <ListContent cards={tab.cards} />}
            {tab.type === "cards" && <CardsContent cards={tab.cards} />}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  V1 — ProductTabs (Accordion layout)                                */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ data, className }: ProductTabsProps) {
  const product = data?.success ? data.data : null;

  const apiTabs =
    product?.metadata?.[ProductMetadataKey.PRODUCT_DETAILS]?.value;

  const validTabs = filterValidTabs(
    transformProductDetailsData(apiTabs, product?.description)
  );

  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  const handleToggle = useCallback((index: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  if (validTabs.length === 0) {
    return null;
  }

  return (
    <section className={`bg-[#f4f6f8] pt-2.5 pb-px ${className || ""}`}>
      <div className="mx-auto max-w-[1400px]">
        <div>
          {validTabs.map((tab, index) => (
            <AccordionItem
              key={index}
              tab={tab}
              isOpen={openIndexes.has(index)}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
