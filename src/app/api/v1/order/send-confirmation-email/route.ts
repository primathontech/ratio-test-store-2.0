import { NextRequest, NextResponse } from "next/server";
import { getCommerceClient } from "@/config/commerce";
import { fetchWithTimeout } from "@/utils/serverFetch";

export const dynamic = "force-dynamic";

interface OrderLineItem {
  title?: string;
  name?: string;
  variant_title?: string;
  variant_id?: string | number;
  productHandle?: string;
  quantity?: number;
  price?: number | string;
  image?: string;
  image_url?: string;
  /** Product metadata `subtitle` metafield, filled by enrichVariantTitles. */
  subtitle?: string;
}

/**
 * Order line items come back with variant_title: null but carry variant_id +
 * productHandle. Resolve titles (e.g. "Medium / Red") via the commerce client
 * — one product fetch per handle — and fill in the missing variant_title in
 * place. Also picks up the product's `subtitle` metafield for each item.
 * Best-effort: any failure leaves the items as-is so the email still sends.
 */
async function enrichVariantTitles(items: OrderLineItem[]): Promise<void> {
  const handles = Array.from(
    new Set(items.map((i) => i.productHandle).filter(Boolean))
  ) as string[];
  if (handles.length === 0) {
    return;
  }

  try {
    const client = getCommerceClient();
    const subtitleByHandle: Record<string, string> = {};
    const maps = await Promise.all(
      handles.map(async (handle) => {
        try {
          const res = await client.getProduct({ handle });
          const variants: any[] = res?.success
            ? ((res.data as any)?.variants ?? [])
            : [];
          const subtitle = res?.success
            ? (res.data as any)?.metadata?.subtitle?.value
            : undefined;
          if (typeof subtitle === "string" && subtitle) {
            subtitleByHandle[handle] = subtitle;
          }
          const m: Record<string, string> = {};
          for (const v of variants) {
            if (v?.id != null && v?.title) {
              m[String(v.id)] = String(v.title);
            }
          }
          return m;
        } catch {
          return {};
        }
      })
    );
    const titleByVariant: Record<string, string> = Object.assign({}, ...maps);
    for (const item of items) {
      if (!item.variant_title && item.variant_id != null) {
        const t = titleByVariant[String(item.variant_id)];
        if (t) {
          item.variant_title = t;
        }
      }
      if (item.productHandle && subtitleByHandle[item.productHandle]) {
        item.subtitle = subtitleByHandle[item.productHandle];
      }
    }
  } catch {
    // commerce client unavailable — skip enrichment, email still sends.
  }
}

interface OtherCharge {
  type?: string;
  charge_type?: string;
  label?: string;
  description?: string;
  amount?: number | string;
}

function toNumber(value: unknown): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

function formatPrice(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

function buildItemsHtml(items: OrderLineItem[], divisor: number): string {
  return items
    .map((item) => {
      const title = item.title || item.name || "Product";
      const subtitle = item.subtitle || "";
      const variant = item.variant_title || "";
      const qty = item.quantity ?? 1;
      const unitPrice = toNumber(item.price) / divisor;
      const price = formatPrice(unitPrice);
      const lineTotal = formatPrice(unitPrice * qty);
      const image = item.image || item.image_url || "";
      const subtitleHtml = subtitle
        ? `\n    <div class='text-muted' style='font-size:12px; color:#777;'>${subtitle}</div>`
        : "";

      return `<tr class='row-alt' style='border-bottom:1px solid #E4E4E4'>
  <td width='64' style='padding:8px 0; vertical-align:top'>
    <img src='${image}' width='60' height='60' alt='${title}'>
  </td>
  <td style='padding:8px 0 8px 12px; line-height:1.4; vertical-align:top'>
    <div style='font-weight:600; font-size:15px;'>${title}</div>${subtitleHtml}
    <div class='text-muted' style='font-size:12px; color:#777;'>${variant}</div>
    <div style='font-size:13px;'>Qty × ${qty}</div>
  </td>
  <td width='100' class='t-right' style='padding:8px 0; vertical-align:top; white-space:nowrap'>
    ${price}
    <div style='font-size:12px; color:#777;'>${lineTotal}</div>
  </td>
</tr>`;
    })
    .join("\n");
}

function buildEmailItems(items: OrderLineItem[], divisor: number) {
  return items.map((item) => {
    const qty = item.quantity ?? 1;
    const unitPrice = toNumber(item.price) / divisor;
    return {
      image: item.image || item.image_url || "",
      title: item.title || item.name || "Product",
      subtitle: item.subtitle || "",
      variant: item.variant_title || "",
      qty,
      price: formatPrice(unitPrice),
      line_total: formatPrice(unitPrice * qty),
    };
  });
}

function buildAddress(addr: Record<string, unknown> | undefined) {
  if (!addr) {
    return { name: "", street: "", city: "", zip: "", state: "", country: "" };
  }
  // Support both Shopify-style (address1/zip/province/name) and GoKwik-style
  // (address/pincode/state/first_name+last_name) payloads.
  const name =
    String(addr.name || "") ||
    `${addr.first_name || ""} ${addr.last_name || ""}`.trim();
  const zip = String(addr.zip || addr.pincode || "");
  const state = String(addr.province || addr.state || "");
  const city = String(addr.city || "");
  const country = String(addr.country || "");
  const cityWithZip = zip ? `${city}-${zip}` : city;
  const streetParts = [
    addr.address1 || addr.address,
    addr.address2,
    city,
    cityWithZip,
    state,
    country,
  ];
  const street = streetParts.filter(Boolean).join(", ");
  return {
    name,
    street,
    city: city.toUpperCase(),
    zip,
    state: state.toUpperCase(),
    country,
  };
}

export async function POST(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL || "";
  const emailApiUrl = `${baseUrl}/api/v1/kwik-engage/send-email`;
  const templateId = Number(process.env.KWIK_ENGAGE_TEMPLATE_ID) || 9537;
  const fromEmail = process.env.KWIK_ENGAGE_FROM_EMAIL || "update@primathon.in";
  const fromName = process.env.KWIK_ENGAGE_FROM_NAME || "The Moms Co";
  const subject =
    process.env.KWIK_ENGAGE_SUBJECT || "Order Confirmation from Momsco";
  const emailMerchantId = process.env.NEXT_PUBLIC_MERCHANT_ID || "";
  const siteBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://themomsco.com";
  const storeLogoUrl =
    process.env.KWIK_ENGAGE_LOGO_URL ||
    `${siteBaseUrl}/assets/momsco/svg/momsco-logo-new.svg`;
  const storeSupportEmail =
    process.env.KWIK_ENGAGE_SUPPORT_EMAIL || "hello@themomsco.com";

  if (!baseUrl) {
    return NextResponse.json(
      { success: false, error: "Email service not configured" },
      { status: 500 }
    );
  }

  let body: {
    orderId: string;
    orderData: Record<string, unknown>;
    gkAccessToken?: string;
    requestId?: string;
    customerId?: string;
    phone?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { orderId, orderData, gkAccessToken, requestId, customerId, phone } =
    body;

  if (!orderId) {
    return NextResponse.json(
      { success: false, error: "Missing orderId" },
      { status: 400 }
    );
  }

  // Prefer the authoritative order-history API (has discount/shipping/tax
  // fields the GoKwik SDK orderSuccess payload is missing). Values from this
  // API are in paise, so set divisor=100 when we successfully fetch from it.
  // Fall back to the SDK payload (already in rupees) when the fetch fails.
  let order: Record<string, unknown> =
    (orderData?.orderSuccessBody as Record<string, unknown>) || orderData;
  let priceDivisor = 1;

  const orderHistoryBaseUrl =
    process.env.NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL;
  const merchantId = process.env.MERCHANT_ID;
  if (gkAccessToken && orderHistoryBaseUrl && merchantId) {
    try {
      const apiUrl = `${orderHistoryBaseUrl}/api/v1/auth/customers/orders/${orderId}`;
      const apiResponse = await fetchWithTimeout(apiUrl, {
        method: "GET",
        headers: {
          accept: "application/json",
          "Gk-Request-Id": requestId || "",
          "Gk-Customer-Id": customerId || "",
          "Gk-Phone": phone || "",
          "gk-merchant-id": merchantId,
          "merchant-mid": merchantId,
          "gk-access-token": gkAccessToken,
        },
      });
      if (apiResponse.ok) {
        const apiData = (await apiResponse.json()) as {
          order?: Record<string, unknown>;
        };
        if (apiData?.order) {
          order = apiData.order;
          priceDivisor = 100;
        }
      }
    } catch {
      // fall through to SDK payload
    }
  }

  try {
    const lineItems: OrderLineItem[] =
      (order?.line_items as OrderLineItem[]) || [];
    // Fill in variant_title (null on order line items) before rendering items.
    await enrichVariantTitles(lineItems);
    const shippingAddress = order?.shipping_address as
      | Record<string, unknown>
      | undefined;
    const billingAddress =
      (order?.billing_address as Record<string, unknown> | undefined) ||
      shippingAddress;

    const customerEmail =
      order?.email ||
      order?.contact_email ||
      (order?.customer as Record<string, unknown>)?.email;

    if (!customerEmail) {
      return NextResponse.json(
        { success: false, error: "Customer email not available" },
        { status: 422 }
      );
    }

    const totalTax = toNumber(order?.total_tax) / priceDivisor;
    const totalDiscount = toNumber(order?.total_discount) / priceDivisor;
    const shippingLines = (order?.shipping_lines || []) as Record<
      string,
      unknown
    >[];
    const shippingCost =
      (toNumber(order?.shipping_total) ||
        shippingLines.reduce(
          (sum: number, line) => sum + toNumber(line.price),
          0
        )) / priceDivisor;

    // order-history API uses `other_charges_breakdown` (paise);
    // SDK orderSuccessBody uses `other_charges` (rupees).
    const otherChargesRaw =
      (order?.other_charges_breakdown as OtherCharge[]) ||
      (order?.other_charges as OtherCharge[]) ||
      [];
    const otherCharges = otherChargesRaw.reduce(
      (sum, charge) => sum + toNumber(charge.amount) / priceDivisor,
      0
    );

    const calculatedItemsTotal = lineItems.reduce(
      (sum, item) => sum + toNumber(item.price) * (item.quantity ?? 1),
      0
    );
    const itemsSubtotal =
      (toNumber(order?.total_line_items_price) || calculatedItemsTotal) /
      priceDivisor;

    const rawTotal = toNumber(order?.total_price) / priceDivisor;
    const total =
      rawTotal ||
      itemsSubtotal - totalDiscount + shippingCost + totalTax + otherCharges;
    const requiresShipping =
      (order?.requires_shipping as boolean) ?? lineItems.length > 0;

    const orderNumber = String(
      order?.external_order_name ||
        order?.external_order_number ||
        order?.name ||
        order?.order_number ||
        order?.order_name ||
        orderId
    );
    const displayNumber = orderNumber.startsWith("#")
      ? orderNumber
      : `#${orderNumber}`;

    const customerName =
      String(shippingAddress?.name || "") ||
      `${shippingAddress?.first_name || ""} ${shippingAddress?.last_name || ""}`.trim() ||
      "";

    const emailPayload = {
      campaign_id: "",
      automation_id: "",
      template_id: templateId,
      contents: [{ type: "html", value: " ", variables: [] as never[] }],
      from_email: fromEmail,
      from_name: fromName,
      subject,
      reply_to: String(customerEmail),
      receiver: {
        to_email: customerEmail,
        to_name: customerName,
        variables: {
          store: {
            logo_url: storeLogoUrl,
            support_email: storeSupportEmail,
            name: fromName,
            url: siteBaseUrl,
          },
          order: {
            number: displayNumber,
            orderId,
            requires_shipping: requiresShipping,
            items: buildEmailItems(lineItems, priceDivisor),
            items_html: buildItemsHtml(lineItems, priceDivisor),
            subtotal: formatPrice(itemsSubtotal),
            discount: formatPrice(totalDiscount),
            shipping: formatPrice(shippingCost),
            taxes: formatPrice(totalTax),
            other_charges: formatPrice(otherCharges),
            total: formatPrice(total),
            shipping_address: buildAddress(shippingAddress),
            billing_address: buildAddress(billingAddress),
            shipping_method:
              String(
                (shippingLines[0] as Record<string, unknown>)?.title || ""
              ) || "Standard Shipping",
          },
        },
        attachments: [] as never[],
      },
      attachments: [] as never[],
      tags: [] as never[],
      priority_flag: 3,
      remove: ["UNSUBSCRIBED", "BOUNCED", "SPAM"],
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const emailResponse = await fetch(emailApiUrl, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        "gk-merchant-id": emailMerchantId,
      },
      body: JSON.stringify(emailPayload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text().catch(() => "Unknown error");
      // eslint-disable-next-line no-console
      console.error(
        `Kwik Engage email API error: ${emailResponse.status}`,
        errorText
      );
      return NextResponse.json(
        {
          success: false,
          error: `Email API returned ${emailResponse.status}`,
        },
        { status: emailResponse.status }
      );
    }

    const result = await emailResponse.json().catch(() => ({}));
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { success: false, error: "Email API request timed out" },
        { status: 504 }
      );
    }
    // eslint-disable-next-line no-console
    console.error("Error sending confirmation email:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
