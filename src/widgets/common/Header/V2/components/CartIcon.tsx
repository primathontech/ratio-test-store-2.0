"use client";

import React from "react";
import { Box } from "@/ui/atomic";
import { CartBadge } from "@/ui/components";

interface CartIconProps {
  onClick: () => void;
  textColor?: string;
  isMobile: boolean;
  ariaLabel: string;
}

export const CartIcon: React.FC<CartIconProps> = ({
  onClick,
  textColor = "inherit",
  isMobile,
  ariaLabel,
}) => {
  return (
    <Box
      data-testid="header-cart-icon-container"
      className="relative cursor-pointer flex items-center gap-4"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{ color: textColor || "inherit" }}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div data-testid="header-cart-icon" className="relative">
        <img
          src="/dawn/images/static/cart_icon.svg"
          alt="Shopping Cart"
          width={isMobile ? "16.15" : "20"}
          height={isMobile ? "16" : "21"}
          style={{ color: textColor || "inherit" }}
        />

        <CartBadge
          backgroundColor="#D6322C"
          textColor="#FFFFFF"
          position={{ top: "-9px", right: "-9px" }}
          size={{
            width: "18px",
            height: "18px",
          }}
          fontSize="12px"
          animate={false}
        />
      </div>
      {!isMobile && (
        <span className="text-text-base font-normal text-[#1D1D1D]">Cart</span>
      )}
    </Box>
  );
};
