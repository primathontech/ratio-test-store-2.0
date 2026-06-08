import React from "react";
import { OrderApiResponse } from "./types";

interface AddressSectionProps {
  order?: OrderApiResponse["order"];
}

export const AddressSection: React.FC<AddressSectionProps> = ({ order }) => {
  if (!order) {
    return null;
  }

  return (
    <div className="bg-white rounded-[8px] p-[21px] flex flex-col md:flex-row gap-[17px]">
      <div className="flex-1 flex flex-col gap-y-[21px]">
        <div>
          <h3 className="text-[14px] text-black font-medium mb-[9px]">
            Contact information
          </h3>
          <div className="text-[14px] text-black">
            {order.email ||
              order.billing_address?.email ||
              order.shipping_address?.email}
          </div>
        </div>

        {order.shipping_address && (
          <div>
            <h3 className="text-[14px] text-black font-medium mb-[9px]">
              Shipping address
            </h3>
            <div className="text-[14px] text-black space-y-1">
              <div>
                {order.shipping_address.first_name}{" "}
                {order.shipping_address.last_name}
              </div>
              <div>{order.shipping_address.address1}</div>
              <div>
                {order.shipping_address.city}, {order.shipping_address.province}
                ,{" "}
                {order.shipping_address.postal_code ||
                  order.shipping_address.zip}
              </div>
              <div>{order.shipping_address.phone}</div>
            </div>
          </div>
        )}

        {order.shipping_lines && order.shipping_lines.length > 0 && (
          <div className="flex-1">
            <h3 className="text-[14px] text-black font-medium mb-[9px]">
              Shipping method
            </h3>
            <div className="text-[14px] text-black">
              {order.shipping_lines[0].title}
            </div>
          </div>
        )}
      </div>

      {order.billing_address && (
        <div>
          <h3 className="text-[14px] text-black font-medium mb-[9px]">
            Billing address
          </h3>
          <div className="text-[14px] text-black space-y-1">
            <div>
              {order.billing_address.first_name}{" "}
              {order.billing_address.last_name}
            </div>
            <div>{order.billing_address.address1}</div>
            <div>
              {order.billing_address.city}, {order.billing_address.province},{" "}
              {order.billing_address.postal_code || order.billing_address.zip}
            </div>
            <div>{order.billing_address.phone}</div>
          </div>
        </div>
      )}
    </div>
  );
};
