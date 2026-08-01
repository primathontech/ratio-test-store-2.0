/**
 * Test page for the nintarababy ProductMain widget.
 * Renders the widget with default data (no commerce client needed).
 * Used by Phase 4 testing to verify visual output.
 */
import { createPageBuildingEngine } from "@/bootstrap/builder";
import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { ProductMain } from "@/widgets/nintarababy/ProductMain";

export default async function TestProductMainPage() {
  createPageBuildingEngine();

  const routeContext = {
    templateName: TEMPLATE_TYPES.home,
    path: "/test-product-main",
    params: {},
    query: {},
  };

  return (
    <div
      style={{ backgroundColor: "#fff", minHeight: "100vh" }}
      data-route={routeContext.path}
    >
      <ProductMain data={{}} settings={{ variant: "v1" }} locale="en" />
    </div>
  );
}
