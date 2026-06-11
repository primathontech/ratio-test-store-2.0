import React from "react";
import { FALLBACK_VALUE, formatPaiseToINRSafe } from "../../utils";

interface PriceDisplayProps {
  amount?: string | number | null;
  currency?: string;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = "INR",
  className,
}) => {
  const formatted = formatPaiseToINRSafe(amount);
  const isFallback = formatted === FALLBACK_VALUE;
  return (
    <div className={`bg-white rounded-[8px] p-[21px] ${className}`}>
      <div className="text-[14px] text-black font-medium">
        {isFallback ? FALLBACK_VALUE : `${formatted} ${currency}`}
      </div>
    </div>
  );
};
