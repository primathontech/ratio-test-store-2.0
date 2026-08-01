/**
 * Test page for the nintarababy FAQsAccordion widget.
 * Renders the widget with default data (no commerce client needed).
 * Used by Phase 4 testing to verify visual output and interactions.
 */
import { createPageBuildingEngine } from "@/bootstrap/builder";
import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import { FAQsAccordion } from "@/widgets/nintarababy/FAQsAccordion";

export default async function TestFAQsAccordionPage() {
  createPageBuildingEngine();

  const routeContext = {
    templateName: TEMPLATE_TYPES.home,
    path: "/test-faqs-accordion",
    params: {},
    query: {},
  };

  return (
    <div
      style={{ backgroundColor: "#fff", minHeight: "100vh" }}
      data-route={routeContext.path}
    >
      <FAQsAccordion data={{}} settings={{ variant: "v1" }} locale="en" />
    </div>
  );
}
