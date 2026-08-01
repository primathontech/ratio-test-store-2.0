"use client";

import React, { memo, useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { ProductGridProps } from "../types";
import { type ProductGridProduct } from "../types";
import {
  paiseToRupees,
  formatINR,
  isIResponse,
  isCollectionEntries,
  extractCollectionProducts,
} from "@/utils/apiTransforms";
import { useProductRatings, normalizeProductId } from "@/hooks";
import { ProductCard } from "../components/ProductCard";

import "../style.css";

/**
 * ProductGrid V1 Component
 *
 * A 4-column (desktop) / 2-column (mobile) product grid
 * cloned from nintarababy.in/collections/all-products.
 *
 * Animations:
 * - Scroll reveal: translateY(2rem) -> 0 + opacity, 600ms
 * - Image hover: second image fades in (opacity 0->1),
 *   both images scale(1.09), 2s cubic-bezier(0,0,0.44,1.18)
 * - Dark overlay on card hover: rgba(0,0,0,0.1) 0.5s
 * - ATC button hover: bg fills #01464f, text goes white, 0.3s
 */
/** Transform raw API collection response into ProductGridProduct[] */
function transformCollectionProducts(
  rawData: any,
  handle?: string
): ProductGridProduct[] {
  if (!isIResponse(rawData) || !rawData.data) {
    return [];
  }
  const rd = rawData.data as any;
  let products: any[] = [];

  // COLLECTIONS (collectionDataAll): array of { handle, products, ... }
  // Also supports COLLECTION_BY_HANDLES: array of { handle, data: { products, ... } }
  if (Array.isArray(rd) && rd.length > 0 && rd[0]?.handle) {
    const match = handle ? rd.find((c: any) => c.handle === handle) : rd[0];
    if (!match && handle) {
      // Specific collection requested but not found — show empty state
      products = [];
    } else if (match?.products) {
      // collectionDataAll format: products directly on the collection
      products = match.products;
    } else if (match?.data?.products) {
      // COLLECTION_BY_HANDLES format: products nested in .data
      products = match.data.products;
    } else {
      // Fallback: flatten all collections' products
      products = extractCollectionProducts(rd);
    }
  } else if (Array.isArray(rd) && rd.length > 0 && isCollectionEntries(rd)) {
    products = extractCollectionProducts(rd);
  } else if (Array.isArray(rd.products)) {
    products = rd.products;
  } else if (rd.data && Array.isArray(rd.data.products)) {
    products = rd.data.products;
  } else if (Array.isArray(rd.data)) {
    products = rd.data;
  } else if (Array.isArray(rd)) {
    products = rd;
  }

  return products
    .filter((p: any) => p.title)
    .map((p: any) => {
      const saleRupees = paiseToRupees(p.price);
      const compareRupees = paiseToRupees(p.compare_at_price);
      const discount =
        compareRupees > saleRupees && saleRupees > 0
          ? Math.round(((compareRupees - saleRupees) / compareRupees) * 100)
          : 0;
      const badgeLabel =
        p.badge?.label ?? p.badge_label ?? p.badgeLabel ?? undefined;
      const badgeTypeRaw =
        p.badge?.type ?? p.badge_type ?? p.badgeType ?? undefined;
      const badgeType =
        badgeTypeRaw === "parents-choice" || badgeTypeRaw === "new-launch"
          ? badgeTypeRaw
          : null;
      // Pick main image: prefer is_main from images array, then image_url, then first image
      const mainImg =
        Array.isArray(p.images) && p.images.length > 0
          ? p.images.find((img: any) => img.is_main) || p.images[0]
          : null;
      const imgSrc = mainImg?.url || p.image_url || "";

      // Variant to deep-link to on the PDP (?variant=<id>) — same convention as
      // ProductMain so the card lands on the exact variant shown here.
      const variantId = p.variant?.id ?? p.variants?.[0]?.id ?? "";

      const subtitle: string | undefined =
        typeof p.metadata?.subtitle?.value === "string" &&
        p.metadata.subtitle.value
          ? p.metadata.subtitle.value
          : undefined;

      if (subtitle) {
        console.log("[ProductGrid] subtitle extracted:", p.handle, subtitle);
      }

      return {
        id: String(p.id ?? p.handle ?? ""),
        handle: p.handle ?? "",
        name: p.title ?? "",
        url: p.handle
          ? `/products/${p.handle}${variantId ? `?variant=${variantId}` : ""}`
          : "#",
        image: {
          src: imgSrc,
          alt: mainImg?.alt || p.title || "",
          width: 720,
          height: 720,
        },
        rating: {
          score: p.average_rating ? Number(p.average_rating) : 0,
          reviewCount: p.rating_count ? Number(p.rating_count) : 0,
        },
        price: {
          current: formatINR(saleRupees),
          original: compareRupees > saleRupees ? formatINR(compareRupees) : "",
          savePercent: discount > 0 ? `${discount}%` : undefined,
        },
        available: p.product_availability ?? p.availableForSale ?? true,
        subtitle,
        _variantId: variantId,
        _priceAmount: saleRupees,
        product_type: p.product_type || p.productType || "",
        badge: badgeLabel ? { type: badgeType, label: badgeLabel } : undefined,
      } as ProductGridProduct & {
        _variantId: string;
        _priceAmount: number;
        product_type: string;
        handle: string;
      };
    });
}

const PAGE_SIZE = 8;

export const V1 = memo(function V1({
  data,
  settings,
  className,
}: ProductGridProps) {
  const pathname = usePathname();
  const currentHandle = useMemo(() => {
    const segments = pathname?.split("/").filter(Boolean) ?? [];
    return segments[segments.length - 1] || "";
  }, [pathname]);

  // Resolve the effective handle: if current slug doesn't match any collection, fall back to "shop-all"
  const FALLBACK_HANDLE = "shop-all";
  const effectiveHandle = useMemo(() => {
    if (!currentHandle) {
      return currentHandle;
    }
    const rawData = data as any;
    if (!isIResponse(rawData) || !rawData.data) {
      return currentHandle;
    }
    const rd = rawData.data;
    if (!Array.isArray(rd) || rd.length === 0 || !rd[0]?.handle) {
      return currentHandle;
    }
    const exists = rd.some((c: any) => c.handle === currentHandle);
    return exists ? currentHandle : FALLBACK_HANDLE;
  }, [data, currentHandle]);

  // Silently update the URL and tab title to /collections/shop-all when the slug was invalid
  useEffect(() => {
    if (effectiveHandle !== currentHandle) {
      window.history.replaceState(null, "", `/collections/${FALLBACK_HANDLE}`);
      const rawData = data as any;
      const rd = rawData?.data;
      const fallbackCollection =
        Array.isArray(rd) && rd.find((c: any) => c.handle === FALLBACK_HANDLE);
      const title = fallbackCollection?.seo?.title || fallbackCollection?.title;
      if (title) {
        document.title = title;
      }
      const description =
        fallbackCollection?.seo?.description || fallbackCollection?.description;
      if (description) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", description);
        }
      }
    }
  }, [effectiveHandle, currentHandle, data]);

  const apiProducts = useMemo(
    () => transformCollectionProducts(data, effectiveHandle),
    [data, effectiveHandle]
  );

  const allProducts = apiProducts;

  const [sortValue, setSortValue] = useState("manual");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset visible count when data changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [apiProducts]);

  // Listen for sort events from FilterSortBar
  useEffect(() => {
    const handleSort = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.sort) {
        setSortValue(detail.sort);
        setVisibleCount(PAGE_SIZE);
      }
    };
    window.addEventListener("nintara:sort", handleSort);
    return () => window.removeEventListener("nintara:sort", handleSort);
  }, []);

  // Listen for filter events from FilterSortBar
  useEffect(() => {
    const handleFilter = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.filters) {
        setActiveFilters(detail.filters);
        setVisibleCount(PAGE_SIZE);
      }
    };
    window.addEventListener("nintara:filter", handleFilter);
    return () => window.removeEventListener("nintara:filter", handleFilter);
  }, []);

  // Apply filters and sort
  const processedProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter
    const typeFilter = activeFilters["Product type"];
    if (typeFilter && typeFilter.length > 0) {
      result = result.filter((p: any) => {
        const pType = (p.product_type || "").trim();
        return typeFilter.includes(pType);
      });
    }

    const priceFilter = activeFilters["Price"];
    if (priceFilter && priceFilter.length > 0) {
      const ranges = priceFilter
        .map((label) => {
          if (label === "Under ₹199") {
            return { min: 0, max: 198 };
          }
          if (label === "₹199 - ₹399") {
            return { min: 199, max: 398 };
          }
          if (label === "₹399 - ₹500") {
            return { min: 399, max: 499 };
          }
          if (label === "₹500 - ₹1,000") {
            return { min: 500, max: 999 };
          }
          if (label === "₹1,000 - ₹1,500") {
            return { min: 1000, max: 1499 };
          }
          if (label === "Above ₹1,500") {
            return { min: 1500, max: Infinity };
          }
          return null;
        })
        .filter(Boolean) as { min: number; max: number }[];

      if (ranges.length > 0) {
        result = result.filter((p: any) => {
          const price = p._priceAmount || 0;
          return ranges.some((r) => price >= r.min && price <= r.max);
        });
      }
    }

    // Sort
    if (sortValue === "price-ascending") {
      result.sort(
        (a: any, b: any) => (a._priceAmount || 0) - (b._priceAmount || 0)
      );
    } else if (sortValue === "price-descending") {
      result.sort(
        (a: any, b: any) => (b._priceAmount || 0) - (a._priceAmount || 0)
      );
    } else if (sortValue === "title-ascending") {
      result.sort((a: any, b: any) =>
        (a.name || "").localeCompare(b.name || "")
      );
    } else if (sortValue === "title-descending") {
      result.sort((a: any, b: any) =>
        (b.name || "").localeCompare(a.name || "")
      );
    } else if (sortValue === "best-selling") {
      result.sort(
        (a: any, b: any) =>
          (b.rating?.reviewCount || 0) - (a.rating?.reviewCount || 0)
      );
    }

    return result;
  }, [allProducts, sortValue, activeFilters]);

  const visibleProducts = processedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < processedProducts.length;

  // Fetch live ratings only for visible products to keep fan-out bounded
  const visibleProductIds = useMemo(
    () =>
      visibleProducts.map((p: any) => String(p.id)).filter(Boolean) as string[],
    [visibleProducts]
  );
  const { ratings } = useProductRatings(visibleProductIds);

  const products = useMemo(
    () =>
      visibleProducts.map((p: any) => {
        const live = ratings[normalizeProductId(String(p.id))];
        if (!live) {
          return p;
        }
        return {
          ...p,
          rating: { score: live.score, reviewCount: live.reviewCount },
        };
      }),
    [visibleProducts, ratings]
  );

  // Listen for load-more events from the LoadMorePagination widget
  useEffect(() => {
    const handleLoadMore = () => {
      setVisibleCount((prev) =>
        Math.min(prev + PAGE_SIZE, processedProducts.length)
      );
    };

    window.addEventListener("nintara:loadmore", handleLoadMore);
    return () => window.removeEventListener("nintara:loadmore", handleLoadMore);
  }, [processedProducts.length]);

  // Broadcast hasMore state so LoadMorePagination can show/hide
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("nintara:hasmore", { detail: { hasMore } })
    );
  }, [hasMore]);

  // Reply to LoadMorePagination asking for current state (handles mount-order timing)
  useEffect(() => {
    const handleQuery = () => {
      window.dispatchEvent(
        new CustomEvent("nintara:hasmore", { detail: { hasMore } })
      );
    };
    window.addEventListener("nintara:hasmore:query", handleQuery);
    return () =>
      window.removeEventListener("nintara:hasmore:query", handleQuery);
  }, [hasMore]);

  if (allProducts.length === 0) {
    return (
      <section
        className={`nintara-pg ${className ?? ""}`}
        aria-label="Product Grid"
      >
        <div className="nintara-pg__empty">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              x="8"
              y="12"
              width="48"
              height="40"
              rx="4"
              stroke="#d1d5db"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M8 22h48M24 12v10M40 12v10"
              stroke="#d1d5db"
              strokeWidth="2"
            />
            <circle cx="32" cy="37" r="8" stroke="#d1d5db" strokeWidth="2" />
            <path
              d="M29 37h6M32 34v6"
              stroke="#d1d5db"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p className="nintara-pg__empty-title">No products found</p>
          <p className="nintara-pg__empty-subtitle">
            This collection doesn&apos;t have any products yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`nintara-pg ${className ?? ""}`}
      aria-label="Product Grid"
    >
      <div className="nintara-pg__container">
        <div
          className="nintara-pg__grid"
          data-testid="momsco-collection-product-grid"
        >
          {products.map((product: any, index: number) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              addToCartText={settings?.addToCartText ?? "ADD TO CART"}
              outOfStockText={settings?.outOfStockText ?? "OUT OF STOCK"}
              reviewsText={settings?.reviewsText ?? "reviews"}
              savePrefix={settings?.savePrefix ?? "Save "}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export { V1 as default };
