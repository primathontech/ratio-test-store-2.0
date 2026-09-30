"use client";

import { useAuth } from "@shopkit/core/context";
import { formatPaiseToINR } from "@/utils";
import {
  CancellationReasonApiValue,
  OrderStatus,
} from "@/widgets/common/Orders/enums";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { CheckmarkIcon } from "../../Account/icons/index";
import { Pagination } from "../../Addresses/components/Pagination";
import { OrderApiResponse } from "../../ThankYou/types";
import { cancelOrder, isOrderCancellable } from "@/services/order.service";
import { getPaymentUIStatus } from "../utils";
import { CancelOrderModal } from "./CancelOrderModal";
import { OrderStatusCell } from "./OrderStatusCell";

interface OrderHistoryProps {
  orders?: OrderApiResponse[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onOrderUpdate?: () => void;
}

interface CancellationEligibility {
  [orderId: string]: {
    eligible: boolean;
    loading: boolean;
    error: string | null;
    reasons?: string[];
  };
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders = [],
  totalPages = 1,
  currentPage,
  onPageChange,
  onOrderUpdate,
}) => {
  const { accessToken } = useAuth();
  const [cancellationEligibility, setCancellationEligibility] =
    useState<CancellationEligibility>({});

  // Track pending requests to prevent duplicates
  const pendingRequests = useRef<Set<string>>(new Set());

  // Modal and per-order loading state management
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    orderId: string | null;
    orderNumber: string | null;
  }>({
    isOpen: false,
    orderId: null,
    orderNumber: null,
  });

  const [cancellingOrders, setCancellingOrders] = useState<Set<string>>(
    new Set()
  );

  // Optimized function to check cancellation eligibility - prevents duplicate calls
  const checkCancellationEligibility = async (orderId: string) => {
    // Skip if already loading or already have data or request is pending
    if (
      pendingRequests.current.has(orderId) ||
      cancellationEligibility[orderId]?.loading ||
      cancellationEligibility[orderId]?.eligible !== undefined
    ) {
      return;
    }

    const gkMerchantId = process.env.NEXT_PUBLIC_MERCHANT_ID || "";

    // Mark as pending
    pendingRequests.current.add(orderId);

    setCancellationEligibility((prev) => ({
      ...prev,
      [orderId]: { eligible: false, loading: true, error: null },
    }));

    try {
      const data = await isOrderCancellable(orderId, accessToken);

      setCancellationEligibility((prev) => ({
        ...prev,
        [orderId]: {
          eligible: data?.eligible || false,
          loading: false,
          error: null,
          reasons: data?.cancellationReasonList,
        },
      }));
    } catch (error) {
      console.error(
        `Error checking cancellation eligibility for order ${orderId}:`,
        error
      );
      setCancellationEligibility((prev) => ({
        ...prev,
        [orderId]: {
          eligible: false,
          loading: false,
          error: "Failed to check eligibility",
        },
      }));
    } finally {
      // Remove from pending requests
      pendingRequests.current.delete(orderId);
    }
  };

  // Check cancellation eligibility for all "open" orders when component mounts or orders change
  useEffect(() => {
    if (!accessToken || orders.length === 0) {
      return;
    }

    orders.forEach(({ order }) => {
      // First check if order is already cancelled - if yes, don't call API
      if (order?.status === OrderStatus.CANCELLED) {
        return; // Skip cancelled orders - just show status
      }

      // For non-cancelled orders, check eligibility via API (avoid duplicate calls)
      if (!cancellationEligibility[order.id]) {
        checkCancellationEligibility(order.id);
      }
    });
  }, [orders, accessToken]);

  // Function to handle cancel button click - opens modal
  const handleCancelOrder = (orderId: string) => {
    const order = orders.find(({ order }) => order.id === orderId)?.order;
    setModalState({
      isOpen: true,
      orderId,
      orderNumber: order?.external_order_name || order?.name || null,
    });
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      orderId: null,
      orderNumber: null,
    });
  };

  // Function to handle actual order cancellation
  const handleConfirmCancellation = async (
    reason?: string,
    customText?: string
  ) => {
    if (!modalState.orderId || !reason) {
      return;
    }

    const orderId = modalState.orderId;

    // Add order to cancelling set for loading state
    setCancellingOrders((prev) => new Set([...Array.from(prev), orderId]));

    try {
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      // Build the cancel-order request body. Treat any "other"-like reason
      // (case-insensitive) coming from the API as the free-text branch.
      const isOtherReason = /^other/i.test(reason);
      const requestBody =
        isOtherReason && customText
          ? {
              reason: CancellationReasonApiValue.OTHER,
              cancelReasonText: customText,
            }
          : { reason };

      // Cancel via the centralized order service
      await cancelOrder(orderId, requestBody, accessToken);

      // Close modal and remove from cancelling set
      handleModalClose();
      setCancellingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });

      // Refresh the orders list to reflect the updated status
      if (onOrderUpdate) {
        onOrderUpdate();
      }
    } catch (error) {
      console.error(`Error cancelling order ${orderId}:`, error);

      // Remove from cancelling set on error
      setCancellingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });

      // Show error message to user
      alert(
        `Failed to cancel order: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  return (
    <div data-testid="order-history-container" className="flex-1">
      {/* Order History Section */}
      <div data-testid="order-history-content">
        <h2
          data-testid="order-history-title"
          className="text-lg font-semibold tracking-tight text-[#1D1D1D] my-[18px]"
        >
          Order history
        </h2>

        {orders.length === 0 ? (
          <div
            data-testid="order-history-empty-state"
            className="border-2 border-order-text rounded-xl py-[14px] px-[25px] mt-8 flex items-center gap-4"
          >
            {/* Circular green icon with white checkmark */}
            <div
              data-testid="order-history-empty-state-icon"
              className="flex-shrink-0 w-9 h-9 bg-order-text rounded-full flex items-center justify-center"
            >
              <CheckmarkIcon />
            </div>
            {/* Text content */}
            <div
              data-testid="order-history-empty-state-content"
              className="flex items-center flex-wrap md:flex-nowrap gap-2"
            >
              <Link
                href="/"
                data-testid="order-history-empty-state-link"
                className="text-order-text underline text-sm font-semibold whitespace-nowrap"
              >
                MAKE YOUR FIRST ORDER
              </Link>
              <p
                data-testid="order-history-empty-state-text"
                className="text-order-text text-sm whitespace-nowrap"
              >
                You haven't placed any orders yet.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View - Hidden on mobile */}
            <div
              data-testid="order-history-desktop-table"
              className="hidden md:block rounded-2xl ring-1 ring-black/[0.06] shadow-sm overflow-hidden"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-light bg-neutral-50">
                    <th className="text-center font-semibold tracking-wide text-neutral-500 text-xs py-[18px] px-2.5">
                      ORDER
                    </th>
                    <th className="text-center font-semibold tracking-wide text-neutral-500 text-xs py-[18px] px-2.5">
                      PLACED ON
                    </th>
                    <th className="text-center font-semibold tracking-wide text-neutral-500 text-xs py-[18px] px-2.5">
                      PAYMENT STATUS
                    </th>
                    <th className="text-center font-semibold tracking-wide text-neutral-500 text-xs py-[18px] px-2.5">
                      DELIVERY BY
                    </th>
                    <th className="text-center font-semibold tracking-wide text-neutral-500 text-xs py-[18px] px-2.5">
                      TOTAL
                    </th>
                    <th className="text-center font-semibold tracking-wide text-neutral-500 text-xs py-[18px] px-2.5">
                      ORDER STATUS
                    </th>
                    <th className="text-center font-semibold tracking-wide text-neutral-500 text-xs py-[18px] px-2.5">
                      DETAILS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item, index) => {
                    const { order } = item;

                    return (
                      <tr
                        key={order.id}
                        className={`border-b border-gray-light h-[57px]${
                          index === orders.length - 1 ? "last:border-b-0" : ""
                        }`}
                      >
                        <td className="text-center text-primary text-sm p-2.5">
                          {order.external_order_name ?? (
                            <span className="inline-block h-3.5 w-20 bg-gray-200 animate-pulse rounded" />
                          )}
                        </td>
                        <td
                          className="text-center text-primary text-sm p-2.5"
                          suppressHydrationWarning
                        >
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="text-center text-primary text-sm p-2.5">
                          {order.payment_status ? (
                            <span
                              className={`inline-block rounded-full text-xs font-medium ${
                                getPaymentUIStatus(order.payment_status) ===
                                "Prepaid"
                                  ? "bg-prepaid-bg text-prepaid-text px-[11px] py-1"
                                  : "bg-cod-bg text-cod-text px-2 py-1"
                              }`}
                            >
                              {getPaymentUIStatus(order.payment_status)}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="text-center text-primary text-sm p-2.5">
                          {order?.tracking && order?.tracking.edd
                            ? new Date(order.tracking.edd).toLocaleDateString(
                                "en-US",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : ""}
                        </td>
                        <td className="text-center text-primary text-sm p-2.5">
                          {formatPaiseToINR(Number(order?.total_price))}
                        </td>
                        <td className="text-center text-primary text-sm p-2.5">
                          <OrderStatusCell
                            order={order}
                            eligibility={cancellationEligibility[order.id]}
                            onCancelOrder={handleCancelOrder}
                            isCancelling={cancellingOrders.has(order.id)}
                            isModalOpen={
                              modalState.isOpen &&
                              modalState.orderId === order.id
                            }
                          />
                        </td>
                        <td className="text-center text-primary text-sm p-2.5">
                          <Link
                            href={`/pages/orders/${order.id}`}
                            data-testid={`order-history-desktop-view-link-${order.id}`}
                            className="text-[#1D1D1D] hover:text-black underline underline-offset-4"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View - Visible only on mobile */}
            <div
              data-testid="order-history-mobile-cards"
              className="md:hidden space-y-5"
            >
              {orders.map((item) => {
                const { order } = item;
                const orderedDate = new Date(
                  order.created_at
                ).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                });

                return (
                  <div
                    key={order.id}
                    data-testid={`order-history-mobile-card-${order.id}`}
                    className="ring-1 ring-black/[0.06] shadow-sm rounded-2xl mb-5 bg-white overflow-hidden"
                  >
                    <div className="px-4 pt-4">
                      {/* Order Header */}
                      <div
                        data-testid={`order-history-mobile-card-header-${order.id}`}
                        className="space-y-2"
                      >
                        <div
                          data-testid={`order-history-mobile-card-header-left-${order.id}`}
                          className="flex justify-between !mt-0 pb-2.5"
                        >
                          <span className="text-primary text-xs font-bold uppercase">
                            Order
                          </span>
                          {order.external_order_name ? (
                            <span className="text-xs">
                              {order.external_order_name}
                            </span>
                          ) : (
                            <span className="inline-block h-3 w-[70px] bg-gray-200 animate-pulse rounded" />
                          )}
                        </div>
                        <div
                          data-testid={`order-history-mobile-card-date-${order.id}`}
                          className="flex justify-between !mt-0 pb-2.5"
                        >
                          <span className="text-primary text-xs font-bold uppercase">
                            Ordered Date
                          </span>
                          <span className="text-xs" suppressHydrationWarning>
                            {orderedDate}
                          </span>
                        </div>
                        <div
                          data-testid={`order-history-mobile-card-payment-status-${order.id}`}
                          className="flex justify-between !mt-0 pb-2.5"
                        >
                          <span className="text-primary text-xs font-bold uppercase">
                            Payment Status
                          </span>
                          {order.payment_status ? (
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                getPaymentUIStatus(order.payment_status) ===
                                "Prepaid"
                                  ? "bg-prepaid-bg text-prepaid-text"
                                  : "bg-cod-bg text-cod-text"
                              }`}
                            >
                              {getPaymentUIStatus(order.payment_status)}
                            </span>
                          ) : (
                            <span className="text-xs">-</span>
                          )}
                        </div>
                        <div
                          data-testid={`order-history-mobile-card-delivery-${order.id}`}
                          className="flex justify-between !mt-0 pb-2.5"
                        >
                          <span className="text-primary text-xs font-bold uppercase">
                            Delivery-By
                          </span>
                          <span className="text-xs">
                            {order?.tracking && order?.tracking.edd
                              ? new Date(order.tracking.edd).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : ""}
                          </span>
                        </div>
                        <div
                          data-testid={`order-history-mobile-card-total-${order.id}`}
                          className="flex justify-between !mt-0 pb-2.5"
                        >
                          <span className="text-primary text-xs font-bold uppercase">
                            Total
                          </span>
                          <span className="text-xs font-bold">
                            {formatPaiseToINR(Number(order?.total_price))}
                          </span>
                        </div>
                        <div
                          data-testid={`order-history-mobile-card-status-${order.id}`}
                          className="flex justify-between items-center !mt-0 pb-2.5"
                        >
                          <span className="text-primary text-xs font-bold uppercase">
                            Confirmation Status
                          </span>
                          <OrderStatusCell
                            order={order}
                            eligibility={cancellationEligibility[order.id]}
                            onCancelOrder={handleCancelOrder}
                            isCancelling={cancellingOrders.has(order.id)}
                            isModalOpen={
                              modalState.isOpen &&
                              modalState.orderId === order.id
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Link
                      href={`/pages/orders/${order.id}`}
                      data-testid={`order-history-mobile-view-link-${order.id}`}
                      className="w-full flex justify-center items-center py-[11px] text-[#1D1D1D] rounded-md text-sm font-medium transition-colors bg-neutral-50 hover:bg-neutral-100 leading-none"
                    >
                      View
                    </Link>
                  </div>
                );
              })}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.max(1, totalPages)}
              onPageChange={onPageChange}
              position="left"
            />
          </>
        )}
      </div>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmCancellation}
        orderNumber={modalState.orderNumber || ""}
        isLoading={
          modalState.orderId ? cancellingOrders.has(modalState.orderId) : false
        }
        reasons={
          modalState.orderId
            ? cancellationEligibility[modalState.orderId]?.reasons
            : undefined
        }
      />
    </div>
  );
};
