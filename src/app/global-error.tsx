"use client";

import { useEffect } from "react";
import { captureErrorBoundaryException } from "@/lib/sentry/utils";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureErrorBoundaryException(error, "global", { flow: "rootLayout" });
  }, [error]);

  return (
    <html>
      <body>
        <h2>Something went wrong</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
