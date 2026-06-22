/**
 * Root Layout
 *
 * This is the main layout file for the application.
 * It uses wrapper components to abstract away complexity:
 * - AppHead: Head scripts, prefetch, A/B testing
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
import { getMerchantName, getThemeName, getRouteTranslations } from "@/utils";
import { getMessages } from "next-intl/server";
import Script from "next/script";
import { Inter, Open_Sans } from "next/font/google";

import { AppShell, AppHead } from "@shopkit/app-shell";
import { getPageBuilder } from "@/bootstrap/builder";
import { getNavMenus } from "@shopkit/navigation";
import { NavigationProvider, NavBoundary } from "@shopkit/navigation/client";
import { AppCartInitializer } from "@/bootstrap/cart";
import { ClientDynamics } from "./ClientDynamics";
import { AffiliateTracker } from "@shopkit/events/affiliate";
import { EditorHostMount } from "@/editor-integration/EditorHostMount";

import "./globals.css";
import { pixelConfig, productIdentifier } from "@/config/pixelConfig";
import { CartRecoveryLink } from "@/integrations/cart-recovery-custom";

// =============================================================================
// FONT CONFIGURATION
// =============================================================================

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-opensans",
});

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

  // Shared layout chrome (header/footer) rendered once for every page.
  // Page templates contain body sections only; chrome lives in
  // themes/{theme}/templates/header and /footer (Shopify section-group model).
  //
  // renderChrome reports the nav-menu handles its widgets reference (derive-from-
  // JSON); we then fetch exactly those. So a handle the editor assigns is fetched
  // automatically — no hand-maintained list. (getNavMenus also always includes the
  // backend defaults main-menu + footer.) Sequential by necessity: we need the
  // handles before fetching.
  // Chrome resolves its t:common.* refs against these messages. Mirror the page
  // templates (which call getRouteTranslations): DB-backed when editor changes
  // are enabled, filesystem otherwise, so editor-saved header/footer text
  // reflects on the storefront. AppShell keeps getMessages() for client i18n.
  // isEditor selects the editor-shimmed widget manifest so the editor can
  // instrument chrome.
  const chromeMessages = await getRouteTranslations({
    themeName,
    language: locale,
  });
  const chromeBuilder = getPageBuilder({ isEditor: true });
  // Resolve chrome FRESH each request. renderChrome shares a cache across
  // requests, and in preview mode the loader can resolve a DRAFT (when Next.js
  // Draft Mode is enabled via the editorPreview cookie). Without clearing, that
  // draft chrome could be served to the next (live) visitor. Mirrors page.tsx
  // clearing the body cache per request — the storefront fetches templates no-store.
  chromeBuilder.clearCache();
  const { header, footer, menuHandles } = await chromeBuilder.renderChrome({
    merchantName: themeName,
    locale,
    messages: chromeMessages,
  });
  const menus = await getNavMenus(menuHandles);

  return (
    <html lang={locale} className={`${inter.variable} ${openSans.variable}`}>
      <head>
        {/* AppHead handles: A/B testing, favicon, DNS prefetch, Clarity */}
        <AppHead />

        {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>

      <body>
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
          {/* endpoint enables the read-through store: a handle not preloaded at
              SSR (e.g. the visual editor switching menuHandle at runtime) is
              fetched on demand via the same-origin /api/nav-menu route. Inert for
              normal storefront traffic, where every handle is already in `menus`. */}
          <NavigationProvider menus={menus} endpoint="/api/nav-menu">
            <NavBoundary>{header}</NavBoundary>
            {children}
            <NavBoundary>{footer}</NavBoundary>
          </NavigationProvider>
          <ClientDynamics
            locale={locale}
            hasKwikcartDisabled={hasKwikcartDisabled}
          />
        </AppShell>

        {/* GA4 gtag.js — loaded directly so Google's crawler can verify ownership */}
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

        {/* V2 Pixel SDKs — self-register with PixelRuntime */}
        <Script src="/scripts/meta-pixel-sdk.js" strategy="afterInteractive" />
        <Script src="/scripts/ga4-pixel-sdk.js" strategy="afterInteractive" />
        <Script
          src="/scripts/google-ads-pixel-sdk.js"
          strategy="afterInteractive"
        />
        <Script src="/scripts/gtm-pixel-sdk.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
