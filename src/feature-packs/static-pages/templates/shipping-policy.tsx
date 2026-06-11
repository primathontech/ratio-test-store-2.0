"use client";

import { useTranslation } from "@shopkit/i18n/client";

export default function ShippingPolicyTemplate() {
  const { tEditable } = useTranslation();

  return (
    <main style={{ padding: "40px 24px", maxWidth: 900, margin: "0 auto" }}>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 600,
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        {tEditable("t:shipping-policy.title")}
      </h1>
      <div style={{ fontSize: 16, lineHeight: 1.7 }}>
        {tEditable("t:shipping-policy.content__rich")}
      </div>
    </main>
  );
}
