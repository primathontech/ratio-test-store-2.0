"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useCoupons } from "./useCoupons";
import { CouponOffer } from "../types";
import { CouponOffersSkeleton } from "./CouponCardSkeleton";
import { useCartStore } from "@shopkit/cart";

// Types
interface CouponCardProps {
  offer: CouponOffer;
  onCopy?: (code: string) => void;
}

const CouponCard: React.FC<CouponCardProps> = React.memo(
  ({ offer, onCopy }) => {
    const [copied, setCopied] = useState<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleCopy = useCallback(() => {
      navigator.clipboard.writeText(offer.code);
      setCopied(true);
      onCopy?.(offer.code);

      // Clear existing timeout if any
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }, [offer.code, onCopy]);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <div className="w-full h-full bg-white border border-gray-200 rounded-lg p-4 pb-[8px] flex flex-col font-open-sans">
        <div className="flex-1">
          <h3 className="font-semibold text-text-base text-black tracking-[-0.333px]">
            {offer.title}
          </h3>
          <p className="text-text-sm font-normal text-[#505050] tracking-[-0.333px]">
            {offer.description}
          </p>
        </div>
        <div className="flex items-center mt-[8px] mr-[16px]">
          <div className="px-[16px] py-[2px] md:py-[4px] bg-white border border-dashed border-r-0 border-[#ddd] rounded-tl-[5px] rounded-bl-[5px] font-mono text-text-base font-bold text-black truncate">
            {offer.code}
          </div>
          <button
            onClick={handleCopy}
            className="px-[16px] py-[4px] text-text-base font-bold text-[#0066CC] bg-[#D6F4FF] rounded-tr-[5px] rounded-br-[5px] whitespace-nowrap font-open-sans"
          >
            {copied ? "COPIED" : "COPY CODE"}
          </button>
        </div>
      </div>
    );
  },
);

CouponCard.displayName = "CouponCard";

// Error state component
const ErrorState: React.FC<{ onRetry: () => void; error: string }> = ({
  onRetry,
  error,
}) => (
  <div className="bg-white pl-[16px] mt-[16px] border-b border-surface-3">
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-red-500 text-sm mb-4">
        Failed to load offers: {error}
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Empty state component
const EmptyState: React.FC = () => (
  <div className="bg-white pl-[16px] mt-[16px] border-b border-surface-3">
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-gray-500 text-sm">No offers available at the moment</p>
    </div>
  </div>
);

export const CouponOffersComponent: React.FC = () => {
  const { coupons, isLoading, error, refetch } = useCoupons();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { items } = useCartStore();

  // Environment variables for disclaimer and checkout note
  const disclaimer = useMemo(
    () =>
      process.env.NEXT_PUBLIC_DISCLAIMER ||
      "*Applicable on select products only. T&C apply",
    [],
  );

  const checkoutNote = useMemo(
    () =>
      process.env.NEXT_PUBLIC_CHECKOUT_NOTE ||
      "*All coupons will apply on checkout",
    [],
  );

  // Reset scroll position when cart items change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [items]);

  // Show loading skeleton
  if (isLoading) {
    return <CouponOffersSkeleton />;
  }

  // Show error state
  if (error) {
    return <ErrorState onRetry={refetch} error={error} />;
  }

  // Show empty state if no coupons
  if (coupons.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white pl-[16px] mt-[16px] border-b border-surface-3">
      {/* Header */}
      <h2 className="font-semibold text-black text-text-base font-body tracking-[-0.333px]">
        Available offers for you ({coupons.length})
      </h2>

      {/* Offers Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll gap-[8px] mt-[8px] pb-[8px]"
      >
        {coupons.map((offer) => (
          <div
            key={offer.id}
            className="basis-[87%] md:basis-3/5 flex-shrink-0 last:pr-[16px]"
          >
            <CouponCard offer={offer} />
          </div>
        ))}
      </div>

      {/* Footer Notes */}
      <div className="pt-[4px] pb-[16px] font-body">
        <p className="text-text-sm text-grey-3 italic mb-[4px]">{disclaimer}</p>
        <div
          style={{
            background: "linear-gradient(90deg, #06c, #fff, #fff)",
            backgroundSize: "200%",
          }}
          className="text-white text-text-sm rounded-[4px] px-[4px] italic leading-normal"
        >
          {checkoutNote}
        </div>
      </div>
    </div>
  );
};
