"use client";
import { useTranslation } from "@shopkit/i18n/client";

export default function AboutUsTemplate() {
  const { tEditable } = useTranslation();

  return (
    <main style={{ padding: "40px 24px", maxWidth: 800, margin: "0 auto" }}>
      <h1>{tEditable("t:about-us.title")}</h1>
      <p>{tEditable("t:about-us.subtitle")}</p>
      <div>{tEditable("t:about-us.content__rich")}</div>

      <section style={{ marginTop: 32 }}>
        <h2>Our Values</h2>
        {tEditable("t:about-us.values", (items) => (
          <ul>
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ))}
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Our Team</h2>
        {tEditable("t:about-us.team", (items) => (
          <div style={{ display: "flex", gap: 16 }}>
            {items.map((member: { name: string; role: string }, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                }}
              >
                <strong>{member.name}</strong>
                <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        ))}
      </section>
    </main>
  );
}
