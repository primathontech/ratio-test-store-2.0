/**
 * Test page for the nintarababy KeyFeatures widget.
 * Renders the widget with default data (no commerce client needed).
 * Used by Phase 4 testing to verify visual output.
 */
import { createPageBuildingEngine } from "@/bootstrap/builder";
import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { KeyFeatures } from "@/widgets/nintarababy/KeyFeatures";

export default async function TestKeyFeaturesPage() {
  createPageBuildingEngine();

  const routeContext = {
    templateName: TEMPLATE_TYPES.home,
    path: "/test-key-features",
    params: {},
    query: {},
  };

  return (
    <div
      style={{ backgroundColor: "#fff", minHeight: "100vh" }}
      data-route={routeContext.path}
    >
      <KeyFeatures data={{}} settings={{ variant: "v1" }} locale="en" />
    </div>
  );
}
