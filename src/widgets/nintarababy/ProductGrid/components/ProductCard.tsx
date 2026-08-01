"use client";

import React, {
  memo,
  useState,
  useCallback,
  useEffect,
  useRef,
  useId,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@shopkit/cart";
import { type ProductGridProduct } from "../types";
import { cacheCartImage } from "@/utils/cartImageCache";
import { cacheLocalCartItem } from "@/utils/localCartCache";

const FALLBACK_IMG = "/assets/momsco/svg/image-not-available.svg";

/**
 * Individual product card with scroll-reveal animation
 */
export const ProductCard = memo(function ProductCard({
  product,
  addToCartText,
  outOfStockText,
  reviewsText,
  savePrefix,
}: {
  product: ProductGridProduct;
  index: number;
  addToCartText: string;
  outOfStockText: string;
  reviewsText: string;
  savePrefix: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.id ?? null
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  /* Scroll-reveal via IntersectionObserver */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) {
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!product.available || isLoading) {
        return;
      }
      setIsLoading(true);

      try {
        const prod = product as any;
        const variantId = prod._variantId || selectedVariant || product.id;
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
        console.error("[ProductGrid] Add to cart failed:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [product, isLoading, selectedVariant]
  );

  const handleVariantSelect = useCallback((variantId: string) => {
    setSelectedVariant(variantId);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`nintara-pg__card ${
        revealed ? "nintara-pg__card--visible" : "nintara-pg__card--offscreen"
      }`}
      data-testid="momsco-collection-product-card"
    >
      {/* Product image area */}
      <div className="nintara-pg__img-area">
        <Link
          href={product.url}
          className="nintara-pg__img-link"
          data-testid="momsco-collection-product-img-link"
        >
          <div className="nintara-pg__img-container">
            <Image
              src={product.image.src || FALLBACK_IMG}
              alt={product.image.alt}
              width={product.image.width}
              height={product.image.height}
              className="nintara-pg__img nintara-pg__img--main"
              loading="lazy"
              sizes="(max-width: 767px) 50vw, (max-width: 1024px) 50vw, 26vw"
              unoptimized={!product.image.src}
              data-testid="momsco-collection-product-image"
            />
            {product.hoverImage && (
              <Image
                src={product.hoverImage.src}
                alt={product.hoverImage.alt}
                width={product.hoverImage.width}
                height={product.hoverImage.height}
                className="nintara-pg__img nintara-pg__img--hover"
                loading="lazy"
                sizes="(max-width: 767px) 50vw, (max-width: 1024px) 50vw, 25vw"
              />
            )}
            <div className="nintara-pg__overlay" />
          </div>
        </Link>
        <div className="nintara-pg__share" onClick={(e) => e.stopPropagation()}>
          <button
            className="nintara-pg__share-btn nintara-pg__share-btn--toggle"
            aria-label="Share"
            data-testid="momsco-collection-share-btn"
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
              className="nintara-pg__share-svg"
              viewBox="0 0 34 31"
              fill="none"
            >
              <path
                d="M23 10.5C23.7745 10.6606 24.3588 10.9286 24.8284 11.3759C26 12.4918 26 14.2879 26 17.88C26 21.4721 26 23.2681 24.8284 24.3841C23.6569 25.5 21.7712 25.5 18 25.5H16C12.2288 25.5 10.3431 25.5 9.17157 24.3841C8 23.2681 8 21.4721 8 17.88C8 14.2879 8 12.4918 9.17157 11.3759C9.64118 10.9286 10.2255 10.6606 11 10.5"
                stroke="#092A33"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M17.0253 5.50052L17 17.5M17.0253 5.50052C16.8627 5.49379 16.6991 5.55191 16.5533 5.67492C15.6469 6.44006 14 8.42886 14 8.42886M17.0253 5.50052C17.1711 5.50657 17.3162 5.56476 17.4468 5.67508C18.3531 6.44037 20 8.42886 20 8.42886"
                stroke="#092A33"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div
            className={`nintara-pg__share-dropdown${shareOpen ? " is-open" : ""}`}
          >
            <button
              className="nintara-pg__share-btn"
              aria-label="Share on Facebook"
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + product.url)}`,
                  "_blank"
                )
              }
            >
              <svg
                className="nintara-pg-share-btns"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </button>
            <button
              className="nintara-pg__share-btn"
              aria-label="Share on Instagram"
              onClick={async () => {
                const shareUrl = window.location.origin + product.url;
                try {
                  await navigator.clipboard.writeText(shareUrl);
                } catch {
                  // clipboard blocked — still open IG below
                }
                window.open("https://www.instagram.com/themomsco", "_blank");
              }}
            >
              <svg
                className="nintara-pg-share-btns"
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
              className="nintara-pg__share-btn"
              aria-label="Share on WhatsApp"
              onClick={() =>
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(product.name + " " + window.location.origin + product.url)}`,
                  "_blank"
                )
              }
            >
              <svg
                className="nintara-pg-share-btns"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 0 1-4.264-1.227l-.306-.182-2.87.852.852-2.87-.182-.306A8 8 0 1 1 12 20z" />
              </svg>
            </button>
            <button
              className="nintara-pg__share-btn"
              aria-label="Copy link"
              onClick={() => {
                navigator.clipboard.writeText(
                  window.location.origin + product.url
                );
                setCopiedLink(true);
                setTimeout(() => {
                  setCopiedLink(false);
                  setShareOpen(false);
                }, 1500);
              }}
            >
              {copiedLink ? (
                <svg
                  className="nintara-pg-share-btns"
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
                  className="nintara-pg-share-btns"
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

      {/* Product info */}
      <div className="nintara-pg__info">
        <div className="nintara-pg__info-inner">
          {/* Title */}
          <h3
            className="nintara-pg__title"
            data-testid="momsco-collection-product-title"
          >
            <Link
              href={product.url}
              className="nintara-pg__title-link"
              data-testid="momsco-collection-product-title-link"
            >
              {product.name}
            </Link>
          </h3>
          {product.subtitle && (
            <p
              className="text-[12px] text-[#666] font-normal mt-[2px] line-clamp-1"
              data-testid="momsco-collection-product-subtitle"
            >
              {product.subtitle}
            </p>
          )}

          <div className="nintara-pg__rating">
            <StarRating score={product.rating.score} />
            <span
              className="nintara-pg__review-count"
              data-testid="momsco-collection-product-reviews"
            >
              {product.rating.reviewCount} {reviewsText}
            </span>
          </div>

          {/* Price */}
          <div className="nintara-pg__price">
            <ins
              className="nintara-pg__price-current"
              data-testid="momsco-collection-product-price"
            >
              {product.price.current}
            </ins>
            {product.price.original && (
              <del className="nintara-pg__price-original">
                {product.price.original}
              </del>
            )}
            {product.price.savePercent && (
              <span className="nintara-pg__save-badge">
                {savePrefix}
                {product.price.savePercent}
              </span>
            )}
          </div>

          {/* ATC wrapper */}
          <div className="nintara-pg__atc-wrap">
            {/* Size variants */}
            {product.variants && product.variants.length > 0 && (
              <ul className="nintara-pg__sizes">
                {product.variants.map((v) => (
                  <li
                    key={v.id}
                    className={`nintara-pg__size ${
                      selectedVariant === v.id
                        ? "nintara-pg__size--selected"
                        : ""
                    } ${!v.available ? "nintara-pg__size--oos" : ""}`}
                    onClick={() => handleVariantSelect(v.id)}
                  >
                    {v.label}
                  </li>
                ))}
              </ul>
            )}

            {/* ATC button */}
            <button
              className={`nintara-pg__atc-btn ${
                !product.available ? "nintara-pg__atc-btn--disabled" : ""
              } ${isLoading ? "nintara-pg__atc-btn--loading" : ""}`}
              onClick={handleAddToCart}
              disabled={!product.available || isLoading}
              aria-label={
                product.available
                  ? `Add ${product.name} to cart`
                  : `${product.name} is out of stock`
              }
              data-testid="momsco-collection-product-atc-btn"
            >
              <span
                className={`nintara-pg__atc-text ${
                  isLoading ? "nintara-pg__atc-text--hidden" : ""
                }`}
              >
                {product.available ? (
                  <>
                    {/* <CartIcon /> */}
                    {addToCartText}
                  </>
                ) : (
                  outOfStockText
                )}
              </span>
              {isLoading && (
                <span className="nintara-pg__atc-spinner">
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
      </div>
    </div>
  );
});

/**
 * Star rating display — proportional fill (e.g. 4.7 renders as 4 full stars
 * plus a 5th star filled 70% from left, exact to the decimal).
 */
const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

const StarRating = memo(function StarRating({ score }: { score: number }) {
  const reactId = useId();
  return (
    <span
      className="nintara-pg__stars"
      aria-label={`${score} out of 5 stars`}
      data-testid="momsco-collection-product-rating"
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const fillPct = Math.max(0, Math.min(1, score - (i - 1))) * 100;
        const gradId = `pg-star-${reactId}-${i}`;
        return (
          <svg
            key={i}
            className="nintara-pg__star"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
                <stop offset={`${fillPct}%`} stopColor="currentColor" />
                <stop offset={`${fillPct}%`} stopColor="transparent" />
              </linearGradient>
            </defs>
            {/* Faded backdrop — visible where the gradient is transparent */}
            <path d={STAR_PATH} fill="currentColor" opacity="0.3" />
            {/* Foreground — gradient-clipped to fillPct */}
            <path d={STAR_PATH} fill={`url(#${gradId})`} />
          </svg>
        );
      })}
    </span>
  );
});
