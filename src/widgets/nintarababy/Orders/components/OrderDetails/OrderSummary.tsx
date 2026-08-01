"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import { formatPaiseToINR } from "../../utils";
import { OrderApiResponse } from "../../types";
import { EDDResponse } from "../ThankYou/types";
import { TrackingSection } from "./TrackingSection";

interface OrderSummaryProps {
  orderData: OrderApiResponse;
  eddData?: EDDResponse | null;
  eddLoading?: boolean;
  /** productHandle -> subtitle from product metadata */
  productSubtitles?: Record<string, string>;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderData,
  eddData,
  productSubtitles,
}) => {
  const { order } = orderData || {};

  // Calculate subtotal from line items (price × quantity) to show pre-discount total
  const subtotal =
    order?.line_items?.reduce((sum, item) => {
      const price = parseFloat(
        item.price_set?.shop_money?.amount || item.price
      );
      return sum + price * item.quantity;
    }, 0) ?? Number(order?.subtotal_price ?? 0);

  const currentEddData = eddData;
  const eddStatus = currentEddData ? (currentEddData as any).status : null;
  const isCancelled = eddStatus === "CANCELLED" || order.status === "cancelled";

  const createTrackingStatuses = () => {
    if (!currentEddData) {
      return [];
    }

    const status = (currentEddData as any).status;
    const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const baseStatuses = [
      {
        status: "Confirmed",
        date: orderDate,
        isActive: false,
        isCompleted: true,
      },
    ];

    if (status === "CANCELLED") {
      baseStatuses.push({
        status: "Cancelled",
        date: new Date(
          (currentEddData as any).updatedAt || order.updated_at
        ).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        isActive: true,
        isCompleted: true,
      });
    } else {
      baseStatuses.push({
        status: "Shipped",
        date:
          status === "SHIPPED" || status === "DELIVERED"
            ? new Date(
                (currentEddData as any).updatedAt || Date.now()
              ).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
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
                day: "2-digit",
                month: "short",
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

  return (
    <div data-testid="order-details-container" className="flex-1">
      <div data-testid="order-details-content">
        <h2
          data-testid="order-details-title"
          className="text-[14px] font-bold text-black my-[18px]"
        >
          Order history
        </h2>

        {/* Order Summary Card */}
        <div
          data-testid="order-details-summary-card"
          className="bg-white border border-gray-200 rounded-[16px] mb-6"
        >
          <div
            data-testid="order-details-header"
            className="bg-gray-50 rounded-t-[16px] py-[8px] px-[16px]"
          >
            <div
              data-testid="order-details-header-content"
              className="flex justify-between items-start"
            >
              <div data-testid="order-details-info-grid" className="grid">
                <div
                  data-testid="order-details-placed-on"
                  className="flex gap-1"
                >
                  <p className="text-[14px] text-black font-bold">Placed on:</p>
                  <p className="text-[14px] font-bold text-black">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div data-testid="order-details-order-id" className="flex">
                  <p className="text-[12px] text-gray-500">Order Id:</p>
                  <p className="text-[12px] text-gray-500">{order.name}</p>
                </div>
              </div>
              {/* Track button commented out
              {!isCancelled && (
                <button
                  data-testid="order-details-track-button"
                  className="flex items-center gap-2 text-black hover:opacity-80 transition-opacity"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-[14px] font-medium">Track</span>
                </button>
              )}
              */}
            </div>

            {isCancelled && order.status && (
              <>
                <div
                  data-testid="order-details-cancelled-on"
                  className="flex gap-1"
                >
                  <p className="text-[14px] text-black font-bold leading-none">
                    Order Cancelled on
                  </p>
                  <p className="text-[14px] font-bold text-black leading-none">
                    {new Date(order.updated_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {isCancelled && (
                  <div
                    data-testid="order-details-cancel-reason"
                    className="flex"
                  >
                    <p className="text-[12px] text-gray-500">Cancel reason: </p>
                    <p className="text-[12px] text-gray-500">
                      {order.cancel_reason === "Other"
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
            className="flex flex-col gap-4 py-[16px] px-6 w-full"
          >
            {/* Order Status Timeline */}
            {trackingStatuses && trackingStatuses.length > 0 && (
              <TrackingSection
                statuses={trackingStatuses}
                isCancelled={isCancelled}
                orderStatus={
                  eddStatus === "CANCELLED" ? "Cancelled" : eddStatus
                }
              />
            )}

            {/* Delivery Date */}
            {currentEddData && (currentEddData as any).edd && (
              <div
                data-testid="order-details-delivery-container"
                className="pt-[18px] lg:pt-[18px] mb-[15px]"
              >
                <div
                  data-testid="order-details-delivery-badge"
                  className="relative px-[8px] py-[4px] rounded-[4px] overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(90deg, #000000 0%, rgba(102, 102, 102, 0) 84.62%)",
                    maxWidth: "300px",
                  }}
                >
                  <p className="text-white text-[12px]">
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
                className="mb-[15px] md:mb-[35px] lg:flex lg:gap-[20px]"
              >
                {order.line_items.map((product) => (
                  <div
                    key={product.id}
                    data-testid={`order-details-product-${product.id}`}
                    className="flex items-start gap-4 p-4 rounded-lg"
                  >
                    <div
                      data-testid={`order-details-product-image-${product.id}`}
                      className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden"
                    >
                      {product.image && product.productHandle && (
                        <Link href={`/products/${product.productHandle}`}>
                          <Image
                            src={product.image}
                            alt={product.title}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                      )}
                    </div>
                    <div
                      data-testid={`order-details-product-info-${product.id}`}
                      className="flex-1"
                    >
                      <Link
                        href={`/products/${product.productHandle}`}
                        data-testid={`order-details-product-name-${product.id}`}
                        className="text-[14px] text-black mb-2 font-normal"
                      >
                        {product.title}
                      </Link>
                      {productSubtitles?.[product.productHandle] && (
                        <p
                          className="text-[12px] text-[#666] font-normal"
                          data-testid={`order-details-product-subtitle-${product.id}`}
                        >
                          {productSubtitles[product.productHandle]}
                        </p>
                      )}
                      <div
                        data-testid={`order-details-product-details-${product.id}`}
                        className="flex items-center gap-4"
                      >
                        <p className="text-[14px] text-black">
                          {formatPaiseToINR(Number(product.price))}
                        </p>
                        <p className="text-[14px] text-black">
                          Qty: {product.quantity}
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
                className="text-[12px] font-bold text-black mb-4"
              >
                Shipping Address
              </h3>
              <div
                data-testid="order-details-shipping-address-content"
                className="text-[12px] text-black"
              >
                <p>
                  {order.shipping_address.first_name}{" "}
                  {order.shipping_address.last_name}
                </p>
                <p>{order.shipping_address.address1}</p>
                <p>
                  {order.shipping_address.postal_code ||
                    order.shipping_address.zip}{" "}
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
                className="text-[12px] font-bold text-black mb-4"
              >
                Price Details
              </h3>
              <div data-testid="order-details-price-details-content">
                <div
                  data-testid="order-details-price-subtotal"
                  className="flex justify-between"
                >
                  <span className="text-[12px] text-black">Subtotal</span>
                  <span className="text-[12px] text-black">
                    {formatPaiseToINR(subtotal)}
                  </span>
                </div>
                {order.discount_applications &&
                  order.discount_applications?.[0]?.code && (
                    <div className="flex justify-between">
                      <span className="text-[12px] text-black">Discount</span>
                      <span className="text-[12px] text-black">
                        -
                        {formatPaiseToINR(
                          Number(order.discount_applications?.[0]?.value)
                        )}{" "}
                        ({order.discount_applications?.[0]?.code})
                      </span>
                    </div>
                  )}
                <div
                  data-testid="order-details-price-shipping"
                  className="flex justify-between"
                >
                  <span className="text-[12px] text-black">
                    Shipping{" "}
                    {order.shipping_lines && (
                      <span className="text-gray-600">
                        ({order.shipping_lines[0].title})
                      </span>
                    )}
                    :
                  </span>
                  <span className="text-[12px] text-black">
                    {formatPaiseToINR(Number(order.shipping_lines[0].price))}
                  </span>
                </div>
                {order.other_charges_breakdown?.map((charge, index) => (
                  <div
                    key={`${charge.type}-${index}`}
                    data-testid={`order-details-price-${charge.type}`}
                    className="flex justify-between"
                  >
                    <span className="text-[12px] text-black">
                      {charge.label}
                    </span>
                    <span className="text-[12px] text-black">
                      {formatPaiseToINR(charge.amount)}
                    </span>
                  </div>
                ))}
                <div
                  data-testid="order-details-price-total"
                  className="flex justify-between pt-2"
                >
                  <span className="text-[12px] text-black">Total:</span>
                  <span className="text-[12px] text-black">
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
