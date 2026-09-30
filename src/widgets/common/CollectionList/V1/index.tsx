"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { getCommerceClient } from "@/config/commerce";
import {
  CollectionListProps,
  ICollectionListData,
  ICollectionListItem,
} from "../types";
import { CollectionCard } from "./CollectionCard";
import { CollectionPagination } from "./CollectionPagination";

const DEFAULT_PAGE_SIZE = 6;

function normalizeCollections(
  data: ICollectionListData | undefined
): ICollectionListItem[] {
  if (!data) {
    return [];
  }
  if (Array.isArray(data.data)) {
    return data.data;
  }
  if (Array.isArray(data.collections)) {
    return data.collections;
  }
  if (Array.isArray(data.nodes)) {
    return data.nodes;
  }
  if (Array.isArray(data.edges)) {
    return data.edges.map((e) => e.node).filter(Boolean);
  }
  return [];
}

function normalizeTotalPages(
  data: ICollectionListData | undefined,
  fallbackLimit: number
): number {
  const pag = data?.meta?.pagination ?? data?.pagination;
  if (pag?.totalPages) {
    return pag.totalPages;
  }
  if (pag?.total) {
    const limit = pag.limit ?? fallbackLimit;
    return Math.max(1, Math.ceil(pag.total / limit));
  }
  return 1;
}

async function fetchCollectionsPage(
  page: number,
  limit: number
): Promise<ICollectionListData | null> {
  try {
    const commerceClient = getCommerceClient();
    // Mirror the SSR data-source signature exactly:
    // first arg = `params` (kept empty), second arg = `options.params`
    // carrying { page, limit }. The custom (GoKwik) adapter reads pagination
    // from options.params.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await commerceClient.getCollections(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { params: { page, limit } } as any
    );

    // Upstream typically returns `{ data: [...], meta: { pagination } }`
    // (GoKwik shape). Some adapters may wrap it; unwrap if needed.
    if (result && typeof result === "object") {
      if (result.data && result.meta) {
        return result as ICollectionListData;
      }
      if (
        result.data &&
        typeof result.data === "object" &&
        !Array.isArray(result.data)
      ) {
        return result.data as ICollectionListData;
      }
      return result as ICollectionListData;
    }
    return null;
  } catch {
    return null;
  }
}

const CollectionListContent: React.FC<CollectionListProps> = ({
  data,
  settings,
}) => {
  const heading = settings?.heading ?? "All Collections";
  const pageSize = settings?.pageSize ?? DEFAULT_PAGE_SIZE;

  const searchParams = useSearchParams();
  const currentPage = Math.max(
    1,
    parseInt(searchParams.get("page") ?? "1", 10) || 1
  );

  const [collections, setCollections] = useState<ICollectionListItem[]>(() =>
    normalizeCollections(data)
  );
  const [totalPages, setTotalPages] = useState<number>(() =>
    normalizeTotalPages(data, pageSize)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset to SSR data on page 1, fetch for other pages
  useEffect(() => {
    if (currentPage === 1) {
      setCollections(normalizeCollections(data));
      setTotalPages(normalizeTotalPages(data, pageSize));
      setError("");
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      const result = await fetchCollectionsPage(currentPage, pageSize);
      if (cancelled) {
        return;
      }
      if (!result) {
        setError("Failed to load collections. Please try again.");
        setLoading(false);
        return;
      }
      setCollections(normalizeCollections(result));
      setTotalPages(normalizeTotalPages(result, pageSize));
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [currentPage, data, pageSize]);

  const containerClass =
    "px-[15px] md:px-[30px] md:max-w-[1360px] xl:px-[50px] xl:max-w-[1400px] pb-[66px] md:pb-[74px] xl:pb-[88px] mx-auto";

  const PageHeader = () => (
    <header className="pt-[44px] pb-8 text-center md:pt-[60px] md:pb-10">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
        Shop
      </p>
      <h1 className="font-body text-3xl font-semibold tracking-tight text-[#1D1D1D] md:text-[38px]">
        {heading}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-500 md:text-base">
        Explore our full range — every collection, in one place.
      </p>
    </header>
  );

  if (loading) {
    return (
      <section className={containerClass}>
        <PageHeader />
        <div className="grid grid-cols-2 gap-3 pb-[25px] md:grid-cols-3 md:gap-5 md:pb-[30px] xl:grid-cols-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-2xl bg-neutral-100 ring-1 ring-black/[0.04]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={containerClass}>
        <PageHeader />
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="mx-auto max-w-sm text-center">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-neutral-100 text-neutral-400">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="mb-5 text-[15px] text-neutral-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center rounded-full bg-[#1D1D1D] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (collections.length === 0) {
    return (
      <section className={containerClass}>
        <PageHeader />
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="mx-auto max-w-sm text-center">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-neutral-100 text-neutral-400">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <h2 className="mb-2 text-lg font-semibold text-[#1D1D1D]">
              No collections yet
            </h2>
            <p className="mb-6 text-[15px] leading-relaxed text-neutral-500">
              There are no collections to show right now. Check back soon.
            </p>
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-[#1D1D1D] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={containerClass} data-testid="collection-list">
      <PageHeader />

      <div className="grid grid-cols-2 gap-3 pb-[25px] sm:grid-cols-2 md:grid-cols-3 md:gap-5 md:pb-[30px] xl:grid-cols-4">
        {collections.map((collection, index) => (
          <CollectionCard
            key={collection.id ?? collection.handle}
            collection={collection}
            index={index}
          />
        ))}
      </div>

      <CollectionPagination currentPage={currentPage} totalPages={totalPages} />
    </section>
  );
};

export const V1: React.FC<CollectionListProps> = (props) => (
  <Suspense>
    <CollectionListContent {...props} />
  </Suspense>
);

export default V1;
