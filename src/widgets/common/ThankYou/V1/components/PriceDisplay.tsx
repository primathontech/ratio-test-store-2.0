import React from "react";

interface PriceDisplayProps {
  amount: string;
  currency?: string;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = "INR",
  className,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl ring-1 ring-black/[0.06] shadow-sm p-[21px] ${className ?? ""}`}
    >
      <div className="text-sm text-[#1D1D1D] font-medium">
        ₹{(parseFloat(amount) / 100).toFixed(2)} {currency}
      </div>
    </div>
  );
};
