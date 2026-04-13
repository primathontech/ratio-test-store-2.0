"use client";

import { AnnouncementBar } from "@/widgets/common/AnnouncementBar";
import { Header } from "@/widgets/common/Header";
import { AboutUsHero } from "@/widgets/common/AboutUsHero";
import { AboutUsStory } from "@/widgets/common/AboutUsStory";
import { AboutUsValues } from "@/widgets/common/AboutUsValues";
import { Footer } from "@/widgets/common/Footer";

export default function AboutUsTemplate() {
  return (
    <>
      <AnnouncementBar
        settings={{
          variant: "v1",
          backgroundColor: "#000000",
          textColor: "#ffffff",
          speed: 35,
          pauseOnHover: true,
          items: [
            {
              text: "Buy 3 Products at \u20B9799 | Use code : <strong>FLAT3</strong>",
              href: "/pages/flat3",
            },
            {
              text: "Shop for \u20B9499 & Get 2 Best Sellers FREE | Code : <strong>FREEIM</strong>",
              href: "/pages/shine-squad-weekly-offer",
            },
          ],
        }}
      />
      <Header
        settings={{
          variant: "v1",
          logoSrc: "/Header/images/logo.png",
          logoAlt: "BBlunt",
          searchPlaceholder: "Search For Conditioner, Shampoo...",
          cartHref: "/cart",
          accountHref: "/account",
        }}
      />
      <main>
        <div className="px-[20px] pt-[20px] pb-[20px]">
          <AboutUsHero
            settings={{
              variant: "v1",
              imageSrc:
                "https://cdn.shopify.com/s/files/1/0616/4994/4654/files/About-us.jpg?v=1729494426",
              imageAlt: "About Us Banner",
              href: "/products",
              imageWidth: 1522,
              imageHeight: 476,
            }}
          />
        </div>
        <AboutUsStory
          settings={{
            variant: "v1",
            textColor: "#1d1d1d",
            dividerColor: "#000000",
          }}
        />
        <AboutUsValues
          settings={{
            variant: "v1",
            headingColor: "#1d1d1d",
            bodyColor: "#4a4a4a",
          }}
        />
      </main>
      <Footer settings={{ variant: "v1" }} />
    </>
  );
}
