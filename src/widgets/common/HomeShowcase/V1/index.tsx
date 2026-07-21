"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Image } from "@/ui/atomic/Image";
import { getCommerceClient } from "@/config/commerce";
import { CollectionCard } from "@/widgets/common/CollectionList/V1/CollectionCard";
import { HomeShowcaseProps } from "../types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

/* Neutral placeholder shown when a product image URL 404s / fails to load. */
const IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='360'%20height='360'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3C/svg%3E";

interface RawProduct {
  id?: string;
  productId?: string;
  title?: string;
  handle?: string;
  price?: number;
  minPrice?: number;
  compare_at_price?: number | null;
  image_url?: string;
  images?: Array<string | { url?: string }>;
  product_availability?: boolean;
}

interface RawCollection {
  id?: string;
  title?: string;
  handle?: string;
  image_url?: string;
  image?: { url?: string; src?: string } | null;
  products?: unknown[];
}

/** Format paise → "₹1,299" (Indian grouping); empty when 0/unknown. */
function money(paise?: number): string {
  const n = Number(paise) || 0;
  if (n <= 0) {
    return "";
  }
  return `₹${Math.round(n / 100).toLocaleString("en-IN")}`;
}

function productImage(p: RawProduct): string {
  if (p.image_url) {
    return p.image_url;
  }
  const imgs = p.images ?? [];
  const first = imgs[0];
  if (typeof first === "string") {
    return first;
  }
  return first?.url ?? "";
}

const PLACEHOLDER_ICON = (
  <svg
    className="h-10 w-10 text-neutral-300"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Trust badges (generic, no merchant assets)                          */
/* ------------------------------------------------------------------ */

const TRUST_BADGES: { label: string; sub: string; icon: React.ReactNode }[] = [
  {
    label: "Free Shipping",
    sub: "On all prepaid orders",
    icon: (
      <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 19a2 2 0 100-4 2 2 0 000 4zM18 19a2 2 0 100-4 2 2 0 000 4z" />
    ),
  },
  {
    label: "Secure Checkout",
    sub: "100% protected payments",
    icon: (
      <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6zM9.5 12l1.8 1.8 3.5-3.6" />
    ),
  },
  {
    label: "Easy Returns",
    sub: "Hassle-free 7-day returns",
    icon: <path d="M3 7v6h6M4 13a8 8 0 108-9" />,
  },
  {
    label: "24×7 Support",
    sub: "We're here to help",
    icon: (
      <path d="M4 12a8 8 0 1116 0v4a2 2 0 01-2 2h-1v-6h3M4 12v4a2 2 0 002 2h1v-6H4" />
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  V1                                                                  */
/* ------------------------------------------------------------------ */

export const V1: React.FC<HomeShowcaseProps> = ({ settings }) => {
  const heroEyebrow = settings?.heroEyebrow ?? "New season, new essentials";
  const heroHeadline =
    settings?.heroHeadline ?? "Everything you love, in one place";
  const heroSubtext =
    settings?.heroSubtext ??
    "Discover our full range of curated products — quality picks, honest prices, delivered to your door.";
  const heroCtaText = settings?.heroCtaText ?? "Browse all collections";
  const heroCtaHref = settings?.heroCtaHref ?? "/collections";
  const featuredHeading = settings?.featuredHeading ?? "Featured products";
  const collectionsHeading =
    settings?.collectionsHeading ?? "Shop by collection";

  const [collections, setCollections] = useState<RawCollection[]>([]);
  const [products, setProducts] = useState<RawProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const client = getCommerceClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cRes = (await client.getCollections({ first: 12 } as any)) as {
          data?: RawCollection[];
        };
        if (cancelled) {
          return;
        }
        const cols = Array.isArray(cRes?.data)
          ? cRes.data.filter((c) => c?.handle)
          : [];
        setCollections(cols);

        // Featured products come from the FIRST collection — NOT the raw
        // products list. The products list includes hidden/unpublished items
        // (tagged `hide__products`) whose PDP redirects to home; a collection
        // only contains storefront-visible products, so every card opens a
        // valid product page.
        // A single collection may be small, so aggregate visible products
        // across the first few collections (deduped) until the rail is full.
        const seen = new Set<string>();
        const featured: RawProduct[] = [];
        for (const c of cols.slice(0, 6)) {
          if (featured.length >= 8 || cancelled) {
            break;
          }
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dRes: any = await client.getCollection(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              { handle: c.handle } as any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              { params: { first: 12 } } as any
            );
            const col = dRes?.data;
            const prods: RawProduct[] =
              col?.products ?? col?.data?.products ?? [];
            for (const p of prods) {
              if (p?.handle && !seen.has(p.handle)) {
                seen.add(p.handle);
                featured.push(p);
                if (featured.length >= 8) {
                  break;
                }
              }
            }
          } catch {
            /* skip this collection on error */
          }
        }
        if (!cancelled) {
          setProducts(featured);
        }
      } catch {
        /* best-effort; sections hide if data can't load */
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full">
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-100" />
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#1D1D1D]/[0.05] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#1D1D1D]/[0.05] blur-3xl"
        />
        <div className="relative mx-auto max-w-[1180px] px-5 py-16 text-center md:py-24 lg:py-28">
          <p className="mb-4 inline-block rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#1D1D1D] ring-1 ring-black/[0.04] backdrop-blur">
            {heroEyebrow}
          </p>
          <h1 className="mx-auto max-w-3xl text-balance text-3xl font-bold leading-[1.1] tracking-tight text-[#1D1D1D] sm:text-4xl md:text-5xl lg:text-6xl">
            {heroHeadline}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base">
            {heroSubtext}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={heroCtaHref}
              className="inline-flex items-center gap-2 rounded-full bg-[#1D1D1D] px-7 py-3.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-black"
            >
              {heroCtaText}
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- TRUST BADGES ---------------- */}
      <section className="border-y border-black/[0.06] bg-white">
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-x-6 gap-y-5 px-5 py-7 md:grid-cols-4 md:py-8">
          {TRUST_BADGES.map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-100 text-[#1D1D1D]">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {b.icon}
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[#1D1D1D]">
                  {b.label}
                </span>
                <span className="block truncate text-xs text-neutral-500">
                  {b.sub}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- FEATURED PRODUCTS ---------------- */}
      {(loading || products.length > 0) && (
        <section className="mx-auto max-w-[1400px] px-[15px] pt-14 md:px-[30px] md:pt-20 xl:px-[50px]">
          <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-[#1D1D1D] md:text-3xl">
              {featuredHeading}
            </h2>
            <Link
              href="/collections"
              className="shrink-0 text-sm font-semibold text-[#1D1D1D] underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square animate-pulse rounded-2xl bg-neutral-100" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-100" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {products.slice(0, 8).map((p) => {
                const img = productImage(p);
                const price = money(p.price ?? p.minPrice);
                const compare = money(p.compare_at_price ?? undefined);
                const soldOut = p.product_availability === false;
                return (
                  <Link
                    key={p.id ?? p.handle}
                    href={`/products/${p.handle}`}
                    className="group block"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-black/[0.06] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                      {img ? (
                        <Image
                          src={img}
                          alt={p.title ?? ""}
                          fallbackSrc={IMAGE_PLACEHOLDER}
                          fill
                          sizes="(max-width:768px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
                          {PLACEHOLDER_ICON}
                        </div>
                      )}
                      {soldOut && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 shadow-sm">
                          Sold out
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-sm font-medium leading-snug text-[#1D1D1D]">
                      {p.title}
                    </h3>
                    {price && (
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#1D1D1D]">
                          {price}
                        </span>
                        {compare && compare !== price && (
                          <span className="text-xs text-neutral-400 line-through">
                            {compare}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ---------------- SHOP BY COLLECTION ---------------- */}
      <section className="mx-auto max-w-[1400px] px-[15px] pb-[70px] pt-14 md:px-[30px] md:pb-[88px] md:pt-20 xl:px-[50px]">
        <div className="mb-6 md:mb-8">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-[#1D1D1D] md:text-3xl lg:text-[38px]">
            {collectionsHeading}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-2xl bg-neutral-100 ring-1 ring-black/[0.04]"
              />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <p className="py-10 text-center text-neutral-500">
            No collections found.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
            {collections.map((c, i) => (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <CollectionCard
                key={c.id ?? c.handle}
                collection={c as any}
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default V1;
