/**
 * Test page for the nintarababy HowToUseInstructions widget.
 * Renders the widget with default data (no commerce client needed).
 * Used by Phase 4 testing to verify visual output.
 */
import { createPageBuildingEngine } from "@/bootstrap/builder";
import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { HowToUseInstructions } from "@/widgets/nintarababy/HowToUseInstructions";

export default async function TestHowToUsePage() {
  createPageBuildingEngine();

  const routeContext = {
    templateName: TEMPLATE_TYPES.home,
    path: "/test-how-to-use",
    params: {},
    query: {},
  };

  return (
    <div style={{ minHeight: "100vh" }} data-route={routeContext.path}>
      <HowToUseInstructions
        data={{}}
        settings={{ variant: "v1" }}
        locale="en"
      />
    </div>
  );
}
