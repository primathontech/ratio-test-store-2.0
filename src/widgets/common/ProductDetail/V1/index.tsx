"use client";

import React, { memo, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ProductDetailProps,
  ProductImage,
  ProductVariant,
  ProductBenefit,
} from "../types";

/* ------------------------------------------------------------------ */
/*  Inline SVG Icons                                                   */
/* ------------------------------------------------------------------ */

const CheckmarkIcon = () => (
  <svg
    width="12"
    height="11"
    viewBox="0 0 12 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M1 5.87842C1.94144 6.5631 3.82432 8.44599 4.59459 9.72977C5.53604 7.67572 7.93243 3.05409 10.5 1.00004"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    width="12"
    height="22"
    viewBox="0 0 12 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 21L1 11L11 0.999999"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="12"
    height="22"
    viewBox="0 0 12 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L11 11L1 21"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill={filled ? "#000000" : "none"}
    stroke="#000000"
    strokeWidth="2"
    className="inline-block"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Default Data                                                       */
/* ------------------------------------------------------------------ */

const DEFAULT_IMAGES: ProductImage[] = [
  {
    src: "https://bblunt.com/cdn/shop/files/FOP_1_b2475ca2-4e11-4e3c-a738-71b656362fd8.jpg?v=1757585507&width=1200",
    alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
  },
  {
    src: "https://bblunt.com/cdn/shop/files/3FOPwithKMMarketplace_466fe4a5-d079-40d4-bf88-b25f20033eb4.jpg?v=1757585507&width=1200",
    alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
  },
  {
    src: "https://bblunt.com/cdn/shop/files/3FOPwithKM_6c48b7bc-e8a6-4093-be58-c8b89cfcb143.jpg?v=1757585507&width=1200",
    alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
  },
  {
    src: "https://bblunt.com/cdn/shop/files/4Model_04866ef5-9047-42c3-9c44-d92c8ba40fd9.jpg?v=1769693591&width=1200",
    alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
  },
  {
    src: "https://bblunt.com/cdn/shop/files/5New_Oldcopy_895c387e-8db2-4977-b506-f149d8832a33.jpg?v=1769693591&width=1200",
    alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
  },
  {
    src: "https://bblunt.com/cdn/shop/files/6ColourPayoff_1d918634-eed7-40ab-8161-b8d66e5f8e97.jpg?v=1769693591&width=1200",
    alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
  },
  {
    src: "https://bblunt.com/cdn/shop/files/7KMs_a233ac7a-2d04-4ecc-a7be-9f3e2056b581.jpg?v=1769693591&width=1200",
    alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
  },
  {
    src: "https://bblunt.com/cdn/shop/files/8PowerIngredients_cf1b49b6-52ed-43dd-8a87-a45e46c0797f.jpg?v=1769693591&width=1200",
    alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
  },
  {
    src: "https://bblunt.com/cdn/shop/files/9HowtoUse_b65ab8f5-9ebd-4b25-acb9-d9678f1286d1.jpg?v=1769693591&width=1200",
    alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
  },
  {
    src: "https://bblunt.com/cdn/shop/files/10Insidethebox_4b8b2ad0-1d95-4a90-ae24-557ff9599c4e.jpg?v=1769693591&width=1200",
    alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
  },
  {
    src: "https://bblunt.com/cdn/shop/files/11Shades_fa1130d0-f9e3-4b34-b35c-a7a77aa205b1.jpg?v=1769693591&width=1200",
    alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
  },
  {
    src: "https://bblunt.com/cdn/shop/files/12Promises_4e448f05-149d-44ba-b962-3e7c0cd7dc70.jpg?v=1769693591&width=1200",
    alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
  },
  {
    src: "https://bblunt.com/cdn/shop/files/BOP_2.jpg?v=1769693591&width=1200",
    alt: "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)",
  },
];

const DEFAULT_VARIANTS: ProductVariant[] = [
  {
    name: "Cherry Red(Shade 6.62)",
    price: "\u20B9399",
    unitPrice: "(\u20B93.07 / g)",
    href: "/products/high-shine-conditioning-hair-colour-cherry-red-shade-6-62",
    swatchImage:
      "https://bblunt.com/cdn/shop/files/Salon_cherry_red.jpg?v=1734587875&width=400",
  },
  {
    name: "Natural Black (Shade 1)",
    price: "\u20B9399",
    unitPrice: "(\u20B93.07 / g)",
    href: "/products/high-shine-conditioning-hair-colour-natural-black-shade-1",
    swatchImage:
      "https://bblunt.com/cdn/shop/files/Natural_black_salon.jpg?v=1734587911&width=400",
  },
  {
    name: "Chocolate Dark Brown (Shade 3)",
    price: "\u20B9399",
    unitPrice: "(\u20B93.07 / g)",
    href: "/products/high-shine-conditioning-hair-colour-chocolate-dark-brown-shade-3",
    swatchImage:
      "https://bblunt.com/cdn/shop/files/Choclate_dark_brown_salon.jpg?v=1734587934&width=400",
  },
  {
    name: "Coffee Natural Brown (Shade 4.31)",
    price: "\u20B9399",
    unitPrice: "(\u20B93.07 / g)",
    href: "/products/high-shine-conditioning-hair-colour-coffee-natural-brown-shade-4-31",
    swatchImage:
      "https://bblunt.com/cdn/shop/files/temp-file-1770731144551-0.png?v=1770731531&width=400",
  },
  {
    name: "Mahogany Reddish Brown (Shade 4.56)",
    price: "\u20B9399",
    unitPrice: "(\u20B93.07 / g)",
    href: "/products/high-shine-conditioning-hair-colour-mahogany-reddish-brown-shade-4-56",
    swatchImage:
      "https://bblunt.com/cdn/shop/files/FOP_1_b2475ca2-4e11-4e3c-a738-71b656362fd8.jpg?v=1757585507&width=400",
    isActive: true,
  },
  {
    name: "Honey Light Golden Brown (Shade 5.32)",
    price: "\u20B9399",
    unitPrice: "(\u20B93.07 / g)",
    href: "/products/high-shine-conditioning-hair-colour-honey-light-golden-brown-shade-5-32",
    swatchImage:
      "https://bblunt.com/cdn/shop/files/Honey_light_golden_brown_salon.jpg?v=1734587978&width=400",
  },
];

const DEFAULT_BENEFITS: ProductBenefit[] = [
  { text: "MaliPeptide BondTech\u2122 & Shine Tonic" },
  { text: "No Ammonia, 100% Grey Coverage" },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Image Gallery with slider and thumbnail strip */
function ImageGallery({
  images,
  badgeText,
}: {
  images: ProductImage[];
  badgeText?: string;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, images.length - 1));
      setCurrentSlide(clamped);
    },
    [images.length]
  );

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative overflow-hidden" ref={sliderRef}>
        {/* Badge overlay */}
        {badgeText && (
          <div className="absolute top-[26px] left-0 z-[4]">
            <div
              className="flex items-center px-[15px] py-[6px]"
              style={{
                backgroundColor: "#e8083e",
                borderRadius: "0 4px 4px 0",
              }}
            >
              <span
                className="text-[#ffffff] font-[700] leading-[17px]"
                style={{ fontFamily: "Gotham, sans-serif", fontSize: "12px" }}
              >
                {badgeText}
              </span>
            </div>
          </div>
        )}

        {/* Slides */}
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((image, idx) => (
            <div
              key={idx}
              className="w-full shrink-0"
              style={{ minWidth: "100%" }}
            >
              <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 642px"
                  className="object-cover"
                  priority={idx === 0}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {currentSlide > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-[16px] top-1/2 -translate-y-1/2 z-[5] flex items-center justify-center w-[44px] h-[44px] bg-[#ffffff] bg-opacity-80 rounded-[9999px] hover:bg-opacity-100 transition-opacity"
            aria-label="Previous image"
          >
            <ArrowLeftIcon />
          </button>
        )}

        {currentSlide < images.length - 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-[16px] top-1/2 -translate-y-1/2 z-[5] flex items-center justify-center w-[44px] h-[44px] bg-[#ffffff] bg-opacity-80 rounded-[9999px] hover:bg-opacity-100 transition-opacity"
            aria-label="Next image"
          >
            <ArrowRightIcon />
          </button>
        )}
      </div>

      {/* Thumbnail Strip (desktop only) */}
      <div className="hidden lg:block mt-[10px]">
        <div className="flex gap-[10px] overflow-x-auto hide-scrollbar">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`shrink-0 w-[99px] h-[99px] rounded-[3px] overflow-hidden border-[2px] transition-all ${
                currentSlide === idx
                  ? "border-[#000000] opacity-100"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={image.src}
                alt=""
                width={99}
                height={99}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Dot indicators (mobile/tablet) */}
      <div className="flex lg:hidden justify-center gap-[6px] mt-[12px]">
        {images.slice(0, 8).map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-[8px] h-[8px] rounded-[9999px] transition-all ${
              currentSlide === idx ? "bg-[#000000]" : "bg-[#d1d5db]"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
        {images.length > 8 && (
          <span
            className="text-[12px] text-[#666666] leading-[8px]"
            style={{ fontFamily: "Gotham, sans-serif" }}
          >
            +{images.length - 8}
          </span>
        )}
      </div>
    </div>
  );
}

/** Rating display with stars */
function RatingBadge({
  rating,
  reviewCount,
}: {
  rating: string;
  reviewCount: string;
}) {
  return (
    <div className="flex items-center gap-[4px]">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon key={star} filled={true} />
        ))}
      </div>
      <span
        className="text-[16px] leading-[22px] font-[500] text-[#000000] lg:text-[16px]"
        style={{ fontFamily: "Gotham, sans-serif" }}
      >
        {rating} &#x2503;
      </span>
      <span
        className="text-[12px] leading-[17px] font-[500] text-[#000000] lg:text-[16px] lg:leading-[22px]"
        style={{ fontFamily: "Gotham, sans-serif" }}
      >
        {reviewCount}
      </span>
    </div>
  );
}

/** Benefits list with checkmark icons */
function BenefitsList({ benefits }: { benefits: ProductBenefit[] }) {
  return (
    <ul className="flex flex-col gap-[10px] mt-[12px] lg:flex-col lg:gap-[16px]">
      {benefits.map((benefit, idx) => (
        <li
          key={idx}
          className="flex items-center gap-[8px] px-[8px] py-0 lg:px-[13px] lg:py-[3px] bg-[#f4f6f8] rounded-[4px] w-fit"
        >
          <CheckmarkIcon />
          <span
            className="text-[12px] leading-[19px] font-[500] text-[#000000] lg:text-[16px] lg:leading-[26px]"
            style={{ fontFamily: "Gotham, sans-serif" }}
          >
            {benefit.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Price display */
function PriceDisplay({
  priceLabel,
  price,
  taxInfo,
}: {
  priceLabel: string;
  price: string;
  taxInfo: string;
}) {
  return (
    <div className="flex items-end gap-[10px]">
      <div>
        <span
          className="block text-[14px] leading-[14px] font-[400] text-[#000000]"
          style={{ fontFamily: "Gotham, sans-serif" }}
        >
          {priceLabel}
        </span>
        <span
          className="text-[22px] leading-[26px] font-[700] text-[#000000] lg:text-[26px] lg:leading-[26px]"
          style={{ fontFamily: "Gotham, sans-serif" }}
        >
          {price}
        </span>
      </div>
      <span
        className="text-[12px] leading-[19px] font-[400] text-[#000000] pb-[2px]"
        style={{ fontFamily: "Gotham, sans-serif" }}
      >
        {taxInfo}
      </span>
    </div>
  );
}

/** Variant selector with swatch cards */
function VariantSelector({
  label,
  variants,
}: {
  label: string;
  variants: ProductVariant[];
}) {
  return (
    <div>
      <div className="mb-[5px]">
        <span
          className="text-[14px] leading-[22px] font-[400] text-[#000000]"
          style={{ fontFamily: "Gotham, sans-serif" }}
        >
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-[16px]">
        {variants.map((variant, idx) => (
          <Link
            key={idx}
            href={variant.href}
            className={`flex rounded-[4px] border-[1px] overflow-hidden transition-all w-full lg:w-[235px] ${
              variant.isActive
                ? "border-[#000000] outline outline-[2px] outline-[#000000]"
                : "border-[#e5e7eb] hover:border-[#000000] hover:outline hover:outline-[2px] hover:outline-[#000000]"
            }`}
          >
            <div className="w-[75px] h-[91px] shrink-0">
              <Image
                src={variant.swatchImage}
                alt={variant.name}
                width={75}
                height={91}
                className="object-cover w-full h-full rounded-[3px]"
              />
            </div>
            <div className="flex flex-col justify-center px-[8px] py-[5px] min-w-0">
              <div
                className="text-[12px] leading-[16px] font-[500] text-[#000000] line-clamp-2 lg:text-[14px] lg:leading-[19px]"
                style={{ fontFamily: "Gotham, sans-serif" }}
              >
                {variant.name}
              </div>
              <div className="mt-[4px]">
                <span
                  className="text-[16px] leading-[26px] font-[700] text-[#000000] lg:text-[18px]"
                  style={{ fontFamily: "Gotham, sans-serif" }}
                >
                  {variant.price}
                </span>
              </div>
              {variant.unitPrice && (
                <div
                  className="text-[10px] leading-[15px] font-[600] text-[#000000] lg:text-[12px]"
                  style={{ fontFamily: "Gotham, sans-serif" }}
                >
                  {variant.unitPrice}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Add to Cart button */
function AddToCartButton({ text }: { text: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);
    // Simulated add-to-cart action
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="w-full h-[49px] flex items-center justify-center bg-[#000000] text-[#ffffff] rounded-[4px] transition-all duration-[250ms] ease-in-out hover:bg-[#333333] disabled:opacity-70"
      style={{ fontFamily: "Gotham, sans-serif" }}
    >
      {isLoading ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 66 66"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-spin"
        >
          <circle
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            cx="33"
            cy="33"
            r="30"
            strokeDasharray="164"
            strokeDashoffset="82"
          />
        </svg>
      ) : (
        <span className="text-[18px] leading-[26px] font-[700] lg:text-[22px]">
          {text}
        </span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main V1 Component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({
  settings,
  className,
}: ProductDetailProps) {
  const title =
    settings?.title ??
    "High Shine Conditioning Hair Colour - Mahogany Reddish Brown (Shade 4.56)";
  const rating = settings?.rating ?? "5.0";
  const reviewCount = settings?.reviewCount ?? "11";
  const benefits = settings?.benefits ?? DEFAULT_BENEFITS;
  const netContentLabel = settings?.netContentLabel ?? "Net content:";
  const netContent = settings?.netContent ?? "130g  (USP: \u20B93.07/g)";
  const priceLabel = settings?.priceLabel ?? "M.R.P.";
  const price = settings?.price ?? "\u20B9399";
  const taxInfo = settings?.taxInfo ?? "Incl. of all taxes";
  const variantLabel = settings?.variantLabel ?? "Select variant";
  const variants = settings?.variants ?? DEFAULT_VARIANTS;
  const addToCartText = settings?.addToCartText ?? "Add to cart";
  const images = settings?.images ?? DEFAULT_IMAGES;
  const badgeText = settings?.badgeText ?? "Get3@\u20B9799";

  return (
    <section
      className={`w-full bg-[#ffffff] ${className ?? ""}`}
      style={{ fontFamily: "Gotham, sans-serif" }}
    >
      {/* Outer wrapper — matches section padding: pt-56 pb-32 desktop, pt-0 mobile */}
      <div className="pt-0 pb-0 lg:pt-[56px] lg:pb-[32px]">
        {/* Container with horizontal padding */}
        <div className="px-0 lg:px-[50px]">
          {/* === MOBILE: Info first, then gallery === */}
          <div className="block lg:hidden">
            {/* Mobile Product Info (top portion) */}
            <div className="px-[16px] pt-[16px] pb-[4px]">
              {/* Title */}
              <div className="mb-[12px]">
                <h1
                  className="text-[14px] leading-[17px] font-[500] text-[#000000]"
                  style={{ fontFamily: "Gotham, sans-serif" }}
                >
                  {title}
                </h1>
              </div>

              {/* Rating */}
              <div className="mb-[12px]">
                <RatingBadge rating={rating} reviewCount={reviewCount} />
              </div>

              {/* Benefits */}
              <div className="mb-[24px]">
                <BenefitsList benefits={benefits} />
              </div>
            </div>

            {/* Mobile Image Gallery (full width) */}
            <div>
              <ImageGallery images={images} badgeText={badgeText} />
            </div>

            {/* Mobile Product Info (bottom portion) */}
            <div className="px-[16px] pt-[16px] pb-[16px]">
              {/* Net content */}
              <div className="mb-[16px]">
                <span
                  className="text-[14px] leading-[14px] font-[400] text-[#000000]"
                  style={{ fontFamily: "Gotham, sans-serif" }}
                >
                  {netContentLabel}{" "}
                </span>
                <span
                  className="text-[14px] leading-[14px] font-[700] text-[#000000]"
                  style={{ fontFamily: "Gotham, sans-serif" }}
                >
                  {netContent}
                </span>
              </div>

              {/* Price */}
              <div className="mb-[24px]">
                <PriceDisplay
                  priceLabel={priceLabel}
                  price={price}
                  taxInfo={taxInfo}
                />
              </div>

              {/* Variant Selector */}
              <div className="mb-[24px]">
                <VariantSelector label={variantLabel} variants={variants} />
              </div>

              {/* Add to Cart */}
              <AddToCartButton text={addToCartText} />
            </div>
          </div>

          {/* === DESKTOP: Two-column flex layout === */}
          <div className="hidden lg:flex gap-[16px]">
            {/* Left Column — Image Gallery (sticky) */}
            <div className="w-1/2 shrink-0">
              <div className="sticky top-[30px]">
                <ImageGallery images={images} badgeText={badgeText} />
              </div>
            </div>

            {/* Right Column — Product Info (sticky) */}
            <div className="w-1/2">
              <div className="sticky top-[30px] pl-[13px]">
                {/* Title */}
                <div className="mb-[20px]">
                  <h1
                    className="text-[24px] leading-[29px] font-[700] text-[#000000]"
                    style={{ fontFamily: "Gotham, sans-serif" }}
                  >
                    {title}
                  </h1>
                </div>

                {/* Rating */}
                <div className="mb-[24px]">
                  <RatingBadge rating={rating} reviewCount={reviewCount} />
                </div>

                {/* Benefits */}
                <div className="mb-[24px]">
                  <BenefitsList benefits={benefits} />
                </div>

                {/* Net content */}
                <div className="pb-[16px] mb-[24px]">
                  <span
                    className="text-[14px] leading-[14px] font-[400] text-[#000000]"
                    style={{ fontFamily: "Gotham, sans-serif" }}
                  >
                    {netContentLabel}{" "}
                  </span>
                  <span
                    className="text-[14px] leading-[14px] font-[700] text-[#000000]"
                    style={{ fontFamily: "Gotham, sans-serif" }}
                  >
                    {netContent}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-[24px]">
                  <PriceDisplay
                    priceLabel={priceLabel}
                    price={price}
                    taxInfo={taxInfo}
                  />
                </div>

                {/* Variant Selector */}
                <div className="mb-[24px]">
                  <VariantSelector label={variantLabel} variants={variants} />
                </div>

                {/* Add to Cart */}
                <AddToCartButton text={addToCartText} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
