import { describe, it, expect, afterEach } from "bun:test";
import { osMerchantHeaders } from "./os-headers";

const ORIGINAL = process.env.NEXT_PUBLIC_MERCHANT_ID;
// Assigning undefined stores the string "undefined", which leaks into later files.
const restoreEnv = (key: string, value: string | undefined) => {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
};
afterEach(() => {
  restoreEnv("NEXT_PUBLIC_MERCHANT_ID", ORIGINAL);
});

describe("osMerchantHeaders", () => {
  it("returns gk-merchant-id when NEXT_PUBLIC_MERCHANT_ID is set", () => {
    process.env.NEXT_PUBLIC_MERCHANT_ID = "m1";
    expect(osMerchantHeaders()).toEqual({ "gk-merchant-id": "m1" });
  });

  it("returns no header when it is unset", () => {
    delete process.env.NEXT_PUBLIC_MERCHANT_ID;
    expect(osMerchantHeaders()).toEqual({});
  });
});
