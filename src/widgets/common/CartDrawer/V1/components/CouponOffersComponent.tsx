"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useCoupons } from "./useCoupons";
import { CouponOffer } from "../../types";
import { CouponOffersSkeleton } from "./CouponCardSkeleton";
import { useCartStore } from "@shopkit/cart";

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

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }, [offer.code, onCopy]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <div className="w-full h-full bg-white border border-gray-200 rounded-lg p-4 pb-2 flex flex-col font-opensans">
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-black tracking-[-0.333px]">
            {offer.title}
          </h3>
          <p className="text-xs font-normal text-[#505050] tracking-[-0.333px]">
            {offer.description}
          </p>
        </div>
        <div className="flex items-center mt-2 mr-4">
          <div className="px-4 py-0.5 md:py-1 bg-white border border-dashed border-r-0 border-[#ddd] rounded-tl-md rounded-bl-md font-mono text-sm font-bold text-black truncate">
            {offer.code}
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-1 text-sm font-bold text-[#0066CC] bg-[#D6F4FF] rounded-tr-md rounded-br-md whitespace-nowrap font-opensans"
          >
            {copied ? "COPIED" : "COPY CODE"}
          </button>
        </div>
      </div>
    );
  }
);

CouponCard.displayName = "CouponCard";

const ErrorState: React.FC<{ onRetry: () => void; error: string }> = ({
  onRetry,
  error,
}) => (
  <div className="bg-white pl-4 mt-4 border-b border-gray-200">
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

const EmptyState: React.FC = () => (
  <div className="bg-white pl-4 mt-4 border-b border-gray-200">
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-gray-500 text-sm">No offers available at the moment</p>
    </div>
  </div>
);

export const CouponOffersComponent: React.FC = () => {
  const { coupons, isLoading, error, refetch } = useCoupons();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { items } = useCartStore();

  const disclaimer = useMemo(
    () =>
      process.env.NEXT_PUBLIC_DISCLAIMER ||
      "*Applicable on select products only. T&C apply",
    []
  );

  const checkoutNote = useMemo(
    () =>
      process.env.NEXT_PUBLIC_CHECKOUT_NOTE ||
      "*All coupons will apply on checkout",
    []
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [items]);

  if (isLoading) {
    return <CouponOffersSkeleton />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} error={error} />;
  }

  if (coupons.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white pl-4 mt-4 border-b border-gray-200">
      <h2 className="font-semibold text-black text-sm font-body tracking-[-0.333px]">
        Available offers for you ({coupons.length})
      </h2>

      <div ref={scrollRef} className="flex overflow-x-scroll gap-2 mt-2 pb-2">
        {coupons.map((offer) => (
          <div
            key={offer.id}
            className="basis-[87%] md:basis-3/5 flex-shrink-0 last:pr-4"
          >
            <CouponCard offer={offer} />
          </div>
        ))}
      </div>

      <div className="pt-1 pb-4 font-body">
        <p className="text-xs text-gray-500 italic mb-1">{disclaimer}</p>
        <div
          style={{
            background: "linear-gradient(90deg, #06c, #fff, #fff)",
            backgroundSize: "200%",
          }}
          className="text-white text-xs rounded-sm px-1 italic leading-normal"
        >
          {checkoutNote}
        </div>
      </div>
    </div>
  );
};
