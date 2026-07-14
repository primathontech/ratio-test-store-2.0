import { NextRequest, NextResponse } from "next/server";
import { getCommerceClient } from "@/config/commerce";
import { voiceGuard, readJsonBody } from "@/lib/voiceGuard";

export interface DiscountOffer {
  id: string;
  title: string;
  code: string;
  description: string;
  terms_and_conditions: string[];
  start_date: string;
  country: string;
  max_coupon_per_customer: number;
  available_coupons: number;
  applicable_for_all_users: boolean;
  applicable_device: string;
  merchant_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  applicable_user_id: string[];
  applicable_user_categories: string[];
  exclude_applicable_user_id: boolean;
  payment_flags: {
    cod_disable: boolean;
    prepaid_disc_disable: boolean;
  };
  visibility: string;
  post_actions: any;
  usage: number;
}

export interface DiscountResponse {
  data: {
    data: DiscountOffer[];
    pagination: {
      total: number;
      current_page: number;
      total_pages: number;
      limit: number;
    };
  };
  status_code: number;
  success: boolean;
}

export interface FetchDiscountsParams {
  page?: number;
  limit?: number;
  status?: string;
  is_discount_set?: boolean;
  visibility?: string;
}

/**
 * POST /api/v1/discounts
 *
 * Proxies to the GoKwik discount service so the merchant id stays server-side.
 * Mirrors the bblunt reference implementation.
 */
export async function POST(request: NextRequest) {
  const blocked = voiceGuard(request, "discounts", 60);
  if (blocked) return blocked;
  const parsed = await readJsonBody<FetchDiscountsParams>(request);
  if (!parsed.ok) return parsed.response;
  try {
    const body: FetchDiscountsParams = parsed.data;

    const apiUrl = process.env.NEXT_PUBLIC_GOKWIK_DISCOUNT_API_URL || "";
    const mid =
      process.env.NEXT_PUBLIC_MERCHANT_ID || process.env.MERCHANT_ID || "";

    if (!apiUrl) {
      return NextResponse.json(
        { error: "Discount API URL is not configured" },
        { status: 500 }
      );
    }

    const requestBody = {
      merchant_id: mid,
      page: Math.max(1, Number(body.page) || 1),
      limit: Math.min(100, Math.max(1, Number(body.limit) || 100)),
      // FORCE published + always-visible SERVER-SIDE — these are NOT client-
      // controllable. Honoring a client `status`/`visibility` let a caller enumerate
      // HIDDEN / unpublished / user-targeted coupons that were never meant to be public
      // (a coupon-abuse vector on a shared URL). Only public, published offers here.
      status: "published",
      is_discount_set: body.is_discount_set || false,
      visibility: "always",
    };

    const headers: Record<string, string> = {
      accept: "application/json, text/plain, */*",
      "content-type": "application/json",
      "gk-merchant-id": mid,
    };

    const commerceClient = getCommerceClient();
    const response = await commerceClient.fetchRequest({
      url: apiUrl,
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    // Strip user-targeting fields before returning coupons to the client — these can
    // carry customer ids / segments that shouldn't leave the server.
    const raw = response.data as DiscountResponse | undefined;
    const offers = raw?.data?.data;
    if (Array.isArray(offers)) {
      raw!.data.data = offers.map((o) => {
        const {
          applicable_user_id,
          applicable_user_categories,
          exclude_applicable_user_id,
          ...safe
        } = o;
        void applicable_user_id;
        void applicable_user_categories;
        void exclude_applicable_user_id;
        return safe as DiscountOffer;
      });
    }

    return NextResponse.json(raw);
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch discounts" },
      { status: 500 }
    );
  }
}
