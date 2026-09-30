/**
 * Service Worker for Asset Caching
 *
 * This service worker handles caching of images and other assets
 * for the storefront application.
 */

const CACHE_NAME = "Storefront-assets-v1";
const STATIC_CACHE_NAME = "Storefront-static-v1";

// Assets to cache immediately on install
const CRITICAL_ASSETS = ["/", "/manifest.json"];

// Install event - cache critical assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching critical assets");
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Critical assets cached");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Install failed:", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      })
      .catch((error) => {
        console.error("Service Worker: Activation failed:", error);
      })
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // Skip Next.js internal requests
  if (
    url.pathname.startsWith("/_next/webpack-hmr") ||
    url.pathname.startsWith("/_next/static/chunks/pages/_error") ||
    url.pathname.includes("hot-reload")
  ) {
    return;
  }

  // Skip ALL API requests - let them go directly to network
  if (isAPIRequest(request)) {
    console.log("Service Worker: Skipping cache for API:", url.pathname);
    return; // Don't intercept, let browser handle normally
  }

  // Skip ALL analytics requests - let them use native behavior
  if (isAnalyticsRequest(request)) {
    console.log("Service Worker: Skipping analytics request:", url.hostname);
    return; // Don't intercept, let browser handle normally
  }

  // Handle different types of requests
  if (isImageRequest(request)) {
    // Use cache-first strategy for images
    event.respondWith(cacheFirstStrategy(request));
  } else if (isStaticAsset(request)) {
    // Use stale-while-revalidate for static assets
    event.respondWith(staleWhileRevalidateStrategy(request));
  }
});

// NEW: Check if request should bypass cache entirely
function shouldBypassCache(request) {
  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase();

  // Check if URL matches any no-cache patterns
  return NO_CACHE_API_PATTERNS.some((pattern) =>
    pathname.includes(pattern.toLowerCase())
  );
}

// Helper functions to identify request types
function isImageRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase();

  return (
    pathname.includes("/wellversed/webp/") ||
    pathname.includes("/images/") ||
    pathname.includes("/media/") ||
    pathname.includes("/assets/") ||
    pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i) ||
    request.destination === "image" ||
    pathname.includes("picsum.photos") ||
    pathname.includes("/cdn/shop/files/") ||
    pathname.includes("shopifycdn.com") ||
    pathname.includes("cdn.shopify.com") ||
    (pathname.includes("/files/") && url.hostname.includes("shopify"))
  );
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase();

  return (
    pathname.includes("/_next/static/") ||
    pathname.match(/\.(css|js|woff|woff2|ttf|otf)$/i)
  );
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith("/api/");
}

function isAnalyticsRequest(request) {
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();

  // List of analytics and tracking domains to skip
  const analyticsDomains = [
    "connect.facebook.net",
    "www.facebook.com",
    "facebook.com",
    "facebook.net",
    "fbcdn.net",
    "www.googletagmanager.com",
    "googletagmanager.com",
    "www.google-analytics.com",
    "google-analytics.com",
    "analytics.google.com",
    "doubleclick.net",
    "googlesyndication.com",
    "googleadservices.com",
    "hotjar.com",
    "fullstory.com",
    "segment.com",
    "mixpanel.com",
    "amplitude.com",
    "intercom.io",
    "zendesk.com",
    "crisp.chat",
    "tawk.to",
  ];

  return analyticsDomains.some((domain) => hostname.includes(domain));
}

// Cache-first strategy for images
async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log("Service Worker: Serving from cache:", request.url);
      return cachedResponse;
    }

    console.log("Service Worker: Fetching and caching:", request.url);
    const networkResponse = await fetch(request);

    if (networkResponse.ok && networkResponse.status === 200) {
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    console.error("Service Worker: Cache-first strategy failed:", error);

    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response("Image not available", {
      status: 404,
      statusText: "Image not found",
    });
  }
}

// Stale-while-revalidate strategy for static assets
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.error("Service Worker: Background fetch failed:", error);
    });

  return cachedResponse || fetchPromise;
}

// Message handling for cache management
self.addEventListener("message", (event) => {
  const { type, payload } = event.data || {};

  switch (type) {
    case "CACHE_ASSET":
      handleCacheAsset(payload);
      break;
    case "INVALIDATE_ASSET":
      handleInvalidateAsset(payload);
      break;
    case "CLEAR_CACHE":
      handleClearCache();
      break;
    case "GET_CACHE_STATUS":
      handleGetCacheStatus(event);
      break;
    default:
      console.log("Service Worker: Unknown message type:", type);
  }
});

async function handleCacheAsset(payload) {
  try {
    const { url } = payload;
    const cache = await caches.open(CACHE_NAME);
    const response = await fetch(url);

    if (response.ok && response.status === 200) {
      await cache.put(url, response);
      console.log("Service Worker: Asset cached:", url);
    }
  } catch (error) {
    console.error("Service Worker: Failed to cache asset:", error);
  }
}

async function handleInvalidateAsset(payload) {
  try {
    const { url } = payload;
    const cache = await caches.open(CACHE_NAME);
    const deleted = await cache.delete(url);
    console.log("Service Worker: Asset invalidated:", url, deleted);
  } catch (error) {
    console.error("Service Worker: Failed to invalidate asset:", error);
  }
}

async function handleClearCache() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    await Promise.all(keys.map((key) => cache.delete(key)));
    console.log("Service Worker: Cache cleared");
  } catch (error) {
    console.error("Service Worker: Failed to clear cache:", error);
  }
}

// NEW: Clear only API cache
async function handleClearAPICache() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    const apiKeys = keys.filter((request) => request.url.includes("/api/"));
    await Promise.all(apiKeys.map((key) => cache.delete(key)));
    console.log("Service Worker: API cache cleared");
  } catch (error) {
    console.error("Service Worker: Failed to clear API cache:", error);
  }
}

async function handleGetCacheStatus(event) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    const status = {
      cacheSize: keys.length,
      cacheName: CACHE_NAME,
      urls: keys.map((request) => request.url),
    };

    event.ports[0].postMessage({ type: "CACHE_STATUS", payload: status });
  } catch (error) {
    console.error("Service Worker: Failed to get cache status:", error);
    event.ports[0].postMessage({
      type: "CACHE_STATUS_ERROR",
      payload: error.message,
    });
  }
}

console.log(
  "WELLVERSED Service Worker: Loaded successfully for WELLVERSED Storefront"
);
