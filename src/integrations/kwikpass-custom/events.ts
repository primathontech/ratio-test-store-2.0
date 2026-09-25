/**
 * KwikPass Custom Events
 *
 * Fires the `page_view_kp` DOM CustomEvent that KwikEngage retargeting
 * listens to. Field names on the data interfaces match the KwikEngage doc
 * directly so the payload flows into the DOM event without remapping.
 */

import { getKwikPassConfig } from "./config";

export enum KwikPassEventType {
  PRODUCT_VIEW = "gokwik_product_view",
  COLLECTION_VIEW = "gokwik_collection_view",
  PAGE_VIEW = "gokwik_page_view",
}

export interface KwikPassProductEventData {
  product_id: string;
  variant_id?: string;
  image_url: string;
  name: string;
  price: number | string;
  handle?: string;
  cart_id?: string;
}

export interface KwikPassCollectionEventData {
  cart_id?: string;
  collection_id: string;
  name: string;
  image_url: string;
  handle?: string;
}

export interface KwikPassPageEventData {
  cart_id?: string;
}

type KwikEngagePageViewType = "product" | "collection" | "other";

const KWIK_ENGAGE_EVENT_NAME = "page_view_kp";

const KWIK_ENGAGE_TYPE_MAP: Record<KwikPassEventType, KwikEngagePageViewType> =
  {
    [KwikPassEventType.PRODUCT_VIEW]: "product",
    [KwikPassEventType.COLLECTION_VIEW]: "collection",
    [KwikPassEventType.PAGE_VIEW]: "other",
  };

export function dispatch(type: KwikPassEventType, data: any): void {
  const config = getKwikPassConfig();

  if (typeof window === "undefined" || !config.enabled) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(KWIK_ENGAGE_EVENT_NAME, {
      detail: { type: KWIK_ENGAGE_TYPE_MAP[type], data },
    })
  );
}

export function dispatchProductViewEvent(data: KwikPassProductEventData): void {
  dispatch(KwikPassEventType.PRODUCT_VIEW, data);
}

export function dispatchCollectionViewEvent(
  data: KwikPassCollectionEventData
): void {
  dispatch(KwikPassEventType.COLLECTION_VIEW, data);
}

export function dispatchPageViewEvent(data: KwikPassPageEventData = {}): void {
  dispatch(KwikPassEventType.PAGE_VIEW, data);
}
