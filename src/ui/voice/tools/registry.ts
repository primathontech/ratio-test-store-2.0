/**
 * The tool REGISTRY — the single, PROVIDER-NEUTRAL source of truth for the tool
 * surface the model sees: each tool's name, description, and parameter schema.
 *
 * Two things this fixes vs. the old declarations:
 *  1. NEUTRAL SHAPE. These are plain `{ description, parameters }` entries — NOT
 *     any one vendor's function-tool wrapper. Each SERVER provider adapts this
 *     neutral map into its own wire format (see providers/server/openaiServer.ts).
 *     Adding another model touches only that adapter, never this file.
 *  2. COMPILE-TIME DRIFT SAFETY. `ToolName` is the union of every tool name, and
 *     both this map AND the handler map in runTool.ts are typed `Record<ToolName,
 *     …>`. Rename or add a tool in one place without the other and the build
 *     fails — the two-file "stringly-typed" drift the old switch allowed is gone.
 */

/** Minimal JSON-Schema object shape (the neutral parameter description). */
export type ToolParameters = {
  type: "object";
  properties: Record<string, unknown>;
  required: string[];
};

export type ToolSchema = {
  description: string;
  parameters: ToolParameters;
  /** `"required"` = the tool exposes the signed-in shopper's own account data and
   *  MUST NOT run for an anonymous shopper. Enforced centrally by the tool
   *  dispatcher (runTool) against the injected auth port — never inside the
   *  handler. Omitted = public. This is the whole cost of adding a future
   *  authenticated tool: set this flag. */
  auth?: "required";
};

const obj = (
  properties: Record<string, unknown> = {},
  required: string[] = []
): ToolParameters => ({ type: "object", properties, required });

/** Every tool the agent can call. Adding one = add a name here + a handler in
 *  runTool.ts; TypeScript enforces both stay in lockstep. */
export type ToolName =
  | "search_products"
  | "open_product"
  | "recommend_products"
  | "get_product_details"
  | "navigate_to_product"
  | "get_current_product"
  | "select_variant"
  | "list_collections"
  | "navigate_to_collection"
  | "navigate_to_search"
  | "add_to_cart"
  | "remove_from_cart"
  | "update_cart_quantity"
  | "get_cart"
  | "clear_cart"
  | "undo_last_action"
  | "check_product_availability"
  | "open_checkout"
  | "apply_discount_code"
  | "remove_discount_code"
  | "open_cart"
  | "close_cart"
  | "get_order_history"
  | "reorder"
  | "get_customer_profile"
  | "get_account_status"
  | "filter_results"
  | "sort_results"
  | "clear_filters"
  | "compare_products"
  | "get_reviews"
  | "get_offers"
  | "get_store_info"
  | "read_page"
  | "scroll_page"
  | "open_result"
  | "get_policy"
  | "go_back";

export const TOOL_SCHEMAS: Record<ToolName, ToolSchema> = {
  search_products: {
    description:
      "BROWSE the catalog and open the search RESULTS page — for plural / exploratory intent ('show me shampoos', 'cheaper options', 'what conditioners do you have'). For a SPECIFIC product the shopper NAMES and wants to open, use open_product instead (it goes straight to the product page).",
    parameters: obj(
      {
        query: {
          type: "string",
          description:
            "A concrete product type or category to search for (a real product noun, not a vague phrase).",
        },
      },
      ["query"]
    ),
  },
  open_product: {
    description:
      "Open a SPECIFIC product the shopper NAMES — 'open the Onion Hair Oil', 'show me the XYZ Shampoo', 'take me to the ABC Conditioner'. Pass the product name in 'query'. It goes STRAIGHT to that product's page when the name confidently matches one product (NO detour through the results page); if the name is ambiguous (many close matches) it falls back to showing the results so the shopper can pick. Use this for a named single product; use search_products for BROWSE / plural intent.",
    parameters: obj(
      {
        query: {
          type: "string",
          description: "The product name the shopper said, as spoken.",
        },
      },
      ["query"]
    ),
  },
  recommend_products: {
    description:
      "Recommend products for the shopper and open the results. Use for open-ended intent: 'recommend something', 'what should I buy', 'show me similar', 'something for oily skin / for a wedding / a gift for my sister', 'I don't know what to buy'. Pass 'query' with the shopper's stated intent (need, occasion, recipient, or 'similar'); OMIT 'query' to get items SIMILAR to the product currently open (derived from its own category/brand/tags). If nothing is open and no intent is given, it asks what they're after. Same result shape as search_products.",
    parameters: obj({
      query: {
        type: "string",
        description:
          "The shopper's intent/need/occasion (e.g. 'for oily skin', 'wedding outfit', 'gift for mom'). For CROSS-SELL / 'what goes with this', pass a COMPLEMENTARY product type here (e.g. 'conditioner' after a shampoo, 'socks' after shoes) — infer a sensible complement and search this store's catalog for it. OMIT query ONLY to get items SIMILAR to the open product (substitutes) — never omit it for cross-sell.",
      },
    }),
  },
  get_product_details: {
    description:
      "Get details (price, availability) of a product from the last search results, by product_id.",
    parameters: obj({ product_id: { type: "string" } }, ["product_id"]),
  },
  navigate_to_product: {
    description:
      "Open a product's detail page, by product_id from the last search results.",
    parameters: obj({ product_id: { type: "string" } }, ["product_id"]),
  },
  get_current_product: {
    description:
      "Get COMPLETE details of the product the shopper is currently viewing on the product page: price, discount, availability, variants, description, and attributes (ingredients, how-to-use, storage, manufacturer, etc.). Call ONCE when they ask about 'this'/'it' or are on a product page, then answer all follow-ups from the result without calling again. COD/delivery/payment are store-level — use get_store_info.",
    parameters: obj(),
  },
  select_variant: {
    description:
      "On the current product page, switch to a specific variant (size / colour / pack). Use for any 'in a different size/colour' intent — 'the small one', 'do you have it in red', 'chhota size', 'laal wala', 'dusra colour', 'bada size dikhao'. Pass 'option' with what the shopper said (e.g. 'M', 'blue', '200ml', 'chhota', 'laal'), OR a 'variant_id', OR a 1-based 'index'. It updates the PAGE to that variant and makes it the add-to-cart target. If the product has no options it says so. Always confirm the ACTUAL variant it returns (and whether it's in stock).",
    parameters: obj({
      option: { type: "string" },
      variant_id: { type: "string" },
      index: { type: "number" },
    }),
  },
  list_collections: {
    description:
      "List the store's REAL collections (handle + title). Call this before navigate_to_collection so you use a real handle, never a guessed one.",
    parameters: obj(),
  },
  navigate_to_collection: {
    description:
      "Open a REAL collection page by a handle returned from list_collections. If the handle isn't a real collection, it falls back to a keyword search.",
    parameters: obj({ handle: { type: "string" } }, ["handle"]),
  },
  navigate_to_search: {
    description: "Open the search results page for a query.",
    parameters: obj({ query: { type: "string" } }, ["query"]),
  },
  add_to_cart: {
    description:
      "Add a product to the cart, by product_id (from the last results, or the product currently open). Call this whenever the shopper signals they WANT this product — not only 'add to cart' but any equivalent intent: 'I'll take it', 'buy this', 'let's get it', 'this one', or the Hindi/Hinglish equivalent ('le lo', 'chahiye', 'daal do', 'order kar do'). Infer the intent — never require the word 'cart'. ALWAYS pass 'quantity' as the exact number of units the shopper asked for (e.g. 'add 5' -> quantity: 5); omit only when they didn't specify (defaults to 1). The tool returns the ACTUAL resulting cart quantity — confirm THAT number to the shopper, not what you assumed. If the tool returns sold_out:true, the item (or the chosen variant) is OUT OF STOCK — do NOT retry; tell the shopper it's sold out and offer to find a similar in-stock option instead. If it returns needs_variant:true, the product has options (size/colour/pack) the shopper hasn't chosen — ask which one using the returned 'options' list, call select_variant, THEN add.",
    parameters: obj({
      product_id: {
        type: "string",
        description:
          "The product to add — from the loaded results or the open product. PREFER this when you have it.",
      },
      query: {
        type: "string",
        description:
          "A product NAME to add when you have no product_id and none is loaded (e.g. 'add the XYZ Shampoo'). Adds the confidently-matching product directly (no search-page detour); if the name is ambiguous it returns options for you to confirm. Provide product_id OR query.",
      },
      quantity: {
        type: "number",
        description: "Number of units to add. Default 1.",
      },
    }),
  },
  remove_from_cart: {
    description:
      "Remove one OR MORE specific items from the cart. Pass a single product_id, or product_ids (an array) to remove several at once ('remove those two', 'take off the shampoo and the mask') — multiple ids are confirmed together in ONE step. Use for any 'take it off' intent — 'remove this', 'delete it', 'hata do', 'nikaal do'. For emptying the WHOLE cart, use clear_cart instead. Infer intent; never require the word 'remove'.",
    parameters: obj({
      product_id: { type: "string" },
      product_ids: {
        type: "array",
        items: { type: "string" },
        description:
          "Multiple product_ids to remove together in one confirmation.",
      },
    }),
  },
  update_cart_quantity: {
    description:
      "Set a cart item's quantity to an ABSOLUTE number, by product_id. Use for 'make it 2', 'change to 3', 'do kar do', 'reduce to 1'. For 'one more' / 'ek aur' / 'add another', prefer add_to_cart with quantity 1 instead. Confirm the ACTUAL resulting quantity the tool returns.",
    parameters: obj(
      { product_id: { type: "string" }, quantity: { type: "number" } },
      ["product_id", "quantity"]
    ),
  },
  get_cart: {
    description:
      "Get the current cart contents and totals (items, unit count, subtotal, currency). Use for 'what's in my cart', 'how much is it so far', 'what's my total'.",
    parameters: obj(),
  },
  clear_cart: {
    description:
      "Empty the ENTIRE cart in one action. Use ONLY for a clear 'remove everything' / 'empty my cart' / 'clear the cart' / 'sab hata do' intent — NOT for removing a specific item (use remove_from_cart). Confirms once before clearing.",
    parameters: obj(),
  },
  undo_last_action: {
    description:
      "Undo the LAST cart change you made — re-add an item you just removed, or restore a quantity/add. Use for 'undo', 'undo that', 'no, take it back', 'put it back', 'wapas karo'. Only the single most recent change is reversible; if there's nothing to undo it says so.",
    parameters: obj(),
  },
  check_product_availability: {
    description:
      "Check whether a product is currently in stock, by product_id from the last results (or the product/variant currently open). Public — no sign-in needed.",
    parameters: obj({ product_id: { type: "string" } }, ["product_id"]),
  },
  open_checkout: {
    description:
      "Open the cart/checkout so the shopper can pay. Use ONLY for an EXPLICIT pay / checkout / place-order intent, and confirm first. For 'buy/take/order THIS product' (choosing a product), add_to_cart instead and offer to check out — don't jump straight to checkout.",
    parameters: obj(),
  },
  apply_discount_code: {
    description: "Apply a discount code to the cart.",
    parameters: obj({ code: { type: "string" } }, ["code"]),
  },
  remove_discount_code: {
    description:
      "Remove the currently applied discount/coupon from the cart. Use for 'remove the coupon', 'take off the discount', 'cancel the code'. Pass 'code' if the shopper named a specific one; omit to remove whatever is currently applied.",
    parameters: obj({ code: { type: "string" } }),
  },
  open_cart: {
    description:
      "Open/show the cart DRAWER so the shopper can see their items. Use for 'open my cart', 'show my cart', 'view cart', 'what's in my cart' (to display it). This does NOT start payment — use open_checkout ONLY when the shopper explicitly wants to check out / pay.",
    parameters: obj(),
  },
  close_cart: {
    description:
      "Close/hide the cart DRAWER. Use for 'close my cart', 'hide the cart', 'close it' (when the cart is what's open).",
    parameters: obj(),
  },
  get_order_history: {
    description:
      "Get the signed-in shopper's recent orders (up to the last 10): order number, date, status, total, and items. Requires the shopper to be signed in — if not, it returns auth_required and you must tell them to sign in (you cannot sign them in).",
    parameters: obj(),
    auth: "required",
  },
  get_customer_profile: {
    description:
      "Get the signed-in shopper's own profile (name, email, phone on file). Requires the shopper to be signed in — if not, it returns auth_required and you must tell them to sign in (you cannot sign them in). Do NOT read out email/phone unless the shopper explicitly asks.",
    parameters: obj(),
    auth: "required",
  },
  reorder: {
    description:
      "Re-add the items from a PAST order to the cart. Use for 'order that again', 'reorder my last order', 'buy those again', 'repeat my order'. Pass order_number (from get_order_history) — or omit to reorder the most recent order. It re-resolves current price/stock and skips anything now out of stock (telling you which). Requires the shopper to be signed in.",
    parameters: obj({ order_number: { type: "string" } }),
    auth: "required",
  },
  get_account_status: {
    description:
      "Check whether the shopper is signed in (returns { signed_in: true/false }). Call this BEFORE offering account features (orders, profile) so you can tailor up front — e.g. offer 'your recent orders' only when signed_in, otherwise say they'd need to sign in. Returns no personal data. Public.",
    parameters: obj(),
  },
  filter_results: {
    description:
      "Narrow ONLY the shortlist you read back to the shopper (NOT the on-screen grid) by: price range, on-sale, in-stock, and/or a single 'attribute' word (a colour/material/brand/type/tag like 'black', 'cotton', 'nike', 'serum'). Use for 'between ₹200 and ₹500', 'only ones on sale', 'the black ones', 'show cotton'. It refines only what's already loaded (search first if none) and matches the attribute against each product's title + type + tags + options. For a brand-new category not in the loaded set, re-run search_products / navigate_to_collection instead. Returns the matching products so you can read them out — say how many match and read the top ones; never claim you filtered the on-screen page. If the shopper wants the VISIBLE page filtered, tell them to tap that filter on screen.",
    parameters: obj({
      price_min: { type: "number", description: "Min price in ₹ (rupees)" },
      price_max: { type: "number", description: "Max price in ₹ (rupees)" },
      on_sale_only: {
        type: "boolean",
        description: "Keep only discounted products",
      },
      in_stock_only: {
        type: "boolean",
        description: "Keep only in-stock products",
      },
      attribute: {
        type: "string",
        description:
          "A single colour/material/brand/type/tag word to keep (e.g. 'black', 'cotton', 'nike'). Matched against title + type + tags + options.",
      },
    }),
  },
  sort_results: {
    description:
      "Reorder ONLY the shortlist you read back to the shopper — this does NOT change the on-screen product grid or the page's own sort. 'by' one of: 'price_low', 'price_high', 'discount' (biggest saving first), 'rating' (best reviews first). Returns the reordered products so you can read them out (e.g. 'cheapest first…'). Never tell the shopper 'I've sorted the page'; if they want the VISIBLE page re-sorted, tell them to tap the Sort control on screen.",
    parameters: obj({ by: { type: "string" } }, ["by"]),
  },
  clear_filters: {
    description:
      "Undo filters/sorting and restore the full original result set. Also clears the store's ON-PAGE filters when the shopper is on a collection/search page (returns to the unfiltered view, keeping any search term). Use for 'clear all filters', 'reset', 'show everything'.",
    parameters: obj(),
  },
  compare_products: {
    description:
      "Compare 2-3 products side by side (price, discount, availability, rating). Pass product_ids from the results, or indexes (1-based positions in the current results). Defaults to the first two if none given.",
    parameters: obj({
      product_ids: { type: "array", items: { type: "string" } },
      indexes: { type: "array", items: { type: "number" } },
    }),
  },
  get_reviews: {
    description:
      "Get the real average rating and top reviews for a product (by product_id from results, or the product currently open). Use for 'what are the reviews', 'how is it rated', 'read the reviews'.",
    parameters: obj({ product_id: { type: "string" } }),
  },
  get_offers: {
    description:
      "List the store's real, currently-published coupons/offers. Use for 'any coupons?', 'what offers are there?'. Never invent a code — only report what this returns.",
    parameters: obj(),
  },
  get_store_info: {
    description:
      "GENERIC payment fallback only. IMPORTANT: for COD, delivery time, or offers on a product/cart page, use read_page instead — those are shown on the page and are store-specific. Use get_store_info ONLY for generic payment-method questions when nothing relevant is on screen. If it returns known:false, say it's shown at checkout.",
    parameters: obj({ topic: { type: "string" } }, ["topic"]),
  },
  read_page: {
    description:
      "SEE the shopper's current screen: returns the visible content of the page they're on (text + badge/label info like delivery time, COD/return badges, offer counts, on-page options/variants, availability, ratings). Call this for ANY question about what is shown on the current page, or when you need details you don't already have from another tool. Answer ONLY from what it returns — never guess.",
    parameters: obj(),
  },
  scroll_page: {
    description:
      "Scroll the current page for the shopper. 'to' one of: 'top', 'bottom', 'up', 'down', 'reviews'.",
    parameters: obj({ to: { type: "string" } }, ["to"]),
  },
  open_result: {
    description:
      "Open one of the CURRENTLY-shown results, by its 1-based position in 'index'. The shopper may refer to it by position OR by a trait you can see in the list — 'open the first one', 'the second product', 'the cheaper one' (after sorting), 'the black one', 'pehla wala', 'ye wala', 'wo dikhao'. Resolve their reference to the right result and pass its index.",
    parameters: obj({ index: { type: "number" } }, ["index"]),
  },
  get_policy: {
    description:
      "Open the store's REAL policy page for the shopper: 'topic' one of 'shipping', 'returns' (covers returns/cancellation/refund/replacement/exchange), 'privacy', 'terms', 'about'. Use for 'what's your return policy', 'how long does shipping take', 'can I cancel my order'. It OPENS the page — do NOT invent specific timelines, windows, or charges; tell them it's open and only state facts you actually know.",
    parameters: obj({ topic: { type: "string" } }, ["topic"]),
  },
  go_back: {
    description:
      "Go back to the previous page the shopper was on (browser back). Use for 'take me back', 'go back', 'previous', 'wapas', 'peeche jao'.",
    parameters: obj(),
  },
};

/** All tool names (handy for the provider adapter / feature-flag filtering). */
export const TOOL_NAMES = Object.keys(TOOL_SCHEMAS) as ToolName[];

/**
 * Tools that are pure reads with no ordering-sensitive side effect (no
 * navigation, no cart write, no single-slot focus change). A batch made up
 * ENTIRELY of these can be executed concurrently; any other tool in the batch
 * forces sequential execution to keep mutation/navigation order deterministic.
 */
export const READ_ONLY_TOOLS: ReadonlySet<ToolName> = new Set<ToolName>([
  "get_cart",
  "get_offers",
  "get_store_info",
  "get_reviews",
  "compare_products",
  "list_collections",
  "read_page",
  "get_account_status",
]);
