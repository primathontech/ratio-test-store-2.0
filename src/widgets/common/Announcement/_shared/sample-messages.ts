/**
 * Canonical sample messages — the ONE content source every variant's
 * sample-data.ts maps into its native shape, so the bar looks great with
 * zero settings and all variants demo the same store story.
 */
export interface SampleMessage {
  /** Bold lead (the ticker look renders it uppercase). */
  title: string;
  /** Trailing regular text. */
  text: string;
  link?: string;
}

export const SAMPLE_MESSAGES: SampleMessage[] = [
  { title: "Free shipping", text: "on all orders over ₹999" },
  { title: "Hassle-free returns", text: "30-day postage-paid returns" },
  {
    title: "New drop",
    text: "the summer collection is live",
    link: "/collections",
  },
];
