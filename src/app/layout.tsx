/**
 * Root Layout
 *
 * This is the main layout file for the application.
 * It uses wrapper components to abstract away complexity:
 * - AppHead: Head scripts, prefetch, A/B testing
 * - AppShell: Provider nesting (theme, auth, cart, i18n)
 * - AppAnalytics: GA, PostHog, Facebook Pixel
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
import { Inter, Open_Sans } from "next/font/google";

import { AppShell, AppHead, AppAnalytics } from "@shopkit/app-shell";
import { AppCartInitializer } from "@/bootstrap/cart";

import "./globals.css";

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
// DYNAMIC IMPORTS
// =============================================================================

const KwikPassCustom = dynamic(
  () =>
    import("@/integrations/kwikpass-custom").then((mod) => ({
      default: mod.KwikPassCustom,
    })),
  { ssr: false },
);

const CustomCartDrawer = dynamic(
  () =>
    import("@/integrations/cart-drawer-custom").then((mod) => ({
      default: mod.CustomCartDrawer,
    })),
  { ssr: false },
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
        <AppShell config={{ merchantName, locale, messages, theme }}>
          <KwikPassCustom />
          <AppCartInitializer merchantName={merchantName} />
          {children}
          <CustomCartDrawer locale={locale as "en"} />
        </AppShell>

        {/* AppAnalytics handles: GA, PostHog, Facebook Pixel */}
        <AppAnalytics />
      </body>
    </html>
  );
}
