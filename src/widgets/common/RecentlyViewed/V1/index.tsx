"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CartAwareProductCard } from "@/ui/components/CartAwareProductCard";
import { SwipeCarousel } from "@/ui/components/SwipeCarousel";
import { getProductAverageRating } from "@/widgets/common/CustomerReviews/utils/get-review-api";
import { RecentlyViewedProps } from "../types";
import {
  type ApiRecentProduct,
  addViewedProduct,
  fetchProductDetails,
  getViewedProductIds,
} from "../utils";

/* ------------------------------------------------------------------ */
/*  Idle scheduler — yields rating fetches to browser idle time so they */
/*  don't compete with above-the-fold paint / hydration.                */
/* ------------------------------------------------------------------ */

function runWhenIdle(fn: () => void): void {
  if (typeof window === "undefined") {
    fn();
    return;
  }
  const ric: typeof window.requestIdleCallback | undefined = (
    window as unknown as {
      requestIdleCallback?: typeof window.requestIdleCallback;
    }
  ).requestIdleCallback;
  if (typeof ric === "function") {
    ric(() => fn(), { timeout: 1500 });
    return;
  }
  setTimeout(fn, 0);
}

/* ------------------------------------------------------------------ */
/*  SVG Icons                                                          */
/* ------------------------------------------------------------------ */

const PrevArrowIcon = () => (
  <svg
    width="7"
    height="11"
    viewBox="0 0 7 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.5 11L0 5.5L5.5 0L6.47625 0.97625L1.9525 5.5L6.47625 10.0238L5.5 11Z"
      fill="currentColor"
    />
  </svg>
);

const NextArrowIcon = () => (
  <svg
    width="7"
    height="11"
    viewBox="0 0 7 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.5 11L7 5.5L1.5 0L0.52375 0.97625L5.0475 5.5L0.52375 10.0238L1.5 11Z"
      fill="currentColor"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Carousel breakpoints — same as FeaturedCollectionCarousel          */
/* ------------------------------------------------------------------ */

const CAROUSEL_BREAKPOINTS = [
  { minWidth: 0, cards: 2.3, gap: 0 },
  { minWidth: 768, cards: 3, gap: 0 },
  { minWidth: 1024, cards: 4, gap: 0 },
  { minWidth: 1440, cards: 5, gap: 0 },
];

/* ------------------------------------------------------------------ */
/*  Main V1 component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ data, settings }: RecentlyViewedProps) {
  const product = data?.success ? data.data : null;
  const currentProductId = product?.id ? String(product.id) : null;
  const currentVariantId = product?.variants?.[0]?.id;

  const heading = settings?.heading || "Recently Viewed";
  const maxProducts = settings?.maxProducts ?? 10;

  const [products, setProducts] = useState<ApiRecentProduct[]>([]);
  // `shouldLoad` flips to true only when the section approaches the
  // viewport. Until then we render nothing and fire no network calls —
  // critical above-the-fold work owns the main thread alone.
  const [shouldLoad, setShouldLoad] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  // 1. Track current product visit (with 1s debounce so accidental hits are skipped)
  useEffect(() => {
    if (!currentProductId) {
      return;
    }
    const t = setTimeout(() => {
      addViewedProduct(currentProductId, currentVariantId);
    }, 1000);
    return () => clearTimeout(t);
  }, [currentProductId, currentVariantId]);

  // 2. Lazy-mount: only start fetching once the section is within
  //    400px of the viewport. RecentlyViewed sits at the bottom of
  //    most pages — many users never scroll there, so this avoids
  //    the fetch entirely for those sessions.
  useEffect(() => {
    if (shouldLoad) {
      return;
    }
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      // Environment without IO (older browsers, SSR shim) — load anyway.
      setShouldLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [shouldLoad]);

  // 3. Fetch product details, then overlay the live average-rating API
  //    so cards show authoritative rating/count instead of stale
  //    metafield values. Runs only after `shouldLoad` flips true.
  useEffect(() => {
    if (!shouldLoad) {
      return;
    }
    let cancelled = false;

    const run = async () => {
      let ids = getViewedProductIds(maxProducts + 1);
      if (currentProductId) {
        ids = ids.filter((id) => id !== currentProductId);
      }
      ids = ids.slice(0, maxProducts);

      if (ids.length === 0) {
        if (!cancelled) {
          setProducts([]);
        }
        return;
      }

      const result = await fetchProductDetails(ids);
      if (cancelled) {
        return;
      }
      // First paint: render with whatever the product API returned —
      // no waiting on N parallel rating calls. Users see the carousel
      // immediately; rating values are refined as the API resolves.
      setProducts(result);

      // Defer rating fetches to browser idle time so they don't fight
      // hydration / paint for main-thread cycles. Each call is wrapped
      // in .catch so one failure can't break the whole Promise.all.
      runWhenIdle(async () => {
        if (cancelled) {
          return;
        }
        const ratings = await Promise.all(
          result.map((p) =>
            p?.id ? getProductAverageRating(p.id).catch(() => null) : null
          )
        );
        if (cancelled) {
          return;
        }
        // Merge in-place; products without a successful rating response
        // keep whatever value the product API returned (graceful degrade).
        const merged = result.map((p, i) => {
          const r = ratings[i];
          if (!r) {
            return p;
          }
          return {
            ...p,
            average_rating:
              typeof r.average_rating === "number"
                ? r.average_rating
                : p.average_rating,
            rating_count:
              typeof r.total_ratings === "number"
                ? r.total_ratings
                : p.rating_count,
          };
        });
        setProducts(merged);
      });
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [shouldLoad, currentProductId, maxProducts]);

  // 3. Product card settings
  const cardSettings = useMemo(
    () => ({
      showActionButton: settings?.showActionButton ?? true,
      showQuantitySelector: true,
      actionButtonText: settings?.actionButtonText ?? "Add to cart",
      actionButtonTextColor: settings?.actionButtonTextColor,
      showBadge: settings?.showBadge ?? true,
      showRating: settings?.showRating ?? true,
      soldOutText: settings?.soldOutText ?? "Sold Out",
      backgroundColor: settings?.productCardBackgroundColor,
      color: settings?.sectionTextColor,
      priceSectionClassName: "min-h-[35.6px]",
    }),
    [settings]
  );

  const renderProduct = useCallback(
    (idx: number) => {
      const apiProduct = products[idx];
      if (!apiProduct) {
        return null;
      }
      return (
        <div className="md:border-r md:border-[#EBEBEB] overflow-hidden pl-[12px] md:pl-0">
          <CartAwareProductCard
            apiProduct={apiProduct}
            settings={cardSettings}
            logTag="RecentlyViewed"
          />
        </div>
      );
    },
    [products, cardSettings]
  );

  // Until products resolve, mount a zero-height sentinel so the
  // IntersectionObserver has a real node to watch. Once products are
  // ready we swap to the full section. Without this the observer
  // would have nothing to fire against and the lazy-mount would
  // never trigger.
  if (products.length === 0) {
    return (
      <section ref={sectionRef} aria-hidden="true" style={{ height: 1 }} />
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden mx-auto"
      style={{
        backgroundColor: settings?.sectionBackgroundColor || "#ffffff",
      }}
    >
      {/* Content overlay */}
      <div className="relative z-[1] max-w-[1400px] mx-auto px-1.5 md:px-[30px] xl:px-[50px]">
        {/* Heading */}
        <div className="flex flex-col items-start text-center mb-4 md:mb-[30px] px-[15px]">
          <h4
            className="text-2xl leading-[29px] md:leading-[34px]"
            style={{
              color: settings?.sectionTextColor || "#000000",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {heading}
          </h4>
        </div>

        {/* Carousel area */}
        <div className="group xl:mx-auto xl:max-w-[1300px] md:border md:border-[#EBEBEB] md:rounded-lg overflow-hidden">
          <SwipeCarousel
            itemCount={products.length}
            breakpoints={CAROUSEL_BREAKPOINTS}
            renderItem={renderProduct}
            renderPrev={(onClick, disabled) => (
              <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`absolute left-[13px] z-[3] hidden lg:flex items-center justify-center cursor-pointer -translate-y-1/2 lg:opacity-0 lg:translate-x-[20px] lg:group-hover:translate-x-0 ${
                  disabled
                    ? "lg:group-hover:opacity-40"
                    : "lg:group-hover:opacity-100 hover:!bg-white hover:!text-black hover:!border-white"
                }`}
                style={{
                  top: "245px",
                  width: "46px",
                  height: "46px",
                  borderRadius: "9999px",
                  backgroundColor: disabled
                    ? "rgba(255,255,255,0.2)"
                    : "rgb(0,0,0)",
                  border: disabled
                    ? "1px solid rgba(255,255,255,0.01)"
                    : "1px solid rgb(0,0,0)",
                  color: "#ffffff",
                  transition:
                    "opacity 0.3s ease, transform 0.35s ease, background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease",
                }}
                aria-label="Previous products"
              >
                <PrevArrowIcon />
              </button>
            )}
            renderNext={(onClick, disabled) => (
              <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`absolute right-[13px] z-[3] hidden lg:flex items-center justify-center cursor-pointer -translate-y-1/2 lg:opacity-0 lg:-translate-x-[20px] lg:group-hover:translate-x-0 ${
                  disabled
                    ? "lg:group-hover:opacity-40"
                    : "lg:group-hover:opacity-100 hover:!bg-white hover:!text-black hover:!border-white"
                }`}
                style={{
                  top: "245px",
                  width: "46px",
                  height: "46px",
                  borderRadius: "9999px",
                  backgroundColor: disabled
                    ? "rgba(255,255,255,0.2)"
                    : "rgb(0,0,0)",
                  border: disabled
                    ? "1px solid rgba(255,255,255,0.01)"
                    : "1px solid rgb(0,0,0)",
                  color: "#ffffff",
                  transition:
                    "opacity 0.3s ease, transform 0.35s ease, background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease",
                }}
                aria-label="Next products"
              >
                <NextArrowIcon />
              </button>
            )}
          />
        </div>
      </div>
    </section>
  );
});
