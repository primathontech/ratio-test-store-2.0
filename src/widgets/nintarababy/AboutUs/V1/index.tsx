import Image from "next/image";
import type { AboutUsProps } from "../types";

export function V1({ settings, className }: AboutUsProps) {
  const title = settings?.title ?? "About Us";
  const bgColor = settings?.backgroundColor ?? "#fae2f0";
  const heroDesktop =
    settings?.heroDesktopImage ?? "/nintarababy/about-us/hero-banner.jpg";
  const heroMobile =
    settings?.heroMobileImage ?? "/nintarababy/about-us/hero-banner-mobile.jpg";
  const heroAlt = settings?.heroAlt ?? "About Us Banner";

  const blocks = [
    {
      image: settings?.block1Image ?? "/nintarababy/about-us/story-1.jpg",
      heading: settings?.block1Heading ?? "With You Through The Little Moments",
      text:
        settings?.block1Text ??
        "Motherhood isn\u2019t made up of big milestones alone. It\u2019s the bath-time giggles, sleepy cuddles, and everyday routines that become the moments you treasure the most.\nOur products are designed to be a part of these simple daily rituals, helping make caring for your baby easier, safer, and more comforting.",
      reverse: false,
    },
    {
      image: settings?.block2Image ?? "/nintarababy/about-us/story-2.jpg",
      heading: settings?.block2Heading ?? "One Less Thing To Worry About",
      text:
        settings?.block2Text ??
        "Being a mother means thinking about a thousand little things. Choosing safe products for your baby shouldn\u2019t be one of them.\nWith carefully tested, toxin-free formulations, The Moms Co. gives you the reassurance you need, so you can focus on what truly matters.",
      reverse: true,
    },
    {
      image: settings?.block3Image ?? "/nintarababy/about-us/story-3.jpg",
      heading: settings?.block3Heading ?? "Our Promise",
      text:
        settings?.block3Text ??
        "At The Moms Co., we\u2019re here to support you as you care for your little one. So you can spend less time worrying and more time enjoying every precious moment of motherhood.",
      reverse: false,
    },
  ];

  return (
    <div className={className}>
      {/* Hero Banner */}
      <section className="w-full">
        <Image
          src={heroDesktop}
          alt={heroAlt}
          width={1920}
          height={600}
          className="w-full h-auto hidden md:block"
          priority
        />
        <Image
          src={heroMobile}
          alt={heroAlt}
          width={750}
          height={900}
          className="w-full h-auto md:hidden"
          priority
        />
      </section>

      {/* Story Section */}
      <section className="w-full" style={{ backgroundColor: bgColor }}>
        <div className="max-w-[1420px] mx-auto px-5 md:px-10">
          <div className="text-center pt-10 md:pt-[60px]">
            <h2
              className="font-figtree font-semibold mb-8 md:mb-12"
              style={{
                fontSize: "clamp(28px, 4vw, 40px)",
                color: "#092a33",
              }}
            >
              {title}
            </h2>
          </div>

          {blocks.map((block, index) => (
            <div
              key={index}
              className={`flex flex-col ${block.reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center justify-center gap-[24px] md:gap-[60px] pt-[24px] pb-[32px] md:py-[40px] ${
                index === blocks.length - 1 ? "pb-[32px] md:pb-[60px]" : ""
              } ${index === 1 ? "md:pt-0" : ""}`}
            >
              <div className="w-full md:w-1/2">
                <Image
                  src={block.image}
                  alt={block.heading}
                  width={650}
                  height={450}
                  className="w-full h-auto rounded-[30px]"
                />
              </div>
              <div className="w-full md:w-1/2 text-center">
                <h3
                  className="font-figtree font-semibold mb-4"
                  style={{
                    fontSize: "clamp(20px, 3vw, 28px)",
                    color: "#092a33",
                  }}
                >
                  {block.heading}
                </h3>
                <p
                  className="font-figtree mx-auto whitespace-pre-line"
                  style={{
                    fontSize: "clamp(15px, 1.5vw, 18px)",
                    color: "#092a33",
                    maxWidth: "546px",
                    lineHeight: 1.7,
                  }}
                >
                  {block.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
