import type { Locale } from "@shopkit/builder";
import { ReactNode } from "react";

export type TAction =
  | "FILTER"
  | "SORT"
  | "CLEAR_ALL_FILTERS"
  | "LOAD_MORE"
  | "LOAD_COLLECTION"
  | "LOAD_FILTERS";

export type TActionState = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";

export interface IActionFeedback {
  state: TActionState;
  data?: unknown;
  message?: string;
  error?: Error;
  timestamp?: number;
}

export type TActionStateRecord = Record<TAction, IActionFeedback>;

export interface IActionMessage {
  state: TActionState;
  message?: string;
}

export interface IFeedback {
  isIdle: (actionType: TAction) => boolean;
  isLoading: (actionType: TAction) => boolean;
  isSuccess: (actionType: TAction) => boolean;
  isError: (actionType: TAction) => boolean;
  getMessage: (actionType: TAction) => IActionMessage;
  getFeedback: (actionType: TAction) => IActionFeedback;
  getState: () => ProviderState;
}

export interface ISort {
  id: string;
  label: string;
  value: string;
  order: string;
}

export interface IFilter {
  id: string;
  label: string;
  type: "PRICE_RANGE" | "LIST";
  values: {
    id: string;
    label: string;
    input: string;
    count: number;
  }[];
}

export interface IApplyFilter {
  filter: IFilter;
  type: "ADD" | "REMOVE";
  value?: { min: number; max: number };
}

export interface IPagination {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface ProviderState {
  collection?: unknown;
  sort?: ISort;
  filters: IFilter[];
  pagination?: IPagination;
  filterData?: unknown;
}

export type IActionPayload = ISort | IApplyFilter | string;

export interface ProviderContext {
  feedback: IFeedback;
  state: ProviderState;
  actions: (
    type: TAction,
    payload?: IActionPayload,
    browserEvent?: Event
  ) => unknown;
}

export interface ProviderProps {
  data?: unknown;
  locale?: Locale;
  settings?: unknown;
  children?: ReactNode;
}
