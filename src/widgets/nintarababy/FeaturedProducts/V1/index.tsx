"use client";

import React, {
  memo,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useId,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@shopkit/cart";
import { FeaturedProductsProps } from "../types";
import { type FeaturedProduct } from "../types";
import {
  paiseToRupees,
  formatINR,
  isIResponse,
  isCollectionEntries,
  extractCollectionProducts,
} from "@/utils/apiTransforms";
import { cacheCartImage } from "@/utils/cartImageCache";
import { cacheLocalCartItem } from "@/utils/localCartCache";
import { useProductRatings, normalizeProductId } from "@/hooks";
import "../style.css";

const FALLBACK_IMG = "/assets/momsco/svg/image-not-available.svg";

/**
 * FeaturedProducts V1 Component
 *
 * A product grid section cloned from nintarababy.in.
 * Displays 4 product cards in a row (desktop) or 2 columns (mobile).
 * Each card has product image, name, star rating, prices, and ATC button.
 *
 * Animation notes (from Phase 2):
 * - ATC button: NO hover color change (stays transparent bg / #01464f text)
 * - View All button: color transitions from #01464f to #092a33 on hover
 * - Product images: no zoom on hover
 * - Product titles: no color change on hover
 */
/** Transform raw API response into FeaturedProduct[] */
function transformApiProducts(rawData: any): FeaturedProduct[] {
  if (!isIResponse(rawData) || !Array.isArray(rawData.data)) {
    return [];
  }

  let products: any[] = [];
  if (isCollectionEntries(rawData.data)) {
    products = extractCollectionProducts(rawData.data);
  } else {
    products = rawData.data;
  }

  return products
    .filter((p: any) => p.title)
    .map((p: any) => {
      const salePaise = Number(p.price) || 0;
      const comparePaise = Number(p.compare_at_price) || salePaise;
      const saleRupees = paiseToRupees(salePaise);
      const compareRupees = paiseToRupees(comparePaise);
      const discount =
        compareRupees > saleRupees && saleRupees > 0
          ? Math.round(((compareRupees - saleRupees) / compareRupees) * 100)
          : 0;
      // Deep-link to the product's variant (?variant=<id>) — same convention as
      // ProductMain / ProductGrid so the PDP opens on the variant shown here.
      const variantId = p.variant?.id ?? p.variants?.[0]?.id ?? "";
      // Per-product subtitle from product.metadata.subtitle.value — same source
      // as ProductGrid / ProductMain so cards stay consistent across the site.
      const subtitle: string | undefined =
        typeof p.metadata?.subtitle?.value === "string" &&
        p.metadata.subtitle.value
          ? p.metadata.subtitle.value
          : undefined;
      return {
        id: String(p.id ?? p.handle ?? ""),
        handle: p.handle ?? "",
        name: p.title ?? "",
        subtitle,
        url: p.handle
          ? `/products/${p.handle}${variantId ? `?variant=${variantId}` : ""}`
          : "#",
        image: {
          src: p.image_url || p.images?.[0]?.url || "",
          alt: p.title ?? "",
          width: 600,
          height: 600,
        },
        rating: {
          score: p.average_rating ? Number(p.average_rating) : 0,
          reviewCount: p.rating_count ? Number(p.rating_count) : 0,
        },
        price: {
          compareAt: compareRupees > saleRupees ? formatINR(compareRupees) : "",
          sale: formatINR(saleRupees),
          savePercent: discount > 0 ? `${discount}%` : undefined,
        },
        available: true,
        _variantId: variantId,
        _priceAmount: saleRupees,
        product_type: p.product_type || p.productType || "",
      } as FeaturedProduct & {
        _variantId: string;
        _priceAmount: number;
        product_type: string;
      };
    });
}

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: FeaturedProductsProps) {
  // Find the collection matching settings.collectionHandle from the API response
  const matchedCollection = useMemo(() => {
    const collections = (data as any)?.data;
    if (!Array.isArray(collections)) {
      return null;
    }
    const handle = settings?.collectionHandle;
    if (handle) {
      return collections.find((c: any) => c.handle === handle) ?? null;
    }
    return collections[0] ?? null;
  }, [data, settings?.collectionHandle]);

  // Build filtered data containing only the matched collection for product transform
  const filteredData = useMemo(() => {
    if (!matchedCollection) {
      return data;
    }
    return { ...(data as any), data: [matchedCollection] };
  }, [data, matchedCollection]);

  const apiProducts = useMemo(
    () => transformApiProducts(filteredData),
    [filteredData]
  );
  const productLimit = settings?.productLimit ?? 4;
  const baseProducts = useMemo(() => {
    const source =
      apiProducts.length > 0 ? apiProducts : ((data as any)?.products ?? []);
    return source.slice(0, productLimit);
  }, [apiProducts, data, productLimit]);

  const productIds = useMemo(
    () =>
      baseProducts.map((p: FeaturedProduct) => String(p.id)).filter(Boolean),
    [baseProducts]
  );
  const { ratings } = useProductRatings(productIds);

  const products = useMemo(() => {
    return baseProducts.map((p: FeaturedProduct) => {
      const normId = normalizeProductId(String(p.id));
      const live = ratings[normId];
      if (!live) {
        return p;
      }
      return {
        ...p,
        rating: { score: live.score, reviewCount: live.reviewCount },
      };
    });
  }, [baseProducts, ratings]);

  const heading =
    matchedCollection?.title ??
    matchedCollection?.seo_title ??
    settings?.heading ??
    "Bestsellers";
  const subtitle =
    matchedCollection?.description ??
    matchedCollection?.seo_description ??
    settings?.subtitle ??
    "";
  const collectionHandle =
    matchedCollection?.handle ?? matchedCollection?.seo_handle;
  const viewAllLink =
    (collectionHandle ? `/collections/${collectionHandle}` : null) ??
    settings?.viewAllLink ??
    "/collections/shop-all";
  const viewAllText = settings?.viewAllText ?? "View all";
  const savePrefix = settings?.savePrefix ?? "Save ";
  const isCarousel = products.length > 4;

  // Carousel state
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const getVisibleCount = useCallback((): number => {
    if (typeof window === "undefined") {
      return 4;
    }
    const w = window.innerWidth;
    if (w < 768) {
      return 2;
    }
    if (w <= 1024) {
      return 3;
    }
    return 4;
  }, []);

  const getScrollStep = useCallback((): number => {
    const track = trackRef.current;
    if (!track) {
      return 340;
    }
    const firstCard = track.querySelector(
      ".nintara-fp__card"
    ) as HTMLElement | null;
    if (!firstCard) {
      return 340;
    }
    return firstCard.offsetWidth + 25; // card width + gap
  }, []);

  const syncState = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setAtStart(scrollLeft <= 2);
    setAtEnd(scrollLeft >= maxScroll - 2);
    setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) {
        return;
      }
      const step = getScrollStep();
      track.scrollTo({ left: index * step, behavior: "smooth" });
    },
    [getScrollStep]
  );

  const handleNext = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const step = getScrollStep();
    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, products.length - visibleCount);
    const currentIndex = Math.round(track.scrollLeft / step);
    scrollToIndex(Math.min(currentIndex + 1, maxIndex));
  }, [getScrollStep, getVisibleCount, products.length, scrollToIndex]);

  const handlePrev = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const step = getScrollStep();
    const currentIndex = Math.round(track.scrollLeft / step);
    scrollToIndex(Math.max(currentIndex - 1, 0));
  }, [getScrollStep, scrollToIndex]);

  useEffect(() => {
    if (!isCarousel) {
      return;
    }
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const onScroll = () => syncState();
    const onResize = () => syncState();

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    syncState();

    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [isCarousel, syncState]);

  return (
    <section
      className={`nintara-fp ${className ?? ""}`}
      aria-label="Featured Products"
      data-testid="momsco-home-bestseller-section"
    >
      <div className="nintara-fp__container">
        {/* Section headings */}
        <div
          className="nintara-fp__heading-wrap"
          data-testid="momsco-home-bestseller-heading"
        >
          <h3 className="nintara-fp__heading">{heading}</h3>
          <h4 className="nintara-fp__subtitle">{subtitle}</h4>
        </div>

        {isCarousel ? (
          <div className="nintara-fp__carousel-wrapper">
            {/* Prev arrow */}
            <button
              className={`nintara-fp__arrow nintara-fp__arrow--prev${atStart ? " nintara-fp__arrow--disabled" : ""}`}
              onClick={handlePrev}
              aria-label="Previous slide"
              disabled={atStart}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="nintara-fp__arrow-svg"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Scrollable track */}
            <div className="nintara-fp__carousel">
              <div className="nintara-fp__track" ref={trackRef}>
                {products.map((product: FeaturedProduct) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    savePrefix={savePrefix}
                  />
                ))}
              </div>
            </div>

            {/* Next arrow */}
            <button
              className={`nintara-fp__arrow nintara-fp__arrow--next${atEnd ? " nintara-fp__arrow--disabled" : ""}`}
              onClick={handleNext}
              aria-label="Next slide"
              disabled={atEnd}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="nintara-fp__arrow-svg"
              >
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>

            {/* Small centered scroll indicator for touch devices */}
            <div className="nintara-fp__scrollbar-hint">
              <div
                className="nintara-fp__scrollbar-thumb"
                style={{
                  width: "40%",
                  left: `${scrollProgress * 60}%`,
                }}
              />
            </div>
          </div>
        ) : (
          /* Static grid for <= 4 products */
          <div className="nintara-fp__grid">
            {products.map((product: FeaturedProduct) => (
              <ProductCard
                key={product.id}
                product={product}
                savePrefix={savePrefix}
              />
            ))}
          </div>
        )}

        {/* View all button */}
        <div className="nintara-fp__view-all-wrap">
          <Link href={viewAllLink} className="nintara-fp__view-all">
            {viewAllText}
          </Link>
        </div>
      </div>
    </section>
  );
});

/**
 * Individual product card
 */
const ProductCard = memo(function ProductCard({
  product,
  savePrefix,
}: {
  product: FeaturedProduct;
  savePrefix: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const getAbsoluteProductUrl = useCallback(() => {
    if (typeof window === "undefined") {
      return product.url;
    }
    return product.url.startsWith("http")
      ? product.url
      : `${window.location.origin}${product.url}`;
  }, [product.url]);

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!product.available || isLoading) {
        return;
      }
      setIsLoading(true);

      try {
        const prod = product as any;
        const variantId = prod._variantId || product.id;
        const priceRupees = prod._priceAmount || 0;

        cacheCartImage(variantId, product.image.src, product.id);
        cacheLocalCartItem(variantId, {
          productId: product.id,
          title: product.name,
          price: { amount: priceRupees * 100, currencyCode: "INR" },
          image: product.image.src,
        });

        await useCartStore.getState().addItem({
          id: variantId,
          productId: product.id,
          variantId,
          title: product.name,
          handle: prod.handle ?? "",
          price: { amount: priceRupees * 100, currencyCode: "INR" },
          image: product.image.src,
          quantity: 1,
          product_type: prod.product_type || undefined,
        } as any);

        if (process.env.NEXT_PUBLIC_KWIKCART_DISABLE === "true") {
          useCartStore.getState().openCart();
        }
      } catch (err) {
        console.error("[FeaturedProducts] Add to cart failed:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [product, isLoading]
  );

  return (
    <div
      className="nintara-fp__card"
      id={product.id}
      data-testid="momsco-home-bestseller-card"
    >
      {/* Product image */}
      <div className="nintara-fp__img-wrap">
        <Link href={product.url} className="nintara-fp__img-link">
          <Image
            src={product.image.src || FALLBACK_IMG}
            alt={product.image.alt}
            width={product.image.width}
            height={product.image.height}
            className="nintara-fp__img"
            loading="lazy"
            unoptimized={!product.image.src}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
            }}
          />
        </Link>
        {/* Share button */}
        <div
          className="nintara-fp__share-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="nintara-fp__share-btn nintara-fp__share-btn--toggle"
            aria-label={`Share ${product.name}`}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShareOpen((prev) => {
                if (!prev) {
                  setTimeout(() => setShareOpen(false), 5000);
                }
                return !prev;
              });
            }}
          >
            <ShareIcon />
          </button>

          <div
            className={`nintara-fp__share-dropdown${shareOpen ? " is-open" : ""}`}
          >
            <button
              className="nintara-fp__share-btn"
              aria-label="Share on Facebook"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const shareUrl = getAbsoluteProductUrl();
                if (typeof window !== "undefined") {
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                    "_blank"
                  );
                }
                setShareOpen(false);
              }}
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
              className="nintara-fp__share-btn"
              aria-label="Share on Instagram"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (typeof window !== "undefined") {
                  window.open("https://www.instagram.com/themomsco", "_blank");
                }
                setShareOpen(false);
              }}
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
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </button>

            <button
              className="nintara-fp__share-btn"
              aria-label="Share on WhatsApp"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const shareUrl = getAbsoluteProductUrl();
                if (typeof window !== "undefined") {
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(`${product.name} ${shareUrl}`)}`,
                    "_blank"
                  );
                }
                setShareOpen(false);
              }}
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
              className="nintara-fp__share-btn"
              aria-label="Copy link"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const shareUrl = getAbsoluteProductUrl();
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                  navigator.clipboard.writeText(shareUrl);
                }
                setCopiedLink(true);
                setTimeout(() => {
                  setCopiedLink(false);
                  setShareOpen(false);
                }, 1500);
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
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Text area */}
      <Link href={product.url} className="nintara-fp__text-link">
        <div className="nintara-fp__text-wrap">
          <h2
            className="nintara-fp__product-title"
            data-testid="momsco-home-bestseller-title"
          >
            {product.name}
          </h2>

          {product.price.savePercent && (
            <span
              className="nintara-fp__save-badge"
              data-testid="momsco-home-bestseller-save-badge"
            >
              {savePrefix}
              {product.price.savePercent}
            </span>
          )}

          {product.subtitle && (
            <p
              className="nintara-fp__product-subtitle"
              data-testid="momsco-home-bestseller-subtitle"
            >
              {product.subtitle}
            </p>
          )}

          {/* TODO: Reviews disabled — client will provide the reviews sheet later */}

          <div className="nintara-fp__rating">
            <StarRating score={product.rating.score} />
            <span className="nintara-fp__review-count">
              {product.rating.reviewCount} reviews
            </span>
          </div>

          {/* Price */}
          <div className="nintara-fp__price">
            <span className="nintara-fp__compare-price">
              {product.price.compareAt}
            </span>
            <span
              className="nintara-fp__sale-price"
              data-testid="momsco-home-bestseller-price"
            >
              {product.price.sale}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="nintara-fp__atc-wrap">
        <button
          className={`nintara-fp__atc-btn ${!product.available ? "nintara-fp__atc-btn--disabled" : ""} ${isLoading ? "nintara-fp__atc-btn--loading" : ""}`}
          onClick={handleAddToCart}
          disabled={!product.available || isLoading}
          aria-label={`Add ${product.name} to cart`}
          data-testid="momsco-home-bestseller-atc-btn"
        >
          <span
            className={`nintara-fp__atc-text ${isLoading ? "nintara-fp__atc-text--hidden" : ""}`}
          >
            {/* <CartIcon disabled={!product.available} /> */}
            <span className="text-[14px]"> ADD TO CART</span>
          </span>
          {isLoading && (
            <span className="nintara-fp__atc-spinner">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="31.4 31.4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          )}
        </button>
      </div>
    </div>
  );
});

/**
 * Star rating display — proportional fill (e.g. 4.7 renders as 4 full stars
 * plus a 5th star filled 70% from left, exact to the decimal).
 */
const FP_STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

const StarRating = memo(function StarRating({ score }: { score: number }) {
  const reactId = useId();
  return (
    <span className="nintara-fp__stars" aria-label={`${score} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fillPct = Math.max(0, Math.min(1, score - (i - 1))) * 100;
        const gradId = `fp-star-${reactId}-${i}`;
        return (
          <svg
            key={i}
            className="nintara-fp__star"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
                <stop offset={`${fillPct}%`} stopColor="currentColor" />
                <stop offset={`${fillPct}%`} stopColor="transparent" />
              </linearGradient>
            </defs>
            <path d={FP_STAR_PATH} fill="currentColor" opacity="0.3" />
            <path d={FP_STAR_PATH} fill={`url(#${gradId})`} />
          </svg>
        );
      })}
    </span>
  );
});

/**
 * Share icon SVG (upload arrow out of tray) for product card
 * Positioned at bottom-right of product image
 */
const ShareIcon = memo(function ShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 34 31"
      fill="none"
      className="nintara-fp__share-icon"
    >
      <path
        d="M23 10.5C23.7745 10.6606 24.3588 10.9286 24.8284 11.3759C26 12.4918 26 14.2879 26 17.88C26 21.4721 26 23.2681 24.8284 24.3841C23.6569 25.5 21.7712 25.5 18 25.5H16C12.2288 25.5 10.3431 25.5 9.17157 24.3841C8 23.2681 8 21.4721 8 17.88C8 14.2879 8 12.4918 9.17157 11.3759C9.64118 10.9286 10.2255 10.6606 11 10.5"
        stroke="var(--nintara-fp-share-stroke)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17.0253 5.50052L17 17.5M17.0253 5.50052C16.8627 5.49379 16.6991 5.55191 16.5533 5.67492C15.6469 6.44006 14 8.42886 14 8.42886M17.0253 5.50052C17.1711 5.50657 17.3162 5.56476 17.4468 5.67508C18.3531 6.44037 20 8.42886 20 8.42886"
        stroke="var(--nintara-fp-share-stroke)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

/**
 * Cart icon SVG for the ATC button
 */
const CartIcon = memo(function CartIcon({ disabled }: { disabled: boolean }) {
  const strokeColor = disabled
    ? "var(--nintara-fp-atc-disabled-color)"
    : "var(--nintara-fp-atc-color)";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 17 18"
      fill="none"
      className="nintara-fp__cart-icon"
    >
      <path
        d="M5.5 12L12.0401 11.455C14.0864 11.2845 14.5458 10.8375 14.7726 8.79665L15.25 4.5"
        stroke={strokeColor}
        strokeWidth="1.125"
        strokeLinecap="round"
      />
      <path
        d="M4 4.5H16"
        stroke={strokeColor}
        strokeWidth="1.125"
        strokeLinecap="round"
      />
      <circle cx="4" cy="15" r="1.5" stroke={strokeColor} strokeWidth="1.125" />
      <circle
        cx="12.25"
        cy="15"
        r="1.5"
        stroke={strokeColor}
        strokeWidth="1.125"
      />
      <path
        d="M5.5 15L10.75 15"
        stroke={strokeColor}
        strokeWidth="1.125"
        strokeLinecap="round"
      />
      <path
        d="M1 1.5H1.7245C2.43301 1.5 3.0506 1.96845 3.22244 2.6362L5.45389 11.3074C5.56666 11.7456 5.47015 12.2098 5.19118 12.5712L4.4741 13.5"
        stroke={strokeColor}
        strokeWidth="1.125"
        strokeLinecap="round"
      />
    </svg>
  );
});

export { V1 as default };
