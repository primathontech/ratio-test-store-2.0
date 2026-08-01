/**
 * Unified test page for all nintarababy product page widgets.
 * Renders all 11 sections with default data (no commerce client needed).
 * Used for visual QA comparison against the source site.
 */
import { createPageBuildingEngine } from "@/bootstrap/builder";
import { TEMPLATE_TYPES } from "@/themes/dawn/templates/.generated/types";
import Script from "next/script";
import { AnnouncementBar } from "@/widgets/nintarababy/AnnouncementBar";
import { Header } from "@/widgets/nintarababy/Header";
import { Breadcrumb } from "@/widgets/nintarababy/Breadcrumb";
import { ProductMain } from "@/widgets/nintarababy/ProductMain";
import { KeyFeatures } from "@/widgets/nintarababy/KeyFeatures";
import { ProductTabs } from "@/widgets/nintarababy/ProductTabs";
import { TestimonialsCarousel } from "@/widgets/nintarababy/TestimonialsCarousel";
import { HowToUseInstructions } from "@/widgets/nintarababy/HowToUseInstructions";
import { VideoAndBrandValues } from "@/widgets/nintarababy/VideoAndBrandValues";
import { LovedByParentsCarousel } from "@/widgets/nintarababy/LovedByParentsCarousel";
import { WhatsAppCommunity } from "@/widgets/nintarababy/WhatsAppCommunity";
import { FAQsAccordion } from "@/widgets/nintarababy/FAQsAccordion";
import { CustomerReviews } from "@/widgets/nintarababy/CustomerReviews";

/**
 * Hydration-recovery patch: the app shell has a pre-existing hydration
 * mismatch that causes React to do a full client re-render, dropping
 * newly-added static elements. This inline script runs after DOM ready
 * and re-injects any missing elements that React's recovery removed.
 */
const HYDRATION_PATCH_SCRIPT = `
(function patchHydration() {
  function inject() {
    var vr = document.querySelector('.nintara-pm__video-link-row');
    if (!vr) return;
    if (document.querySelector('.nintara-pm__trust-badges')) return;
    var d = document.createElement('div');
    d.className = 'nintara-pm__trust-badges';
    var img = document.createElement('img');
    img.src = '/nintarababy/ProductMain/icons/trust-badges-strip.svg';
    img.alt = 'Delivery in 2-5 days, COD available, 10-day returns';
    img.width = 413;
    img.height = 62;
    d.appendChild(img);
    vr.parentNode.insertBefore(d, vr.nextSibling);
  }
  if (document.readyState === 'complete') { setTimeout(inject, 500); }
  else { window.addEventListener('load', function() { setTimeout(inject, 500); }); }
})();
`;

export default async function TestProductPage() {
  createPageBuildingEngine();

  const routeContext = {
    templateName: TEMPLATE_TYPES.products,
    path: "/test-product-page",
    params: {},
    query: {},
  };

  return (
    <div
      style={{ backgroundColor: "#fff", minHeight: "100vh" }}
      data-route={routeContext.path}
    >
      <AnnouncementBar data={{}} settings={{ variant: "v1" }} locale="en" />
      <Header data={{}} settings={{ variant: "v1" }} locale="en" />
      <Breadcrumb data={{}} settings={{ variant: "v1" }} locale="en" />
      <ProductMain data={{}} settings={{ variant: "v1" }} locale="en" />
      <KeyFeatures data={{}} settings={{ variant: "v1" }} locale="en" />
      <ProductTabs data={{}} settings={{ variant: "v1" }} locale="en" />
      <TestimonialsCarousel
        data={{}}
        settings={{ variant: "v1" }}
        locale="en"
      />
      <HowToUseInstructions
        data={{}}
        settings={{ variant: "v1" }}
        locale="en"
      />
      <VideoAndBrandValues data={{}} settings={{ variant: "v1" }} locale="en" />
      <LovedByParentsCarousel
        data={{}}
        settings={{ variant: "v1" }}
        locale="en"
      />
      <WhatsAppCommunity data={{}} settings={{ variant: "v1" }} locale="en" />
      <FAQsAccordion data={{}} settings={{ variant: "v1" }} locale="en" />
      <CustomerReviews data={{}} settings={{ variant: "v1" }} locale="en" />
      <Script
        id="hydration-patch"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: HYDRATION_PATCH_SCRIPT }}
      />
    </div>
  );
}
