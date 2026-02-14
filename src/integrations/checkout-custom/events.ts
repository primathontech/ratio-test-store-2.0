/**
 * Checkout Custom Events
 * Self-contained event handling for Gokwik Checkout Custom platform integration
 */

import { getCheckoutConfig } from "./config";

/**
 * Checkout Event Types
 */
export enum CheckoutEventType {
  CART_VIEW = "gokwik_cart_view",
  CHECKOUT_START = "gokwik_checkout_start",
  CHECKOUT_COMPLETE = "gokwik_checkout_complete",
}

/**
 * Base Checkout Event
 */
export interface CheckoutEvent {
  type: CheckoutEventType;
  timestamp: number;
  data: any;
}

/**
 * Checkout Event Data Interfaces
 */
export interface CheckoutCartEventData {
  cart_id: string;
  products: Array<{
    variantId: string;
    price: number;
    quantity: number;
  }>;
}

export interface CheckoutEventData {
  cart_id: string;
  total: number;
  currency?: string;
}

/**
 * Checkout Event Dispatcher
 * Handles sending events to GoKwik's tracking system
 */
class CheckoutEventDispatcher {
  private config = getCheckoutConfig();

  /**
   * Check if we're in a browser environment
   */
  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  /**
   * Send event to GoKwik tracking
   */
  private sendToGoKwik(event: CheckoutEvent): void {
    if (!this.isBrowser() || !this.config.enabled) {
      return;
    }

    try {
      // Send to GoKwik's tracking system if available
      if (window.gokwik && window.gokwik.track) {
        window.gokwik.track(event.type, event.data);
      }

      // Log in debug mode
      if (this.config.debug) {
        console.log("[Checkout Custom Event]", event);
      }
    } catch (error) {
      if (this.config.debug) {
        console.error("[Checkout Custom Event Error]", error);
      }
    }
  }

  /**
   * Dispatch a Checkout event
   */
  public dispatch(type: CheckoutEventType, data: any): void {
    const event: CheckoutEvent = {
      type,
      timestamp: Date.now(),
      data,
    };

    this.sendToGoKwik(event);
  }
}

// Create singleton instance
const dispatcher = new CheckoutEventDispatcher();

/**
 * Checkout Event Functions
 */
export function dispatchCartViewEvent(data: CheckoutCartEventData): void {
  dispatcher.dispatch(CheckoutEventType.CART_VIEW, data);
}

export function dispatchCheckoutStartEvent(data: CheckoutEventData): void {
  dispatcher.dispatch(CheckoutEventType.CHECKOUT_START, data);
}

export function dispatchCheckoutCompleteEvent(data: CheckoutEventData): void {
  dispatcher.dispatch(CheckoutEventType.CHECKOUT_COMPLETE, data);
}

/**
 * Type declarations for GoKwik global objects
 */
declare global {
  interface Window {
    gokwik?: {
      track: (eventType: string, data: any) => void;
    };
  }
}
