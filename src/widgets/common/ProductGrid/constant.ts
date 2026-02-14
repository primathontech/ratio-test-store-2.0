// metafield.constants.ts

export const PRODUCT_CARD_META_FIELDS = {
  REVIEWS: {
    RATING: { namespace: "reviews", key: "rating" },
    RATING_COUNT: { namespace: "reviews", key: "rating_count" },
  },

  CUSTOM: {
    NET_CONTENT: { namespace: "custom", key: "product_net_content" },
    PRODUCT_LABELS: { namespace: "custom", key: "product_labels" },
    PRODUCT_SUBTITLE: { namespace: "custom", key: "product_subtitle" },
    OFFER_TEXT: { namespace: "custom", key: "offer_text" },
  },
} as const;

export const PRODUCT_TAG_LABELS_ARRAY = [
  { key: "offer_b1g1", label: "B1G1", background: "#82c341" },
  { key: "best-seller", label: "Best Seller", background: "#ff5b6f" },
  { key: "bestsellers", label: "Best Seller", background: "#ff5b6f" },
  { key: "trending", label: "Trending", background: "#82c341" },
  { key: "new launch", label: "New Launch", background: "#82c341" },
  { key: "new-launch", label: "New Launch", background: "#82c341" },
  { key: "flat-45-off", label: "Flat 45% off", background: "#ff5b6f" },
  { key: "200-units-left", label: "200 units left", background: "#ff5b6f" },
  {
    key: "1m-quantity-sold",
    label: "1M+ quantity sold",
    background: "#ff5b6f",
  },
  { key: "back-in-stock", label: "Back in stock", background: "#ff5b6f" },
  { key: "limited-stock", label: "Limited Stock", background: "#ff5b6f" },
  {
    key: "only-99-quantity-left",
    label: "Only 99 quantity Left",
    background: "#ff5b6f",
  },
  {
    key: "only-199-quantity-left",
    label: "Only 199 quantity Left",
    background: "#ff5b6f",
  },
  {
    key: "only-149-quantity-left",
    label: "Only 149 Quantity left",
    background: "#ff5b6f",
  },
  { key: "flash-deal", label: "Flash deal", background: "#ff5b6f" },
  { key: "limited-deal", label: "Limited Deal", background: "#ff5b6f" },
  { key: "bogo", label: "BOGO", background: "#ff5b6f" },
  { key: "combo50", label: "COMBO50", background: "#ff5b6f" },
];
