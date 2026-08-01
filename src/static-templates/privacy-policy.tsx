"use client";
import { useTranslation } from "@shopkit/i18n/client";
import { Header } from "@/widgets/nintarababy/Header";
import { Footer } from "@/widgets/nintarababy/Footer";
import { AnnouncementBar } from "@/widgets/nintarababy/AnnouncementBar";
import { BottomBar } from "@/widgets/nintarababy/BottomBar";

export default function PrivacyPolicyTemplate() {
  const { t, tEditable } = useTranslation();

  return (
    <div className="privacy-policy-page">
      <AnnouncementBar settings={{ variant: "v1" }} />
      <Header settings={{ variant: "v1" }} />
      <main
        className="px-[20px] md:px-[80px] py-[40px] font-[Figtree,sans-serif]"
        style={{ color: "#092a33" }}
      >
        <h1 className="text-center text-[40px] font-semibold leading-[56px] mb-[40px]">
          {t("privacy-policy.title") || "Privacy Policy"}
        </h1>
        <div className="privacy-policy-content max-w-none text-[18px] font-normal leading-[1.7]">
          {tEditable("privacy-policy.content__rich")}
        </div>
      </main>
      <Footer settings={{ variant: "v1" }} />
      <BottomBar settings={{ variant: "v1" }} />
    </div>
  );
}
