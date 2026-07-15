"use client";

/**
 * The session's WORKING MEMORY — everything the agent "remembers" within a
 * conversation, held as refs (mutated by tools, read across turns, never a
 * re-render trigger). Grouped here so the memory model is one named unit that the
 * ToolContext, the PDP-prefetch effect, and session reset all share, instead of a
 * loose pile of refs living in the component.
 *
 * Nothing here is provider-, UI-, or merchant-specific: it's just the shape of
 * what a shopping conversation needs to keep in mind.
 */

import { useCallback, useMemo, useRef } from "react";
import type { TransformedProduct } from "../catalog";
import type { VoiceProductDetail } from "../productDetail";

/** The last reversible cart change, so "undo" / "take it back" can restore it.
 *  "qty" covers add + quantity-update (restore prevQty, or remove if it was 0);
 *  "removed" covers a removal (re-add the captured line). Kept tiny + data-only. */
export type LastCartMutation =
  | {
      kind: "qty";
      productId: string;
      variantId?: string;
      prevQty: number;
      title: string;
    }
  | {
      kind: "removed";
      item: {
        id: string;
        productId?: string;
        variantId?: string;
        title: string;
        price?: unknown;
        image?: string;
        quantity: number;
      };
    };

export interface VoiceMemory {
  /** The full fetched result set (up to workingSetSize) — the immutable "base". */
  searchResultsRef: React.MutableRefObject<TransformedProduct[]>;
  /** The current VIEW after filter/sort — what ordinals ("the second one") point
   *  to. clear_filters restores it from searchResultsRef. */
  lastResultsRef: React.MutableRefObject<TransformedProduct[]>;
  /** The product the shopper is focused on (opened/detailed by voice, or the PDP
   *  they navigated to themselves) so "add this" works off a product page. */
  currentProductRef: React.MutableRefObject<TransformedProduct | null>;
  /** Full normalized detail of the product on the current PDP (from
   *  /api/voice-product), prefetched on navigation for instant PDP awareness. */
  currentProductDetailRef: React.MutableRefObject<VoiceProductDetail | null>;
  /** The store's REAL collections, lazily loaded (never guessed). */
  collectionsRef: React.MutableRefObject<{ handle: string; title: string }[]>;
  /** Per-product rating cache so sort-by-rating / compare don't refetch reviews. */
  ratingsCacheRef: React.MutableRefObject<
    Map<string, { avg: number; total: number }>
  >;
  /** A small ring of RECENT result sets (each search overwrites the working set, so
   *  this is what lets "the shoes you showed me earlier" still resolve). Bounded. */
  searchHistoryRef: React.MutableRefObject<
    { query: string; products: TransformedProduct[] }[]
  >;
  /** The last reversible cart change, for "undo" / "take it back". */
  lastMutationRef: React.MutableRefObject<LastCartMutation | null>;
  /** Reset the per-conversation state at the start of a new session. */
  reset: () => void;
}

export function useVoiceMemory(): VoiceMemory {
  const searchResultsRef = useRef<TransformedProduct[]>([]);
  const lastResultsRef = useRef<TransformedProduct[]>([]);
  const currentProductRef = useRef<TransformedProduct | null>(null);
  const currentProductDetailRef = useRef<VoiceProductDetail | null>(null);
  const collectionsRef = useRef<{ handle: string; title: string }[]>([]);
  const ratingsCacheRef = useRef<Map<string, { avg: number; total: number }>>(
    new Map()
  );
  const searchHistoryRef = useRef<
    { query: string; products: TransformedProduct[] }[]
  >([]);
  const lastMutationRef = useRef<LastCartMutation | null>(null);

  const reset = useCallback(() => {
    // Clear the previous conversation's product focus AND result view so a fresh
    // session can't act on stale results (e.g. "open the second one" before any
    // new search). The collection list and rating cache are store-level and
    // stable, so they're safe to keep warm across sessions.
    currentProductRef.current = null;
    currentProductDetailRef.current = null;
    searchResultsRef.current = [];
    lastResultsRef.current = [];
    searchHistoryRef.current = [];
    lastMutationRef.current = null;
  }, []);

  // Stable identity so downstream useMemo/useEffect deps don't churn each render.
  return useMemo(
    () => ({
      searchResultsRef,
      lastResultsRef,
      currentProductRef,
      currentProductDetailRef,
      collectionsRef,
      ratingsCacheRef,
      searchHistoryRef,
      lastMutationRef,
      reset,
    }),
    [reset]
  );
}
