import React from "react";
import type { IHowToShopStep, ITermsAndConditions } from "../../types";

interface HowToShopModalContentProps {
  title: string;
  steps: IHowToShopStep[];
  termsAndConditions: ITermsAndConditions;
  primaryButtonText: string;
  onClose: () => void;
}

export const HowToShopModalContent: React.FC<HowToShopModalContentProps> = ({
  title,
  steps,
  termsAndConditions,
  primaryButtonText,
  onClose,
}) => {
  return (
    <>
      <h2
        data-testid="how-to-shop-modal-content-title"
        className="px-4 text-xl font-bold text-black mb-6"
      >
        {title}
      </h2>

      <ul
        data-testid="how-to-shop-modal-content-steps-list"
        className="px-4 space-y-4 pb-6 list-disc list-inside border-b border-dashed border-[#DDDDDD]"
      >
        {steps.map((step) => (
          <li
            key={step.id}
            data-testid={`how-to-shop-modal-content-step-${step.id}`}
            className="text-sm leading-none text-black"
            // eslint-disable-next-line no-restricted-syntax
            dangerouslySetInnerHTML={{ __html: step.text }}
          />
        ))}
      </ul>

      <div
        data-testid="how-to-shop-modal-content-terms-container"
        className="px-4 mt-6 mb-10"
      >
        <h3
          data-testid="how-to-shop-modal-content-terms-title"
          className="text-xl font-bold text-black mb-4"
        >
          {termsAndConditions.title}
        </h3>
        <p
          data-testid="how-to-shop-modal-content-terms-text"
          className="text-sm leading-none text-black"
        >
          {termsAndConditions.points}
        </p>
      </div>

      <div
        data-testid="how-to-shop-modal-content-button-container"
        className="px-4 pt-4 pb-6 shadow-[0px_-4px_8px_0px_rgba(0,0,0,0.08)]"
      >
        <button
          data-testid="how-to-shop-modal-content-primary-button"
          onClick={onClose}
          className="w-full bg-black text-white text-base font-bold py-3 px-4 rounded-lg"
        >
          {primaryButtonText}
        </button>
      </div>
    </>
  );
};
