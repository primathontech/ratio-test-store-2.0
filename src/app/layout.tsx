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
import { getMerchantName, getThemeName } from "@/utils";
import { getMessages } from "next-intl/server";
import Script from "next/script";
import { Inter, Open_Sans } from "next/font/google";

import { AppShell, AppHead } from "@shopkit/app-shell";
import { getPageBuilder } from "@/bootstrap/builder";
import { getNavMenus } from "@shopkit/navigation";
import { NavigationProvider } from "@shopkit/navigation/client";
import { extraNavHandles } from "@/config/navigation";
import { AppCartInitializer } from "@/bootstrap/cart";
import { ClientDynamics } from "./ClientDynamics";
import { EditorHostMount } from "@/editor-integration/EditorHostMount";

import "./globals.css";
import { pixelConfig, productIdentifier } from "@/config/pixelConfig";

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
  const [{ header, footer }, menus] = await Promise.all([
    getPageBuilder().renderChrome({ merchantName: themeName, locale, messages }),
    getNavMenus(extraNavHandles),
  ]);

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
          <AppCartInitializer merchantName={merchantName} />
          <EditorHostMount />
          <NavigationProvider menus={menus}>
            {header}
            {children}
            {footer}
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
