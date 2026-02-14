/**
 * Shopify Checkout Service
 *
 * Centralized service for handling Gokwik checkout functionality.
 * This service is self-contained for Shopify platform.
 */

import { DefaultCartStorage } from "@shopkit/cart";
import {
  dispatchCartViewEvent,
  dispatchCheckoutCompleteEvent,
  dispatchCheckoutStartEvent,
} from "./events";
import { publishEvent, EventType } from "@shopkit/analytics";

// Global window interface for GoKwik
declare global {
  interface Window {
    gokwikSdk?: {
      initCheckout: (config: any) => void;
      on: (event: string, callback: (data: any) => void) => void;
      close?: () => void;
    };
    merchantInfo?: {
      mid: string;
      environment: string;
      type: string;
      storeId: string;
      fbPixel: string;
      cart: {
        id: string;
      };
    };
    triggerGokwikCheckout?: (cartId: string) => void;
    triggerGokwikCustomCheckout?: () => void;
    TrackierWebSDK?: any;
    gtag?: (...args: any[]) => void;
  }
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  price:
    | {
        amount: number;
        currencyCode: string;
      }
    | number;
  quantity: number;
  image?: string;
}

export interface CheckoutEventHandlers {
  onOrderComplete?: (order: any) => void;
  onPaymentSuccess?: (data: any) => void;
  onCheckoutComplete?: (data: any) => void;
  onUserLogin?: (data: any) => void;
  onAddressSelected?: (data: any) => void;
  onPaymentMethodSelected?: (data: any) => void;
  onError?: (error: Error) => void;
}

export interface CheckoutConfig {
  cartId: string;
  items: CartItem[];
  total: number;
  currencyCode: string;
  checkoutUrl: string;
  eventHandlers?: CheckoutEventHandlers;
}

export class ShopifyCheckoutService {
  private static eventListenersAttached = false;
  private static currentEventHandlers: CheckoutEventHandlers = {};
  private static messageEventCleanup: (() => void) | null = null;
  private static currentCartItems: CartItem[] = [];
  private static currentCartTotal: number = 0;
  private static checkoutUrl: string = "";

  /**
   * Initialize Gokwik checkout with cart data
   */
  static async initializeCheckout(config: CheckoutConfig): Promise<void> {
    const {
      cartId,
      items,
      total,
      currencyCode,
      checkoutUrl,
      eventHandlers = {},
    } = config;

    try {
      // Store event handlers and cart data for use in event listeners
      this.currentEventHandlers = eventHandlers;
      this.currentCartItems = items;
      this.currentCartTotal = total;
      this.checkoutUrl = checkoutUrl;

      // Dispatch cart view event
      this.dispatchCartViewEvent(cartId, items);

      // Attach event listeners if not already attached
      this.attachEventListeners();

      // Dispatch checkout start event
      this.dispatchCheckoutStartEvent(cartId, total, currencyCode);

      // Trigger Gokwik checkout
      if (window.triggerGokwikCheckout && cartId) {
        window.triggerGokwikCheckout(cartId);
      } else {
        throw new Error("GoKwik checkout not available or no cart ID");
      }
    } catch (error) {
      console.error("GoKwik checkout initialization error:", error);
      eventHandlers.onError?.(
        error instanceof Error ? error : new Error("Unknown checkout error")
      );
      throw error;
    }
  }

  /**
   * Dispatch cart view event for analytics
   */
  private static dispatchCartViewEvent(
    cartId: string,
    items: CartItem[]
  ): void {
    if (!cartId) {
      return;
    }

    dispatchCartViewEvent({
      cart_id: cartId,
      products: items.map((item) => ({
        variantId: item.variantId || item.id,
        price: typeof item.price === "number" ? item.price : item.price.amount,
        quantity: item.quantity,
      })),
    });
  }

  /**
   * Dispatch checkout start event for analytics
   */
  private static dispatchCheckoutStartEvent(
    cartId: string,
    total: number,
    currencyCode: string
  ): void {
    dispatchCheckoutStartEvent({
      cart_id: cartId,
      total,
      currency: currencyCode,
    });

    publishEvent({
      type: EventType.STARTED_CHECKOUT_GK,
      cartValue: total,
      currency: currencyCode,
    } as any);
  }

  /**
   * Attach Gokwik event listeners
   * Uses window.postMessage instead of SDK events as the actual implementation
   */
  private static attachEventListeners(): void {
    if (this.eventListenersAttached) {
      return;
    }

    this.eventListenersAttached = true;

    // Listen for orderSuccess message event
    const handleOrderSuccess = (event: MessageEvent) => {
      if (event?.data?.type === "orderSuccess") {
        console.log("orderSuccess event received", event);

        const order = event.data.response;

        // Trigger Trackier conversion tracking if available
        if (typeof window !== "undefined" && window.TrackierWebSDK) {
          this.triggerTrackierTrackConv(order);
        }

        // Google Shopping Apps purchase conversion tracking
        if (typeof window !== "undefined" && window.gtag) {
          const orderId =
            order?.order_name || order.orderSuccessBody?.order_name;
          const orderAmount =
            order?.total_price || order.orderSuccessBody?.total_price;

          const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
          const conversionLabel =
            process.env.NEXT_PUBLIC_GOOGLE_CONVERSION_LABEL;

          window.gtag("event", "conversion", {
            send_to: `${googleAdsId}/${conversionLabel}`,
            value: orderAmount || 1.0,
            transaction_id: orderId,
          });
        }

        // Trigger checkout complete event
        this.triggeredCheckoutCompleteEvent(order);

        // Clear cart storage (localStorage)
        this.clearCartStorage();

        // Call custom handler - this will trigger component's cart clearing and closing
        this.currentEventHandlers.onOrderComplete?.(order);
      }
      // Shopify native checkout fallback
      else if (event?.data?.type === "shopifyRedirect") {
        this.handleShopifyRedirect(event.data);
      }
    };

    window.addEventListener("message", handleOrderSuccess);
    console.log("orderSuccess event listener added");

    // Store cleanup function for later use
    this.messageEventCleanup = () => {
      window.removeEventListener("message", handleOrderSuccess);
    };
  }

  /**
   * Handle Shopify redirect events with proper validation
   * @private
   */
  private static handleShopifyRedirect(data: any): void {
    // Get checkout URL from stored checkoutUrl, data, or localStorage fallback
    const url = this.checkoutUrl;
    if (url) {
      // Clear cart storage first
      this.clearCartStorage();
      // Navigate to Shopify checkout URL
      window.location.href = url;
    }
  }

  /**
   * Trigger Trackier conversion tracking
   */
  private static triggerTrackierTrackConv(order: any): void {
    const orderId = order?.order_name || order.orderSuccessBody?.order_name;
    const orderAmount =
      order?.total_price || order.orderSuccessBody?.total_price;

    window.TrackierWebSDK.trackConv(
      "track.techtrack.in",
      "6776449c8e7dea356102ea94",
      {
        is_camp: true,
        txn_id: orderId,
        sale_amount: orderAmount,
        is_iframe: true,
      }
    );
  }

  /**
   * Trigger checkout complete event with proper payload
   */
  private static triggeredCheckoutCompleteEvent(order: any): void {
    console.log("orderSuccess triggeredCheckoutCompleteEvent", order);

    // Get current cart data from stored context
    const cartItems = this.currentCartItems || [];
    const cartTotal = this.currentCartTotal || 0;

    const eventPayload = {
      type: EventType.PURCHASE,
      orderId: order?.merchant_order_id || "",
      cartValue: cartTotal,
      currency: "INR",
      itemCount: cartItems.length,
      timestamp: Date.now(),
      items: cartItems.map((item: any) => ({
        productId: item.productId || item.id || "",
        productName: item.title || "",
        price:
          typeof item.price === "number" ? item.price : item.price?.amount || 0,
        quantity: item.quantity || 1,
        variant: item.variantId || "",
      })),
    };

    // Publish the checkout completed event
    publishEvent(eventPayload as any);

    // Dispatch checkout complete event for GoKwik analytics
    dispatchCheckoutCompleteEvent({
      cart_id: this.getCurrentCartId(),
      total: cartTotal,
      currency: "INR",
    });

    // Publish order success events
    publishEvent({
      type: EventType.ORDER_COMPLETED,
      orderId: order?.merchant_order_id || "",
      amount: cartTotal,
      currency: "INR",
    } as any);
  }

  /**
   * Clear cart storage (localStorage) after successful checkout
   */
  private static clearCartStorage(): void {
    // Clear cart storage (localStorage)
    const storage = new DefaultCartStorage(
      process.env.NEXT_PUBLIC_MERCHANT_NAME
    );
    storage.clear();
  }

  /**
   * Get current cart ID from window.merchantInfo
   */
  private static getCurrentCartId(): string {
    return window.merchantInfo?.cart?.id || "";
  }

  /**
   * Get current total from stored context (you may need to pass this differently)
   */
  private static getCurrentTotal(): number {
    // This would need to be passed from the calling context
    // For now, return 0 as fallback
    return 0;
  }

  /**
   * Get current currency from stored context
   */
  private static getCurrentCurrency(): string {
    // This would need to be passed from the calling context
    // For now, return INR as fallback
    return "INR";
  }

  /**
   * Reset event listeners (useful for cleanup)
   */
  static resetEventListeners(): void {
    this.eventListenersAttached = false;
    this.currentEventHandlers = {};
    this.currentCartItems = [];
    this.currentCartTotal = 0;
    this.checkoutUrl = "";

    // Clean up message event listener if it exists
    if (this.messageEventCleanup) {
      this.messageEventCleanup();
      this.messageEventCleanup = null;
    }
  }

  /**
   * Check if Gokwik is available
   */
  static isGokwikAvailable(): boolean {
    if (typeof window === "undefined") {
      return false;
    }
    return !!(window.triggerGokwikCheckout && window.gokwikSdk);
  }

  /**
   * Close Gokwik checkout
   */
  static closeCheckout(): void {
    if (window.gokwikSdk?.close) {
      window.gokwikSdk.close();
    }
  }
}
