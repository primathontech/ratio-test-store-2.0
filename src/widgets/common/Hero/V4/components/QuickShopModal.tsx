"use client";

/**
 * QuickShopModal — the quick-shop overlay opened from a hotspot popover.
 * Rendered as a fixed inset-0 sibling at the WIDGET ROOT (no portal).
 *
 * Live-product path: image + title + price and a real "Add to cart"
 * (mapProductToCartItem → addItem → openCart, the platform cart drawer).
 * Demo path: the hotspot's fallback title/price with the CTA linking to the PDP.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { formatPrice, mapProductToCartItem, useCartStore } from "@shopkit/cart";
import { CloseIcon } from "../icons";
import type { ShoppableHeroProduct } from "../types";

export interface QuickShopModalProps {
  /** Live product (when `products` was wired); null → demo content. */
  product: ShoppableHeroProduct | null;
  /** Demo fallback content shown when no live product is available. */
  fallbackTitle: string;
  fallbackPrice: string;
  fallbackHref: string;
  onClose: () => void;
}

function resolvePrice(product: ShoppableHeroProduct): {
  price: string;
  compareAt: string | null;
} {
  const min = product.priceRange?.minVariantPrice;
  const cmp = product.compareAtPriceRange?.minVariantPrice;
  const price = min
    ? formatPrice(
        Number.parseFloat(min.amount),
        min.currencyCode || "INR",
        "en-IN"
      )
    : "";
  const compareAt =
    cmp && Number.parseFloat(cmp.amount) > Number.parseFloat(min?.amount ?? "0")
      ? formatPrice(
          Number.parseFloat(cmp.amount),
          cmp.currencyCode || "INR",
          "en-IN"
        )
      : null;
  return { price, compareAt };
}

export function QuickShopModal({
  product,
  fallbackTitle,
  fallbackPrice,
  fallbackHref,
  onClose,
}: QuickShopModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [adding, setAdding] = useState(false);

  // Lock body scroll + ESC-to-close + focus the dialog while open.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const title = product?.title ?? fallbackTitle;
  const image =
    product?.featuredImage?.url ?? product?.images?.[0]?.url ?? null;
  const imageAlt = product?.images?.[0]?.altText ?? title;
  const resolved = product ? resolvePrice(product) : null;
  const priceText = resolved?.price || fallbackPrice;
  const compareText = resolved?.compareAt ?? null;
  const variantId = product?.variants?.[0]?.id;

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }
    setAdding(true);
    try {
      const item = mapProductToCartItem(product, variantId, 1, "INR");
      await useCartStore.getState().addItem(item);
      await useCartStore.getState().openCart();
      onClose();
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      data-testid="hero-quickshop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      ref={dialogRef}
      onClick={onClose}
      className="cs-hero-v4__quickshop fixed inset-0 z-[30] flex items-center justify-center bg-black/50 p-[15px] motion-reduce:animate-none"
    >
      <div
        className="relative max-h-[calc(100vh-30px)] w-full max-w-[900px] overflow-y-auto bg-white text-[#2a3743]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-[10px] top-[10px] z-[2] flex h-[40px] w-[40px] items-center justify-center p-[10px] text-[#2a3743] transition-opacity duration-200 hover:opacity-70"
        >
          <CloseIcon className="block h-[20px] w-[20px]" />
        </button>

        <div className="grid grid-cols-1 gap-[20px] p-[45px] min-[768px]:grid-cols-2 min-[768px]:gap-[45px]">
          {image ? (
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#f5f4f2]">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(min-width: 768px) 50vw, 90vw"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="flex flex-col">
            <p className="m-0 mb-[10px] font-heading text-[36px] font-[500] leading-[39.6px] text-[#2a3743]">
              {title}
            </p>
            <div className="mb-[25px] flex items-baseline gap-[8px] font-body text-[16px] font-[400] leading-[22.4px] tracking-[0.4px]">
              <span>{priceText}</span>
              {compareText ? (
                <s className="text-[rgba(42,55,67,0.6)]">{compareText}</s>
              ) : null}
            </div>

            {product ? (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={adding}
                data-testid="hero-quickshop-atc"
                className="inline-block w-full bg-[#edebe7] px-[20px] py-[11px] text-center font-body text-[15px] font-[700] uppercase leading-[18.46px] tracking-[2.6px] text-black transition-colors duration-200 hover:bg-[#2a3743] hover:text-white disabled:opacity-60"
              >
                {adding ? "Adding…" : "Add to cart"}
              </button>
            ) : (
              <a
                href={fallbackHref}
                data-testid="hero-quickshop-atc"
                className="inline-block w-full bg-[#edebe7] px-[20px] py-[11px] text-center font-body text-[15px] font-[700] uppercase leading-[18.46px] tracking-[2.6px] text-black transition-colors duration-200 hover:bg-[#2a3743] hover:text-white"
              >
                View product
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
