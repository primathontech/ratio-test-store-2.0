/* eslint-disable no-var */
/* eslint-disable no-unused-expressions */
// ─── GA4 SDK — Self-Registering IIFE ────────────────────────────────────────
// Loads Google's gtag.js, then registers with the Pixel Runtime.
// Config key: "ga4" → { measurementId: string }
//
// Events tracked (13 PascalCase standard events):
//   PageView, ViewContent, AddToCart, InitiateCheckout, AddShippingInfo,
//   AddPaymentInfo, Purchase, Search, AddToWishlist, Lead, CompleteRegistration,
//   Contact, Subscribe
//
// GA4 maps PascalCase system events to GA4 snake_case names internally.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  "use strict";

  // ─── Logger ────────────────────────────────────────────────────────────────
  var PREFIX = "[GA4SDK]";

  function log() {
    var args = [PREFIX].concat(Array.prototype.slice.call(arguments));
    console.log.apply(console, args);
  }

  log("Initializing ga4-pixel-sdk.js");

  // ─── Helpers ───────────────────────────────────────────────────────────────
  function eid(event) {
    return (event && event.metadata && event.metadata.event_id) || "no-id";
  }

  function safeHandler(eventName, fn) {
    return function (event) {
      try {
        fn(event);
      } catch (err) {
        log("[" + eid(event) + "] [" + eventName + "] Error:", err);
      }
    };
  }

  // Define registration object
  var registration = {
    name: "ga4",
    register: function (analytics, config) {
      log("register() called with measurementId:", config.measurementId);

      // Load gtag.js if not already loaded (Google Ads SDK may have loaded it)
      window.dataLayer = window.dataLayer || [];
      if (!window.gtag) {
        var script = document.createElement("script");
        script.async = true;
        script.src =
          "https://www.googletagmanager.com/gtag/js?id=" + config.measurementId;
        document.head.appendChild(script);
        window.gtag = function () {
          window.dataLayer.push(arguments);
        };
        window.gtag("js", new Date());
        log("gtag.js script injected");
      } else {
        log("Reusing existing gtag");
      }
      var gtag = window.gtag;
      gtag("config", config.measurementId, { send_page_view: false });
      log("gtag configured with measurementId:", config.measurementId);

      // ─── Helper: map contents[] → GA4 items[] ──────────────────────────
      function mapItems(contents, fallbackName) {
        return (contents || []).map(function (c) {
          return {
            item_id: c.id,
            item_name: fallbackName || "",
            price: c.item_price,
            quantity: c.quantity,
          };
        });
      }

      // ─── Event Subscriptions ──────────────────────────────────────────
      // System emits PascalCase names. GA4 SDK maps to GA4 snake_case internally.

      analytics.subscribe(
        "PageView",
        safeHandler("PageView", function (event) {
          var pg = event.page || {};
          log("[" + eid(event) + "] [PageView] → page_view");
          gtag("event", "page_view", {
            page_title: pg.title || document.title,
            page_location: pg.url || window.location.href,
            page_path: pg.path || window.location.pathname,
          });
        })
      );

      analytics.subscribe(
        "ViewContent",
        safeHandler("ViewContent", function (event) {
          var p = event.properties;
          log(
            "[" + eid(event) + "] [ViewContent] → view_item",
            JSON.stringify({ content_ids: p.content_ids, value: p.value })
          );
          gtag("event", "view_item", {
            items: [
              {
                item_id: (p.content_ids || [])[0],
                item_name: p.content_name || "",
                item_category: p.content_category || undefined,
                price: p.value,
              },
            ],
            currency: p.currency || "INR",
            value: p.value,
          });
        })
      );

      analytics.subscribe(
        "AddToCart",
        safeHandler("AddToCart", function (event) {
          var p = event.properties;
          log(
            "[" + eid(event) + "] [AddToCart] → add_to_cart",
            JSON.stringify({ value: p.value, currency: p.currency })
          );
          gtag("event", "add_to_cart", {
            items: mapItems(p.contents, p.content_name),
            currency: p.currency || "INR",
            value: p.value,
          });
        })
      );

      analytics.subscribe(
        "InitiateCheckout",
        safeHandler("InitiateCheckout", function (event) {
          var p = event.properties;
          log(
            "[" + eid(event) + "] [InitiateCheckout] → begin_checkout",
            JSON.stringify({ value: p.value, currency: p.currency })
          );
          gtag("event", "begin_checkout", {
            items: mapItems(p.contents),
            currency: p.currency || "INR",
            value: p.value,
            coupon: p.coupon || undefined,
          });
        })
      );

      analytics.subscribe(
        "AddShippingInfo",
        safeHandler("AddShippingInfo", function (event) {
          var p = event.properties;
          log(
            "[" + eid(event) + "] [AddShippingInfo] → add_shipping_info",
            JSON.stringify({ method: p.shipping_method, value: p.value })
          );
          gtag("event", "add_shipping_info", {
            shipping_tier: p.shipping_method,
            currency: p.currency || "INR",
            value: p.value,
            coupon: p.coupon || undefined,
          });
        })
      );

      analytics.subscribe(
        "AddPaymentInfo",
        safeHandler("AddPaymentInfo", function (event) {
          var p = event.properties;
          log(
            "[" + eid(event) + "] [AddPaymentInfo] → add_payment_info",
            JSON.stringify({ method: p.payment_method, value: p.value })
          );
          gtag("event", "add_payment_info", {
            payment_type: p.payment_method,
            currency: p.currency || "INR",
            value: p.value,
          });
        })
      );

      analytics.subscribe(
        "Purchase",
        safeHandler("Purchase", function (event) {
          var p = event.properties;
          log(
            "[" + eid(event) + "] [Purchase] → purchase",
            JSON.stringify({
              order_id: p.order_id,
              value: p.value,
              currency: p.currency,
            })
          );
          gtag("event", "purchase", {
            transaction_id: p.order_id,
            value: p.value,
            currency: p.currency || "INR",
            tax: p.tax,
            shipping: p.shipping,
            coupon: p.coupon || undefined,
            items: mapItems(p.contents),
          });
        })
      );

      analytics.subscribe(
        "Search",
        safeHandler("Search", function (event) {
          log(
            "[" + eid(event) + "] [Search] → search",
            JSON.stringify({ term: event.properties.search_string })
          );
          gtag("event", "search", {
            search_term: event.properties.search_string,
          });
        })
      );

      analytics.subscribe(
        "AddToWishlist",
        safeHandler("AddToWishlist", function (event) {
          var p = event.properties;
          log(
            "[" + eid(event) + "] [AddToWishlist] → add_to_wishlist",
            JSON.stringify({ content_ids: p.content_ids, value: p.value })
          );
          gtag("event", "add_to_wishlist", {
            items: [
              {
                item_id: (p.content_ids || [])[0],
                item_name: p.content_name || "",
                price: p.value,
              },
            ],
            currency: p.currency || "INR",
            value: p.value,
          });
        })
      );

      analytics.subscribe(
        "Lead",
        safeHandler("Lead", function (event) {
          var p = event.properties || {};
          log(
            "[" + eid(event) + "] [Lead] → generate_lead",
            JSON.stringify({ value: p.value })
          );
          gtag("event", "generate_lead", {
            value: p.value,
            currency: p.currency || "INR",
          });
        })
      );

      analytics.subscribe(
        "CompleteRegistration",
        safeHandler("CompleteRegistration", function (event) {
          var p = event.properties || {};
          log(
            "[" + eid(event) + "] [CompleteRegistration] → sign_up",
            JSON.stringify({ method: p.method })
          );
          gtag("event", "sign_up", {
            method: p.method,
          });
        })
      );

      analytics.subscribe(
        "Contact",
        safeHandler("Contact", function (event) {
          log("[" + eid(event) + "] [Contact] → contact");
          gtag("event", "contact", {});
        })
      );

      analytics.subscribe(
        "Subscribe",
        safeHandler("Subscribe", function (event) {
          log("[" + eid(event) + "] [Subscribe] → subscribe");
          gtag("event", "subscribe", {});
        })
      );

      log("All 13 event subscriptions registered");
    },
  };

  // Register immediately if runtime is ready, otherwise queue for later
  if (window.__OPEN_STORE_PIXEL_RUNTIME__) {
    log("Runtime found — registering immediately");
    window.__OPEN_STORE_PIXEL_RUNTIME__.register(registration);
  } else {
    log("Runtime not ready — pushing to __OPEN_STORE_PIXEL_PENDING__ queue");
    window.__OPEN_STORE_PIXEL_PENDING__ =
      window.__OPEN_STORE_PIXEL_PENDING__ || [];
    window.__OPEN_STORE_PIXEL_PENDING__.push(registration);
  }
})();
