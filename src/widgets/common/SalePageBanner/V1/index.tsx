"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import type { SalePageBannerProps } from "../types";
import { HowToShopModal } from "./components/HowToShopModal";
import { Timer } from "./components/Timer";
import { resolveImage } from "@/widgets/utils/resolveImageSrc";

/**
 * SalePageBanner V1
 *
 * Hero banner for sale / category-offer pages. Mirrors bblunt's
 * `SalePageBannerV1` exactly:
 *   - Responsive background image (mobile / desktop sources)
 *   - Offer block: title, price w/ currency, gradient-bordered coupon strip, expiry
 *   - Countdown Timer (rolling digit reels)
 *   - "How to shop" CTA that opens a desktop modal / mobile bottom sheet
 *
 * Static section — no API data. Settings come from the template.
 */
export const V1 = memo(function SalePageBannerV1({
  settings,
  className = "",
}: SalePageBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mobile = resolveImage(settings?.mobileSrc, {
    src: "",
    alt: "Sale Banner",
  });
  const desktop = resolveImage(settings?.desktopSrc, {
    src: "",
    alt: "Sale Banner",
  });
  const mobileSrc = mobile.src;
  const desktopSrc = desktop.src;
  const mobileAlt = mobile.alt;
  const desktopAlt = desktop.alt;
  const offerTitle = settings?.offerTitle;
  const offerPrice = settings?.offerPrice;
  const currencySymbol = settings?.currencySymbol;
  const couponCode = settings?.couponCode;
  const expiryText = settings?.expiryText;
  const endDateString = settings?.endDateString;
  const bannerCtaLabel = settings?.bannerCtaLabel;
  const howToShopTitle = settings?.howToShopTitle;
  const howToShopSteps = settings?.howToShopSteps;
  const termsAndConditionsTitle = settings?.termsAndConditionsTitle;
  const termsAndConditionsPoints = settings?.termsAndConditionsPoints;
  const primaryButtonLabel = settings?.primaryButtonLabel;
  const timerInterval = settings?.timerInterval ?? 1000;

  // Required fields missing → render nothing (matches bblunt reference)
  if (!mobileSrc || !desktopSrc || !offerTitle) {
    return null;
  }

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <>
      <div
        data-testid="sale-page-banner-container"
        className={`relative w-full overflow-hidden ${className || ""}`}
      >
        <div
          data-testid="sale-page-banner-background"
          className="relative w-full"
        >
          {/* Mobile Image */}
          <div
            data-testid="sale-page-banner-mobile-image"
            className="block md:hidden relative w-full aspect-[360/317]"
          >
            <Image
              src={mobileSrc}
              alt={mobileAlt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>

          {/* Desktop Image */}
          <div
            data-testid="sale-page-banner-desktop-image"
            className="hidden md:block relative w-full aspect-[1440/530]"
          >
            <Image
              src={desktopSrc}
              alt={desktopAlt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>

          {/* Content Overlay */}
          <div
            data-testid="sale-page-banner-content-overlay"
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            {/* Offer Section */}
            <div data-testid="sale-page-banner-offer-section">
              <h1
                data-testid="sale-page-banner-offer-title"
                className="text-white text-[32px] xl:text-[40px] leading-none font-bold"
              >
                {offerTitle}
              </h1>
              {offerPrice !== undefined && offerPrice !== "" && (
                <div
                  data-testid="sale-page-banner-offer-price"
                  className="text-[#EA499A] text-[56px] xl:text-[72px] leading-none font-bold"
                >
                  {currencySymbol}
                  {offerPrice}
                </div>
              )}
              {couponCode && (
                <div
                  data-testid="sale-page-banner-coupon-container"
                  className="relative my-5 min-w-[284px] w-full text-center"
                >
                  <div
                    data-testid="sale-page-banner-coupon-top-border"
                    className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  />
                  <div
                    data-testid="sale-page-banner-coupon-content"
                    className="text-white text-base xl:text-2xl leading-none py-2 xl:py-6"
                  >
                    Use code:{" "}
                    <span
                      data-testid="sale-page-banner-coupon-code"
                      className="font-bold"
                    >
                      {couponCode}
                    </span>
                  </div>
                  <div
                    data-testid="sale-page-banner-coupon-bottom-border"
                    className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  />
                </div>
              )}
              {expiryText && (
                <div
                  data-testid="sale-page-banner-expiry-text"
                  className="text-white text-xs xl:text-base leading-none"
                >
                  {expiryText}
                </div>
              )}
            </div>

            {/* Timer Section */}
            {endDateString && (
              <div
                data-testid="sale-page-banner-timer-section"
                className="mt-2.5"
              >
                <Timer
                  endDateString={endDateString}
                  interval={timerInterval}
                  className="justify-center"
                />
              </div>
            )}

            {/* How to Shop CTA */}
            {bannerCtaLabel && (
              <button
                type="button"
                data-testid="sale-page-banner-cta-button"
                onClick={handleModalOpen}
                className="text-white text-xs xl:text-xl font-medium mt-6"
                aria-label="Open how to shop instructions"
              >
                {bannerCtaLabel} ›
              </button>
            )}
          </div>
        </div>
      </div>

      {howToShopTitle && howToShopSteps && (
        <HowToShopModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={howToShopTitle}
          steps={howToShopSteps}
          termsAndConditions={{
            title: termsAndConditionsTitle || "Terms and conditions",
            points: termsAndConditionsPoints || "",
          }}
          primaryButtonText={primaryButtonLabel || "Got it"}
        />
      )}
    </>
  );
});

export default V1;
