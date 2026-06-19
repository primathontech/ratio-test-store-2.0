/**
 * Custom Checkout Service
 *
 * Centralized service for handling Gokwik checkout functionality.
 * This service is self-contained for Custom platform.
 */

import { DefaultCartStorage } from "@shopkit/cart";
import { getAffiliateParams } from "@shopkit/events/affiliate";
import {
  dispatchCartViewEvent,
  dispatchCheckoutCompleteEvent,
  dispatchCheckoutStartEvent,
} from "./events";
import { getCommerceClient } from "@/config";
import { getCheckoutConfig } from "./config";

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

interface GokwikOrderLineItem {
  title?: string;
  name?: string;
  quantity?: number;
  price?: number | string;
  sku?: string;
  product_id?: string | number;
  variant_name?: string;
  variant_title?: string;
  image?: string;
  image_url?: string;
}

interface GokwikOrderAddress {
  first_name?: string;
  last_name?: string;
  address?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  state?: string;
  country?: string;
  country_code?: string;
  zip?: string;
  pincode?: string;
  phone?: string;
}

interface GokwikOrder {
  merchant_order_id?: string;
  order_name?: string;
  gokwik_order_id?: string;
  customer_id?: string;
  customer_name?: string;
  email?: string;
  phone?: string;
  total?: number | string;
  total_price?: number | string;
  currency?: string;
  status?: string;
  payment_mode?: string;
  payment_method?: string;
  payment_status?: string;
  payment_at?: string;
  thankyou_redirect_url?: string;
  line_items?: GokwikOrderLineItem[];
  shipping_address?: GokwikOrderAddress;
  billing_address?: GokwikOrderAddress;
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
   * Map the GoKwik COD/prepaid signals onto the KwikChat payment_status enum.
   * COD orders trigger the COD confirmation flow ("pending"); successful
   * prepaid payments map to "paid". Only paid/pending/authorized/refunded are
   * accepted by the ingestion API.
   */
  private static mapKwikchatPaymentStatus(
    order: GokwikOrder
  ): "paid" | "pending" | "authorized" | "refunded" {
    const mode = String(
      order?.payment_mode || order?.payment_method || ""
    ).toLowerCase();
    if (mode === "cod") {
      return "pending";
    }
    if (
      String(order?.payment_status || "")
        .toLowerCase()
        .includes("refund")
    ) {
      return "refunded";
    }
    return "paid";
  }

  /**
   * address1/city/province/country/zip are all required when an address object
   * is sent, so an address missing any of them is dropped rather than risking a
   * 400 from the ingestion API. phone is only valid on the shipping address.
   */
  private static mapKwikchatAddress(
    addr: GokwikOrderAddress | undefined,
    includePhone: boolean
  ): Record<string, string> | undefined {
    if (!addr) {
      return undefined;
    }
    const address1 = String(addr.address1 || addr.address || "");
    const city = String(addr.city || "");
    const province = String(addr.province || addr.state || "");
    const country = String(addr.country || "");
    const zip = String(addr.zip || addr.pincode || "");
    if (!address1 || !city || !province || !country || !zip) {
      return undefined;
    }
    const mapped: Record<string, string> = {
      address1,
      city,
      province,
      country,
      zip,
    };
    if (addr.address2) {
      mapped.address2 = String(addr.address2);
    }
    if (addr.country_code) {
      mapped.country_code = String(addr.country_code);
    }
    if (includePhone && addr.phone) {
      mapped.phone = String(addr.phone);
    }
    return mapped;
  }

  /**
   * Reshape a GoKwik order into the KwikChat Order Ingestion payload.
   * Returns null when the order is missing fields the API requires
   * (order_id, customer_id, at least one item, and an email or phone).
   */
  private static buildKwikchatPayload(
    order: GokwikOrder
  ): Record<string, unknown> | null {
    const orderId = String(
      order?.merchant_order_id ||
        order?.order_name ||
        order?.gokwik_order_id ||
        ""
    );
    const customerId = String(order?.customer_id || "");
    const email = order?.email ? String(order.email) : "";
    const phone = order?.phone ? String(order.phone) : "";

    const lineItems: GokwikOrderLineItem[] = Array.isArray(order?.line_items)
      ? order.line_items
      : [];
    const items = lineItems.map((li) => {
      const item: Record<string, unknown> = {
        name: String(li?.title || li?.name || "Product"),
        quantity: Number(li?.quantity) || 1,
        price: Number(li?.price) || 0,
      };
      if (li?.sku) {
        item.sku = String(li.sku);
      }
      if (li?.product_id) {
        item.product_id = String(li.product_id);
      }
      if (li?.variant_name || li?.variant_title) {
        item.variant_name = String(li.variant_name || li.variant_title);
      }
      if (li?.image || li?.image_url) {
        item.image = String(li.image || li.image_url);
      }
      return item;
    });

    if (!orderId || !customerId || items.length === 0 || (!email && !phone)) {
      return null;
    }

    const shippingAddress = order?.shipping_address;
    const billingAddress = order?.billing_address || shippingAddress;
    const nameSource = shippingAddress || billingAddress || {};
    const customerName =
      String(order?.customer_name || "") ||
      `${nameSource.first_name || ""} ${nameSource.last_name || ""}`.trim();

    const payload: Record<string, unknown> = {
      order_id: orderId,
      customer_id: customerId,
      payment_status: this.mapKwikchatPaymentStatus(order),
      total_amount: Number(order?.total ?? order?.total_price) || 0,
      currency: String(order?.currency || "INR"),
      items,
      order_status:
        String(order?.status || "").toLowerCase() === "cancelled"
          ? "cancelled"
          : "created",
    };

    if (email) {
      payload.email = email;
    }
    if (phone) {
      payload.phone = phone;
    }
    if (customerName) {
      payload.customer_name = customerName;
    }
    if (order?.payment_at) {
      payload.order_date = String(order.payment_at);
    }
    if (order?.thankyou_redirect_url) {
      payload.order_status_url = String(order.thankyou_redirect_url);
    }

    const shipping = this.mapKwikchatAddress(shippingAddress, true);
    if (shipping) {
      payload.shipping_address = shipping;
    }
    const billing = this.mapKwikchatAddress(billingAddress, false);
    if (billing) {
      payload.billing_address = billing;
    }

    return payload;
  }

  /**
   * Send a completed order to the KwikChat Order Ingestion API to trigger
   * order-based automations (COD/prepaid confirmation, fulfilment updates).
   *
   * The GoKwik order is reshaped into the ingestion format and posted directly
   * to the ingestion endpoint. Best-effort: failures go to Sentry, never block
   * checkout.
   */
  private static async sendOrderToKwikchat(order: GokwikOrder): Promise<void> {
    const payload = this.buildKwikchatPayload(order);
    if (!payload) {
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_KWIK_ENGAGE_ORDER_INGESTION_URL;
    const token = process.env.NEXT_PUBLIC_KWIK_ENGAGE_ORDER_INGESTION_TOKEN;
    const source = process.env.NEXT_PUBLIC_MERCHANT_NAME || "";
    if (!baseUrl || !token) {
      return;
    }

    try {
      await fetch(`${baseUrl}/v1/custom/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          provider: "external",
          source: source,
        },
        body: JSON.stringify(payload),
        // keepalive so the request survives the post-checkout navigation
        keepalive: true,
      });
    } catch (error) {
      console.error(error, {
        tags: { flow: "checkout", operation: "sendOrderToKwikchat" },
      });
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
          attributes: getAffiliateParams() ?? undefined,
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
      }) => {
        const orderId = order?.merchant_order_id || `temp-${Date.now()}`;
        // Trigger Trackier conversion tracking (same as Shopify)
        if (typeof window !== "undefined" && window.TrackierWebSDK) {
          this.triggerTrackierTrackConv(order);
        }

        // Send order confirmation to kwikchat
        this.sendOrderToKwikchat(order);

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

          this.currentEventHandlers.navigate!(finalRedirectPath);
        }, 2000);
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

          // Send order confirmation to kwikchat
          this.sendOrderToKwikchat(order);

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
