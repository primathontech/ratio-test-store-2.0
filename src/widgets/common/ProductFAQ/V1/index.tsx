"use client";

import React, { memo, useState, useCallback } from "react";
import Image from "next/image";
import { Box } from "@/ui/atomic";
import { ProductFAQProps, FAQItem } from "../types";
import {
  ProductMetadataKey,
  type ApiProductFaqCard,
} from "@/widgets/common/ProductDetail/types";

/* ------------------------------------------------------------------ */
/*  Inline helpers — equivalent to                                     */
/*    ProductAdditionalInfoSection/utils/getAdditionalInfoItems        */
/* ------------------------------------------------------------------ */

function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }
  if (value === null || value === undefined) {
    return [];
  }
  return [value as T];
}

function getFirstValue(value: unknown): string {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : "";
  }
  return typeof value === "string" ? value : "";
}

function transformFaqData(
  faqField: ApiProductFaqCard[] | ApiProductFaqCard | undefined
): FAQItem[] {
  const nodes = ensureArray<ApiProductFaqCard>(faqField);
  if (nodes.length === 0) {
    return [];
  }

  return nodes
    .map((item) => {
      const title = getFirstValue(item?.fields?.title?.value).trim();
      const description = getFirstValue(
        item?.fields?.description?.value
      ).trim();
      return { question: title, answer: description };
    })
    .filter((it) => it.question || it.answer);
}

/* ------------------------------------------------------------------ */
/*  Inline SVG — Chevron icon (upward arrow, rotates on open)          */
/*  Mirrors AdditionalInformation V1/V2 section-toggle arrow           */
/* ------------------------------------------------------------------ */

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`transition-transform duration-[400ms] delay-[100ms] ${isOpen ? "rotate-0" : "rotate-180"}`}
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
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
/*  Plus / minus toggle icon — cross-fades between plus_icon (closed)  */
/*  and minus_icon (open) with a slight rotation tween                 */
/* ------------------------------------------------------------------ */

const PlusMinusIcon = ({ isOpen }: { isOpen: boolean }) => (
  <span
    className="relative inline-flex items-center justify-center w-[16px] h-[16px]"
    aria-hidden="true"
  >
    <Image
      src="/svg/plus_icon.svg"
      alt=""
      width={14}
      height={14}
      className={`absolute inset-0 m-auto transition-all duration-[400ms] ease-in-out ${isOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}
    />
    <Image
      src="/svg/minus_icon.svg"
      alt=""
      width={14}
      height={7}
      className={`absolute inset-0 m-auto transition-all duration-[400ms] ease-in-out ${isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`}
    />
  </span>
);

/* ------------------------------------------------------------------ */
/*  Single accordion row                                               */
/* ------------------------------------------------------------------ */

const FAQAccordionItem = ({
  item,
  isOpen,
  onToggle,
  isFirst,
  isLast,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  isFirst: boolean;
  isLast: boolean;
}) => (
  <div
    data-testid="product-faq-item"
    className={`pb-[10px] mb-[10px] ${isFirst ? "" : "border-t border-[rgba(29,29,29,0.12)]"} ${isLast ? "border-b border-[rgba(29,29,29,0.12)]" : ""}`}
  >
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full flex items-center justify-between cursor-pointer bg-transparent border-0 outline-none py-[14px] px-0 text-left"
    >
      <span className="font-[Gotham,sans-serif] text-[16px] leading-[22px] md:text-[18px] md:leading-[26px] font-[500] md:font-[700] text-[#1D1D1D] pr-[16px]">
        {item.question}
      </span>
      <span className="flex items-center justify-center shrink-0 text-[#000000]">
        <PlusMinusIcon isOpen={isOpen} />
      </span>
    </button>

    <div
      className={`overflow-hidden transition-all duration-[400ms] ease-in-out ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
    >
      <div className="pt-[24px] pb-[22px] px-0">
        <p className="font-[Gotham,sans-serif] text-[12px] leading-[19px] md:text-[14px] md:leading-[22.4px] font-[400] text-[#545454] m-0">
          {item.answer}
        </p>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  V1 — ProductFAQ                                                    */
/*  Mirrors docs/ProductFaqSection DOM:                                */
/*    outer bg-[#F4F6F8] wrapper → Box card → title + accordion list   */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const handleToggleItem = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const [isSectionOpen, setIsSectionOpen] = useState<boolean>(
    settings?.defaultExpanded ?? true
  );
  const handleToggleSection = useCallback(() => {
    setIsSectionOpen((prev) => !prev);
  }, []);

  const product = data?.success ? data.data : null;
  if (!product) {
    return null;
  }

  const apiFaq = product.metadata?.[ProductMetadataKey.PRODUCT_FAQ]?.value;
  const apiItems = transformFaqData(apiFaq);
  const items: FAQItem[] =
    apiItems.length > 0 ? apiItems : settings?.items || [];

  if (items.length === 0) {
    return null;
  }

  const title = settings?.title || settings?.sectionTitle || "FAQ";

  return (
    <div
      data-testid="product-faq-section-container"
      className={`bg-[#F4F6F8] xl:px-[30px] ${className || ""}`}
    >
      <Box className="max-w-[1400px] mx-auto px-[16px] md:px-[24px] rounded-3xl bg-white border-b border-[#ECECEC]">
        <button
          type="button"
          onClick={handleToggleSection}
          aria-expanded={isSectionOpen}
          className="w-full flex items-center justify-between cursor-pointer bg-transparent border-0 outline-none py-[24px] md:py-[38px] text-left"
        >
          <h5 className="font-[Gotham,sans-serif] text-[16px] md:text-[24px] leading-[29px] font-[400] md:font-[700] text-[#000000] m-0">
            {title}
          </h5>
          <span className="flex items-center justify-center w-[18px] h-[18px] text-[#1d1d1d] shrink-0 ml-[16px]">
            <ChevronIcon isOpen={isSectionOpen} />
          </span>
        </button>

        <div
          className={`overflow-hidden transition-all duration-[400ms] ease-in-out ${isSectionOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          {items.map((item, index) => (
            <FAQAccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggleItem(index)}
              isFirst={index === 0}
              isLast={index === items.length - 1}
            />
          ))}
        </div>
      </Box>
    </div>
  );
});
