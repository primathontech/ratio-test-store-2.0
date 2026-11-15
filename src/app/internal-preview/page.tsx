import { getThemeName } from "@/utils";
import { getPageBuilder } from "@/bootstrap/builder";
import { createInternalPreviewPage } from "@shopkit/editor-bridge/internal-preview";
import { Chrome } from "@/components/Chrome";
import { ArmScope } from "@/bootstrap/ab/ArmSync";

/**
 * Editor-only live-preview lane; force-dynamic scoped here so shopper routes
 * stay ISR. Render logic + i18n live in the package factory.
 *
 * Deliberately OUTSIDE the `(shop)` group. That group's layout wraps every page
 * in <Chrome>, which resolves the SAVED header/footer — so a header edit the
 * merchant has not saved yet could never appear. This route renders chrome
 * itself from the editor's in-progress configs; inheriting the layout's chrome
 * as well would show two headers.
 */
export const dynamic = "force-dynamic";

export default createInternalPreviewPage({
  getThemeName,
  getPageBuilder,
  // Reuses the same <Chrome> shopper pages use, so nav menus and the navigation
  // provider are wired identically — only the configs differ.
  withChrome: ({ configs, children }) => (
    <Chrome headerConfig={configs.header} footerConfig={configs.footer}>
      {/* Kept from the (shop) layout this route used to sit under: without it
          the preview would keep reporting the arm of whatever page was seen
          before it. */}
      <ArmScope />
      {children}
    </Chrome>
  ),
});
