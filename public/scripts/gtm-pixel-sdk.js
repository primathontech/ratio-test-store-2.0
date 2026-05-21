/* eslint-disable no-var */
/* eslint-disable no-unused-expressions */
// ─── GTM (Google Tag Manager) SDK — Self-Registering IIFE ───────────────────
// Loads the merchant's GTM container, mirrors PixelRuntime events into
// window.dataLayer using the GA4 Enhanced Ecommerce schema, and bridges
// SPA navigations so GTM tags can fire per-page.
//
// WHY GTM IS DIFFERENT
// ────────────────────
// Other SDKs (ga4, meta) own a vendor library (gtag, fbq) and translate
// events into vendor API calls. GTM has no vendor API — its only input is
// window.dataLayer. The merchant configures *everything* (Meta Pixel, GA4
// secondary tags, Moengage, custom HTML) inside the GTM web dashboard, and
// each tag reads from dataLayer.
//
// Our job is therefore:
//   1. Apply Consent Mode v2 defaults *before* the container loads
//   2. Inject the GTM container snippet so GTM loads
//   3. Push GA4 Enhanced Ecommerce-shaped events into dataLayer so GTM
//      triggers (event equals "view_item", page_type equals "product", etc.)
//      can match reliably
//
// Config (in pixelConfig.ts under key "gtm"):
//   {
//     containerId:     "GTM-XXXXXXX",  // required
//     auth?:           string,          // GTM Server-Side env auth token
//     preview?:        string,          // GTM Server-Side env preview name
//     dataLayerName?:  string,          // default "dataLayer"
//     defaultCurrency?: string,         // ISO 4217, default "INR"
//     defaultConsent?: {                // Consent Mode v2 defaults
//       ad_storage?:           "granted" | "denied",
//       ad_user_data?:         "granted" | "denied",
//       ad_personalization?:   "granted" | "denied",
//       analytics_storage?:    "granted" | "denied",
//       functionality_storage?:"granted" | "denied",
//       personalization_storage?:"granted"|"denied",
//       security_storage?:     "granted" | "denied"
//     },
//     debug?:          boolean          // verbose logs (default: false in prod,
//                                       //   auto-on if window.__shopkit_debug
//                                       //   is true or hostname is localhost)
//   }
//
// Events tracked (13 PascalCase standard events → GA4 Enhanced Ecommerce):
//   PageView         → page_view
//   ViewContent      → view_item
//   AddToCart        → add_to_cart
//   InitiateCheckout → begin_checkout
//   AddShippingInfo  → add_shipping_info
//   AddPaymentInfo   → add_payment_info
//   Purchase         → purchase
//   Search           → search
//   AddToWishlist    → add_to_wishlist
//   Lead             → generate_lead
//   CompleteRegistration → sign_up
//   Contact          → contact
//   Subscribe        → subscribe
//
// Every ecommerce push first clears the prior ecommerce object per Google's
// official guidance: dataLayer.push({ ecommerce: null }) — note no `event`
// field, so GTM does NOT treat this as a triggerable event.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  "use strict";

  // ─── Logger ────────────────────────────────────────────────────────────────
  // Two channels:
  //   logDebug(...) — informational, gated by debug flag
  //   logError(...) — always emitted (problems are never silenced)
  var PREFIX = "[GTMSDK]";
  var STYLE = "color: #246FDB; font-weight: bold;";

  // Debug auto-detection: localhost dev OR explicit window.__shopkit_debug.
  // Updated per-register() from config.debug if provided.
  var debugEnabled = (function () {
    try {
      if (typeof window === "undefined") {
        return false;
      }
      if (window.__shopkit_debug === true) {
        return true;
      }
      var host = (window.location && window.location.hostname) || "";
      return host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0";
    } catch (_) {
      return false;
    }
  })();

  function logRaw(category, args) {
    var prepended = ["%c" + PREFIX + " [" + category + "]", STYLE].concat(args);
    console.log.apply(console, prepended);
  }

  function logDebug(category) {
    if (!debugEnabled) {
      return;
    }
    logRaw(category, Array.prototype.slice.call(arguments, 1));
  }

  function logError(category) {
    // Errors always print. Use console.error for proper severity in
    // Sentry/observability tools that wrap console methods.
    var args = ["%c" + PREFIX + " [" + category + "]", STYLE].concat(
      Array.prototype.slice.call(arguments, 1)
    );
    console.error.apply(console, args);
  }

  logDebug("Init", "Initializing gtm-pixel-sdk.js");

  // ─── Helpers ───────────────────────────────────────────────────────────────

  function safeHandler(eventName, fn) {
    return function (event) {
      try {
        fn(event);
      } catch (err) {
        logError("Error", eventName, err);
      }
    };
  }

  function logEvent(systemName, gtmEventName, event) {
    logDebug("Event", systemName + " → " + gtmEventName, event);
  }

  /**
   * Derive a stable `page_type` tag from the current URL pathname.
   * Lets merchants build GTM triggers like "page_type equals product"
   * without having to depend on regex matching against page paths.
   * Pure function of pathname — safe to call on every push.
   */
  function derivePageType(pathname) {
    if (!pathname || pathname === "/") {
      return "home";
    }
    if (pathname.indexOf("/products/") === 0 || pathname === "/products") {
      return "product";
    }
    if (
      pathname.indexOf("/collections/") === 0 ||
      pathname === "/collections"
    ) {
      return "collection";
    }
    if (pathname === "/cart" || pathname.indexOf("/cart/") === 0) {
      return "cart";
    }
    if (
      pathname.indexOf("/search") === 0 ||
      pathname.indexOf("/pages/search") === 0
    ) {
      return "search";
    }
    if (
      pathname.indexOf("/thank-you") === 0 ||
      pathname.indexOf("/order-confirmation") === 0 ||
      pathname.indexOf("/checkout/success") === 0
    ) {
      return "thank_you";
    }
    return "page";
  }

  /**
   * Map PixelRuntime `contents[]` array → GA4 `items[]` schema.
   * Contents are vendor-agnostic; GA4 ecommerce expects strict field names.
   * Tolerates missing fields — GA4 ignores undefined keys.
   */
  function mapItems(contents, fallbackName) {
    return (contents || []).map(function (c, idx) {
      return {
        item_id: c.id,
        item_name: c.name || fallbackName || "",
        item_brand: c.brand || undefined,
        item_category: c.category || undefined,
        item_variant: c.variant || undefined,
        price: c.item_price,
        quantity: c.quantity,
        index: idx,
      };
    });
  }

  // ─── Consent value validation ─────────────────────────────────────────────
  // Consent Mode v2 only accepts "granted" or "denied". Anything else is
  // silently rejected by gtag — easy to miss in code review. Validate up front
  // and warn on bad values so misconfigs surface immediately.
  var VALID_CONSENT_VALUES = { granted: 1, denied: 1 };
  function sanitizeConsent(input, base) {
    var out = {};
    for (var k in base) {
      if (Object.prototype.hasOwnProperty.call(base, k)) {
        out[k] = base[k];
      }
    }
    if (!input || typeof input !== "object") {
      return out;
    }
    for (var key in input) {
      if (!Object.prototype.hasOwnProperty.call(input, key)) {
        continue;
      }
      var v = input[key];
      if (VALID_CONSENT_VALUES[v]) {
        out[key] = v;
      } else {
        logError(
          "Consent",
          'Invalid consent value for "' +
            key +
            '": ' +
            JSON.stringify(v) +
            ' — must be "granted" or "denied". Ignoring.'
        );
      }
    }
    return out;
  }

  // ─── Step 1: Build the registration object ─────────────────────────────────
  var registration = {
    name: "gtm",

    register: function (analytics, config) {
      // Honor explicit debug override from config (overrides auto-detection)
      if (typeof config.debug === "boolean") {
        debugEnabled = config.debug;
      }

      logDebug(
        "Init",
        "register() called with containerId:",
        config.containerId
      );

      if (
        !config.containerId ||
        typeof config.containerId !== "string" ||
        config.containerId.indexOf("GTM-") !== 0
      ) {
        logError(
          "Error",
          "Invalid containerId — expected format GTM-XXXXXXX, got:",
          config.containerId
        );
        return;
      }

      var defaultCurrency =
        typeof config.defaultCurrency === "string" && config.defaultCurrency
          ? config.defaultCurrency
          : "INR";

      // Resolve dataLayer (custom name supported for tenants who run two GTM
      // containers side-by-side on the same domain — rare but legitimate).
      var dataLayerName =
        typeof config.dataLayerName === "string" && config.dataLayerName
          ? config.dataLayerName
          : "dataLayer";

      window[dataLayerName] = window[dataLayerName] || [];
      var dl = window[dataLayerName];

      // ── Push wrappers ────────────────────────────────────────────────────
      // Centralized so we never reach for dl.push directly. Every push goes
      // through here for: observability (debug logging), shallow-copy safety,
      // and `page_type` auto-attachment.
      //
      // Auto-attach `page_type` rules:
      //   - Only when payload has an `event` field (so the no-event
      //     { ecommerce: null } clear push stays clean)
      //   - Only when not already set (page_view sets its own from
      //     authoritative event metadata)
      //   - Derived from CURRENT pathname at push time — reflects the actual
      //     page the user is on, even after SPA navigations
      //   - We clone the payload before mutating to avoid surprising any
      //     caller who passed a shared/frozen object
      function push(payload) {
        try {
          var out = payload;
          if (
            payload &&
            typeof payload === "object" &&
            !Array.isArray(payload) &&
            typeof payload.event === "string" &&
            payload.page_type === undefined
          ) {
            // Shallow clone (sufficient — ecommerce is a separate object ref
            // we don't mutate, and primitives are immutable)
            out = {};
            for (var k in payload) {
              if (Object.prototype.hasOwnProperty.call(payload, k)) {
                out[k] = payload[k];
              }
            }
            try {
              out.page_type = derivePageType(
                (window.location && window.location.pathname) || "/"
              );
            } catch (_) {
              // best effort — don't let URL access errors break the push
            }
          }
          dl.push(out);
          logDebug("Push", (out && out.event) || "(ecommerce-clear)", out);
        } catch (err) {
          logError("Error", "dataLayer.push failed", err);
        }
      }

      /**
       * GA4 Enhanced Ecommerce push helper.
       *
       * Pushes TWO entries per call, per Google's official guidance:
       *   1. { ecommerce: null }                     — clears prior ecommerce
       *      ↑ NO `event` field. GTM does NOT treat this as a triggerable
       *      event. This is critical — early versions used `event: "X_clear"`
       *      which would let merchants accidentally bind tags to the clear.
       *   2. { event, ecommerce, ...extra }          — the actual event
       *
       * Reference:
       *   https://developers.google.com/tag-platform/gtagjs/reference#clear
       */
      function pushEcommerce(eventName, ecommerce, extra) {
        push({ ecommerce: null });
        var payload = { event: eventName, ecommerce: ecommerce };
        if (extra) {
          for (var k in extra) {
            if (Object.prototype.hasOwnProperty.call(extra, k)) {
              payload[k] = extra[k];
            }
          }
        }
        push(payload);
      }

      // ── Step 2: Consent Mode v2 (must be set BEFORE container loads) ─────
      // Defaults to "granted" across the board to match this storefront's
      // current behavior. A future cookie banner can call
      //   window.gtag('consent', 'update', { ... })
      // to downgrade specific categories.
      var defaultConsent = sanitizeConsent(config.defaultConsent, {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
        functionality_storage: "granted",
        personalization_storage: "granted",
        security_storage: "granted",
      });

      // gtag() is *literally* `function() { dataLayer.push(arguments); }`.
      // If layout.tsx already installed a global one, it pushes to
      // window.dataLayer — which is wrong if we're using a custom
      // dataLayerName. So when the names diverge, we route consent through
      // OUR dl directly (still a valid gtag-shape arguments-object push).
      // When using the default name, we reuse whatever gtag exists or
      // install a minimal shim.
      function gtagOurs() {
        dl.push(arguments);
      }
      var gtag;
      if (dataLayerName === "dataLayer" && typeof window.gtag === "function") {
        gtag = window.gtag;
      } else {
        gtag = gtagOurs;
        if (
          dataLayerName === "dataLayer" &&
          typeof window.gtag !== "function"
        ) {
          // Expose for downstream code that expects window.gtag (only safe
          // when we own the default dataLayer)
          window.gtag = gtagOurs;
          logDebug("Init", "gtag shim installed");
        }
      }
      gtag("consent", "default", defaultConsent);
      logDebug("Consent", "default consent applied", defaultConsent);

      // ── Step 3: Inject the GTM container snippet ─────────────────────────
      // Mirrors the official Google snippet, with optional GTM Server-Side
      // auth/preview query params appended.
      if (window.__OPEN_STORE_GTM_LOADED__) {
        logDebug("Init", "GTM already loaded — skipping container injection");
      } else {
        window.__OPEN_STORE_GTM_LOADED__ = true;
        dl.push({
          "gtm.start": new Date().getTime(),
          event: "gtm.js",
        });

        var src =
          "https://www.googletagmanager.com/gtm.js?id=" +
          encodeURIComponent(config.containerId);
        if (dataLayerName !== "dataLayer") {
          src += "&l=" + encodeURIComponent(dataLayerName);
        }
        if (config.auth) {
          src += "&gtm_auth=" + encodeURIComponent(config.auth);
        }
        if (config.preview) {
          src +=
            "&gtm_preview=" +
            encodeURIComponent(config.preview) +
            "&gtm_cookies_win=x";
        }

        var script = document.createElement("script");
        script.async = true;
        script.src = src;
        script.onerror = function () {
          // Reset the guard so a later re-attempt can retry (e.g., if an
          // adblocker is disabled mid-session and the page is re-hydrated).
          // The container snippet is idempotent on Google's side via
          // gtm.js's own load-once check, so retrying is safe.
          window.__OPEN_STORE_GTM_LOADED__ = false;
          logError(
            "Error",
            "GTM script failed to load — network or CSP blocked. Container ID:",
            config.containerId
          );
        };
        var first = document.getElementsByTagName("script")[0];
        if (first && first.parentNode) {
          first.parentNode.insertBefore(script, first);
        } else {
          document.head.appendChild(script);
        }
        logDebug("Init", "GTM container script injected:", src);

        // <noscript> iframe fallback. Inserted at the top of <body> for users
        // with JavaScript disabled. Loaded lazily — by the time this SDK runs
        // <body> exists, so we don't need document.write.
        try {
          var ns = document.createElement("noscript");
          var iframe = document.createElement("iframe");
          iframe.src =
            "https://www.googletagmanager.com/ns.html?id=" +
            encodeURIComponent(config.containerId);
          iframe.height = "0";
          iframe.width = "0";
          iframe.style.display = "none";
          iframe.style.visibility = "hidden";
          ns.appendChild(iframe);
          if (document.body) {
            document.body.insertBefore(ns, document.body.firstChild);
            logDebug("Init", "<noscript> fallback iframe injected");
          }
        } catch (err) {
          logError("Error", "noscript injection failed", err);
        }
      }

      // ── Step 4: Base page context — once per registration ────────────────
      // Custom event (not a GA4-standard name). Purpose: gives merchants a
      // very early dataLayer entry with `page_type` populated, so any tag
      // configured to fire on container load (gtm.js / All Pages) has access
      // to it. Without this, the merchant would have to wait for the
      // subsequent page_view push, which is async.
      var initialPath =
        typeof window !== "undefined" && window.location
          ? window.location.pathname
          : "/";
      push({
        event: "gtm_context_ready",
        page_type: derivePageType(initialPath),
      });

      // ─── Event Subscriptions ──────────────────────────────────────────────

      // PageView — fires on initial load AND on every SPA navigation.
      // We push a virtual `page_view` event so GTM can match per-page tags.
      analytics.subscribe(
        "PageView",
        safeHandler("PageView", function (event) {
          var page = (event.metadata && event.metadata.page) || {};
          var path = page.path || "/";
          logEvent("PageView", "page_view", event);
          push({
            event: "page_view",
            page_type: derivePageType(path),
            page_path: path,
            page_title: page.title || "",
            page_location: page.url || "",
            page_referrer: page.referrer || "",
          });
        })
      );

      analytics.subscribe(
        "ViewContent",
        safeHandler("ViewContent", function (event) {
          var p = event.properties || {};
          logEvent("ViewContent", "view_item", event);
          pushEcommerce("view_item", {
            currency: p.currency || defaultCurrency,
            value: p.value,
            items: [
              {
                item_id: (p.content_ids || [])[0],
                item_name: p.content_name || "",
                item_category: p.content_category || undefined,
                price: p.value,
              },
            ],
          });
        })
      );

      analytics.subscribe(
        "AddToCart",
        safeHandler("AddToCart", function (event) {
          var p = event.properties || {};
          logEvent("AddToCart", "add_to_cart", event);
          pushEcommerce("add_to_cart", {
            currency: p.currency || defaultCurrency,
            value: p.value,
            items: mapItems(p.contents, p.content_name),
          });
        })
      );

      analytics.subscribe(
        "InitiateCheckout",
        safeHandler("InitiateCheckout", function (event) {
          var p = event.properties || {};
          logEvent("InitiateCheckout", "begin_checkout", event);
          pushEcommerce("begin_checkout", {
            currency: p.currency || defaultCurrency,
            value: p.value,
            coupon: p.coupon || undefined,
            items: mapItems(p.contents),
          });
        })
      );

      analytics.subscribe(
        "AddShippingInfo",
        safeHandler("AddShippingInfo", function (event) {
          var p = event.properties || {};
          logEvent("AddShippingInfo", "add_shipping_info", event);
          pushEcommerce("add_shipping_info", {
            currency: p.currency || defaultCurrency,
            value: p.value,
            coupon: p.coupon || undefined,
            shipping_tier: p.shipping_method || undefined,
            items: mapItems(p.contents),
          });
        })
      );

      analytics.subscribe(
        "AddPaymentInfo",
        safeHandler("AddPaymentInfo", function (event) {
          var p = event.properties || {};
          logEvent("AddPaymentInfo", "add_payment_info", event);
          pushEcommerce("add_payment_info", {
            currency: p.currency || defaultCurrency,
            value: p.value,
            payment_type: p.payment_method || undefined,
            items: mapItems(p.contents),
          });
        })
      );

      analytics.subscribe(
        "Purchase",
        safeHandler("Purchase", function (event) {
          var p = event.properties || {};
          logEvent("Purchase", "purchase", event);
          pushEcommerce("purchase", {
            transaction_id: p.order_id,
            currency: p.currency || defaultCurrency,
            value: p.value,
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
          var p = event.properties || {};
          logEvent("Search", "search", event);
          push({
            event: "search",
            search_term: p.search_string || "",
            search_results_count:
              typeof p.num_items === "number" ? p.num_items : undefined,
          });
        })
      );

      analytics.subscribe(
        "AddToWishlist",
        safeHandler("AddToWishlist", function (event) {
          var p = event.properties || {};
          logEvent("AddToWishlist", "add_to_wishlist", event);
          pushEcommerce("add_to_wishlist", {
            currency: p.currency || defaultCurrency,
            value: p.value,
            items: [
              {
                item_id: (p.content_ids || [])[0],
                item_name: p.content_name || "",
                price: p.value,
              },
            ],
          });
        })
      );

      analytics.subscribe(
        "Lead",
        safeHandler("Lead", function (event) {
          var p = event.properties || {};
          logEvent("Lead", "generate_lead", event);
          push({
            event: "generate_lead",
            currency: p.currency || defaultCurrency,
            value: p.value,
          });
        })
      );

      analytics.subscribe(
        "CompleteRegistration",
        safeHandler("CompleteRegistration", function (event) {
          var p = event.properties || {};
          logEvent("CompleteRegistration", "sign_up", event);
          push({
            event: "sign_up",
            method: p.method || undefined,
          });
        })
      );

      analytics.subscribe(
        "Contact",
        safeHandler("Contact", function (event) {
          logEvent("Contact", "contact", event);
          push({ event: "contact" });
        })
      );

      analytics.subscribe(
        "Subscribe",
        safeHandler("Subscribe", function (event) {
          logEvent("Subscribe", "subscribe", event);
          push({ event: "subscribe" });
        })
      );

      logDebug("Init", "All 13 event subscriptions registered");
    },
  };

  // ─── Step 5: Register with the PixelRuntime ────────────────────────────────
  if (window.__OPEN_STORE_PIXEL_RUNTIME__) {
    logDebug("Init", "Runtime found — registering immediately");
    window.__OPEN_STORE_PIXEL_RUNTIME__.register(registration);
  } else {
    logDebug(
      "Init",
      "Runtime not ready — pushing to __OPEN_STORE_PIXEL_PENDING__ queue"
    );
    window.__OPEN_STORE_PIXEL_PENDING__ =
      window.__OPEN_STORE_PIXEL_PENDING__ || [];
    window.__OPEN_STORE_PIXEL_PENDING__.push(registration);
  }
})();
