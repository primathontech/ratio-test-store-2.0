import TermsOfUseTemplate from "../templates/terms-of-use";
import defaultContent from "../locales/terms-of-use.en.json";
import { makeStaticPageMetadata, renderStaticPage } from "./shared";

export const generateMetadata = makeStaticPageMetadata(
  "Terms of Use",
  "/terms-of-use"
);

export default async function TermsOfUsePage() {
  return renderStaticPage({
    slug: "terms-of-use",
    defaultContent,
    Template: TermsOfUseTemplate,
  });
}
