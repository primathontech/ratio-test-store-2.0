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
  /**
   * Dedup key for the LOAD_FILTERS effect. Tracks the (handle, actions)
   * pair instead of just the handle because the Zustand store is rebuilt
   * via `useMemo(() => createActionStore(...), [normalizedData, …])`
   * whenever the user navigates to a new collection — and even a soft
   * re-click of the same header link can land here with a fresh `data`
   * prop reference, re-creating the store. A handle-only ref would say
   * "already fetched" while the brand-new store has `filterData: null`,
   * leaving the sidebar empty (the exact symptom of this bug).
   *
   * `actions` is a unique function reference per store, so including it
   * in the dedup key naturally invalidates whenever the store rebuilds.
   */
  const lastFetchedRef = useRef<{
    handle: string;
    actions: unknown;
  } | null>(null);
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

  // Trigger filter loading whenever:
  //   1. The collection handle changes (user navigated to a new collection)
  //   2. The store has been rebuilt (new `actions` reference) — this catches
  //      the case where the user clicks the same header link and Next.js
  //      hands us a new `data` prop, which causes `useStore` to be
  //      recreated with `filterData: null`. A handle-only guard would
  //      miss this and leave the sidebar empty.
  //
  // Dedup against React StrictMode double-mount + rapid re-renders by
  // comparing both halves of the key against the last fired pair.
  useEffect(() => {
    if (!collectionHandle || !actions) {
      return;
    }
    const prev = lastFetchedRef.current;
    const alreadyFetched =
      prev !== null &&
      prev.handle === collectionHandle &&
      prev.actions === actions;
    if (alreadyFetched) {
      return;
    }
    lastFetchedRef.current = { handle: collectionHandle, actions };
    actions("LOAD_FILTERS", collectionHandle);
  }, [collectionHandle, actions]);

  const contextValue: ProviderContext = { actions, feedback, state };

  return (
    <DefaultContext.Provider value={contextValue}>
      {children}
    </DefaultContext.Provider>
  );
}
