import { getCommerceClient } from "@/config";
import { useState, useRef, useCallback } from "react";

interface CollectionData {
  handle: string;
  title: string;
  products: any[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

interface UseCollectionDataReturn {
  collectionData: CollectionData | null;
  isLoading: boolean;
  error: string | null;
  fetchCollectionData: (handle: string) => Promise<void>;
}

/**
 * Custom hook for lazy loading collection data
 * Uses commerce client getCollection method for consistency
 */
export function useCollectionData(): UseCollectionDataReturn {
  const [collectionData, setCollectionData] = useState<CollectionData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedHandles = useRef<Set<string>>(new Set());

  const fetchCollectionData = useCallback(
    async (handle: string, productsPerCollection: number = 3) => {
      // Prevent duplicate API calls
      if (fetchedHandles.current.has(handle) || isLoading) {
        return;
      }

      setIsLoading(true);
      setError(null);
      fetchedHandles.current.add(handle);

      try {
        const commerceClient = getCommerceClient();
        const collectionResponse = await commerceClient.getCollection({
          handle,
          productLimit: productsPerCollection,
        });

        if (!collectionResponse?.data) {
          throw new Error("No collection data received");
        }

        setCollectionData({
          handle: collectionResponse.data.handle,
          title: collectionResponse.data.title,
          products: collectionResponse.data.products || [],
          meta: collectionResponse.data.productPagination,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch collection data";
        setError(errorMessage);
        console.error("Error fetching collection data:", err);

        // Remove from fetched handles on error to allow retry
        fetchedHandles.current.delete(handle);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  return {
    collectionData,
    isLoading,
    error,
    fetchCollectionData,
  };
}
