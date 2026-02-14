import React from "react";
import Image from "next/image";

import { PaymentMethod } from "../types";

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  paymentMethods,
}) => {
  if (paymentMethods.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="footer-payment-methods-container"
      className="flex items-center gap-[4px] md:mb-24 xl:mb-0"
    >
      {paymentMethods.map((method: PaymentMethod, index: number) => (
        <div
          key={index}
          data-testid={`footer-payment-method-${index}`}
          className=""
        >
          <Image
            src={method.image}
            alt={method.name}
            width={40}
            height={25}
            priority
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
};
