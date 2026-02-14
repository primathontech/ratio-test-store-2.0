import React from "react";

export const CouponCardSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full bg-white border border-gray-200 rounded-lg p-4 pb-[8px] flex flex-col font-open-sans animate-pulse">
      <div className="flex-1">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        {/* Description skeleton */}
        <div className="h-3 bg-gray-200 rounded mb-1 w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="flex items-center mt-[8px] mr-[16px]">
        {/* Code skeleton */}
        <div className="px-[16px] py-[2px] md:py-[4px] bg-gray-100 border border-dashed border-r-0 border-[#ddd] rounded-tl-[5px] rounded-bl-[5px] flex-1">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        {/* Copy button skeleton */}
        <div className="px-[16px] py-[4px] bg-gray-100 rounded-tr-[5px] rounded-br-[5px]">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

const SKELETON_ITEMS = [1, 2, 3] as const;

export const CouponOffersSkeleton: React.FC = () => {
  return (
    <div className="bg-white pl-[16px] mt-[16px] border-b border-surface-3">
      {/* Header skeleton */}
      <div className="h-4 bg-gray-200 rounded mb-2 w-48 animate-pulse"></div>

      {/* Offers Container skeleton */}
      <div className="flex overflow-x-scroll gap-[8px] mt-[8px] pb-[8px]">
        {SKELETON_ITEMS.map((index) => (
          <div
            key={index}
            className="basis-[75%] md:basis-3/5 flex-shrink-0 last:pr-[16px]"
          >
            <CouponCardSkeleton />
          </div>
        ))}
      </div>

      {/* Footer Notes skeleton */}
      <div className="pt-[4px] pb-[16px] font-roboto md:font-body">
        <div className="h-3 bg-gray-200 rounded mb-[4px] w-64 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
    </div>
  );
};
