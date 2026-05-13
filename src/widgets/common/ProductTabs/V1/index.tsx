"use client";

import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { ProductTabsProps, ProductTab } from "../types";
import {
  ProductMetadataKey,
  ProductTabType,
  ProductTabHandlePrefix,
} from "@/widgets/common/ProductDetail/types";
import type { ApiProductDetailTab } from "@/widgets/common/ProductDetail/types";

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
/*  Sub-components for different content types                         */
/* ------------------------------------------------------------------ */

/** Steps content renderer (How to Use tab) */
const StepsContent = ({
  steps,
}: {
  steps: { label: string; text: string }[];
}) => (
  <div className="flex flex-col gap-4">
    {steps.map((step, i) => (
      <div key={i} className="flex flex-col">
        <span className="text-sm md:text-base leading-[22px] font-bold text-primary ">
          {step.label} : <span className="font-normal">{step.text}</span>
        </span>
      </div>
    ))}
  </div>
);

/** Ingredients content renderer (Power Ingredients tab) */
const IngredientsContent = ({
  ingredients,
}: {
  ingredients: { image: string; label: string; text: string }[];
}) => (
  <div className="flex flex-col gap-6">
    {ingredients.map((item, i) => (
      <div key={i} className="flex items-center gap-4">
        {item.image && (
          <div className="shrink-0 w-[58px] md:w-[108px] h-[58px] md:h-[108px] relative">
            <Image
              src={item.image}
              alt={item.text}
              fill
              className="object-cover rounded-[50%]"
              sizes="108px"
            />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm leading-[22px] font-bold text-loading-blue">
            {item.label}
          </span>
          <span className="text-sm md:text-base leading-[22px] font-normal text-primary mt-1 ">
            {item.text}
          </span>
        </div>
      </div>
    ))}
  </div>
);

/** List content renderer (Suitable For tab) */
const ListContent = ({ items }: { items: string[] }) => (
  <div className="flex flex-col gap-3">
    {items.map((item, i) => (
      <p
        key={i}
        className="text-sm md:text-base leading-[22px] font-normal text-primary m-0"
      >
        {item}
      </p>
    ))}
  </div>
);

/** Ingredients List content renderer (Ingredients List tab) */
const IngredientsListContent = ({
  listings,
}: {
  listings: { label: string; text: string }[];
}) => (
  <div className="flex flex-col gap-4">
    {listings.map((listing, i) => (
      <div key={i} className="flex flex-col">
        <span className="text-sm leading-[22px] font-bold text-primary mb-1">
          {listing.label}
        </span>
        <p className="text-sm md:text-base leading-[22px] font-normal text-primary m-0">
          {listing.text}
        </p>
      </div>
    ))}
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
  tab: ProductTab;
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
        {/* Title text */}
        <span
          className={`text-base leading-[26px] md:text-2xl md:leading-[38px] font-normal md:font-bold py-6 px-4 md:pt-[38px] xl:px-6 transition-colors duration-300 ${isOpen ? "md:pb-4" : "md:pb-[38px]"} text-black group-hover:text-loading-blue`}
        >
          {tab.title}
        </span>

        {/* Chevron icon */}
        <span className="flex items-center justify-center w-[10px] md:w-[54px] h-2 md:h-5 mr-6 xl:mr-6 text-[rgba(0,0,0,0.8)] group-hover:text-loading-blue transition-colors duration-300">
          <ChevronIcon isOpen={isOpen} />
        </span>
      </button>

      {/* Content panel */}
      <div
        className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100 pb-5" : "max-h-0 opacity-0 pb-0"
        }`}
      >
        {tab.type === ProductTabType.HTML && tab.contentHTML && (
          <SafeHtmlContent html={tab.contentHTML} />
        )}
        {tab.type === ProductTabType.STEPS && tab.steps && (
          <StepsContent steps={tab.steps} />
        )}
        {tab.type === ProductTabType.INGREDIENTS && tab.ingredients && (
          <IngredientsContent ingredients={tab.ingredients} />
        )}
        {tab.type === ProductTabType.LIST && tab.items && (
          <ListContent items={tab.items} />
        )}
        {tab.type === ProductTabType.INGREDIENTS_LIST &&
          tab.ingredientListings && (
            <IngredientsListContent listings={tab.ingredientListings} />
          )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  V1 — ProductTabs (Accordion layout)                                */
/* ------------------------------------------------------------------ */

/**
 * The API types declare these field values as `string[]`, but the API
 * sometimes returns a single string instead. Indexing a string with `[0]`
 * silently returns its first character (e.g. "h" for "https://..."),
 * which then breaks `next/image`. Always go through this helper.
 */
function pickFirstString(value: unknown): string {
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === "string" ? first : "";
  }
  return typeof value === "string" ? value : "";
}

/** Transform API product_details into ProductTab[] */
function transformApiTabs(apiTabs: ApiProductDetailTab[]): ProductTab[] {
  return apiTabs.map((tab) => {
    const title = pickFirstString(tab.fields.tab_title?.value) || "Tab";
    const cards = tab.fields.tab_content?.value || [];

    // Detect tab type by handle prefix
    const handle = tab.handle || "";
    if (handle.startsWith(ProductTabHandlePrefix.HOW_TO_USE)) {
      return {
        title,
        type: ProductTabType.STEPS,
        steps: cards.map((card, i) => ({
          label: pickFirstString(card.fields.title?.value) || `Step ${i + 1}`,
          text: pickFirstString(card.fields.content?.value),
        })),
      };
    }
    if (handle.startsWith(ProductTabHandlePrefix.HERO_INGREDIENT)) {
      return {
        title,
        type: ProductTabType.INGREDIENTS,
        ingredients: cards.map((card) => ({
          image: pickFirstString(card.fields.image?.value),
          label: "",
          text: pickFirstString(card.fields.content?.value),
        })),
      };
    }
    if (handle.startsWith(ProductTabHandlePrefix.SUITABLE_FOR)) {
      return {
        title,
        type: ProductTabType.LIST,
        items: cards.map((card) => pickFirstString(card.fields.content?.value)),
      };
    }
    if (handle.startsWith(ProductTabHandlePrefix.INGREDIENTS_LIST)) {
      return {
        title,
        type: ProductTabType.INGREDIENTS_LIST,
        ingredientListings: cards.map((card) => ({
          label: pickFirstString(card.fields.title?.value),
          text: pickFirstString(card.fields.content?.value),
        })),
      };
    }
    // Default: list
    return {
      title,
      type: ProductTabType.LIST,
      items: cards.map((card) => pickFirstString(card.fields.content?.value)),
    };
  });
}

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: ProductTabsProps) {
  const product = data?.success ? data.data : null;

  // Build tabs from API data or fall back to settings
  const apiTabs =
    product?.metadata?.[ProductMetadataKey.PRODUCT_DETAILS]?.value;
  const descriptionTab: ProductTab | null = product?.description
    ? {
        title: "Description",
        type: ProductTabType.HTML,
        contentHTML: product.description,
      }
    : null;

  let tabs: ProductTab[];
  if (apiTabs && Array.isArray(apiTabs) && apiTabs.length > 0) {
    const transformed = transformApiTabs(apiTabs);
    tabs = descriptionTab ? [descriptionTab, ...transformed] : transformed;
  } else {
    tabs = settings?.tabs || [];
  }

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

  // Hide widget when no tabs are available
  if (tabs.length === 0) {
    return null;
  }

  // Filter out tabs with empty title or content
  const validTabs = tabs.filter((tab) => {
    // Check if title is empty
    if (!tab.title || tab.title.trim() === "") {
      return false;
    }

    // Check if content is empty based on type
    if (tab.type === ProductTabType.HTML) {
      const content = tab.contentHTML;
      if (!content || content.trim() === "") {
        return false;
      }
    } else if (tab.type === ProductTabType.STEPS) {
      const content = tab.steps;
      if (
        !content ||
        content.length === 0 ||
        content.every(
          (step) =>
            (!step?.label || step.label.trim() === "") &&
            (!step?.text || step.text.trim() === "")
        )
      ) {
        return false;
      }
    } else if (tab.type === ProductTabType.INGREDIENTS) {
      const content = tab.ingredients;
      if (
        !content ||
        content.length === 0 ||
        content.every(
          (ingredient) =>
            (!ingredient?.text || ingredient.text.trim() === "") &&
            (!ingredient?.label || ingredient.label.trim() === "") &&
            (!ingredient?.image || ingredient.image.trim() === "")
        )
      ) {
        return false;
      }
    } else if (tab.type === ProductTabType.LIST) {
      const content = tab.items;
      if (
        !content ||
        content.length === 0 ||
        content.every((item) => !item || item.trim() === "")
      ) {
        return false;
      }
    } else if (tab.type === ProductTabType.INGREDIENTS_LIST) {
      const content = tab.ingredientListings;
      if (
        !content ||
        content.length === 0 ||
        content.every(
          (listing) =>
            (!listing?.label || listing.label.trim() === "") &&
            (!listing?.text || listing.text.trim() === "")
        )
      ) {
        return false;
      }
    }

    return true;
  });

  if (validTabs.length === 0) {
    return null;
  }

  return (
    <section className={`bg-[#f4f6f8] pt-2.5 pb-px ${className || ""}`}>
      {/* Container — max-width 1400px, centered */}
      <div className="mx-auto max-w-[1400px]">
        {/* Accordion items */}
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
