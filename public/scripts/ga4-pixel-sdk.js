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
  var STYLE = "color: #4285F4; font-weight: bold;";

  function log(category) {
    var args = ["%c" + PREFIX + " [" + category + "]", STYLE].concat(
      Array.prototype.slice.call(arguments, 1)
    );
    console.log.apply(console, args);
  }

  log("Init", "Initializing ga4-pixel-sdk.js");

  // ─── Helpers ───────────────────────────────────────────────────────────────
  function logEvent(eventName, ga4Name, event) {
    log("Event", eventName + " → " + ga4Name, event);
  }

  function safeHandler(eventName, fn) {
    return function (event) {
      try {
        fn(event);
      } catch (err) {
        log("Error", eventName, err);
      }
    };
  }

  // Define registration object
  var registration = {
    name: "ga4",
    register: function (analytics, config) {
      log(
        "Init",
        "register() called with measurementId:",
        config.measurementId
      );

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
        log("Init", "gtag.js script injected");
      } else {
        log("Init", "Reusing existing gtag");
      }
      var gtag = window.gtag;
      gtag("config", config.measurementId, { send_page_view: true });
      log("Init", "gtag configured with measurementId:", config.measurementId);

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

      // Lets not track page_view manually
      // analytics.subscribe(
      //   "PageView",
      //   safeHandler("PageView", function (event) {
      //     var pg = event.page || {};
      //     logEvent("PageView", "page_view", event);
      //     gtag("event", "page_view", {
      //       page_title: pg.title || document.title,
      //       page_location: pg.url || window.location.href,
      //       page_path: pg.path || window.location.pathname,
      //     });
      //   })
      // );

      analytics.subscribe(
        "ViewContent",
        safeHandler("ViewContent", function (event) {
          var p = event.properties;
          logEvent("ViewContent", "view_item", event);
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
          logEvent("AddToCart", "add_to_cart", event);
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
          logEvent("InitiateCheckout", "begin_checkout", event);
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
          logEvent("AddShippingInfo", "add_shipping_info", event);
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
          logEvent("AddPaymentInfo", "add_payment_info", event);
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
          logEvent("Purchase", "purchase", event);
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
          logEvent("Search", "search", event);
          gtag("event", "search", {
            search_term: event.properties.search_string,
          });
        })
      );

      analytics.subscribe(
        "AddToWishlist",
        safeHandler("AddToWishlist", function (event) {
          var p = event.properties;
          logEvent("AddToWishlist", "add_to_wishlist", event);
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
          logEvent("Lead", "generate_lead", event);
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
          logEvent("CompleteRegistration", "sign_up", event);
          gtag("event", "sign_up", {
            method: p.method,
          });
        })
      );

      analytics.subscribe(
        "Contact",
        safeHandler("Contact", function (event) {
          logEvent("Contact", "contact", event);
          gtag("event", "contact", {});
        })
      );

      analytics.subscribe(
        "Subscribe",
        safeHandler("Subscribe", function (event) {
          logEvent("Subscribe", "subscribe", event);
          gtag("event", "subscribe", {});
        })
      );

      log("Init", "All 13 event subscriptions registered");
    },
  };

  // Register immediately if runtime is ready, otherwise queue for later
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
