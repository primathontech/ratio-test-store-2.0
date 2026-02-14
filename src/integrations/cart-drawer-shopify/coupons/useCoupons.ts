"use client";

import { useState, useEffect, useCallback } from "react";
import { CouponOffer, UseCouponsReturn } from "../types";
import { getCommerceClient } from "@/config/commerce";

const DISCOUNT_API_URL = process.env.NEXT_PUBLIC_GOKWIK_DISCOUNT_API_URL!;

export const useCoupons = (): UseCouponsReturn => {
  const [coupons, setCoupons] = useState<CouponOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const client = getCommerceClient();
      const response = await client.fetchRequest(DISCOUNT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: 1,
          limit: 10,
          status: "published",
          visibility: "always",
          merchant_id: process.env.NEXT_PUBLIC_MERCHANT_ID!,
        }),
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch coupons");
      }

      const data: any = response.data;

      // Transform API response to our simplified coupon format
      const transformedCoupons: CouponOffer[] = data.data.data.map(
        (discount: any) => ({
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
