"use client";

import { useAuth } from "@shopkit/core/context";
import { clearKwikpassAuthStorage } from "@/integrations/kwikpass-custom";
import { useParams, usePathname } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { LeftSideBar } from "../../Account/common/LeftSideBar";
import {
  defaultSettings,
  getDefaultNavigationItems,
} from "../../Account/common/constant";
import { useAccountData } from "../../Account/hooks/useAccountData";
import { getOrderDetails } from "../../Orders/api";
import { CancelOrderModal } from "../../Orders/components/CancelOrderModal";
import {
  CancellationReason,
  CancellationReasonApiValue,
  OrderStatus,
} from "../../Orders/enums";
import { resolvePhoneNumber } from "../../Orders/utils/phoneResolver";
import { EDDResponse, OrderApiResponse } from "../../ThankYou/types";
import {
  cancelOrder,
  getOrderTracking,
  isOrderCancellable,
} from "@/services/order.service";
import { OrderSummary } from "../components/OrderSummary";
import { OrderDetailsProps } from "../types";

export const OrderDetailsV1: React.FC<OrderDetailsProps> = ({
  settings = {},
}) => {
  const pathname = usePathname();
  const params = useParams();
  const { accessToken, logout: authLogout } = useAuth();
  const { addressCount } = useAccountData();
  const [orderData, setOrderData] = useState<OrderApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [eddData, setEddData] = useState<EDDResponse | null>(null);
  const [eddLoading, setEddLoading] = useState(false);
  const [eligibility, setEligibility] = useState<
    | {
        eligible: boolean;
        loading: boolean;
        error: string | null;
      }
    | undefined
  >(undefined);
  const [isCancelling, setIsCancelling] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    orderId: string | null;
    orderNumber: string | null;
  }>({ isOpen: false, orderId: null, orderNumber: null });
  const eligibilityFetched = useRef(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get order ID from URL params
  const orderId = params?.id as string;

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
    } catch (error) {
      console.error("Order tracking fetch error:", error);
    } finally {
      setEddLoading(false);
    }
  }, []);

  const checkCancellationEligibility = useCallback(
    async (id: string) => {
      if (eligibilityFetched.current) {
        return;
      }
      eligibilityFetched.current = true;

      setEligibility({ eligible: false, loading: true, error: null });

      try {
        const data = await isOrderCancellable(id, accessToken);
        setEligibility({
          eligible: data?.eligible || false,
          loading: false,
          error: null,
        });
      } catch {
        setEligibility({
          eligible: false,
          loading: false,
          error: "Failed to check eligibility",
        });
      }
    },
    [accessToken]
  );

  const handleCancelOrder = (id: string) => {
    const order = orderData?.order;
    setModalState({
      isOpen: true,
      orderId: id,
      orderNumber: order?.external_order_name || order?.name || null,
    });
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false, orderId: null, orderNumber: null });
  };

  const handleConfirmCancellation = async (
    reason?: string,
    customText?: string
  ) => {
    if (!modalState.orderId || !reason || !accessToken) {
      return;
    }

    const id = modalState.orderId;
    setIsCancelling(true);

    try {
      const requestBody =
        reason === CancellationReason.OTHERS && customText
          ? {
              reason: CancellationReasonApiValue.OTHER,
              cancelReasonText: customText,
            }
          : { reason };

      await cancelOrder(id, requestBody, accessToken);

      handleModalClose();
      setEligibility({ eligible: false, loading: false, error: null });
      // Refresh order data
      eligibilityFetched.current = false;
      setOrderData(null);
      setLoading(true);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      alert(
        `Failed to cancel order: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Order ID not found in URL");
        setLoading(false);
        return;
      }

      if (!accessToken) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Resolve phone number using priority logic
        const phone = await resolvePhoneNumber(accessToken);

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
          accessToken,
        });

        if (result) {
          setOrderData(result);

          // Fetch order tracking data to get EDD information
          const order = result.order;
          if (order.id) {
            fetchOrderTracking(order.id);
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
  }, [orderId, accessToken, refreshKey, fetchOrderTracking]);

  // Poll for external_order_name if it's missing after initial load
  const orderNamePollingRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
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
        if (!orderId || !accessToken) {
          return;
        }

        const phone = await resolvePhoneNumber(accessToken);
        if (!phone) {
          return;
        }

        const result = await getOrderDetails({
          orderId,
          phone,
          requestId: Date.now().toString(),
          accessToken,
        });

        if (result?.order?.external_order_name) {
          setOrderData((prev) => {
            if (!prev) {
              return result;
            }
            return {
              ...prev,
              order: {
                ...prev.order,
                external_order_name: result.order.external_order_name,
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
        orderNamePollingRef.current = setTimeout(poll, delay);
      }
    };

    orderNamePollingRef.current = setTimeout(poll, 500);

    return () => {
      cancelled = true;
      if (orderNamePollingRef.current) {
        clearTimeout(orderNamePollingRef.current);
      }
    };
  }, [
    orderData?.order?.external_order_name,
    orderId,
    accessToken,
    orderData?.order,
  ]);

  // Check cancellation eligibility once order data is loaded
  useEffect(() => {
    if (!orderData || !accessToken) {
      return;
    }
    const { order } = orderData;
    if (order.status === OrderStatus.CANCELLED) {
      return;
    }
    checkCancellationEligibility(order.id);
  }, [orderData, accessToken, checkCancellationEligibility]);

  const handleLogout = () => {
    clearKwikpassAuthStorage();
    if (typeof window !== "undefined" && (window as any).handleLogout) {
      (window as any).handleLogout("/");
    }
    authLogout();
    window.location.replace("/");
  };

  // Determine active tab based on current pathname
  const isOrdersPage = pathname === "/pages/orders";
  const isOrderDetailsPage =
    pathname?.startsWith("/pages/orders/") && pathname !== "/pages/orders";
  const isAddressesPage = pathname === "/account/addresses";
  const isDashboardPage = pathname === "/account";

  const showGetAppBanner = isOrderDetailsPage
    ? false
    : (settings.showGetAppBanner ?? defaultSettings.showGetAppBanner);

  const {
    getAppBannerTitle = defaultSettings.getAppBannerTitle,
    getAppBannerSubtitle = defaultSettings.getAppBannerSubtitle,
    getAppButtonText = defaultSettings.getAppButtonText,
    getAppButtonUrl = defaultSettings.getAppButtonUrl,
    navigationItems = getDefaultNavigationItems(
      isDashboardPage,
      isOrdersPage || !!isOrderDetailsPage,
      isAddressesPage,
      addressCount
    ),
  } = settings;

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-[30px] px-[15px] md:px-[30px] xl:px-[70px]">
            <LeftSideBar
              showGetAppBanner={showGetAppBanner}
              getAppBannerTitle={getAppBannerTitle}
              getAppBannerSubtitle={getAppBannerSubtitle}
              getAppButtonText={getAppButtonText}
              getAppButtonUrl={getAppButtonUrl}
              navigationItems={navigationItems}
              onLogout={handleLogout}
              isNavSticky
            />
            <main className="flex-1">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading order details...</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-[30px] px-[15px] md:px-[30px] xl:px-[70px]">
            <LeftSideBar
              showGetAppBanner={showGetAppBanner}
              getAppBannerTitle={getAppBannerTitle}
              getAppBannerSubtitle={getAppBannerSubtitle}
              getAppButtonText={getAppButtonText}
              getAppButtonUrl={getAppButtonUrl}
              navigationItems={navigationItems}
              onLogout={handleLogout}
              isNavSticky
            />
            <main className="flex-1">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="text-red-500 text-xl mb-4">⚠️</div>
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
    <div className="bg-white min-h-[600px] xl:max-w-[1400px] xl:mx-auto md:min-h-[341px]">
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4 px-[15px] md:px-[30px] xl:px-[50px] ">
          {/* Left Sidebar */}
          <LeftSideBar
            showGetAppBanner={showGetAppBanner}
            getAppBannerTitle={getAppBannerTitle}
            getAppBannerSubtitle={getAppBannerSubtitle}
            getAppButtonText={getAppButtonText}
            getAppButtonUrl={getAppButtonUrl}
            navigationItems={navigationItems}
            onLogout={handleLogout}
            isNavSticky
          />

          {/* Main Content Area - Only Order Details */}
          {orderData && (
            <main className="flex-1">
              <OrderSummary
                orderData={orderData}
                eddData={eddData}
                eddLoading={eddLoading}
                eligibility={eligibility}
                onCancelOrder={handleCancelOrder}
                isCancelling={isCancelling}
                isModalOpen={modalState.isOpen}
              />
            </main>
          )}
        </div>
      </div>

      <CancelOrderModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmCancellation}
        orderNumber={modalState.orderNumber || ""}
        isLoading={isCancelling}
      />
    </div>
  );
};

export default OrderDetailsV1;
