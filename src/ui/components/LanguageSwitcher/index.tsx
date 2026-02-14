"use client";

import { i18nConfig } from "@/bootstrap/i18n-config";
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/atomic";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = useCallback(
    (newLocale: string) => {
      if (newLocale === locale) {
        return;
      }

      // Fix: Set the locale cookie with proper attributes
      const cookieValue = `${i18nConfig.localeDetection.cookieName}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      document.cookie = cookieValue;

      // Fix: Force a hard refresh to ensure new locale is applied immediately
      startTransition(() => {
        setTimeout(() => {
          window.location.reload();
        }, 100);
      });
    },
    [locale]
  );

  return (
    <>
      <Label htmlFor="language-select" className="sr-only">
        Select Language
      </Label>
      <Select
        value={locale}
        onValueChange={handleLocaleChange}
        disabled={isPending}
      >
        <SelectTrigger id="language-select" className="w-[140px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {i18nConfig.locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {i18nConfig.localeNames[loc]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
