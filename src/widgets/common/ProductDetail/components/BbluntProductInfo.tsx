"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useCartItems, useCartStore, type CartItem } from "@shopkit/cart";

import { useResponsive } from "@/hooks/useResponsive";
import { generateProductNavigationURL } from "@/utils/navigation";

import { ApiProduct, ProductMetadataKey } from "../types";
import { ProductMarquee } from "./ProductMarquee";
import {
  VariantPicker,
  NewVariantPickerData,
  NewVariantNode,
} from "./VariantPicker";
import { ProductCardToast } from "@/ui/components/ProductCard/Toast";
import { resolveAvailableForSale } from "@/ui/components/ProductCard/availability";
import {
  ProductRatingSummary,
  ProductRatingSummaryFallback,
} from "./ProductRatingSummary";
import {
  calculateDiscountPercentage,
  ensureArray,
  getUnitPrice,
  getUnitValue,
  pickFirstString,
} from "../utils/productInfoHelpers";

export interface BbluntProductInfoProps {
  data: ApiProduct;
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

  // Get the default variant or first variant for pricing
  const defaultVariant =
    product.variants?.find((v) => v.title === "Default Title") ||
    product.variants?.[0];
  const priceInPaise = defaultVariant?.price ?? product.price ?? 0;
  const compareAtPriceInPaise = product.compare_at_price;

  return {
    id: lineId,
    productId: product.id,
    variantId: variantId || defaultVariant?.id,
    sku: defaultVariant?.sku,
    title: product.title,
    price: { amount: priceInPaise, currencyCode: "INR" },
    compareAtPrice: compareAtPriceInPaise
      ? { amount: compareAtPriceInPaise, currencyCode: "INR" }
      : undefined,
    quantity: 1,
    image: product.image?.url || product.images?.[0]?.url,
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
  renderGallery,
  addToCartText = "Add to cart",
  netContentText = "Net content",
  inclusiveOfAllTaxesText = "Incl. of all taxes",
  reviewsText = "reviews",
  mrp = "MRP",
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
  const items = useCartItems();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const isLoading =
    isAddingToCart ||
    Boolean(
      loadingItems[data?.id] ||
      (selectedVariantId && loadingItems[selectedVariantId])
    );

  const productId = data?.id;
  const effectiveVariantId =
    selectedVariantId ??
    data?.variants?.find((v) => v.title === "Default Title")?.id ??
    data?.variants?.[0]?.id;
  const effectiveVariant = data?.variants?.find(
    (v) => v.id === effectiveVariantId
  );
  // availableForSale===true is authoritative; when false, fall back to the
  // selected variant's stock quantity (PDP API exposes it per variant).
  const isAvailable =
    resolveAvailableForSale(
      data?.availableForSale,
      effectiveVariant?.availableQuantity
    ) === true;

  const cartLine = items.find((i) => {
    const lineProductId = i.productId ?? i.product_id;
    const lineVariantId = i.variantId ?? i.variant_id;
    return effectiveVariantId
      ? lineProductId === productId && lineVariantId === effectiveVariantId
      : lineProductId === productId;
  });
  const currentQuantity = cartLine?.quantity ?? 0;
  const isInCart = !!cartLine;

  const [showToast, setShowToast] = useState(false);
  const pendingAddRef = useRef<{
    prevQuantity: number;
    prevInCart: boolean;
  } | null>(null);
  const pendingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const pending = pendingAddRef.current;
    if (!pending) {
      return;
    }
    const becameInCart = isInCart && !pending.prevInCart;
    const quantityIncreased =
      isInCart && currentQuantity > pending.prevQuantity;
    if (becameInCart || quantityIncreased) {
      setShowToast(true);
      pendingAddRef.current = null;
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
        pendingTimeoutRef.current = null;
      }
    }
  }, [isInCart, currentQuantity]);

  useEffect(() => {
    return () => {
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
      }
    };
  }, []);

  const handleAddToCart = async () => {
    if (!data) {
      return;
    }

    pendingAddRef.current = {
      prevQuantity: currentQuantity,
      prevInCart: isInCart,
    };
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
    }
    pendingTimeoutRef.current = setTimeout(() => {
      pendingAddRef.current = null;
      pendingTimeoutRef.current = null;
    }, 5000);

    setIsAddingToCart(true);
    try {
      const cartItem = buildCartItem(data, selectedVariantId);
      await addItem(cartItem);
    } catch (error) {
      console.error("[BbluntProductInfo] addItem failed:", error);
    } finally {
      setIsAddingToCart(false);
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

  const productMetaTags = ensureArray<string>(
    data?.metadata?.[PRODUCT_INFO_METAFIELD_KEYS.PRODUCT_TAGS_MERA]?.value as
      string | string[] | undefined
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
    <Suspense fallback={<ProductRatingSummaryFallback />}>
      <ProductRatingSummary
        productId={data.id}
        reviewsText={reviewsText}
        onScrollToReviews={scrollToReviewsSection}
      />
    </Suspense>
  );

  const productTitle = (
    <div data-testid="product-title-wrapper" className="mb-3 md:mb-5">
      <h1
        className="text-base font-medium md:text-2xl md:font-bold leading-[19.2px] md:leading-[28.8px] text-primary"
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
        className="flex flex-wrap gap-2 md:gap-4 pb-6"
      >
        {productMetaTags.map((tag, index) => (
          <div
            key={index}
            data-testid={`product-tag-${index}`}
            className="flex items-center gap-[8px] md:gap-3 rounded md:rounded-[7px] border-[0.5px] border-[#DDDDDD] py-0 md:py-[3px] px-[8px] md:px-[13px]"
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
            <span className="text-[12px] min-[375px]:text-[14px] md:text-[16px] font-medium leading-[1.6em] text-primary">
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
        className="text-sm py-4 md:py-0 font-normal text-primary leading-[14px] mb-0 md:mb-4"
        style={{ color: "#1D1D1D" }}
      >
        {netContentText}: <span className="font-bold">{productNetContent}</span>
        {unitPrice && unitValue && (
          <>
            {" "}
            <span className="font-bold">
              ({usp}:{rupeeSymbol}
              {unitPrice}/{unitValue})
            </span>
          </>
        )}
      </div>
    );
  };

  const priceSection = () => (
    <div data-testid="price-section-container" className="mb-7">
      <div
        data-testid="price-section-content"
        className="flex flex-col md:gap-2 gap-4"
      >
        {compareAtPrice && compareAtPrice > currentPrice ? (
          <>
            {/* MOBILE (<768): single inline row.
                Live order: sale price → MRP+strike → discount% → incl.tax,
                all items-center aligned with gap-x-2.5. */}
            <div
              data-testid="price-mobile-line"
              className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 md:hidden"
            >
              <span className="text-[20px] min-[375px]:text-[22px] font-bold text-primary leading-none">
                {rupeeSymbol}
                {Number(currentPrice).toLocaleString()}
              </span>
              <span className="text-[12px] font-normal text-[#a3a3a3] leading-none">
                {mrp}{" "}
                <span className="line-through">
                  {rupeeSymbol}
                  {Number(compareAtPrice).toLocaleString()}
                </span>
              </span>
              <span className="text-[12px] font-bold text-[#D6322C] leading-none">
                {calculateDiscountPercentage(compareAtPrice, currentPrice)}
                {discount}
              </span>
              <span className="text-[12px] italic text-[#a3a3a3] leading-none">
                {inclusiveOfAllTaxesText}
              </span>
            </div>

            {/* DESKTOP (≥768): two stacked rows. Live wraps the price block
                here. Row 1 = price + discount; row 2 = MRP+strike + incl.tax.
                Strike weight jumps to 600 on desktop per live. */}
            <div
              data-testid="price-desktop-container"
              className="hidden md:flex md:flex-col md:gap-1"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[26px] font-bold text-primary leading-none">
                  {rupeeSymbol}
                  {Number(currentPrice).toLocaleString()}
                </span>
                <span className="text-[14px] font-bold text-[#D6322C] leading-none">
                  {calculateDiscountPercentage(compareAtPrice, currentPrice)}
                  {discount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-normal text-[#a3a3a3] leading-none">
                  {mrp}{" "}
                  <span className="line-through font-semibold">
                    {rupeeSymbol}
                    {Number(compareAtPrice).toLocaleString()}
                  </span>
                </span>
                <span className="text-[12px] italic text-[#a3a3a3] leading-none">
                  {inclusiveOfAllTaxesText}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div
            data-testid="price-no-discount-line"
            className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
          >
            <span className="text-[12px] md:text-[14px] font-normal text-[#a3a3a3] leading-none">
              {mrp}
            </span>
            <span className="text-[20px] min-[375px]:text-[22px] md:text-[26px] font-bold text-primary leading-none">
              {rupeeSymbol}
              {currentPrice}
            </span>
            <span className="text-[12px] italic text-[#a3a3a3] leading-none whitespace-nowrap">
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
          <div className="px-[16px] md:px-0">
            {productTitle}
            {ratingSection}
            {productTagsSection()}
          </div>
          {renderGallery && (
            <div
              data-testid="mobile-gallery-wrapper"
              className="mb-2 md:hidden"
            >
              {renderGallery}
            </div>
          )}
          <div className="px-[16px] md:px-0">
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

      {/* Desktop Add to Cart Button */}
      <button
        data-testid="cart-item-add-to-cart"
        className={`hidden md:flex w-full h-12 bg-black text-white rounded-[10px] font-bold text-[22px] leading-[1.2em] items-center justify-center transition-opacity disabled:cursor-not-allowed ${isLoading ? "" : "shine-link-button"}`}
        onClick={handleAddToCart}
        disabled={isLoading || !isAvailable || !cartToken}
      >
        {isLoading ? (
          <span
            data-testid="add-to-cart-loading-spinner"
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
          />
        ) : !isAvailable ? (
          soldOutText
        ) : (
          addToCartText
        )}
      </button>

      <ProductCardToast
        show={showToast}
        onClose={() => setShowToast(false)}
        title="Item added to your cart"
      />
    </div>
  );
}
