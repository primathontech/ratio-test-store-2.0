import { NextRequest, NextResponse } from "next/server";

/**
 * PUT → Update address
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const addressId = params.id;
    const gkPhone = request.headers.get("gk-phone");
    const gkAccessToken = request.headers.get("gk-access-token");

    if (!gkPhone || !gkAccessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "gk-phone and gk-access-token headers are required",
        },
        { status: 400 }
      );
    }
    if (!addressId) {
      return NextResponse.json(
        { success: false, error: "Address ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const baseUrl = process.env.ADDRESS_API_URL ?? "";
    const merchantId = process.env.MERCHANT_ID ?? "";
    const customerApiUrl = process.env.CUSTOMER_API_URL ?? "";
    if (!baseUrl || !merchantId || !customerApiUrl) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

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
        console.warn(
          "Failed to fetch customer profile, proceeding without customerId"
        );
      }
    }

    const payload = {
      customerId: customerId ?? "string",
      firstName: first_name ?? body.firstName ?? "",
      lastName: last_name ?? body.lastName ?? "",
      address1: address_1 ?? body.address1 ?? body.address ?? "",
      address2: address_2 ?? body.address2 ?? "",
      city: city ?? body.city ?? "",
      company: body.company ?? "string",
      country:
        country === "IN" || country === "India"
          ? "INDIA"
          : (country ?? body.country ?? "string"),
      countryCode: country === "IN" ? "IN" : (body.countryCode ?? "string"),
      phone: recipient_phone ?? body.phone ?? gkPhone,
      email: email ?? body.email ?? "",
      province: state ?? body.province ?? "string",
      provinceCode: pincode ?? body.provinceCode ?? "string",
      zip: pincode ?? body.zip ?? "",
      isDefault:
        body.isDefault === true ||
        body.is_default === true ||
        address_type === "default",
    };

    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch(`${baseUrl}/addresses/${addressId}`, {
      method: "PUT",
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
          error: err.message ?? err.error ?? "Update failed",
          fieldErrors: err.fieldErrors ?? err.errors ?? {},
        },
        { status: statusCode }
      );
    }

    return NextResponse.json({
      success: true,
      data: { addresses: Array.isArray(data) ? data : [data] },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE → Delete address (QA storefront).
 * Path: ADDRESS_API_URL/addresses/{addressId}
 * Headers: gk-merchant-id, gk-access-token (required).
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const addressId = params.id;
    const gkAccessToken = request.headers.get("gk-access-token");

    if (!addressId) {
      return NextResponse.json(
        { success: false, error: "Address ID is required" },
        { status: 400 }
      );
    }
    if (!gkAccessToken) {
      return NextResponse.json(
        { success: false, error: "gk-access-token header is required" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.ADDRESS_API_URL ?? "";
    const merchantId = process.env.MERCHANT_ID ?? "";
    if (!baseUrl || !merchantId) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // eslint-disable-next-line no-restricted-syntax
    const response = await fetch(`${baseUrl}/addresses/${addressId}`, {
      method: "DELETE",
      headers: {
        accept: "*/*",
        "gk-merchant-id": merchantId,
        "gk-access-token": gkAccessToken,
      },
    });

    const data = await response.json();
    const statusCode =
      (data as { statusCode?: number })?.statusCode ?? response.status ?? 200;
    if (statusCode >= 400) {
      const err = data as { message?: string; error?: string };
      return NextResponse.json(
        { success: false, error: err.message ?? err.error ?? "Delete failed" },
        { status: statusCode }
      );
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
