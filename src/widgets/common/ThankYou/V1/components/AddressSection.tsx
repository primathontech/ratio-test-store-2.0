import React from "react";
import { OrderApiResponse } from "../../types";

interface AddressSectionProps {
  order?: OrderApiResponse["order"];
}

export const AddressSection: React.FC<AddressSectionProps> = ({ order }) => {
  if (!order) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-[21px] flex flex-col md:flex-row gap-[17px]">
      <div className="flex-1 flex flex-col gap-y-[21px]">
        {/* Contact Information */}
        <div>
          <h3 className="text-sm text-black font-medium mb-2">
            Contact information
          </h3>
          <div className="text-sm text-black">
            {order.email ||
              order.billing_address?.email ||
              order.shipping_address?.email}
          </div>
        </div>

        {/* Shipping Address */}
        {order.shipping_address && (
          <div>
            <h3 className="text-sm text-black font-medium mb-2">
              Shipping address
            </h3>
            <div className="text-sm text-black space-y-1">
              <div>
                {order.shipping_address.first_name}{" "}
                {order.shipping_address.last_name}
              </div>
              <div>{order.shipping_address.address1}</div>
              <div>
                {order.shipping_address.city}, {order.shipping_address.province}
                , {order.shipping_address.postal_code}
              </div>
              <div>{order.shipping_address.phone}</div>
            </div>
          </div>
        )}

        {/* Shipping Method */}
        {order.shipping_lines && order.shipping_lines.length > 0 && (
          <div className="flex-1">
            <h3 className="text-sm text-black font-medium mb-2">
              Shipping method
            </h3>
            <div className="text-sm text-black">
              {order.shipping_lines[0].title}
            </div>
          </div>
        )}
      </div>

      {/* Billing Address */}
      {order.billing_address && (
        <div>
          <h3 className="text-sm text-black font-medium mb-2">
            Billing address
          </h3>
          <div className="text-sm text-black space-y-1">
            <div>
              {order.billing_address.first_name}{" "}
              {order.billing_address.last_name}
            </div>
            <div>{order.billing_address.address1}</div>
            <div>
              {order.billing_address.city}, {order.billing_address.province},{" "}
              {order.billing_address.postal_code}
            </div>
            <div>{order.billing_address.phone}</div>
          </div>
        </div>
      )}
    </div>
  );
};
