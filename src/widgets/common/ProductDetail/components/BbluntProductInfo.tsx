"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCartStore, type CartItem } from "@shopkit/cart";

import { useResponsive } from "@/hooks/useResponsive";
import { generateProductNavigationURL } from "@/utils/navigation";

import { ApiProduct, ProductMetadataKey } from "../types";
import { ProductMarquee } from "./ProductMarquee";
import {
  VariantPicker,
  NewVariantPickerData,
  NewVariantNode,
} from "./VariantPicker";
import { Spinner } from "@/ui/atomic";
import {
  calculateDiscountPercentage,
  ensureArray,
  getUnitPrice,
  getUnitValue,
  pickFirstString,
} from "../utils/productInfoHelpers";

export interface BbluntProductInfoProps {
  data: ApiProduct;
  /** Optional precomputed reviews — if omitted, derived from product metadata. */
  reviews?: { total: number | null; average: number | null };
  /** Slot-rendered above the price block on mobile (the gallery). */
  renderGallery?: React.ReactNode;

  // Content / translation strings — all default to bblunt-tuned copy.
  addToCartText?: string;
  netContentText?: string;
  inclusiveOfAllTaxesText?: string;
  reviewsText?: string;
  mrp?: string;
  discount?: string;
  usp?: string;
  rupeeSymbol?: string;
  selectSizeText?: string;
  soldOutText?: string;

  // Coupon marquee
  showProductMarquee?: boolean;
  productMarqueeText?: string;
  productMarqueeCouponCode?: string;
  productMarqueeSpeed?: string;
  productMarqueeHref?: string;
}

const PRODUCT_INFO_METAFIELD_KEYS = {
  PRODUCT_TAGS_MERA: ProductMetadataKey.WHAT_IT_DOES,
  PRODUCT_VARIANTS: "variants",
} as const;

/**
 * Build the cart item shape expected by `@shopkit/cart`'s `addItem`.
 * Mirrors the helper `HairCareBFFs` / `FeaturedCollectionGrid` already use.
 */
function buildCartItem(product: ApiProduct, variantId?: string): CartItem {
  const lineId = variantId ?? product.id;
  return {
    id: lineId,
    productId: product.id,
    variantId,
    sku: product.variants?.[0]?.sku,
    title: product.title,
    price: { amount: product.price ?? 0, currencyCode: "INR" },
    compareAtPrice:
      typeof product.compare_at_price === "number"
        ? { amount: product.compare_at_price, currencyCode: "INR" }
        : undefined,
    quantity: 1,
    image: product.image?.url,
    product_type: product.product_type,
  };
}

/**
 * Right-column product info: title, rating-with-scroll, tag chips, net
 * content, price block (mobile/desktop layouts with discount %), coupon
 * marquee, variant picker, and Add-to-Cart.
 *
 * Cart wiring uses `@shopkit/cart`'s `useCartStore` (project pattern from
 * `HairCareBFFs`); we call `openCart()` after `addItem()` instead of
 * showing a custom toast — the cart drawer is the visible feedback.
 *
 * The component dims itself when the gallery's lightbox opens, by reading
 * the `zoom-modal-open` body class via a `MutationObserver`.
 */
export function BbluntProductInfo({
  data,
  reviews: reviewsProp,
  renderGallery,
  addToCartText = "Add to cart",
  netContentText = "Net content",
  inclusiveOfAllTaxesText = "Incl. of all taxes",
  reviewsText = "reviews",
  mrp = "MRP:",
  discount = "% off",
  usp = "USP",
  rupeeSymbol = "₹",
  selectSizeText = "Select size",
  soldOutText = "Sold out",
  showProductMarquee,
  productMarqueeText,
  productMarqueeCouponCode,
  productMarqueeSpeed,
  productMarqueeHref,
}: BbluntProductInfoProps) {
  const [selectedVariantId] = useState<string | undefined>();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const showMobileLikeLayout = isMobile || isTablet;

  const router = useRouter();
  const pathname = usePathname();

  // Cart wiring — selectors only, so re-renders stay scoped to the slices we read.
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const loadingItems = useCartStore((s) => s.loadingItems);
  const cartToken = useCartStore((s) => s.cartToken);
  const isLoading = Boolean(
    loadingItems[data?.id] ||
    (selectedVariantId && loadingItems[selectedVariantId])
  );

  const handleAddToCart = async () => {
    try {
      await addItem(buildCartItem(data, selectedVariantId));
      await openCart();
    } catch (error) {
      console.error("[BbluntProductInfo] addItem failed:", error);
    }
  };

  // Dim the right column while the gallery's zoom modal is open in the editor.
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  useEffect(() => {
    const checkZoomState = () => {
      setIsZoomOpen(document.body.classList.contains("zoom-modal-open"));
    };
    checkZoomState();
    const observer = new MutationObserver(checkZoomState);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const isEditor = pathname?.includes("/editor") || false;

  // Derive review counts from metadata if the parent didn't pass `reviews`
  // (skips the extra `getProductAverageRating` API call from the reference).
  const reviews = reviewsProp ?? {
    average: data?.metadata?.[ProductMetadataKey.RATING]?.value
      ? Number(data.metadata[ProductMetadataKey.RATING]!.value)
      : null,
    total: data?.metadata?.[ProductMetadataKey.RATING_COUNT]?.value
      ? Number(data.metadata[ProductMetadataKey.RATING_COUNT]!.value)
      : null,
  };

  const productMetaTags = ensureArray<string>(
    data?.metadata?.[PRODUCT_INFO_METAFIELD_KEYS.PRODUCT_TAGS_MERA]?.value as
      | string
      | string[]
      | undefined
  );

  const productVariants = data?.metadata?.[
    PRODUCT_INFO_METAFIELD_KEYS.PRODUCT_VARIANTS
  ] as NewVariantPickerData | undefined;

  const rawNetContent =
    data?.metadata?.[ProductMetadataKey.PRODUCT_NET_CONTENT]?.value;
  const productNetContent = pickFirstString(rawNetContent) || null;

  const unitValue = getUnitValue(productNetContent);

  // Default-title variant carries the canonical price for products that
  // expose multiple variants only as colour/pack metadata.
  const defaultTitleVariant = data?.variants?.find(
    (variant) => variant?.title === "Default Title"
  );
  const priceInPaise = defaultTitleVariant?.price ?? data?.price ?? 0;
  const currentPrice = priceInPaise / 100;

  const unitPrice = productNetContent
    ? getUnitPrice(currentPrice, productNetContent)
    : null;

  const compareAtPrice = data?.compare_at_price
    ? data.compare_at_price / 100
    : undefined;

  // Variant click → navigate to the variant's product page. Preserve the
  // collection segment when the user is on a `/collections/X/products/Y` URL.
  const handleVariantSelect = (variant: NewVariantNode) => {
    const variantHandleEntry = variant?.fields?.variant?.value?.[0]?.handle;
    const variantHandle =
      typeof variantHandleEntry === "string"
        ? variantHandleEntry
        : variantHandleEntry?.handle;
    if (!variantHandle) {
      return;
    }
    const parts = pathname?.split("/") ?? [];
    const collectionsIndex = parts.indexOf("collections");
    const collectionHandle =
      collectionsIndex !== -1 ? parts[collectionsIndex + 1] : undefined;
    router.push(generateProductNavigationURL(variantHandle, collectionHandle));
  };

  const scrollToReviewsSection = () => {
    const selectors = [
      '[data-testid="review-section-container"]',
      '[id="review-section"]',
      '[data-testid="review-section"]',
      ".review-section",
      "#review-section",
    ];

    let reviewElement: HTMLElement | null = null;
    for (const selector of selectors) {
      reviewElement = document.querySelector(selector);
      if (reviewElement) {
        break;
      }
    }

    if (reviewElement) {
      const headerOffset = 80;
      const elementPosition = reviewElement.getBoundingClientRect().top;
      window.scrollTo({
        top: elementPosition + window.pageYOffset - headerOffset,
        behavior: "smooth",
      });
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Sub-blocks                                                          */
  /* ------------------------------------------------------------------ */

  const ratingSection = (
    <div
      className="flex items-center gap-[2px] lg:justify-start !mt-0 mb-[12px] md:!mb-[24px]"
      data-testid="bblunt-product-all-details-rating-section"
    >
      <svg
        className="w-[16px] h-[16px] flex-shrink-0"
        fill="#E6B30D"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 1.33L9.87 5.67L14.67 6.33L11.33 9.67L12 14.67L8 12L4 14.67L4.67 9.67L1.33 6.33L6.13 5.67L8 1.33Z" />
      </svg>
      <span
        className="font-[500] text-[14px] md:text-[16px] leading-[1.4em] cursor-pointer hover:opacity-70 transition-opacity text-[#1D1D1D]"
        onClick={scrollToReviewsSection}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            scrollToReviewsSection();
          }
        }}
        aria-label="Scroll to reviews section"
      >
        {reviews?.average ?? "—"}
      </span>
      <span className="text-[14px] md:text-[16px] font-[500] mx-1 text-[#1D1D1D]">
        ┃
      </span>
      <span
        className="text-[#3C4CFF] font-[500] text-[14px] md:text-[16px] leading-[1.4em] cursor-pointer hover:opacity-70 transition-opacity"
        onClick={scrollToReviewsSection}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            scrollToReviewsSection();
          }
        }}
        aria-label="Scroll to reviews section"
      >
        {reviews?.total ?? 0} {reviewsText}
      </span>
    </div>
  );

  const productTitle = (
    <div data-testid="product-title-wrapper" className="mb-[12px] md:mb-[20px]">
      <h1
        className="text-[16px] font-[500] md:text-[24px] md:font-[700] leading-[19.2px] md:leading-[28.8px] text-[#1D1D1D]"
        data-testid="bblunt-product-all-details-title"
      >
        {data?.title}
      </h1>
    </div>
  );

  const productTagsSection = () => {
    if (!data || productMetaTags.length === 0) {
      return null;
    }
    return (
      <div
        data-testid="product-tags-container"
        className="flex flex-wrap gap-[8px] md:gap-[16px] pb-[24px]"
      >
        {productMetaTags.map((tag, index) => (
          <div
            key={index}
            data-testid={`product-tag-${index}`}
            className="flex items-center gap-[12px] rounded-[4px] md:rounded-[7px] border-[0.5px] border-[#DDDDDD] py-0 md:py-[3px] px-[13px]"
            style={{ backgroundColor: "#f4f6f8" }}
          >
            <Image
              src="/svg/tag_icon.svg"
              alt="tag icon"
              width={12}
              height={12}
              className="flex-shrink-0"
              unoptimized
            />
            <span className="text-[14px] md:text-[16px] font-[500] leading-[1.6em] text-[#1D1D1D]">
              {tag}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const netContentSection = () => {
    if (!productNetContent) {
      return null;
    }
    return (
      <div
        data-testid="net-content-section"
        className="text-[14px] py-4 md:py-0 font-[400] text-[#1D1D1D] leading-[14px] mb-0 md:mb-[16px]"
        style={{ color: "#1D1D1D" }}
      >
        {netContentText}:{" "}
        <span className="font-[700]">{productNetContent}</span>
        {unitPrice && unitValue && (
          <>
            {" "}
            <span className="font-[700]">
              ({usp}:{rupeeSymbol}
              {unitPrice}/{unitValue})
            </span>
          </>
        )}
      </div>
    );
  };

  const priceSection = () => (
    <div data-testid="price-section-container" className="mb-[24px]">
      <div
        data-testid="price-section-content"
        className="flex flex-col md:gap-2 gap-4"
      >
        {compareAtPrice && compareAtPrice > currentPrice ? (
          <>
            {/* MOBILE: single line */}
            <div
              data-testid="price-mobile-line"
              className="flex flex-wrap items-center gap-2 md:hidden"
            >
              <span className="text-[22px] font-[700] text-[#1D1D1D] leading-[1em]">
                {rupeeSymbol}
                {currentPrice}
              </span>
              <span className="text-[14px] font-[400] text-[#a3a3a3] leading-[14px] mt-4">
                {mrp}{" "}
                <span className="line-through mt-2">
                  {rupeeSymbol}
                  {compareAtPrice}
                </span>
              </span>
              <span className="text-[14px] font-[700] text-[#D6322C] mt-4">
                {calculateDiscountPercentage(compareAtPrice, currentPrice)}
                {discount}
              </span>
              <span className="text-[12px] italic text-[#a3a3a3] leading-[19.2px] whitespace-nowrap mt-4">
                {inclusiveOfAllTaxesText}
              </span>
            </div>

            {/* DESKTOP: two-line layout */}
            <div
              data-testid="price-desktop-container"
              className="hidden md:flex flex-col"
            >
              <div className="flex items-center gap-[10px] leading-[17px] md:leading-[16px] xl:leading-[14px]">
                <span className="text-[26px] font-[700] text-[#1D1D1D] leading-[26px]">
                  {rupeeSymbol}
                  {Number(currentPrice).toLocaleString()}
                </span>
                <span className="text-[14px] font-[700] text-[#D6322C] mt-[10px]">
                  {calculateDiscountPercentage(compareAtPrice, currentPrice)}
                  {discount}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-[14px] font-[400] text-[#a3a3a3] leading-[14px]">
                  {mrp}{" "}
                  <span className="line-through">
                    {rupeeSymbol}
                    {Number(compareAtPrice).toLocaleString()}
                  </span>
                </span>
                <span className="text-[12px] ml-2 italic text-[#a3a3a3] leading-[19.2px] mt-1">
                  {inclusiveOfAllTaxesText}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div
            data-testid="price-no-discount-line"
            className="flex flex-wrap items-baseline gap-2 mt-4"
          >
            <span className="text-[14px] font-[400] text-[#a3a3a3] leading-[14px] mt-2">
              {mrp}
            </span>
            <span className="text-[22px] md:text-[26px] font-[700] text-[#1D1D1D] leading-[1em] mt-2">
              {rupeeSymbol}
              {currentPrice}
            </span>
            <span className="text-[12px] italic text-[#a3a3a3] leading-[19.2px] whitespace-nowrap mt-2">
              {inclusiveOfAllTaxesText}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      data-testid="bblunt-product-info-container"
      style={{ color: "#1D1D1D", opacity: isZoomOpen && isEditor ? 0 : 1 }}
    >
      {showMobileLikeLayout && (
        <div data-testid="mobile-layout-container">
          {productTitle}
          {ratingSection}
          {productTagsSection()}
          {renderGallery && (
            <div
              data-testid="mobile-gallery-wrapper"
              className="mb-4 md:hidden"
            >
              {renderGallery}
            </div>
          )}
          {netContentSection()}
          {priceSection()}
          {showProductMarquee && productMarqueeText && (
            <ProductMarquee
              text={productMarqueeText}
              couponCode={productMarqueeCouponCode}
              speed={productMarqueeSpeed}
              href={productMarqueeHref}
            />
          )}
          {productVariants && (
            <VariantPicker
              data={productVariants}
              selectSizeText={selectSizeText}
              fallbackImageUrl={data?.images?.[0]?.url ?? ""}
              selectedVariantId={selectedVariantId}
              compareAtPrice={compareAtPrice || 0}
              currentPrice={currentPrice}
              discount={discount}
              rupeeSymbol={rupeeSymbol}
              onVariantSelect={handleVariantSelect}
            />
          )}
        </div>
      )}

      {isDesktop && (
        <div data-testid="desktop-layout-container">
          <div className="space-y-3 order-1 w-full">
            {productTitle}
            {ratingSection}
            {productTagsSection()}
          </div>
          {netContentSection()}
          {priceSection()}

          {showProductMarquee && productMarqueeText && (
            <ProductMarquee
              text={productMarqueeText}
              couponCode={productMarqueeCouponCode}
              speed={productMarqueeSpeed}
              href={productMarqueeHref}
            />
          )}

          {productVariants && (
            <VariantPicker
              data={productVariants}
              selectSizeText={selectSizeText}
              fallbackImageUrl={data?.images?.[0]?.url ?? ""}
              selectedVariantId={selectedVariantId}
              compareAtPrice={compareAtPrice || 0}
              currentPrice={currentPrice}
              discount={discount}
              rupeeSymbol={rupeeSymbol}
              onVariantSelect={handleVariantSelect}
            />
          )}
        </div>
      )}

      <button
        data-testid="cart-item-add-to-cart"
        className="hidden md:flex w-full h-[48px] bg-[#1D1D1D] text-white rounded-[10px] font-[700] text-[22px] leading-[1.2em] items-center justify-center mt-6 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleAddToCart}
        disabled={isLoading || !data?.availableForSale || !cartToken}
      >
        {isLoading ? (
          <Spinner className="size-[2.4rem] text-gray-800" />
        ) : !data?.availableForSale ? (
          soldOutText
        ) : (
          addToCartText
        )}
      </button>
    </div>
  );
}
