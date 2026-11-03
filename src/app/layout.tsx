/**
 * Root Layout
 *
 * This is the main layout file for the application.
 * It uses wrapper components to abstract away complexity:
 * - AppHead: Head resource hints (A/B scripts are in <head> below)
 * - AppShell: Provider nesting (theme, auth, cart, i18n)
 * - Pixel SDKs: Meta, GA4, Google Ads (self-register with PixelRuntime)
 *
 * AI agents: Configure via environment variables.
 * Do NOT modify the wrapper components directly.
 *
 * @module app/layout
 */

import { getStaticLocale } from "@/bootstrap/i18n";
import { getTheme } from "@/bootstrap/theme";
import { getMerchantName, getThemeName } from "@/utils";
import { getMessages } from "next-intl/server";
import Script from "next/script";
import ReactDOM from "react-dom";

import { AppShell, AppHead } from "@shopkit/app-shell";
import { headStubScript } from "@shopkit/observability/head-stub";
import { browserObservability } from "@/bootstrap/observability-client";
import { themeTokensFromConfig } from "@shopkit/apps-platform-react/constants";
import { AppCartInitializer } from "@/bootstrap/cart";
import { ClientDynamics } from "./ClientDynamics";
import { getGokwikScriptUrl } from "@/integrations/checkout-custom/config";
import { AffiliateTracker } from "@shopkit/events/affiliate";
import { EditorHostMount } from "@/editor-integration/EditorHostMount";
// Client-only "Exit preview" bar. Direct import (not next/dynamic ssr:false,
// which Next 15 disallows in a Server Component): the component is "use client"
// and renders null on the server / first paint, so it never participates in SSR
// or affects the editor's live preview. Same behavior as momsco's layout.
import { PreviewExitBar } from "@/editor-integration/preview-link/PreviewExitBar";

import "./globals.css";
import { pixelConfig, productIdentifier } from "@/config/pixelConfig";
import { fontVariables } from "./fonts";
import LimeChatScript from "./LimeChatScript";
import { CartRecoveryLink } from "@/integrations/cart-recovery-custom";

// =============================================================================
// ROOT LAYOUT
// =============================================================================

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get app configuration
  const merchantName = getMerchantName();
  const themeName = getThemeName();
  const locale = getStaticLocale();
  const messages = await getMessages();
  const theme = await getTheme(themeName);

  // Apps Platform. Each installed app renders inside its own sandboxed iframe; `merchantInfo` is
  // the context handed to it at mount, and `shellUrl` is the page that hosts the sandbox.
  const APPS_PLATFORM_ENABLED =
    process.env.NEXT_PUBLIC_APPS_PLATFORM_ENABLED === "true";

  const merchantInfo = {
    mid: process.env.NEXT_PUBLIC_MERCHANT_ID ?? "",
    domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "",
    currency: process.env.NEXT_PUBLIC_CURRENCY ?? "INR",
    locale,
    country: "IN",
    theme: themeName,
    name: merchantName,
  };

  // Served from public/ so it is same-origin; the iframe itself is sandboxed to an opaque
  // origin regardless, so this only decides where the shell document is fetched from.
  const appsShellUrl =
    process.env.RATIO_APPS_SHELL_URL ?? "/apps-platform/sandbox.html";

  const hasKwikcartDisabled =
    process.env.NEXT_PUBLIC_KWIKCART_DISABLE === "true";

  // Front-load the A/B router (PRT) scripts ahead of everything else. Next renders
  // the analytics <Script>s as <link rel=preload>s that React's resource system
  // hoists to the TOP of <head>; those otherwise out-race the plain, un-preloaded
  // PRT <script> tags and make the router lose the initial-load bandwidth race on
  // slow networks. ReactDOM.preload goes through that same hoisting system, so its
  // links land FIRST (and dedupe with the prtconfig/prt-ab preloads AppHead already
  // emits, while also covering prt.min, which AppHead does not). A preload only
  // warms the cache — it does NOT execute the script, so there is no double run.
  // (`fetchPriority` renders camel-cased in the SSR HTML, but HTML attribute names
  // are case-insensitive, so browsers still honour it.)
  const prtScriptUrls = [
    process.env.NEXT_PUBLIC_PRT_CONFIG_URL,
    process.env.NEXT_PUBLIC_PRT_URL,
    process.env.NEXT_PUBLIC_PRT_AB_URL,
  ].filter((u): u is string => Boolean(u));
  for (const prtUrl of prtScriptUrls) {
    ReactDOM.preload(prtUrl, { as: "script", fetchPriority: "high" });
  }

  // Chrome (header/footer) is NOT rendered here — it's app-side composition policy
  // (ADR-0004) so individual pages can opt out (e.g. the thank-you page). Pages that
  // want chrome live under the `app/(shop)` route group, whose layout wraps them in
  // <Chrome>. This root layout holds only request-invariant providers (AppShell,
  // theme, i18n, fonts) + trackers, which apply to EVERY page — chrome'd or not.

  return (
    <html lang={locale} className={fontVariables}>
      <head>
        {/* Monitoring head stub: catches errors before the app's JS runs (incl. the
            A/B scripts below) and reports a page whose app never starts. Inline,
            no network fetch, so it doesn't compete with the PRT preloads. */}
        {process.env.OBS_ENABLED === "true" && (
          <script
            dangerouslySetInnerHTML={{
              __html: headStubScript(browserObservability),
            }}
          />
        )}
        {/* A/B router (PRT) scripts are preloaded first via ReactDOM.preload at the
            top of RootLayout (above). Plain parser-blocking <script> tags, so
            they run before <body> is parsed — next/script `beforeInteractive`
            emits no real tag in the App Router and only loads after the
            framework bundle runs. Do not add async/defer, and keep them first. */}
        {/* Priority is driven by the high-priority ReactDOM.preload() emitted at
            the top of RootLayout for these same URLs — by the time the parser
            reaches these parser-blocking tags the files are already cached. */}
        {process.env.NEXT_PUBLIC_PRT_CONFIG_URL && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script src={process.env.NEXT_PUBLIC_PRT_CONFIG_URL} />
        )}
        {process.env.NEXT_PUBLIC_PRT_URL && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script src={process.env.NEXT_PUBLIC_PRT_URL} />
        )}
        {process.env.NEXT_PUBLIC_PRT_AB_URL && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script src={process.env.NEXT_PUBLIC_PRT_AB_URL} />
        )}

        {/* AppHead handles: DNS prefetch, preloads, Clarity.
            `abTesting.prtConfigUrl/prtAbUrl: ""` suppresses AppHead's own
            beforeInteractive copies of prtconfig/prt-ab (injected via __next_s and
            re-run late, after analytics on slow networks) — they're already loaded
            once by the parser-blocking <script> tags above. Empty string is falsy
            and gets past AppHead's `?? env` fallback, so no duplicate Script. */}
        <AppHead config={{ abTesting: { prtConfigUrl: "", prtAbUrl: "" } }} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>

      <body>
        {/* Skip-to-content link — first focusable element, visually hidden
            until focused. Targets the <main id="main-content"> landmark added
            by the (shop) layout. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[1000] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:shadow"
        >
          Skip to content
        </a>

        {/* AppShell handles: providers, cart, auth, i18n, theme */}
        <AppShell
          config={{
            merchantName,
            locale,
            messages,
            theme,
            apps: APPS_PLATFORM_ENABLED
              ? {
                  merchantInfo,
                  shellUrl: appsShellUrl,
                  // Design tokens for the app sandbox. An app renders in an
                  // opaque-origin iframe and inherits none of this theme's CSS,
                  // so the colours have to travel as data or every app shows its
                  // own hardcoded palette on this store.
                  theme: themeTokensFromConfig(theme?.config),
                }
              : undefined,
            eventConfig: {
              pixelConfig: {
                pixels: pixelConfig,
              },
              productIdentifier,
            },
          }}
        >
          <AffiliateTracker autoCapture />
          <AppCartInitializer merchantName={merchantName} />
          <CartRecoveryLink />
          <EditorHostMount />
          <PreviewExitBar />
          {/* Chrome (header/footer) is added per-page by the (shop) route group's
              layout via <Chrome>, so bare pages (e.g. thank-you) can omit it. */}
          {children}
          <ClientDynamics
            locale={locale}
            hasKwikcartDisabled={hasKwikcartDisabled}
          />
        </AppShell>
        {/* GoKwik checkout SDK. A plain server-rendered <Script> (not a client
            component, so no checkout code joins the first-load bundle): Next
            preloads it in <head> and runs it right after hydration, so it is
            ready before the cart can open. The cart's <CheckoutScriptCustom>
            shares this id to get the load signal. */}
        <Script
          id="gokwik-merchant-integration"
          src={getGokwikScriptUrl()}
          strategy="afterInteractive"
        />
        {/* GA4 gtag.js — loaded directly so Google's crawler can verify ownership.
            Only rendered when a GA id is configured; otherwise Next would emit a
            broken `gtag/js?id=undefined` request. */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = function(){ window.dataLayer.push(arguments); };
            window.gtag('js', new Date());
          `}
            </Script>
          </>
        )}

        {/* V2 Pixel SDKs — self-register with PixelRuntime */}
        {/* The ?v= query is a cache key, not a no-op: sw.js serves .js from
            /public with stale-while-revalidate, so a returning visitor runs the
            previously cached SDK for one more page load. Bump ?v= whenever a
            file below changes, or old clients keep firing retired events. */}
        <Script
          src="/scripts/meta-pixel-sdk.js?v=2"
          strategy="afterInteractive"
        />
        <Script
          src="/scripts/ga4-pixel-sdk.js?v=2"
          strategy="afterInteractive"
        />
        <Script
          src="/scripts/google-ads-pixel-sdk.js?v=2"
          strategy="afterInteractive"
        />
        <Script src="/scripts/gtm-pixel-sdk.js" strategy="afterInteractive" />
        <Script
          src="https://d2zzy348rbi2h3.cloudfront.net/qa/shopify-pixel-sdk.js"
          strategy="afterInteractive"
        />
        {/* Ratio Meta app SDK (GoKwik-hosted). Merchant-specific URL — the
            token in the path identifies this store. Self-registers with
            PixelRuntime as "meta-ratio". */}
        <Script
          src="https://ratio-apps-meta-api.gokwik.co/meta/sdk/196jdfqy1aot.js"
          strategy="afterInteractive"
          id="meta-ratio-sdk"
        />
        {process.env.NEXT_PUBLIC_GOOGLE_RATIO_GMC_SDK_URL && (
          <Script
            src={process.env.NEXT_PUBLIC_GOOGLE_RATIO_GMC_SDK_URL}
            strategy="afterInteractive"
          />
        )}
        {process.env.NEXT_PUBLIC_RATIO_FORMS_SDK_URL && (
          <Script
            src={process.env.NEXT_PUBLIC_RATIO_FORMS_SDK_URL}
            strategy="afterInteractive"
            id="ratio-forms-sdk"
          />
        )}
        {process.env.NEXT_PUBLIC_BOOLEAN_MATHS_PIXEL_ID &&
          process.env.NEXT_PUBLIC_BOOLEAN_MATHS_PROJECT_ID && (
            <Script
              id="boolean-maths-ratio-pixel"
              src="https://medront.s3.amazonaws.com/fileuploads/ratiopixel.js"
              data-pixel-id={process.env.NEXT_PUBLIC_BOOLEAN_MATHS_PIXEL_ID}
              data-project-id={process.env.NEXT_PUBLIC_BOOLEAN_MATHS_PROJECT_ID}
              strategy="afterInteractive"
            />
          )}
        <LimeChatScript />
      </body>
    </html>
  );
}
