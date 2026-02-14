"use client";

import React from "react";
import { Box, Flex, Image } from "@/ui/atomic";
import { ShopifyCheckoutButton } from "@/integrations/checkout-shopify";
import { formatPaiseToINR } from "@/utils";

interface ShopifyCartSummaryProps {
  isLoading: boolean;
  totalAmount?: number;
  onCheckoutSuccess: (order: any) => void;
  onCheckoutError: (error: any) => void;
}

const CheckoutLoader = () => {
  return (
    <div className="inline-block size-[30px] border-4 border-white/50 border-t-transparent rounded-full animate-spin"></div>
  );
};

export const ShopifyCartSummary: React.FC<ShopifyCartSummaryProps> = ({
  totalAmount,
  onCheckoutSuccess,
  onCheckoutError,
  isLoading,
}) => {
  return (
    <Box
      className="cart-summary bg-white flex flex-col gap-[10px] px-[15px] md:px-[16px] pt-[10px] pb-[15px] md:py-[10px] border-t border-[#ebebeb] font-body"
      data-testid="bblunt-cart-summary"
    >
      <div
        className="flex items-center gap-[8px]"
        data-testid="bblunt-cart-summary-prepaid-offer"
      >
        <Image
          src="https://cdn.shopify.com/s/files/1/0646/0057/2090/files/cart_prepaid.gif?v=1707984487"
          alt="gift icon"
          width={20}
          height={20}
          loading="lazy"
          data-testid="bblunt-cart-summary-prepaid-icon"
        />
        <p
          className="drawer_text text-text-sm text-success !leading-none"
          data-testid="bblunt-cart-summary-prepaid-text"
        >
          Pay online and get extra 5% off
        </p>
      </div>

      {/* Total Section */}
      <Flex
        justify="between"
        align="center"
        className="total-section"
        data-testid="bblunt-cart-summary-total-section"
      >
        <p
          className="text-[20px] leading-tight font-normal text-black"
          data-testid="bblunt-cart-summary-subtotal-label"
        >
          Subtotal
        </p>
        <p
          className="text-[20px] leading-balanced text-black font-semibold"
          data-testid="bblunt-cart-summary-subtotal-amount"
        >
          {formatPaiseToINR(Number(totalAmount))}
        </p>
      </Flex>

      {/* Checkout Button */}
      <ShopifyCheckoutButton
        className={`checkout-btn w-full h-[45px] bg-primary text-white border-none rounded-[10px] cursor-pointer transition-colors flex items-center justify-center py-[5px] px-[45px] font-body ${isLoading ? "bg-black/50" : "bg-black"}`}
        onCheckoutSuccess={onCheckoutSuccess}
        onCheckoutError={onCheckoutError}
        data-testid="aqualogica-cart-summary-checkout-button"
      >
        {isLoading ? (
          <CheckoutLoader />
        ) : (
          <>
            <span className="flex flex-col">
              <span className="text-text-lg tracking-[1px] font-normal !leading-none">
                Checkout
              </span>
              <span className="text-[10px] leading-none pt-[2px]">
                Extra 5% off on prepaid order
              </span>
            </span>
            <span className="flex">
              <Image
                src="https://cdn.gokwik.co/v4/images/upi-icons.svg"
                alt="upi-icons"
                width={50}
                height={20}
                unoptimized
                priority
                className="object-cover mx-[10px]"
              />
              <Image
                src="https://cdn.gokwik.co/v4/images/right-arrow.svg"
                alt="upi-icons"
                width={9}
                height={20}
                unoptimized
                priority
                className="object-cover"
              />
            </span>
          </>
        )}
      </ShopifyCheckoutButton>
    </Box>
  );
};
