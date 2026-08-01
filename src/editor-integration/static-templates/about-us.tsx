"use client";
import Image from "next/image";

export default function AboutUsTemplate() {
  const storyBlocks = [
    {
      imageUrl: "/nintarababy/about-us/story-1.jpg",
      imageAlt: "With You Through The Little Moments",
      heading: "With You Through The Little Moments",
      text: "Motherhood isn\u2019t made up of big milestones alone. It\u2019s the bath-time giggles, sleepy cuddles, and everyday routines that become the moments you treasure the most.\nOur products are designed to be a part of these simple daily rituals, helping make caring for your baby easier, safer, and more comforting.",
      direction: "md:flex-row",
    },
    {
      imageUrl: "/nintarababy/about-us/story-2.jpg",
      imageAlt: "One Less Thing To Worry About",
      heading: "One Less Thing To Worry About",
      text: "Being a mother means thinking about a thousand little things. Choosing safe products for your baby shouldn\u2019t be one of them.\nWith carefully tested, toxin-free formulations, The Moms Co. gives you the reassurance you need, so you can focus on what truly matters.",
      direction: "md:flex-row-reverse",
    },
    {
      imageUrl: "/nintarababy/about-us/story-3.jpg",
      imageAlt: "Our Promise",
      heading: "Our Promise",
      text: "At The Moms Co., we\u2019re here to support you as you care for your little one. So you can spend less time worrying and more time enjoying every precious moment of motherhood.",
      direction: "md:flex-row",
    },
  ];

  // Chrome (announcement bar / header / footer / bottom bar) is rendered once
  // by the root layout via renderChrome() — this template is body-only, like
  // the dynamic page templates.
  return (
    <div className="about-us-page">
      {/* Hero Banner - Full Width */}
      <section className="w-full">
        {/* Desktop Banner */}
        <Image
          src="/nintarababy/about-us/hero-banner.jpg"
          alt="About Us Banner"
          width={1920}
          height={600}
          className="w-full h-auto hidden md:block"
          priority
        />
        {/* Mobile Banner */}
        <Image
          src="/nintarababy/about-us/hero-banner-mobile.jpg"
          alt="About Us Banner"
          width={750}
          height={900}
          className="w-full h-auto md:hidden"
          priority
        />
      </section>

      {/* Our Story Section */}
      <section
        className="about-story-section w-full bg-cover bg-top bg-no-repeat"
        style={{
          backgroundImage: "url('/nintarababy/about-us/story-bg-desktop.webp')",
        }}
      >
        <div className="max-w-[1420px] mx-auto px-5 md:px-10">
          {/* Story Header */}
          <div className="text-center pt-10 md:pt-[60px]">
            <h4
              className="font-figtree text-base md:text-2xl mb-2"
              style={{ color: "#092a33" }}
            >
              Our Story
            </h4>
            <h2
              className="font-figtree font-semibold mb-8 md:mb-12"
              style={{
                fontSize: "clamp(28px, 4vw, 40px)",
                color: "#092a33",
              }}
            >
              How it All Started
            </h2>
          </div>

          {/* Story Blocks */}
          {storyBlocks.map((block, index) => (
            <div
              key={index}
              className={`flex flex-col ${block.direction} items-center justify-center gap-6 md:gap-[60px] py-6 md:py-10 ${
                index === storyBlocks.length - 1 ? "pb-10 md:pb-[60px]" : ""
              } ${index === 1 ? "pt-0 md:pt-0" : ""}`}
            >
              <div className="w-full md:w-1/2">
                <Image
                  src={block.imageUrl}
                  alt={block.imageAlt}
                  width={650}
                  height={450}
                  className="w-full h-auto rounded-sm"
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
