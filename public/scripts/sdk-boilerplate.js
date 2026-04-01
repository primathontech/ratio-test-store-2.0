/* eslint-disable no-var */
/* eslint-disable no-unused-expressions */
// ─── SDK Adapter Boilerplate ─────────────────────────────────────────────────
// Copy this file, rename it (e.g. tiktok-pixel-sdk.js), then follow the
// three TODO steps below.
//
// HOW IT WORKS
// ┌─────────────────────────────────────────────────────────────────────┐
// │  layout.tsx                                                         │
// │    <Script src="/scripts/your-sdk.js" strategy="afterInteractive"/> │
// │                                                                     │
// │  pixelConfig.ts                                                     │
// │    "your-sdk": { apiKey: "...", ...options }                        │
// └────────────────────────────┬────────────────────────────────────────┘
//                              │
//                    PixelRuntime calls register(analytics, config)
//                              │
//                    SDK subscribes to events
//                              │
//                    SDK forwards events to vendor platform
//
// INTEGRATION CHECKLIST
// ─────────────────────
// Step 1 ─ Rename this file:
//     public/scripts/your-sdk.js
//
// Step 2 ─ Add your SDK key to pixelConfig.ts:
//     "your-sdk": process.env.NEXT_PUBLIC_YOUR_SDK_KEY
//       ? { apiKey: process.env.NEXT_PUBLIC_YOUR_SDK_KEY }
//       : null,
//     The key MUST exactly match registration.name below.
//
// Step 3 ─ Load the script in layout.tsx (alongside other SDK scripts):
//     <Script src="/scripts/your-sdk.js" strategy="afterInteractive" />
//
// ─────────────────────────────────────────────────────────────────────────────
//
// SDKEVENT SHAPE  (what every event callback receives)
// ─────────────────────────────────────────────────────
// {
//   event_type: string,     // "PageView" | "AddToCart" | "Purchase" | ...
//   timestamp:  number,     // Unix milliseconds, e.g. 1712345678901
//
//   properties: {           // event-specific payload
//     // ── present on ViewContent / AddToCart / Purchase / etc. ──────────
//     content_ids:    ["prod-123"],
//     content_name:   "Blue T-Shirt",
//     content_type:   "product_group",
//     content_category: "Tops",
//     value:          999,
//     currency:       "INR",
//     num_items:      1,
//     contents: [
//       { id: "prod-123", quantity: 1, item_price: 999 }
//     ],
//     // ── Purchase only ─────────────────────────────────────────────────
//     order_id:       "ORD-456",
//     tax:            0,
//     shipping:       49,
//     coupon:         "SAVE10",
//     // ── AddShippingInfo only ──────────────────────────────────────────
//     shipping_method: "Standard",
//     // ── AddPaymentInfo only ───────────────────────────────────────────
//     payment_method:  "UPI",
//     // ── Search only ───────────────────────────────────────────────────
//     search_string:  "blue shirt",
//     // ── CompleteRegistration only ─────────────────────────────────────
//     method:         "email",
//   },
//
//   metadata: {
//     event_id:   "550e8400-e29b-41d4-a716-446655440000",  // UUID v4 — use for dedup
//     session_id: "sess-abc123",
//     user_agent: "Mozilla/5.0 ...",
//
//     page: {
//       url:      "https://example.com/products/blue-tshirt",
//       path:     "/products/blue-tshirt",
//       title:    "Blue T-Shirt",
//       referrer: "https://example.com/collections/tops",
//     },
//
//     // tracking cookies (platform-specific, not hashed)
//     cookies: {
//       _ga:   "GA1.1.123456789.1234567890",  // Google Analytics client ID
//       _fbp:  "fb.1.123456789.1234567890",   // Meta browser ID
//       _fbc:  "fb.1.123456789.AbCdEfGhIjKl", // Meta click ID
//       gclid: "EAIaIQobChMI...",             // Google Ads click ID
//     },
//
//     // raw user PII — normalize & hash server-side before sending to platforms
//     user_data: {
//       email:        "user@example.com",
//       phone:        "+919876543210",
//       first_name:   "Jane",
//       last_name:    "Doe",
//       external_id:  "cust-789",     // your internal customer ID
//       city:         "Mumbai",
//       state:        "MH",
//       zip_code:     "400001",
//       country:      "IN",           // ISO 3166-1 alpha-2
//       date_of_birth:"19900101",     // YYYYMMDD
//       gender:       "f",            // "m" or "f"
//     },
//
//     // A/B test data from cookies (null means not assigned)
//     experiment: {
//       "homepage_hero": "variant_b",
//       "checkout_flow": null,
//     },
//   }
// }
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  "use strict";

  // ─── Logger ────────────────────────────────────────────────────────────────
  // TODO: Replace PREFIX and STYLE with your SDK's name and brand color.
  // Categories to use:
  //   "Init"  — startup, register() called, vendor lib loaded
  //   "Event" — each tracked event
  //   "Error" — caught exceptions
  //   "Auth"  — signing / token operations
  //   "API"   — server-side batching / HTTP calls
  var PREFIX = "[MySdk]";
  var STYLE = "color: #000000; font-weight: bold;";

  function log(category) {
    var args = ["%c" + PREFIX + " [" + category + "]", STYLE].concat(
      Array.prototype.slice.call(arguments, 1)
    );
    console.log.apply(console, args);
  }

  log("Init", "Initializing my-sdk.js");

  // ─── Helpers ───────────────────────────────────────────────────────────────

  /** Log an event with its full SDKEvent object. */
  function logEvent(eventName, event) {
    log("Event", eventName, event);
  }

  /**
   * Wraps a handler in try/catch.
   * Prevents a crash in one event from breaking all subsequent events.
   */
  function safeHandler(eventName, fn) {
    return function (event) {
      try {
        fn(event);
      } catch (err) {
        log("Error", eventName, err);
      }
    };
  }

  // ─── Step 1: Load your vendor library ─────────────────────────────────────
  // TODO: Inject your vendor's pixel / SDK script tag here.
  // Skip this section if your library is loaded another way.
  //
  // Example:
  // if (!window.myVendorPixel) {
  //   var script = document.createElement("script");
  //   script.async = true;
  //   script.src = "https://analytics.vendor.com/pixel.js";
  //   document.head.appendChild(script);
  //   log("Init", "vendor pixel script injected");
  // } else {
  //   log("Init", "vendor pixel already loaded");
  // }

  // ─── Step 2: Build the registration object ─────────────────────────────────
  var registration = {
    // TODO: Replace "my-sdk" with your SDK's name.
    // This MUST exactly match the key in pixelConfig.ts.
    name: "my-sdk",

    register: function (analytics, config) {
      // config = whatever object you put in pixelConfig.ts under your SDK's key.
      // e.g. config.apiKey, config.pixelId, config.measurementId, etc.
      log("Init", "register() called with config:", config);

      // TODO: Initialize your vendor SDK here.
      // window.myVendorPixel("init", config.apiKey);
      // log("Init", "vendor pixel initialized");

      // ─── Event Subscriptions ─────────────────────────────────────────────
      // Subscribe to any of the 13 standard events.
      // Delete the ones your platform doesn't support.
      //
      // Each handler receives an SDKEvent (full shape documented at top of file).
      // Always destructure via:
      //   var p = event.properties;       // event payload
      //   var m = event.metadata;         // page, cookies, user_data, experiment
      //   var eventId = m.event_id;       // UUID — use for client+server dedup

      analytics.subscribe(
        "PageView",
        safeHandler("PageView", function (event) {
          logEvent("PageView", event);
          // var m = event.metadata;
          // window.myVendorPixel("track", "PageView", {
          //   page_url: m.page.url,
          // });
        })
      );

      analytics.subscribe(
        "ViewContent",
        safeHandler("ViewContent", function (event) {
          var p = event.properties;
          logEvent("ViewContent", event);
          // window.myVendorPixel("track", "ViewContent", {
          //   content_id: (p.content_ids || [])[0],
          //   content_name: p.content_name,
          //   value: p.value,
          //   currency: p.currency,
          // });
        })
      );

      analytics.subscribe(
        "AddToCart",
        safeHandler("AddToCart", function (event) {
          var p = event.properties;
          logEvent("AddToCart", event);
          // window.myVendorPixel("track", "AddToCart", {
          //   content_ids: p.content_ids,
          //   value: p.value,
          //   currency: p.currency,
          //   quantity: p.num_items,
          // });
        })
      );

      analytics.subscribe(
        "InitiateCheckout",
        safeHandler("InitiateCheckout", function (event) {
          var p = event.properties;
          logEvent("InitiateCheckout", event);
          // window.myVendorPixel("track", "InitiateCheckout", {
          //   content_ids: p.content_ids,
          //   value: p.value,
          //   currency: p.currency,
          //   num_items: p.num_items,
          // });
        })
      );

      analytics.subscribe(
        "AddShippingInfo",
        safeHandler("AddShippingInfo", function (event) {
          var p = event.properties;
          logEvent("AddShippingInfo", event);
          // window.myVendorPixel("track", "AddShippingInfo", {
          //   shipping_method: p.shipping_method,
          //   value: p.value,
          //   currency: p.currency,
          // });
        })
      );

      analytics.subscribe(
        "AddPaymentInfo",
        safeHandler("AddPaymentInfo", function (event) {
          var p = event.properties;
          logEvent("AddPaymentInfo", event);
          // window.myVendorPixel("track", "AddPaymentInfo", {
          //   payment_method: p.payment_method,
          //   value: p.value,
          //   currency: p.currency,
          // });
        })
      );

      analytics.subscribe(
        "Purchase",
        safeHandler("Purchase", function (event) {
          var p = event.properties;
          logEvent("Purchase", event);
          // window.myVendorPixel("track", "Purchase", {
          //   order_id: p.order_id,
          //   value: p.value,
          //   currency: p.currency,
          //   content_ids: p.content_ids,
          // });
        })
      );

      analytics.subscribe(
        "Search",
        safeHandler("Search", function (event) {
          logEvent("Search", event);
          // window.myVendorPixel("track", "Search", {
          //   search_string: event.properties.search_string,
          // });
        })
      );

      analytics.subscribe(
        "AddToWishlist",
        safeHandler("AddToWishlist", function (event) {
          var p = event.properties;
          logEvent("AddToWishlist", event);
          // window.myVendorPixel("track", "AddToWishlist", {
          //   content_id: (p.content_ids || [])[0],
          //   value: p.value,
          //   currency: p.currency,
          // });
        })
      );

      analytics.subscribe(
        "Lead",
        safeHandler("Lead", function (event) {
          var p = event.properties;
          logEvent("Lead", event);
          // window.myVendorPixel("track", "Lead", {
          //   value: p.value,
          //   currency: p.currency,
          // });
        })
      );

      analytics.subscribe(
        "CompleteRegistration",
        safeHandler("CompleteRegistration", function (event) {
          logEvent("CompleteRegistration", event);
          // window.myVendorPixel("track", "CompleteRegistration", {
          //   method: event.properties.method,
          // });
        })
      );

      analytics.subscribe(
        "Contact",
        safeHandler("Contact", function (event) {
          logEvent("Contact", event);
          // window.myVendorPixel("track", "Contact", {});
        })
      );

      analytics.subscribe(
        "Subscribe",
        safeHandler("Subscribe", function (event) {
          logEvent("Subscribe", event);
          // window.myVendorPixel("track", "Subscribe", {});
        })
      );

      // ─── Wildcard (optional) ──────────────────────────────────────────────
      // Subscribes to ALL 13 events in one handler.
      // Useful for forwarding every event to a generic analytics endpoint
      // (e.g., custom data warehouse, logging service).
      //
      // analytics.subscribe("*", function (event) {
      //   log("Event", event.event_type, event);
      //   fetch("/api/analytics", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       event_type: event.event_type,
      //       properties: event.properties,
      //       metadata:   event.metadata,
      //     }),
      //   });
      // });

      log("Init", "All event subscriptions registered");
    },
  };

  // ─── Step 3: Register with the PixelRuntime ────────────────────────────────
  // DO NOT modify this block.
  // It handles both cases: runtime already initialized, and script loaded early.
  if (window.__OPEN_STORE_PIXEL_RUNTIME__) {
    log("Init", "Runtime found — registering immediately");
    window.__OPEN_STORE_PIXEL_RUNTIME__.register(registration);
  } else {
    log(
      "Init",
      "Runtime not ready — pushing to __OPEN_STORE_PIXEL_PENDING__ queue"
    );
    window.__OPEN_STORE_PIXEL_PENDING__ =
      window.__OPEN_STORE_PIXEL_PENDING__ || [];
    window.__OPEN_STORE_PIXEL_PENDING__.push(registration);
  }
})();
