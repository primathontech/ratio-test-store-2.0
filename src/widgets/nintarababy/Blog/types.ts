import { WidgetProps } from "@/widgets/types";

/**
 * A single blog post entry
 */
export interface BlogPost {
  /** Unique id */
  id: string;
  /** Card type: primary (large left) or secondary (small right) */
  cardType: "primary" | "secondary";
  /** Post title */
  title: string;
  /** Relative URL to the full blog post */
  url: string;
  /** Category label shown in the yellow badge */
  category: string;
  /** Formatted date string (e.g. "02 Feb 2026") */
  date: string;
  /** Read time label (e.g. "6 min read") */
  readTime: string;
  /** Excerpt paragraph (truncated) */
  excerpt: string;
  /** Desktop thumbnail path (relative to /assets/nintarababy/blog/) */
  desktopImage: string;
  /** Mobile thumbnail path (relative to /assets/nintarababy/blog/) */
  mobileImage: string;
  /** Alt text for images */
  alt: string;
  /** Desktop image dimensions */
  desktopWidth: number;
  desktopHeight: number;
  /** Mobile image dimensions */
  mobileWidth: number;
  mobileHeight: number;
}

/**
 * Blog widget settings
 */
export interface BlogSettings {
  /** Widget variant @default "v1" */
  variant?: string;
  /** Section heading */
  heading?: string;
  /** "See All" link text */
  seeAllText?: string;
  /** "See All" link href */
  seeAllLink?: string;
  /** Blog posts (flat: title, url, category, date, readTime, excerpt, desktopImage, mobileImage) */
  posts?: Array<{
    title: string;
    url: string;
    category: string;
    date: string;
    readTime: string;
    excerpt: string;
    desktopImage: string;
    mobileImage: string;
  }>;
}

/**
 * Blog widget data
 */
export interface BlogData {
  posts?: BlogPost[];
}

/**
 * Props for the Blog component
 */
export type BlogProps = WidgetProps<BlogData, BlogSettings>;

/**
 * Design tokens extracted from nintarababy.in blog section
 */
export const DESIGN_TOKENS = {
  colors: {
    primary: "#092a33",
    accent: "#e5c645",
    paginationInactive: "#cccccc",
    paginationActive: "#01464f",
  },
  typography: {
    fontFamily: "Figtree, sans-serif",
    headingSize: "40px",
    headingSizeMobile: "28px",
    headingWeight: "700",
    headingLineHeight: "52px",
    headingLineHeightMobile: "36.4px",
    seeAllSize: "20px",
    seeAllWeight: "600",
    titleSize: "20px",
    titleWeight: "500",
    descriptionSize: "16px",
    badgeSize: "14px",
    dateSize: "14px",
    dateSizeMobile: "12px",
    readMoreSize: "16px",
  },
  spacing: {
    sectionPadding: "4% 0",
    wrapperMarginDesktop: "56px 0 60px",
    wrapperMarginMobile: "40px 0",
    gridGap: "32px",
    gridGapMobile: "16px",
    textGap: "12px",
    badgeGap: "16px",
    badgeGapMobile: "12px",
    durationGap: "20px",
    containerMaxWidth: "1280px",
  },
  borders: {
    imageRadius: "16px",
    badgeRadius: "4px",
  },
  effects: {
    imageHoverScale: "1.05",
    imageHoverDuration: "0.25s",
    dotTransition: "background 0.3s ease",
  },
} as const;

/**
 * Image paths for blog assets
 */
export const IMAGE_PATHS = {
  bgDesktop: "bg-desktop.webp",
  bgMobile: "bg-mobile.webp",
  blog1Desktop: "blog1-essentials-desktop.png",
  blog1Mobile: "blog1-essentials-mobile.png",
  blog2Desktop: "blog2-bath-desktop.webp",
  blog2Mobile: "blog2-bath-mobile.webp",
  blog3Desktop: "blog3-sleep-desktop.webp",
  blog3Mobile: "blog3-sleep-mobile.webp",
} as const;

/**
 * Default blog posts matching the source site
 */
export const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "nin_home_blog_01",
    cardType: "primary",
    title: "The Ultimate Go-To Baby Essentials List",
    url: "/blogs/blog/the-ultimate-go-to-baby-essentials-list",
    category: "Newborn Essentials",
    date: "02 Feb 2026",
    readTime: "6 min read",
    excerpt:
      "Getting ready for your little one is exciting, a bit chaotic, and full of tiny decisions. A handy baby essentials list keeps the guesswork low and the snuggles high. From diapers and wipes to bottles and bibs, and bathtime soaps and towels to bedtime swaddles and mattresses; from adorab...",
    desktopImage: IMAGE_PATHS.blog1Desktop,
    mobileImage: IMAGE_PATHS.blog1Mobile,
    alt: "The Ultimate Go-To Baby Essentials List",
    desktopWidth: 630,
    desktopHeight: 530,
    mobileWidth: 500,
    mobileHeight: 292,
  },
  {
    id: "nin_home_blog_02",
    cardType: "secondary",
    title: "Baby Bath Time: Tips for Bathing Baby from Newborn to Toddler",
    url: "/blogs/blog/baby-bath-time-tips-for-bathing-baby-from-newborn-to-toddler",
    category: "Baby Bathing",
    date: "23 Jan 2026",
    readTime: "6 mins read",
    excerpt:
      "Baby bath time can be one of the sweetest parts of the day \u2013 all those tiny toes, splashes, and that lovely \u201cfresh baby\u201d smell. But it can also feel a bit nerve-wracking, especially in the early weeks when your baby feels so small and delicate. Here\u2019s a gentle, practical guide to bathing your lit...",
    desktopImage: IMAGE_PATHS.blog2Desktop,
    mobileImage: IMAGE_PATHS.blog2Mobile,
    alt: "Baby Bath Time: Tips for Bathing Baby from Newborn to Toddler",
    desktopWidth: 380,
    desktopHeight: 320,
    mobileWidth: 500,
    mobileHeight: 292,
  },
  {
    id: "nin_home_blog_03",
    cardType: "secondary",
    title: "Baby Sleep from 2-12 months: What to expect",
    url: "/blogs/blog/baby-sleep-from-2-12-months-what-to-expect",
    category: "Baby Sleep",
    date: "22 Jan 2026",
    readTime: "8 mins read",
    excerpt:
      "Baby sleep between 2\u201312 months can feel like a rollercoaster. Just when you think you have understood your little one\u2019s pattern, it changes again. If you are a parent trying to juggle advice from doctors, elders, Instagram and your own instincts, it can feel overwhelming. Let\u2019s walk through what ...",
    desktopImage: IMAGE_PATHS.blog3Desktop,
    mobileImage: IMAGE_PATHS.blog3Mobile,
    alt: "Baby Sleep from 2-12 months: What to expect",
    desktopWidth: 380,
    desktopHeight: 320,
    mobileWidth: 500,
    mobileHeight: 292,
  },
];
