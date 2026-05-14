/* eslint-disable no-var */
// ─── Google Ads SDK — Self-Registering IIFE ─────────────────────────────────
// Reuses gtag.js if already loaded (by GA4), otherwise loads it.
//
// Config:
//   {
//     conversionId:     "AW-123456789",      // required, account-level
//     conversionLabel?: "abc",               // legacy — applied to Purchase
//     events?:          { Purchase: "abc", AddToCart: "xyz", ... },
//     defaultCurrency?: "INR",
//     debug?:           false
//   }
//
// In Google Ads, `conversionId` is account-wide and each conversion action
// has its own `conversionLabel`. An event is registered iff it has a label.
// Any analytics event name is allowed — see buildPayload() for tailored
// payloads; unknown events fall through to a sensible default.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  "use strict";

  var VERSION = "1.0.0";
  var PREFIX = "[GoogleAdsSDK v" + VERSION + "]";
  var REGISTERED_FLAG = "__GOOGLE_ADS_SDK_REGISTERED__";

  // Logger that respects `config.debug`. Errors/warnings always log; info
  // logs only when debug is on. Avoids leaking event payloads in production.
  function makeLogger(level) {
    return function () {
      var args = [PREFIX].concat(Array.prototype.slice.call(arguments));
      // eslint-disable-next-line no-console
      (console[level] || console.log).apply(console, args);
    };
  }
  var logError = makeLogger("error");
  var logWarn = makeLogger("warn");
  var noop = function () {};
  // Replaced with real logger once we see `config.debug`.
  var logInfo = noop;

  // ─── Helpers ───────────────────────────────────────────────────────────────
  function eid(event) {
    return (event && event.metadata && event.metadata.event_id) || "no-id";
  }

  // Coerce gtag-friendly numeric value. Returns undefined if not finite, so
  // callers can omit the key entirely rather than send NaN/null.
  function toNumber(v) {
    if (v === undefined || v === null || v === "") {
      return undefined;
    }
    var n = typeof v === "number" ? v : Number(v);
    return isFinite(n) ? n : undefined;
  }

  function safeHandler(eventName, fn) {
    return function (event) {
      try {
        fn(event);
      } catch (err) {
        logError(
          "[" + eid(event) + "] [" + eventName + "] handler error:",
          err
        );
      }
    };
  }

  // Build a gtag event payload from a Shopify analytics event.
  //
  // Known events get tailored payloads — Purchase carries `transaction_id`
  // (Google Ads requires it for de-duplication), browsing/cart events carry
  // `value`, lead-style events carry neither. Any other event falls through
  // to the default branch — `value` included only when present and numeric,
  // so custom events stay clean.
  //
  // gtag conversion docs:
  //   https://developers.google.com/google-ads/api/docs/conversions/upload-clicks
  function buildPayload(eventName, sendTo, event, defaultCurrency) {
    var p = event.properties || {};
    var currency = p.currency || defaultCurrency;
    var value = toNumber(p.value);
    var base = { send_to: sendTo };
    if (currency) {
      base.currency = currency;
    }

    switch (eventName) {
      case "Purchase":
        if (value !== undefined) {
          base.value = value;
        }
        if (p.order_id) {
          base.transaction_id = String(p.order_id);
        }
        return base;
      case "AddToCart":
      case "ViewItem":
      case "ViewCart":
      case "BeginCheckout":
      case "AddPaymentInfo":
      case "AddShippingInfo":
        if (value !== undefined) {
          base.value = value;
        }
        return base;
      case "SignUp":
      case "Lead":
        return base;
      default:
        if (value !== undefined) {
          base.value = value;
        }
        return base;
    }
  }

  // Merge the legacy top-level `conversionLabel` into the events map so the
  // rest of the code only deals with one shape: `{ EventName: label }`.
  // The merge is non-destructive — an explicit events.Purchase wins.
  //
  // Event names are NOT allowlisted — the analytics runtime is the source of
  // truth on what events exist. We only sanity-check that each label is a
  // non-empty string.
  function buildLabelMap(config) {
    var map = config.events ? Object.assign({}, config.events) : {};
    if (config.conversionLabel && !map.Purchase) {
      map.Purchase = config.conversionLabel;
    }
    Object.keys(map).forEach(function (eventName) {
      if (typeof map[eventName] !== "string" || !map[eventName]) {
        logWarn(
          "[" + eventName + "] ignored — label must be a non-empty string"
        );
        delete map[eventName];
      }
    });
    return map;
  }

  // Load gtag.js exactly once per page. Returns the shared `window.gtag` ref.
  // Attaches an onerror handler so CSP / adblock failures are observable.
  function ensureGtag(conversionId) {
    window.dataLayer = window.dataLayer || [];
    if (window.gtag) {
      logInfo("Reusing existing gtag (likely from GA4)");
      return window.gtag;
    }
    var script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(conversionId);
    script.onerror = function () {
      logError(
        "Failed to load gtag.js — conversions will not fire. Check CSP / network / adblock."
      );
    };
    document.head.appendChild(script);
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    logInfo("gtag.js script injected");
    return window.gtag;
  }

  // Define registration object
  var registration = {
    name: "google-ads",
    register: function (analytics, config) {
      config = config || {};

      // Wire up info-level logger now that we can see the debug flag.
      logInfo = config.debug ? makeLogger("log") : noop;

      logInfo("register() called with conversionId:", config.conversionId);

      // ─── Validate config ──────────────────────────────────────────────────
      if (!config.conversionId) {
        logError("conversionId is required — aborting registration");
        return;
      }

      var labelMap = buildLabelMap(config);
      var eventNames = Object.keys(labelMap);
      if (eventNames.length === 0) {
        logError(
          "no events configured — supply `conversionLabel` and/or `events` to register conversions"
        );
        return;
      }

      // ─── Idempotency: never double-register ──────────────────────────────
      // If the SDK script loads twice (e.g. dev HMR, tag manager misconfig,
      // network retry), we'd otherwise subscribe twice and fire each
      // conversion twice — silently inflating Google Ads numbers.
      if (window[REGISTERED_FLAG]) {
        logWarn(
          "register() called again — skipping. Previous registration is still active."
        );
        return;
      }
      window[REGISTERED_FLAG] = {
        conversionId: config.conversionId,
        events: eventNames,
      };

      // ─── Load gtag and configure the Ads stream ──────────────────────────
      var gtag = ensureGtag(config.conversionId);
      // `groups` namespaces this config so we don't clobber GA4 settings
      // when gtag is shared. `send_page_view: false` prevents Ads from
      // hijacking GA4's pageview stream.
      gtag("config", config.conversionId, {
        send_page_view: false,
      });
      logInfo("gtag configured with conversionId:", config.conversionId);

      var defaultCurrency = config.defaultCurrency || "INR";

      if (!config.isolated) {
        analytics.subscribe(
          "PageView",
          safeHandler("PageView", function (event) {
            var p = event.properties || {};
            gtag("event", "page_view", {
              send_to: config.conversionId,
              page_title: p.title || document.title,
              page_location: p.url || window.location.href,
              page_referrer: p.referrer || document.referrer || undefined,
            });
          })
        );
      }

      // ─── Subscribe ───────────────────────────────────────────────────────
      eventNames.forEach(function (eventName) {
        var sendTo = config.conversionId + "/" + labelMap[eventName];

        analytics.subscribe(
          eventName,
          safeHandler(eventName, function (event) {
            // Hard requirement for Purchase: without transaction_id, Google
            // Ads can't dedupe reloads/retries and inflates the conversion
            // count. We fire anyway (better partial signal than none) but
            // log a warning so the data team can spot the gap.
            if (
              eventName === "Purchase" &&
              (!event.properties || !event.properties.order_id)
            ) {
              logWarn(
                "[" +
                  eid(event) +
                  "] Purchase fired without order_id — Google Ads dedup will not work"
              );
            }

            var payload = buildPayload(
              eventName,
              sendTo,
              event,
              defaultCurrency
            );
            logInfo(
              "[" + eid(event) + "] [" + eventName + "] → conversion",
              payload
            );
            gtag("event", "conversion", payload);
          })
        );
        logInfo("[" + eventName + "] subscription registered → " + sendTo);
      });

      logInfo(
        "Registration complete — " + eventNames.length + " event(s) subscribed"
      );
    },
  };

  // Bootstrap log — uses `console.log` directly (one-line, no payloads) so
  // ops can confirm the SDK script reached the page without enabling debug.
  // eslint-disable-next-line no-console
  console.log(PREFIX, "loaded");

  // Register immediately if runtime is ready, otherwise queue for later.
  // This block runs before we've seen `config.debug`, so any logs here use
  // the always-on warn/error channels only — no noise in prod.
  if (window.__OPEN_STORE_PIXEL_RUNTIME__) {
    window.__OPEN_STORE_PIXEL_RUNTIME__.register(registration);
  } else {
    window.__OPEN_STORE_PIXEL_PENDING__ =
      window.__OPEN_STORE_PIXEL_PENDING__ || [];
    window.__OPEN_STORE_PIXEL_PENDING__.push(registration);
  }
})();
