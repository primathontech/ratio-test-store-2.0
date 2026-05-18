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

import { AppShell, AppHead } from "@shopkit/app-shell";
import { AppCartInitializer } from "@/bootstrap/cart";
import { ClientDynamics } from "./ClientDynamics";

import "./globals.css";
import { pixelConfig, productIdentifier } from "@/config/pixelConfig";
import { fontVariables } from "./fonts";
import LimeChatScript from "./LimeChatScript";

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

  return (
    <html lang={locale} className={fontVariables}>
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
          {children}
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
        <LimeChatScript />
      </body>
    </html>
  );
}
