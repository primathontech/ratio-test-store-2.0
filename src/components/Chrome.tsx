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
 * Per ADR-0004 this is app-side composition policy — `@shopkit/navigation` /
 * `@shopkit/builder` are unchanged. When unified slug routing lands, the
 * `[[...slug]]` catch-all becomes the single caller of this component (no rework).
 */
export async function Chrome({ children }: { children: React.ReactNode }) {
  const themeName = getThemeName();
  const locale = getStaticLocale();

  // Chrome resolves its t:common.* refs against these messages — DB-backed when
  // editor changes are enabled, filesystem otherwise.
  const chromeMessages = await getRouteTranslations({
    themeName,
    language: locale,
  });

  // isEditor selects the editor-shimmed widget manifest so the editor can
  // instrument chrome. Resolve FRESH each request: renderChrome shares a cache and
  // in preview mode the loader can resolve a draft — clearing avoids leaking a
  // draft to the next live visitor.
  const chromeBuilder = getPageBuilder({ isEditor: true });
  chromeBuilder.clearCache();
  const { header, footer, menuHandles } = await chromeBuilder.renderChrome({
    merchantName: themeName,
    locale,
    messages: chromeMessages,
  });
  const menus = await getNavMenus(menuHandles);

  return (
    <NavigationProvider menus={menus} endpoint="/api/nav-menu">
      <NavBoundary>{header}</NavBoundary>
      {children}
      <NavBoundary>{footer}</NavBoundary>
    </NavigationProvider>
  );
}
