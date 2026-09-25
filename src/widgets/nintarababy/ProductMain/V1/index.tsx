"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useId,
  useEffect,
} from "react";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCartStore } from "@shopkit/cart";
import { ProductMainProps, DEFAULT_VARIANT_SWATCHES } from "../types";
import { paiseToRupees, formatINR, isIResponse } from "@/utils/apiTransforms";
import { cacheCartImage } from "@/utils/cartImageCache";
import { cacheLocalCartItem } from "@/utils/localCartCache";
import { useProductDiscounts } from "@/hooks/useProductDiscounts";
import {
  addSentryBreadcrumb,
  captureSentryException,
} from "@/lib/sentry/utils";
import "../style.css";

const FALLBACK_IMG = "/assets/momsco/svg/image-not-available.svg";

/** URL query param used to deep-link / share a specific variant selection. */
const VARIANT_PARAM = "variant";

/** Value of a specific metadata tag (e.g. "tag1") for a variant, e.g. "Bestseller".
    Variant metadata is a keyed object: { tag1: { value, data_type }, … }. */
function getVariantTagValue(variant: any, key: string): string {
  const entry = variant?.metadata?.[key];
  const text = entry && typeof entry === "object" ? entry.value : entry;
  return text ? String(text) : "";
}

/* ================================================================
   SVG Icons (inline to avoid external asset deps)
   ================================================================ */

/** Left chevron arrow for gallery navigation */
function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

/** Right chevron arrow for gallery navigation */
function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/** Up chevron for thumbnail navigation */
function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

/** Down chevron for thumbnail navigation */
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/** Magnify/search icon for enlarge button */
function MagnifyIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

/** Minus icon for quantity */
function MinusIcon() {
  return (
    <svg
      focusable="false"
      className="icon icon--minus"
      viewBox="0 0 10 2"
      role="presentation"
      width="10"
      height="2"
    >
      <path d="M10 0v2H0V0z" fill="currentColor" />
    </svg>
  );
}

/** Plus icon for quantity */
function PlusIcon() {
  return (
    <svg
      focusable="false"
      className="icon icon--plus"
      viewBox="0 0 10 10"
      role="presentation"
      width="10"
      height="10"
    >
      <path
        d="M6 4h4v2H6v4H4V6H0V4h4V0h2v4z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

/** Star path used by the proportional-fill rating renderer */
const PM_STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

/** Single star with proportional fill (0..1). Used by StarRating. */
function ProportionalStar({
  fillPct,
  gradId,
}: {
  fillPct: number;
  gradId: string;
}) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <defs>
        <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
          <stop
            offset={`${fillPct}%`}
            stopColor="var(--nintara-pm-star-color)"
          />
          <stop offset={`${fillPct}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      {/* Faded backdrop — visible where the gradient is transparent */}
      <path
        d={PM_STAR_PATH}
        fill="var(--nintara-pm-star-color)"
        opacity="0.25"
      />
      {/* Foreground — gradient-clipped to fillPct */}
      <path d={PM_STAR_PATH} fill={`url(#${gradId})`} />
    </svg>
  );
}

/** Shipping truck icon */
function TruckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

/** Play icon */
function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

/** Chevron down for accordion */
function AccordionChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.25s ease",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/** Offer/gift icon */
function OfferIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--nintara-pm-body-color)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

/* ================================================================
   Render star rating (e.g. 4.69 out of 5) — proportional fill
   so 4.7 shows as 4 full + 5th star filled 70% from left.
   ================================================================ */
function StarRating({
  score,
  count,
  reviewsText = "reviews",
}: {
  score: string;
  count: string;
  reviewsText?: string;
}) {
  const numScore = parseFloat(score);
  const reactId = useId();
  return (
    <div className="nintara-pm__rating" data-testid="momsco-product-rating">
      <div
        className="nintara-pm__rating-stars"
        data-testid="momsco-product-rating-stars"
      >
        {[1, 2, 3, 4, 5].map((i) => {
          const fillPct = Math.max(0, Math.min(1, numScore - (i - 1))) * 100;
          return (
            <ProportionalStar
              key={i}
              fillPct={fillPct}
              gradId={`pm-star-${reactId}-${i}`}
            />
          );
        })}
      </div>
      {/* <span className="nintara-pm__rating-score">{score}</span> */}
      <a
        href="#reviews"
        className="nintara-pm__rating-link"
        data-testid="momsco-product-review-count"
      >
        {count} {reviewsText}
      </a>
    </div>
  );
}

/* ================================================================
   MAIN V1 COMPONENT
   ================================================================ */
export function V1({ data, settings, className }: ProductMainProps) {
  // Transform API product data
  const apiProduct = useMemo(() => {
    const rawData = data as any;
    if (
      !isIResponse(rawData) ||
      !rawData.data ||
      typeof rawData.data !== "object"
    ) {
      return null;
    }
    const p = rawData.data as any;
    if (!p.title) {
      return null;
    }

    const saleRupees = paiseToRupees(p.price);
    const compareRupees = paiseToRupees(p.compare_at_price);
    const discount =
      compareRupees > saleRupees && saleRupees > 0
        ? Math.round(((compareRupees - saleRupees) / compareRupees) * 100)
        : 0;

    return {
      title: p.title,
      // Product metadata `subtitle` (e.g. "Baby Cream for Gentle touch.") —
      // keyed object like variant metadata: { subtitle: { value, data_type } }.
      subtitle: p.metadata?.subtitle?.value
        ? String(p.metadata.subtitle.value)
        : "",
      salePrice: saleRupees > 0 ? formatINR(saleRupees) : "",
      compareAtPrice:
        compareRupees > saleRupees ? formatINR(compareRupees) : "",
      savePercent: discount > 0 ? `${discount}%` : "",
      ratingScore: p.average_rating ? String(p.average_rating) : "0",
      reviewCount: p.rating_count ? String(p.rating_count) : "0",
      images: (p.images ?? []).map((img: any) => ({
        url: img.url || img.src || FALLBACK_IMG,
        alt: img.alt || p.title,
        width: 700,
        height: 700,
      })),
      _variantId: p.variant?.id ?? p.variants?.[0]?.id ?? "",
      _productId: String(p.id ?? ""),
      _imageUrl: p.images?.[0]?.url || p.image_url || FALLBACK_IMG,
      _priceAmount: saleRupees,
      _handle: p.handle ?? "",
      product_type: p.product_type || p.productType || "",
      _options: Array.isArray(p.options) ? p.options : [],
      _variants: Array.isArray(p.variants) ? p.variants : [],
    };
  }, [data]);

  const images =
    apiProduct?.images && apiProduct.images.length > 0
      ? apiProduct.images
      : [
          {
            url: FALLBACK_IMG,
            alt: apiProduct?.title || "Product image",
            width: 700,
            height: 700,
          },
        ];
  const variants = data?.variants ?? DEFAULT_VARIANT_SWATCHES;

  /* ================================================================
     Variant selection (option-matrix, neurogum-style pills)
     ----------------------------------------------------------------
     The API product exposes `options` (e.g. "Monocarton": [50gm, 100gm])
     and `variants`, each carrying `option_values` aligned to options by
     position. Selecting one value per option resolves the matching
     variant, which drives price + add-to-cart target.
     ================================================================ */
  const productOptions: any[] = apiProduct?._options ?? [];
  const productVariants: any[] = apiProduct?._variants ?? [];
  const hasVariantSelector =
    productOptions.length > 0 && productVariants.length > 1;

  // URL-driven variant deep-link (?variant=<id>) — read & write via the Next.js
  // navigation hooks so a shared/direct link lands on the right selection.
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const variantFromUrl = searchParams.get(VARIANT_PARAM);

  // Default selection = URL variant (if any), else first variant's
  // option_values (fallback: first value of each option group).
  const initialOptionValues = useMemo<string[]>(() => {
    if (variantFromUrl) {
      const urlMatch = productVariants.find(
        (v: any) => String(v?.id) === variantFromUrl
      );
      if (
        Array.isArray(urlMatch?.option_values) &&
        urlMatch.option_values.length
      ) {
        return urlMatch.option_values.map((v: any) => String(v));
      }
    }
    const first = productVariants[0];
    if (Array.isArray(first?.option_values) && first.option_values.length) {
      return first.option_values.map((v: any) => String(v));
    }
    return productOptions.map((o: any) => String(o?.values?.[0]?.value ?? ""));
  }, [productVariants, productOptions, variantFromUrl]);

  const [selectedOptionValues, setSelectedOptionValues] =
    useState<string[]>(initialOptionValues);

  // Re-sync when the product changes or the URL variant changes (e.g. client
  // navigation / ISR refresh / shared link).
  useEffect(() => {
    setSelectedOptionValues(initialOptionValues);
  }, [initialOptionValues]);

  const selectedVariant = useMemo<any>(() => {
    if (!productVariants.length) {
      return null;
    }
    const match = productVariants.find((v: any) => {
      const ov = v?.option_values ?? [];
      return selectedOptionValues.every(
        (val, idx) => String(ov[idx] ?? "") === String(val)
      );
    });
    return match ?? productVariants[0];
  }, [productVariants, selectedOptionValues]);

  // Reflect the selected variant in the URL (?variant=<id>) so the current
  // selection is shareable / directly visitable. router.replace with
  // scroll:false avoids a navigation/scroll jump.
  useEffect(() => {
    if (!hasVariantSelector || selectedVariant?.id == null) {
      return;
    }
    const variantId = String(selectedVariant.id);
    if (searchParams.get(VARIANT_PARAM) === variantId) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set(VARIANT_PARAM, variantId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [selectedVariant, hasVariantSelector, searchParams, pathname, router]);

  // Selected variant in stock? Drives ATC enable/label. Products without a
  // variant selector are treated as available (legacy / single-variant data).
  const isSelectedAvailable =
    !hasVariantSelector || selectedVariant?.availableForSale !== false;

  const handleSelectOption = useCallback((optionIdx: number, value: string) => {
    setSelectedOptionValues((prev) => {
      const next = [...prev];
      next[optionIdx] = value;
      return next;
    });
  }, []);

  // Is this (optionIdx, value) reachable given the other current selections?
  // Used only for a visual hint — selection is never blocked.
  const isOptionValueAvailable = useCallback(
    (optionIdx: number, value: string) =>
      productVariants.some((v: any) => {
        const ov = v?.option_values ?? [];
        if (String(ov[optionIdx] ?? "") !== String(value)) {
          return false;
        }
        return selectedOptionValues.every(
          (sel, idx) =>
            idx === optionIdx || String(ov[idx] ?? "") === String(sel)
        );
      }),
    [productVariants, selectedOptionValues]
  );

  // Resolve the variant that picking `value` at optionIdx would produce, given
  // the other current selections. Drives the per-pill thumbnail + tag badge.
  const getVariantForOption = useCallback(
    (optionIdx: number, value: string) =>
      productVariants.find((v: any) => {
        const ov = v?.option_values ?? [];
        if (String(ov[optionIdx] ?? "") !== String(value)) {
          return false;
        }
        return selectedOptionValues.every(
          (sel, idx) =>
            idx === optionIdx || String(ov[idx] ?? "") === String(sel)
        );
      }) ?? null,
    [productVariants, selectedOptionValues]
  );

  // Price derived from the selected variant (paise → rupees).
  const variantPricing = useMemo(() => {
    if (!selectedVariant) {
      return null;
    }
    const sale = paiseToRupees(selectedVariant.price);
    const compare = paiseToRupees(selectedVariant.compare_at_price);
    const disc =
      compare > sale && sale > 0
        ? Math.round(((compare - sale) / compare) * 100)
        : 0;
    return {
      salePrice: sale > 0 ? formatINR(sale) : "",
      compareAtPrice: compare > sale ? formatINR(compare) : "",
      savePercent: disc > 0 ? `${disc}%` : "",
      amountRupees: sale,
    };
  }, [selectedVariant]);

  // Fetch product-page discounts from API (post-ISR, client-side).
  // Pass IDs already known from ISR data so the hook can skip re-deriving them.
  const { offers: apiDiscountOffers, loading: discountsLoading } =
    useProductDiscounts({
      handle: apiProduct?._handle ?? "",
      productId: apiProduct?._productId,
      variantId: apiProduct?._variantId,
    });

  const offers = apiDiscountOffers;
  const title =
    apiProduct?.title ||
    data?.title ||
    "Ergopod\u2122 Baby Feeding Pillow | Lucky Clover";
  const subtitle = apiProduct?.subtitle || "";
  // When a variant selector is shown, the selected variant's pricing is
  // authoritative — including the absence of a discount (empty strings must
  // NOT fall back to the product-level compare/save, or a non-discounted
  // variant would inherit the default variant's strike-through + SAVE badge).
  const compareAtPrice =
    hasVariantSelector && variantPricing
      ? variantPricing.compareAtPrice
      : apiProduct?.compareAtPrice || data?.compareAtPrice || "";
  const salePrice =
    hasVariantSelector && variantPricing
      ? variantPricing.salePrice
      : apiProduct?.salePrice || data?.salePrice || "";
  const savePercent =
    hasVariantSelector && variantPricing
      ? variantPricing.savePercent
      : apiProduct?.savePercent || data?.savePercent || "";
  const activeVariantName = data?.activeVariantName || "Lucky Clover";
  const ratingScore = apiProduct?.ratingScore || data?.ratingScore || "0";
  const reviewCount = apiProduct?.reviewCount || data?.reviewCount || "0";
  const shippingEstimate =
    data?.shippingEstimate ?? settings?.shippingEstimate ?? "Feb 22 - Feb 25";

  // UI labels from settings (editor-configurable)
  const badgeText = settings?.badgeText ?? "Parent's Choice";
  const saveLabel = settings?.saveLabel ?? "SAVE";
  const mrpNote = settings?.mrpNote ?? "MRP inclusive of all taxes";
  const addToCartText = settings?.addToCartText ?? "ADD TO CART";
  const addingText = settings?.addingText ?? "ADDING...";
  const outOfStockText = settings?.outOfStockText ?? "OUT OF STOCK";
  const offerLabel = settings?.offerLabel ?? "Available Offer";
  const offersCountSuffix = settings?.offersCountSuffix ?? "Offer(s)";
  const reviewsText = settings?.reviewsText ?? "reviews";

  /* Gallery state */
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);

  /* Quantity state */
  const [quantity, setQuantity] = useState(1);

  /* Offers accordion state */
  const [offersOpen, setOffersOpen] = useState(false);

  /* Copied code acknowledgment */
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  /* ATC loading state */
  const [isAdding, setIsAdding] = useState(false);

  /* Lightbox state */
  const [lightboxOpen, setLightboxOpen] = useState(false);

  /* Share dropdown state */
  const [shareOpen, setShareOpen] = useState(false);

  /* Track / drag / animation state — main gallery uses cloned slides at each
     end so wrap-around (last → first, first → last) animates seamlessly.

     The track's `transition` is controlled imperatively via trackElRef.style
     (NOT through React state). React's automatic batching can otherwise merge
     the "turn transition off + snap index" update with the RAF "turn it on"
     update, so the browser never paints the snap frame and instead animates
     the silent reset — producing a visible backward-scroll bug at the wrap. */
  const trackWrapperRef = useRef<HTMLDivElement | null>(null);
  const trackElRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const dragStartYRef = useRef<number | null>(null);
  const dragLockRef = useRef<"x" | "y" | null>(null);
  const pendingAdvanceRef = useRef<"next" | "prev" | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const SWIPE_THRESHOLD = 50;

  const setTrackTransition = (on: boolean) => {
    if (!trackElRef.current) {
      return;
    }
    trackElRef.current.style.transition = on ? "" : "none";
  };

  /* Animated step — drives both gallery arrows and drag-release.
     Sets dragOffset to ±wrapperWidth, then transitionend wraps the index
     and silently snaps offset back to 0. */
  const animateAdvance = useCallback((direction: "next" | "prev") => {
    if (pendingAdvanceRef.current) {
      return;
    }
    const wrapperWidth = trackWrapperRef.current?.clientWidth ?? 1;
    pendingAdvanceRef.current = direction;
    setTrackTransition(true);
    setDragOffset(direction === "next" ? -wrapperWidth : wrapperWidth);
  }, []);

  const handlePrevImage = useCallback(
    () => animateAdvance("prev"),
    [animateAdvance]
  );
  const handleNextImage = useCallback(
    () => animateAdvance("next"),
    [animateAdvance]
  );

  /* Lightbox swipe — instant wrap (lightbox renders a single image directly,
     not the track, so we just update the index without animation). */
  const pointerStartXRef = useRef<number | null>(null);
  const pointerStartYRef = useRef<number | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) {
      return;
    }
    pointerStartXRef.current = e.clientX;
    pointerStartYRef.current = e.clientY;
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (
        pointerStartXRef.current === null ||
        pointerStartYRef.current === null
      ) {
        return;
      }
      const dx = e.clientX - pointerStartXRef.current;
      const dy = e.clientY - pointerStartYRef.current;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
        setCurrentImageIdx((prev) => {
          if (dx < 0) {
            return prev === images.length - 1 ? 0 : prev + 1;
          }
          return prev === 0 ? images.length - 1 : prev - 1;
        });
      }
      pointerStartXRef.current = null;
      pointerStartYRef.current = null;
    },
    [images.length]
  );

  const handlePointerCancel = useCallback(() => {
    pointerStartXRef.current = null;
    pointerStartYRef.current = null;
  }, []);

  /* Visual carousel drag on main image — finger / cursor follows the slide live */
  const handleTrackPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) {
      return;
    }
    if (pendingAdvanceRef.current) {
      return;
    } // ignore while a previous step is settling
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragLockRef.current = null;
    setTrackTransition(false);
  }, []);

  const handleTrackPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragStartXRef.current === null || dragStartYRef.current === null) {
      return;
    }
    const dx = e.clientX - dragStartXRef.current;
    const dy = e.clientY - dragStartYRef.current;
    if (dragLockRef.current === null && Math.abs(dx) + Math.abs(dy) > 8) {
      dragLockRef.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (dragLockRef.current === "x") {
      setDragOffset(dx);
    }
  }, []);

  const handleTrackPointerUp = useCallback((e: React.PointerEvent) => {
    if (dragStartXRef.current === null) {
      return;
    }
    const dx = e.clientX - dragStartXRef.current;
    const wrapperWidth = trackWrapperRef.current?.clientWidth ?? 1;
    const wasHorizontal = dragLockRef.current === "x";

    setTrackTransition(true);

    if (wasHorizontal && Math.abs(dx) > SWIPE_THRESHOLD) {
      // wrap-aware advance — clones at track ends absorb the boundary case
      pendingAdvanceRef.current = dx < 0 ? "next" : "prev";
      setDragOffset(dx < 0 ? -wrapperWidth : wrapperWidth);
    } else {
      setDragOffset(0);
    }

    dragStartXRef.current = null;
    dragStartYRef.current = null;
    dragLockRef.current = null;
  }, []);

  const handleTrackPointerCancel = useCallback(() => {
    if (dragStartXRef.current === null) {
      return;
    }
    setTrackTransition(true);
    setDragOffset(0);
    dragStartXRef.current = null;
    dragStartYRef.current = null;
    dragLockRef.current = null;
    pendingAdvanceRef.current = null;
  }, []);

  const handleTrackTransitionEnd = useCallback(() => {
    const pending = pendingAdvanceRef.current;
    if (!pending) {
      return;
    }
    pendingAdvanceRef.current = null;

    const newIdx =
      pending === "next"
        ? currentImageIdx === images.length - 1
          ? 0
          : currentImageIdx + 1
        : currentImageIdx === 0
          ? images.length - 1
          : currentImageIdx - 1;

    // Imperative snap — bypass React's render cycle entirely for this critical
    // step. We disable transition on the DOM, set the new transform directly,
    // force a reflow so the browser commits it instantly (no animation), then
    // re-enable transition. This is the only reliable way to avoid React 18
    // batching merging the snap and the re-enable into one paint, which would
    // animate the silent reset and look like a backwards scroll.
    const trackEl = trackElRef.current;
    if (trackEl) {
      trackEl.style.transition = "none";
      trackEl.style.transform = `translateX(${-(newIdx + 1) * 100}%)`;
      // Reading offsetHeight forces synchronous layout — guarantees the
      // browser applies transition:none before the React render below
      // changes the transform value again.
      void trackEl.offsetHeight;
      trackEl.style.transition = "";
    }

    setCurrentImageIdx(newIdx);
    setDragOffset(0);
  }, [currentImageIdx, images.length]);

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  }, []);

  const handleAddToCart = useCallback(async () => {
    // Block out-of-stock variants (the button is also disabled in the UI).
    if (!isSelectedAvailable) {
      return;
    }
    setIsAdding(true);
    try {
      // Prefer the currently selected variant; fall back to the product default.
      const variantId =
        (selectedVariant?.id != null ? String(selectedVariant.id) : "") ||
        apiProduct?._variantId ||
        "default";
      const productId = apiProduct?._productId || "default";
      const priceRupees =
        variantPricing?.amountRupees ?? apiProduct?._priceAmount ?? 0;
      const imageUrl =
        selectedVariant?.imageUrl ||
        apiProduct?._imageUrl ||
        images[0]?.url ||
        "";
      // Append the variant title when a selector is shown (e.g. "Cream - 50gm / new").
      const itemTitle =
        hasVariantSelector && selectedVariant?.title
          ? `${title} - ${selectedVariant.title}`
          : title;

      addSentryBreadcrumb("cart", "Add to cart", {
        productId,
        variantId,
        quantity,
        title: itemTitle,
      });

      cacheCartImage(variantId, imageUrl, productId);
      cacheLocalCartItem(variantId, {
        productId,
        title: itemTitle,
        price: { amount: priceRupees * 100, currencyCode: "INR" },
        image: imageUrl,
      });

      await useCartStore.getState().addItem({
        id: variantId,
        productId,
        variantId,
        title: itemTitle,
        handle: apiProduct?._handle ?? "",
        price: { amount: priceRupees * 100, currencyCode: "INR" },
        image: imageUrl,
        quantity,
        product_type: apiProduct?.product_type || undefined,
      } as any);

      if (process.env.NEXT_PUBLIC_KWIKCART_DISABLE === "true") {
        useCartStore.getState().openCart();
      }
    } catch (err) {
      captureSentryException(err, {
        tags: { flow: "cart", operation: "addToCart" },
        contexts: {
          product: {
            productId: apiProduct?._productId,
            variantId: apiProduct?._variantId,
            title,
          },
        },
      });
      console.error("[ProductMain] Add to cart failed:", err);
    } finally {
      setIsAdding(false);
    }
  }, [
    apiProduct,
    title,
    quantity,
    images,
    selectedVariant,
    variantPricing,
    hasVariantSelector,
    isSelectedAvailable,
  ]);

  return (
    <section
      className={"nintara-pm__section" + (className ? " " + className : "")}
      data-testid="momsco-product-main-container"
    >
      <div className="nintara-pm__container">
        <div className="nintara-pm__row">
          {/* ============================================
              LEFT COLUMN: Image Gallery
              ============================================ */}
          <div className="nintara-pm__media-col">
            <div
              className="nintara-pm__gallery-row"
              onMouseEnter={() => setIsGalleryHovered(true)}
              onMouseLeave={() => setIsGalleryHovered(false)}
              data-testid="momsco-product-main-gallery"
            >
              {/* Vertical thumbnail strip */}
              <div
                className="nintara-pm__thumb-col"
                data-testid="momsco-product-thumb-column"
              >
                <button
                  className="nintara-pm__thumb-nav nintara-pm__thumb-prev"
                  aria-label="Previous thumbnail"
                  onClick={handlePrevImage}
                  data-testid="momsco-product-thumb-prev-btn"
                >
                  <ChevronUpIcon />
                </button>

                <div className="nintara-pm__thumb-list">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      className={
                        "nintara-pm__thumb-item" +
                        (idx === currentImageIdx ? " is-active" : "")
                      }
                      onClick={() => setCurrentImageIdx(idx)}
                      aria-label={"View image " + (idx + 1)}
                      data-testid={
                        idx === currentImageIdx
                          ? "momsco-product-thumb-active"
                          : "momsco-product-thumb-item"
                      }
                    >
                      <Image
                        src={img.url || FALLBACK_IMG}
                        alt={img.alt}
                        width={80}
                        height={80}
                        className="nintara-pm__thumb-img"
                        unoptimized={!img.url || img.url === FALLBACK_IMG}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            FALLBACK_IMG;
                        }}
                      />
                    </button>
                  ))}
                </div>

                <button
                  className="nintara-pm__thumb-nav nintara-pm__thumb-next"
                  aria-label="Next thumbnail"
                  onClick={handleNextImage}
                >
                  <ChevronDownIcon />
                </button>
              </div>

              {/* Main image area */}
              <div className="nintara-pm__main-img-col">
                <div
                  className="nintara-pm__main-img-wrapper"
                  ref={trackWrapperRef}
                >
                  <div
                    ref={trackElRef}
                    className="nintara-pm__main-img-track"
                    style={{
                      transform:
                        images.length > 1
                          ? `translateX(calc(${-(currentImageIdx + 1) * 100}% + ${dragOffset}px))`
                          : `translateX(${dragOffset}px)`,
                    }}
                    onPointerDown={handleTrackPointerDown}
                    onPointerMove={handleTrackPointerMove}
                    onPointerUp={handleTrackPointerUp}
                    onPointerCancel={handleTrackPointerCancel}
                    onPointerLeave={handleTrackPointerCancel}
                    onTransitionEnd={handleTrackTransitionEnd}
                  >
                    {/* Clone of last image — sits at slot 0 so dragging from
                        index 0 backwards reveals the last image seamlessly. */}
                    {images.length > 1 && (
                      <div
                        className="nintara-pm__main-img-slide"
                        aria-hidden="true"
                      >
                        <Image
                          src={images[images.length - 1].url || FALLBACK_IMG}
                          alt=""
                          width={700}
                          height={700}
                          className="nintara-pm__main-img"
                          draggable={false}
                          unoptimized={
                            !images[images.length - 1].url ||
                            images[images.length - 1].url === FALLBACK_IMG
                          }
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              FALLBACK_IMG;
                          }}
                        />
                      </div>
                    )}

                    {images.map((img: any, idx: number) => (
                      <div key={idx} className="nintara-pm__main-img-slide">
                        <Image
                          src={img.url || FALLBACK_IMG}
                          alt={img.alt}
                          width={700}
                          height={700}
                          className="nintara-pm__main-img"
                          data-testid="momsco-product-main-image"
                          priority={idx === 0}
                          draggable={false}
                          unoptimized={!img.url || img.url === FALLBACK_IMG}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              FALLBACK_IMG;
                          }}
                        />
                      </div>
                    ))}

                    {/* Clone of first image — sits at the last slot so
                        dragging forward from the last image reveals image 0. */}
                    {images.length > 1 && (
                      <div
                        className="nintara-pm__main-img-slide"
                        aria-hidden="true"
                      >
                        <Image
                          src={images[0].url || FALLBACK_IMG}
                          alt=""
                          width={700}
                          height={700}
                          className="nintara-pm__main-img"
                          draggable={false}
                          unoptimized={
                            !images[0].url || images[0].url === FALLBACK_IMG
                          }
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              FALLBACK_IMG;
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Enlarge button */}
                <button
                  className="nintara-pm__enlarge-btn"
                  aria-label="Click to enlarge"
                  onClick={() => setLightboxOpen(true)}
                >
                  <MagnifyIcon />
                </button>

                {/* Prev / Next arrows — always visible */}
                <button
                  className="nintara-pm__gallery-arrow nintara-pm__gallery-prev is-visible"
                  aria-label="Previous image"
                  onClick={handlePrevImage}
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  className="nintara-pm__gallery-arrow nintara-pm__gallery-next is-visible"
                  aria-label="Next image"
                  onClick={handleNextImage}
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          </div>

          {/* ============================================
              RIGHT COLUMN: Product Info
              ============================================ */}
          <div className="nintara-pm__info-col">
            <div className="nintara-pm__info">
              <div className="nintara-pm__info-left">
                {/* Parent's Choice badge */}
                {/* <p className="nintara-pm__parent-label">Parent&apos;s Choice</p> */}

                {/* Product title */}
                <div className="nintara-pm__title-row">
                  <h1
                    className="nintara-pm__title"
                    data-testid="momsco-product-main-title"
                  >
                    {title}
                  </h1>
                </div>

                {/* Product subtitle (metadata `subtitle` metafield) */}
                {subtitle && (
                  <p
                    className="nintara-pm__subtitle"
                    data-testid="momsco-product-main-subtitle"
                  >
                    {subtitle}
                  </p>
                )}

                {/* Old share removed — now in info-right */}
                {/* <div className="nintara-pm__share-standalone">
                <div className="nintara-pm__share">
                  <button
                    className="nintara-pm__share-btn nintara-pm__share-btn--toggle"
                    aria-label="Share"
                    onClick={() => setShareOpen((prev) => {
                      if (!prev) setTimeout(() => setShareOpen(false), 5000);
                      return !prev;
                    })}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="31"
                      viewBox="0 0 34 31"
                      fill="none"
                    >
                      <path
                        d="M23 10.5C23.7745 10.6606 24.3588 10.9286 24.8284 11.3759C26 12.4918 26 14.2879 26 17.88C26 21.4721 26 23.2681 24.8284 24.3841C23.6569 25.5 21.7712 25.5 18 25.5H16C12.2288 25.5 10.3431 25.5 9.17157 24.3841C8 23.2681 8 21.4721 8 17.88C8 14.2879 8 12.4918 9.17157 11.3759C9.64118 10.9286 10.2255 10.6606 11 10.5"
                        stroke="#092A33"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      ></path>
                      <path
                        d="M17.0253 5.50052L17 17.5M17.0253 5.50052C16.8627 5.49379 16.6991 5.55191 16.5533 5.67492C15.6469 6.44006 14 8.42886 14 8.42886M17.0253 5.50052C17.1711 5.50657 17.3162 5.56476 17.4468 5.67508C18.3531 6.44037 20 8.42886 20 8.42886"
                        stroke="#092A33"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </button>
                  <div
                    className={`nintara-pm__share-dropdown${shareOpen ? " is-open" : ""}`}
                  >
                    <button
                      className="nintara-pm__share-btn"
                      aria-label="Share on Facebook"
                      onClick={() =>
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                          "_blank"
                        )
                      }
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </button>
                    <button
                      className="nintara-pm__share-btn"
                      aria-label="Share on Instagram"
                      onClick={() =>
                        window.open(
                          "https://www.instagram.com/themomsco",
                          "_blank"
                        )
                      }
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          ry="5"
                        />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </button>
                    <button
                      className="nintara-pm__share-btn"
                      aria-label="Share on WhatsApp"
                      onClick={() =>
                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(title + " " + window.location.href)}`,
                          "_blank"
                        )
                      }
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 0 1-4.264-1.227l-.306-.182-2.87.852.852-2.87-.182-.306A8 8 0 1 1 12 20z" />
                      </svg>
                    </button>
                    <button
                      className="nintara-pm__share-btn"
                      aria-label="Copy link"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 1500);
                      }}
                    >
                      {copiedLink ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#3d7cc9"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div> */}

                {/* Star rating */}

                {Number(reviewCount) > 0 && (
                  <StarRating
                    score={ratingScore}
                    count={reviewCount}
                    reviewsText={reviewsText}
                  />
                )}

                {/* Price block */}
                <div
                  className="nintara-pm__price-block"
                  data-testid="momsco-product-main-price"
                >
                  <div className="nintara-pm__price-row">
                    <del className="nintara-pm__price-compare">
                      {compareAtPrice}
                    </del>
                    <ins className="nintara-pm__price-sale">{salePrice}</ins>
                    {savePercent && (
                      <span className="nintara-pm__save-badge">
                        {saveLabel} {savePercent}
                      </span>
                    )}
                  </div>
                  <p className="nintara-pm__mrp-note">{mrpNote}</p>
                </div>

                {/* Variant selector — one labelled pill row per option */}
                {hasVariantSelector && (
                  <div
                    className="nintara-pm__variants"
                    data-testid="momsco-product-main-variants"
                  >
                    {productOptions.map((option: any, optionIdx: number) => {
                      const optionName = String(
                        option?.name ?? `Option ${optionIdx + 1}`
                      ).trim();
                      // Order pills by the variant's `metadata.order_by`
                      // integer. Resolved per value (not per selection) so the
                      // order stays stable as the user picks. Values whose
                      // variant lacks order_by fall to the end, preserving their
                      // original relative order (Array.sort is stable).
                      const orderByForValue = (value: string): number => {
                        const v = productVariants.find(
                          (pv: any) =>
                            String(
                              (pv?.option_values ?? [])[optionIdx] ?? ""
                            ) === value
                        );
                        const raw = getVariantTagValue(v, "order_by");
                        const n = Number(raw);
                        return raw !== "" && Number.isFinite(n)
                          ? n
                          : Number.POSITIVE_INFINITY;
                      };
                      const sortedValues = [...(option?.values ?? [])].sort(
                        (a: any, b: any) =>
                          orderByForValue(String(a?.value ?? a)) -
                          orderByForValue(String(b?.value ?? b))
                      );
                      return (
                        <div
                          key={option?.id ?? optionIdx}
                          className="nintara-pm__variant-group"
                        >
                          <span className="nintara-pm__variant-label">
                            {optionName}:
                            <span className="nintara-pm__variant-selected">
                              {selectedOptionValues[optionIdx]}
                            </span>
                          </span>
                          <div
                            className="nintara-pm__variant-pills"
                            role="radiogroup"
                            aria-label={optionName}
                          >
                            {sortedValues.map((val: any) => {
                              const value = String(val?.value ?? val);
                              const active =
                                String(selectedOptionValues[optionIdx]) ===
                                value;
                              const pillVariant = getVariantForOption(
                                optionIdx,
                                value
                              );
                              // Out-of-stock hint is driven by the resolved
                              // variant's availableForSale flag (falling back to
                              // combination-reachability when no variant matches).
                              const available = pillVariant
                                ? pillVariant.availableForSale !== false
                                : isOptionValueAvailable(optionIdx, value);
                              // Single option group → that group carries the
                              // image, price, and both tags (tag1 top, tag2
                              // bottom). Multi-group keeps the original split:
                              //   group 1 → image + tag1 top
                              //   group 2 → price + tag2 top + tag3 bottom
                              const singleGroup = productOptions.length === 1;
                              // Image on the first option group's pills.
                              const pillImage =
                                optionIdx === 0
                                  ? pillVariant?.imageUrl
                                  : undefined;
                              // Bottom badge: tag2 when single group, else tag3
                              // on the 2nd group only.
                              const bottomTagKey = singleGroup
                                ? "tag2"
                                : optionIdx === 1
                                  ? "tag3"
                                  : "";
                              const bottomTag = bottomTagKey
                                ? getVariantTagValue(pillVariant, bottomTagKey)
                                : "";
                              // Optional variant metadata `title` (e.g.
                              // "Shampoo") — a descriptive sub-label shown under
                              // the option value when present.
                              const metaTitle = getVariantTagValue(
                                pillVariant,
                                "title"
                              );
                              // Price under the title: single group, or the 2nd
                              // group in a multi-group selector.
                              const showPillPrice =
                                (singleGroup || optionIdx === 1) &&
                                pillVariant?.price != null;
                              const pillSale = paiseToRupees(
                                pillVariant?.price
                              );
                              const pillCompareRupees = paiseToRupees(
                                pillVariant?.compare_at_price
                              );
                              const pillPrice = showPillPrice
                                ? formatINR(pillSale)
                                : "";
                              // Strike-through MRP shown beside the sale price
                              // when the variant is actually discounted.
                              const pillCompare =
                                showPillPrice && pillCompareRupees > pillSale
                                  ? formatINR(pillCompareRupees)
                                  : "";
                              // Dynamic discount, derived from that variant's
                              // own price vs. compare-at price.
                              const pillDiscount =
                                pillCompareRupees > pillSale && pillSale > 0
                                  ? Math.round(
                                      ((pillCompareRupees - pillSale) /
                                        pillCompareRupees) *
                                        100
                                    )
                                  : 0;
                              // Top badge: prefer the variant's tag1 metadata
                              // (group 1) / tag2 (group 2); when that tag is
                              // missing, fall back to the dynamic "X% OFF".
                              const topTagKey = `tag${optionIdx + 1}`;
                              const topTag = getVariantTagValue(
                                pillVariant,
                                topTagKey
                              );
                              const topBadge =
                                topTag ||
                                (pillDiscount > 0
                                  ? `${pillDiscount}% off`
                                  : "");
                              // Only the dynamic-discount fallback gets the red
                              // discount styling; real tags keep their tag color.
                              const topBadgeIsDiscount = !topTag && topBadge;
                              return (
                                <button
                                  key={val?.id ?? value}
                                  type="button"
                                  role="radio"
                                  aria-checked={active}
                                  className={
                                    "nintara-pm__variant-pill" +
                                    (active ? " is-active" : "") +
                                    (available ? "" : " is-unavailable") +
                                    (pillImage ? " has-img" : "")
                                  }
                                  onClick={() =>
                                    handleSelectOption(optionIdx, value)
                                  }
                                  data-testid={`momsco-variant-${optionIdx}-${value}`}
                                >
                                  {topBadge && (
                                    <span
                                      className={
                                        "nintara-pm__variant-pill-badge nintara-pm__variant-pill-badge--top " +
                                        (topBadgeIsDiscount
                                          ? "nintara-pm__variant-pill-badge--discount"
                                          : `nintara-pm__variant-pill-badge--tag${optionIdx + 1}`)
                                      }
                                    >
                                      {topBadge}
                                    </span>
                                  )}
                                  {topBadge && (
                                    <span
                                      aria-hidden="true"
                                      className="nintara-pm__variant-pill-badge-spacer"
                                    >
                                      {topBadge}
                                    </span>
                                  )}
                                  <div className="nintara-pm__variant-pill-body">
                                    {pillImage && (
                                      <Image
                                        src={pillImage}
                                        alt={value}
                                        width={56}
                                        height={56}
                                        className="nintara-pm__variant-pill-img"
                                      />
                                    )}
                                    <div className="nintara-pm__variant-pill-info">
                                      <span className="nintara-pm__variant-pill-text">
                                        {value}
                                      </span>
                                      {/* Always rendered (empty when the variant
                                          has no metadata title) so its reserved
                                          line keeps every pill's price aligned. */}
                                      <span className="nintara-pm__variant-pill-subtitle">
                                        {metaTitle}
                                      </span>
                                      {pillPrice && (
                                        <span className="nintara-pm__variant-pill-price">
                                          {pillPrice}
                                          {pillCompare && (
                                            <span className="nintara-pm__variant-pill-compare">
                                              {pillCompare}
                                            </span>
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {bottomTag && (
                                    <span
                                      aria-hidden="true"
                                      className="nintara-pm__variant-pill-badge-spacer"
                                    >
                                      {bottomTag}
                                    </span>
                                  )}
                                  {bottomTag && (
                                    <span
                                      className={`nintara-pm__variant-pill-badge nintara-pm__variant-pill-badge--bottom nintara-pm__variant-pill-badge--${bottomTagKey}`}
                                    >
                                      {bottomTag}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Offer banner */}
                {/* <div className="nintara-pm__offer-banner">
                <OfferIcon />
                <span>Buy <svg any 2 products and get Flat 10% OFF</span>
              </div> */}

                {/* Design variant heading */}
                {/* <h4 className="nintara-pm__variant-heading">
                Design: <span>{activeVariantName}</span>
              </h4> */}

                {/* Variant swatches */}
                {/* <div className="nintara-pm__swatches">
                {variants.map((v) => (
                  <a
                    key={v.name}
                    href={v.href}
                    className={
                      "nintara-pm__swatch-link" + (v.active ? " is-active" : "")
                    }
                  >
                    <Image
                      src={v.imageUrl}
                      alt={v.name}
                      width={70}
                      height={70}
                      className="nintara-pm__swatch-img"
                    />
                  </a>
                ))}
              </div> */}

                {/* Quantity + ATC row */}
                <div className="nintara-pm__buy-row">
                  {/* Quantity selector pill */}
                  <div
                    className="nintara-pm__qty-wrapper"
                    data-testid="momsco-product-qty-wrapper"
                  >
                    <button
                      className="nintara-pm__qty-btn"
                      aria-label="Decrease quantity"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      data-testid="momsco-product-qty-decrease"
                    >
                      <MinusIcon />
                    </button>
                    <input
                      className="nintara-pm__qty-input"
                      type="number"
                      name="quantity"
                      value={quantity}
                      min={1}
                      readOnly
                      aria-label="Product quantity"
                      data-testid="momsco-product-qty-input"
                    />
                    <button
                      className="nintara-pm__qty-btn"
                      aria-label="Increase quantity"
                      onClick={() => handleQuantityChange(1)}
                      data-testid="momsco-product-qty-increase"
                    >
                      <PlusIcon />
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    className={
                      "nintara-pm__atc-btn" +
                      (isAdding ? " is-loading" : "") +
                      (!isSelectedAvailable ? " is-disabled" : "")
                    }
                    onClick={handleAddToCart}
                    disabled={isAdding || !isSelectedAvailable}
                    data-testid="momsco-product-main-add-to-cart"
                  >
                    {!isSelectedAvailable && !isAdding ? (
                      <span>{outOfStockText}</span>
                    ) : isAdding ? (
                      <>
                        <svg
                          className="nintara-pm__atc-spinner"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray="31.4 31.4"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span>{addingText}</span>
                      </>
                    ) : (
                      <span>{addToCartText}</span>
                    )}
                  </button>
                </div>

                {/* Shipping estimate */}
                {/* <div className="nintara-pm__shipping">
                <TruckIcon />
                <span>
                  Get it between: <strong>{shippingEstimate}</strong>
                </span>
              </div> */}

                {/* Watch product video link */}
                {/* <div className="nintara-pm__video-link-row">
                <PlayIcon />
                <a href="#video-sec" className="nintara-pm__video-link">
                  Watch this product in action
                </a>
              </div> */}

                {/* Trust badges strip */}
                <div className="nintara-pm__trust-badges">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <svg
                    width="413"
                    height="62"
                    viewBox="0 0 413 62"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="413" height="62" rx="16" fill="#FFFFFF"></rect>
                    <path
                      d="M31.1968 10.6807L32.101 13.8563L34.9854 12.2508C40.653 9.09289 46.9071 15.347 43.7492 21.0146L42.1437 23.899L45.3193 24.8032C51.5602 26.5806 51.5602 35.4238 45.3193 37.1968L42.1437 38.101L43.7492 40.9854C46.9071 46.653 40.653 52.9071 34.9854 49.7492L32.101 48.1437L31.1968 51.3193C29.4194 57.5602 20.5762 57.5602 18.8032 51.3193L17.899 48.1437L15.0146 49.7492C9.34702 52.9071 3.09288 46.653 6.25083 40.9854L7.85626 38.101L4.68068 37.1968C-1.56023 35.4194 -1.56023 26.5762 4.68068 24.8032L7.85626 23.899L6.25083 21.0146C3.09288 15.347 9.34702 9.09289 15.0146 12.2508L17.899 13.8563L18.8032 10.6807C20.5806 4.43977 29.4238 4.43977 31.1968 10.6807Z"
                      fill="#C8F2D9"
                    ></path>
                    <path
                      d="M32.9998 36.5C32.9998 37.8807 31.8805 39 30.4998 39C29.119 39 27.9998 37.8807 27.9998 36.5C27.9998 35.1193 29.119 34 30.4998 34C31.8805 34 32.9998 35.1193 32.9998 36.5Z"
                      stroke="#092A33"
                      strokeWidth="1.5"
                    ></path>
                    <path
                      d="M22.9998 36.5C22.9998 37.8807 21.8805 39 20.4998 39C19.119 39 17.9998 37.8807 17.9998 36.5C17.9998 35.1193 19.119 34 20.4998 34C21.8805 34 22.9998 35.1193 22.9998 36.5Z"
                      stroke="#092A33"
                      strokeWidth="1.5"
                    ></path>
                    <path
                      d="M27.9998 36.5H22.9998M32.9998 36.5H33.7629C33.9829 36.5 34.0929 36.5 34.1853 36.4885C34.8666 36.4036 35.4033 35.8669 35.4882 35.1855C35.4998 35.0931 35.4998 34.9831 35.4998 34.7632V32C35.4998 28.4101 32.5896 25.5 28.9998 25.5M15.4998 23H25.4998C26.914 23 27.6211 23 28.0604 23.4393C28.4998 23.8787 28.4998 24.5858 28.4998 26V34.5M15.4998 31.75V34C15.4998 34.9346 15.4998 35.4019 15.7007 35.75C15.8324 35.978 16.0217 36.1674 16.2498 36.299C16.5978 36.5 17.0651 36.5 17.9998 36.5"
                      stroke="#092A33"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M15.4998 26H21.4998M15.4998 29H19.4998"
                      stroke="#092A33"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M59.424 28V16.8H62.88C63.9467 16.8 64.8907 17.04 65.712 17.52C66.544 17.9893 67.1947 18.6453 67.664 19.488C68.1333 20.3307 68.368 21.3013 68.368 22.4C68.368 23.488 68.1333 24.4533 67.664 25.296C67.1947 26.1387 66.544 26.8 65.712 27.28C64.8907 27.76 63.9467 28 62.88 28H59.424ZM60.992 26.528H62.88C63.424 26.528 63.9307 26.4267 64.4 26.224C64.8693 26.0107 65.28 25.7173 65.632 25.344C65.9947 24.96 66.272 24.5173 66.464 24.016C66.6667 23.5147 66.768 22.976 66.768 22.4C66.768 21.824 66.6667 21.2853 66.464 20.784C66.272 20.2827 65.9947 19.8453 65.632 19.472C65.28 19.088 64.8693 18.7947 64.4 18.592C63.9307 18.3787 63.424 18.272 62.88 18.272H60.992V26.528ZM73.6545 28.192C72.8758 28.192 72.1878 28.016 71.5905 27.664C70.9932 27.3013 70.5238 26.8053 70.1825 26.176C69.8412 25.5467 69.6705 24.8213 69.6705 24C69.6705 23.1787 69.8412 22.4533 70.1825 21.824C70.5238 21.1947 70.9932 20.704 71.5905 20.352C72.1985 19.9893 72.8918 19.808 73.6705 19.808C74.4065 19.808 75.0518 19.9947 75.6065 20.368C76.1612 20.7307 76.5932 21.2533 76.9025 21.936C77.2225 22.608 77.3825 23.4027 77.3825 24.32H70.9185L71.2065 24.08C71.2065 24.6453 71.3185 25.136 71.5425 25.552C71.7665 25.968 72.0705 26.288 72.4545 26.512C72.8385 26.7253 73.2758 26.832 73.7665 26.832C74.2998 26.832 74.7425 26.7093 75.0945 26.464C75.4572 26.208 75.7398 25.888 75.9425 25.504L77.2545 26.112C77.0412 26.528 76.7638 26.896 76.4225 27.216C76.0812 27.5253 75.6758 27.7653 75.2065 27.936C74.7478 28.1067 74.2305 28.192 73.6545 28.192ZM71.3025 23.36L70.9985 23.12H76.0545L75.7665 23.36C75.7665 22.8907 75.6705 22.4907 75.4785 22.16C75.2865 21.8187 75.0305 21.5627 74.7105 21.392C74.3905 21.2107 74.0332 21.12 73.6385 21.12C73.2545 21.12 72.8812 21.2107 72.5185 21.392C72.1665 21.5627 71.8732 21.8133 71.6385 22.144C71.4145 22.4747 71.3025 22.88 71.3025 23.36ZM78.8841 28V16.8H80.4041V28H78.8841ZM82.6051 28V20H84.1251V28H82.6051ZM83.3731 18.304C83.1278 18.304 82.9145 18.2133 82.7331 18.032C82.5518 17.84 82.4611 17.6213 82.4611 17.376C82.4611 17.12 82.5518 16.9067 82.7331 16.736C82.9145 16.5547 83.1278 16.464 83.3731 16.464C83.6291 16.464 83.8425 16.5547 84.0131 16.736C84.1945 16.9067 84.2851 17.12 84.2851 17.376C84.2851 17.6213 84.1945 17.84 84.0131 18.032C83.8425 18.2133 83.6291 18.304 83.3731 18.304ZM88.8649 28L92.0649 20H93.6489L90.3049 28H88.8649ZM88.7689 28L85.4409 20H86.9929L90.1929 28H88.7689ZM98.1701 28.192C97.3915 28.192 96.7035 28.016 96.1061 27.664C95.5088 27.3013 95.0395 26.8053 94.6981 26.176C94.3568 25.5467 94.1861 24.8213 94.1861 24C94.1861 23.1787 94.3568 22.4533 94.6981 21.824C95.0395 21.1947 95.5088 20.704 96.1061 20.352C96.7141 19.9893 97.4075 19.808 98.1861 19.808C98.9221 19.808 99.5675 19.9947 100.122 20.368C100.677 20.7307 101.109 21.2533 101.418 21.936C101.738 22.608 101.898 23.4027 101.898 24.32H95.4341L95.7221 24.08C95.7221 24.6453 95.8341 25.136 96.0581 25.552C96.2821 25.968 96.5861 26.288 96.9701 26.512C97.3541 26.7253 97.7915 26.832 98.2821 26.832C98.8155 26.832 99.2581 26.7093 99.6101 26.464C99.9728 26.208 100.255 25.888 100.458 25.504L101.77 26.112C101.557 26.528 101.279 26.896 100.938 27.216C100.597 27.5253 100.191 27.7653 99.7221 27.936C99.2635 28.1067 98.7461 28.192 98.1701 28.192ZM95.8181 23.36L95.5141 23.12H100.57L100.282 23.36C100.282 22.8907 100.186 22.4907 99.9941 22.16C99.8021 21.8187 99.5461 21.5627 99.2261 21.392C98.9061 21.2107 98.5488 21.12 98.1541 21.12C97.7701 21.12 97.3968 21.2107 97.0341 21.392C96.6821 21.5627 96.3888 21.8133 96.1541 22.144C95.9301 22.4747 95.8181 22.88 95.8181 23.36ZM104.328 23.696C104.328 22.832 104.493 22.128 104.824 21.584C105.154 21.04 105.581 20.6347 106.104 20.368C106.626 20.1013 107.176 19.968 107.752 19.968V21.408C107.272 21.408 106.813 21.4827 106.376 21.632C105.949 21.7707 105.597 22.0053 105.32 22.336C105.053 22.656 104.92 23.0933 104.92 23.648L104.328 23.696ZM103.4 28V20H104.92V28H103.4ZM109.954 31.392C109.719 31.392 109.458 31.3493 109.17 31.264C108.893 31.1787 108.605 31.0667 108.306 30.928L108.866 29.68C109.101 29.7867 109.303 29.8667 109.474 29.92C109.655 29.9733 109.799 30 109.906 30C110.173 30 110.397 29.9253 110.578 29.776C110.77 29.6267 110.925 29.4187 111.042 29.152L111.97 26.96L114.818 20H116.45L112.658 28.992C112.455 29.4827 112.242 29.9093 112.018 30.272C111.794 30.6347 111.517 30.912 111.186 31.104C110.866 31.296 110.455 31.392 109.954 31.392ZM111.554 28L108.05 20H109.666L112.562 26.944L113.026 28H111.554ZM121.621 28V20H123.141V28H121.621ZM122.389 18.304C122.143 18.304 121.93 18.2133 121.749 18.032C121.567 17.84 121.477 17.6213 121.477 17.376C121.477 17.12 121.567 16.9067 121.749 16.736C121.93 16.5547 122.143 16.464 122.389 16.464C122.645 16.464 122.858 16.5547 123.029 16.736C123.21 16.9067 123.301 17.12 123.301 17.376C123.301 17.6213 123.21 17.84 123.029 18.032C122.858 18.2133 122.645 18.304 122.389 18.304ZM125.368 28V20H126.793L126.889 21.472V28H125.368ZM130.905 28V23.904H132.425V28H130.905ZM130.905 23.904C130.905 23.1787 130.819 22.6293 130.649 22.256C130.489 21.872 130.259 21.6053 129.961 21.456C129.673 21.3067 129.337 21.2267 128.953 21.216C128.302 21.216 127.795 21.4453 127.433 21.904C127.07 22.3627 126.889 23.008 126.889 23.84H126.233C126.233 22.9973 126.355 22.2773 126.601 21.68C126.857 21.072 127.214 20.608 127.673 20.288C128.142 19.968 128.697 19.808 129.337 19.808C129.966 19.808 130.51 19.936 130.969 20.192C131.438 20.448 131.795 20.848 132.041 21.392C132.297 21.9253 132.425 22.6293 132.425 23.504V23.904H130.905ZM58.896 46V44.736C58.896 44.4053 58.9707 44.064 59.12 43.712C59.28 43.3493 59.504 42.992 59.792 42.64C60.0907 42.288 60.4427 41.9627 60.848 41.664L63.008 40.064C63.264 39.8827 63.4933 39.6747 63.696 39.44C63.9093 39.1947 64.0747 38.944 64.192 38.688C64.32 38.4213 64.384 38.16 64.384 37.904C64.384 37.5627 64.2987 37.2533 64.128 36.976C63.9573 36.688 63.7173 36.464 63.408 36.304C63.0987 36.1333 62.7307 36.048 62.304 36.048C61.8987 36.048 61.5413 36.128 61.232 36.288C60.9333 36.4373 60.6827 36.64 60.48 36.896C60.2773 37.152 60.1333 37.424 60.048 37.712L58.432 37.408C58.5493 36.9173 58.7787 36.4587 59.12 36.032C59.4613 35.6053 59.8987 35.264 60.432 35.008C60.9653 34.7413 61.568 34.608 62.24 34.608C63.008 34.608 63.6693 34.752 64.224 35.04C64.7893 35.3173 65.2267 35.7067 65.536 36.208C65.8453 36.6987 66 37.264 66 37.904C66 38.5227 65.8293 39.0933 65.488 39.616C65.1573 40.1387 64.6773 40.6453 64.048 41.136L62.048 42.64C61.6533 42.9387 61.3387 43.248 61.104 43.568C60.88 43.888 60.7413 44.2293 60.688 44.592H66.144V46H58.896ZM67.9433 41.904V40.576H72.7433V41.904H67.9433ZM78.3123 46.192C77.8429 46.192 77.3629 46.1227 76.8723 45.984C76.3923 45.8347 75.9443 45.616 75.5283 45.328C75.1123 45.0293 74.7816 44.6507 74.5363 44.192L75.8643 43.584C76.2056 44.0107 76.5789 44.3253 76.9843 44.528C77.3896 44.72 77.8109 44.816 78.2483 44.816C78.9416 44.816 79.5016 44.608 79.9283 44.192C80.3549 43.776 80.5683 43.2213 80.5683 42.528C80.5683 41.856 80.3603 41.3067 79.9443 40.88C79.5283 40.4533 78.9843 40.24 78.3123 40.24C77.9283 40.24 77.5603 40.3253 77.2083 40.496C76.8563 40.656 76.5843 40.8587 76.3923 41.104L74.9683 40.784L75.5443 34.8H81.6083V36.24H76.9203L76.5843 39.552C76.8829 39.3813 77.2136 39.2427 77.5763 39.136C77.9389 39.0293 78.3069 38.976 78.6803 38.976C79.3523 38.976 79.9496 39.1253 80.4723 39.424C80.9949 39.7227 81.4056 40.1387 81.7043 40.672C82.0136 41.1947 82.1683 41.7973 82.1683 42.48C82.1683 43.216 82.0029 43.8613 81.6723 44.416C81.3416 44.9707 80.8883 45.408 80.3123 45.728C79.7363 46.0373 79.0696 46.192 78.3123 46.192ZM93.6933 46L93.6293 44.512V34.8H95.1333V46H93.6933ZM91.0052 46.192C90.2799 46.192 89.6453 46.016 89.1013 45.664C88.5679 45.312 88.1466 44.8213 87.8372 44.192C87.5386 43.5627 87.3893 42.832 87.3893 42C87.3893 41.1573 87.5386 40.4267 87.8372 39.808C88.1466 39.1787 88.5679 38.688 89.1013 38.336C89.6453 37.984 90.2799 37.808 91.0052 37.808C91.6773 37.808 92.2586 37.984 92.7493 38.336C93.2506 38.688 93.6346 39.1787 93.9013 39.808C94.1679 40.4267 94.3013 41.1573 94.3013 42C94.3013 42.832 94.1679 43.5627 93.9013 44.192C93.6346 44.8213 93.2506 45.312 92.7493 45.664C92.2586 46.016 91.6773 46.192 91.0052 46.192ZM91.3573 44.816C91.8053 44.816 92.1999 44.6987 92.5413 44.464C92.8826 44.2187 93.1493 43.888 93.3413 43.472C93.5333 43.0453 93.6293 42.5547 93.6293 42C93.6293 41.4453 93.5333 40.96 93.3413 40.544C93.1493 40.1173 92.8826 39.7867 92.5413 39.552C92.1999 39.3067 91.7999 39.184 91.3413 39.184C90.8719 39.184 90.4559 39.3067 90.0933 39.552C89.7306 39.7867 89.4479 40.1173 89.2453 40.544C89.0426 40.96 88.9413 41.4453 88.9413 42C88.9413 42.5547 89.0426 43.0453 89.2453 43.472C89.4586 43.888 89.7466 44.2187 90.1093 44.464C90.4719 44.6987 90.8879 44.816 91.3573 44.816ZM102.156 46L102.092 44.608V41.824C102.092 41.2373 102.022 40.7467 101.884 40.352C101.756 39.9573 101.553 39.6587 101.276 39.456C101.009 39.2533 100.652 39.152 100.204 39.152C99.7875 39.152 99.4248 39.2373 99.1155 39.408C98.8168 39.5787 98.5662 39.8453 98.3635 40.208L97.0195 39.696C97.2115 39.3333 97.4515 39.0133 97.7395 38.736C98.0275 38.448 98.3742 38.224 98.7795 38.064C99.1848 37.8933 99.6595 37.808 100.204 37.808C100.961 37.808 101.59 37.9573 102.092 38.256C102.593 38.5547 102.966 38.9867 103.212 39.552C103.468 40.1173 103.59 40.816 103.58 41.648L103.564 46H102.156ZM99.8035 46.192C98.8542 46.192 98.1128 45.9787 97.5795 45.552C97.0568 45.1147 96.7955 44.512 96.7955 43.744C96.7955 42.9227 97.0675 42.2987 97.6115 41.872C98.1662 41.4347 98.9342 41.216 99.9155 41.216H102.14V42.416H100.332C99.5955 42.416 99.0782 42.5333 98.7795 42.768C98.4808 42.992 98.3315 43.3067 98.3315 43.712C98.3315 44.0853 98.4702 44.3787 98.7475 44.592C99.0355 44.7947 99.4302 44.896 99.9315 44.896C100.369 44.896 100.748 44.8053 101.068 44.624C101.388 44.432 101.638 44.1653 101.82 43.824C102.001 43.4827 102.092 43.0933 102.092 42.656H102.62C102.62 43.744 102.385 44.608 101.916 45.248C101.457 45.8773 100.753 46.192 99.8035 46.192ZM106.329 49.392C106.094 49.392 105.833 49.3493 105.545 49.264C105.268 49.1787 104.98 49.0667 104.681 48.928L105.241 47.68C105.476 47.7867 105.678 47.8667 105.849 47.92C106.03 47.9733 106.174 48 106.281 48C106.548 48 106.772 47.9253 106.953 47.776C107.145 47.6267 107.3 47.4187 107.417 47.152L108.345 44.96L111.193 38H112.825L109.033 46.992C108.83 47.4827 108.617 47.9093 108.393 48.272C108.169 48.6347 107.892 48.912 107.561 49.104C107.241 49.296 106.83 49.392 106.329 49.392ZM107.929 46L104.425 38H106.041L108.937 44.944L109.401 46H107.929ZM116.858 46.192C116.292 46.192 115.786 46.1067 115.338 45.936C114.9 45.7653 114.527 45.536 114.218 45.248C113.919 44.96 113.695 44.6347 113.546 44.272L114.858 43.696C115.028 44.0267 115.284 44.2987 115.626 44.512C115.967 44.7253 116.346 44.832 116.762 44.832C117.22 44.832 117.599 44.7467 117.898 44.576C118.196 44.4053 118.346 44.1653 118.346 43.856C118.346 43.5573 118.234 43.3227 118.01 43.152C117.786 42.9813 117.46 42.8427 117.034 42.736L116.282 42.544C115.535 42.3413 114.954 42.0373 114.538 41.632C114.132 41.2267 113.93 40.768 113.93 40.256C113.93 39.4773 114.18 38.8747 114.682 38.448C115.183 38.0213 115.924 37.808 116.906 37.808C117.386 37.808 117.823 37.8773 118.218 38.016C118.623 38.1547 118.964 38.352 119.242 38.608C119.53 38.864 119.732 39.168 119.85 39.52L118.57 40.096C118.442 39.776 118.223 39.5413 117.914 39.392C117.604 39.232 117.242 39.152 116.826 39.152C116.399 39.152 116.063 39.248 115.818 39.44C115.572 39.6213 115.45 39.8773 115.45 40.208C115.45 40.3893 115.551 40.5653 115.754 40.736C115.967 40.896 116.276 41.0293 116.682 41.136L117.546 41.344C118.068 41.472 118.5 41.6693 118.842 41.936C119.183 42.192 119.439 42.4853 119.61 42.816C119.78 43.136 119.866 43.472 119.866 43.824C119.866 44.304 119.732 44.7253 119.466 45.088C119.21 45.44 118.852 45.712 118.394 45.904C117.946 46.096 117.434 46.192 116.858 46.192Z"
                      fill="#092A33"
                    ></path>
                    <path
                      d="M189.197 10.6807L190.101 13.8563L192.985 12.2508C198.653 9.09289 204.907 15.347 201.749 21.0146L200.144 23.899L203.319 24.8032C209.56 26.5806 209.56 35.4238 203.319 37.1968L200.144 38.101L201.749 40.9854C204.907 46.653 198.653 52.9071 192.985 49.7492L190.101 48.1437L189.197 51.3193C187.419 57.5602 178.576 57.5602 176.803 51.3193L175.899 48.1437L173.015 49.7492C167.347 52.9071 161.093 46.653 164.251 40.9854L165.856 38.101L162.681 37.1968C156.44 35.4194 156.44 26.5762 162.681 24.8032L165.856 23.899L164.251 21.0146C161.093 15.347 167.347 9.09289 173.015 12.2508L175.899 13.8563L176.803 10.6807C178.581 4.43977 187.424 4.43977 189.197 10.6807Z"
                      fill="#C8F2D9"
                    ></path>
                    <path
                      d="M182.5 38.5C181.167 39.1224 179.417 39.5 177.5 39.5C176.434 39.5 175.42 39.3833 174.5 39.1726C172.918 38.8103 172.5 37.8796 172.5 36.386V25.614C172.5 24.6291 173.54 23.9527 174.5 24.1726C175.42 24.3833 176.434 24.5 177.5 24.5C179.417 24.5 181.167 24.1224 182.5 23.5C183.833 22.8776 185.583 22.5 187.5 22.5C188.566 22.5 189.58 22.6167 190.5 22.8274C192.082 23.1897 192.5 24.1204 192.5 25.614V36.386C192.5 37.3709 191.46 38.0473 190.5 37.8274C189.58 37.6167 188.566 37.5 187.5 37.5C185.583 37.5 183.833 37.8776 182.5 38.5Z"
                      stroke="#092A33"
                      strokeWidth="1.5"
                    ></path>
                    <path
                      d="M185 31C185 32.3807 183.881 33.5 182.5 33.5C181.119 33.5 180 32.3807 180 31C180 29.6193 181.119 28.5 182.5 28.5C183.881 28.5 185 29.6193 185 31Z"
                      stroke="#092A33"
                      strokeWidth="1.5"
                    ></path>
                    <path
                      d="M176 32L176 32.009"
                      stroke="#092A33"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M189 29.9922L189 30.0012"
                      stroke="#092A33"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M222.192 28.192C221.125 28.192 220.176 27.9467 219.344 27.456C218.512 26.9547 217.861 26.272 217.392 25.408C216.923 24.5333 216.688 23.5307 216.688 22.4C216.688 21.2693 216.923 20.272 217.392 19.408C217.861 18.5333 218.507 17.8507 219.328 17.36C220.149 16.8587 221.093 16.608 222.16 16.608C222.853 16.608 223.515 16.736 224.144 16.992C224.773 17.2373 225.333 17.584 225.824 18.032C226.325 18.4693 226.709 18.9813 226.976 19.568L225.568 20.208C225.365 19.7707 225.088 19.392 224.736 19.072C224.384 18.752 223.984 18.5013 223.536 18.32C223.099 18.1387 222.64 18.048 222.16 18.048C221.413 18.048 220.747 18.2347 220.16 18.608C219.573 18.9813 219.115 19.4933 218.784 20.144C218.453 20.7947 218.288 21.5467 218.288 22.4C218.288 23.2533 218.453 24.0107 218.784 24.672C219.125 25.3333 219.589 25.8507 220.176 26.224C220.773 26.5867 221.451 26.768 222.208 26.768C222.699 26.768 223.163 26.672 223.6 26.48C224.037 26.2773 224.427 26.0053 224.768 25.664C225.12 25.312 225.403 24.912 225.616 24.464L227.024 25.088C226.757 25.696 226.379 26.2347 225.888 26.704C225.397 27.1733 224.832 27.5413 224.192 27.808C223.563 28.064 222.896 28.192 222.192 28.192ZM233.819 28.192C232.731 28.192 231.766 27.9467 230.923 27.456C230.08 26.9653 229.419 26.2827 228.939 25.408C228.47 24.5333 228.235 23.5307 228.235 22.4C228.235 21.2693 228.47 20.272 228.939 19.408C229.419 18.5333 230.075 17.8507 230.907 17.36C231.739 16.8587 232.699 16.608 233.787 16.608C234.875 16.608 235.835 16.8587 236.667 17.36C237.499 17.8507 238.15 18.5333 238.619 19.408C239.088 20.272 239.323 21.2693 239.323 22.4C239.323 23.5307 239.088 24.5333 238.619 25.408C238.15 26.2827 237.499 26.9653 236.667 27.456C235.846 27.9467 234.896 28.192 233.819 28.192ZM233.819 26.752C234.587 26.752 235.264 26.5653 235.851 26.192C236.438 25.8187 236.896 25.3067 237.227 24.656C237.558 24.0053 237.723 23.2533 237.723 22.4C237.723 21.5573 237.552 20.8107 237.211 20.16C236.88 19.4987 236.416 18.9813 235.819 18.608C235.232 18.2347 234.555 18.048 233.787 18.048C233.019 18.048 232.336 18.2347 231.739 18.608C231.142 18.9813 230.672 19.4987 230.331 20.16C230 20.8107 229.835 21.5573 229.835 22.4C229.835 23.2533 230.006 24.0053 230.347 24.656C230.688 25.3067 231.158 25.8187 231.755 26.192C232.363 26.5653 233.051 26.752 233.819 26.752ZM241.44 28V16.8H244.896C245.962 16.8 246.906 17.04 247.728 17.52C248.56 17.9893 249.21 18.6453 249.68 19.488C250.149 20.3307 250.384 21.3013 250.384 22.4C250.384 23.488 250.149 24.4533 249.68 25.296C249.21 26.1387 248.56 26.8 247.728 27.28C246.906 27.76 245.962 28 244.896 28H241.44ZM243.008 26.528H244.896C245.44 26.528 245.946 26.4267 246.416 26.224C246.885 26.0107 247.296 25.7173 247.648 25.344C248.01 24.96 248.288 24.5173 248.48 24.016C248.682 23.5147 248.784 22.976 248.784 22.4C248.784 21.824 248.682 21.2853 248.48 20.784C248.288 20.2827 248.01 19.8453 247.648 19.472C247.296 19.088 246.885 18.7947 246.416 18.592C245.946 18.3787 245.44 18.272 244.896 18.272H243.008V26.528ZM221.968 46L221.904 44.608V41.824C221.904 41.2373 221.835 40.7467 221.696 40.352C221.568 39.9573 221.365 39.6587 221.088 39.456C220.821 39.2533 220.464 39.152 220.016 39.152C219.6 39.152 219.237 39.2373 218.928 39.408C218.629 39.5787 218.379 39.8453 218.176 40.208L216.832 39.696C217.024 39.3333 217.264 39.0133 217.552 38.736C217.84 38.448 218.187 38.224 218.592 38.064C218.997 37.8933 219.472 37.808 220.016 37.808C220.773 37.808 221.403 37.9573 221.904 38.256C222.405 38.5547 222.779 38.9867 223.024 39.552C223.28 40.1173 223.403 40.816 223.392 41.648L223.376 46H221.968ZM219.616 46.192C218.667 46.192 217.925 45.9787 217.392 45.552C216.869 45.1147 216.608 44.512 216.608 43.744C216.608 42.9227 216.88 42.2987 217.424 41.872C217.979 41.4347 218.747 41.216 219.728 41.216H221.952V42.416H220.144C219.408 42.416 218.891 42.5333 218.592 42.768C218.293 42.992 218.144 43.3067 218.144 43.712C218.144 44.0853 218.283 44.3787 218.56 44.592C218.848 44.7947 219.243 44.896 219.744 44.896C220.181 44.896 220.56 44.8053 220.88 44.624C221.2 44.432 221.451 44.1653 221.632 43.824C221.813 43.4827 221.904 43.0933 221.904 42.656H222.432C222.432 43.744 222.197 44.608 221.728 45.248C221.269 45.8773 220.565 46.192 219.616 46.192ZM227.677 46L230.877 38H232.461L229.117 46H227.677ZM227.581 46L224.253 38H225.805L229.005 46H227.581ZM238.359 46L238.295 44.608V41.824C238.295 41.2373 238.225 40.7467 238.087 40.352C237.959 39.9573 237.756 39.6587 237.479 39.456C237.212 39.2533 236.855 39.152 236.407 39.152C235.991 39.152 235.628 39.2373 235.319 39.408C235.02 39.5787 234.769 39.8453 234.567 40.208L233.223 39.696C233.415 39.3333 233.655 39.0133 233.943 38.736C234.231 38.448 234.577 38.224 234.983 38.064C235.388 37.8933 235.863 37.808 236.407 37.808C237.164 37.808 237.793 37.9573 238.295 38.256C238.796 38.5547 239.169 38.9867 239.415 39.552C239.671 40.1173 239.793 40.816 239.783 41.648L239.767 46H238.359ZM236.007 46.192C235.057 46.192 234.316 45.9787 233.783 45.552C233.26 45.1147 232.999 44.512 232.999 43.744C232.999 42.9227 233.271 42.2987 233.815 41.872C234.369 41.4347 235.137 41.216 236.119 41.216H238.343V42.416H236.535C235.799 42.416 235.281 42.5333 234.983 42.768C234.684 42.992 234.535 43.3067 234.535 43.712C234.535 44.0853 234.673 44.3787 234.951 44.592C235.239 44.7947 235.633 44.896 236.135 44.896C236.572 44.896 236.951 44.8053 237.271 44.624C237.591 44.432 237.841 44.1653 238.023 43.824C238.204 43.4827 238.295 43.0933 238.295 42.656H238.823C238.823 43.744 238.588 44.608 238.119 45.248C237.66 45.8773 236.956 46.192 236.007 46.192ZM241.793 46V38H243.313V46H241.793ZM242.561 36.304C242.315 36.304 242.102 36.2133 241.921 36.032C241.739 35.84 241.649 35.6213 241.649 35.376C241.649 35.12 241.739 34.9067 241.921 34.736C242.102 34.5547 242.315 34.464 242.561 34.464C242.817 34.464 243.03 34.5547 243.201 34.736C243.382 34.9067 243.473 35.12 243.473 35.376C243.473 35.6213 243.382 35.84 243.201 36.032C243.03 36.2133 242.817 36.304 242.561 36.304ZM245.54 46V34.8H247.06V46H245.54ZM254.077 46L254.013 44.608V41.824C254.013 41.2373 253.944 40.7467 253.805 40.352C253.677 39.9573 253.475 39.6587 253.197 39.456C252.931 39.2533 252.573 39.152 252.125 39.152C251.709 39.152 251.347 39.2373 251.037 39.408C250.739 39.5787 250.488 39.8453 250.285 40.208L248.941 39.696C249.133 39.3333 249.373 39.0133 249.661 38.736C249.949 38.448 250.296 38.224 250.701 38.064C251.107 37.8933 251.581 37.808 252.125 37.808C252.883 37.808 253.512 37.9573 254.013 38.256C254.515 38.5547 254.888 38.9867 255.133 39.552C255.389 40.1173 255.512 40.816 255.501 41.648L255.485 46H254.077ZM251.725 46.192C250.776 46.192 250.035 45.9787 249.501 45.552C248.979 45.1147 248.717 44.512 248.717 43.744C248.717 42.9227 248.989 42.2987 249.533 41.872C250.088 41.4347 250.856 41.216 251.837 41.216H254.061V42.416H252.253C251.517 42.416 251 42.5333 250.701 42.768C250.403 42.992 250.253 43.3067 250.253 43.712C250.253 44.0853 250.392 44.3787 250.669 44.592C250.957 44.7947 251.352 44.896 251.853 44.896C252.291 44.896 252.669 44.8053 252.989 44.624C253.309 44.432 253.56 44.1653 253.741 43.824C253.923 43.4827 254.013 43.0933 254.013 42.656H254.541C254.541 43.744 254.307 44.608 253.837 45.248C253.379 45.8773 252.675 46.192 251.725 46.192ZM257.415 46V34.8H258.935V44.512L258.855 46H257.415ZM261.559 46.192C260.887 46.192 260.301 46.016 259.799 45.664C259.309 45.312 258.93 44.8213 258.663 44.192C258.397 43.5627 258.263 42.832 258.263 42C258.263 41.1573 258.397 40.4267 258.663 39.808C258.93 39.1787 259.309 38.688 259.799 38.336C260.301 37.984 260.887 37.808 261.559 37.808C262.274 37.808 262.903 37.984 263.447 38.336C263.991 38.688 264.413 39.1787 264.711 39.808C265.021 40.4267 265.175 41.1573 265.175 42C265.175 42.832 265.021 43.5627 264.711 44.192C264.413 44.8213 263.991 45.312 263.447 45.664C262.903 46.016 262.274 46.192 261.559 46.192ZM261.191 44.816C261.671 44.816 262.093 44.6987 262.455 44.464C262.818 44.2187 263.101 43.888 263.303 43.472C263.517 43.0453 263.623 42.5547 263.623 42C263.623 41.4453 263.522 40.96 263.319 40.544C263.117 40.1173 262.834 39.7867 262.471 39.552C262.109 39.3067 261.687 39.184 261.207 39.184C260.77 39.184 260.375 39.3067 260.023 39.552C259.682 39.7867 259.415 40.1173 259.223 40.544C259.031 40.9707 258.935 41.456 258.935 42C258.935 42.5547 259.031 43.0453 259.223 43.472C259.415 43.888 259.682 44.2187 260.023 44.464C260.365 44.6987 260.754 44.816 261.191 44.816ZM266.837 46V34.8H268.357V46H266.837ZM273.998 46.192C273.22 46.192 272.532 46.016 271.934 45.664C271.337 45.3013 270.868 44.8053 270.526 44.176C270.185 43.5467 270.014 42.8213 270.014 42C270.014 41.1787 270.185 40.4533 270.526 39.824C270.868 39.1947 271.337 38.704 271.934 38.352C272.542 37.9893 273.236 37.808 274.014 37.808C274.75 37.808 275.396 37.9947 275.95 38.368C276.505 38.7307 276.937 39.2533 277.246 39.936C277.566 40.608 277.726 41.4027 277.726 42.32H271.262L271.55 42.08C271.55 42.6453 271.662 43.136 271.886 43.552C272.11 43.968 272.414 44.288 272.798 44.512C273.182 44.7253 273.62 44.832 274.11 44.832C274.644 44.832 275.086 44.7093 275.438 44.464C275.801 44.208 276.084 43.888 276.286 43.504L277.598 44.112C277.385 44.528 277.108 44.896 276.766 45.216C276.425 45.5253 276.02 45.7653 275.55 45.936C275.092 46.1067 274.574 46.192 273.998 46.192ZM271.646 41.36L271.342 41.12H276.398L276.11 41.36C276.11 40.8907 276.014 40.4907 275.822 40.16C275.63 39.8187 275.374 39.5627 275.054 39.392C274.734 39.2107 274.377 39.12 273.982 39.12C273.598 39.12 273.225 39.2107 272.862 39.392C272.51 39.5627 272.217 39.8133 271.982 40.144C271.758 40.4747 271.646 40.88 271.646 41.36Z"
                      fill="#092A33"
                    ></path>
                    <path
                      d="M334.197 10.6807L335.101 13.8563L337.985 12.2508C343.653 9.09289 349.907 15.347 346.749 21.0146L345.144 23.899L348.319 24.8032C354.56 26.5806 354.56 35.4238 348.319 37.1968L345.144 38.101L346.749 40.9854C349.907 46.653 343.653 52.9071 337.985 49.7492L335.101 48.1437L334.197 51.3193C332.419 57.5602 323.576 57.5602 321.803 51.3193L320.899 48.1437L318.015 49.7492C312.347 52.9071 306.093 46.653 309.251 40.9854L310.856 38.101L307.681 37.1968C301.44 35.4194 301.44 26.5762 307.681 24.8032L310.856 23.899L309.251 21.0146C306.093 15.347 312.347 9.09289 318.015 12.2508L320.899 13.8563L321.803 10.6807C323.581 4.43977 332.424 4.43977 334.197 10.6807Z"
                      fill="#C8F2D9"
                    ></path>
                    <path
                      d="M318 27V26.25C317.586 26.25 317.25 26.5858 317.25 27H318ZM329.111 41.75C329.525 41.75 329.861 41.4142 329.861 41C329.861 40.5858 329.525 40.25 329.111 40.25V41.75ZM337.25 31.5C337.25 31.9142 337.586 32.25 338 32.25C338.414 32.25 338.75 31.9142 338.75 31.5H337.25ZM338 27H338.75C338.75 26.5858 338.414 26.25 338 26.25V27ZM319.302 39.7447L319.822 39.2049L319.822 39.2049L319.302 39.7447ZM332.536 33.7199L333.021 34.2915V34.2915L332.536 33.7199ZM333.926 33.6174C334.267 33.3822 334.352 32.9152 334.117 32.5742C333.882 32.2332 333.415 32.1474 333.074 32.3826L333.926 33.6174ZM332.536 36.2801L332.05 36.8516H332.05L332.536 36.2801ZM333.074 37.6174C333.415 37.8526 333.882 37.7668 334.117 37.4258C334.352 37.0848 334.267 36.6178 333.926 36.3826L333.074 37.6174ZM329 40.25C328.586 40.25 328.25 40.5858 328.25 41C328.25 41.4142 328.586 41.75 329 41.75V40.25ZM317.25 27V32.4286H318.75V27H317.25ZM326.889 41.75H329.111V40.25H326.889V41.75ZM338.75 31.5V27H337.25V31.5H338.75ZM317.25 32.4286C317.25 34.4269 317.248 36.0039 317.42 37.2347C317.595 38.4901 317.963 39.4957 318.781 40.2846L319.822 39.2049C319.339 38.7386 319.056 38.1064 318.905 37.0276C318.752 35.9243 318.75 34.4708 318.75 32.4286H317.25ZM326.889 40.25C324.773 40.25 323.259 40.2485 322.108 40.0993C320.976 39.9526 320.31 39.6748 319.822 39.2049L318.781 40.2846C319.595 41.0699 320.627 41.4198 321.916 41.5869C323.185 41.7515 324.814 41.75 326.889 41.75V40.25ZM318 27.75H338V26.25H318V27.75ZM332.05 33.1484C331.723 33.4265 331.413 33.6874 331.195 33.9352C330.96 34.2029 330.75 34.5462 330.75 35H332.25C332.25 35.0538 332.212 35.0504 332.322 34.9247C332.45 34.7792 332.658 34.6001 333.021 34.2915L332.05 33.1484ZM333.5 33C333.074 32.3826 333.074 32.3826 333.074 32.3826C333.074 32.3826 333.074 32.3827 333.074 32.3827C333.074 32.3827 333.074 32.3827 333.074 32.3828C333.074 32.3829 333.074 32.383 333.073 32.3831C333.073 32.3834 333.072 32.3838 333.072 32.3842C333.07 32.3852 333.068 32.3866 333.066 32.3883C333.061 32.3918 333.053 32.3969 333.044 32.4033C333.026 32.4162 332.999 32.4348 332.966 32.458C332.9 32.5042 332.809 32.5689 332.707 32.6431C332.507 32.7881 332.245 32.9824 332.05 33.1484L333.021 34.2915C333.169 34.1657 333.39 34 333.587 33.8579C333.682 33.7887 333.768 33.7281 333.829 33.685C333.86 33.6634 333.884 33.6462 333.901 33.6346C333.909 33.6288 333.916 33.6244 333.92 33.6214C333.922 33.62 333.924 33.6189 333.924 33.6182C333.925 33.6179 333.925 33.6176 333.926 33.6175C333.926 33.6174 333.926 33.6174 333.926 33.6174C333.926 33.6174 333.926 33.6174 333.926 33.6174C333.926 33.6174 333.926 33.6174 333.926 33.6174C333.926 33.6174 333.926 33.6174 333.5 33ZM333.021 35.7085C332.658 35.3999 332.45 35.2208 332.322 35.0753C332.212 34.9496 332.25 34.9462 332.25 35H330.75C330.75 35.4538 330.96 35.7971 331.195 36.0648C331.413 36.3126 331.723 36.5735 332.05 36.8516L333.021 35.7085ZM333.5 37C333.926 36.3826 333.926 36.3826 333.926 36.3826C333.926 36.3826 333.926 36.3826 333.926 36.3826C333.926 36.3826 333.926 36.3826 333.926 36.3826C333.926 36.3826 333.926 36.3826 333.926 36.3825C333.925 36.3824 333.925 36.3821 333.924 36.3818C333.924 36.3811 333.922 36.38 333.92 36.3786C333.916 36.3756 333.909 36.3712 333.901 36.3654C333.884 36.3538 333.86 36.3366 333.829 36.315C333.768 36.2719 333.682 36.2113 333.587 36.1421C333.39 36 333.169 35.8343 333.021 35.7085L332.05 36.8516C332.245 37.0176 332.507 37.2119 332.707 37.3569C332.809 37.4311 332.9 37.4958 332.966 37.542C332.999 37.5652 333.026 37.5838 333.044 37.5967C333.053 37.6031 333.061 37.6082 333.066 37.6117C333.068 37.6134 333.07 37.6148 333.072 37.6158C333.072 37.6162 333.073 37.6166 333.073 37.6169C333.074 37.617 333.074 37.6171 333.074 37.6172C333.074 37.6173 333.074 37.6173 333.074 37.6173C333.074 37.6173 333.074 37.6174 333.074 37.6174C333.074 37.6174 333.074 37.6174 333.5 37ZM331.5 35.75H335V34.25H331.5V35.75ZM337.25 38C337.25 39.2426 336.243 40.25 335 40.25V41.75C337.071 41.75 338.75 40.0711 338.75 38H337.25ZM335 35.75C336.243 35.75 337.25 36.7574 337.25 38H338.75C338.75 35.9289 337.071 34.25 335 34.25V35.75ZM329 41.75H335V40.25H329V41.75Z"
                      fill="#092A33"
                    ></path>
                    <path
                      d="M318 27L318.961 24.6923C319.707 22.9026 320.08 22.0077 320.836 21.5038C321.592 21 322.561 21 324.5 21H331.5C333.439 21 334.408 21 335.164 21.5038C335.92 22.0077 336.293 22.9026 337.038 24.6923L338 27"
                      stroke="#092A33"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    ></path>
                    <path
                      d="M328 27V21"
                      stroke="#092A33"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    ></path>
                    <path
                      d="M326 31H330"
                      stroke="#092A33"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    ></path>
                    <path
                      d="M364.376 27V16.648L364.52 15.8H365.912V27H364.376ZM361.896 18.856V17.432C362.131 17.4427 362.403 17.368 362.712 17.208C363.032 17.048 363.352 16.84 363.672 16.584C363.992 16.328 364.275 16.0613 364.52 15.784L365.496 16.84C365.133 17.224 364.755 17.5707 364.36 17.88C363.965 18.1893 363.56 18.4347 363.144 18.616C362.739 18.7973 362.323 18.8773 361.896 18.856ZM372.792 27.192C371.928 27.192 371.16 26.9467 370.488 26.456C369.816 25.9547 369.288 25.272 368.904 24.408C368.531 23.5333 368.344 22.5307 368.344 21.4C368.344 20.2693 368.531 19.272 368.904 18.408C369.288 17.5333 369.811 16.8507 370.472 16.36C371.144 15.8587 371.918 15.608 372.792 15.608C373.667 15.608 374.435 15.8587 375.096 16.36C375.768 16.8507 376.296 17.5333 376.68 18.408C377.064 19.272 377.256 20.2693 377.256 21.4C377.256 22.5307 377.064 23.5333 376.68 24.408C376.307 25.272 375.784 25.9547 375.112 26.456C374.44 26.9467 373.667 27.192 372.792 27.192ZM372.792 25.752C373.358 25.752 373.859 25.5653 374.296 25.192C374.744 24.8187 375.091 24.3067 375.336 23.656C375.582 23.0053 375.704 22.2533 375.704 21.4C375.704 20.5467 375.582 19.7947 375.336 19.144C375.091 18.4827 374.744 17.9653 374.296 17.592C373.859 17.2187 373.358 17.032 372.792 17.032C372.227 17.032 371.726 17.2187 371.288 17.592C370.851 17.9653 370.51 18.4827 370.264 19.144C370.019 19.7947 369.896 20.5467 369.896 21.4C369.896 22.2533 370.019 23.0107 370.264 23.672C370.51 24.3227 370.851 24.8347 371.288 25.208C371.726 25.5707 372.227 25.752 372.792 25.752ZM378.85 22.904V21.576H383.65V22.904H378.85ZM391.475 27L391.411 25.512V15.8H392.915V27H391.475ZM388.786 27.192C388.061 27.192 387.427 27.016 386.883 26.664C386.349 26.312 385.928 25.8213 385.618 25.192C385.32 24.5627 385.171 23.832 385.171 23C385.171 22.1573 385.32 21.4267 385.618 20.808C385.928 20.1787 386.349 19.688 386.883 19.336C387.427 18.984 388.061 18.808 388.786 18.808C389.459 18.808 390.04 18.984 390.531 19.336C391.032 19.688 391.416 20.1787 391.683 20.808C391.949 21.4267 392.083 22.1573 392.083 23C392.083 23.832 391.949 24.5627 391.683 25.192C391.416 25.8213 391.032 26.312 390.531 26.664C390.04 27.016 389.459 27.192 388.786 27.192ZM389.139 25.816C389.587 25.816 389.981 25.6987 390.323 25.464C390.664 25.2187 390.931 24.888 391.123 24.472C391.315 24.0453 391.411 23.5547 391.411 23C391.411 22.4453 391.315 21.96 391.123 21.544C390.931 21.1173 390.664 20.7867 390.323 20.552C389.981 20.3067 389.581 20.184 389.123 20.184C388.653 20.184 388.237 20.3067 387.875 20.552C387.512 20.7867 387.229 21.1173 387.027 21.544C386.824 21.96 386.723 22.4453 386.723 23C386.723 23.5547 386.824 24.0453 387.027 24.472C387.24 24.888 387.528 25.2187 387.891 25.464C388.253 25.6987 388.669 25.816 389.139 25.816ZM399.937 27L399.873 25.608V22.824C399.873 22.2373 399.803 21.7467 399.665 21.352C399.537 20.9573 399.334 20.6587 399.057 20.456C398.79 20.2533 398.433 20.152 397.985 20.152C397.569 20.152 397.206 20.2373 396.897 20.408C396.598 20.5787 396.347 20.8453 396.145 21.208L394.801 20.696C394.993 20.3333 395.233 20.0133 395.521 19.736C395.809 19.448 396.155 19.224 396.561 19.064C396.966 18.8933 397.441 18.808 397.985 18.808C398.742 18.808 399.371 18.9573 399.873 19.256C400.374 19.5547 400.747 19.9867 400.993 20.552C401.249 21.1173 401.371 21.816 401.361 22.648L401.345 27H399.937ZM397.585 27.192C396.635 27.192 395.894 26.9787 395.361 26.552C394.838 26.1147 394.577 25.512 394.577 24.744C394.577 23.9227 394.849 23.2987 395.393 22.872C395.947 22.4347 396.715 22.216 397.697 22.216H399.921V23.416H398.113C397.377 23.416 396.859 23.5333 396.561 23.768C396.262 23.992 396.113 24.3067 396.113 24.712C396.113 25.0853 396.251 25.3787 396.529 25.592C396.817 25.7947 397.211 25.896 397.713 25.896C398.15 25.896 398.529 25.8053 398.849 25.624C399.169 25.432 399.419 25.1653 399.601 24.824C399.782 24.4827 399.873 24.0933 399.873 23.656H400.401C400.401 24.744 400.166 25.608 399.697 26.248C399.238 26.8773 398.534 27.192 397.585 27.192ZM404.11 30.392C403.875 30.392 403.614 30.3493 403.326 30.264C403.049 30.1787 402.761 30.0667 402.462 29.928L403.022 28.68C403.257 28.7867 403.459 28.8667 403.63 28.92C403.811 28.9733 403.955 29 404.062 29C404.329 29 404.553 28.9253 404.734 28.776C404.926 28.6267 405.081 28.4187 405.198 28.152L406.126 25.96L408.974 19H410.606L406.814 27.992C406.611 28.4827 406.398 28.9093 406.174 29.272C405.95 29.6347 405.673 29.912 405.342 30.104C405.022 30.296 404.611 30.392 404.11 30.392ZM405.71 27L402.206 19H403.822L406.718 25.944L407.182 27H405.71ZM362.984 41.696C362.984 40.832 363.149 40.128 363.48 39.584C363.811 39.04 364.237 38.6347 364.76 38.368C365.283 38.1013 365.832 37.968 366.408 37.968V39.408C365.928 39.408 365.469 39.4827 365.032 39.632C364.605 39.7707 364.253 40.0053 363.976 40.336C363.709 40.656 363.576 41.0933 363.576 41.648L362.984 41.696ZM362.056 46V38H363.576V46H362.056ZM371.17 46.192C370.391 46.192 369.703 46.016 369.106 45.664C368.509 45.3013 368.039 44.8053 367.698 44.176C367.357 43.5467 367.186 42.8213 367.186 42C367.186 41.1787 367.357 40.4533 367.698 39.824C368.039 39.1947 368.509 38.704 369.106 38.352C369.714 37.9893 370.407 37.808 371.186 37.808C371.922 37.808 372.567 37.9947 373.122 38.368C373.677 38.7307 374.109 39.2533 374.418 39.936C374.738 40.608 374.898 41.4027 374.898 42.32H368.434L368.722 42.08C368.722 42.6453 368.834 43.136 369.058 43.552C369.282 43.968 369.586 44.288 369.97 44.512C370.354 44.7253 370.791 44.832 371.282 44.832C371.815 44.832 372.258 44.7093 372.61 44.464C372.973 44.208 373.255 43.888 373.458 43.504L374.77 44.112C374.557 44.528 374.279 44.896 373.938 45.216C373.597 45.5253 373.191 45.7653 372.722 45.936C372.263 46.1067 371.746 46.192 371.17 46.192ZM368.818 41.36L368.514 41.12H373.57L373.282 41.36C373.282 40.8907 373.186 40.4907 372.994 40.16C372.802 39.8187 372.546 39.5627 372.226 39.392C371.906 39.2107 371.549 39.12 371.154 39.12C370.77 39.12 370.397 39.2107 370.034 39.392C369.682 39.5627 369.389 39.8133 369.154 40.144C368.93 40.4747 368.818 40.88 368.818 41.36ZM379.488 46.192C378.688 46.192 378.069 45.9893 377.632 45.584C377.194 45.168 376.976 44.576 376.976 43.808V35.504H378.496V43.584C378.496 43.9787 378.592 44.2827 378.784 44.496C378.986 44.6987 379.274 44.8 379.648 44.8C379.754 44.8 379.872 44.7787 380 44.736C380.128 44.6933 380.282 44.608 380.464 44.48L381.04 45.664C380.762 45.8453 380.496 45.9787 380.24 46.064C379.994 46.1493 379.744 46.192 379.488 46.192ZM375.616 39.312V38H380.768V39.312H375.616ZM387.98 46L387.884 44.528V38H389.388V46H387.98ZM382.348 42.096V38H383.868V42.096H382.348ZM383.868 42.096C383.868 42.8107 383.948 43.36 384.108 43.744C384.279 44.128 384.514 44.3947 384.812 44.544C385.111 44.6933 385.447 44.7733 385.82 44.784C386.471 44.784 386.978 44.5547 387.34 44.096C387.703 43.6373 387.884 42.992 387.884 42.16H388.54C388.54 43.0027 388.412 43.728 388.156 44.336C387.911 44.9333 387.559 45.392 387.1 45.712C386.642 46.032 386.082 46.192 385.42 46.192C384.802 46.192 384.258 46.064 383.788 45.808C383.33 45.552 382.972 45.152 382.716 44.608C382.471 44.064 382.348 43.36 382.348 42.496V42.096H383.868ZM392.437 41.696C392.437 40.832 392.602 40.128 392.933 39.584C393.264 39.04 393.69 38.6347 394.213 38.368C394.736 38.1013 395.285 37.968 395.861 37.968V39.408C395.381 39.408 394.922 39.4827 394.485 39.632C394.058 39.7707 393.706 40.0053 393.429 40.336C393.162 40.656 393.029 41.0933 393.029 41.648L392.437 41.696ZM391.509 46V38H393.029V46H391.509ZM397.087 46V38H398.511L398.607 39.472V46H397.087ZM402.623 46V41.904H404.143V46H402.623ZM402.623 41.904C402.623 41.1787 402.538 40.6293 402.367 40.256C402.207 39.872 401.978 39.6053 401.679 39.456C401.391 39.3067 401.055 39.2267 400.671 39.216C400.021 39.216 399.514 39.4453 399.151 39.904C398.789 40.3627 398.607 41.008 398.607 41.84H397.951C397.951 40.9973 398.074 40.2773 398.319 39.68C398.575 39.072 398.933 38.608 399.391 38.288C399.861 37.968 400.415 37.808 401.055 37.808C401.685 37.808 402.229 37.936 402.687 38.192C403.157 38.448 403.514 38.848 403.759 39.392C404.015 39.9253 404.143 40.6293 404.143 41.504V41.904H402.623ZM408.92 46.192C408.355 46.192 407.848 46.1067 407.4 45.936C406.963 45.7653 406.589 45.536 406.28 45.248C405.981 44.96 405.757 44.6347 405.608 44.272L406.92 43.696C407.091 44.0267 407.347 44.2987 407.688 44.512C408.029 44.7253 408.408 44.832 408.824 44.832C409.283 44.832 409.661 44.7467 409.96 44.576C410.259 44.4053 410.408 44.1653 410.408 43.856C410.408 43.5573 410.296 43.3227 410.072 43.152C409.848 42.9813 409.523 42.8427 409.096 42.736L408.344 42.544C407.597 42.3413 407.016 42.0373 406.6 41.632C406.195 41.2267 405.992 40.768 405.992 40.256C405.992 39.4773 406.243 38.8747 406.744 38.448C407.245 38.0213 407.987 37.808 408.968 37.808C409.448 37.808 409.885 37.8773 410.28 38.016C410.685 38.1547 411.027 38.352 411.304 38.608C411.592 38.864 411.795 39.168 411.912 39.52L410.632 40.096C410.504 39.776 410.285 39.5413 409.976 39.392C409.667 39.232 409.304 39.152 408.888 39.152C408.461 39.152 408.125 39.248 407.88 39.44C407.635 39.6213 407.512 39.8773 407.512 40.208C407.512 40.3893 407.613 40.5653 407.816 40.736C408.029 40.896 408.339 41.0293 408.744 41.136L409.608 41.344C410.131 41.472 410.563 41.6693 410.904 41.936C411.245 42.192 411.501 42.4853 411.672 42.816C411.843 43.136 411.928 43.472 411.928 43.824C411.928 44.304 411.795 44.7253 411.528 45.088C411.272 45.44 410.915 45.712 410.456 45.904C410.008 46.096 409.496 46.192 408.92 46.192Z"
                      fill="#092A33"
                    ></path>
                  </svg>
                </div>

                {/* Available offers accordion */}
                <div
                  className="nintara-pm__offers-accordion"
                  data-testid="momsco-product-offers-accordion"
                >
                  <button
                    className="nintara-pm__offers-toggle"
                    onClick={() => setOffersOpen(!offersOpen)}
                    aria-expanded={offersOpen}
                    data-testid="momsco-product-offers-toggle"
                  >
                    <span className="nintara-pm__offers-label">
                      {offerLabel}
                    </span>
                    <span
                      className="nintara-pm__offers-count"
                      data-testid="momsco-product-offers-count"
                    >
                      {discountsLoading
                        ? "Loading offers..."
                        : `${offers.length} ${offersCountSuffix}`}
                    </span>
                    <AccordionChevron open={offersOpen} />
                  </button>

                  {offersOpen && (
                    <div className="nintara-pm__offers-body">
                      {discountsLoading ? (
                        <div className="flex items-center justify-center py-4 gap-2">
                          <span className="w-4 h-4 border-2 border-[#092a33] border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm text-gray-500">
                            Loading offers...
                          </span>
                        </div>
                      ) : (
                        offers.map((offer, idx) => (
                          <div key={idx} className="nintara-pm__offer-item">
                            <span className="nintara-pm__offer-desc">
                              {offer.description}
                            </span>
                            {offer.code && (
                              <span
                                className="nintara-pm__offer-code group relative cursor-pointer hover:underline"
                                onClick={() => {
                                  navigator.clipboard.writeText(offer.code!);
                                  setCopiedCode(offer.code!);
                                  setTimeout(() => setCopiedCode(null), 1500);
                                }}
                              >
                                <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-[#01464f] px-2 py-1 text-sm text-white opacity-0 transition-opacity hidden md:block md:group-hover:opacity-100">
                                  {copiedCode === offer.code
                                    ? "Copied!"
                                    : "Click to copy"}
                                </span>
                                {offer.code}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* end info-left */}
              <div className="nintara-pm__info-right">
                <div className="nintara-pm__share">
                  <button
                    className="nintara-pm__share-btn nintara-pm__share-btn--toggle"
                    aria-label="Share"
                    onClick={() =>
                      setShareOpen((prev) => {
                        if (!prev) {
                          setTimeout(() => setShareOpen(false), 5000);
                        }
                        return !prev;
                      })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="31"
                      viewBox="0 0 34 31"
                      fill="none"
                    >
                      <path
                        d="M23 10.5C23.7745 10.6606 24.3588 10.9286 24.8284 11.3759C26 12.4918 26 14.2879 26 17.88C26 21.4721 26 23.2681 24.8284 24.3841C23.6569 25.5 21.7712 25.5 18 25.5H16C12.2288 25.5 10.3431 25.5 9.17157 24.3841C8 23.2681 8 21.4721 8 17.88C8 14.2879 8 12.4918 9.17157 11.3759C9.64118 10.9286 10.2255 10.6606 11 10.5"
                        stroke="#092A33"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      ></path>
                      <path
                        d="M17.0253 5.50052L17 17.5M17.0253 5.50052C16.8627 5.49379 16.6991 5.55191 16.5533 5.67492C15.6469 6.44006 14 8.42886 14 8.42886M17.0253 5.50052C17.1711 5.50657 17.3162 5.56476 17.4468 5.67508C18.3531 6.44037 20 8.42886 20 8.42886"
                        stroke="#092A33"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </button>
                  <div
                    className={`nintara-pm__share-dropdown${shareOpen ? " is-open" : ""}`}
                  >
                    <button
                      className="nintara-pm__share-btn"
                      aria-label="Share on Facebook"
                      onClick={() =>
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                          "_blank"
                        )
                      }
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </button>
                    <button
                      className="nintara-pm__share-btn"
                      aria-label="Share on Instagram"
                      onClick={() =>
                        window.open(
                          "https://www.instagram.com/themomsco",
                          "_blank"
                        )
                      }
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          ry="5"
                        />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </button>
                    <button
                      className="nintara-pm__share-btn"
                      aria-label="Share on WhatsApp"
                      onClick={() =>
                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(title + " " + window.location.href)}`,
                          "_blank"
                        )
                      }
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 0 1-4.264-1.227l-.306-.182-2.87.852.852-2.87-.182-.306A8 8 0 1 1 12 20z" />
                      </svg>
                    </button>
                    <button
                      className="nintara-pm__share-btn"
                      aria-label="Copy link"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 1500);
                      }}
                    >
                      {copiedLink ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#3d7cc9"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {/* end info-right */}
            </div>
            {/* end info */}
          </div>
        </div>
      </div>

      {/* Lightbox overlay */}
      {lightboxOpen && (
        <div
          className="nintara-pm__lightbox"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-label="Image lightbox"
        >
          <div
            className="nintara-pm__lightbox-inner"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerCancel}
          >
            <button
              className="nintara-pm__lightbox-close"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              &times;
            </button>
            <Image
              src={images[currentImageIdx].url || FALLBACK_IMG}
              alt={images[currentImageIdx].alt}
              width={1000}
              height={1000}
              className="nintara-pm__lightbox-img"
              draggable={false}
              unoptimized={
                !images[currentImageIdx].url ||
                images[currentImageIdx].url === FALLBACK_IMG
              }
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
              }}
            />
            <div className="nintara-pm__lightbox-thumbs">
              {images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  className={
                    "nintara-pm__lightbox-thumb" +
                    (idx === currentImageIdx ? " is-active" : "")
                  }
                  onClick={() => setCurrentImageIdx(idx)}
                >
                  <Image
                    src={img.url || FALLBACK_IMG}
                    alt={img.alt}
                    width={70}
                    height={70}
                    unoptimized={!img.url || img.url === FALLBACK_IMG}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky mobile ATC bar — sits above MobileBottomBar */}
      <div className="nintara-pm__mobile-atc-bar">
        <button
          className={
            "nintara-pm__mobile-atc-btn" +
            (isAdding ? " is-loading" : "") +
            (!isSelectedAvailable ? " is-disabled" : "")
          }
          onClick={handleAddToCart}
          disabled={isAdding || !isSelectedAvailable}
        >
          <span className="nintara-pm__mobile-atc-text">
            {!isSelectedAvailable
              ? outOfStockText
              : isAdding
                ? "Adding..."
                : "Add to cart"}
          </span>
          <span className="nintara-pm__mobile-atc-prices">
            <del className="nintara-pm__mobile-atc-compare">
              {compareAtPrice}
            </del>
            <span className="nintara-pm__mobile-atc-sale">{salePrice}</span>
          </span>
        </button>
      </div>
    </section>
  );
}
