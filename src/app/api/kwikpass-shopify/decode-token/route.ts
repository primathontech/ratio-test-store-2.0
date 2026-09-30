import { NextResponse } from "next/server";
import * as jose from "jose";
import { getKwikPassConfig as getGoKwikConfig } from "@/integrations/kwikpass-shopify/config";
import { readJsonBody } from "@/lib/voiceGuard";

export async function POST(request: Request) {
  // NOTE: no rate-limit guard here — this is a core storefront LOGIN path (KwikPass),
  // and a per-IP cap would throttle legitimate logins behind shared/office NAT IPs.
  // It already requires a VALID encrypted token to return anything (invalid → 400), so
  // it isn't a useful open oracle. We keep only the size cap + generic errors.
  try {
    // Parse the request body (size-capped).
    const parsed = await readJsonBody<{ kpToken?: string }>(request);
    if (!parsed.ok) return parsed.response;
    const { kpToken } = parsed.data;

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
  } catch {
    // Generic error only — never echo the exception message (it can reveal config
    // state like a missing decode secret) to the client.
    return NextResponse.json(
      { success: false, error: { message: "Internal Server Error" } },
      { status: 500 }
    );
  }
}
