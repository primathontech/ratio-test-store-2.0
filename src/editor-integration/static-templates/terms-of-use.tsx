"use client";
import { useTranslation } from "@shopkit/i18n/client";

export default function TermsOfUseTemplate() {
  const { t, tEditable } = useTranslation();

  // Chrome (announcement bar / header / footer / bottom bar) is rendered once
  // by the root layout via renderChrome() — this template is body-only, like
  // the dynamic page templates.
  return (
    <div className="terms-of-use-page">
      <main
        className="px-[20px] md:px-[80px] py-[40px] font-avenir"
        style={{ color: "#092a33" }}
      >
        <h1 className="text-center text-[40px] font-semibold leading-[56px] mb-[40px]">
          {t("terms-of-use.title") || "Terms of Use"}
        </h1>
        <div className="privacy-policy-content max-w-none text-[18px] font-normal leading-[1.7]">
          {tEditable("terms-of-use.content__rich")}
        </div>
      </main>
    </div>
  );
}
