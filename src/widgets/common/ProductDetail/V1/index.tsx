"use client";

import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  ProductDetailProps,
  ProductImage,
  ProductVariant,
  ProductBenefit,
  ProductMetadataKey,
  ApiProduct,
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
/*  API Data Transformers                                              */
/* ------------------------------------------------------------------ */

function transformApiImages(product: ApiProduct): ProductImage[] {
  return product.images.map((img) => ({
    src: img.url,
    alt: img.alt_text || product.title,
  }));
}

function transformApiBenefits(product: ApiProduct): ProductBenefit[] {
  const whatItDoes = product.metadata?.[ProductMetadataKey.WHAT_IT_DOES]?.value;
  if (Array.isArray(whatItDoes) && whatItDoes.length > 0) {
    return whatItDoes.map((text) => ({ text: String(text) }));
  }
  return [];
}

function formatPrice(paisa: number): string {
  return `\u20B9${Math.round(paisa / 100)}`;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ZoomIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
    <path
      d="M21 21l-4.35-4.35"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M11 8v6M8 11h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/** Fullscreen Image Overlay — rendered via portal to document.body */
function FullscreenOverlay({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onGoTo,
}: {
  images: ProductImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (idx: number) => void;
}) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onPrev, onNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) onNext();
      else onPrev();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="bg-[#ffffff]"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
      }}
    >
      {/* Image area — fills entire viewport */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Counter overlay — top left */}
        <div className="absolute top-[12px] left-[16px] z-[20]">
          <span
            className="text-[14px] font-[500] text-[#666666]"
            style={{ fontFamily: "Gotham, sans-serif" }}
          >
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* Close button — top right */}
        <button
          onClick={onClose}
          className="absolute top-[12px] right-[16px] z-[20] flex items-center justify-center w-[40px] h-[40px] text-[#000000] hover:bg-[#f0f0f0] rounded-[4px] transition-colors"
          aria-label="Close fullscreen"
        >
          <CloseIcon />
        </button>

        {/* Prev arrow */}
        {currentIndex > 0 && (
          <button
            onClick={onPrev}
            className="absolute left-[16px] top-1/2 -translate-y-1/2 z-[10] flex items-center justify-center w-[48px] h-[48px] bg-[#ffffff] shadow-[0_2px_8px_rgba(0,0,0,0.15)] rounded-[9999px] hover:bg-[#f5f5f5] transition-colors"
            aria-label="Previous image"
          >
            <ArrowLeftIcon />
          </button>
        )}

        {/* Image — full height */}
        <div className="relative w-full h-full">
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Next arrow */}
        {currentIndex < images.length - 1 && (
          <button
            onClick={onNext}
            className="absolute right-[16px] top-1/2 -translate-y-1/2 z-[10] flex items-center justify-center w-[48px] h-[48px] bg-[#ffffff] shadow-[0_2px_8px_rgba(0,0,0,0.15)] rounded-[9999px] hover:bg-[#f5f5f5] transition-colors"
            aria-label="Next image"
          >
            <ArrowRightIcon />
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}

/** Zoom preview panel — uses fixed positioning to overlay on the right side */
function ZoomPanel({
  image,
  mousePos,
  imageRef,
}: {
  image: ProductImage;
  mousePos: { x: number; y: number };
  imageRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0, size: 0 });

  useEffect(() => {
    const updatePos = () => {
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const panelSize = rect.height * 0.85;
      setPanelPos({
        top: rect.top,
        left: rect.right + 16,
        size: panelSize,
      });
    };
    updatePos();
    window.addEventListener("scroll", updatePos, { passive: true });
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos);
      window.removeEventListener("resize", updatePos);
    };
  }, [imageRef]);

  if (panelPos.size === 0) return null;

  return createPortal(
    <div
      className="hidden lg:block overflow-hidden pointer-events-none"
      style={{
        position: "fixed",
        top: panelPos.top,
        left: panelPos.left,
        width: panelPos.size,
        height: panelPos.size,
        zIndex: 9999,
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        backgroundColor: "#ffffff",
      }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="50vw"
        className="object-cover"
        style={{
          transform: "scale(2.5)",
          transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
        }}
      />
    </div>,
    document.body
  );
}

/** Image Gallery with hover zoom panel on right, fullscreen overlay, and mobile slider */
function ImageGallery({
  images,
  badgeText,
}: {
  images: ProductImage[];
  badgeText?: string;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [mobileFullscreenIdx, setMobileFullscreenIdx] = useState(0);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

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

  const openFullscreen = useCallback(
    (idx?: number) => {
      if (typeof idx === "number") setMobileFullscreenIdx(idx);
      else setMobileFullscreenIdx(currentSlide);
      setIsFullscreen(true);
    },
    [currentSlide]
  );

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  // Desktop hover zoom handlers
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  }, []);

  const currentImage = images[currentSlide];

  return (
    <>
      <div className="relative">
        {/* ===== MOBILE: Native horizontal scroll slider ===== */}
        <div className="lg:hidden relative">
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

          {/* Horizontal scroll container — 85% width images so next one peeks */}
          <div
            ref={mobileScrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {images.map((image, idx) => (
              <div
                key={idx}
                className="shrink-0 snap-start cursor-pointer"
                style={{ width: "85%", aspectRatio: "1 / 1" }}
                onClick={() => openFullscreen(idx)}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="85vw"
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== DESKTOP: Slider with arrows + hover zoom ===== */}
        <div className="hidden lg:block relative">
          <div className="relative overflow-hidden">
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
                    style={{
                      fontFamily: "Gotham, sans-serif",
                      fontSize: "12px",
                    }}
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
                  <div
                    ref={idx === currentSlide ? mainImageRef : undefined}
                    className="relative w-full cursor-crosshair"
                    style={{ aspectRatio: "1 / 1" }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                    onClick={() => openFullscreen()}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="50vw"
                      className="object-cover"
                      priority={idx === 0}
                    />
                    {/* Zoom lens indicator */}
                    {isHovering && idx === currentSlide && (
                      <div
                        className="absolute pointer-events-none border-[2px] border-[rgba(0,0,0,0.3)] bg-[rgba(255,255,255,0.2)]"
                        style={{
                          width: "40%",
                          height: "40%",
                          left: `${Math.max(0, Math.min(60, mousePos.x - 20))}%`,
                          top: `${Math.max(0, Math.min(60, mousePos.y - 20))}%`,
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {currentSlide > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-[16px] top-1/2 -translate-y-1/2 z-[5] flex items-center justify-center w-[44px] h-[44px] bg-[#ffffff] bg-opacity-80 rounded-[9999px] hover:bg-opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ArrowLeftIcon />
              </button>
            )}

            {currentSlide < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-[16px] top-1/2 -translate-y-1/2 z-[5] flex items-center justify-center w-[44px] h-[44px] bg-[#ffffff] bg-opacity-80 rounded-[9999px] hover:bg-opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ArrowRightIcon />
              </button>
            )}
          </div>

          {/* Zoomed preview panel — 85% of image size, right side */}
          {isHovering && currentImage && mainImageRef.current && (
            <ZoomPanel
              image={currentImage}
              mousePos={mousePos}
              imageRef={mainImageRef}
            />
          )}

          {/* Thumbnail Strip */}
          <div className="mt-[10px]">
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
        </div>
      </div>

      {/* Fullscreen Overlay — portalled to body */}
      {isFullscreen && (
        <FullscreenOverlay
          images={images}
          currentIndex={mobileFullscreenIdx}
          onClose={closeFullscreen}
          onPrev={() => setMobileFullscreenIdx((i) => Math.max(0, i - 1))}
          onNext={() =>
            setMobileFullscreenIdx((i) => Math.min(images.length - 1, i + 1))
          }
          onGoTo={setMobileFullscreenIdx}
        />
      )}
    </>
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
  const ratingNum = parseFloat(rating) || 0;
  return (
    <div className="flex items-center gap-[4px]">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon key={star} filled={star <= Math.round(ratingNum)} />
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
  originalPrice,
  taxInfo,
}: {
  priceLabel: string;
  price: string;
  originalPrice?: string;
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
        {originalPrice && (
          <span
            className="text-[16px] leading-[26px] font-[400] text-[#999999] line-through ml-[8px]"
            style={{ fontFamily: "Gotham, sans-serif" }}
          >
            {originalPrice}
          </span>
        )}
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

/** Trust badges row */
function TrustBadges({ badges }: { badges: string[] }) {
  if (!badges.length) return null;
  return (
    <div className="flex items-center gap-[12px] mt-[16px]">
      {badges.map((url, idx) => (
        <Image
          key={idx}
          src={url}
          alt="Trust badge"
          width={60}
          height={60}
          className="object-contain"
        />
      ))}
    </div>
  );
}

/** Add to Cart button */
function AddToCartButton({ text }: { text: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);
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
  data,
  settings,
  className,
}: ProductDetailProps) {
  // Extract API product data
  const product = data?.success ? data.data : null;

  // Hide widget when no product data available
  if (!product && !settings?.title) {
    return null;
  }

  // Transform API data or fall back to settings
  const title = product?.title ?? settings?.title ?? "";

  const rating = product?.metadata?.[ProductMetadataKey.RATING]
    ? String(product.metadata[ProductMetadataKey.RATING]!.value)
    : (settings?.rating ?? "");

  const reviewCount = product?.metadata?.[ProductMetadataKey.RATING_COUNT]
    ? String(product.metadata[ProductMetadataKey.RATING_COUNT]!.value)
    : (settings?.reviewCount ?? "");

  const benefits = product
    ? transformApiBenefits(product)
    : (settings?.benefits ?? []);

  const netContentLabel = settings?.netContentLabel ?? "Net content:";
  const netContent = product?.metadata?.[ProductMetadataKey.PRODUCT_NET_CONTENT]
    ? String(product.metadata[ProductMetadataKey.PRODUCT_NET_CONTENT]!.value)
    : (settings?.netContent ?? "");

  const priceLabel = settings?.priceLabel ?? "M.R.P.";

  const price = product ? formatPrice(product.price) : (settings?.price ?? "");

  const originalPrice = product?.compare_at_price
    ? formatPrice(product.compare_at_price)
    : product?.metadata?.[ProductMetadataKey.OLD_PRICE]
      ? `\u20B9${product.metadata[ProductMetadataKey.OLD_PRICE]!.value}`
      : settings?.originalPrice;

  const taxInfo = settings?.taxInfo ?? "Incl. of all taxes";
  const variantLabel = settings?.variantLabel ?? "Select variant";

  const variants: ProductVariant[] = settings?.variants ?? [];

  const addToCartText = settings?.addToCartText ?? "Add to cart";

  const images: ProductImage[] = product
    ? transformApiImages(product)
    : (settings?.images ?? []);

  const badgeText = product?.metadata?.[ProductMetadataKey.PRODUCT_LABELS]
    ? String(product.metadata[ProductMetadataKey.PRODUCT_LABELS]!.value)
    : settings?.badgeText;

  const trustBadges: string[] = product?.metadata?.[
    ProductMetadataKey.TRUST_BADGES
  ]?.value
    ? (product.metadata[ProductMetadataKey.TRUST_BADGES]!.value as string[])
    : [];

  return (
    <section
      className={`w-full bg-[#ffffff] ${className ?? ""}`}
      style={{ fontFamily: "Gotham, sans-serif" }}
    >
      {/* Outer wrapper */}
      <div className="pt-0 pb-0 lg:pt-[56px] lg:pb-[32px]">
        <div className="px-0 lg:px-[50px]">
          {/* === MOBILE: Info first, then gallery === */}
          <div className="block lg:hidden">
            <div className="px-[16px] pt-[16px] pb-[4px]">
              <div className="mb-[12px]">
                <h1
                  className="text-[14px] leading-[17px] font-[500] text-[#000000]"
                  style={{ fontFamily: "Gotham, sans-serif" }}
                >
                  {title}
                </h1>
              </div>

              <div className="mb-[12px]">
                <RatingBadge rating={rating} reviewCount={reviewCount} />
              </div>

              {benefits.length > 0 && (
                <div className="mb-[24px]">
                  <BenefitsList benefits={benefits} />
                </div>
              )}
            </div>

            <div>
              <ImageGallery images={images} badgeText={badgeText} />
            </div>

            <div className="px-[16px] pt-[16px] pb-[16px]">
              {trustBadges.length > 0 && <TrustBadges badges={trustBadges} />}

              <div className="mb-[16px] mt-[16px]">
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

              <div className="mb-[24px]">
                <PriceDisplay
                  priceLabel={priceLabel}
                  price={price}
                  originalPrice={originalPrice}
                  taxInfo={taxInfo}
                />
              </div>

              {variants.length > 0 && (
                <div className="mb-[24px]">
                  <VariantSelector label={variantLabel} variants={variants} />
                </div>
              )}

              <AddToCartButton text={addToCartText} />
            </div>
          </div>

          {/* === DESKTOP: Two-column flex layout === */}
          <div className="hidden lg:flex gap-[16px]">
            <div className="w-1/2 shrink-0">
              <div className="sticky top-[30px]">
                <ImageGallery images={images} badgeText={badgeText} />
              </div>
            </div>

            <div className="w-1/2">
              <div className="sticky top-[30px] pl-[13px]">
                <div className="mb-[20px]">
                  <h1
                    className="text-[24px] leading-[29px] font-[700] text-[#000000]"
                    style={{ fontFamily: "Gotham, sans-serif" }}
                  >
                    {title}
                  </h1>
                </div>

                <div className="mb-[24px]">
                  <RatingBadge rating={rating} reviewCount={reviewCount} />
                </div>

                {benefits.length > 0 && (
                  <div className="mb-[24px]">
                    <BenefitsList benefits={benefits} />
                  </div>
                )}

                {trustBadges.length > 0 && (
                  <div className="mb-[24px]">
                    <TrustBadges badges={trustBadges} />
                  </div>
                )}

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

                <div className="mb-[24px]">
                  <PriceDisplay
                    priceLabel={priceLabel}
                    price={price}
                    originalPrice={originalPrice}
                    taxInfo={taxInfo}
                  />
                </div>

                {variants.length > 0 && (
                  <div className="mb-[24px]">
                    <VariantSelector label={variantLabel} variants={variants} />
                  </div>
                )}

                <AddToCartButton text={addToCartText} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
