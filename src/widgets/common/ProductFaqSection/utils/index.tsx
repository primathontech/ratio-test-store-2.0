// utils/transformFaqData.ts

import { FAQItem } from "@/widgets/common/FAQ/types";

// --- Types ---
export interface FaqField {
  key: string;
  value: string;
  type: string;
  reference?: any;
  references?: any;
}

export interface FaqNode {
  id: string;
  type: string;
  fields: FaqField[];
}

export interface ProductFaqMetafield {
  key: string;
  namespace: string;
  type: string;
  value: string;
  references?: {
    nodes?: FaqNode[];
  };
}

// --- Transform Function ---
export function transformFaqData(faqField?: any): FAQItem[] {
  if (!Array.isArray(faqField)) return [];

  return faqField.map((item, index) => {
    const title = item.fields?.title?.value?.[0]?.trim() || "";
    const description = item.fields?.description?.value?.trim() || "";

    return {
      id: String(index + 1),
      question: title,
      answer: description,
    };
  });
}
