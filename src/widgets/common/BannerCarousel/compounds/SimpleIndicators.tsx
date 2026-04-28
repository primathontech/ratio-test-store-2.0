import React from "react";

import { IBannerCarouselItem } from "../types";

export interface SimpleIndicatorsProps {
  items: IBannerCarouselItem[];
  currentIndex: number;
  onIndicatorClick: (index: number) => void;
  autoplayInterval?: number;
  autoplay?: boolean;
}

export const SimpleIndicators: React.FC<SimpleIndicatorsProps> = ({
  items,
  currentIndex,
  onIndicatorClick,
}) => {
  if (!items || items.length <= 1) {
    return null;
  }

  return (
    <div
      data-testid="banner-carousel-simple-indicators"
      className="flex items-center justify-center gap-[4px] md:gap-[8px] mt-[16px] md:mt-[24px]"
    >
      {items.map((_, index) => {
        const isActive = index === currentIndex;

        return (
          <button
            key={index}
            data-testid={`banner-carousel-simple-indicator-${index}`}
            onClick={() => onIndicatorClick(index)}
            className={`overflow-hidden transition-all duration-300 ease-in-out
              ${
                isActive
                  ? "w-[12px] h-[4px] md:w-[24px] md:h-[8px] bg-black"
                  : "size-[4px] md:size-[8px] bg-[#DDDDDD] md:bg-black/30 hover:bg-black/50"
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        );
      })}
    </div>
  );
};
