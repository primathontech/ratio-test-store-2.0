/**
 * Voice PDP context — the FULL product detail the PDP itself renders (same
 * source: getCommerceClient().getProduct), NORMALIZED into a compact, plain-text
 * payload the voice agent can reason over. Loading this once gives the agent
 * "complete awareness" of the open product — price, discount, availability,
 * variants, description, and attributes (ingredients / how-to-use / storage,
 * etc.) — so it answers follow-ups WITHOUT re-looking-up.
 *
 * Honesty rules baked in:
 *  - Stock uses availableForSale/availableQuantity, NOT inventory_quantity
 *    (that field is 0 even for in-stock items — quoting it => false "out of stock").
 *  - We report availability as a boolean, never a raw quantity (the backend uses
 *    a 10000 sentinel), so the agent never invents a stock count.
 *  - COD / delivery / returns are NOT product fields here → answered store-level
 *    via get_store_info, never fabricated per product.
 */

import { getCommerceClient } from "@/config";
import { paiseToRupees } from "@/utils/apiTransforms";
import type { VoiceProductDetail } from "@/ui/voice/productDetail";
import { voiceGuard } from "@/lib/voiceGuard";

// Flatten a lexical rich-text node (metadata values) to plain text.
function lexText(node: any): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (typeof node.value === "string") return node.value;
  const kids: any[] = Array.isArray(node.children) ? node.children : [];
  if (node.type === "list") return kids.map(lexText).filter(Boolean).join("; ");
  if (node.type === "list-item") return kids.map(lexText).join("");
  return kids.map(lexText).filter(Boolean).join(" ");
}

function stripHtml(html?: string): string {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/\s+/g, " ")
    .trim();
}

function flattenAttributes(metadata: any): Record<string, string> {
  const out: Record<string, string> = {};
  if (!metadata || typeof metadata !== "object") return out;
  let n = 0;
  for (const key of Object.keys(metadata)) {
    if (n >= 10) break;
    const raw = (metadata as any)[key];
    const v =
      raw && typeof raw === "object" && "value" in raw ? raw.value : raw;
    const text = (typeof v === "string" ? v : lexText(v)).trim();
    if (text) {
      out[key.replace(/_/g, " ").trim()] = text
        .replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 300);
      n++;
    }
  }
  return out;
}

export async function GET(req: Request) {
  const blocked = voiceGuard(req, "read", 150);
  if (blocked) return blocked;

  const { searchParams } = new URL(req.url);
  const handle = searchParams.get("handle");
  if (!handle)
    return Response.json({ error: "handle required" }, { status: 400 });

  try {
    const client: any = getCommerceClient();
    const res = await client.getProduct({ handle });
    const p = res?.data ?? res;
    if (!p || typeof p !== "object" || !p.id)
      return Response.json({ error: "not found" }, { status: 404 });

    const price = paiseToRupees(p.price);
    const compareAt =
      p.compare_at_price != null ? paiseToRupees(p.compare_at_price) : null;
    const onSale = compareAt != null && compareAt > price;

    const rawVariants: any[] = Array.isArray(p.variants) ? p.variants : [];
    // Only surface variants that are a real choice (not a single "Default Title").
    const meaningful =
      rawVariants.length > 1 ||
      (rawVariants[0]?.option_values &&
        rawVariants[0].option_values[0] !== "Default Title");
    const variants = meaningful
      ? rawVariants.slice(0, 20).map((v) => ({
          variant_id: String(v.id),
          title: v.title,
          options: v.option_values,
          price: paiseToRupees(v.price),
          available: !!v.availableForSale,
        }))
      : [];

    const detail: VoiceProductDetail = {
      product_id: String(p.id),
      variant_id: rawVariants[0]?.id ? String(rawVariants[0].id) : undefined,
      title: p.title,
      handle: p.handle,
      brand: (p.vendor || "").trim() || null,
      category: (p.product_type || "").trim() || null,
      tags: Array.isArray(p.tags)
        ? p.tags.map((t: any) => t?.name ?? t).filter(Boolean)
        : [],
      price,
      compare_at_price: compareAt,
      on_sale: onSale,
      discount_pct: onSale ? Math.round((1 - price / compareAt!) * 100) : 0,
      available: !!p.availableForSale,
      variants,
      image_url:
        (p.image && typeof p.image === "object" ? p.image.url : p.image) ||
        (Array.isArray(p.images) && p.images[0]
          ? (p.images[0].url ?? p.images[0])
          : "") ||
        "",
      images_count: Array.isArray(p.images) ? p.images.length : 0,
      description: stripHtml(p.description).slice(0, 600),
      attributes: flattenAttributes(p.metadata),
    };
    return Response.json(detail);
  } catch {
    // Generic error only — never echo the upstream/exception message to the client.
    return Response.json({ error: "Could not load product." }, { status: 500 });
  }
}
