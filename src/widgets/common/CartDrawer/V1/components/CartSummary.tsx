"use client";

import React from "react";
import { Box, Flex, Image } from "@/ui/atomic";
import { CheckoutButtonCustom } from "@/integrations/checkout-custom";
import { formatPaiseToINR } from "@/utils";

interface CartSummaryProps {
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

export const CartSummary: React.FC<CartSummaryProps> = ({
  totalAmount,
  onCheckoutSuccess,
  onCheckoutError,
  isLoading,
}) => {
  return (
    <Box
      className="cart-summary bg-white flex flex-col gap-2.5 px-[15px] md:px-4 pt-2.5 pb-[15px] md:py-2.5 border-t border-[#ebebeb] font-body"
      data-testid="bblunt-cart-summary"
    >
      <div
        className="flex items-center gap-2"
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
          className="drawer_text text-xs text-success !leading-none"
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
          className="text-xl leading-tight font-normal text-black"
          data-testid="bblunt-cart-summary-subtotal-label"
        >
          Subtotal
        </p>
        <p
          className="text-xl text-black font-semibold"
          data-testid="bblunt-cart-summary-subtotal-amount"
        >
          {formatPaiseToINR(Number(totalAmount))}
        </p>
      </Flex>

      {/* Checkout Button */}
      <CheckoutButtonCustom
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
              <span className="text-base tracking-[1px] font-normal !leading-none">
                Checkout
              </span>
              <span className="text-[10px] leading-none pt-0.5">
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
                className="object-cover mx-2.5"
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
      </CheckoutButtonCustom>
    </Box>
  );
};
