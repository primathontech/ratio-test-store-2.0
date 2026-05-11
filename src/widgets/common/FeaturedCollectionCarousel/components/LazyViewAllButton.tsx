"use client";

import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { getCommerceClient } from "@/config/commerce";
import type { ApiProduct } from "../types";

const ChevronRightIcon = () => (
  <svg
    width="7"
    height="12"
    viewBox="0 0 7 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L6 6L1 11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function getMainImage(product: ApiProduct): string {
  return (
    product.images?.find((img) => img.is_main)?.url || product.image_url || ""
  );
}

type LazyViewAllButtonTheme = "light" | "dark";

interface LazyViewAllButtonProps {
  /** Handle of the collection that was fetched server-side. */
  serverCollectionHandle: string;
  /**
   * Handle that the View All link should redirect to AND from which thumbnails
   * should be sourced. When the same as `serverCollectionHandle`, no extra
   * fetch happens — server products are reused.
   */
  configCollectionHandle: string;
  /** Total products in the server-fetched collection. */
  serverTotalProducts: number;
  /** Server-fetched products (used as thumbnails when handles match). */
  serverProducts: ApiProduct[];
  /**
   * Visual theme. "light" (default) = light grey bg + dark text
   * (FeaturedCollectionCarousel). "dark" = near-black bg + white text
   * (HairCareBFFs).
   */
  theme?: LazyViewAllButtonTheme;
}

interface FetchedCollection {
  products: ApiProduct[];
  total: number;
}

/**
 * Extracts a normalized {products, total} from getCollection's response shape:
 * `{ success, data: { products: [...], productPagination: { total } } }`
 * (also tolerates a few common variants).
 */
function extractFetched(payload: unknown): FetchedCollection | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const root = payload as Record<string, unknown>;
  const data = (root.data ?? root) as Record<string, unknown> | undefined;
  if (!data || typeof data !== "object") {
    return null;
  }
  const products = (data as { products?: unknown }).products;
  const pagination = (data as { productPagination?: { total?: number } })
    .productPagination;
  const meta = (data as { meta?: { total?: number } }).meta;

  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  const total =
    pagination?.total ??
    meta?.total ??
    (root as { meta?: { total?: number } }).meta?.total ??
    products.length;

  return { products: products as ApiProduct[], total };
}

const THEME_STYLES: Record<
  LazyViewAllButtonTheme,
  { bg: string; color: string; textWrapClass: string }
> = {
  light: {
    bg: "#F4F6F8",
    color: "#1D1D1D",
    textWrapClass: "whitespace-nowrap text-black",
  },
  dark: {
    bg: "rgb(29, 29, 29)",
    color: "#ffffff",
    textWrapClass: "whitespace-nowrap text-white",
  },
};

function getLinkStyle(theme: LazyViewAllButtonTheme): React.CSSProperties {
  const { bg, color } = THEME_STYLES[theme];
  return {
    backgroundColor: bg,
    color,
    paddingTop: "6px",
    paddingBottom: "6px",
    borderRadius: "4px",
    fontWeight: 500,
    transition: "all 0.2s",
    gap: "8px",
  };
}

const LINK_CLASS =
  "inline-flex items-center no-underline text-sm md:text-lg pl-4 md:pl-[42px] pr-4 md:pr-[55px] w-full md:w-auto mx-4 md:mx-0 p-1.5 md:p-0 justify-center";

function ThumbnailRow({ products }: { products: ApiProduct[] }) {
  const slice = products.slice(0, 3);
  if (slice.length === 0) {
    return <span className="inline-flex flex-row-reverse items-center" />;
  }
  return (
    <span className="inline-flex flex-row-reverse items-center">
      {slice.map((p, i) => {
        const mainImage = getMainImage(p);
        return (
          <span
            key={p.id ?? i}
            className={`relative inline-flex overflow-hidden rounded-md border border-[#dddddd] md:border-[3px] w-5 md:w-8 h-5 md:h-8 ${
              i === 0 ? "mr-0" : "mr-[-12px]"
            }`}
            style={{ zIndex: slice.length - i }}
          >
            {mainImage ? (
              <Image
                src={
                  mainImage.startsWith("//") ? `https:${mainImage}` : mainImage
                }
                alt=""
                width={27}
                height={27}
                style={{ objectFit: "cover" }}
              />
            ) : null}
          </span>
        );
      })}
    </span>
  );
}

function LazyViewAllButtonContent({
  serverCollectionHandle,
  configCollectionHandle,
  serverTotalProducts,
  serverProducts,
  theme = "light",
}: LazyViewAllButtonProps) {
  const themeStyles = THEME_STYLES[theme];
  const linkStyle = getLinkStyle(theme);
  const handlesMatch = serverCollectionHandle === configCollectionHandle;
  const [fetched, setFetched] = useState<FetchedCollection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Effective values for the link and thumbnails.
  const totalProducts = handlesMatch
    ? serverTotalProducts
    : (fetched?.total ?? 0);
  const displayProducts = handlesMatch
    ? serverProducts
    : (fetched?.products ?? []);
  const redirectUrl = `/collections/${
    handlesMatch ? serverCollectionHandle : configCollectionHandle
  }`;

  // Lazy intersection trigger — only when handles differ.
  useEffect(() => {
    if (handlesMatch) {
      return;
    }
    const node = observerRef.current;
    if (!node) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldFetch(true);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [handlesMatch]);

  // Lazy fetch (only on mismatch and after intersection).
  useEffect(() => {
    if (!shouldFetch || handlesMatch || !configCollectionHandle) {
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        const commerceClient = getCommerceClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = await commerceClient.getCollection({
          handle: configCollectionHandle,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        if (cancelled) {
          return;
        }
        setFetched(extractFetched(result));
      } catch {
        // Swallow — the link still renders, just without thumbnails/count.
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [shouldFetch, handlesMatch, configCollectionHandle]);

  return (
    <div
      ref={observerRef}
      className="flex justify-center mt-[17.4px] md:mt-[30px]"
    >
      <Link
        href={redirectUrl}
        className={LINK_CLASS}
        style={linkStyle}
        data-testid="product-grid-v2-view-all-button"
      >
        {!handlesMatch && isLoading ? (
          <div className="flex-shrink-0 w-[60px] h-[24px] bg-gray-200 animate-pulse rounded" />
        ) : (
          <ThumbnailRow products={displayProducts} />
        )}

        <span
          data-testid="product-grid-v2-view-all-text"
          className="inline-flex gap-1 items-baseline font-medium"
        >
          <span className={themeStyles.textWrapClass}>
            View all{" "}
            {!handlesMatch && isLoading ? (
              <span className="inline-block w-16 h-4 bg-gray-200 animate-pulse rounded" />
            ) : (
              totalProducts > 0 && `${totalProducts} products`
            )}
          </span>
        </span>
        <ChevronRightIcon />
      </Link>
    </div>
  );
}

function Fallback({ theme = "light" }: { theme?: LazyViewAllButtonTheme }) {
  const themeStyles = THEME_STYLES[theme];
  return (
    <div className="flex justify-center mt-[17.4px] md:mt-[30px]">
      <div className={LINK_CLASS} style={getLinkStyle(theme)}>
        <div className="flex-shrink-0 w-[60px] h-[24px] bg-gray-200 animate-pulse rounded" />
        <span className="inline-flex gap-1 items-baseline font-medium">
          <span className={themeStyles.textWrapClass}>
            View all{" "}
            <span className="inline-block w-16 h-4 bg-gray-200 animate-pulse rounded" />
          </span>
        </span>
        <ChevronRightIcon />
      </div>
    </div>
  );
}

export function LazyViewAllButton(props: LazyViewAllButtonProps) {
  return (
    <Suspense fallback={<Fallback theme={props.theme} />}>
      <LazyViewAllButtonContent {...props} />
    </Suspense>
  );
}
