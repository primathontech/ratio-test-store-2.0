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
      className="flex items-center gap-2.5 md:mb-24 xl:mb-0"
      data-testid="footer-payment-methods-container"
    >
      {paymentMethods.map((method, index) => (
        <div key={index} data-testid={`footer-payment-method-${index}`}>
          <Image
            src={method.image}
            alt={method.name}
            width={40}
            height={25}
            loading="lazy"
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
};
