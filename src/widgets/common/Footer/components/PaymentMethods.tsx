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
    <div className="flex items-center gap-[10px] md:mb-24 xl:mb-0">
      {paymentMethods.map((method, index) => (
        <div key={index}>
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
