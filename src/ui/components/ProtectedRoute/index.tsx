"use client";

import { AccountDataProvider } from "@/widgets/common/Account/context/AccountDataContext";
import { Suspense, useLayoutEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authorized, setAuthorized] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const token = localStorage.getItem("customerAccessToken");

    if (!token) {
      window.location.replace("/");
      return;
    }

    setAuthorized(true);
  }, []);

  if (!authorized) {
    return null;
  }

  return (
    <AccountDataProvider>
      <Suspense fallback={null}>{children}</Suspense>
    </AccountDataProvider>
  );
}
