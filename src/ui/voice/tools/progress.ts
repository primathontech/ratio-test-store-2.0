import type { ToolName } from "./registry";

/**
 * UI PROGRESS LABELS — a concise "what's happening now" shown (with a spinner)
 * the instant a tool batch starts, so the shopper gets immediate feedback for
 * every action instead of waiting for the tool to finish and set a result
 * caption. Keyed by the generic, provider-neutral tool name, so it's fully
 * merchant-agnostic. A tool may still overwrite this with a more specific result
 * caption when it completes.
 */
const LABELS: Partial<Record<ToolName, string>> = {
  search_products: "Searching products…",
  recommend_products: "Finding options…",
  get_product_details: "Loading product details…",
  navigate_to_product: "Opening product…",
  get_current_product: "Loading product details…",
  select_variant: "Selecting option…",
  list_collections: "Loading categories…",
  navigate_to_collection: "Opening collection…",
  navigate_to_search: "Opening search…",
  add_to_cart: "Adding to cart…",
  remove_from_cart: "Removing item…",
  update_cart_quantity: "Updating quantity…",
  get_cart: "Checking your cart…",
  clear_cart: "Clearing your cart…",
  undo_last_action: "Undoing…",
  check_product_availability: "Checking availability…",
  open_checkout: "Opening checkout…",
  apply_discount_code: "Applying coupon…",
  remove_discount_code: "Removing coupon…",
  open_cart: "Opening cart…",
  close_cart: "Closing cart…",
  get_order_history: "Loading your orders…",
  reorder: "Re-adding your order…",
  get_customer_profile: "Fetching your profile…",
  get_account_status: "Checking your account…",
  filter_results: "Applying filters…",
  sort_results: "Sorting…",
  clear_filters: "Clearing filters…",
  compare_products: "Comparing…",
  get_reviews: "Loading reviews…",
  get_offers: "Finding offers…",
  get_store_info: "Checking…",
  read_page: "Reading the page…",
  scroll_page: "Scrolling…",
  open_result: "Opening…",
  get_policy: "Opening policy…",
  go_back: "Going back…",
};

/** The progress label for a tool-call BATCH — the first call that has a label
 *  wins (a mixed batch is rare; the leading action is the meaningful one), with a
 *  generic fallback so the shopper always sees the agent is busy. */
export function toolProgressLabel(calls: { name: string }[]): string {
  for (const c of calls) {
    const label = LABELS[c.name as ToolName];
    if (label) return label;
  }
  return "Working…";
}
