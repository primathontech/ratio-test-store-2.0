"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/ui/components/ProductCard";
import type { ProductCardProduct } from "@/ui/components/ProductCard/types";
import { getMostLovedProductsForComponent } from "../services/search-api";

export interface RecommendedProductsProps {
  className?: string;
  settings?: {
    title?: string;
    accessibility?: {
      scrollLeft?: string;
      scrollRight?: string;
    };
  };
}

/** Raw product shape returned by /collections/details. Only the fields we use. */
interface ApiProduct {
  id?: string | number;
  title?: string;
  handle?: string;
  productType?: string;
  price?: number | string;
  compare_at_price?: number | string | null;
  image_url?: string;
  images?: Array<{
    url?: string;
    src?: string;
    is_main?: boolean;
    alt?: string | null;
  }>;
  average_rating?: number | string;
  rating_count?: number | string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/** Map an API product → V2 ProductCardProduct (prices from paise → rupees). */
function transformApiProduct(product: ApiProduct): ProductCardProduct {
  const salePricePaise = toNumber(product.price);
  const compareAtPaise = toNumber(product.compare_at_price);
  const salePrice = salePricePaise / 100;
  const originalPrice =
    compareAtPaise > 0 && compareAtPaise !== salePricePaise
      ? compareAtPaise / 100
      : undefined;

  let discount: string | undefined;
  if (originalPrice && originalPrice > salePrice && salePrice > 0) {
    const pct = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    discount = `${pct}% off`;
  }

  const mainImg =
    product.images?.find((img) => img?.is_main)?.url ||
    product.images?.[0]?.url ||
    product.images?.[0]?.src ||
    product.image_url ||
    "";
  const hoverImg = product.images?.find((img) => !img?.is_main)?.url || mainImg;
  const alt =
    product.images?.find((img) => img?.is_main)?.alt ||
    product.title ||
    "Product image";

  return {
    href: product.handle ? `/products/${product.handle}` : "#",
    title: product.title ?? "",
    alt,
    mainImage: mainImg,
    hoverImage: hoverImg,
    category: product.productType || "",
    rating: toNumber(product.average_rating),
    reviewCount: toNumber(product.rating_count),
    salePrice,
    originalPrice,
    discount,
  };
}

/**
 * Horizontal-scrolling product strip rendered beneath "POPULAR CHOICES" in the
 * pre-search dropdown. Fetches bestsellers once on first mount.
 */
export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  className = "",
  settings = {},
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const result = await getMostLovedProductsForComponent(8);
      if (!cancelled) {
        setProducts((result.products as ApiProduct[]) || []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const transformed = useMemo(
    () => products.slice(0, 8).map(transformApiProduct),
    [products]
  );

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    updateArrows();
    const t = setTimeout(updateArrows, 100);
    return () => clearTimeout(t);
  }, [transformed.length]);

  const scrollBy = (direction: "left" | "right") => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const firstCard = el.children[0] as HTMLElement | undefined;
    const cardWidth = firstCard?.offsetWidth ?? 220;
    const gap = parseFloat(getComputedStyle(el).gap) || 16;
    const step = (window.innerWidth >= 768 ? 4 : 2) * (cardWidth + gap);
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const isEmpty = !loading && transformed.length === 0;

  const productCardSettings = {
    showActionButton: false,
    showBadge: false,
    showRating: false,
    backgroundColor: "white",
    color: "#000",
    priceSectionClassName: "!mt-0",
    titleClassName:
      "!font-body !font-normal !text-[14px] !leading-[16.9px] !line-clamp-2 !min-h-[32px]",
    detailsClassName: "!gap-[6px]",
    imageClassName: "!rounded-[10px]",
    compareAtPriceClassName: "!text-[#000000] !opacity-55 !font-medium",
    isRecommendedProduct: true,
  };

  return (
    <div className={className}>
      <p className="text-[14px] font-[700] text-black mb-[8px] flex items-center tracking-[0.6px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-[18px] h-[18px] mr-[7px]"
          viewBox="0 0 24 24"
          fill="#000"
          aria-hidden="true"
        >
          <path d="M12,2 C16.418278,2 20,5.581722 20,10 C20,12.5480905 18.8087155,14.8179415 16.9527141,16.2829857 L17.0016031,16.2440856 L17.0007001,22.2453233 C17.0007001,22.7945586 16.4297842,23.157512 15.9324488,22.9244522 L12.0005291,21.0818879 L8.07069102,22.9243915 C7.5733438,23.1575726 7.00231009,22.7946207 7.00231009,22.2453233 L7.00069412,16.2459273 C5.1725143,14.7820178 4,12.5279366 4,10 C4,5.581722 7.581722,2 12,2 Z M12,3.5 C8.41014913,3.5 5.5,6.41014913 5.5,10 C5.5,13.5898509 8.41014913,16.5 12,16.5 C15.5898509,16.5 18.5,13.5898509 18.5,10 C18.5,6.41014913 15.5898509,3.5 12,3.5 Z" />
        </svg>
        {settings.title || "RECOMMENDED FOR YOU"}
      </p>

      <div className="relative">
        <div className="overflow-hidden relative w-full">
          {canScrollLeft && (
            <button
              type="button"
              onClick={scrollBy("left")}
              onMouseDown={(e) => e.preventDefault()}
              className="absolute left-[2px] md:left-2 z-[60] bg-[#000000] p-[10px] shadow-md transition-all duration-200 hover:shadow-lg rounded-[50%]"
              style={{ top: "40%", transform: "translateY(-50%)" }}
              aria-label={settings.accessibility?.scrollLeft || "Scroll left"}
            >
              <svg
                width="12"
                height="12"
                viewBox="-4.5 0 19 19"
                fill="#fff"
                aria-hidden="true"
              >
                <path d="M8.4 17.269a1.026 1.026 0 0 1-.727-.302l-6.801-6.8a1.03 1.03 0 0 1 0-1.456l6.8-6.8a1.03 1.03 0 0 1 1.456 1.455L3.055 9.439l6.073 6.073A1.03 1.03 0 0 1 8.4 17.27z" />
              </svg>
            </button>
          )}

          {canScrollRight && (
            <button
              type="button"
              onClick={scrollBy("right")}
              onMouseDown={(e) => e.preventDefault()}
              className="absolute right-[2px] md:right-2 z-[60] bg-[#000000] p-[10px] shadow-md transition-all duration-200 hover:shadow-lg rounded-[50%]"
              style={{ top: "40%", transform: "translateY(-50%)" }}
              aria-label={settings.accessibility?.scrollRight || "Scroll right"}
            >
              <svg
                width="12"
                height="12"
                viewBox="-4.5 0 19 19"
                fill="#fff"
                aria-hidden="true"
              >
                <path d="M1.6 17.262a1.03 1.03 0 0 1-.728-1.757l6.073-6.073L.872 3.36a1.03 1.03 0 0 1 1.455-1.455l6.8 6.8a1.03 1.03 0 0 1 0 1.456l-6.8 6.8a1.025 1.025 0 0 1-.727.302z" />
              </svg>
            </button>
          )}

          {loading ? (
            <div className="flex overflow-x-auto gap-[13px] md:gap-[24px] pb-20 md:pb-4 scrollbar-hide">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 min-w-[45%] max-w-[49%] md:min-w-[20%] md:max-w-[21.5%] aspect-[26/40] md:aspect-[23/40] bg-gray-200 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : isEmpty ? (
            <div className="py-[24px] text-center text-[13px] text-[#727272]">
              No recommendations available right now.
            </div>
          ) : (
            <div
              ref={scrollRef}
              onScroll={updateArrows}
              className="flex h-auto overflow-x-auto gap-[13px] md:gap-[16px] lg:gap-[24px] pb-20 md:pb-4 scrollbar-hide"
            >
              {transformed.map((product, idx) => (
                <div
                  key={product.href + idx}
                  className="flex-shrink-0 min-w-[48%] max-w-[48%] md:min-w-[22.5%] md:max-w-[22.5%] lg:min-w-[21.5%] lg:max-w-[21.5%] xl:min-w-[23%] xl:max-w-[23%] border border-[#ECECEC] rounded-[10px]"
                >
                  <ProductCard
                    product={product}
                    settings={productCardSettings}
                    showProductType={true}
                    showNetContent={false}
                    showSubtitle={false}
                    className="md:!border border-faq-border !rounded-[10px] w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default RecommendedProducts;
