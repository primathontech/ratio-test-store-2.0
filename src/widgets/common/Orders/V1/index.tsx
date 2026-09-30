"use client";

import { useAuth } from "@shopkit/core/context";
import { clearKwikpassAuthStorage } from "@/integrations/kwikpass-custom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LeftSideBar } from "../../Account/common/LeftSideBar";
import {
  defaultSettings,
  getDefaultNavigationItems,
} from "../../Account/common/constant";
import { useAccountData } from "../../Account/hooks/useAccountData";
import { getOrdersList, OrderListResponse } from "../api";
import { OrderHistory } from "../components/OrderHistory";
import { OrdersProps } from "../types";

export const OrdersV1: React.FC<OrdersProps> = ({
  data: _data,
  settings = {},
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken, logout: authLogout } = useAuth();

  // Phone comes from the shared AccountDataContext — no extra API call needed
  const { customer, addressCount, loading: accountLoading } = useAccountData();
  const phone = customer?.phone || customer?.defaultAddress?.phone || null;

  const [ordersData, setOrdersData] = useState<OrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentPage = Math.max(
    1,
    parseInt(searchParams.get("page") ?? "1", 10) || 1
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const fetchOrdersData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getOrdersList({
        phone: phone!,
        page: currentPage,
        limit: 10,
        requestId: Date.now().toString(),
        gkAccessToken: accessToken,
      });

      if (result) {
        setOrdersData(result);
      } else {
        setError("Failed to fetch orders data");
      }
    } catch {
      setError("An error occurred while fetching orders");
    } finally {
      setLoading(false);
    }
  }, [phone, currentPage, accessToken]);

  useEffect(() => {
    // Wait for AccountDataContext to finish before trying to fetch orders
    if (accountLoading) {
      return;
    }

    if (!accessToken) {
      return;
    }

    // Avoid the "no phone" flash on refresh: when `accessToken` flips from
    // null→truthy, AccountDataContext hasn't re-run its fetch yet so
    // `customer` is still null. Keep showing the spinner until the customer
    // record actually arrives; only then can we tell that phone is truly
    // missing.
    if (!customer) {
      return;
    }

    if (!phone) {
      setError("Unable to retrieve phone number for fetching orders");
      setLoading(false);
      return;
    }

    fetchOrdersData();
  }, [accountLoading, accessToken, customer, fetchOrdersData, phone]);

  // Poll for external_order_name if any order is missing it
  const hasMissingOrderName = ordersData?.orders?.some(
    (order) => !order.order.external_order_name
  );
  const orderNamePollingRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  useEffect(() => {
    if (!ordersData?.orders || !hasMissingOrderName) {
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
        if (!phone || !accessToken) {
          return;
        }

        const result = await getOrdersList({
          phone,
          page: currentPage,
          limit: 10,
          requestId: Date.now().toString(),
          gkAccessToken: accessToken,
        });

        if (result?.orders) {
          setOrdersData((prev) => {
            if (!prev) {
              return result;
            }
            return {
              ...prev,
              orders: prev.orders.map((existing, i) => {
                const fresh = result.orders[i];
                if (!fresh || existing.order.external_order_name) {
                  return existing;
                }
                if (fresh.order.external_order_name) {
                  return {
                    ...existing,
                    order: {
                      ...existing.order,
                      external_order_name: fresh.order.external_order_name,
                    },
                  };
                }
                return existing;
              }),
            };
          });

          const stillMissing = result.orders.some(
            (order) => !order.order.external_order_name
          );
          if (stillMissing && !cancelled) {
            const delay = 500 * Math.pow(2, attempts - 1);
            orderNamePollingRef.current = setTimeout(poll, delay);
          }
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
  }, [hasMissingOrderName, phone, currentPage, accessToken]);

  const handleLogout = useCallback(() => {
    clearKwikpassAuthStorage();
    if (typeof window !== "undefined" && (window as any).handleLogout) {
      (window as any).handleLogout("/");
    }
    authLogout();
    window.location.replace("/");
  }, [authLogout]);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }
      const newUrl = `${pathname}${params.size ? `?${params}` : ""}`;
      router.push(newUrl, { scroll: false });
    },
    [pathname, searchParams, router]
  );

  const isOrdersPage = pathname === "/pages/orders";
  const isAddressesPage = pathname === "/account/addresses";
  const isDashboardPage = pathname === "/account";

  const sidebarConfig = useMemo(
    () => ({
      showGetAppBanner: isOrdersPage
        ? false
        : (settings.showGetAppBanner ?? defaultSettings.showGetAppBanner),
      getAppBannerTitle:
        settings.getAppBannerTitle ?? defaultSettings.getAppBannerTitle,
      getAppBannerSubtitle:
        settings.getAppBannerSubtitle ?? defaultSettings.getAppBannerSubtitle,
      getAppButtonText:
        settings.getAppButtonText ?? defaultSettings.getAppButtonText,
      getAppButtonUrl:
        settings.getAppButtonUrl ?? defaultSettings.getAppButtonUrl,
      navigationItems:
        settings.navigationItems ??
        getDefaultNavigationItems(
          isDashboardPage,
          isOrdersPage,
          isAddressesPage,
          addressCount
        ),
    }),
    [settings, isOrdersPage, isDashboardPage, isAddressesPage, addressCount]
  );

  return (
    <div className="bg-white min-h-[600px] md:min-h-[341px]">
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4 px-[15px] md:px-[30px] xl:px-[70px]">
          <LeftSideBar
            showGetAppBanner={sidebarConfig.showGetAppBanner}
            getAppBannerTitle={sidebarConfig.getAppBannerTitle}
            getAppBannerSubtitle={sidebarConfig.getAppBannerSubtitle}
            getAppButtonText={sidebarConfig.getAppButtonText}
            getAppButtonUrl={sidebarConfig.getAppButtonUrl}
            navigationItems={sidebarConfig.navigationItems}
            onLogout={handleLogout}
            isNavSticky
          />

          <main
            key={pathname}
            className="flex-1"
            data-testid="account-main-content"
          >
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4"></div>
                  <p className="text-neutral-500">Loading orders...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="text-red-500 text-xl mb-4">⚠️</div>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-black text-white px-6 py-3 rounded-full hover:bg-neutral-800 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <OrderHistory
                orders={ordersData?.orders}
                totalPages={ordersData?.pagination?.totalPages ?? 1}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onOrderUpdate={fetchOrdersData}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrdersV1;
