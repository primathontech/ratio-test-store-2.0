"use client";

import { useState, useEffect, useCallback } from "react";
import { CouponOffer, UseCouponsReturn } from "../../types";
import type {
  DiscountOffer,
  DiscountResponse,
} from "@/app/api/v1/discounts/route";

export const useCoupons = (): UseCouponsReturn => {
  const [coupons, setCoupons] = useState<CouponOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // eslint-disable-next-line no-restricted-syntax
      const response = await fetch("/api/v1/discounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: 1,
          limit: 10,
          status: "published",
          visibility: "always",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch coupons: ${response.status}`);
      }

      const data: DiscountResponse = await response.json();

      if (!data.success) {
        throw new Error("API returned unsuccessful response");
      }

      const transformedCoupons: CouponOffer[] = data.data.data.map(
        (discount: DiscountOffer) => ({
          id: discount.id,
          title: discount.title,
          code: discount.code,
          description: discount.description,
        })
      );

      setCoupons(transformedCoupons);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch coupons";
      setError(errorMessage);
      console.error("Error fetching coupons:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return {
    coupons,
    isLoading,
    error,
    refetch,
  };
};
