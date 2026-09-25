"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useId,
} from "react";
import Image from "next/image";
import {
  LovedByParentsCarouselProps,
  LovedByParentsProduct,
  DEFAULT_HEADING,
} from "../types";
import { paiseToRupees, formatINR } from "@/utils/apiTransforms";
import { useCartStore } from "@shopkit/cart";
import { cacheCartImage } from "@/utils/cartImageCache";
import { cacheLocalCartItem } from "@/utils/localCartCache";
import { useProductRatings, normalizeProductId } from "@/hooks";
import "../style.css";

const FALLBACK_IMG = "/assets/momsco/svg/image-not-available.svg";

/**
 * Transform API collection products into the LovedByParentsProduct shape
 */
function transformApiProducts(apiProducts: any[]): LovedByParentsProduct[] {
  return apiProducts.map((p: any, idx: number) => {
    const price = paiseToRupees(p.price);
    const compareAt = p.compare_at_price
      ? paiseToRupees(p.compare_at_price)
      : 0;
    const savePercent =
      compareAt > 0 ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

    // Get image from images array or fallback
    const mainImage =
      Array.isArray(p.images) && p.images.length > 0
        ? p.images.find((img: any) => img.is_main) || p.images[0]
        : p.image || null;
    const imageUrl = mainImage?.url || mainImage?.src || FALLBACK_IMG;
    const imageAlt = mainImage?.alt_text || p.title || "Product";

    // PDP link with variant deep-link (?variant=<id>) — same convention as
    // ProductMain / ProductGrid. Uses the real variant id only (no product-id
    // fallback, which _variantId carries for the cart).
    const handle = p.handle || "";
    const linkVariantId = p.variant?.id ?? p.variants?.[0]?.id ?? "";
    const href = handle
      ? `/products/${handle}${linkVariantId ? `?variant=${linkVariantId}` : ""}`
      : "#";

    return {
      id: Number(p.id) || idx + 1,
      handle: p.handle || "",
      title: p.title || "",
      image: imageUrl,
      imageAlt,
      salePrice: formatINR(price),
      comparePrice: compareAt > 0 ? formatINR(compareAt) : "",
      rating: 0,
      reviewCount: 0,
      saveBadge: savePercent > 0 ? `save ${savePercent}%` : undefined,
      _variantId:
        p.variant?.id ?? p.variants?.[0]?.id ?? String(p.id ?? idx + 1),
      _productId: String(p.id ?? ""),
      _priceAmount: price,
      _href: href,
    } as LovedByParentsProduct & {
      _variantId: string;
      _productId: string;
      _priceAmount: number;
      _href: string;
    };
  });
}

export function V1({ data, settings, className }: LovedByParentsCarouselProps) {
  const rawData = data as any;
  const heading = rawData?.heading ?? settings?.heading ?? DEFAULT_HEADING;

  const baseProducts: LovedByParentsProduct[] = useMemo(() => {
    // API shape: data.data[0].data.products (array of collections, pick first)
    const collections = rawData?.data;
    const firstCollection = Array.isArray(collections) ? collections[0] : null;
    const apiProducts = firstCollection?.data?.products;
    if (Array.isArray(apiProducts) && apiProducts.length > 0) {
      return transformApiProducts(apiProducts);
    }
    return [];
  }, [rawData]);

  const productIds = useMemo(
    () =>
      baseProducts
        .map((p: any) => p._productId || String(p.id))
        .filter(Boolean),
    [baseProducts]
  );
  const { ratings } = useProductRatings(productIds);

  const products = useMemo(
    () =>
      baseProducts.map((p: any) => {
        const lookupId = p._productId || String(p.id);
        const normalized = normalizeProductId(lookupId);
        const live = ratings[normalized];
        console.log(
          "⭐🔗 [LBP V1] product:",
          p.title,
          "lookupId:",
          lookupId,
          "normalized:",
          normalized,
          "live rating:",
          live
        );
        if (!live) {
          return p;
        }
        return { ...p, rating: live.score, reviewCount: live.reviewCount };
      }),
    [baseProducts, ratings]
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const [totalDots, setTotalDots] = useState(1);
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());
  const [shareOpenId, setShareOpenId] = useState<number | null>(null);
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());
  const [copiedLinkId, setCopiedLinkId] = useState<number | null>(null);

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent, product: LovedByParentsProduct) => {
      e.preventDefault();
      e.stopPropagation();
      const prod = product as any;
      if (loadingIds.has(product.id)) {
        return;
      }

      setLoadingIds((prev) => new Set(prev).add(product.id));
      try {
        const variantId = prod._variantId || String(product.id);
        const priceRupees = prod._priceAmount || 0;

        cacheCartImage(variantId, product.image, String(product.id));
        cacheLocalCartItem(variantId, {
          productId: String(product.id),
          title: product.title,
          price: { amount: priceRupees * 100, currencyCode: "INR" },
          image: product.image,
        });

        await useCartStore.getState().addItem({
          id: variantId,
          productId: String(product.id),
          variantId,
          title: product.title,
          handle: product.handle,
          price: { amount: priceRupees * 100, currencyCode: "INR" },
          image: product.image,
          quantity: 1,
        } as any);

        if (process.env.NEXT_PUBLIC_KWIKCART_DISABLE === "true") {
          useCartStore.getState().openCart();
        }
      } catch (err) {
        console.error("[LovedByParents] Add to cart failed:", err);
      } finally {
        setLoadingIds((prev) => {
          const next = new Set(prev);
          next.delete(product.id);
          return next;
        });
      }
    },
    [loadingIds]
  );

  /**
   * Get visible card count based on viewport width
   */
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

  /**
   * Get card width + gap for scroll math
   */
  const getScrollStep = useCallback((): number => {
    const track = trackRef.current;
    if (!track) {
      return 340;
    }
    const firstCard = track.querySelector(
      ".nintara-lbp__card"
    ) as HTMLElement | null;
    if (!firstCard) {
      return 340;
    }
    return firstCard.offsetWidth + 20;
  }, []);

  /**
   * Update arrow disabled state and active dot
   */
  const syncState = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const step = getScrollStep();
    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, products.length - visibleCount);
    const dotCount = maxIndex + 1;
    const currentIndex = Math.min(Math.round(scrollLeft / step), maxIndex);

    setAtStart(scrollLeft <= 2);
    setAtEnd(scrollLeft >= maxScroll - 2);
    setActiveDot(currentIndex);
    setTotalDots(dotCount);
  }, [getScrollStep, getVisibleCount, products.length]);

  /**
   * Scroll to a specific index
   */
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

  /**
   * Handle next arrow click
   */
  const handleNext = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const step = getScrollStep();
    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, products.length - visibleCount);
    const currentIndex = Math.round(track.scrollLeft / step);
    const nextIndex = Math.min(currentIndex + 1, maxIndex);
    scrollToIndex(nextIndex);
  }, [getScrollStep, getVisibleCount, products.length, scrollToIndex]);

  /**
   * Handle prev arrow click
   */
  const handlePrev = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const step = getScrollStep();
    const currentIndex = Math.round(track.scrollLeft / step);
    const prevIndex = Math.max(currentIndex - 1, 0);
    scrollToIndex(prevIndex);
  }, [getScrollStep, scrollToIndex]);

  /**
   * Handle dot click
   */
  const handleDotClick = useCallback(
    (index: number) => {
      scrollToIndex(index);
    },
    [scrollToIndex]
  );

  /**
   * Toggle wishlist for a product
   */
  const toggleWishlist = useCallback((productId: number) => {
    setWishlisted((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);

  /**
   * Attach scroll listener and resize handler
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const onScroll = () => syncState();
    const onResize = () => {
      if (window.innerWidth < 768 && track.scrollLeft > 0) {
        track.scrollLeft = 0;
      }
      syncState();
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    syncState();

    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [syncState]);

  /**
   * Render star rating — proportional fill (e.g. 4.7 renders as 4 full stars
   * plus a 5th star filled 70% from left, exact to the decimal).
   */
  const lbpStarsId = useId();
  const LBP_STAR_PATH =
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
  // Explicit hex avoids `currentColor` inheritance ambiguity inside <stop>.
  // Keep in sync with --nintara-lbp-star-color in style.css.
  const LBP_STAR_FILL = "#e5c645";

  const renderStars = (rating: number, productId: string | number) => {
    console.log(
      "⭐🎯 [LBP V1] renderStars called for productId:",
      productId,
      "rating:",
      rating
    );
    return [1, 2, 3, 4, 5].map((i) => {
      const fillPct = Math.max(0, Math.min(1, rating - (i - 1))) * 100;
      console.log(
        "⭐⭐ [LBP V1] star",
        i,
        "fillPct:",
        fillPct + "%",
        "(rating:",
        rating + ")"
      );
      // Per-product unique gradient ID so multiple cards don't collide
      const gradId = `lbp-star-${lbpStarsId}-${productId}-${i}`;
      return (
        <svg
          key={i}
          className="nintara-lbp__star"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
              <stop offset={`${fillPct}%`} stopColor={LBP_STAR_FILL} />
              <stop offset={`${fillPct}%`} stopColor="transparent" />
            </linearGradient>
          </defs>
          <path d={LBP_STAR_PATH} fill={LBP_STAR_FILL} opacity="0.3" />
          <path d={LBP_STAR_PATH} fill={`url(#${gradId})`} />
        </svg>
      );
    });
  };

  /**
   * Arrow SVG (chevron)
   */
  const ArrowSvg = ({ direction }: { direction: "prev" | "next" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="nintara-lbp__arrow-svg"
    >
      {direction === "prev" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 6 15 12 9 18" />
      )}
    </svg>
  );

  /**
   * Heart SVG for wishlist
   */
  const ShareIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="34"
      height="31"
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

  const HeartSvg = ({ active }: { active: boolean }) => (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      className="nintara-lbp__heart-svg"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  return (
    <section className={"nintara-lbp" + (className ? " " + className : "")}>
      {/* Doodle decorations */}
      <Image
        src="/assets/momsco/images/product/Doodle-1.png"
        alt=""
        width={150}
        height={180}
        className="nintara-lbp__doodle nintara-lbp__doodle--left"
        aria-hidden="true"
      />
      <Image
        src="/assets/momsco/images/product/Doodle-2.png"
        alt=""
        width={150}
        height={180}
        className="nintara-lbp__doodle nintara-lbp__doodle--right"
        aria-hidden="true"
      />
      <div className="nintara-lbp__container">
        {/* Section heading */}
        <div className="nintara-lbp__heading-block">
          <h3 className="nintara-lbp__heading">{heading}</h3>
        </div>

        {/* Previous arrow */}
        {products.length > 4 && (
          <button
            className={
              "nintara-lbp__arrow nintara-lbp__arrow--prev" +
              (atStart ? " nintara-lbp__arrow--disabled" : "")
            }
            onClick={handlePrev}
            aria-label="Previous slide"
            disabled={atStart}
          >
            <ArrowSvg direction="prev" />
          </button>
        )}

        {/* Carousel wrapper */}
        <div className="nintara-lbp__carousel">
          {products.length === 0 && (
            <div className="nintara-lbp__empty">
              No products available right now.
            </div>
          )}
          {/* Scrollable track */}
          <div className="nintara-lbp__track" ref={trackRef}>
            {products.map((product) => {
              const badgeLabel =
                product.badge?.label?.trim() || "Parent choise";
              const badgeBg =
                product.badge?.type === "parents-choice"
                  ? "#c6d4f6"
                  : "#e5c645";

              return (
                <div key={product.id} className="nintara-lbp__card">
                  <div className="nintara-lbp__card-inner">
                    {/* Wishlist button */}
                    {/* <button
                    className={
                      "nintara-lbp__wishlist" +
                      (wishlisted.has(product.id)
                        ? " nintara-lbp__wishlist--active"
                        : "")
                    }
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Add to wishlist"
                  >
                    <HeartSvg active={wishlisted.has(product.id)} />
                  </button> */}

                    {/* Product image */}
                    <div className="nintara-lbp__img-wrap">
                      <a
                        href={(product as any)._href}
                        className="nintara-lbp__media"
                      >
                        <Image
                          src={product.image || FALLBACK_IMG}
                          alt={product.imageAlt}
                          width={720}
                          height={720}
                          className="nintara-lbp__img"
                          loading="lazy"
                          unoptimized={
                            !product.image || product.image === FALLBACK_IMG
                          }
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              FALLBACK_IMG;
                          }}
                        />
                      </a>
                      {/* Share button */}
                      <div
                        className="nintara-fp__share-wrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="nintara-fp__share-btn nintara-fp__share-btn--toggle"
                          aria-label="Share"
                          onClick={() => {
                            const isOpening = shareOpenId !== product.id;
                            setShareOpenId(isOpening ? product.id : null);
                            if (isOpening) {
                              setTimeout(() => setShareOpenId(null), 5000);
                            }
                          }}
                        >
                          <ShareIcon />
                        </button>
                        <div
                          className={`nintara-fp__share-dropdown${shareOpenId === product.id ? " is-open" : ""}`}
                        >
                          <button
                            className="nintara-fp__share-btn"
                            aria-label="Share on Facebook"
                            onClick={() =>
                              window.open(
                                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + (product as any)._href)}`,
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
                            className="nintara-fp__share-btn"
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
                            className="nintara-fp__share-btn"
                            aria-label="Share on WhatsApp"
                            onClick={() =>
                              window.open(
                                `https://wa.me/?text=${encodeURIComponent(product.title + " " + window.location.origin + (product as any)._href)}`,
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
                            className="nintara-fp__share-btn"
                            aria-label="Copy link"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                window.location.origin + (product as any)._href
                              );
                              setCopiedLinkId(product.id);
                              setTimeout(() => {
                                setCopiedLinkId(null);
                                setShareOpenId(null);
                              }, 1500);
                            }}
                          >
                            {copiedLinkId === product.id ? (
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

                    {/* Product info */}
                    <div className="nintara-lbp__info">
                      {/* Title */}
                      <h4 className="nintara-lbp__title">
                        <a
                          href={(product as any)._href}
                          className="nintara-lbp__title-link"
                        >
                          {product.title}
                        </a>
                      </h4>

                      <div className="nintara-lbp__review">
                        <span className="nintara-lbp__stars">
                          {renderStars(product.rating, product.id)}
                        </span>
                        <span className="nintara-lbp__review-count text-[#092A33]">
                          {product.reviewCount} reviews
                        </span>
                      </div>

                      {/* Prices */}
                      <div className="nintara-lbp__prices">
                        <span className="nintara-lbp__price-sale">
                          {product.salePrice}
                        </span>
                        <s className="nintara-lbp__price-compare">
                          {product.comparePrice}
                        </s>
                        {product.saveBadge && (
                          <span className="nintara-lbp__save-badge">
                            {product.saveBadge}
                          </span>
                        )}
                      </div>
                      {/* Unit price */}
                      {product.unitPrice && (
                        <span className="nintara-lbp__unit-price">
                          {product.unitPrice}
                        </span>
                      )}

                      {/* Add to cart */}
                      <button
                        className="nintara-lbp__atc"
                        type="button"
                        disabled={loadingIds.has(product.id)}
                        onClick={(e) => handleAddToCart(e, product)}
                        aria-label={`Add ${product.title} to cart`}
                      >
                        {/* <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="nintara-lbp__atc-icon"
                          aria-hidden="true"
                        >
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg> */}
                        {loadingIds.has(product.id)
                          ? "Adding..."
                          : "Add to cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next arrow */}
        {products.length > 4 && (
          <button
            className={
              "nintara-lbp__arrow nintara-lbp__arrow--next" +
              (atEnd ? " nintara-lbp__arrow--disabled" : "")
            }
            onClick={handleNext}
            aria-label="Next slide"
            disabled={atEnd}
          >
            <ArrowSvg direction="next" />
          </button>
        )}

        {/* Pagination dots
        <div className="nintara-lbp__dots">
          {Array.from({ length: totalDots }, (_, i) => (
            <button
              key={i}
              className={
                "nintara-lbp__dot" +
                (i === activeDot ? " nintara-lbp__dot--active" : "")
              }
              onClick={() => handleDotClick(i)}
              aria-label={"Go to slide " + (i + 1)}
            />
          ))}
        </div> */}
      </div>
    </section>
  );
}
