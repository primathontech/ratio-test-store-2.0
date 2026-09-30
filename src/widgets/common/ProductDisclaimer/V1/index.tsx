"use client";

import React, { memo } from "react";
import { Box } from "@/ui/atomic";
import { ProductMetadataKey } from "@/widgets/common/ProductDetail/types";
import { ensureArray } from "@/widgets/common/AdditionalInformation/utils/getAdditionalInfoItems";
import { ProductDisclaimerProps } from "../types";

/* ------------------------------------------------------------------ */
/*  V1 -- ProductDisclaimer                                            */
/*  Mirrors docs/ProductDisclaimerSection: centered title with         */
/*  underline accent + ordered list of disclaimer entries              */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: ProductDisclaimerProps) {
  const product = data?.success ? data.data : null;
  if (!product) {
    return null;
  }

  const sectionTitle =
    settings?.sectionTitle || settings?.title || "Disclaimer";

  const apiList = ensureArray<string>(
    product.metadata?.[ProductMetadataKey.DISCLAIMER]?.value
  );
  const disclaimerList = apiList.length > 0 ? apiList : settings?.items || [];

  if (!disclaimerList.length) {
    return null;
  }

  return (
    <Box className={`max-w-[1400px] mx-6 md:mx-auto ${className || ""}`}>
      {sectionTitle && (
        <h3 className="text-[22px] md:text-[32px] text-black text-center font-normal">
          <span className="relative after:content-[''] after:absolute after:h-0.5 after:bottom-[-2px] after:left-[-2rem] after:right-[-2rem] after:bg-black">
            {sectionTitle}
          </span>
        </h3>
      )}

      <ol className="list-decimal list-inside ps-[15px] md:ps-10 pt-8 border-b-8 border-b-surface-4 border-t-2 border-t-[#d6d6d6]">
        {disclaimerList.map((item, index) => (
          <li key={index} className="text-text-base text-black font-normal">
            {item}
          </li>
        ))}
      </ol>
    </Box>
  );
});
