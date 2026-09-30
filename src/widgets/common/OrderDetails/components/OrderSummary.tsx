"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import { formatPaiseToINR } from "@/utils";
import {
  CancellationReasonApiValue,
  OrderStatus,
  OtherChargeType,
} from "@/widgets/common/Orders/enums";
import { EDDResponse, OrderApiResponse } from "../../ThankYou/types";
import { TrackingSection } from "./TrackingSection";

interface CancellationEligibility {
  eligible: boolean;
  loading: boolean;
  error: string | null;
}

interface OrderSummaryProps {
  orderData: OrderApiResponse;
  eddData?: EDDResponse | null;
  eddLoading?: boolean;
  eligibility?: CancellationEligibility;
  onCancelOrder?: (orderId: string) => void;
  isCancelling?: boolean;
  isModalOpen?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderData,
  eddData,
  eligibility,
  onCancelOrder,
  isCancelling = false,
  isModalOpen = false,
}) => {
  const { order } = orderData || {};

  // Use dummy data for testing, fallback to actual eddData
  const currentEddData = eddData;
  const eddStatus = currentEddData ? (currentEddData as any).status : null;
  const isCancelled = order.status === OrderStatus.CANCELLED;

  // Create tracking statuses — cancelled status comes from order.status, not eddData
  const createTrackingStatuses = () => {
    const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Base statuses for all orders
    const baseStatuses = [
      {
        status: "Confirmed",
        date: orderDate,
        isActive: false,
        isCompleted: true,
      },
    ];

    if (isCancelled) {
      // Use order.updated_at for the cancellation date — not eddData
      baseStatuses.push({
        status: "Cancelled",
        date: new Date(order.updated_at).toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        isActive: true,
        isCompleted: true,
      });
    } else if (currentEddData) {
      // For PENDING, SHIPPED, DELIVERED — use eddData status
      const status = (currentEddData as any).status;
      baseStatuses.push({
        status: "Shipped",
        date:
          status === "SHIPPED" || status === "DELIVERED"
            ? new Date(
                (currentEddData as any).updatedAt || Date.now()
              ).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "",
        isActive: status === "SHIPPED",
        isCompleted: status === "SHIPPED" || status === "DELIVERED",
      });

      baseStatuses.push({
        status: "Delivered",
        date:
          status === "DELIVERED"
            ? new Date(
                (currentEddData as any).updatedAt || Date.now()
              ).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "",
        isActive: status === "DELIVERED",
        isCompleted: status === "DELIVERED",
      });
    }

    return baseStatuses;
  };

  const trackingStatuses = createTrackingStatuses();

  const activeShippingLines = order.shipping_lines?.filter(
    (line) => !line.is_removed
  );

  const shippingCharge =
    activeShippingLines && activeShippingLines.length > 0
      ? {
          amount: activeShippingLines.reduce(
            (sum, line) => sum + line.price,
            0
          ),
          label:
            activeShippingLines.length === 1
              ? activeShippingLines[0].title
              : "Shipping",
        }
      : order.other_charges_breakdown?.find(
          (item) => item.type === OtherChargeType.SHIPPING_CHARGES
        );

  const codCharge = order.other_charges_breakdown?.find(
    (item) => item.type === OtherChargeType.CASHON_DELIVERY_FEE
  );

  const otherCharges = order.other_charges_breakdown?.filter(
    (item) =>
      item.type !== OtherChargeType.SHIPPING_CHARGES &&
      item.type !== OtherChargeType.CASHON_DELIVERY_FEE
  );

  return (
    <div data-testid="order-details-container" className="flex-1">
      <div data-testid="order-details-content">
        <h2
          data-testid="order-details-title"
          className="text-lg font-semibold tracking-tight text-[#1D1D1D] mb-4"
        >
          Order history
        </h2>

        {/* Order Summary Card */}
        <div
          data-testid="order-details-summary-card"
          className="bg-white ring-1 ring-black/[0.06] shadow-sm rounded-2xl mb-6"
        >
          <div
            data-testid="order-details-header"
            className="bg-neutral-50 rounded-t-[16px] py-2 px-4"
          >
            <div
              data-testid="order-details-header-content"
              className="flex justify-between items-start"
            >
              <div
                data-testid="order-details-info-grid"
                className="flex gap-10"
              >
                <div>
                  <div
                    data-testid="order-details-placed-on"
                    className="flex gap-1"
                  >
                    <p className="text-sm text-primary font-bold">Placed on:</p>
                    <p className="text-sm font-bold text-primary leading-[22px]">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div
                    data-testid="order-details-order-id"
                    className="flex items-center gap-1"
                  >
                    <p className="text-xs text-neutral-500 font-bold leading-[22px]">
                      Order Id:
                    </p>
                    {order.external_order_name ? (
                      <p className="text-xs text-lightest-gray">
                        {order.external_order_name}
                      </p>
                    ) : (
                      <span className="inline-block h-[15px] w-20 bg-gray-200 animate-pulse rounded" />
                    )}
                  </div>
                </div>

                {currentEddData &&
                  (currentEddData as any).edd &&
                  !isCancelled && (
                    <div className="hidden md:block">
                      <div
                        data-testid="order-details-placed-on"
                        className="flex gap-1"
                      >
                        <p className="text-sm text-primary font-bold leading-[22px]">
                          Est. delivery by:
                        </p>
                      </div>
                      <div
                        data-testid="order-details-order-id"
                        className="flex"
                      >
                        <p className="text-xs text-lightest-gray leading-[22px]">
                          {new Date(
                            (currentEddData as any).edd
                          ).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
              {!isCancelled &&
                (eligibility?.loading || isCancelling || isModalOpen ? (
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="size-5 border-2 border-[#ccc] border-t-black rounded-full animate-spin" />
                  </div>
                ) : eligibility?.eligible ? (
                  <button
                    data-testid="order-details-cancel-button"
                    onClick={() => onCancelOrder?.(order.id)}
                    className="transition-colors text-sm bg-black py-[6px] px-4 rounded-full text-white font-semibold hover:bg-neutral-800"
                  >
                    CANCEL
                  </button>
                ) : (
                  <></>
                ))}
            </div>

            {isCancelled && order.status && (
              <>
                <div
                  data-testid="order-details-cancelled-on"
                  className="flex gap-1"
                >
                  <p className="text-sm text-primary font-bold leading-none">
                    Order Cancelled on
                  </p>
                  <p className="text-sm font-bold text-primary leading-none">
                    {new Date(order.updated_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {order.status && isCancelled && (
                  <div
                    data-testid="order-details-cancel-reason"
                    className="flex"
                  >
                    <p className="text-xs text-lightest-gray">
                      Cancel reason:{" "}
                    </p>
                    <p className="text-xs text-lightest-gray">
                      {order.cancel_reason?.toLowerCase() ===
                      CancellationReasonApiValue.OTHER.toLowerCase()
                        ? order.cancel_reason_text
                        : order.cancel_reason}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <div
            data-testid="order-details-body"
            className="flex flex-col gap-4 py-4 px-4 md:px-[15px] w-full"
          >
            {/* Order Status Timeline */}
            {trackingStatuses && trackingStatuses.length > 0 && (
              <TrackingSection
                statuses={trackingStatuses}
                isCancelled={isCancelled}
                orderStatus={
                  order.status === OrderStatus.CANCELLED
                    ? "Cancelled"
                    : eddStatus
                }
              />
            )}

            {/* Delivery Date with Gradient Background */}
            {currentEddData && (currentEddData as any).edd && (
              <div
                data-testid="order-details-delivery-container"
                className="pt-[18px] lg:pt-[4px] mb-[15px]"
              >
                <div
                  data-testid="order-details-delivery-badge"
                  className="relative px-2 py-1 rounded overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(90deg, #000000 0%, rgba(102, 102, 102, 0) 84.62%)",
                    maxWidth: "300px",
                  }}
                >
                  <p className="text-white text-xs leading-[19px]">
                    Delivery by:{" "}
                    {new Date((currentEddData as any).edd).toLocaleDateString(
                      "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Product Details */}
            {order.line_items && order.line_items.length > 0 && (
              <div
                data-testid="order-details-products-container"
                className="mb-[15px] md:mb-[35px] grid grid-cols-1 lg:grid-cols-2 lg:gap-5"
              >
                {order.line_items
                  .filter((product) =>
                    isCancelled
                      ? product.quantity !== 0
                      : product.current_quantity !== 0
                  )
                  .map((product) => (
                    <div
                      key={product.id}
                      data-testid={`order-details-product-${product.id}`}
                      className="flex items-start gap-6 py-4 md:p-4 rounded-lg"
                    >
                      <div
                        data-testid={`order-details-product-image-${product.id}`}
                        className="flex-shrink-0 w-[62px] h-[62px] lg:w-[67px] lg:h-[67px] bg-gray-100 lg:mb-[3px] overflow-hidden"
                      >
                        {product.image &&
                          (product.productHandle ? (
                            <Link href={`/products/${product.productHandle}`}>
                              <Image
                                src={product.image}
                                alt={product.title}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            </Link>
                          ) : (
                            <Image
                              src={product.image}
                              alt={product.title}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ))}
                      </div>

                      <div
                        data-testid={`order-details-product-info-${product.id}`}
                        className="flex-1"
                      >
                        <Link
                          href={`/products/${product.productHandle}`}
                          data-testid={`order-details-product-name-${product.id}`}
                          className="text-sm leading-snug text-[#1D1D1D] font-normal"
                        >
                          {product.title}
                        </Link>

                        <div
                          data-testid={`order-details-product-details-${product.id}`}
                          className="flex items-center gap-10 mt-[15px]"
                        >
                          <p className="text-xs text-[#1d1d1d] font-medium">
                            {formatPaiseToINR(Number(product.price))}
                          </p>

                          <p className="text-xs text-neutral-500 ">
                            Qty:{" "}
                            <span className="text-xs font-medium text-[#1d1d1d]">
                              {isCancelled
                                ? product.quantity
                                : product.current_quantity}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address and Price Details */}
        <div
          data-testid="order-details-footer-grid"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-[30px]"
        >
          {/* Shipping Address */}
          {order.shipping_address && (
            <div data-testid="order-details-shipping-address">
              <h3
                data-testid="order-details-shipping-address-title"
                className="text-sm font-semibold tracking-tight text-[#1D1D1D] mb-2.5"
              >
                Shipping Address
              </h3>
              <div
                data-testid="order-details-shipping-address-content"
                className="text-xs text-[#1D1D1D]"
              >
                <p>
                  {order.shipping_address.first_name}{" "}
                  {order.shipping_address.last_name}
                </p>
                <p>{order.shipping_address.address1}</p>
                <p>
                  {order.shipping_address.postal_code}{" "}
                  {order.shipping_address.city}{" "}
                  {order.shipping_address.province}
                </p>
              </div>
            </div>
          )}

          {/* Price Details */}
          {order.total_price && (
            <div data-testid="order-details-price-details">
              <h3
                data-testid="order-details-price-details-title"
                className="text-sm font-semibold tracking-tight text-[#1D1D1D] mb-2.5"
              >
                Price Details
              </h3>
              <div data-testid="order-details-price-details-content">
                <div
                  data-testid="order-details-price-subtotal"
                  className="flex justify-between"
                >
                  <span className="text-xs text-neutral-500">Subtotal</span>
                  <span className="text-xs text-neutral-500 lg:pr-10 xl:pr-10">
                    {formatPaiseToINR(Number(order.total_line_items_price))}
                  </span>
                </div>
                {order.discount_applications &&
                  order.discount_applications?.[0]?.code && (
                    <div
                      data-testid="order-details-price-subtotal"
                      className="flex justify-between"
                    >
                      <span className="text-xs text-neutral-500">Discount</span>
                      <span className="text-xs text-neutral-500  lg:pr-10 xl:pr-10 ">
                        -{formatPaiseToINR(Number(order.total_discount))} (
                        {order.discount_applications?.[0]?.code})
                      </span>
                    </div>
                  )}
                <div
                  data-testid="order-details-price-shipping"
                  className="flex justify-between"
                >
                  <span className="text-xs text-neutral-500">
                    {shippingCharge?.label || "Shipping (Standard Shipping)"}:
                  </span>
                  <span className="text-xs text-neutral-500 lg:pr-10 xl:pr-10 items-start">
                    {formatPaiseToINR(Number(shippingCharge?.amount ?? 0))}
                  </span>
                </div>

                {codCharge && (
                  <div
                    data-testid="order-details-price-shipping"
                    className="flex justify-between"
                  >
                    <span className="text-xs text-neutral-500">
                      Shipping{" "}
                      <span className="text-neutral-500">(COD Charges)</span>
                    </span>

                    <span className="text-xs text-neutral-500 lg:pr-10 xl:pr-10 items-start">
                      {formatPaiseToINR(Number(codCharge.amount))}
                    </span>
                  </div>
                )}

                {otherCharges &&
                  otherCharges.length > 0 &&
                  otherCharges.map((charge, index) => {
                    const chargeLabel = charge.label
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase());
                    return (
                      <div
                        key={`${charge.type}-${index}`}
                        className="flex justify-between"
                      >
                        <span className="text-xs text-neutral-500">
                          {chargeLabel}:
                        </span>
                        <span className="text-xs text-neutral-500 lg:pr-10 xl:pr-10 items-start">
                          {formatPaiseToINR(Number(charge.amount))}
                        </span>
                      </div>
                    );
                  })}

                {/* Taxes */}
                {parseFloat(order.total_tax) > 0 && (
                  <div
                    data-testid="order-details-price-total-tax"
                    className="flex justify-between"
                  >
                    <span className="text-xs text-neutral-500">Taxes</span>
                    <span className="text-xs text-neutral-500 lg:pr-10 xl:pr-10">
                      {formatPaiseToINR(Number(order.total_tax))}
                    </span>
                  </div>
                )}

                <div
                  data-testid="order-details-price-total"
                  className="flex justify-between pt-2 mt-2 border-t border-neutral-200"
                >
                  <span className="text-xs text-[#1D1D1D] font-semibold">
                    Total:
                  </span>
                  <span className="text-xs text-[#1D1D1D] font-semibold  lg:pr-10 xl:pr-10">
                    {formatPaiseToINR(Number(order.total_price))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
