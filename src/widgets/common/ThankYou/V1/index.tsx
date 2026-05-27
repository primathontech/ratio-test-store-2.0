"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCheckoutToken } from "@/integrations/kwikpass-custom";

import { EDDResponse, OrderApiResponse, ThankYouProps } from "../types";
import { getOrderById, getOrderTracking } from "@/services/order.service";
import {
  AddressSection,
  Footer,
  Header,
  OrderSummaryAccordion,
  PriceDisplay,
  RightSection,
} from "./components";
import { GuestUserStorage } from "./utils/guestUserStorage";

export const V1: React.FC<ThankYouProps> = () => {
  const router = useRouter();
  const gkToken = useCheckoutToken();

  const [orderData, setOrderData] = useState<OrderApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eddData, setEddData] = useState<EDDResponse | null>(null);
  const [eddLoading, setEddLoading] = useState(false);

  const fetchOrderTracking = useCallback(async (orderId: string) => {
    if (!orderId) {
      return;
    }

    setEddLoading(true);
    try {
      const data = await getOrderTracking(orderId, { getHistory: true });
      if (data && data.edd) {
        setEddData(data);
      }
    } catch (err) {
      console.error("Order tracking fetch error:", err);
    } finally {
      setEddLoading(false);
    }
  }, []);

  // Redirect to home if no auth/guest token after a short grace period
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (!gkToken) {
        router.push("/");
      }
    }, 500);

    return () => clearTimeout(timeOut);
  }, [router, gkToken]);

  // Fetch order on mount
  useEffect(() => {
    const fetchOrder = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const orderId = searchParams.get("orderId");
      const requestId = searchParams.get("requestId");
      const customerId = searchParams.get("customerId");

      if (orderId) {
        try {
          const guestData = GuestUserStorage.getGuestUserData();
          const phone = guestData?.phone || "";

          const data = await getOrderById({
            orderId,
            requestId: requestId || undefined,
            customerId: customerId || undefined,
            phone: phone || undefined,
            accessToken: gkToken,
          });

          if (data?.order) {
            setOrderData(data);
            if (data.order.id) {
              fetchOrderTracking(data.order.id);
            }
          }
        } catch (err) {
          console.error("Failed to fetch order details:", err);
          setError("Failed to load order details");
        }
      }
      setLoading(false);
    };

    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll for external_order_name if it's missing after initial load
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!orderData?.order || orderData.order.external_order_name) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;
    let cancelled = false;

    const poll = async () => {
      if (cancelled || attempts >= maxAttempts) {
        return;
      }
      attempts++;

      try {
        const searchParams = new URLSearchParams(window.location.search);
        const orderId = searchParams.get("orderId");
        if (!orderId) {
          return;
        }

        const guestData = GuestUserStorage.getGuestUserData();
        const phone = guestData?.phone || "";
        const requestId = searchParams.get("requestId");
        const customerId = searchParams.get("customerId");

        const data = await getOrderById({
          orderId,
          requestId: requestId || undefined,
          customerId: customerId || undefined,
          phone: phone || undefined,
          accessToken: gkToken,
        });
        if (data?.order?.external_order_name) {
          setOrderData((prev) => {
            if (!prev) {
              return data;
            }
            return {
              ...prev,
              order: {
                ...prev.order,
                external_order_name: data.order.external_order_name,
              },
            };
          });
          return;
        }
      } catch {
        // Silently retry
      }

      if (!cancelled) {
        const delay = 500 * Math.pow(2, attempts - 1);
        pollingRef.current = setTimeout(poll, delay);
      }
    };

    pollingRef.current = setTimeout(poll, 500);

    return () => {
      cancelled = true;
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
      }
    };
  }, [orderData?.order, gkToken]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
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
          <Link
            href={"/"}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Brand Logo */}
      <div className="flex justify-center md:justify-start py-7 px-[38px] max-w-[1200px] mx-auto">
        <Link href="/">
          <Image
            src={
              "https://cdn.shopify.com/s/files/1/0616/4994/4654/files/BB_Black_logo_x320.png?v=1733306438"
            }
            alt="brand logo"
            width={96}
            height={51}
            priority
            className="object-cover md:hidden"
          />
          <Image
            src={
              "https://cdn.shopify.com/s/files/1/0616/4994/4654/files/BB_Black_logo_x320.png?v=1733306438"
            }
            alt="brand logo"
            width={112}
            height={59}
            priority
            className="object-cover hidden md:block"
          />
        </Link>
      </div>

      <div className="bg-[#f5f5f5]">
        <OrderSummaryAccordion order={orderData.order} className="md:hidden" />

        {/* Order Header */}
        <div className="py-[21px] md:py-4 px-[21px] md:px-[38px] max-w-[1200px] mx-auto flex flex-col gap-y-[26px] md:flex-row justify-between">
          <div>
            <h2 className="text-[21px] text-black font-semibold flex items-center gap-2">
              Order{" "}
              {orderData?.order?.external_order_name ?? (
                <span className="inline-block h-5 w-[100px] bg-gray-200 animate-pulse rounded" />
              )}
            </h2>
            <p className="text-sm text-[#666]">
              Confirmed{" "}
              {new Date(orderData?.order?.created_at).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric" }
              )}
            </p>
          </div>

          <Link
            href="/"
            className="bg-white p-3.5 border rounded-lg border-[#d6d6d6] text-[#005bd1] text-sm font-semibold text-center"
          >
            Go Back to Homepage
          </Link>
        </div>

        <PriceDisplay
          amount={orderData?.order?.total_price || "0"}
          currency="INR"
          className="md:hidden mx-[21px]"
        />

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-[21px] pb-[38px] px-[21px] md:px-[38px] max-w-[1200px] mx-auto">
          {/* Left Column */}
          <div className="lg:col-span-7">
            <Header
              order={orderData.order}
              eddData={eddData}
              eddLoading={eddLoading}
            />
            <AddressSection order={orderData.order} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-[21px]">
            <PriceDisplay
              amount={orderData?.order?.total_price || "0"}
              currency="INR"
              className="hidden md:block"
            />
            <RightSection order={orderData.order} className="hidden md:block" />
          </div>
        </div>

        {/* Footer */}
        <div className="md:px-[38px] max-w-[1200px] mx-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};
