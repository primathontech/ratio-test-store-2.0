import { NextResponse } from "next/server";
import * as jose from "jose";
import { getKwikPassConfig as getGoKwikConfig } from "@/integrations/kwikpass-shopify/config";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { kpToken } = body;

    if (!kpToken) {
      return NextResponse.json(
        { success: false, error: { message: "Missing kwikpass token" } },
        { status: 400 }
      );
    }

    // Get the decode secret from GoKwik configuration
    const config = getGoKwikConfig();
    const decodeSecret = config.kwikpassDecodeSecret;

    if (!decodeSecret) {
      throw new Error("KWIKPASS_DECODE_SECRET is not configured");
    }

    const secret = jose.base64url.decode(decodeSecret);

    if (!secret) {
      throw new Error("Invalid KWIKPASS_DECODE_SECRET format");
    }

    try {
      const { payload } = await jose.jwtDecrypt(kpToken, secret);
      return NextResponse.json(
        { success: true, data: { customer: payload } },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("JWT Decryption Error:", error);
      return NextResponse.json(
        { success: false, error: { message: "Invalid kwikpass token" } },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { message: error.message || "Internal Server Error" },
      },
      { status: 500 }
    );
  }
}
