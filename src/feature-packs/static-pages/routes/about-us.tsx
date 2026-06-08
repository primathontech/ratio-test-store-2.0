import AboutUsTemplate from "../templates/about-us";
import defaultContent from "../locales/about-us.en.json";
import { makeStaticPageMetadata, renderStaticPage } from "./shared";

/**
 * Enhanced `about-us` route.
 *
 * NOTE: `about-us` already exists in the base storefront-starter app. This is
 * an enhanced drop-in replacement (styled template + bundled default copy).
 * Wiring it REPLACES the existing `src/app/about-us/page.tsx` rather than
 * adding a new route. See guide.md → "About Us (enhanced, pre-existing page)".
 */
export const generateMetadata = makeStaticPageMetadata("About Us", "/about-us");

export default async function AboutUsPage() {
  return renderStaticPage({
    slug: "about-us",
    defaultContent,
    Template: AboutUsTemplate,
  });
}
