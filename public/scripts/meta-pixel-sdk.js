/* eslint-disable no-var */
/* eslint-disable no-unused-expressions */
// ─── Meta Pixel SDK Adapter ─────────────────────────────────────────────────
// Self-contained IIFE. Loads fbevents.js, registers with PixelRuntime,
// subscribes to events, and passes them to:
//   1. Client-side: fbq('track', ...) — standard Meta Pixel
//   2. Server-side: CAPI batch POST — Facebook Conversions API
//
// Event names ARE Facebook event names (PascalCase) — no mapping needed.
//
// Config key: 'meta-pixel'
// Config shape: { pixelId: string, capiEndpoint?: string }
//
// DEDUPLICATION: Every fbq('track') call passes { eventID: event_id } as the
// 4th argument. The same event_id is sent server-side via CAPI, enabling
// Meta's automatic client+server deduplication.
//
// CAPI: If config.capiEndpoint is set, the SDK batches events and POSTs them
// to the server for CAPI dispatch. Flush triggers: 5s timer, batch of 10,
// page hidden/unload, or high-value events (Purchase, InitiateCheckout).
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  "use strict";

  // ─── Logger ────────────────────────────────────────────────────────────────
  var PREFIX = "[MetaPixelSDK]";

  function log() {
    var args = [PREFIX].concat(Array.prototype.slice.call(arguments));
    console.log.apply(console, args);
  }

  log("Initializing meta-pixel-sdk.js");

  // Step 1: Load Meta's fbq library
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) {
      log("fbq already loaded, skipping script injection");
      return;
    }
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) {
      f._fbq = n;
    }
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
    log("fbevents.js script injected");
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );

  // ─── CAPI Batching Engine ────────────────────────────────────────────────
  var FLUSH_INTERVAL_MS = 5000;
  var MAX_BATCH_SIZE = 10;
  var MAX_QUEUE_SIZE = 50;
  var HIGH_VALUE_EVENTS = { Purchase: true, InitiateCheckout: true };

  var capiQueue = [];
  var capiFlushTimer = null;
  var capiEndpoint = null; // set during register() from config

  /**
   * Map SDKEvent.metadata user_data/cookies → Facebook CAPI user_data fields.
   * PII arrives pre-hashed (SHA-256) from the UserEnricher middleware.
   */
  function mapUserDataForCAPI(metadata) {
    var ud = (metadata && metadata.user_data) || {};
    var cookies = (metadata && metadata.cookies) || {};
    var result = {};

    // Pre-hashed PII
    if (ud.email_hash) {
      result.em = ud.email_hash;
    }
    if (ud.phone_hash) {
      result.ph = ud.phone_hash;
    }
    if (ud.first_name_hash) {
      result.fn = ud.first_name_hash;
    }
    if (ud.last_name_hash) {
      result.ln = ud.last_name_hash;
    }
    if (ud.city_hash) {
      result.ct = ud.city_hash;
    }
    if (ud.state_hash) {
      result.st = ud.state_hash;
    }
    if (ud.zip_code) {
      result.zp = ud.zip_code;
    }
    if (ud.country) {
      result.country = ud.country;
    }
    if (ud.date_of_birth_hash) {
      result.db = ud.date_of_birth_hash;
    }
    if (ud.gender_hash) {
      result.ge = ud.gender_hash;
    }
    if (ud.external_id) {
      result.external_id = ud.external_id;
    }

    // Tracking cookies (NOT hashed)
    if (cookies._fbp) {
      result.fbp = cookies._fbp;
    }
    if (cookies._fbc) {
      result.fbc = cookies._fbc;
    }

    return result;
  }

  /**
   * Build a CAPI event from an SDKEvent.
   */
  function buildCAPIEvent(eventName, event) {
    var metadata = event.metadata || {};
    var page = metadata.page || {};

    return {
      event_name: eventName,
      event_id: metadata.event_id,
      event_time: Math.floor((event.timestamp || Date.now()) / 1000),
      event_source_url: page.url,
      action_source: "website",
      user_data: mapUserDataForCAPI(metadata),
      custom_data: event.properties || {},
    };
  }

  /**
   * Flush the CAPI queue — send batched events to server.
   */
  function flushCAPI() {
    if (capiQueue.length === 0 || !capiEndpoint) {
      return;
    }

    var batch = capiQueue.slice();
    capiQueue = [];

    if (capiFlushTimer) {
      clearTimeout(capiFlushTimer);
      capiFlushTimer = null;
    }

    var eventIds = batch.map(function (e) {
      return e.event_id;
    });
    var eventNames = batch.map(function (e) {
      return e.event_name;
    });
    log(
      "CAPI: flushing " + batch.length + " events",
      JSON.stringify({ event_ids: eventIds, event_names: eventNames })
    );

    var payload;
    try {
      payload = JSON.stringify({ events: batch });
    } catch (e) {
      log(
        "CAPI: JSON serialization failed:",
        e,
        JSON.stringify({ event_ids: eventIds })
      );
      return;
    }

    // sendBeacon for reliability during page unload
    if (navigator && navigator.sendBeacon) {
      var blob = new Blob([payload], { type: "application/json" });
      var sent = navigator.sendBeacon(capiEndpoint, blob);
      if (sent) {
        log(
          "CAPI: sendBeacon succeeded",
          JSON.stringify({ event_ids: eventIds })
        );
      } else {
        log(
          "CAPI: sendBeacon failed, falling back to fetch",
          JSON.stringify({ event_ids: eventIds })
        );
        fetchFallbackCAPI(payload, eventIds);
      }
    } else {
      fetchFallbackCAPI(payload, eventIds);
    }
  }

  function fetchFallbackCAPI(payload, eventIds) {
    if (typeof fetch === "undefined") {
      return;
    }
    fetch(capiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    })
      .then(function (res) {
        log(
          "CAPI: fetch " + res.status,
          JSON.stringify({ event_ids: eventIds })
        );
      })
      .catch(function (err) {
        log(
          "CAPI: fetch failed:",
          err,
          JSON.stringify({ event_ids: eventIds })
        );
      });
  }

  function scheduleCAPIFlush() {
    if (!capiFlushTimer) {
      capiFlushTimer = setTimeout(function () {
        flushCAPI();
        capiFlushTimer = null;
      }, FLUSH_INTERVAL_MS);
    }
  }

  /**
   * Queue an event for CAPI dispatch.
   */
  function queueForCAPI(eventName, event) {
    if (!capiEndpoint) {
      return;
    }

    var eventId = eid(event);

    // Drop oldest if queue full
    if (capiQueue.length >= MAX_QUEUE_SIZE) {
      log(
        "[" +
          eventId +
          "] [" +
          eventName +
          "] CAPI: queue full, dropping oldest"
      );
      capiQueue.shift();
    }

    capiQueue.push(buildCAPIEvent(eventName, event));
    log(
      "[" +
        eventId +
        "] [" +
        eventName +
        "] CAPI: queued (batch size: " +
        capiQueue.length +
        ")"
    );

    // Immediate flush for high-value events
    if (HIGH_VALUE_EVENTS[eventName]) {
      log(
        "[" +
          eventId +
          "] [" +
          eventName +
          "] CAPI: high-value event, flushing immediately"
      );
      flushCAPI();
    } else if (capiQueue.length >= MAX_BATCH_SIZE) {
      flushCAPI();
    } else {
      scheduleCAPIFlush();
    }
  }

  // Page lifecycle listeners for CAPI flush
  if (typeof window !== "undefined" && window.addEventListener) {
    window.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        flushCAPI();
      }
    });
    window.addEventListener("pagehide", function () {
      flushCAPI();
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function eid(event) {
    return (event && event.metadata && event.metadata.event_id) || "no-id";
  }

  // Helper: extract eventID options object from event metadata
  function getEventOptions(event) {
    var id = event.metadata ? event.metadata.event_id : undefined;
    return id ? { eventID: id } : {};
  }

  /**
   * Track an event via both client pixel and CAPI.
   * @param {string} eventName - Facebook event name
   * @param {object} event - SDKEvent from PixelRuntime
   * @param {object} [properties] - Override properties (default: event.properties)
   */
  function trackEvent(eventName, event, properties) {
    var props = properties !== undefined ? properties : event.properties;
    fbq("track", eventName, props, getEventOptions(event));
    queueForCAPI(eventName, event);
  }

  // Step 2: Build the registration object
  // Payloads are Meta-canonical — pass through directly to fbq().
  var registration = {
    name: "meta-pixel",
    register: function (analytics, config) {
      log("register() called with pixelId:", config.pixelId);

      // Initialize Meta Pixel with merchant's pixel ID
      fbq("init", config.pixelId);
      log("fbq('init', '" + config.pixelId + "') — pixel initialized");

      // Initialize CAPI if endpoint configured
      if (config.capiEndpoint) {
        capiEndpoint = config.capiEndpoint;
        log("CAPI enabled — endpoint:", capiEndpoint);
      } else {
        log("CAPI disabled — no capiEndpoint in config");
      }

      // ─── Event Subscriptions ──────────────────────────────────────────
      // Payloads ARE Meta-format — zero mapping needed.
      // Each subscription fires both client pixel (fbq) and CAPI queue.

      analytics.subscribe("PageView", function (event) {
        log("[" + eid(event) + "] [PageView] → fbq('track', 'PageView')");
        trackEvent("PageView", event, {});
      });

      analytics.subscribe("ViewContent", function (event) {
        log(
          "[" + eid(event) + "] [ViewContent]",
          JSON.stringify({
            content_ids: event.properties.content_ids,
            value: event.properties.value,
          })
        );
        trackEvent("ViewContent", event);
      });

      analytics.subscribe("AddToCart", function (event) {
        log(
          "[" + eid(event) + "] [AddToCart]",
          JSON.stringify({
            content_ids: event.properties.content_ids,
            value: event.properties.value,
          })
        );
        trackEvent("AddToCart", event);
      });

      analytics.subscribe("InitiateCheckout", function (event) {
        log(
          "[" + eid(event) + "] [InitiateCheckout]",
          JSON.stringify({ value: event.properties.value })
        );
        trackEvent("InitiateCheckout", event);
      });

      analytics.subscribe("AddShippingInfo", function (event) {
        log(
          "[" + eid(event) + "] [AddShippingInfo]",
          JSON.stringify({
            method: event.properties.shipping_method,
            value: event.properties.value,
          })
        );
        trackEvent("AddShippingInfo", event);
      });

      analytics.subscribe("AddPaymentInfo", function (event) {
        log(
          "[" + eid(event) + "] [AddPaymentInfo]",
          JSON.stringify({
            method: event.properties.payment_method,
            value: event.properties.value,
          })
        );
        trackEvent("AddPaymentInfo", event);
      });

      analytics.subscribe("Purchase", function (event) {
        log(
          "[" + eid(event) + "] [Purchase]",
          JSON.stringify({
            order_id: event.properties.order_id,
            value: event.properties.value,
          })
        );
        trackEvent("Purchase", event);
      });

      analytics.subscribe("Search", function (event) {
        log(
          "[" + eid(event) + "] [Search]",
          JSON.stringify({ term: event.properties.search_string })
        );
        trackEvent("Search", event);
      });

      analytics.subscribe("AddToWishlist", function (event) {
        log(
          "[" + eid(event) + "] [AddToWishlist]",
          JSON.stringify({
            content_ids: event.properties.content_ids,
            value: event.properties.value,
          })
        );
        trackEvent("AddToWishlist", event);
      });

      analytics.subscribe("Lead", function (event) {
        log("[" + eid(event) + "] [Lead]");
        trackEvent("Lead", event, {});
      });

      analytics.subscribe("CompleteRegistration", function (event) {
        log("[" + eid(event) + "] [CompleteRegistration]");
        trackEvent("CompleteRegistration", event, {});
      });

      analytics.subscribe("Contact", function (event) {
        log("[" + eid(event) + "] [Contact]");
        trackEvent("Contact", event, {});
      });

      analytics.subscribe("Subscribe", function (event) {
        log("[" + eid(event) + "] [Subscribe]");
        trackEvent("Subscribe", event, {});
      });

      log("All 13 event subscriptions registered (client pixel + CAPI)");
    },
  };

  // Step 3: Register immediately if runtime is ready, otherwise queue
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
