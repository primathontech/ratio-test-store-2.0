"use client";

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

  if (loading) {
    return (
      <section className="px-[15px] md:px-[30px] md:max-w-[1360px] xl:px-[50px] xl:max-w-[1400px] pb-[66px] md:pb-[74px] xl:pb-[88px] mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
            <p className="text-text-light text-sm">Loading collections...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-[15px] md:px-[30px] md:max-w-[1360px] xl:px-[50px] xl:max-w-[1400px] pb-[66px] md:pb-[74px] xl:pb-[88px] mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-text-light text-base">No collections found.</p>
      </div>
    );
  }

  return (
    <section
      className="px-[15px] md:px-[30px] md:max-w-[1360px] xl:px-[50px] xl:max-w-[1400px] pb-[66px] md:pb-[74px] xl:pb-[88px] mx-auto"
      data-testid="collection-list"
    >
      {heading && (
        <h1 className="text-xl md:text-[32px] lg:text-center md:pb-8 md:border-b border-[#D9D9D9] font-normal my-[62px] md:my-[70px] lg:my-[83px] text-black">
          {heading}
        </h1>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 pt-[50px] md:pt-14 xl:pt-[66px] pb-[25px] md:pb-[30px]">
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
