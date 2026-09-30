import React from "react";

export const CouponCardSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full bg-white border border-gray-200 rounded-lg p-4 pb-2 flex flex-col font-opensans animate-pulse">
      <div className="flex-1">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        {/* Description skeleton */}
        <div className="h-3 bg-gray-200 rounded mb-1 w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="flex items-center mt-2 mr-4">
        {/* Code skeleton */}
        <div className="px-4 py-0.5 md:py-1 bg-gray-100 border border-dashed border-r-0 border-[#ddd] rounded-tl-md rounded-bl-md flex-1">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        {/* Copy button skeleton */}
        <div className="px-4 py-1 bg-gray-100 rounded-tr-md rounded-br-md">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

const SKELETON_ITEMS = [1, 2, 3] as const;

export const CouponOffersSkeleton: React.FC = () => {
  return (
    <div className="bg-white pl-4 mt-4 border-b border-gray-200">
      {/* Header skeleton */}
      <div className="h-4 bg-gray-200 rounded mb-2 w-48 animate-pulse"></div>

      {/* Offers Container skeleton */}
      <div className="flex overflow-x-scroll gap-2 mt-2 pb-2">
        {SKELETON_ITEMS.map((index) => (
          <div
            key={index}
            className="basis-[75%] md:basis-3/5 flex-shrink-0 last:pr-4"
          >
            <CouponCardSkeleton />
          </div>
        ))}
      </div>

      {/* Footer Notes skeleton */}
      <div className="pt-1 pb-4 font-body">
        <div className="h-3 bg-gray-200 rounded mb-1 w-64 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
    </div>
  );
};
