"use client";

import React, {
  memo,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import Image from "next/image";
import type {
  HairCareBFFsProps,
  HairCareBFFsTabConfig,
  ApiProduct,
  ApiCollectionResult,
} from "../types";
import { ProductCardTheme } from "@/ui/components/index";
import { CartAwareProductCard } from "@/ui/components/CartAwareProductCard";
import { SwipeCarousel } from "@/ui/components/SwipeCarousel";
import { LazyViewAllButton } from "@/widgets/common/FeaturedCollectionCarousel/components/LazyViewAllButton";
import { resolveImage } from "@/widgets/utils/resolveImageSrc";

/* ------------------------------------------------------------------ */
/*  SVG Icons                                                          */
/* ------------------------------------------------------------------ */

const ChevronRightIcon = () => (
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

const ChevronLeftIcon = () => (
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

/* ------------------------------------------------------------------ */
/*  Extract tabs from COLLECTION_BY_HANDLES response                   */
/* ------------------------------------------------------------------ */

interface CollectionTab {
  /** Display label (driven by settings.collections[].label, falls back to title/handle). */
  name: string;
  /** Server-fetched collection handle. */
  handle: string;
  /** Target handle for "View all" — same as `handle` unless template overrides. */
  viewAllHandle: string;
  products: ApiProduct[];
  totalProducts: number;
}

interface ServerCollectionEntry {
  handle: string;
  title: string;
  products: ApiProduct[];
  totalProducts: number;
}

function readServerCollections(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): ServerCollectionEntry[] {
  if (!data || !data.success) {
    return [];
  }
  const collections: ApiCollectionResult[] | undefined = data.data;
  if (!Array.isArray(collections) || collections.length === 0) {
    return [];
  }

  const out: ServerCollectionEntry[] = [];
  for (const collection of collections) {
    const collectionData = collection.data;
    const products = collectionData?.products || collection.products;
    if (!Array.isArray(products) || products.length === 0) {
      continue;
    }
    out.push({
      handle: collection.handle,
      title: collectionData?.title || collection.handle,
      products,
      totalProducts:
        collectionData?.productPagination?.total || products.length,
    });
  }
  return out;
}

/**
 * Build display tabs from server data, optionally enriched by a parallel
 * array of per-tab overrides. Order follows the server (which matches the
 * data source's `handles` array). Tabs without a corresponding override
 * fall back to the server title and server handle.
 */
function buildTabs(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  overrides?: HairCareBFFsTabConfig[]
): CollectionTab[] {
  const serverEntries = readServerCollections(data);

  return serverEntries.map((e, idx) => {
    const cfg = overrides?.[idx];
    return {
      name: cfg?.label || e.title || e.handle,
      handle: e.handle,
      viewAllHandle: cfg?.viewAllCollectionHandle || e.handle,
      products: e.products,
      totalProducts: e.totalProducts,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Carousel breakpoints                                               */
/* ------------------------------------------------------------------ */

const DEFAULT_HAIR_CARE_BFFS_BREAKPOINTS = [
  { minWidth: 0, cards: 2.15, gap: 0 },
  { minWidth: 1024, cards: 5, gap: 0 },
  { minWidth: 1440, cards: 5, gap: 0 },
];
const EMPTY_PRODUCTS: ApiProduct[] = [];

const GRID_EXIT_DURATION_MS = 260;
const GRID_ENTER_DURATION_MS = 320;

type GridAnimationPhase = "idle" | "exiting" | "pre-enter" | "entering";

/* ------------------------------------------------------------------ */
/*  Main V1 Component                                                  */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ data, settings }: HairCareBFFsProps) {
  const headingRich = settings?.heading || "Hair Care <strong>BFFs</strong>";
  const backgroundImage = resolveImage(settings?.backgroundImage, {
    src: "/HairCareBFFs/images/bg-watermark.webp",
    alt: "Hair Care BFFs section background",
  });
  const backgroundImageMobile = resolveImage(settings?.backgroundImageMobile, {
    src: "/HairCareBFFs/images/bg-mobile-watermark.webp",
    alt: "Hair Care BFFs section background",
  });

  const collectionsConfig = settings?.collections;
  const actionButtonText = settings?.actionButtonText;
  const soldOutText = settings?.soldOutText;
  const carouselBreakpoints =
    settings?.carouselBreakpoints && settings.carouselBreakpoints.length > 0
      ? settings.carouselBreakpoints
      : DEFAULT_HAIR_CARE_BFFS_BREAKPOINTS;
  const tabs = useMemo(
    () => buildTabs(data, collectionsConfig),
    [data, collectionsConfig]
  );

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [gridAnimationPhase, setGridAnimationPhase] =
    useState<GridAnimationPhase>("idle");
  const activeTab = tabs[activeTabIndex];
  const products = activeTab?.products ?? EMPTY_PRODUCTS;
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const animationFrameRef = useRef<number | null>(null);

  const clearScheduledAnimation = useCallback(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const handleTabClick = useCallback(
    (index: number) => {
      if (index === activeTabIndex) {
        return;
      }
      clearScheduledAnimation();
      setGridAnimationPhase("exiting");

      // Let the current grid exit first, then swap the data and animate
      // the new grid into place from the same offset.
      animationTimeoutRef.current = setTimeout(() => {
        setActiveTabIndex(index);
        setGridAnimationPhase("pre-enter");

        animationFrameRef.current = requestAnimationFrame(() => {
          animationFrameRef.current = null;
          setGridAnimationPhase("entering");

          animationTimeoutRef.current = setTimeout(() => {
            setGridAnimationPhase("idle");
            animationTimeoutRef.current = null;
          }, GRID_ENTER_DURATION_MS);
        });
      }, GRID_EXIT_DURATION_MS);
    },
    [activeTabIndex, clearScheduledAnimation]
  );

  useEffect(
    () => () => {
      clearScheduledAnimation();
    },
    [clearScheduledAnimation]
  );

  const cardTheme = ProductCardTheme.DARK;
  const outerBorderClass =
    cardTheme === ProductCardTheme.DARK
      ? "md:border md:border-white/20"
      : "md:border md:border-[#EBEBEB]";
  const itemBorderClass =
    cardTheme === ProductCardTheme.DARK
      ? "md:border-r md:border-white/20"
      : "md:border-r md:border-[#EBEBEB]";

  const renderProduct = useCallback(
    (idx: number) => {
      const product = products[idx];
      if (!product) {
        return null;
      }
      return (
        <div
          className={`${itemBorderClass} overflow-hidden pl-[6px] pr-[6px] min-[992px]:pl-0 min-[992px]:pr-0`}
        >
          <CartAwareProductCard
            apiProduct={product}
            theme={cardTheme}
            settings={{
              showAddToCartToast: true,
              ...(actionButtonText ? { actionButtonText } : {}),
              ...(soldOutText ? { soldOutText } : {}),
            }}
            logTag="HairCareBFFs"
          />
        </div>
      );
    },
    [products, itemBorderClass, cardTheme, actionButtonText, soldOutText]
  );

  if (tabs.length === 0) {
    return null;
  }

  const gridAnimationClass =
    gridAnimationPhase === "entering" || gridAnimationPhase === "idle"
      ? "translate-y-0 opacity-100"
      : "translate-y-3 opacity-0";

  return (
    <section
      className="relative overflow-hidden mt-[25px] md:mt-14 pt-[32.4px] md:pt-14"
      style={{}}
    >
      {/* Background image — mobile */}
      <div className="absolute inset-0 z-[0] md:hidden">
        <Image
          src={backgroundImageMobile.src}
          alt={backgroundImageMobile.alt}
          fill
          className="object-cover"
          loading="lazy"
          aria-hidden="true"
        />
      </div>

      {/* Background image — desktop */}
      <div className="absolute inset-0 z-[0] hidden md:block">
        <Image
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          fill
          className="object-cover"
          loading="lazy"
          aria-hidden="true"
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-[1] mx-auto xl:mx-5 md:px-[30px] xl:px-[50px] pb-[32px] md:pb-[47px] lg:pb-[56px]">
        {/* Tabs head: heading + tab buttons */}
        <div className="flex flex-col items-start md:items-center text-center mb-6 md:mb-[30px] px-[15px] gap-[15px] md:gap-[30px]">
          {/* Heading — rich HTML; <strong> in the source becomes the bold part. */}
          <h4
            className="text-[20px] min-[375px]:text-[22px] md:text-[24px] lg:text-[28px] leading-[24px] min-[375px]:leading-[26.4px] md:leading-[28.8px] lg:leading-[33.6px] [&_strong]:font-bold"
            style={{
              color: "#ffffff",
              fontWeight: 400,
              margin: 0,
            }}
            // eslint-disable-next-line no-restricted-syntax
            dangerouslySetInnerHTML={{ __html: headingRich }}
          />

          {/* Tab buttons */}
          <div
            className="flex overflow-x-auto hide-scrollbar"
            style={{ gap: "8px", maxWidth: "100%" }}
          >
            {tabs.map((tab, idx) => (
              <button
                key={tab.handle}
                type="button"
                onClick={() => handleTabClick(idx)}
                className="flex-shrink-0 cursor-pointer text-[12px] leading-[14.4px] min-[375px]:text-[14px] min-[375px]:leading-[16.8px] md:text-[16px] md:leading-[19.2px]"
                style={{
                  color: "#ffffff",
                  backgroundColor: "transparent",
                  border:
                    idx === activeTabIndex
                      ? "1px solid rgb(128, 128, 128)"
                      : "1px solid transparent",
                  borderRadius: idx === activeTabIndex ? "4px" : "0px",
                  padding: "4px 8px",
                  fontWeight: 500,
                  transition: "all 0.4s 0.1s",
                  whiteSpace: "nowrap",
                }}
                aria-pressed={idx === activeTabIndex}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel area */}
        <div
          className={`xl:mx-auto xl:max-w-[1300px] ${outerBorderClass} md:rounded-lg transition-all ease-out will-change-transform will-change-opacity ${
            gridAnimationClass
          } ${gridAnimationPhase !== "idle" ? "pointer-events-none" : ""}`}
          style={{
            transitionDuration: `${
              gridAnimationPhase === "exiting"
                ? GRID_EXIT_DURATION_MS
                : GRID_ENTER_DURATION_MS
            }ms`,
          }}
        >
          <SwipeCarousel
            itemCount={products.length}
            breakpoints={carouselBreakpoints}
            resetKey={activeTabIndex}
            renderItem={renderProduct}
            className="pl-[12px] pr-[12px] min-[992px]:pl-0 min-[992px]:pr-0"
            renderPrev={(onClick, disabled) => (
              <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`absolute left-[-30px] top-1/2 -translate-y-1/2 z-[3] items-center justify-center cursor-pointer text-gray-700 hover:text-loading-blue transition-colors duration-300 ${
                  disabled ? "hidden" : "hidden lg:flex"
                }`}
                aria-label="Previous products"
              >
                <ChevronLeftIcon />
              </button>
            )}
            renderNext={(onClick, disabled) => (
              <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`absolute right-[-30px] top-1/2 -translate-y-1/2 z-[3] items-center justify-center cursor-pointer text-gray-700 hover:text-loading-blue transition-colors duration-300 ${
                  disabled ? "hidden" : "hidden lg:flex"
                }`}
                aria-label="Next products"
              >
                <ChevronRightIcon />
              </button>
            )}
          />
        </div>

        {/* View all link — reuses server products as thumbnails when handles
            match (no extra fetch); lazy-fetches via getCollection on intersection
            when settings.collections[i].viewAllCollectionHandle differs. */}
        {activeTab && activeTab.totalProducts > 0 && (
          <LazyViewAllButton
            theme="dark"
            serverCollectionHandle={activeTab.handle}
            configCollectionHandle={activeTab.viewAllHandle}
            serverTotalProducts={activeTab.totalProducts}
            serverProducts={products}
          />
        )}
      </div>
    </section>
  );
});
