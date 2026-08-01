/**
 * Test page for the nintarababy ProductTabs widget.
 * Renders the widget with default data (no commerce client needed).
 * Used by Phase 4 testing to verify visual output.
 */
import { createPageBuildingEngine } from "@/bootstrap/builder";
import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { ProductTabs } from "@/widgets/nintarababy/ProductTabs";

export default async function TestProductTabsPage() {
  createPageBuildingEngine();

  const routeContext = {
    templateName: TEMPLATE_TYPES.home,
    path: "/test-product-tabs",
    params: {},
    query: {},
  };

  return (
    <div
      style={{ backgroundColor: "#fff", minHeight: "100vh" }}
      data-route={routeContext.path}
    >
      <ProductTabs data={{}} settings={{ variant: "v1" }} locale="en" />
    </div>
  );
}
