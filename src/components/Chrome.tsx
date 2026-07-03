import { getStaticLocale } from "@/bootstrap/i18n";
import { getThemeName, getRouteTranslations } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { getNavMenus } from "@shopkit/navigation";
import { NavigationProvider, NavBoundary } from "@shopkit/navigation/client";

/**
 * Chrome — shared header/footer composition.
 *
 * Renders the admin-managed header + footer (mega menu) around `children` and
 * provides the nav menus via NavigationProvider. This is the SINGLE place chrome is
 * composed.
 *
 * Pages that WANT chrome live under the `app/(shop)` route group, whose layout
 * renders this. Pages that must NOT have chrome (e.g. the thank-you page) live
 * OUTSIDE that group (directly under `app/`) and render with no header/footer.
 *
 * Page templates contain body sections only; chrome lives in
 * themes/{theme}/templates/header and /footer (Shopify section-group model). This
 * is app-side composition policy — `@shopkit/navigation` / `@shopkit/builder` are
 * unchanged.
 */
export async function Chrome({ children }: { children: React.ReactNode }) {
  const themeName = getThemeName();
  const locale = getStaticLocale();

  // renderChrome reports the nav-menu handles its widgets reference (derive-from-
  // JSON); we then fetch exactly those. So a handle the editor assigns is fetched
  // automatically — no hand-maintained list. (getNavMenus also always includes the
  // backend defaults main-menu + footer.) Sequential by necessity: we need the
  // handles before fetching.
  //
  // Chrome resolves its t:common.* refs against these messages. Mirror the page
  // templates (which call getRouteTranslations): DB-backed when editor changes are
  // enabled, filesystem otherwise, so editor-saved header/footer text reflects on
  // the storefront.
  const chromeMessages = await getRouteTranslations({
    themeName,
    language: locale,
  });

  // isEditor selects the editor-shimmed widget manifest so the editor can
  // instrument chrome. Resolve FRESH each request: renderChrome shares a cache and
  // in preview mode the loader can resolve a DRAFT (when Next.js Draft Mode is
  // enabled via the editorPreview cookie) — clearing avoids leaking a draft to the
  // next live visitor. Mirrors page.tsx clearing the body cache per request.
  const chromeBuilder = getPageBuilder({ isEditor: true });
  chromeBuilder.clearCache();
  const { header, footer, menuHandles } = await chromeBuilder.renderChrome({
    merchantName: themeName,
    locale,
    messages: chromeMessages,
  });
  const menus = await getNavMenus(menuHandles);

  return (
    // endpoint enables the read-through store: a handle not preloaded at SSR (e.g.
    // the visual editor switching menuHandle at runtime) is fetched on demand via
    // the same-origin /api/nav-menu route. Inert for normal storefront traffic,
    // where every handle is already in `menus`.
    <NavigationProvider menus={menus} endpoint="/api/nav-menu">
      <NavBoundary>{header}</NavBoundary>
      {children}
      <NavBoundary>{footer}</NavBoundary>
    </NavigationProvider>
  );
}
