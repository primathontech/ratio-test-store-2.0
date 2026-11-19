import { NextRequest, NextResponse } from "next/server";

const PRODUCT_BASE = process.env.NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL;
const STORE_ID =
  process.env.NEXT_PUBLIC_STORE_ID || process.env.NEXT_PUBLIC_MERCHANT_ID || "";
const SERVICE_NAME =
  process.env.NEXT_PUBLIC_MERCHANT_NAME || process.env.MERCHANT_NAME || "";
const UPLOAD_API_KEY = process.env.REVIEWS_UPLOAD_API_KEY || "";

const MAX_BYTES = 15 * 1024 * 1024;

function safeFileName(original: string, mime: string): string {
  const dot = original.lastIndexOf(".");
  let ext = (dot > -1 ? original.slice(dot + 1) : mime.split("/")[1] || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8);
  if (!ext) {
    ext = "bin";
  }
  const base =
    (dot > -1 ? original.slice(0, dot) : original)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "review";
  const unique = `${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return `review-${base}-${unique}.${ext}`;
}

export async function POST(req: NextRequest) {
  if (!PRODUCT_BASE || !UPLOAD_API_KEY) {
    return NextResponse.json(
      { error: "Upload is not configured", code: "UPLOAD_NOT_CONFIGURED" },
      { status: 503 }
    );
  }
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!/^(image|video)\//.test(file.type)) {
      return NextResponse.json(
        { error: "Only image or video files are allowed" },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File is too large" }, { status: 413 });
    }

    const outForm = new FormData();
    outForm.append("file", file, safeFileName(file.name || "", file.type));

    const url = `${PRODUCT_BASE}/api/v1/upload?storeId=${encodeURIComponent(
      STORE_ID
    )}&service_name=${encodeURIComponent(SERVICE_NAME)}`;
    // eslint-disable-next-line no-restricted-syntax
    const res = await fetch(url, {
      method: "POST",
      headers: { "x-internal-api-key": UPLOAD_API_KEY },
      body: outForm,
    });

    const json = (await res.json().catch(() => ({}))) as {
      data?: { url?: string };
      url?: string;
    };
    const mediaUrl = json?.data?.url || json?.url || "";
    if (!res.ok || !mediaUrl) {
      return NextResponse.json(
        { error: "Upload failed" },
        { status: res.ok ? 502 : res.status }
      );
    }
    return NextResponse.json({ url: mediaUrl });
  } catch {
    return NextResponse.json({ error: "Upload error" }, { status: 500 });
  }
}
