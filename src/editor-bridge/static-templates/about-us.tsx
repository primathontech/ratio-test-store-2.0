"use client";

import { useTranslation } from "@shopkit/i18n/client";

export default function AboutUsTemplate() {
  const { tEditable } = useTranslation();

  return (
    <main style={{ padding: "40px 24px", maxWidth: 800, margin: "0 auto" }}>
      <h1>{tEditable("t:about-us.title")}</h1>
      <div>{tEditable("t:about-us.content__rich")}</div>
    </main>
  );
}
