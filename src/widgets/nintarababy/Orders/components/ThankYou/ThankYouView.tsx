"use client";

import { useCheckoutToken } from "@/integrations/kwikpass-custom/useCheckoutToken";
import { CustomCheckoutService } from "@/integrations/checkout-custom";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ThankYouHeader } from "./Header";
import { AddressSection } from "./AddressSection";
import { RightSection } from "./RightSection";
import { PriceDisplay } from "./PriceDisplay";
import { OrderSummaryAccordion } from "./OrderSummaryAccordion";
import { ThankYouFooter } from "./ThankYouFooter";
import { EDDResponse, OrderApiResponse } from "./types";
import { formatDateSafe } from "../../utils";
import { useVariantTitles } from "@/hooks/useVariantTitles";

export const ThankYouView: React.FC = () => {
  const gkToken = useCheckoutToken();
  const [orderData, setOrderData] = useState<OrderApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eddData, setEddData] = useState<EDDResponse | null>(null);
  const [eddLoading, setEddLoading] = useState(false);
  const hasFiredTrackier = useRef(false);

  // Order line items only carry variant_id (variant_title is null), so resolve
  // titles via the commerce client keyed by productHandle. We hold the loading
  // screen until these resolve so titles appear together with the order.
  const {
    titles: variantTitles,
    subtitles: productSubtitles,
    loading: variantsLoading,
  } = useVariantTitles(orderData?.order?.line_items ?? []);

  const fetchOrderTracking = useCallback(async (orderId: string) => {
    if (!orderId) {
      return;
    }

    setEddLoading(true);
    try {
      // eslint-disable-next-line no-restricted-syntax
      const res = await fetch(
        `/api/v1/order-tracking/${orderId}?getHistory=true`
      );
      const data = await res.json();
      if (data && data.edd) {
        setEddData(data);
      }
    } catch {
      // tracking fetch failed silently
    } finally {
      setEddLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadFromSessionStorage = (): OrderApiResponse | null => {
      try {
        const raw = sessionStorage.getItem("gk_last_order");
        if (!raw) {
          return null;
        }
        const parsed = JSON.parse(raw);
        const order = parsed?.orderSuccessBody ?? parsed;
        return order ? ({ order } as OrderApiResponse) : null;
      } catch {
        return null;
      }
    };

    const fetchOrder = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const orderId = searchParams.get("orderId");
      const requestId = searchParams.get("requestId");
      const customerId = searchParams.get("customerId");

      // If we have an orderId but no token yet, stay in loading state — the
      // effect will re-run when gkToken hydrates. Prevents rendering with the
      // incomplete sessionStorage (orderSuccessBody) payload.
      if (orderId && !gkToken) {
        return;
      }

      let apiOrder: OrderApiResponse | null = null;

      if (orderId && gkToken) {
        try {
          const qs = new URLSearchParams({
            orderId,
            requestId: requestId || "",
            customerId: customerId || "",
            gkAccessToken: gkToken,
          }).toString();
          // eslint-disable-next-line no-restricted-syntax
          const res = await fetch(`/api/v1/order?${qs}`);
          const data = await res.json();
          if (data?.order) {
            apiOrder = data;
          }
        } catch {
          // fall through to sessionStorage fallback
        }
      }

      if (apiOrder) {
        setOrderData(apiOrder);
        if (apiOrder.order?.id) {
          fetchOrderTracking(apiOrder.order.id);
        }
      } else {
        const cached = loadFromSessionStorage();
        if (cached) {
          setOrderData(cached);
        } else {
          setError("Failed to load order details");
        }
      }

      setLoading(false);
    };

    // Safety net: if the token never arrives within 10s (guest/incognito),
    // fall back to sessionStorage instead of spinning forever.
    const timeoutId = window.setTimeout(() => {
      if (!gkToken) {
        const cached = loadFromSessionStorage();
        if (cached) {
          setOrderData(cached);
        } else {
          setError("Failed to load order details");
        }
        setLoading(false);
      }
    }, 10000);

    fetchOrder();

    return () => {
      window.clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gkToken]);

  useEffect(() => {
    const order = orderData?.order;
    if (!order?.id) {
      return;
    }

    const shipping = order.shipping_address;
    const totalPaise = Number(order.total_price) || 0;
    const discountPaise = Number(order.total_discount) || 0;
    const subtotalPaise = Number(order.subtotal_price) || 0;

    const options = {
      order_id: order.id,
      order_amount: totalPaise / 100,
      cart_amount: (subtotalPaise || totalPaise) / 100,
      discount_amount: discountPaise / 100,
      email: order.email || shipping?.email || "",
      phone_number: shipping?.phone || "",
      page_name: "Thank You",
      additional_param: {
        pincode: shipping?.postal_code || shipping?.zip || "",
        product_ids: (order.line_items || []).map((li) =>
          String(li.product_id)
        ),
      },
    };

    let cancelled = false;
    let tries = 0;
    const apply = () => {
      const sdk = (
        window as unknown as {
          unloqOfferSdk?: { updateSDKOptions: (o: unknown) => void };
        }
      ).unloqOfferSdk;
      if (sdk && typeof sdk.updateSDKOptions === "function") {
        sdk.updateSDKOptions(options);
        return true;
      }
      return false;
    };

    if (apply()) {
      return;
    }
    const iv = window.setInterval(() => {
      if (cancelled || apply() || ++tries > 100) {
        window.clearInterval(iv);
      }
    }, 100);

    return () => {
      cancelled = true;
      window.clearInterval(iv);
    };
  }, [orderData]);

  useEffect(() => {
    const order = orderData?.order;
    if (!order || hasFiredTrackier.current) {
      return;
    }
    if (typeof window === "undefined" || !window.TrackierWebSDK) {
      return;
    }
    // Persist the fired state in sessionStorage so a page refresh within the
    // same browser session does not send a duplicate conversion event.
    const storageKey = `trackier_fired_${order.id}`;
    if (sessionStorage.getItem(storageKey)) {
      return;
    }
    hasFiredTrackier.current = true;
    sessionStorage.setItem(storageKey, "1");
    CustomCheckoutService.triggerTrackierTrackConv(order);
  }, [orderData]);

  // Keep the spinner up while the order is loading OR while variant titles are
  // still resolving for an already-loaded order — so the order and its variant
  // labels render together rather than the titles popping in afterwards.
  if (loading || (orderData?.order && variantsLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

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
            href="/"
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="nintara-thank-you">
      <style>{`@media (max-width: 1025px) { body:has(.nintara-thank-you) { padding-bottom: 0 !important; } }`}</style>
      <div className="bg-[#f5f5f5]">
        <OrderSummaryAccordion order={orderData.order} className="md:hidden" />

        {/* Order Header */}
        <div className="md:mb-6 py-[21px] md:py-[28px] px-[21px] md:px-[38px] max-w-[1200px] mx-auto flex flex-col gap-y-[26px] md:flex-row justify-between">
          <div>
            <h2 className="text-[21px] text-black font-semibold">
              Order {orderData.order.name}
            </h2>
            <p className="text-[14px] text-[#666]">
              Confirmed{" "}
              {formatDateSafe(orderData.order.created_at, {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          <Link
            href="/"
            className="bg-white p-[14px] border rounded-[8px] border-[#d6d6d6] text-[#005bd1] text-[14px] font-semibold text-center"
          >
            Go Back to Homepage
          </Link>
        </div>

        <PriceDisplay
          amount={orderData.order.total_price}
          currency="INR"
          className="md:hidden mx-[21px]"
        />

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-[21px] pb-[38px] px-[21px] md:px-[38px] max-w-[1200px] mx-auto">
          {/* Left Column */}
          <div className="lg:col-span-7">
            <ThankYouHeader
              order={orderData.order}
              eddData={eddData}
              eddLoading={eddLoading}
            />
            <AddressSection order={orderData.order} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-[21px]">
            <PriceDisplay
              amount={orderData.order.total_price}
              currency="INR"
              className="hidden md:block"
            />
            <RightSection
              order={orderData.order}
              variantTitles={variantTitles}
              productSubtitles={productSubtitles}
              className="hidden md:block"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="md:px-[38px] max-w-[1200px] mx-auto">
          <ThankYouFooter />
        </div>
      </div>
    </div>
  );
};
