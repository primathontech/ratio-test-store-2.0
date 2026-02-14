"use client";

import { Box } from "@/ui/atomic";
import { ProductAdditionalInfoSectionProps } from "../types";
import { useState, useMemo } from "react";
import {
  getAdditionalInfoItems,
  DEFAULT_ADDITIONAL_INFO_SETTINGS,
} from "../utils/getAdditionalInfoItems";
import Image from "next/image";

export function V1({
  data,
  settings,
  className,
}: ProductAdditionalInfoSectionProps) {
  // TODO: This will be uncommented when the real data comes in
  const product = data?.data;
  // const product = productData;

  const { metadata } = product || {};
  const {
    sectionTitle,
    marketedBy = DEFAULT_ADDITIONAL_INFO_SETTINGS.marketedBy,
    countryOfOrigin = DEFAULT_ADDITIONAL_INFO_SETTINGS.countryOfOrigin,
    customerCareDetails = DEFAULT_ADDITIONAL_INFO_SETTINGS.customerCareDetails,
  } = settings || {};

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  // Get additional info items using the utility function
  const infoItems = useMemo(() => {
    return getAdditionalInfoItems(metadata, {
      marketedBy,
      countryOfOrigin,
      customerCareDetails,
    });
  }, [metadata, marketedBy, countryOfOrigin, customerCareDetails]);

  if (!product) {
    return null;
  }

  // Don't render if no data
  if (!infoItems.length) {
    return null;
  }

  return (
    // <div className="bg-[#F4F6F8] pt-4 rounded-3xl">
    <div
      data-testid="product-additional-info-section-container"
      className="mx-6 md:mx-0 lg:px-6 xl:px-[80px] w-full bg-white mb-4"
    >
      <Box
        data-testid="product-additional-info-section-inner-container"
        className={`md:mx-auto ${className}`}
      >
        {/* Header */}
        <div
          data-testid="product-additional-info-section-header"
          className="flex items-center justify-between cursor-pointer select-none mb-8 py-[15px]"
          onClick={toggleExpanded}
        >
          <h3
            data-testid="product-additional-info-section-title"
            className="text-[16px] md:text-[26px] font-bold text-black text-center"
          >
            {sectionTitle}
          </h3>

          <Box
            data-testid="product-additional-info-section-arrow-container"
            className={`transition-transform ${isExpanded ? "-rotate-180" : ""}`}
          >
            <Image
              src="/dawn/svg/additional-info-arrow.svg"
              alt="Toggle arrow"
              width={24}
              height={12}
              unoptimized
            />
          </Box>
        </div>

        {/* Collapsible Content */}
        <div
          data-testid="product-additional-info-section-content"
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            data-testid="product-additional-info-section-grid"
            className="grid grid-cols-2 gap-4"
          >
            {infoItems.map((item, index) => (
              <div
                key={index}
                data-testid={`product-additional-info-section-item-${index}`}
              >
                <h4
                  data-testid={`product-additional-info-section-item-label-${index}`}
                  className="text-[12px] font-bold text-base-text uppercase tracking-normal"
                >
                  {item.label}
                </h4>
                <p
                  data-testid={`product-additional-info-section-item-value-${index}`}
                  className="text-[12px] font-normal text-base-text leading-balanced"
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Box>
    </div>
    // </div>
  );
}
