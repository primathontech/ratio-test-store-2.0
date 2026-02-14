import Image from "next/image";
import React from "react";

const MOBILE_SOCIAL_ICONS = [
  {
    name: "Visa",
    image: "/dawn/svg/visa.svg",
  },
  {
    name: "Mastercard",
    image: "/dawn/svg/master-card.svg",
  },
  {
    name: "American Express",
    image: "/dawn/svg/amex.svg",
  },
  {
    name: "RuPay",
    image: "/dawn/svg/rupay.svg",
  },
  {
    name: "Google Pay",
    image: "/dawn/svg/g-pay.svg",
  },
  {
    name: "Paytm",
    image: "/dawn/svg/paytm.svg",
  },
  {
    name: "Freecharge",
    image: "/dawn/svg/free-charge.svg",
  },
];

export const MobileSocialIcons = () => {
  if (MOBILE_SOCIAL_ICONS.length === 0) {
    return null;
  }

  return (
    <div className={`py-6`}>
      <div className="flex justify-between items-center text-center">
        {MOBILE_SOCIAL_ICONS.map((icon, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="mb-3 size-[32px] flex items-center justify-center">
              <Image
                src={icon.image}
                alt={icon.name}
                width={32}
                height={32}
                className="w-full aspect-square object-fill"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
