import Link from "next/link";
import { AnnouncementBar } from "@/widgets/common/AnnouncementBar";
import { Header } from "@/widgets/common/Header";
import { Footer } from "@/widgets/common/Footer";
import commonMessages from "@/themes/bblunt-2/locales/common/en.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const c = commonMessages.common as any;

const { get_app, ...headerFlat } = c.header;

const announcementSettings = {
  variant: "v1",
  backgroundColor: "#000000",
  textColor: "#ffffff",
  speed: 35,
  pauseOnHover: true,
  items: c.announcement_bar__rich,
};

const headerSettings = {
  variant: "v1",
  ...headerFlat,
  getApp_title: get_app.title,
  getApp_description: get_app.description,
  getApp_button_text: get_app.button_text,
  getApp_logo_alt: get_app.logo_alt,
  getApp_logo_url: get_app.logo_url,
  getApp_app_url: get_app.app_url,
};

const footerSettings = {
  variant: "v1",
  ...c.footer,
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar settings={announcementSettings} />
      <Header settings={headerSettings} />
      <main className="flex-1 w-full flex justify-center px-[15px] pb-14 md:pb-[63px] xl:pb-[75px] pt-[75px] md:pt-[85px] xl:pt-[100px]">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-[24px] md:text-[40px] xl:text-[120px] font-normal text-black tracking-tight mb-[35px] md:mb-[50px] xl:mb-[72px] mt-1">
            404
          </h1>
          <h2 className="text-[22px] md:text-[28px] xl:text-[32px] font-normal text-black">
            Oops...That link is broken.
          </h2>
          <p className="mt-2 md:mt-3 text-[14px] text-[#545454]">
            Sorry for the inconvenience. Go to our homepage to check out our
            latest collections.
          </p>
          <Link
            href="/collections/all"
            className="inline-flex items-center justify-center mt-4 md:mt-[22px] xl:mt-[38px] px-6 py-[12.5px] rounded-[10px] bg-black text-white font-normal transition-colors text-[14px]"
          >
            Shop now
          </Link>
        </div>
      </main>
      <Footer settings={footerSettings} />
    </div>
  );
}
