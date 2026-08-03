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
import dynamic from "next/dynamic";
import Script from "next/script";
import { Inter, Open_Sans } from "next/font/google";

import { AppShell, AppHead } from "@shopkit/app-shell";
import { APPS_PLATFORM_ENABLED } from "@/config/apps-platform";
import { getPageBuilder } from "@/bootstrap/builder";
import { getNavMenus } from "@shopkit/navigation";
import { NavigationProvider, NavBoundary } from "@shopkit/navigation/client";
import { AffiliateTracker } from "@shopkit/events/affiliate";
import { AppCartInitializer } from "@/bootstrap/cart";
import { EditorHostMount } from "@/editor-integration/EditorHostMount";

import { figtree, gotham, avenir } from "./fonts";
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
// DYNAMIC IMPORTS
// =============================================================================

const KwikPassCustom = dynamic(
  () =>
    import("@/integrations/kwikpass-custom").then((mod) => ({
      default: mod.KwikPassCustom,
    })),
  { ssr: false }
);

const CustomCartDrawer = dynamic(
  () =>
    import("@/integrations/cart-drawer-custom").then((mod) => ({
      default: mod.CustomCartDrawer,
    })),
  { ssr: false }
);

const FloatingActions = dynamic(
  () =>
    import("@/widgets/nintarababy/FloatingActions").then((mod) => ({
      default: mod.FloatingActions,
    })),
  { ssr: false }
);

const MobileBottomBar = dynamic(
  () =>
    import("@/widgets/nintarababy/MobileBottomBar").then((mod) => ({
      default: mod.MobileBottomBar,
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

// Client-only "Exit preview" bar. Loaded ssr:false (same pattern as the other
// client-only chrome above) so it never participates in SSR/hydration of the
// layout — it can't affect the editor's live preview or any existing behavior.
const PreviewExitBar = dynamic(
  () =>
    import("@/editor-integration/preview-link/PreviewExitBar").then((mod) => ({
      default: mod.PreviewExitBar,
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

  const merchantInfo = {
    mid: process.env.NEXT_PUBLIC_MERCHANT_ID ?? "",
    domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "",
    currency: process.env.NEXT_PUBLIC_CURRENCY ?? "INR",
    locale,
    country: "IN",
    theme: themeName,
    name: merchantName,
  };

  // Sandbox shell + bundles load from the App Ecosystem origin (Ratio CDN in
  // prod, local apps-platform-example in dev) — momsco doesn't serve its own.
  const appsShellUrl =
    process.env.RATIO_APPS_SHELL_URL ??
    "http://localhost:4347/apps-platform/sandbox.html";

  const hasKwikcartDisabled =
    process.env.NEXT_PUBLIC_KWIKCART_DISABLE === "true";

  // Shared layout chrome (announcement+header / footer+bottom-bar) rendered once
  // for every page. Page templates contain body sections only; chrome lives in
  // themes/{theme}/templates/header and /footer (Shopify section-group model).
  //
  // renderChrome reports the nav-menu handles its widgets reference (derive-from-
  // JSON); we then fetch exactly those, so an editor-assigned handle is fetched
  // automatically (getNavMenus also always includes the defaults main-menu + footer).
  // Chrome resolves its t:common.* refs against these messages. Mirror the page
  // templates (which always call getRouteTranslations): it's DB-backed when
  // editor changes are enabled and falls back to filesystem otherwise, so
  // editor-saved header/footer text reflects on the storefront. AppShell keeps
  // getMessages() above for full client-side i18n.
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
    <html
      lang={locale}
      className={`${inter.variable} ${openSans.variable} ${figtree.variable} ${gotham.variable} ${avenir.variable}`}
    >
      <head>
        {/* AppHead handles: A/B testing, favicon, DNS prefetch, Clarity */}
        <AppHead />

        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>

      <body>
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
                }
              : undefined,
            eventConfig: {
              enableDevTools: true,
              pixelConfig: {
                pixels: pixelConfig,
              },
              productIdentifier,
            },
          }}
        >
          <AffiliateTracker autoCapture />
          <KwikPassCustom />
          <AppCartInitializer merchantName={merchantName} />
          <EditorHostMount />
          {/* Client-only "Exit preview" bar. Renders null on the server and
              first paint, then reads the editorPreviewActive cookie on mount —
              so it survives static generation (no server gate) and shows in
              both dev and production preview sessions. */}
          <PreviewExitBar />
          {/* endpoint enables the read-through store: a handle not preloaded at
              SSR (e.g. the visual editor switching menuHandle at runtime) is
              fetched on demand via the same-origin /api/nav-menu route. Inert for
              normal storefront traffic, where every handle is already in `menus`. */}
          <NavigationProvider menus={menus} endpoint="/api/nav-menu">
            <NavBoundary>{header}</NavBoundary>
            {children}
            <NavBoundary>{footer}</NavBoundary>
          </NavigationProvider>
          <FloatingActions />
          <MobileBottomBar />
          {hasKwikcartDisabled ? (
            <CustomCartDrawer locale={locale as "en"} />
          ) : (
            <KwikCartRemounter />
          )}
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
