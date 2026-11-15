import { describe, it, expect, mock, beforeAll, afterAll } from "bun:test";

/**
 * The installed-apps read is uncached and runs per shopper page view, so the
 * gateway's per-shopper limit needs the shopper's IP — the ALB-appended
 * X-Forwarded-For entry, never a header the shopper can set.
 */
const ORIGINAL_FETCH = globalThis.fetch;
const ENV = {
  RATIO_APPS_API_URL: "https://apps.example.test",
  MERCHANT_ID: "m1",
  RATIO_APPS_STOREFRONT_TOKEN: "tok",
} as const;
const saved: Record<string, string | undefined> = {};
// Assigning undefined stores the string "undefined", which leaks into later files.
const restoreEnv = (key: string, value: string | undefined) => {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
};

describe("GET /api/v1/apps/installed", () => {
  beforeAll(() => {
    for (const [k, v] of Object.entries(ENV)) {
      saved[k] = process.env[k];
      process.env[k] = v;
    }
  });
  afterAll(() => {
    globalThis.fetch = ORIGINAL_FETCH;
    for (const k of Object.keys(ENV)) restoreEnv(k, saved[k]);
  });

  it("forwards the ALB-appended shopper IP and the merchant id upstream", async () => {
    const fetchMock = mock(async () =>
      Response.json({ success: true, data: { shopId: "m1", apps: [] } })
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { GET } = await import("./route");

    await GET(
      new Request("https://store.test/api/v1/apps/installed?surface=embed", {
        headers: {
          "x-forwarded-for": "6.6.6.6, 1.1.1.1",
          "cf-connecting-ip": "9.9.9.9",
        },
      })
    );

    const headers = new Headers(
      (fetchMock.mock.calls[0]![1] as RequestInit).headers
    );
    expect(headers.get("x-forwarded-for")).toBe("1.1.1.1");
    expect(headers.get("gk-merchant-id")).toBe("m1");
  });
});
