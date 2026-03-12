/* eslint-disable no-var */
/* eslint-disable no-unused-expressions */
// ─── Google Ads SDK — Self-Registering IIFE ─────────────────────────────────
// Reuses gtag.js if already loaded (by GA4), otherwise loads it.
// Config key: "google-ads" → { conversionId: string, conversionLabel: string }
//
// Events tracked: Purchase, InitiateCheckout, AddToCart
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  "use strict";

  var PREFIX = "[GoogleAdsSDK]";

  function log() {
    var args = [PREFIX].concat(Array.prototype.slice.call(arguments));
    console.log.apply(console, args);
  }

  log("Initializing google-ads-pixel-sdk.js");

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
    name: "google-ads",
    register: function (analytics, config) {
      log("register() called with conversionId:", config.conversionId);

      // Reuse gtag.js + window.gtag if already loaded by GA4, otherwise load it
      window.dataLayer = window.dataLayer || [];
      if (!window.gtag) {
        var script = document.createElement("script");
        script.async = true;
        script.src =
          "https://www.googletagmanager.com/gtag/js?id=" + config.conversionId;
        document.head.appendChild(script);
        window.gtag = function () {
          window.dataLayer.push(arguments);
        };
        window.gtag("js", new Date());
        log("gtag.js script injected");
      } else {
        log("Reusing existing gtag from GA4");
      }
      var gtag = window.gtag;
      gtag("config", config.conversionId, { send_page_view: false });
      log("gtag configured with conversionId:", config.conversionId);

      var sendTo = config.conversionId + "/" + config.conversionLabel;

      analytics.subscribe(
        "Purchase",
        safeHandler("Purchase", function (event) {
          var p = event.properties;
          log(
            "[" + eid(event) + "] [Purchase] → conversion",
            JSON.stringify({
              send_to: sendTo,
              value: p.value,
              order_id: p.order_id,
            })
          );
          gtag("event", "conversion", {
            send_to: sendTo,
            value: p.value,
            currency: p.currency || "INR",
            transaction_id: p.order_id,
          });
        })
      );

      analytics.subscribe(
        "InitiateCheckout",
        safeHandler("InitiateCheckout", function (event) {
          var p = event.properties;
          log(
            "[" + eid(event) + "] [InitiateCheckout] → conversion",
            JSON.stringify({ send_to: sendTo, value: p.value })
          );
          gtag("event", "conversion", {
            send_to: sendTo,
            value: p.value,
            currency: p.currency || "INR",
          });
        })
      );

      analytics.subscribe(
        "AddToCart",
        safeHandler("AddToCart", function (event) {
          var p = event.properties;
          log(
            "[" + eid(event) + "] [AddToCart] → conversion",
            JSON.stringify({ send_to: sendTo, value: p.value })
          );
          gtag("event", "conversion", {
            send_to: sendTo,
            value: p.value,
            currency: p.currency || "INR",
          });
        })
      );

      log("All 3 event subscriptions registered");
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
