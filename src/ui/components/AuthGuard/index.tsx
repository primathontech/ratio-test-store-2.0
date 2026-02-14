"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    // Get customerAccessToken from localStorage
    const customerAccessToken = localStorage.getItem("customerAccessToken");

    // Console log the token for debugging
    console.log("customerAccessToken from localStorage:", customerAccessToken);

    // Check if token exists
    if (!customerAccessToken) {
      console.log("No customerAccessToken found, redirecting to home");
      router.push("/");
      return;
    }
  }, [router]);

  return <>{children}</>;
}
