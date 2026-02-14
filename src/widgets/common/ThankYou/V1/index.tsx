"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ThankYouProps, OrderApiResponse } from "../types";
import {
  Header,
  AddressSection,
  RightSection,
  Footer,
  PriceDisplay,
  OrderSummaryAccordion,
} from "../compounds";
import Image from "next/image";
import { EventType, publishEvent } from "shopkit-analytics";
import { getCommerceClient } from "@/config";

export const ThankYouV1: React.FC<ThankYouProps> = () => {
  const [orderData, setOrderData] = useState<OrderApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const orderId = searchParams.get("orderId");
      const requestId = searchParams.get("requestId");
      const customerId = searchParams.get("customerId");
      const phone = searchParams.get("phone");
      const gkAccessToken = searchParams.get("gkAccessToken");
      const mid = process.env.NEXT_PUBLIC_MERCHANT_ID;
      const baseURL = process.env.NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL;
      const orderUrl = `${baseURL}/api/v1/auth/customers/orders/${orderId}`;

      // Headers required
      const headers = {
        accept: "application/json",
        "Gk-Merchant-Id": mid,
        "Gk-Request-Id": requestId || "",
        "Gk-Customer-Id": customerId || "",
        "Gk-Phone": phone,
        "gk-access-token": gkAccessToken,
      };

      if (orderId) {
        try {
          const commerceClient = getCommerceClient();
          const response = await commerceClient.fetchRequest(orderUrl, {
            method: "GET",
            headers: headers as any,
          });

          console.log("@@@ ", { response });

          if (response?.success) {
            setOrderData(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch order details:", error);
          setError("Failed to load order details");
        }
      }
      setLoading(false);
    };

    fetchOrder();
  }, []);

  const handleGoHomeClick = () => {
    publishEvent({
      type: EventType.CUSTOM,
      event_category: "user_interaction",
      description: "Go to Home button clicked",
      buttonId: "go-to-home-click",
      buttonText: "Go Back to Homepage",
    } as any);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !orderData?.order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to Load Order
          </h1>
          <p className="text-gray-600 mb-4">{error || "Order not found"}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="bg-[#f5f5f5]">
        <OrderSummaryAccordion order={orderData.order} className="md:hidden" />

        {/* Order Header */}
        <div className="md:mb-6 py-[21px] md:py-[28px] px-[21px] md:px-[38px] max-w-[1200px] mx-auto flex flex-col gap-y-[26px] md:flex-row justify-between">
          <div>
            <h2 className="text-[21px] text-black font-semibold">
              Order {orderData?.order?.name}
            </h2>
            <p className="text-[14px] text-[#666]">
              Confirmed{" "}
              {new Date(orderData?.order?.created_at).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                },
              )}
            </p>
          </div>
        </div>

        <PriceDisplay
          amount={orderData?.order?.total_price || "0"}
          currency="INR"
          className="md:hidden mx-[21px]"
        />

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-[21px] pb-[38px] px-[21px] md:px-[38px] max-w-[1200px] mx-auto">
          {/* Left Column - Header and Address */}
          <div className="lg:col-span-7">
            <Header order={orderData.order} />
            <AddressSection order={orderData.order} />
          </div>

          {/* Right Column - Products and Pricing */}
          <div className="lg:col-span-5 flex flex-col gap-[21px]">
            <PriceDisplay
              amount={orderData?.order?.total_price || "0"}
              currency="INR"
              className="hidden md:block"
            />

            <RightSection order={orderData.order} className="hidden md:block" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouV1;
