/**
 * Custom Checkout Service
 *
 * Centralized service for handling Gokwik checkout functionality.
 * This service is self-contained for Custom platform.
 */

import { DefaultCartStorage } from "@shopkit/cart";
import {
  dispatchCartViewEvent,
  dispatchCheckoutCompleteEvent,
  dispatchCheckoutStartEvent,
} from "./events";
import { getCommerceClient } from "@/config";
import { getCheckoutConfig } from "./config";
import { GuestUserStorage } from "@/widgets/common/ThankYou/V1/utils/guestUserStorage";

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
  /** Client-side navigation (e.g., router.push). Required to avoid full page reloads that kill analytics. */
  navigate?: (path: string) => void;
}

export interface CheckoutConfig {
  cartToken: string;
  items: CartItem[];
  total: number;
  currencyCode: string;
  checkoutUrl: string;
  eventHandlers?: CheckoutEventHandlers;
}

export class CustomCheckoutService {
  private static eventListenersAttached = false;
  private static currentEventHandlers: CheckoutEventHandlers = {};
  private static messageEventCleanup: (() => void) | null = null;
  private static currentCartItems: CartItem[] = [];
  private static currentCartTotal: number = 0;
  private static checkoutUrl: string = "";

  /**
   * Helper function to safely get cookies with proper error handling
   * @param name - Cookie name to retrieve
   * @returns Cookie value or empty string if not found
   */
  private static getCookie(name: string): string {
    if (typeof document === "undefined") {
      return "";
    }

    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      return parts.length === 2 ? parts.pop()?.split(";").shift() || "" : "";
    } catch (error) {
      console.warn(`Failed to get cookie "${name}":`, error);
      return "";
    }
  }

  /**
   * Send GoKwik tracking event with proper validation and error handling
   * @private
   */
  private static async sendTrackingEvent(): Promise<void> {
    try {
      // Validate required data
      if (!window.merchantInfo?.mid) {
        console.warn("GoKwik tracking: merchantId not available");
        return;
      }

      const trackingPayload = {
        shopifySessionId: this.getCookie("_shopify_s"),
        landing_page: this.getCookie("gk_landing_page"),
        orig_referrer: document.referrer || "blank",
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        name: "primathon_store",
        eventType: "development",
        type: "event",
        merchantId: window.merchantInfo.mid,
      };

      const response = await fetch("https://hits.gokwik.co/api/v1/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trackingPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to send GoKwik tracking event:", error);
      // Could add retry logic or fallback tracking here
    }
  }

  /**
   * Initialize Gokwik checkout with cart data
   */
  static async initializeCheckout(config: CheckoutConfig): Promise<void> {
    const {
      cartToken,
      items,
      total,
      currencyCode,
      eventHandlers = {},
    } = config;

    try {
      const commerceClient = getCommerceClient();

      const checkoutResponse = await commerceClient.createCheckout({
        payload: {
          cart_token: cartToken,
          checkout_id: "",
        },
      });

      if (!checkoutResponse.message) {
        throw new Error(
          `Checkout API failed: ${checkoutResponse?.message || "Unknown error"} - ${checkoutResponse?.error || "API request failed"}`
        );
      }

      // Store event handlers and cart data for use in event listeners
      this.currentEventHandlers = eventHandlers;
      this.currentCartItems = items;
      this.currentCartTotal = total;

      // Dispatch cart view event
      this.dispatchCartViewEvent(cartToken, items);

      // Dispatch checkout start event
      this.dispatchCheckoutStartEvent(cartToken, total, currencyCode);

      // Trigger Gokwik checkout
      if (typeof window !== "undefined" && window.gokwikSdk) {
        // Attach event listeners if not already attached
        this.attachEventListeners();

        const config = getCheckoutConfig();

        const gokwikPayload = {
          environment: config.environment,
          type: config.type,
          mid: config.mid,
          phoneNumber: "",
          bannerMessages: [config.message1, config.message2],
          merchantParams: {
            merchantCheckoutId: checkoutResponse?.data?.id || "",
            customerToken: "",
            origReferrer: window.location.href,
            adSource: "",
            landingPage: window.location.origin,
          },
        };

        try {
          window.gokwikSdk?.initCheckout(gokwikPayload);
        } catch (error) {
          console.error("Error initializing GoKwik checkout:", error);
        }
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
    cartToken: string,
    items: CartItem[]
  ): void {
    if (!cartToken) {
      return;
    }

    dispatchCartViewEvent({
      cart_id: cartToken,
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
    cartToken: string,
    total: number,
    currencyCode: string
  ): void {
    dispatchCheckoutStartEvent({
      cart_id: cartToken,
      total,
      currency: currencyCode,
    });
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

    window.gokwikSdk?.on(
      "order-complete",
      (order: {
        merchant_order_id?: string;
        customer?: { id?: string };
        request_id: string;
        customer_id?: string;
        total_price: number;
        payment_method: string;
        discounts: any[];
        shipping_address?: { pincode?: string };
      }) => {
        const orderId = order?.merchant_order_id || `temp-${Date.now()}`;
        // Trigger Trackier conversion tracking (same as Shopify)
        if (typeof window !== "undefined" && window.TrackierWebSDK) {
          this.triggerTrackierTrackConv(order);
        }

        // Google Shopping Apps purchase conversion tracking
        if (typeof window !== "undefined" && window.gtag) {
          const orderAmount = order?.total_price;
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

        setTimeout(() => {
          if (window.gokwikSdk?.close) {
            window.gokwikSdk.close();
          }

          // Extract necessary data for the redirect
          const orderId = order.merchant_order_id;
          const requestId = order.request_id;
          const customerId = order.customer_id || order.customer?.id;
          const paymentMethod = order.payment_method;
          let finalRedirectPath = `/orders?orderId=${orderId}&requestId=${requestId}&paymentMethod=${paymentMethod}`;

          if (customerId) {
            finalRedirectPath += `&customerId=${customerId}`;
          }

          // Fire EDD without awaiting so it doesn't delay the redirect.
          if (orderId && order.shipping_address?.pincode) {
            this.createEDDForOrder(
              orderId,
              order.shipping_address.pincode
            ).catch((err) => console.error("EDD creation failed:", err));
          }

          this.currentEventHandlers.navigate!(finalRedirectPath);
        }, 2000);
      }
    );

    window.gokwikSdk?.on(
      "user-login-successful",
      (data: { userId?: string; userName?: string; email?: string }) => {
        GuestUserStorage.saveGuestUserData(data);
        this.currentEventHandlers.onUserLogin?.(data);
      }
    );

    // Listen for orderSuccess message event
    // Listen for orderSuccess and gokwik_events message events
    const handleGoKwikMessages = (event: MessageEvent) => {
      try {
        // Validate event structure
        if (!event?.data?.type) {
          return; // Ignore invalid events silently
        }

        const { data } = event;

        if (data.type === "orderSuccess") {
          console.log("orderSuccess event received", event);

          const order = data.response;

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

        // Handle GoKwik tracking events
        else if (
          data.type === "gokwik_events" &&
          data?.data?.eventname === "Started_Checkout_GK"
        ) {
          this.sendTrackingEvent();
        }
      } catch (error) {
        console.error("Error handling GoKwik message event:", error, event);
      }
    };

    window.addEventListener("message", handleGoKwikMessages);
    console.log("orderSuccess event listener added");

    // Store cleanup function for later use
    this.messageEventCleanup = () => {
      window.removeEventListener("message", handleGoKwikMessages);
    };
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
    const cartTotal = this.currentCartTotal || 0;

    // Dispatch checkout complete event for GoKwik analytics
    dispatchCheckoutCompleteEvent({
      cart_id: this.getCurrentcartToken(),
      total: cartTotal,
      currency: "INR",
    });
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
  private static getCurrentcartToken(): string {
    return window.merchantInfo?.cart?.id || "";
  }

  /**
   * Seed the order-tracking record (EDD) for a newly placed order.
   * Fire-and-forget — never throws, never blocks the redirect.
   */
  private static async createEDDForOrder(
    orderId: string,
    pincode: string
  ): Promise<void> {
    try {
      if (!orderId || !pincode) {
        console.warn("Missing order ID or pincode for EDD creation");
        return;
      }

      const eddResponse = await fetch("/api/v1/edd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: orderId,
          deliveryPincode: pincode,
        }),
      });

      if (!eddResponse.ok) {
        console.error("Failed to create EDD for order:", orderId);
      }
    } catch (error) {
      console.error("Error creating EDD for order:", error);
    }
  }

  /**
   * Reset event listeners (useful for cleanup)
   */
  static resetEventListeners(): void {
    this.eventListenersAttached = false;
    this.currentEventHandlers = {};
    this.currentCartItems = [];
    this.currentCartTotal = 0;

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
    return !!(window.gokwikSdk && window.gokwikSdk.initCheckout);
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
