/**
 * KwikPass Custom Events
 * Self-contained event handling for KwikPass Custom platform integration
 */

import { getKwikPassConfig } from "./config";

/**
 * KwikPass Event Types
 */
export enum KwikPassEventType {
  PRODUCT_VIEW = "gokwik_product_view",
  COLLECTION_VIEW = "gokwik_collection_view",
  PAGE_VIEW = "gokwik_page_view",
  LOGIN = "gokwik_login",
  LOGOUT = "gokwik_logout",
}

/**
 * Base KwikPass Event
 */
export interface KwikPassEvent {
  type: KwikPassEventType;
  timestamp: number;
  data: any;
}

/**
 * KwikPass Event Data Interfaces
 */
export interface KwikPassProductEventData {
  product_id: string;
  variant_id?: string;
  image_url: string;
  name: string;
  price: number | string;
  handle: string;
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
  path?: string;
  title?: string;
}

export interface KwikPassLoginEventData {
  method: "phone" | "whatsapp" | "truecaller" | "custom";
  user_id?: string;
}

/**
 * KwikPass Event Dispatcher
 * Handles sending events to GoKwik's tracking system
 */
class KwikPassEventDispatcher {
  private config = getKwikPassConfig();

  /**
   * Check if we're in a browser environment
   */
  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  /**
   * Send event to GoKwik tracking
   */
  private sendToGoKwik(event: KwikPassEvent): void {
    if (!this.isBrowser() || !this.config.enabled) {
      return;
    }

    try {
      // Send to GoKwik's tracking system if available
      if (window.gokwik && window.gokwik.track) {
        window.gokwik.track(event.type, event.data);
      }

      // Send to Facebook Pixel if configured
      if (this.config.fbPixelId && window.fbq) {
        this.sendToFacebookPixel(event);
      }

      // Log in debug mode
      if (this.config.debug) {
        console.log("[KwikPass Custom Event]", event);
      }
    } catch (error) {
      if (this.config.debug) {
        console.error("[KwikPass Custom Event Error]", error);
      }
    }
  }

  /**
   * Send relevant events to Facebook Pixel
   */
  private sendToFacebookPixel(event: KwikPassEvent): void {
    if (!window.fbq) {
      return;
    }

    switch (event.type) {
      case KwikPassEventType.PRODUCT_VIEW:
        window.fbq("track", "ViewContent", {
          content_ids: [event.data.product_id],
          content_name: event.data.name,
          value:
            typeof event.data.price === "string"
              ? parseFloat(event.data.price)
              : event.data.price,
          currency: "INR",
        });
        break;
    }
  }

  /**
   * Dispatch a KwikPass event
   */
  public dispatch(type: KwikPassEventType, data: any): void {
    const event: KwikPassEvent = {
      type,
      timestamp: Date.now(),
      data,
    };

    this.sendToGoKwik(event);
  }
}

// Create singleton instance
const dispatcher = new KwikPassEventDispatcher();

/**
 * KwikPass Event Functions
 */
export function dispatchProductViewEvent(data: KwikPassProductEventData): void {
  dispatcher.dispatch(KwikPassEventType.PRODUCT_VIEW, data);
}

export function dispatchCollectionViewEvent(
  data: KwikPassCollectionEventData
): void {
  dispatcher.dispatch(KwikPassEventType.COLLECTION_VIEW, data);
}

export function dispatchPageViewEvent(data: KwikPassPageEventData = {}): void {
  const pageData = {
    ...data,
    path:
      data.path ||
      (typeof window !== "undefined" ? window.location.pathname : ""),
    title:
      data.title || (typeof document !== "undefined" ? document.title : ""),
  };
  dispatcher.dispatch(KwikPassEventType.PAGE_VIEW, pageData);
}

export function dispatchLoginEvent(data: KwikPassLoginEventData): void {
  dispatcher.dispatch(KwikPassEventType.LOGIN, data);
}

export function dispatchLogoutEvent(): void {
  dispatcher.dispatch(KwikPassEventType.LOGOUT, {});
}

/**
 * Type declarations for GoKwik global objects
 */
declare global {
  interface Window {
    gokwik?: {
      track: (eventType: string, data: any) => void;
    };
    fbq?: (
      type: string,
      eventName: string,
      params?: Record<string, any>,
      options?: { eventID?: string }
    ) => void;
  }
}
