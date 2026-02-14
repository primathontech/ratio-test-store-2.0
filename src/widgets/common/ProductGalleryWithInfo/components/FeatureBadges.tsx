import { Image } from "@/ui/atomic";
import React from "react";

const FeatureBadges = () => {
  // Array-based approach for easy maintenance and scalability
  const features = [
    {
      id: 1,
      image:
        "https://cdn.shopify.com/s/files/1/0616/4994/4654/files/Designed-for-Indian-Hair-black.jpg?v=1729837672&width=100",
      title: "Designed for Indian Hair",
      alt: "Designed for Indian Hair",
    },
    {
      id: 2,
      image:
        "https://cdn.shopify.com/s/files/1/0616/4994/4654/files/Cruelty-Free-black.jpg?v=1729837672&width=100",
      title: "Cruelty Free",
      alt: "Cruelty Free",
    },
    {
      id: 3,
      image:
        "https://cdn.shopify.com/s/files/1/0616/4994/4654/files/Colour-Protect_Formula.jpg?v=1729837672&width=100",
      title: "Colour-Protect Formula",
      alt: "Colour-Protect Formula",
    },
  ];

  return (
    <div
      data-testid="feature-badges-container"
      className="flex flex-wrap justify-start items-center gap-4"
    >
      {features.map((feature) => (
        <div
          key={feature.id}
          data-testid={`feature-badge-${feature.id}`}
          className=""
        >
          <Image
            src={feature.image}
            alt={feature.alt}
            width={90}
            height={92}
            priority
            objectFit="cover"
          />
        </div>
      ))}
    </div>
  );
};

export default FeatureBadges;
