"use client";

import { useReportError } from "@shopkit/observability/react";

// Replaces the root layout when it crashes, so it brings its own <html> and styles.
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useReportError(error, "global-error");

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          color: "#4b5563",
        }}
      >
        <div>
          <h1 style={{ color: "#111827" }}>
            Our store is taking a quick pause
          </h1>
          <p>We&apos;re on it and expect things to return to normal soon.</p>
        </div>
      </body>
    </html>
  );
}
