"use client";

import { usePathname } from "next/navigation";
import { createContext, useEffect, useMemo, useRef } from "react";
import { collectionApiClient } from "../../api/client";
import { CollectionApiResponse } from "../../api/types";
import { createUrlUpdater } from "../utils/urlUpdater";
import {
  createDefaultActionState,
  createFeedbackImplementation,
} from "./shared";
import {
  IActionPayload,
  ProviderContext,
  ProviderProps,
  TAction,
} from "./type";
import { createActionStore } from "./useActionStore";

export const DefaultContext = createContext<ProviderContext>({
  actions: async (
    _type: TAction,
    _payload?: IActionPayload,
    _browserEvent?: Event
  ) => Promise.resolve(),
  feedback: createFeedbackImplementation(createDefaultActionState, () => ({
    collection: null,
    sort: undefined,
    filters: [],
    pagination: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: undefined,
      endCursor: undefined,
    },
    filterData: null,
  })),
  state: {
    collection: null,
    sort: undefined,
    filters: [],
    pagination: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: undefined,
      endCursor: undefined,
    },
    filterData: null,
  },
});

export function BaseProvider({ children, data }: ProviderProps) {
  const hasFiltersFetchedRef = useRef(false);
  const pathname = usePathname();
  const updateUrl = useMemo(() => createUrlUpdater(), []);

  // Extract collection handle from URL or transformed data
  const collectionHandle = useMemo(() => {
    if (data && typeof data === "object" && "data" in data) {
      try {
        const apiResponse = data as CollectionApiResponse;
        return apiResponse.data.data.collectionByHandle?.handle;
      } catch (error) {
        console.warn("Failed to extract handle from server data:", error);
      }
    }

    if (pathname) {
      const segments = pathname.split("/").filter(Boolean);
      const collectionIndex = segments.indexOf("collections");
      if (collectionIndex !== -1 && segments[collectionIndex + 1]) {
        return segments[collectionIndex + 1];
      }
    }

    return null;
  }, [pathname, data]);

  // Normalize server-side data — handle the nested API response structure
  const normalizedData = useMemo(() => {
    if (!data) {
      return null;
    }

    try {
      if (
        data &&
        typeof data === "object" &&
        "success" in data &&
        "data" in data
      ) {
        const apiResponse = data as CollectionApiResponse;
        const transformedCollection =
          collectionApiClient.transformCollectionData(apiResponse);

        return {
          data: transformedCollection,
          meta: {
            pagination: {
              hasNextPage: transformedCollection.hasNextPage,
              hasPreviousPage: transformedCollection.hasPreviousPage,
              startCursor: transformedCollection.startCursor,
              endCursor: transformedCollection.endCursor,
            },
          },
        };
      }
      return data;
    } catch (error) {
      console.warn("Failed to normalize server-side collection data:", error);
      return data;
    }
  }, [data]);

  const useStore = useMemo(
    () => createActionStore(normalizedData, updateUrl),
    [normalizedData, updateUrl]
  );

  const actions = useStore((state) => state.actions);
  const feedback = useStore((state) => state.feedback);
  const state = useStore((state) => state.state);

  // Trigger filter loading when component mounts (filters come from client-side calls)
  useEffect(() => {
    if (collectionHandle && actions && !hasFiltersFetchedRef.current) {
      hasFiltersFetchedRef.current = true;
      actions("LOAD_FILTERS", collectionHandle);
    }
  }, [collectionHandle, actions]);

  const contextValue: ProviderContext = { actions, feedback, state };

  return (
    <DefaultContext.Provider value={contextValue}>
      {children}
    </DefaultContext.Provider>
  );
}
