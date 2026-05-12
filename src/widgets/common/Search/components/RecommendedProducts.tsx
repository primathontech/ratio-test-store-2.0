"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CartAwareProductCard,
  type MappableApiProduct,
} from "@/ui/components/CartAwareProductCard";
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

/**
 * Raw API shape returned by /collections/details — only the fields the
 * shared mapper reads. `id` and `title` are required by `MappableApiProduct`,
 * everything else is optional and falls back through the standard chain.
 */
type RecommendedApiProduct = MappableApiProduct & {
  // Some search endpoints stringify numeric fields — accepted by the mapper.
  price?: number;
  compare_at_price?: number | null;
};

/**
 * Search-bestseller endpoint occasionally returns price/compare_at_price as
 * strings; coerce so the shared mapper sees numbers.
 */
function coerceNumeric(raw: any): RecommendedApiProduct {
  const price =
    typeof raw.price === "string" ? parseFloat(raw.price) : raw.price;
  const compareAt =
    typeof raw.compare_at_price === "string"
      ? parseFloat(raw.compare_at_price)
      : raw.compare_at_price;
  return {
    ...raw,
    price: Number.isFinite(price) ? price : 0,
    compare_at_price: Number.isFinite(compareAt) ? compareAt : null,
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
  const [products, setProducts] = useState<RecommendedApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const result = await getMostLovedProductsForComponent(8);
      if (!cancelled) {
        const raw = (result.products as any[]) || [];
        setProducts(raw.slice(0, 8).map(coerceNumeric));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
  }, [products.length]);

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

  const isEmpty = !loading && products.length === 0;

  const productCardSettings = {
    showActionButton: false,
    showBadge: false,
    showRating: false,
    backgroundColor: "white",
    color: "#000",
    priceSectionClassName: "!mt-0",
    titleClassName:
      "!font-body !font-normal !text-sm !leading-[16.9px] !line-clamp-2 !min-h-8",
    detailsClassName: "!gap-1.5",
    imageClassName: "!rounded-[10px]",
    compareAtPriceClassName: "!text-black !opacity-55 !font-medium",
    isRecommendedProduct: true,
    productImageClassName:
      "!rounded-[10px] w-auto md:max-w-[182.4px] h-auto md:max-h-[182.4px] min-w-[188px] md:min-w-0 min-h-[188px] md:min-h-0",
    categoryChipClassName: "!text-[#000000] !text-[14px]",
    salePriceClassName: "!text-[12px] md:!text-[14px]",
  };

  return (
    <div className={className}>
      <p className="text-sm font-bold text-black mb-2 flex items-center tracking-[0.6px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          version="1.1"
          className="w-[18px] h-[18px] mr-[7px]"
          aria-hidden="true"
        >
          <g
            id="Product-Icons"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="ic_fluent_recommended_24_regular"
              fill="#000000"
              fillRule="nonzero"
            >
              <path d="M12,2 C16.418278,2 20,5.581722 20,10 C20,12.5480905 18.8087155,14.8179415 16.9527141,16.2829857 L17.0016031,16.2440856 L17.0007001,22.2453233 C17.0007001,22.7945586 16.4297842,23.157512 15.9324488,22.9244522 L12.0005291,21.0818879 L8.07069102,22.9243915 C7.5733438,23.1575726 7.00231009,22.7946207 7.00231009,22.2453233 L7.00069412,16.2459273 C5.1725143,14.7820178 4,12.5279366 4,10 C4,5.581722 7.581722,2 12,2 Z M15.5012202,17.1951723 L15.5414683,17.1754104 C14.4738996,17.7033228 13.2715961,18 12,18 C10.8745896,18 9.80345551,17.7676152 8.83196505,17.3482129 L8.50180347,17.1966457 L8.50231009,21.065345 L11.6820691,19.5745158 C11.8837425,19.4799613 12.1170099,19.479939 12.3187014,19.5744551 L15.5007001,21.0655937 L15.5012202,17.1951723 Z M12,3.5 C8.41014913,3.5 5.5,6.41014913 5.5,10 C5.5,13.5898509 8.41014913,16.5 12,16.5 C15.5898509,16.5 18.5,13.5898509 18.5,10 C18.5,6.41014913 15.5898509,3.5 12,3.5 Z M12.2287851,6.64234387 L13.1413078,8.49499737 L15.185271,8.79035658 C15.3945922,8.82060416 15.4782541,9.07783021 15.326776,9.22542655 L13.8484251,10.6658938 L14.1974269,12.7012993 C14.2331646,12.9097242 14.0143068,13.0685941 13.8272087,12.9700424 L12,12.0075816 L10.1727912,12.9700424 C9.98560603,13.06864 9.76668059,12.9095814 9.80260908,12.7010893 L10.1533251,10.6658938 L8.67333197,9.22553178 C8.52171667,9.07797642 8.60533875,8.82061413 8.81472896,8.79035658 L10.8586922,8.49499737 L11.7712148,6.64234387 C11.8646966,6.45255204 12.1353033,6.45255204 12.2287851,6.64234387 Z" />
            </g>
          </g>
        </svg>
        {settings.title || "RECOMMENDED FOR YOU"}
      </p>

      <div className="relative">
        {canScrollLeft && (
          <button
            type="button"
            onClick={scrollBy("left")}
            onMouseDown={(e) => e.preventDefault()}
            className="absolute left-0.5 md:-left-[6px] z-[220] bg-black p-2.5 shadow-md transition-all duration-200 hover:shadow-lg rounded-[50%]"
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
            className="absolute right-0.5 md:-right-1 z-[220] bg-black p-2.5 shadow-md transition-all duration-200 hover:shadow-lg rounded-[50%]"
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

        <div className="overflow-hidden relative w-full">
          {loading ? (
            <div className="recommended-products-scrollbar flex overflow-x-auto gap-[13px] md:gap-6 pb-20 md:pb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 min-w-[45%] max-w-[49%] md:min-w-[20%] md:max-w-[21.5%] aspect-[26/40] md:aspect-[23/40] bg-gray-200 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : isEmpty ? (
            <div className="py-6 text-center text-[13px] text-surface">
              No recommendations available right now.
            </div>
          ) : (
            <div
              ref={scrollRef}
              onScroll={updateArrows}
              className="recommended-products-scrollbar flex h-auto overflow-x-auto gap-[13px] md:gap-4 lg:gap-[23.4px] pb-8 md:pb-4 px-0 md:px-3"
            >
              {products.map((product, idx) => (
                <div
                  key={(product.handle ?? product.id ?? "") + idx}
                  className="flex-shrink-0 min-w-[48%] max-w-[48%] md:min-w-[calc((100%-48px)/4)] md:max-w-[calc((100%-48px)/4)] lg:min-w-[calc((100%-70.2px)/4)] lg:max-w-[calc((100%-70.2px)/4)] rounded-[10px]"
                >
                  <CartAwareProductCard
                    apiProduct={product}
                    logTag="RecommendedProducts"
                    settings={productCardSettings}
                    showProductType
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
        .recommended-products-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #8b8b8b transparent;
        }
        .recommended-products-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .recommended-products-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .recommended-products-scrollbar::-webkit-scrollbar-thumb {
          background: #8b8b8b;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
};

export default RecommendedProducts;
