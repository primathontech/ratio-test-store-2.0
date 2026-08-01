import { WidgetProps } from "@/widgets/types";

/**
 * A single testimonial entry
 */
export interface TestimonialItem {
  id: number;
  reviewText: string;
  reviewerName: string;
  starRating: number;
  fullStars: number;
  halfStars: number;
  cardImage: {
    src: string;
    alt: string;
  };
  product: {
    name: string;
    href: string;
    thumbnail: {
      src: string;
      alt: string;
    };
  };
}

/**
 * Testimonials widget data
 */
export interface TestimonialsData {
  heading?: string;
  subtitle?: string;
  testimonials?: TestimonialItem[];
}

/**
 * Testimonials widget settings
 */
export interface TestimonialsSettings {
  variant?: string;
  heading?: string;
  subtitle?: string;
  testimonials?: Array<{
    reviewText: string;
    reviewerName: string;
    cardImageSrc: string;
    productName: string;
    productHref: string;
    productThumbnailSrc: string;
  }>;
}

/**
 * Props for the Testimonials component
 */
export type TestimonialsProps = WidgetProps<
  TestimonialsData,
  TestimonialsSettings
>;

/**
 * Design tokens extracted from nintarababy.in testimonials section
 */
export const DESIGN_TOKENS = {
  colors: {
    sectionBackground: "#f4cfb5",
    cardBackground: "#ffffff",
    productStripBackground: "#f5ead3",
    productStripBorderTop: "rgba(0,0,0,0.05)",
    primary: "#092a33",
    subtitleText: "#1d2b2f",
    navButtonBackground: "#c49330",
    navButtonText: "#ffffff",
    cardText: "#102a33",
    arrowStroke: "#092A33",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    headingSize: "36px",
    headingSizeMobile: "28px",
    headingWeight: "700",
    subtitleSize: "18px",
    subtitleWeight: "400",
    reviewSize: "16px",
    reviewLineHeight: "1.4",
    authorSize: "14px",
    authorWeight: "700",
    productTitleSize: "14px",
    productTitleWeight: "600",
  },
  spacing: {
    sectionPaddingY: "60px",
    titleMarginBottom: "40px",
    cardGap: "16px",
  },
  dimensions: {
    cardBorderRadius: "8px",
    navButtonSize: "40px",
    productImageSize: "55px",
  },
} as const;

/** Base path for testimonial images */
export const IMAGE_BASE_PATH = "/assets/nintarababy/testimonials/images";

/**
 * Default testimonials data matching nintarababy.in
 */
export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    reviewText:
      "Very cute and they don't slip off with the constant kicks of my baby",
    reviewerName: "- Shivani",
    starRating: 5,
    fullStars: 5,
    halfStars: 0,
    cardImage: {
      src: "/assets/nintarababy/testimonials/images/testi-bg-booties.webp",
      alt: "Testimonial review",
    },
    product: {
      name: "Soft Cotton Baby Booties | Warm White",
      href: "/products/soft-cotton-baby-booties-warm-white",
      thumbnail: {
        src: "/assets/nintarababy/testimonials/images/products/booties-warm-white-110.webp",
        alt: "Soft Cotton Baby Booties | Warm White",
      },
    },
  },
  {
    id: 2,
    reviewText:
      "The quality is really good and my baby is comfortable while sleeping",
    reviewerName: "- Nivi Gova",
    starRating: 5,
    fullStars: 5,
    halfStars: 0,
    cardImage: {
      src: "/assets/nintarababy/testimonials/images/testi-bg-butter-blossoms.webp",
      alt: "Testimonial review",
    },
    product: {
      name: "Wake Me Not Swaddle\u2122 | Butter Blossoms",
      href: "/products/wake-me-not-swaddle-butter-blossoms",
      thumbnail: {
        src: "/assets/nintarababy/testimonials/images/products/butter-blossoms-110.webp",
        alt: "Wake Me Not Swaddle\u2122 | Butter Blossoms",
      },
    },
  },
  {
    id: 3,
    reviewText: "Amazing muslin towel",
    reviewerName: "- Prarthana",
    starRating: 4.5,
    fullStars: 4,
    halfStars: 1,
    cardImage: {
      src: "/assets/nintarababy/testimonials/images/testi-bg-muslin-hooded-towel.webp",
      alt: "Testimonial review",
    },
    product: {
      name: "Muslin Baby Hooded Towel | Butterscotch Stars",
      href: "/products/organic-cotton-butterscotch-stars-baby-hooded-towel",
      thumbnail: {
        src: "/assets/nintarababy/testimonials/images/products/butterscotch-stars-110.webp",
        alt: "Muslin Baby Hooded Towel | Butterscotch Stars",
      },
    },
  },
  {
    id: 4,
    reviewText:
      "Perfect for my toddler's sensitive skin. It absorbs water so quickly, dries fast, and stays fresh even after daily use.",
    reviewerName: "- Jayani",
    starRating: 4.5,
    fullStars: 4,
    halfStars: 1,
    cardImage: {
      src: "/assets/nintarababy/testimonials/images/testi-bg-hooded-towel-2.webp",
      alt: "Testimonial review",
    },
    product: {
      name: "Bamboo Baby Hooded Towel | Giraffe",
      href: "/products/baby-bamboo-hooded-towel-giraffe",
      thumbnail: {
        src: "/assets/nintarababy/testimonials/images/products/giraffe-towel-110.webp",
        alt: "Bamboo Baby Hooded Towel | Giraffe",
      },
    },
  },
  {
    id: 5,
    reviewText:
      "These sleep sacks are a lifesaver! The inverted zipper makes nighttime diaper changes so easy, and I love knowing my baby is safe and cozy.",
    reviewerName: "- Divya",
    starRating: 4.5,
    fullStars: 4,
    halfStars: 1,
    cardImage: {
      src: "/assets/nintarababy/testimonials/images/testi-bg-sleep-sack.webp",
      alt: "Testimonial review",
    },
    product: {
      name: "Baby Sleep Sack 0.5 TOG - Citrus Stripes",
      href: "/products/organic-cotton-citrus-stripes-baby-sleep-sack-0-5-tog",
      thumbnail: {
        src: "/assets/nintarababy/testimonials/images/products/citrus-stripes-sleep-sack-110.webp",
        alt: "Baby Sleep Sack 0.5 TOG - Citrus Stripes",
      },
    },
  },
  {
    id: 6,
    reviewText:
      "So soft and absorbent, absolutely love these for feeding time!",
    reviewerName: "- Manisha",
    starRating: 5,
    fullStars: 5,
    halfStars: 0,
    cardImage: {
      src: "/assets/nintarababy/testimonials/images/testi-bg-burp-cloth.webp",
      alt: "Testimonial review",
    },
    product: {
      name: "Baby Burp Cloths - Set of 6 | Playful Mix Mega Pack",
      href: "/products/baby-burp-cloths-set-of-6-mega-pack",
      thumbnail: {
        src: "/assets/nintarababy/testimonials/images/products/burp-cloths-110.webp",
        alt: "Baby Burp Cloths - Set of 6 | Playful Mix Mega Pack",
      },
    },
  },
  {
    id: 7,
    reviewText:
      "I finally feed without slouching. The lumbar support keeps my back happy even during long, sleepy sessions. I didn't realise how much I needed this until I used it.",
    reviewerName: "- Ambuja K",
    starRating: 5,
    fullStars: 5,
    halfStars: 0,
    cardImage: {
      src: "/assets/nintarababy/testimonials/images/testi-bg-feeding-pillow.webp",
      alt: "Testimonial review",
    },
    product: {
      name: "Ergopod\u2122 Baby Feeding Pillow | Purple Skies",
      href: "/products/ergopod-feeding-pillow-purple-skies",
      thumbnail: {
        src: "/assets/nintarababy/testimonials/images/products/feeding-pillow-purple-110.webp",
        alt: "Ergopod\u2122 Baby Feeding Pillow | Purple Skies",
      },
    },
  },
  {
    id: 8,
    reviewText:
      "These washcloths are soft on my baby's skin. They soak up dribbles quickly, and dry fast. I keep one in my bag and by the changing mat.",
    reviewerName: "- Swati P",
    starRating: 5,
    fullStars: 5,
    halfStars: 0,
    cardImage: {
      src: "/assets/nintarababy/testimonials/images/testi-bg-muslin-washcloth.webp",
      alt: "Testimonial review",
    },
    product: {
      name: "Muslin So-Softs\u2122 | Multipurpose Baby Washcloth - Set of 3 | Butterscotch",
      href: "/products/so-softs-muslin-washcloths-butterscotch-set-of-3",
      thumbnail: {
        src: "/assets/nintarababy/testimonials/images/products/muslin-washcloth-butterscotch-110.webp",
        alt: "Muslin So-Softs\u2122 | Multipurpose Baby Washcloth - Set of 3 | Butterscotch",
      },
    },
  },
  {
    id: 9,
    reviewText:
      "These cloths are amazing! My daughter has extremely sensitive skin, and these ones don't cause any irritation.",
    reviewerName: "- Maya S",
    starRating: 5,
    fullStars: 5,
    halfStars: 0,
    cardImage: {
      src: "/assets/nintarababy/testimonials/images/testi-bg-bamboo-washcloth.jpg",
      alt: "Testimonial review",
    },
    product: {
      name: "Bamboo So-Softs\u2122 | Multipurpose Baby Washcloth - Set of 3 | White",
      href: "/products/so-softs-bamboo-washcloths-white-pack-set-of-3",
      thumbnail: {
        src: "/assets/nintarababy/testimonials/images/products/bamboo-washcloth-white-110.webp",
        alt: "Bamboo So-Softs\u2122 | Multipurpose Baby Washcloth - Set of 3 | White",
      },
    },
  },
  {
    id: 10,
    reviewText:
      "The swaddles are super soft, and the size is perfect. We love the variety of prints in the pack!",
    reviewerName: "- Riddhi",
    starRating: 5,
    fullStars: 5,
    halfStars: 0,
    cardImage: {
      src: "/assets/nintarababy/testimonials/images/testi-bg-swaddle.webp",
      alt: "Testimonial review",
    },
    product: {
      name: "Muslin Baby Swaddle - Large | Happy Waves",
      href: "/products/organic-cotton-happy-waves-swaddle-wrap-39x39",
      thumbnail: {
        src: "/assets/nintarababy/testimonials/images/products/swaddle-happy-waves-110.webp",
        alt: "Muslin Baby Swaddle - Large | Happy Waves",
      },
    },
  },
  {
    id: 11,
    reviewText:
      "I've tried so many bibs, but these are by far the best! They're soft and the waterproof layer actually works!",
    reviewerName: "- Akshaya",
    starRating: 4,
    fullStars: 4,
    halfStars: 0,
    cardImage: {
      src: "/assets/nintarababy/testimonials/images/testi-bg-bibs.webp",
      alt: "Testimonial review",
    },
    product: {
      name: "Baby Bandana Bibs - Set of 6 | Mega Pack",
      href: "/products/organic-cotton-mega-pack-baby-bandana-bibs-set-of-6",
      thumbnail: {
        src: "/assets/nintarababy/testimonials/images/products/bibs-mega-pack-110.webp",
        alt: "Baby Bandana Bibs - Set of 6 | Mega Pack",
      },
    },
  },
];
