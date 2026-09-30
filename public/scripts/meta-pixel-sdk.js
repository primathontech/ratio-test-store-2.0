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
// Config shape: { pixelId: string, capiEndpoint?: string, capiSecret?: string }
//
// DEDUPLICATION: Every fbq('track') call passes { eventID: event_id } as the
// 4th argument. The same event_id is sent server-side via CAPI, enabling
// Meta's automatic client+server deduplication.
//
// CAPI: If config.capiEndpoint is set, the SDK batches events and POSTs them
// to the server for CAPI dispatch. Flush triggers: 5s timer, batch of 10,
// page hidden/unload, or high-value events (Purchase, InitiateCheckout).
//
// SECURITY: If config.capiSecret is set, every CAPI request is signed with
// HMAC-SHA256. A time-window token is pre-computed and cached so that
// sendBeacon (synchronous) can include it without awaiting crypto.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  "use strict";

  // ─── Logger ────────────────────────────────────────────────────────────────
  var PREFIX = "[MetaPixelSDK]";
  var STYLE = "color: #1877F2; font-weight: bold;";

  function log(category) {
    var args = ["%c" + PREFIX + " [" + category + "]", STYLE].concat(
      Array.prototype.slice.call(arguments, 1)
    );
    console.log.apply(console, args);
  }

  log("Init", "Initializing meta-pixel-sdk.js");

  // Step 1: Load Meta's fbq library
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) {
      log("Init", "fbq already loaded, skipping script injection");
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
    log("Init", "fbevents.js script injected");
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

  // ─── CAPI HMAC Auth ──────────────────────────────────────────────────────
  // Time-window HMAC: token = HMAC-SHA256(secret, timeWindow)
  // timeWindow = floor(Date.now() / 300000) — changes every 5 minutes.
  // Token is pre-computed and cached; flushCAPI uses it synchronously.
  var capiHmacKey = null; // CryptoKey (from crypto.subtle.importKey)
  var capiToken = null; // hex string — current HMAC signature
  var capiTokenTs = 0; // current time window the token was computed for

  /**
   * Import the HMAC secret key (one-time, async).
   * Called during register() if config.capiSecret is provided.
   */
  function initCapiAuth(secret) {
    if (
      typeof crypto === "undefined" ||
      !crypto.subtle ||
      !crypto.subtle.importKey
    ) {
      log("Auth", "crypto.subtle unavailable — requests will be unsigned");
      return;
    }

    var enc = new TextEncoder();
    crypto.subtle
      .importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      )
      .then(function (key) {
        capiHmacKey = key;
        log("Auth", "HMAC key imported");
        return refreshCapiToken();
      })
      .catch(function (err) {
        log("Auth", "key import failed:", err);
      });
  }

  /**
   * Refresh the cached HMAC token if the time window has changed.
   * Returns a Promise (resolved immediately if token is still valid).
   */
  function refreshCapiToken() {
    if (!capiHmacKey) {
      return Promise.resolve();
    }

    var ts = Math.floor(Date.now() / 300000); // 5-minute window
    if (ts === capiTokenTs && capiToken) {
      return Promise.resolve();
    }

    var enc = new TextEncoder();
    return crypto.subtle
      .sign("HMAC", capiHmacKey, enc.encode(String(ts)))
      .then(function (sigBuf) {
        var bytes = new Uint8Array(sigBuf);
        var hex = "";
        for (var i = 0; i < bytes.length; i++) {
          hex += ("0" + bytes[i].toString(16)).slice(-2);
        }
        capiToken = hex;
        capiTokenTs = ts;
      })
      .catch(function (err) {
        log("Auth", "sign failed:", err);
      });
  }

  /**
   * Map SDKEvent.metadata user_data/cookies → CAPI user_data fields.
   * Raw PII is sent to the CAPI route — the server handles
   * normalization, SHA-256 hashing, and field mapping (email→em, etc.).
   */
  function mapUserDataForCAPI(metadata) {
    var ud = (metadata && metadata.user_data) || {};
    var cookies = (metadata && metadata.cookies) || {};
    var result = {};

    // Raw user data — server-side Facebook Business SDK handles hashing
    if (ud.email) {
      result.email = ud.email;
    }
    if (ud.phone) {
      result.phone = ud.phone;
    }
    if (ud.first_name) {
      result.first_name = ud.first_name;
    }
    if (ud.last_name) {
      result.last_name = ud.last_name;
    }
    if (ud.city) {
      result.city = ud.city;
    }
    if (ud.state) {
      result.state = ud.state;
    }
    if (ud.zip_code) {
      result.zip_code = ud.zip_code;
    }
    if (ud.country) {
      result.country = ud.country;
    }
    if (ud.date_of_birth) {
      result.date_of_birth = ud.date_of_birth;
    }
    if (ud.gender) {
      result.gender = ud.gender;
    }
    if (ud.external_id) {
      result.external_id = ud.external_id;
    }

    // Tracking cookies (not hashed — Meta's own identifiers)
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
    log("CAPI", "flushing " + batch.length + " events", {
      event_ids: eventIds,
      event_names: eventNames,
    });

    var payload;
    try {
      var body = { events: batch };
      // Attach HMAC signature if available (pre-computed, synchronous)
      if (capiToken && capiTokenTs) {
        body._ts = capiTokenTs;
        body._sig = capiToken;
      }
      payload = JSON.stringify(body);
    } catch (e) {
      log("CAPI", "JSON serialization failed:", e);
      return;
    }

    // sendBeacon for reliability during page unload
    if (navigator && navigator.sendBeacon) {
      var blob = new Blob([payload], { type: "application/json" });
      var sent = navigator.sendBeacon(capiEndpoint, blob);
      if (sent) {
        log("CAPI", "sendBeacon succeeded", { event_ids: eventIds });
      } else {
        log("CAPI", "sendBeacon failed, falling back to fetch", {
          event_ids: eventIds,
        });
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
        log("CAPI", "fetch " + res.status, { event_ids: eventIds });
      })
      .catch(function (err) {
        log("CAPI", "fetch failed:", err);
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

    // Lazily refresh HMAC token (async, but completes before next flush)
    refreshCapiToken();

    // Drop oldest if queue full
    if (capiQueue.length >= MAX_QUEUE_SIZE) {
      log("CAPI", "queue full, dropping oldest —", eventName);
      capiQueue.shift();
    }

    var capiEvent = buildCAPIEvent(eventName, event);
    capiQueue.push(capiEvent);
    log("CAPI", "queued", eventName, "(batch size: " + capiQueue.length + ")");

    // Immediate flush for high-value events
    if (HIGH_VALUE_EVENTS[eventName]) {
      log("CAPI", "high-value event, flushing immediately —", eventName);
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
    var source = properties !== undefined ? properties : event.properties;

    // Hand Facebook its OWN deep, independent copy of the properties. The same
    // event.properties object is shared with the other pixel SDKs (GA4, GTM,
    // Google Ads, Snapchat) and the CAPI path, so passing it by reference — or
    // via a shallow copy, which still shares nested fields like `contents` /
    // `content_ids` — lets another consumer (or fbevents.js itself) mutate or
    // key on an object we don't own. structuredClone deep-clones without JSON's
    // footguns (dropping `undefined`, turning NaN/Infinity into null, or
    // throwing on circular refs); fall back to a shallow copy on engines
    // without it, and guard the whole thing so tracking never throws.
    var props;
    try {
      props =
        typeof structuredClone === "function"
          ? structuredClone(source)
          : Object.assign({}, source || {});
    } catch (e) {
      log("Track", "structuredClone failed; using shallow copy —", e);
      props = Object.assign({}, source || {});
    }

    fbq("track", eventName, props, getEventOptions(event));
    queueForCAPI(eventName, event);
  }

  // Step 2: Build the registration object
  // Payloads are Meta-canonical — pass through directly to fbq().
  var registration = {
    name: "meta-pixel",
    register: function (analytics, config) {
      log("Init", "register() called with pixelId:", config.pixelId);

      // ── SPA PageView flags (must be set BEFORE fbq('init')) ──────────────
      //
      // disablePushState: fbevents.js wraps history.pushState/replaceState and
      // auto-fires PageView on every SPA navigation. Our SDK fires PageView
      // explicitly (with event_id for CAPI deduplication), so the auto-fire
      // would cause un-deduplicated double PageViews in Meta. Setting this flag
      // to true prevents fbevents.js from attaching those history listeners.
      //
      // allowDuplicatePageViews: fbevents.js maintains an internal per-pixel
      // deduplication cache (ca[pixelId]). After the FIRST fbq('track','PageView')
      // fires it sets ca[pixelId]=true and silently drops every subsequent manual
      // call (via a `continue` in the dispatch loop). The auto-pushState fires
      // bypass this cache internally via allowDuplicatePageViews:true. Manual
      // calls do not — so without this flag, only the home-page PageView fires
      // in the browser pixel; all SPA navigation PageViews are silently dropped.
      fbq.disablePushState = true;
      fbq.allowDuplicatePageViews = true;

      // Initialize Meta Pixel with merchant's pixel ID
      // Initialize Meta Pixel with merchant's pixel ID(s).
      // NEXT_PUBLIC_MULTI_PIXEL_IDS is documented as a comma-separated list
      // (see ENV_GUIDE.md), so split it and init each pixel separately. A
      // single ID yields exactly one init (unchanged behavior). Passing the
      // raw "id1,id2" string to fbq('init') registers an invalid pixel ID that
      // silently fails — no events reach Meta or show in Pixel Helper.
      // Once every pixel is initialized, fbq('track', ...) broadcasts to all.
      var pixelIds = String(config.pixelId || "")
        .split(",")
        .map(function (id) {
          return id.trim();
        })
        .filter(Boolean);

      pixelIds.forEach(function (pixelId) {
        fbq("init", pixelId);
        log("Init", "fbq('init', '" + pixelId + "') — pixel initialized");
      });

      // Initialize CAPI if endpoint configured
      if (config.capiEndpoint) {
        capiEndpoint = config.capiEndpoint;
        log("Init", "CAPI enabled — endpoint:", capiEndpoint);

        // Initialize HMAC auth if secret provided
        if (config.capiSecret) {
          initCapiAuth(config.capiSecret);
          log("Auth", "HMAC signing enabled");
        } else {
          log("Auth", "no capiSecret — requests will be unsigned");
        }
      } else {
        log("Init", "CAPI disabled — no capiEndpoint in config");
      }

      // ─── Event Subscriptions ──────────────────────────────────────────
      // Payloads ARE Meta-format — zero mapping needed.
      // Each subscription fires both client pixel (fbq) and CAPI queue.

      // ─── Helper: structured SDK log ─────────────────────────────────
      function logEvent(eventName, event) {
        log("Event", eventName, event);
      }

      analytics.subscribe("PageView", function (event) {
        logEvent("PageView", event);
        trackEvent("PageView", event, {});
      });

      analytics.subscribe("ViewContent", function (event) {
        logEvent("ViewContent", event);
        trackEvent("ViewContent", event);
      });

      analytics.subscribe("AddToCart", function (event) {
        logEvent("AddToCart", event);
        trackEvent("AddToCart", event);
      });

      if (!config.gokwikEnabled) {
        analytics.subscribe("InitiateCheckout", function (event) {
          logEvent("InitiateCheckout", event);
          trackEvent("InitiateCheckout", event);
        });

        analytics.subscribe("AddShippingInfo", function (event) {
          logEvent("AddShippingInfo", event);
          trackEvent("AddShippingInfo", event);
        });

        analytics.subscribe("AddPaymentInfo", function (event) {
          logEvent("AddPaymentInfo", event);
          trackEvent("AddPaymentInfo", event);
        });

        analytics.subscribe("Purchase", function (event) {
          logEvent("Purchase", event);
          trackEvent("Purchase", event);
        });
      }

      analytics.subscribe("Search", function (event) {
        logEvent("Search", event);
        trackEvent("Search", event);
      });

      analytics.subscribe("AddToWishlist", function (event) {
        logEvent("AddToWishlist", event);
        trackEvent("AddToWishlist", event);
      });

      analytics.subscribe("Lead", function (event) {
        logEvent("Lead", event);
        trackEvent("Lead", event, {});
      });

      analytics.subscribe("CompleteRegistration", function (event) {
        logEvent("CompleteRegistration", event);
        trackEvent("CompleteRegistration", event, {});
      });

      analytics.subscribe("Contact", function (event) {
        logEvent("Contact", event);
        trackEvent("Contact", event, {});
      });

      analytics.subscribe("Subscribe", function (event) {
        logEvent("Subscribe", event);
        trackEvent("Subscribe", event, {});
      });

      log(
        "Init",
        "All 13 event subscriptions registered (client pixel + CAPI)"
      );
    },
  };

  // Step 3: Register immediately if runtime is ready, otherwise queue
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
