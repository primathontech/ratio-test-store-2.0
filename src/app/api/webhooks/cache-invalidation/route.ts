import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook endpoint for cache invalidation
 * Handles incoming webhooks from commerce platforms, CMSs, or other systems
 * to invalidate specific cache entries when data changes
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    // Verify webhook signature (if configured)
    const signature = request.headers.get("x-webhook-signature");
    if (process.env.WEBHOOK_SECRET && signature) {
      const isValid = await verifyWebhookSignature(body, signature);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    // Validate webhook data
    const validationResult = validateWebhookData(body);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: "Invalid webhook data", details: validationResult.errors },
        { status: 400 }
      );
    }

    // Process the invalidation using Next.js cache APIs
    handleCacheInvalidation(body);

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      type: body.type,
      duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const duration = Date.now() - startTime;

    return NextResponse.json(
      {
        error: "Internal server error",
        duration,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Handle cache invalidation based on webhook type
 */
function handleCacheInvalidation(data: any): void {
  const { type, data: webhookData } = data;

  switch (type) {
    case "product.updated":
    case "product.created":
    case "product.deleted":
      revalidateTag(`product-${webhookData.productId}`);
      revalidateTag("products");
      if (webhookData.handle) {
        revalidatePath(`/products/${webhookData.handle}`);
      }
      break;

    case "products.bulk_updated":
      webhookData.productIds.forEach((id: string) => {
        revalidateTag(`product-${id}`);
      });
      revalidateTag("products");
      break;

    case "collection.updated":
    case "collection.created":
    case "collection.deleted":
      revalidateTag(`collection-${webhookData.collectionId}`);
      revalidateTag("collections");
      if (webhookData.handle) {
        revalidatePath(`/collections/${webhookData.handle}`);
      }
      break;

    case "collections.bulk_updated":
      webhookData.collectionIds.forEach((id: string) => {
        revalidateTag(`collection-${id}`);
      });
      revalidateTag("collections");
      break;

    case "inventory.updated":
    case "pricing.updated":
      webhookData.productIds.forEach((id: string) => {
        revalidateTag(`product-${id}`);
      });
      revalidateTag("inventory");
      break;

    case "navigation.updated":
      revalidateTag("navigation");
      break;

    case "search.reindex":
      revalidateTag("search");
      break;

    case "seo.updated":
      if (webhookData.path) {
        revalidatePath(webhookData.path);
      }
      revalidateTag("seo");
      break;

    case "cache.clear_all":
      revalidatePath("/", "layout");
      break;
  }
}

/**
 * Verify webhook signature using HMAC
 */
async function verifyWebhookSignature(
  body: any,
  signature: string
): Promise<boolean> {
  if (!process.env.WEBHOOK_SECRET) {
    return true;
  }

  try {
    const crypto = await import("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", process.env.WEBHOOK_SECRET)
      .update(JSON.stringify(body))
      .digest("hex");

    const providedSignature = signature.replace("sha256=", "");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(providedSignature, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Validate webhook data structure
 */
function validateWebhookData(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.type || typeof data.type !== "string") {
    errors.push('Missing or invalid "type" field');
  }

  if (!data.data || typeof data.data !== "object") {
    errors.push('Missing or invalid "data" field');
  }

  if (data.type && data.data) {
    switch (data.type) {
      case "product.updated":
      case "product.created":
      case "product.deleted":
        if (!data.data.productId) {
          errors.push("Missing productId for product webhook");
        }
        break;

      case "products.bulk_updated":
        if (
          !Array.isArray(data.data.productIds) ||
          data.data.productIds.length === 0
        ) {
          errors.push(
            "Missing or empty productIds array for bulk product webhook"
          );
        }
        break;

      case "collection.updated":
      case "collection.created":
      case "collection.deleted":
        if (!data.data.collectionId) {
          errors.push("Missing collectionId for collection webhook");
        }
        break;

      case "collections.bulk_updated":
        if (
          !Array.isArray(data.data.collectionIds) ||
          data.data.collectionIds.length === 0
        ) {
          errors.push(
            "Missing or empty collectionIds array for bulk collection webhook"
          );
        }
        break;

      case "inventory.updated":
      case "pricing.updated":
        if (
          !Array.isArray(data.data.productIds) ||
          data.data.productIds.length === 0
        ) {
          errors.push(
            "Missing or empty productIds array for inventory/pricing webhook"
          );
        }
        break;

      case "user.updated":
        if (!data.data.userId) {
          errors.push("Missing userId for user webhook");
        }
        break;

      case "cart.updated":
        if (!data.data.cartId) {
          errors.push("Missing cartId for cart webhook");
        }
        break;

      case "seo.updated":
        if (!data.data.path) {
          errors.push("Missing path for SEO webhook");
        }
        break;

      case "navigation.updated":
      case "search.reindex":
      case "cache.clear_all":
        break;

      default:
        errors.push(`Unknown webhook type: ${data.type}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Manual cache invalidation endpoint (for testing/debugging)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!type) {
      return NextResponse.json(
        { error: "Missing type parameter" },
        { status: 400 }
      );
    }

    switch (type) {
      case "product":
        if (!id) {
          return NextResponse.json(
            { error: "Missing id parameter for product invalidation" },
            { status: 400 }
          );
        }
        revalidateTag(`product-${id}`);
        revalidateTag("products");
        break;

      case "collection":
        if (!id) {
          return NextResponse.json(
            { error: "Missing id parameter for collection invalidation" },
            { status: 400 }
          );
        }
        revalidateTag(`collection-${id}`);
        revalidateTag("collections");
        break;

      case "search":
        revalidateTag("search");
        break;

      case "navigation":
        revalidateTag("navigation");
        break;

      case "all":
        revalidatePath("/", "layout");
        break;

      default:
        return NextResponse.json(
          { error: `Unknown invalidation type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      type,
      id,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
