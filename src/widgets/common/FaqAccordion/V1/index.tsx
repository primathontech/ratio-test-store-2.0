"use client";

import { useState } from "react";
import {
  ensureArray,
  getFirstValue,
} from "@/widgets/common/AdditionalInformation/utils/getAdditionalInfoItems";
import { FaqAccordionProps } from "../types";

export const COLLECTION_FAQ_METAFIELD_KEY = "collection_faq";

interface FAQItemData {
  id: string;
  question: string;
  answer: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformCollectionFaqData(faqField?: unknown): FAQItemData[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes = ensureArray<any>(faqField);
  if (nodes.length === 0) {
    return [];
  }

  return nodes.map((item, index) => {
    const title = (getFirstValue(item?.fields?.title?.value) || "").trim();
    const description = (
      getFirstValue(item?.fields?.description?.value) || ""
    ).trim();

    const id =
      typeof item?.id === "string" && item.id.trim() !== ""
        ? item.id.trim()
        : `faq-${index}`;

    return { id, question: title, answer: description };
  });
}

function FAQItem({
  item,
  isActive,
  onToggle,
}: {
  item: FAQItemData;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between border-b border-[#ebebeb] py-[15px] md:py-5 text-left cursor-pointer"
        aria-expanded={isActive}
      >
        <span className="text-[16px] leading-[1.2] font-medium text-black pr-2">
          {item.question}
        </span>
        <svg
          className={`flex-shrink-0 transition-transform duration-300 ${
            isActive ? "" : "rotate-180"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
        >
          <path
            d="M-2.40413e-07 5.5L5.5 -2.40413e-07L11 5.5L10.0237 6.47625L5.5 1.9525L0.976249 6.47625L-2.40413e-07 5.5Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>

      <div
        className={`grid transition-all duration-400 ease-in-out ${
          isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="py-[20px]">
            <p className="text-[14px] leading-[1.6] text-[#545454]">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function V1({ data, settings, className }: FaqAccordionProps) {
  const [activeIds, setActiveIds] = useState<string[]>([]);

  const collectionData = data?.data?.data;
  const metadata = collectionData?.collectionByHandle?.metadata;
  const faqField = metadata?.[COLLECTION_FAQ_METAFIELD_KEY]?.value;
  const faqItems = transformCollectionFaqData(faqField);

  if (!faqItems.length) {
    return null;
  }

  const title = settings?.title || "FAQ";

  const toggle = (id: string) => {
    setActiveIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section
      className={`mb-[25px] px-[15px] md:px-[30px] md:mb-[56px] xl:max-w-[1400px] mx-auto xl:px-[50px] ${
        className || ""
      }`}
    >
      <h2 className="text-center text-black text-[22px] md:text-[28px] font-normal mb-[15px] xl:mb-[24px]">
        {title}
      </h2>

      <div>
        {faqItems.map((item) => (
          <FAQItem
            key={item.id}
            item={item}
            isActive={activeIds.includes(item.id)}
            onToggle={() => toggle(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
