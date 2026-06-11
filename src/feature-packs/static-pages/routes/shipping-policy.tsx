import ShippingPolicyTemplate from "../templates/shipping-policy";
import defaultContent from "../locales/shipping-policy.en.json";
import { makeStaticPageMetadata, renderStaticPage } from "./shared";

export const generateMetadata = makeStaticPageMetadata(
  "Shipping & Delivery",
  "/shipping-policy"
);

export default async function ShippingPolicyPage() {
  return renderStaticPage({
    slug: "shipping-policy",
    defaultContent,
    Template: ShippingPolicyTemplate,
  });
}
