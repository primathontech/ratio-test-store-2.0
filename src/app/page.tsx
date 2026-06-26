// Rendered via @/bootstrap/builder → createPageBuildingEngine (shopkit page builder).
import { TEMPLATE_TYPES } from "@/themes/bblunt-2/templates/.generated/types";
import { getStaticLocale } from "@/bootstrap/i18n";
import { resolveCommercePageSEO } from "@shopkit/seo";
import { getMerchantName, getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { Metadata } from "next";
import { getRouteTranslations } from "@/utils";

// LEAK TEST A (force-dynamic lever): the editor-preview read was removed so this page
// no longer `await`s searchParams → the route is no longer force-dynamic → it renders
// as ISR. `revalidate` now actually takes effect, so the page regenerates at most hourly
// instead of on every Site24x7/probe ping. Expect bblunt's idle RSS ratchet to flatten,
// proving the force-dynamic render path is the leak driver (→ justifies the shared
// @shopkit/editor-bridge draftMode() fix). App-level only, no @shopkit change, reversible.
// Tradeoff: visual-editor preview is disabled on this page while the test runs — fine on
// this no-traffic test merchant. Revert by restoring readEditorPreviewState(searchParams).
export const revalidate = 3600;

// Generate metadata for home page
export async function generateMetadata(): Promise<Metadata> {
  return resolveCommercePageSEO("home", null, "/");
}

export default async function HomePage() {
  // Static path: do NOT read searchParams (reading it forces dynamic rendering).
  const isEditor = false;
  const previewPageConfig = undefined;

  const merchantName = getMerchantName();
  const themeName = getThemeName();
  const locale = getStaticLocale();

  const routeContext = {
    templateName: TEMPLATE_TYPES.home,
    path: "/",
    params: {},
    query: {},
    fetchAPITemplate: true,
  };

  const messages = await getRouteTranslations({
    themeName,
    routeContext,
    language: locale,
  });

  // Get the page builder (widgets auto-loaded)
  const pageBuilder = getPageBuilder({ isEditor });

  // Note: The builder uses "merchantName" internally for loading themes/templates
  // from @/themes/{name}/templates/, so we pass themeName here
  const pageContent = await pageBuilder.renderPage({
    merchantName: themeName,
    routeContext,
    locale,
    messages,
    pageConfig: previewPageConfig,
  });

  return <>{pageContent}</>;
}
