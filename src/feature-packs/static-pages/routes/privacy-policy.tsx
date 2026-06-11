import PrivacyPolicyTemplate from "../templates/privacy-policy";
import defaultContent from "../locales/privacy-policy.en.json";
import { makeStaticPageMetadata, renderStaticPage } from "./shared";

export const generateMetadata = makeStaticPageMetadata(
  "Privacy Policy",
  "/privacy-policy"
);

export default async function PrivacyPolicyPage() {
  return renderStaticPage({
    slug: "privacy-policy",
    defaultContent,
    Template: PrivacyPolicyTemplate,
  });
}
