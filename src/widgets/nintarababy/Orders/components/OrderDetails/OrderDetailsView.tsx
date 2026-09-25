"use client";

import { useAuth } from "@shopkit/core/context";
import { useParams, usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { LeftSideBar } from "../../../Account/common/LeftSideBar";
import { getDefaultNavigationItems } from "../../../Account/common/constant";
import { useAddressCount } from "../../../Account/hooks/useAddressCount";
import { getOrderDetails } from "../../api";
import { resolvePhoneNumber } from "../../utils/phoneResolver";
import { OrderApiResponse } from "../../types";
import { EDDResponse } from "../ThankYou/types";
import { OrderSummary } from "./OrderSummary";
import { useVariantTitles } from "@/hooks/useVariantTitles";

export const OrderDetailsView: React.FC = () => {
  const pathname = usePathname();
  const params = useParams();
  const { accessToken, logout: authLogout } = useAuth();
  const addressCount = useAddressCount();
  const [orderData, setOrderData] = useState<OrderApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [eddData, setEddData] = useState<EDDResponse | null>(null);
  const [eddLoading, setEddLoading] = useState(false);

  const orderId = params?.id as string;

  const { subtitles: productSubtitles } = useVariantTitles(
    orderData?.order?.line_items?.map((item) => ({
      variant_id: item.variant_id,
      productHandle: item.productHandle,
    })) ?? []
  );

  const gkToken =
    typeof accessToken === "string"
      ? accessToken
      : ((accessToken as { accessToken?: string; token?: string } | null)
          ?.accessToken ??
        (accessToken as { token?: string } | null)?.token ??
        "");

  const fetchOrderTracking = useCallback(async (trackingOrderId: string) => {
    if (!trackingOrderId) {
      return;
    }

    setEddLoading(true);
    try {
      // eslint-disable-next-line no-restricted-syntax
      const res = await fetch(
        `/api/v1/order-tracking/${trackingOrderId}?getHistory=true`
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
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Order ID not found in URL");
        setLoading(false);
        return;
      }

      if (!gkToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const phone = await resolvePhoneNumber(gkToken);

        if (!phone) {
          setError(
            "Unable to retrieve phone number for fetching order details"
          );
          return;
        }

        const result = await getOrderDetails({
          orderId,
          phone,
          requestId: Date.now().toString(),
          gkAccessToken: gkToken,
        });

        if (result) {
          setOrderData(result);
          if (result.order?.id) {
            fetchOrderTracking(result.order.id);
          }
        } else {
          setError("Failed to fetch order details");
        }
      } catch {
        setError("An error occurred while fetching order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, gkToken]);

  const handleLogout = () => {
    localStorage.removeItem("customerDetails");
    authLogout();
    if (typeof window !== "undefined" && (window as any).handleLogout) {
      (window as any).handleLogout("/");
    }
    window.location.replace("/");
  };

  const isOrdersPage = pathname === "/pages/orders";
  const isOrderDetailsPage =
    pathname?.startsWith("/pages/orders/") && pathname !== "/pages/orders";
  const isAddressesPage = pathname === "/account/addresses";
  const isDashboardPage = pathname === "/account";

  const navigationItems = getDefaultNavigationItems(
    isDashboardPage,
    isOrdersPage || !!isOrderDetailsPage,
    isAddressesPage,
    addressCount
  );

  if (loading) {
    return (
      <div className="bg-white">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-[30px] px-[15px] md:px-[30px] xl:px-[70px]">
            <LeftSideBar
              navigationItems={navigationItems}
              onLogout={handleLogout}
              isNavSticky
            />
            <main className="flex-1">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading order details...</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-[30px] px-[15px] md:px-[30px] xl:px-[70px]">
            <LeftSideBar
              navigationItems={navigationItems}
              onLogout={handleLogout}
              isNavSticky
            />
            <main className="flex-1">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="text-red-500 text-xl mb-4">
                    &#9888;&#65039;
                  </div>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[600px] md:min-h-[341px]">
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-[30px] px-[15px] md:px-[30px] xl:px-[70px]">
          <LeftSideBar
            navigationItems={navigationItems}
            onLogout={handleLogout}
            isNavSticky
          />

          {orderData && (
            <main className="flex-1">
              <OrderSummary
                orderData={orderData}
                eddData={eddData}
                eddLoading={eddLoading}
                productSubtitles={productSubtitles}
              />
            </main>
          )}
        </div>
      </div>
    </div>
  );
};
