import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  IFeedback,
  TAction,
  TActionState,
  TActionStateRecord,
  ProviderState,
  ISort,
  IActionPayload,
  IApplyFilter,
} from "./type";
import {
  createFeedbackImplementation,
  createDefaultActionState,
} from "./shared";
import { updateFiltersArray } from "../utils/filterUtils";
import { createUrlSearchParams } from "../utils/urlUpdater";
import { collectionApiClient } from "../../api/client";
import { TransformedCollection } from "../../api/types";
import { convertFiltersToApiFormat } from "../../utils/filterConverter";

interface ActionStore {
  state: ProviderState;
  feedback: IFeedback;
  actionType: TActionStateRecord;
  actions: (
    type: TAction,
    payload?: IActionPayload,
    browserEvent?: Event
  ) => Promise<void>;
  updateActionState: (
    type: TAction,
    state: TActionState,
    data?: unknown,
    message?: string,
    error?: Error
  ) => void;
  clearAllFilters: () => Promise<void>;
  handleFilter: (payload: IApplyFilter) => Promise<void>;
  handleSort: (payload?: ISort) => Promise<void>;
  loadMore: () => Promise<void>;
  loadCollection: (handle: string) => Promise<void>;
  loadFilters: (handle: string) => Promise<void>;
  refreshFiltersWithAppliedFilters: () => Promise<void>;
}

export const createActionStore = (
  initialCollection?: any,
  updateUrl?: (params: URLSearchParams) => void
) => {
  return create<ActionStore>()(
    devtools(
      (set, get) => ({
        state: {
          collection: initialCollection?.data || null,
          sort: undefined,
          filters: [],
          pagination: initialCollection?.meta?.pagination || {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: undefined,
            endCursor: undefined,
          },
          filterData: initialCollection?.filters || null,
        },

        feedback: createFeedbackImplementation(
          () => get().actionType,
          () => get().state
        ),

        actionType: createDefaultActionState(),

        actions: async (type: TAction, payload?: IActionPayload) => {
          const {
            handleFilter,
            handleSort,
            clearAllFilters,
            loadMore,
            loadFilters,
          } = get();

          switch (type) {
            case "FILTER":
              await handleFilter(payload as IApplyFilter);
              break;
            case "SORT":
              await handleSort(payload as ISort);
              break;
            case "CLEAR_ALL_FILTERS":
              await clearAllFilters();
              break;
            case "LOAD_MORE":
              await loadMore();
              break;
            case "LOAD_FILTERS":
              await loadFilters(payload as string);
              break;
            default:
              console.warn(`Action ${type} not implemented`);
          }
        },

        updateActionState: (
          type: TAction,
          state: TActionState,
          data?: unknown,
          message?: string,
          error?: Error
        ) => {
          set((prev) => ({
            actionType: {
              ...prev.actionType,
              [type]: {
                state,
                data,
                message,
                error,
                timestamp: Date.now(),
              },
            },
          }));
        },

        clearAllFilters: async () => {
          const { updateActionState, state } = get();

          updateActionState(
            "CLEAR_ALL_FILTERS",
            "LOADING",
            null,
            "Clearing filters..."
          );

          set((prev) => ({
            state: { ...prev.state, filters: [] },
          }));

          if (updateUrl) {
            const urlParams = createUrlSearchParams([], state.sort);
            updateUrl(urlParams);
          }

          try {
            const collection = state.collection as TransformedCollection;
            if (!collection?.handle) {
              throw new Error("Collection handle not available");
            }

            const response = await collectionApiClient.fetchCollection(
              collection.handle,
              {
                sort: state.sort?.value,
                reverse: state.sort?.order === "desc",
                filters: [],
                first: 12,
              }
            );

            if (response) {
              set((prev) => ({
                state: {
                  ...prev.state,
                  collection: response,
                  pagination: {
                    hasNextPage: response.hasNextPage,
                    hasPreviousPage: response.hasPreviousPage,
                    startCursor: response.startCursor,
                    endCursor: response.endCursor,
                  },
                },
              }));

              updateActionState(
                "CLEAR_ALL_FILTERS",
                "SUCCESS",
                response,
                "Filters cleared successfully"
              );
              get().refreshFiltersWithAppliedFilters();
            } else {
              updateActionState(
                "CLEAR_ALL_FILTERS",
                "ERROR",
                null,
                "Filter clear failed"
              );
            }
          } catch (error) {
            updateActionState(
              "CLEAR_ALL_FILTERS",
              "ERROR",
              null,
              "Filter clear failed",
              error as Error
            );
          }
        },

        handleFilter: async (payload: IApplyFilter) => {
          const { updateActionState, state } = get();
          updateActionState("FILTER", "LOADING", null, "Processing filters...");

          const currentFilters = state.filters || [];
          const updatedFilters = updateFiltersArray(currentFilters, payload);

          set((prev) => ({
            state: { ...prev.state, filters: updatedFilters },
          }));

          if (updateUrl) {
            const urlParams = createUrlSearchParams(updatedFilters, state.sort);
            updateUrl(urlParams);
          }

          try {
            const apiFilters = convertFiltersToApiFormat(updatedFilters);
            const collection = state.collection as TransformedCollection;
            if (!collection?.handle) {
              throw new Error("Collection handle not available");
            }

            const response = await collectionApiClient.fetchCollection(
              collection.handle,
              {
                filters: apiFilters,
                sort: state.sort?.value,
                reverse: state.sort?.order === "desc",
                first: 12,
              }
            );

            if (response) {
              set((prev) => ({
                state: {
                  ...prev.state,
                  collection: response,
                  pagination: {
                    hasNextPage: response.hasNextPage,
                    hasPreviousPage: response.hasPreviousPage,
                    startCursor: response.startCursor,
                    endCursor: response.endCursor,
                  },
                },
              }));

              updateActionState(
                "FILTER",
                "SUCCESS",
                response,
                "Filters applied successfully"
              );
              get().refreshFiltersWithAppliedFilters();
            } else {
              updateActionState("FILTER", "ERROR", null, "Filter failed");
            }
          } catch (error) {
            updateActionState(
              "FILTER",
              "ERROR",
              null,
              "Filter failed",
              error as Error
            );
          }
        },

        handleSort: async (payload?: ISort) => {
          const { updateActionState, state } = get();
          updateActionState("SORT", "LOADING", null, "Sorting products...");

          set((prev) => ({
            state: { ...prev.state, sort: payload },
          }));

          if (updateUrl) {
            const updatedFilters = state.filters || [];
            const urlParams = createUrlSearchParams(updatedFilters, payload);
            updateUrl(urlParams);
          }

          try {
            const currentFilters = state.filters || [];
            const apiFilters = convertFiltersToApiFormat(currentFilters);
            const collection = state.collection as TransformedCollection;
            if (!collection?.handle) {
              throw new Error("Collection handle not available");
            }

            const response = await collectionApiClient.fetchCollection(
              collection.handle,
              {
                filters: apiFilters,
                sort: payload?.value,
                reverse: payload?.order === "desc",
                first: 12,
              }
            );

            if (response) {
              set((prev) => ({
                state: {
                  ...prev.state,
                  collection: response,
                  pagination: {
                    hasNextPage: response.hasNextPage,
                    hasPreviousPage: response.hasPreviousPage,
                    startCursor: response.startCursor,
                    endCursor: response.endCursor,
                  },
                },
              }));
              updateActionState("SORT", "SUCCESS", response, "Sort applied");
            } else {
              updateActionState("SORT", "ERROR", null, "Sort failed");
            }
          } catch (error) {
            updateActionState(
              "SORT",
              "ERROR",
              null,
              "Sort failed",
              error as Error
            );
          }
        },

        loadMore: async () => {
          const { updateActionState, state } = get();
          updateActionState("LOAD_MORE", "LOADING", null, "Loading more...");

          try {
            const currentFilters = state.filters || [];
            const apiFilters = convertFiltersToApiFormat(currentFilters);

            const collection = state.collection as TransformedCollection;
            if (!collection?.handle) {
              updateActionState(
                "LOAD_MORE",
                "ERROR",
                null,
                "Collection not loaded yet"
              );
              return;
            }

            const response = await collectionApiClient.fetchCollection(
              collection.handle,
              {
                sort: state.sort?.value,
                reverse: state.sort?.order === "desc",
                filters: apiFilters,
                after: collection.endCursor,
                first: 12,
              }
            );

            if (response) {
              const existingProducts = collection.products || [];
              const newProducts = [...existingProducts, ...response.products];

              const updatedCollection = {
                ...collection,
                products: newProducts,
                hasNextPage: response.hasNextPage,
                hasPreviousPage: response.hasPreviousPage,
                endCursor: response.endCursor,
                productCount: collection.productCount,
              };

              set((prev) => ({
                state: {
                  ...prev.state,
                  collection: updatedCollection,
                  pagination: {
                    hasNextPage: response.hasNextPage,
                    hasPreviousPage: response.hasPreviousPage,
                    startCursor: response.startCursor,
                    endCursor: response.endCursor,
                  },
                },
              }));

              updateActionState(
                "LOAD_MORE",
                "SUCCESS",
                response,
                "Loaded successfully"
              );
            } else {
              updateActionState("LOAD_MORE", "ERROR", null, "Load more failed");
            }
          } catch (error) {
            updateActionState(
              "LOAD_MORE",
              "ERROR",
              null,
              "Load more failed",
              error as Error
            );
          }
        },

        loadCollection: async (handle: string) => {
          const { updateActionState } = get();
          updateActionState(
            "LOAD_COLLECTION",
            "LOADING",
            null,
            "Loading collection..."
          );

          try {
            const response = await collectionApiClient.fetchCollection(handle, {
              first: 12,
            });

            if (response) {
              set((prev) => ({
                state: {
                  ...prev.state,
                  collection: response,
                  pagination: {
                    hasNextPage: response.hasNextPage,
                    hasPreviousPage: response.hasPreviousPage,
                    startCursor: response.startCursor,
                    endCursor: response.endCursor,
                  },
                },
              }));

              updateActionState(
                "LOAD_COLLECTION",
                "SUCCESS",
                response,
                "Collection loaded successfully"
              );
            } else {
              updateActionState(
                "LOAD_COLLECTION",
                "ERROR",
                null,
                "Collection load failed"
              );
            }
          } catch (error) {
            updateActionState(
              "LOAD_COLLECTION",
              "ERROR",
              null,
              "Collection load failed",
              error as Error
            );
          }
        },

        loadFilters: async (handle: string) => {
          const { updateActionState } = get();

          updateActionState(
            "LOAD_FILTERS",
            "LOADING",
            null,
            "Loading filters..."
          );

          try {
            const filters =
              await collectionApiClient.fetchCollectionFilters(handle);

            if (filters) {
              set((prev) => ({
                state: { ...prev.state, filterData: filters.filters },
              }));

              updateActionState(
                "LOAD_FILTERS",
                "SUCCESS",
                filters,
                "Filters loaded successfully"
              );
            } else {
              updateActionState(
                "LOAD_FILTERS",
                "ERROR",
                null,
                "Filters load failed"
              );
            }
          } catch (error) {
            updateActionState(
              "LOAD_FILTERS",
              "ERROR",
              null,
              "Filters load failed",
              error as Error
            );
          }
        },

        refreshFiltersWithAppliedFilters: async () => {
          const { state } = get();

          try {
            const collection = state.collection as TransformedCollection;
            if (!collection?.handle) {
              return;
            }

            const currentFilters = state.filters || [];
            const apiFilters = convertFiltersToApiFormat(currentFilters);

            const filters = await collectionApiClient.fetchCollectionFilters(
              collection.handle,
              { appliedFilters: apiFilters }
            );

            if (filters) {
              set((prev) => ({
                state: { ...prev.state, filterData: filters.filters },
              }));
            }
          } catch (error) {
            console.error("[FILTER REFRESH] Error:", error);
          }
        },
      }),
      { name: "collection-action-store" }
    )
  );
};

export const useActionStore = createActionStore();
