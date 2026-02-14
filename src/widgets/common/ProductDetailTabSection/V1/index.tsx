"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Box, Flex } from "@/ui/atomic";
import {
  PRODUCT_DETAILS_METAFIELD_KEY,
  ProductDetailTab,
  TabContentType,
} from "../utils";
import { transformProductDetailsData } from "../utils";
import { ProductDetailTabSectionProps } from "../types";
import productData from "../../ProductGalleryWithInfo/data/product.json";
import { ArrowIcon } from "../../../common/HeroCarousel/compounds/ArrowIcon";

const AccordionItem: React.FC<{
  tab: ProductDetailTab;
  isActive: boolean;
  toggle: () => void;
  isFirstWithoutReasonsToLove?: boolean;
}> = ({ tab, isActive, toggle, isFirstWithoutReasonsToLove = false }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      // Update height when content changes or accordion state changes
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [tab.content, isActive]);

  // Recalculate height when accordion opens/closes
  useEffect(() => {
    if (isActive && contentRef.current) {
      // Small delay to ensure content is rendered
      const timer = setTimeout(() => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight);
        }
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const renderContent = () => {
    if (tab.type === TabContentType.HTML) {
      return (
        <Box
          dangerouslySetInnerHTML={{
            __html: tab.content as string,
          }}
          className="text-text-lg font-normal"
        />
      );
    }

    if (tab.type === TabContentType.LIST) {
      return (
        <Box as="ul" style={{ listStyle: "none" }}>
          {(tab.content as string[]).map((item, i) => (
            <li key={i} className="text-text-lg font-normal">
              {item}
            </li>
          ))}
        </Box>
      );
    }

    // based on : or -
    // if (tab.type === TabContentType.CARDS) {
    //   return (
    //     <Flex direction="column" gap="2rem">
    //       {(
    //         tab.content as {
    //           cardTitle?: string;
    //           text: string;
    //           imageUrl?: string;
    //         }[]
    //       ).map((card, i) => {
    //         let boldText = "";
    //         let normalText = "";

    //         if (card.cardTitle) {
    //           boldText = card.cardTitle.replace(/[:–]$/, "").trim();
    //           normalText = card.text;
    //         } else if (card.text.includes(":")) {
    //           const [before, ...after] = card.text.split(":");
    //           boldText = before.trim();
    //           normalText = after.join(":").trim();
    //         } else if (card.text.includes("–")) {
    //           const [before, ...after] = card.text.split("–");
    //           boldText = before.trim();
    //           normalText = after.join("–").trim();
    //         } else {
    //           normalText = card.text;
    //         }

    //         return (
    //           <Flex key={i} direction="row" gap="1.5rem" align="center">
    //             {/* Image */}
    //             {card.imageUrl && (
    //               <div className="w-[110px] h-[110px] flex-shrink-0 rounded-full border border-[#DDDDDD] p-[2px]">
    //                 <Image
    //                   src={card.imageUrl}
    //                   alt={boldText || ""}
    //                   width={110}
    //                   height={110}
    //                   className="rounded-full object-cover w-full h-full"
    //                 />
    //               </div>
    //             )}

    //             {/* Text */}
    //             <div className="flex flex-col">
    //               {boldText && (
    //                 <p className="text-[14px] md:text-[16px] font-[700]">
    //                   {boldText}
    //                 </p>
    //               )}
    //               {normalText && (
    //                 <p className="text-[14px] md:text-[16px] font-normal">
    //                   {normalText}
    //                 </p>
    //               )}
    //             </div>
    //           </Flex>
    //         );
    //       })}
    //     </Flex>
    //   );
    // }

    // card title
    // if (tab.type === TabContentType.CARDS) {
    //   return (
    //     <Flex direction="column" gap="2rem">
    //       {(
    //         tab.content as {
    //           cardTitle?: string;
    //           text: string;
    //           imageUrl?: string;
    //         }[]
    //       ).map((card, i) => {
    //         const hasCardTitle =
    //           typeof card.cardTitle === "string" &&
    //           card.cardTitle.trim().length > 0;

    //         return (
    //           <Flex key={i} direction="row" gap="1.5rem" align="center">
    //             {/* Image */}
    //             {card.imageUrl && (
    //               <div className="w-[110px] h-[110px] flex-shrink-0 rounded-full border border-[#DDDDDD] p-[2px]">
    //                 <Image
    //                   src={card.imageUrl}
    //                   alt={card.cardTitle || ""}
    //                   width={110}
    //                   height={110}
    //                   className="rounded-full object-cover w-full h-full"
    //                 />
    //               </div>
    //             )}

    //             {/* Text */}
    //             <div className="flex flex-col">
    //               {hasCardTitle && (
    //                 <p className="text-[14px] md:text-[16px] font-[700]">
    //                   {card.cardTitle}
    //                 </p>
    //               )}

    //               <p className="text-[14px] md:text-[16px] font-normal">
    //                 {card.text}
    //               </p>
    //             </div>
    //           </Flex>
    //         );
    //       })}
    //     </Flex>
    //   );
    // }

    if (tab.type === TabContentType.CARDS) {
      return (
        <Flex direction="column" gap="2rem">
          {(
            tab.content as {
              cardTitle?: string;
              text: string;
              imageUrl?: string;
            }[]
          ).map((card, i) => {
            const hasCardTitle =
              typeof card.cardTitle === "string" &&
              card.cardTitle.trim().length > 0;

            return (
              <Flex key={i} direction="row" gap="1.5rem" align="center">
                {/* Image */}
                {card.imageUrl && (
                  <div
                    data-testid={`product-detail-tab-card-image-${i}`}
                    className="w-[110px] h-[110px] flex-shrink-0 rounded-full border border-[#DDDDDD] p-[2px]"
                  >
                    <Image
                      src={card.imageUrl}
                      alt={card.cardTitle || ""}
                      width={110}
                      height={110}
                      className="rounded-full object-cover w-full h-full"
                    />
                  </div>
                )}

                {/* Text */}
                <div
                  data-testid={`product-detail-tab-card-text-${i}`}
                  className="flex flex-col"
                >
                  {hasCardTitle && (
                    <p className="text-[14px] md:text-[16px] font-[700]">
                      {card.cardTitle}
                    </p>
                  )}

                  <p className="text-[14px] md:text-[16px] font-normal">
                    {card.text}
                  </p>
                </div>
              </Flex>
            );
          })}
        </Flex>
      );
    }

    return null;
  };

  return (
    <Box
      className={`${
        isFirstWithoutReasonsToLove ? "rounded-b-3xl" : "rounded-3xl"
      } overflow-hidden xl:px-[80px] bg-[#ffffff] mb-4`}
    >
      {/* Question/Title */}
      <Box
        as="button"
        onClick={toggle}
        data-testid="product-detail-toggle"
        // className="flex justify-between items-center w-full cursor-pointer text-left bg-transparent px-6 pt-6 pb-0 md:px-8 md:pt-8 md:pb-0"
        className="flex justify-between items-center w-full cursor-pointer text-left bg-transparent p-6"
        aria-expanded={isActive}
      >
        <p
          className="
              text-[16px] md:text-[24px]
              font-bold
              text-black
              transition-colors duration-200
            "
        >
          {tab.title}
        </p>
        <Box
          className={`transition-transform duration-300 ease-in-out ${
            isActive ? "-rotate-180" : "rotate-0"
          }`}
        >
          <ArrowIcon direction="bottom" size={25} />
        </Box>
      </Box>

      {/* Answer/Content */}
      <Box
        style={{
          maxHeight: isActive ? `${contentHeight}px` : "0px",
          overflow: "hidden",
          transition:
            "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out",
          opacity: isActive ? 1 : 0,
          willChange: "max-height, opacity",
        }}
      >
        <div
          data-testid={`product-detail-tab-content-${tab.title}`}
          ref={contentRef}
          className="pl-6 pb-8 pr-6"
        >
          {renderContent()}
        </div>
      </Box>
    </Box>
  );
};

export function V1({ data, className }: ProductDetailTabSectionProps) {
  // Hooks must be called before any early returns
  const [activeIndexes, setActiveIndexes] = useState<number[]>([]);

  // TODO: This will be uncommented when the real data comes in
  const product = data?.data;
  // const product = productData;

  if (!product) {
    return null;
  }

  const { metadata } = product || {};

  // Check if reasons to love section exists
  const hasReasonsToLove =
    metadata?.["reasons_to_love_image"]?.value &&
    Array.isArray(metadata["reasons_to_love_image"].value) &&
    metadata["reasons_to_love_image"].value.length > 0;

  // Find Product detail metafield
  const productDetailsData = metadata?.[PRODUCT_DETAILS_METAFIELD_KEY];

  const transformedTabs =
    product?.description && productDetailsData
      ? transformProductDetailsData(productDetailsData, product.description)
      : undefined;

  if (!transformedTabs || transformedTabs.length === 0) return null;

  const toggle = (index: number) => {
    setActiveIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Filter out tabs with empty title or content
  const validTabs = transformedTabs.filter((tab) => {
    // Check if title is empty
    if (!tab.title || tab.title.trim() === "") {
      return false;
    }

    // Check if content is empty based on type
    if (tab.type === TabContentType.HTML) {
      const content = tab.content as string;
      if (!content || content.trim() === "") {
        return false;
      }
    } else if (tab.type === TabContentType.LIST) {
      const content = tab.content as string[];
      if (
        !content ||
        content.length === 0 ||
        content.every((item) => !item || item.trim() === "")
      ) {
        return false;
      }
    } else if (tab.type === TabContentType.CARDS) {
      const content = tab.content as { text: string; imageUrl?: string }[];
      if (
        !content ||
        content.length === 0 ||
        content.every((card) => !card.text || card.text.trim() === "")
      ) {
        return false;
      }
    }

    return true;
  });

  if (validTabs.length === 0) return null;

  return (
    <Box
      className={`mx-auto pb-[1px] bg-[#F5F6F8] ${
        hasReasonsToLove ? "pt-[10px]" : ""
      } ${className}`}
    >
      <Box className="">
        {validTabs.map((tab, index) => (
          <AccordionItem
            key={tab.title}
            tab={tab}
            isActive={activeIndexes.includes(index)}
            toggle={() => toggle(index)}
            isFirstWithoutReasonsToLove={!hasReasonsToLove && index === 0}
          />
        ))}
      </Box>
    </Box>
  );
}
