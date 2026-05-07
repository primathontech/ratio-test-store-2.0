"use client";

import React, { memo } from "react";
import Image from "next/image";
import { ReasonsToLoveProps } from "../types";
import {
  ProductMetadataKey,
  type ApiReasonToLoveCard,
} from "@/widgets/common/ProductDetail/types";

interface ReasonToLoveCardItem {
  title: string;
  content: string;
  imageUrl: string;
}

function getFirstValue(value: unknown): string {
  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : "";
  }
  return typeof value === "string" ? value : "";
}

function extractReasonToLoveCards(
  cards: ApiReasonToLoveCard[] | undefined
): ReasonToLoveCardItem[] {
  if (!Array.isArray(cards)) {
    return [];
  }

  return cards
    .map((item): ReasonToLoveCardItem => {
      const fields = item?.fields;
      return {
        title: getFirstValue(fields?.title?.value),
        content: getFirstValue(fields?.content?.value),
        imageUrl: getFirstValue(fields?.image?.value),
      };
    })
    .filter((card) => card.imageUrl && (card.title || card.content));
}

function ReasonToLoveCard({
  card,
  index,
}: {
  card: ReasonToLoveCardItem;
  index: number;
}) {
  const isImageLeft = index % 2 === 0;

  return (
    <div
      data-testid={`reason-to-love-card-${index}`}
      className={`flex flex-col items-center gap-4 lg:gap-0 justify-between py-[15px] ${
        isImageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
    >
      <div
        data-testid={`reason-to-love-card-image-${index}`}
        className="flex-shrink-0 rounded-full border-8 border-[#D8D8D8] w-[216px] h-[216px]"
      >
        <Image
          src={card.imageUrl}
          alt={card.title || "Reason to love"}
          width={200}
          height={200}
          unoptimized
          loading="lazy"
          className="rounded-full border-8 border-[#BEBEBE] bg-[#CFE5F8] mix-blend-multiply w-[200px] h-[200px] object-cover"
        />
      </div>
      <div
        data-testid={`reason-to-love-card-text-${index}`}
        className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left px-[19.7px] md:px-[35.4px] lg:px-12 xl:px-[65px]"
      >
        {card.title && (
          <p className="text-[22px] md:text-2xl xl:text-[28px] font-normal text-black leading-[33.6px]">
            {card.title}
          </p>
        )}
        {card.content && (
          <p className="text-sm font-normal text-black leading-[23px]">
            {card.content}
          </p>
        )}
      </div>
    </div>
  );
}

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: ReasonsToLoveProps) {
  const product = data?.success ? data.data : null;
  if (!product) {
    return null;
  }

  const sectionTitle = settings?.sectionTitle || "Reasons to Love";

  const reasonToLoveImageUrl = getFirstValue(
    product.metadata?.[ProductMetadataKey.REASONS_TO_LOVE_IMAGE]?.value
  );

  const reasonToLoveCards = extractReasonToLoveCards(
    product.metadata?.[ProductMetadataKey.REASONS_TO_LOVE_OBJECT]?.value
  );

  if (!reasonToLoveImageUrl && reasonToLoveCards.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="reason-to-love-section-container"
      className={`w-full max-w-[1400px] mx-auto flex items-center rounded-3xl overflow-hidden xl:px-[50px] lg:px-[30px] lg:justify-start justify-center ${className || ""}`}
    >
      <div
        data-testid="reason-to-love-section-inner-container"
        className="flex flex-col w-full px-[15px] md:px-[30px] lg:px-0 mb-6 md:mb-8"
      >
        <div
          data-testid="reason-to-love-section-content-wrapper"
          className="w-full flex flex-col justify-center"
        >
          <p className="text-left text-base md:text-[22px] mt-6 md:mt-8 lg:mt-[30px] lg:text-2xl font-bold text-black mb-8">
            {sectionTitle}
          </p>

          {reasonToLoveImageUrl && (
            <div
              data-testid="reason-to-love-section-image-container"
              className="w-full overflow-hidden"
            >
              <Image
                src={reasonToLoveImageUrl}
                alt={sectionTitle}
                unoptimized
                width={1237}
                height={4200}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 1237px"
                className="object-cover w-full h-auto mx-auto max-w-[970px]"
              />
            </div>
          )}

          {reasonToLoveCards.length > 0 && (
            <div
              data-testid="reason-to-love-cards-container"
              className={`w-full flex flex-col ${
                reasonToLoveImageUrl ? "mt-10 md:mt-14" : ""
              }`}
            >
              {reasonToLoveCards.map((card, i) => (
                <ReasonToLoveCard key={i} card={card} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
