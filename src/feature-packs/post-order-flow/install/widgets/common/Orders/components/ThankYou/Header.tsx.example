import React from "react";
import { formatDateSafe, TrackingStatus } from "../../utils";
import { EDDResponse, OrderApiResponse } from "./types";

interface HeaderProps {
  order?: OrderApiResponse["order"];
  eddData?: EDDResponse | null;
  eddLoading?: boolean;
}

export const ThankYouHeader: React.FC<HeaderProps> = ({
  order,
  eddData,
  eddLoading,
}) => {
  if (!order) {
    return null;
  }

  const getDeliveryDate = () => {
    if (eddLoading) {
      return "Loading...";
    }
    if (eddData?.edd) {
      return formatDateSafe(eddData.edd);
    }
    return "";
  };

  const formatTimelineDate = (dateString: string) =>
    formatDateSafe(dateString, { month: "short", day: "numeric" });

  const trackingStatus =
    (order.tracking?.status as TrackingStatus) ||
    (eddData?.status as TrackingStatus);

  const getStatusDateFromHistory = (
    status: TrackingStatus | string
  ): string | null => {
    if (!eddData?.history || !Array.isArray(eddData?.history)) {
      return eddData?.statusDate || null;
    }
    const historyEntry = eddData.history.find(
      (entry) => entry.status === status
    );
    if (historyEntry) {
      return historyEntry.statusDate ?? null;
    }
    return eddData?.statusDate || null;
  };

  const currentStatusDate = getStatusDateFromHistory(trackingStatus);
  const confirmedStatusDate = getStatusDateFromHistory(
    TrackingStatus.CONFIRMED
  );
  const shippedStatusDate = getStatusDateFromHistory(TrackingStatus.SHIPPED);

  const isOrderPending = trackingStatus === TrackingStatus.PENDING;
  const isOrderConfirmed = trackingStatus === TrackingStatus.CONFIRMED;
  const isOrderDelivered = trackingStatus === TrackingStatus.DELIVERED;
  const isOrderShipped = trackingStatus === TrackingStatus.SHIPPED;
  const isOrderCancelled = trackingStatus === TrackingStatus.CANCELLED;

  return (
    <div className="mb-8">
      <div className="border rounded-[8px] border-[#d6d6d6]">
        <div className="flex justify-between p-[14px] border-b border-[#d6d6d6]">
          <span className="text-black text-[14px] font-semibold">
            Order Date:
          </span>
          <span className="ml-2 text-black text-[14px]">
            {formatDateSafe(order.created_at)}
          </span>
        </div>
        <div className="flex justify-between p-[14px] border-b border-[#d6d6d6]">
          <span className="text-black text-[14px] font-semibold flex flex-col">
            Delivery Estimate:
            <span className="text-[12px] text-[#666]">
              Standard delivery time is within 3-5 days
            </span>
          </span>
          <span className="ml-2 text-black text-[14px]">
            {getDeliveryDate()}
          </span>
        </div>
        <p className="text-[12px] md:text-[14px] italic bg-[#ededed] text-[#666] p-[14px]">
          Please note that once your order is packed, it cannot be cancelled.
          For further queries, reach out to our Customer Support.
        </p>
      </div>

      {isOrderDelivered ? (
        <div className="mt-[21px] bg-white rounded-[8px] p-[21px]">
          <div className="relative">
            <div
              className="absolute left-[17px] top-[18px] w-[1px] border-l border-dashed border-[#d6d6d6]"
              style={{ height: "calc(1rem + 1.5rem)" }}
            />
            <div className="flex items-start relative pl-[9px] mb-4 z-10">
              <div className="w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center mt-1">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#707070]"
                >
                  <path
                    d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-[14px] text-black font-semibold">
                  Delivered
                </span>
                {currentStatusDate && (
                  <span className="text-[12px] text-[#707070]">
                    {formatTimelineDate(currentStatusDate)}
                  </span>
                )}
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute left-[17px] top-[18px] w-[1px] border-l border-dashed border-[#d6d6d6]"
                style={{ height: "calc(1rem + 0.25rem + 0.375rem)" }}
              />
              <div className="flex items-start relative z-10 pl-[9px]">
                <div className="w-[18px] h-[18px] flex-shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#707070]"
                  >
                    <path
                      d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="text-[14px] text-black font-semibold">
                    On its way
                  </span>
                  {shippedStatusDate && (
                    <span className="text-[12px] text-[#707070]">
                      {formatTimelineDate(shippedStatusDate)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start mt-4 relative pl-[9px] z-10">
                <div className="w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center mt-1">
                  <div className="w-[6px] h-[6px] rounded-full bg-[#707070]" />
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="text-[14px] text-black font-semibold">
                    Confirmed
                  </span>
                  {confirmedStatusDate && (
                    <span className="text-[12px] text-[#707070]">
                      {formatTimelineDate(confirmedStatusDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isOrderShipped ? (
        <div className="mt-[21px] bg-white rounded-[8px] p-[21px]">
          <div className="relative">
            <div
              className="absolute left-[17px] top-[18px] w-[1px] border-l border-dashed border-[#d6d6d6]"
              style={{ height: "calc(1rem + 0.25rem + 0.375rem)" }}
            />
            <div className="flex items-start relative z-10 pl-[9px]">
              <div className="w-[18px] h-[18px] flex-shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#707070]"
                >
                  <path
                    d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-[14px] text-black font-semibold">
                  On its way
                </span>
                {shippedStatusDate && (
                  <span className="text-[12px] text-[#707070]">
                    {formatTimelineDate(shippedStatusDate)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start mt-4 relative pl-[9px] z-10">
              <div className="w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center mt-1">
                <div className="w-[6px] h-[6px] rounded-full bg-[#707070]" />
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-[14px] text-black font-semibold">
                  Confirmed
                </span>
                {confirmedStatusDate && (
                  <span className="text-[12px] text-[#707070]">
                    {formatTimelineDate(confirmedStatusDate)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : isOrderPending ? (
        <div className="mt-[21px] flex items-start bg-white rounded-[8px] p-[21px]">
          <div className="flex flex-col">
            <span className="text-[14px] text-black font-medium">Pending</span>
            {currentStatusDate && (
              <span className="text-[12px] text-[#707070]">
                {formatTimelineDate(currentStatusDate)}
              </span>
            )}
          </div>
        </div>
      ) : isOrderCancelled ? (
        <div className="mt-[21px] flex items-start bg-white rounded-[8px] p-[21px]">
          <div className="text-[#707070] flex-shrink-0 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 14 14"
              width="18"
              height="18"
              focusable="false"
              aria-hidden="true"
            >
              <g clipPath="url(#xCircle_svg__a)">
                <circle
                  cx="7"
                  cy="7"
                  r="5.5"
                  stroke="currentColor"
                  fill="none"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  d="M9 9 5 5m0 4 4-4"
                />
              </g>
              <defs>
                <clipPath id="xCircle_svg__a">
                  <path fill="#fff" d="M0 0h14v14H0z" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="ml-3 flex flex-col">
            <span className="text-[14px] text-black font-medium">
              Cancelled
            </span>
            <span className="text-[12px] text-[#707070] mt-1">
              Your order has been cancelled
            </span>
            {currentStatusDate && (
              <span className="text-[12px] text-[#707070] mt-1">
                {formatTimelineDate(currentStatusDate)}
              </span>
            )}
          </div>
        </div>
      ) : isOrderConfirmed ? (
        <div className="mt-[21px] flex items-start bg-white rounded-[8px] p-[21px]">
          <div className="text-[#707070] mt-1">
            <svg
              width="18"
              height="18"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] text-black font-medium">
              Confirmed
            </span>
            {currentStatusDate && (
              <span className="text-[12px] text-[#707070]">
                {formatTimelineDate(currentStatusDate)}
              </span>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
