import { describe, it, expect, mock, afterEach } from "bun:test";
import { TemplateApiClient } from "./api-client";

const ORIGINAL_FETCH = globalThis.fetch;
const ORIGINAL_MID = process.env.NEXT_PUBLIC_MERCHANT_ID;
// Assigning undefined stores the string "undefined", which leaks into later files.
const restoreEnv = (key: string, value: string | undefined) => {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
};
afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
  restoreEnv("NEXT_PUBLIC_MERCHANT_ID", ORIGINAL_MID);
});

describe("TemplateApiClient.fetchTemplate", () => {
  it("sends gk-merchant-id so the gateway can rate-limit per merchant", async () => {
    process.env.NEXT_PUBLIC_MERCHANT_ID = "m1";
    const fetchMock = mock(async () =>
      Response.json({ data: { pageConfig: {} } })
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await new TemplateApiClient()
      .fetchTemplate("dawn", "home")
      .catch(() => undefined);

    const init = fetchMock.mock.calls[0]![1] as RequestInit;
    expect(new Headers(init.headers).get("gk-merchant-id")).toBe("m1");
  });
});
