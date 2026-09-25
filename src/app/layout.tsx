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

import { AppShell, AppHead } from "@shopkit/app-shell";
import { AppCartInitializer } from "@/bootstrap/cart";
import { ClientDynamics } from "./ClientDynamics";
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

  const hasKwikcartDisabled =
    process.env.NEXT_PUBLIC_KWIKCART_DISABLE === "true";

  // Chrome (header/footer) is NOT rendered here — it's app-side composition policy
  // (ADR-0004) so individual pages can opt out (e.g. the thank-you page). Pages that
  // want chrome live under the `app/(shop)` route group, whose layout wraps them in
  // <Chrome>. This root layout holds only request-invariant providers (AppShell,
  // theme, i18n, fonts) + trackers, which apply to EVERY page — chrome'd or not.

  return (
    <html lang={locale} className={fontVariables}>
      <head>
        {/* Merchant A/B (PRT) scripts. Plain parser-blocking <script> tags, so
            they run before <body> is parsed — next/script `beforeInteractive`
            emits no real tag in the App Router and only loads after the
            framework bundle runs. Do not add async/defer, and keep them first. */}
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

        {/* AppHead handles: DNS prefetch, preloads, Clarity */}
        <AppHead />

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
        {/* Ratio Meta app SDK (GoKwik-hosted). Merchant-specific URL — the
            token in the path identifies this store. Self-registers with
            PixelRuntime as "meta-ratio". */}
        <Script
          src="https://ratio-apps-meta-api.gokwik.co/meta/sdk/196jdfqy1aot.js"
          strategy="afterInteractive"
          id="meta-ratio-sdk"
        />
        <Script
          src="https://ratio-apps.gokwik.co/google/sdk/196jdfqy1aot.js"
          strategy="afterInteractive"
          id="google-ratio-sdk"
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
        <LimeChatScript />
      </body>
    </html>
  );
}
