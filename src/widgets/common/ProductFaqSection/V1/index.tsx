import { Box } from "@/ui/atomic";
import { FAQ } from "../../../common/FAQ";
import { ProductFaqSectionProps } from "../types";
import { transformFaqData } from "../utils/index";
import productData from "../../ProductGalleryWithInfo/data/product.json";
import "../style.css";

export const PRODUCT_FAQ_METAFIELD_KEY = "product_faq";

export function V1({ data, settings, className }: ProductFaqSectionProps) {
  // TODO: This will be uncommented when the real data comes in
  const product = data?.data;
  // const product = productData;

  if (!product) {
    return null;
  }

  const { metadata } = product || {};
  const { faq = {} } = settings;

  // Find FAQ metafield
  const faqField = metadata?.[PRODUCT_FAQ_METAFIELD_KEY]?.value;

  // Transform into usable format (now includes id)
  const faqItems = transformFaqData(faqField);

  // Don't render if empty
  if (!faqItems.length) return null;

  // Prepare FAQ settings - use all settings from template
  const faqWidgetSettings = {
    ...faq,
    items: faqItems,
  };

  return (
    <div
      data-testid="product-faq-section-container"
      className="bg-[#F4F6F8] pb-5"
    >
      <Box
        className={`md:mx-auto lg:pb-8 lg:pt-4 xl2:px-[80px] rounded-3xl bg-white ${className || ""}`}
      >
        <FAQ items={faqItems} settings={faq} />
      </Box>
    </div>
  );
}
