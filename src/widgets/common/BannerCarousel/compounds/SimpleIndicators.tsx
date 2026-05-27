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
      className="flex items-center justify-center gap-1 md:gap-2 mt-4 md:mt-6"
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
                  ? "w-3 h-1 md:w-6 md:h-2 bg-black"
                  : "size-1 md:size-2 bg-[#DDDDDD] md:bg-black/30 hover:bg-black/50"
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        );
      })}
    </div>
  );
};
