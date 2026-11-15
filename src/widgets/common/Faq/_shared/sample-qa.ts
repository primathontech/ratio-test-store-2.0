/**
 * Canonical sample Q&A — the ONE content source every variant's
 * sample-data.ts maps into its native row shape, so the section looks great
 * with zero settings (fresh palette add / AI instantiation) and all variants
 * demo the same store story.
 */
export interface SampleQA {
  question: string;
  /** Rich-text HTML (the editor's FAQ answer input allows pasted markup). */
  answer: string;
}

export const SAMPLE_QA: SampleQA[] = [
  {
    question: "How long does shipping take?",
    answer:
      "<p>Standard orders ship within 2–3 business days and arrive in 5–7 business days. Express shipping is available at checkout for faster delivery.</p>",
  },
  {
    question: "What is your return policy?",
    answer:
      "<p>Items can be returned within 30 days of purchase in original condition with tags attached. Return shipping is free on orders over ₹999.</p>",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "<p>Orders can be changed or cancelled within 1 hour of placing them. After that they enter fulfilment and can't be modified — but you can always return them.</p>",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "<p>Yes — we ship to over 40 countries. International delivery takes 10–14 business days and duties are calculated at checkout, so there are no surprises.</p>",
  },
  {
    question: "How do I track my order?",
    answer:
      "<p>As soon as your order ships you'll receive an email and SMS with a live tracking link. You can also find it anytime under <strong>Account → Orders</strong>.</p>",
  },
];

export const SAMPLE_HEADING = "Frequently asked questions";
export const SAMPLE_CAPTION = "Support";
