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
//   1. Inject the GTM container snippet so GTM loads
//   2. Push GA4 Enhanced Ecommerce-shaped events into dataLayer so GTM
//      triggers (event equals "view_item", page_type equals "product", etc.)
//      can match reliably
//   3. Apply Consent Mode v2 defaults *before* the container loads
//
// Config (in pixelConfig.ts under key "gtm"):
//   {
//     containerId:   "GTM-XXXXXXX",   // required
//     auth?:         string,           // GTM Server-Side env auth token
//     preview?:      string,           // GTM Server-Side env preview name
//     dataLayerName?: string,          // default "dataLayer"
//     defaultConsent?: {               // Consent Mode v2 defaults
//       ad_storage?:           "granted" | "denied",
//       ad_user_data?:         "granted" | "denied",
//       ad_personalization?:   "granted" | "denied",
//       analytics_storage?:    "granted" | "denied",
//       functionality_storage?:"granted" | "denied",
//       personalization_storage?:"granted"|"denied",
//       security_storage?:     "granted" | "denied"
//     },
//     debug?:        boolean           // verbose logs (default: NODE_ENV check)
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
// Every ecommerce push first clears `ecommerce: null` (official GTM best
// practice — prevents data bleed between navigations on SPAs).
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  "use strict";

  // ─── Logger ────────────────────────────────────────────────────────────────
  var PREFIX = "[GTMSDK]";
  var STYLE = "color: #246FDB; font-weight: bold;";

  function log(category) {
    var args = ["%c" + PREFIX + " [" + category + "]", STYLE].concat(
      Array.prototype.slice.call(arguments, 1)
    );
    console.log.apply(console, args);
  }

  log("Init", "Initializing gtm-pixel-sdk.js");

  // ─── Helpers ───────────────────────────────────────────────────────────────

  function safeHandler(eventName, fn) {
    return function (event) {
      try {
        fn(event);
      } catch (err) {
        log("Error", eventName, err);
      }
    };
  }

  function logEvent(systemName, gtmEventName, event) {
    log("Event", systemName + " → " + gtmEventName, event);
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

  // ─── Step 1: Build the registration object ─────────────────────────────────
  var registration = {
    name: "gtm",

    register: function (analytics, config) {
      log("Init", "register() called with containerId:", config.containerId);

      if (
        !config.containerId ||
        typeof config.containerId !== "string" ||
        config.containerId.indexOf("GTM-") !== 0
      ) {
        log(
          "Error",
          "Invalid containerId — expected format GTM-XXXXXXX, got:",
          config.containerId
        );
        return;
      }

      // Resolve dataLayer (custom name supported for tenants who run two GTM
      // containers side-by-side on the same domain — rare but legitimate).
      var dataLayerName =
        typeof config.dataLayerName === "string" && config.dataLayerName
          ? config.dataLayerName
          : "dataLayer";

      window[dataLayerName] = window[dataLayerName] || [];
      var dl = window[dataLayerName];

      // ── Push wrappers ────────────────────────────────────────────────────
      // Centralized so we never reach for window.dataLayer.push directly.
      // Keeps every push observable for debugging and dedup.
      function push(payload) {
        try {
          dl.push(payload);
          log("Push", payload.event || "(no-event)", payload);
        } catch (err) {
          log("Error", "dataLayer.push failed", err);
        }
      }

      function pushEcommerce(eventName, ecommerce, extra) {
        // GTM best practice: clear previous ecommerce so stale items from a
        // prior page don't leak into the next push.
        push({ event: eventName + "_clear", ecommerce: null });
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
      var defaultConsent = {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
        functionality_storage: "granted",
        personalization_storage: "granted",
        security_storage: "granted",
      };
      if (config.defaultConsent && typeof config.defaultConsent === "object") {
        for (var key in config.defaultConsent) {
          if (
            Object.prototype.hasOwnProperty.call(config.defaultConsent, key)
          ) {
            defaultConsent[key] = config.defaultConsent[key];
          }
        }
      }

      // Use the gtag() shim if GA4 SDK already installed it; otherwise create
      // a minimal one ourselves so consent commands still land in dataLayer.
      // gtag(...) is *literally* a wrapper around dataLayer.push(arguments).
      if (typeof window.gtag !== "function") {
        window.gtag = function () {
          dl.push(arguments);
        };
        log("Init", "gtag shim installed");
      }
      window.gtag("consent", "default", defaultConsent);
      log("Consent", "default consent applied", defaultConsent);

      // ── Step 3: Inject the GTM container snippet ─────────────────────────
      // Mirrors the official Google snippet, with optional GTM Server-Side
      // auth/preview query params appended.
      if (window.__OPEN_STORE_GTM_LOADED__) {
        log("Init", "GTM already loaded — skipping container injection");
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
          log("Error", "GTM script failed to load — network or CSP blocked");
        };
        var first = document.getElementsByTagName("script")[0];
        if (first && first.parentNode) {
          first.parentNode.insertBefore(script, first);
        } else {
          document.head.appendChild(script);
        }
        log("Init", "GTM container script injected:", src);

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
            log("Init", "<noscript> fallback iframe injected");
          }
        } catch (err) {
          log("Error", "noscript injection failed", err);
        }
      }

      // ── Step 4: Base page context — once per registration ────────────────
      // The merchant can build a "fire only on PDP" trigger by checking
      // page_type === "product" in dataLayer. We seed it now so the very
      // first auto-tags GTM fires on container load have it available.
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
            currency: p.currency || "INR",
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
            currency: p.currency || "INR",
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
            currency: p.currency || "INR",
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
            currency: p.currency || "INR",
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
            currency: p.currency || "INR",
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
            currency: p.currency || "INR",
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
            currency: p.currency || "INR",
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
            currency: p.currency || "INR",
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

      log("Init", "All 13 event subscriptions registered");
    },
  };

  // ─── Step 5: Register with the PixelRuntime ────────────────────────────────
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
