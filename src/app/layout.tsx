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
import dynamic from "next/dynamic";
import Script from "next/script";

import { AppShell, AppHead } from "@shopkit/app-shell";
import { AppCartInitializer } from "@/bootstrap/cart";

import "./globals.css";
import { pixelConfig, productIdentifier } from "@/config/pixelConfig";
import { fontVariables } from "./fonts";
import LimeChatScript from "./LimeChatScript";

// =============================================================================
// DYNAMIC IMPORTS
// =============================================================================

const KwikPassCustom = dynamic(
  () =>
    import("@/integrations/kwikpass-custom").then((mod) => ({
      default: mod.KwikPassCustom,
    })),
  { ssr: false }
);

const CartDrawer = dynamic(
  () =>
    import("@/widgets/common/CartDrawer").then((mod) => ({
      default: mod.CartDrawer,
    })),
  { ssr: false }
);

const KwikCartRemounter = dynamic(
  () =>
    import("@/integrations/kwikcart-custom").then((mod) => ({
      default: mod.KwikCartRemounter,
    })),
  { ssr: false }
);

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
          <KwikPassCustom />
          <AppCartInitializer merchantName={merchantName} />
          {children}
          {hasKwikcartDisabled ? (
            <CartDrawer locale={locale as "en"} />
          ) : (
            <KwikCartRemounter />
          )}
        </AppShell>

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
