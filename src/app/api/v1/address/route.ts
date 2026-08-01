import { NextRequest, NextResponse } from "next/server";

/** Maps storefront address */
function mapStorefrontAddressToApiAddress(
  a: Record<string, unknown>,
  customerPhone: string
): Record<string, unknown> {
  const address1 = a.address1 ?? a.address ?? "";
  const addressType =
    a.isDefault === true
      ? "default"
      : ((a.address_type as string) ?? "secondary");
  return {
    address_id: a.id ?? a.address_id,
    first_name: a.firstName ?? a.first_name ?? "",
    last_name: a.lastName ?? a.last_name ?? "",
    company: a.company ?? undefined,
    address: address1,
    address_line1: address1,
    address_line2: a.address2 ?? a.address_line2 ?? null,
    city: a.city ?? "",
    state: a.province ?? a.state ?? "",
    country: a.country ?? "",
    pincode: a.zip ?? a.pincode ?? "",
    recipient_phone: a.phone ?? a.recipient_phone ?? customerPhone,
    customerPhone: customerPhone,
    address_type: addressType,
    isDefault: addressType === "default",
    email: a.email ?? "",
    lat: a.lat ?? null,
    long: a.long ?? null,
  };
}

/**
 * GET → Get customer addresses
 */
export async function GET(request: NextRequest) {
  try {
    const gkPhone = request.headers.get("gk-phone");
    const gkAccessToken = request.headers.get("gk-access-token");

    if (!gkPhone || !gkAccessToken) {
      return NextResponse.json(
        { error: "gk-phone and gk-access-token headers are required" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.ADDRESS_API_URL ?? "";
    const merchantId = process.env.MERCHANT_ID ?? "";

    if (!baseUrl || !merchantId) {
      return NextResponse.json(
        {
          error:
            "Server configuration error: ADDRESS_API_URL or MERCHANT_ID not set",
        },
        { status: 500 }
      );
    }

    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch(`${baseUrl}/addresses/customer`, {
      method: "GET",
      headers: {
        accept: "*/*",
        "gk-merchant-id": merchantId,
        "gk-phone": gkPhone,
        "gk-access-token": gkAccessToken,
      },
    });

    const data = await response.json();
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray((data as { addresses?: unknown[] })?.addresses)
        ? (data as { addresses: Record<string, unknown>[] }).addresses
        : null;
    const normalized =
      rawList !== null
        ? {
            success: true,
            data: {
              addresses: rawList.map((a: Record<string, unknown>) =>
                mapStorefrontAddressToApiAddress(a, gkPhone)
              ),
              phone: gkPhone,
            },
            status_code: 200,
            timestamp: Date.now(),
          }
        : data;

    const statusCode =
      (normalized as { status_code?: number })?.status_code ?? 200;
    return NextResponse.json(normalized, { status: statusCode });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/** POST → Create address Needs headers: gk-phone, gk-access-token. */
export async function POST(request: NextRequest) {
  try {
    const gkPhone = request.headers.get("gk-phone");
    const gkAccessToken = request.headers.get("gk-access-token");
    if (!gkPhone || !gkAccessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "gk-phone and gk-access-token headers are required",
          fieldErrors: {},
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      first_name,
      last_name,
      email,
      recipient_phone,
      country,
      city,
      state,
      pincode,
      address_1,
      address_2,
      address_type,
    } = body;

    if (
      !first_name ||
      !last_name ||
      !recipient_phone ||
      !pincode ||
      !address_1
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields", fieldErrors: {} },
        { status: 400 }
      );
    }

    const baseUrl = process.env.ADDRESS_API_URL ?? "";
    const merchantId = process.env.MERCHANT_ID ?? "";
    const customerApiUrl = process.env.CUSTOMER_API_URL ?? "";
    if (!baseUrl || !merchantId || !customerApiUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error",
          fieldErrors: {},
        },
        { status: 500 }
      );
    }

    let customerId = body.customerId ?? null;
    if (!customerId) {
      try {
        // eslint-disable-next-line no-restricted-syntax
        const profileRes = await fetch(
          `${customerApiUrl}/storefront/customers/profile`,
          {
            method: "GET",
            headers: {
              accept: "*/*",
              "gk-merchant-id": merchantId,
              "gk-access-token": gkAccessToken,
            },
          }
        );
        const profileData = await profileRes.json();
        const profile = profileData?.data ?? profileData;
        customerId = (profile as { id?: string })?.id ?? null;
      } catch {
        // ignore
      }
    }
    if (!customerId) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not resolve customer.",
          fieldErrors: {},
        },
        { status: 400 }
      );
    }

    const payload = {
      customerId,
      firstName: first_name,
      lastName: last_name,
      address1: address_1 ?? body.address,
      address2: address_2 || undefined,
      city: city ?? "",
      company: body.company ?? "string",
      country:
        country === "IN" || country === "India"
          ? "INDIA"
          : (country ?? "INDIA"),
      countryCode: country === "IN" ? "IN" : (body.countryCode ?? "string"),
      phone: recipient_phone ?? gkPhone,
      email,
      province: state ?? "string",
      provinceCode: pincode ?? body.provinceCode ?? "string",
      zip: pincode,
      isDefault: address_type === "default",
    };

    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch(`${baseUrl}/addresses`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        "gk-merchant-id": merchantId,
        "gk-phone": gkPhone,
        "gk-access-token": gkAccessToken,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const statusCode =
      (data as { statusCode?: number })?.statusCode ?? response.status ?? 200;

    if (statusCode >= 400) {
      const err = data as {
        message?: string;
        error?: string;
        fieldErrors?: Record<string, string>;
        errors?: Record<string, string>;
      };
      return NextResponse.json(
        {
          success: false,
          error: err.message ?? err.error ?? "Request failed",
          fieldErrors: err.fieldErrors ?? err.errors ?? {},
        },
        { status: statusCode }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error", fieldErrors: {} },
      { status: 500 }
    );
  }
}
