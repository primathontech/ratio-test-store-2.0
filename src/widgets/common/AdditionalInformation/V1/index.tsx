"use client";

import React, { memo, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { Box } from "@/ui/atomic";
import { AdditionalInformationProps } from "../types";
import type { ApiProduct } from "@/widgets/common/ProductDetail/types";
import {
  DEFAULT_ADDITIONAL_INFO_SETTINGS,
  getAdditionalInfoItems,
} from "../utils/getAdditionalInfoItems";

/* ------------------------------------------------------------------ */
/*  V1 -- AdditionalInformation                                        */
/*  Mirrors docs/ProductAdditionalInfoSection: collapsible header with */
/*  rotating arrow image, 2-column grid of label/value pairs           */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: AdditionalInformationProps) {
  const product = data?.success ? (data.data as ApiProduct | null) : null;

  const sectionTitle =
    settings?.sectionTitle || settings?.title || "Additional Information";
  const marketedBy =
    settings?.marketedBy ?? DEFAULT_ADDITIONAL_INFO_SETTINGS.marketedBy;
  const countryOfOrigin =
    settings?.countryOfOrigin ??
    DEFAULT_ADDITIONAL_INFO_SETTINGS.countryOfOrigin;
  const customerCareDetails =
    settings?.customerCareDetails ??
    DEFAULT_ADDITIONAL_INFO_SETTINGS.customerCareDetails;
  const defaultExpanded = settings?.defaultExpanded ?? false;

  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const toggleExpanded = useCallback(() => setIsExpanded((prev) => !prev), []);

  const infoItems = useMemo(
    () =>
      getAdditionalInfoItems(product?.metadata, {
        marketedBy,
        countryOfOrigin,
        customerCareDetails,
      }),
    [product?.metadata, marketedBy, countryOfOrigin, customerCareDetails]
  );

  if (!product) {
    return null;
  }

  if (!infoItems.length) {
    return null;
  }

  return (
    <div
      data-testid="product-additional-info-section-container"
      className="mx-auto max-w-[1400px] px-[15px] md:px-[30px] xl:px-[50px] bg-white mb-4"
    >
      <Box
        data-testid="product-additional-info-section-inner-container"
        className={`md:mx-auto ${className || ""}`}
      >
        <button
          type="button"
          onClick={toggleExpanded}
          aria-expanded={isExpanded}
          data-testid="product-additional-info-section-header"
          className="w-full flex items-center justify-between cursor-pointer select-none py-6 md:py-[27px] xl:py-8 bg-transparent border-0 outline-none text-left"
        >
          <h3
            data-testid="product-additional-info-section-title"
            className="text-base md:text-[26px] font-bold text-black"
          >
            {sectionTitle}
          </h3>

          <span
            data-testid="product-additional-info-section-arrow-container"
            className={`inline-flex shrink-0 transition-transform duration-300 ${
              isExpanded ? "-rotate-180" : ""
            }`}
          >
            <Image
              src="/dawn/svg/additional-info-arrow.svg"
              alt="Toggle arrow"
              width={18}
              height={10}
              unoptimized
            />
          </span>
        </button>

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
                  className="text-xs font-bold text-primary uppercase tracking-normal"
                >
                  {item.label}
                </h4>
                <p
                  data-testid={`product-additional-info-section-item-value-${index}`}
                  className="text-xs font-normal text-primary leading-balanced"
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Box>
    </div>
  );
});
