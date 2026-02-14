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
    <div className={`bg-white rounded-[8px] p-[21px] ${className}`}>
      <div className="text-[14px] text-black font-medium">
        ₹{(parseFloat(amount) / 100).toFixed(2)} {currency}
      </div>
    </div>
  );
};
