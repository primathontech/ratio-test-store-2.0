import CancellationPolicyTemplate from "../templates/cancellation-policy";
import defaultContent from "../locales/cancellation-policy.en.json";
import { makeStaticPageMetadata, renderStaticPage } from "./shared";

export const generateMetadata = makeStaticPageMetadata(
  "Cancellation Policy",
  "/cancellation-policy"
);

export default async function CancellationPolicyPage() {
  return renderStaticPage({
    slug: "cancellation-policy",
    defaultContent,
    Template: CancellationPolicyTemplate,
  });
}
