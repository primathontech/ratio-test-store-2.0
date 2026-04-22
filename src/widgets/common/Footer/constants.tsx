"use client";

import React from "react";
import {
  FooterLink,
  PaymentMethod,
  ServiceIconItem,
  SocialLink,
} from "./types";

export const FOOTER_CONSTANTS = {
  DEFAULT_SETTINGS: {
    backgroundColor: "#000000",
    showSocialLinks: true,
    showPaymentMethods: true,
    showAppDownload: true,
    mobileFooterTagline:
      "India&apos;s Go-To Hair care - <strong>Bblunt</strong>",
  },
} as const;

export const SOCIAL_BRAND_COLORS = {
  facebook: {
    iconColor: "hover:text-[#3b5998]",
    borderColor: "hover:border-[#3b5998]",
  },
  twitter: {
    iconColor: "hover:text-[#555555]",
    borderColor: "hover:border-[#555555]",
  },
  instagram: {
    iconColor: "hover:text-[#e03566]",
    borderColor: "hover:border-[#e03566]",
  },
  youtube: {
    iconColor: "hover:text-[#cd201f]",
    borderColor: "hover:border-[#cd201f]",
  },
  pinterest: {
    iconColor: "hover:text-[#e60023]",
    borderColor: "hover:border-[#e60023]",
  },
  email: {
    iconColor: "hover:text-white",
    borderColor: "hover:border-white",
  },
} as const;

export const SOCIAL_ICONS = {
  facebook: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 320 512"
      className="fill-current transition-colors duration-300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  ),
  twitter: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 512 512"
      className="fill-current transition-colors duration-300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
    </svg>
  ),
  instagram: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 448 512"
      className="fill-current transition-colors duration-300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  ),
  youtube: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 576 512"
      className="fill-current transition-colors duration-300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
    </svg>
  ),
  email: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 512 512"
      className="fill-current transition-colors duration-300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M464 64C490.5 64 512 85.49 512 112C512 127.1 504.9 141.3 492.8 150.4L275.2 313.6C263.8 322.1 248.2 322.1 236.8 313.6L19.2 150.4C7.113 141.3 0 127.1 0 112C0 85.49 21.49 64 48 64H464zM217.6 339.2C240.4 356.3 271.6 356.3 294.4 339.2L512 176V384C512 419.3 483.3 448 448 448H64C28.65 448 0 419.3 0 384V176L217.6 339.2z" />
    </svg>
  ),
} as const;

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/bbluntindia",
    icon: "facebook",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/bbluntindia",
    icon: "twitter",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/bbluntindia",
    icon: "instagram",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/c/BBLUNTIndia/videos",
    icon: "youtube",
  },
  {
    name: "Email",
    href: "mailto:care@BBLUNT.com",
    icon: "email",
  },
];

export const DEFAULT_ABOUT_LINKS: FooterLink[] = [
  { name: "Our Story", href: "/pages/about-us" },
  { name: "Blogs", href: "/blogs/news" },
];

export const DEFAULT_USEFUL_LINKS: FooterLink[] = [
  { name: "Privacy Policy", href: "/pages/privacy-policy" },
  { name: "Return Policy", href: "/pages/return-policy" },
  { name: "Terms & Conditions", href: "/pages/terms-and-conditions" },
  { name: "Contact Us", href: "https://support.bblunt.com/support/home" },
  {
    name: "Request Replacement/Returns",
    href: "https://bblunt.com/apps/return_prime",
  },
];

export const DEFAULT_OUR_SALONS_LINKS: FooterLink[] = [
  { name: "Mumbai", href: "https://bbluntsalons.co.in/salon-locator/" },
  { name: "Hyderabad", href: "https://bbluntsalons.co.in/salon-locator/" },
  { name: "Bangalore", href: "https://bbluntsalons.co.in/salon-locator/" },
  { name: "Gurugram", href: "https://bbluntsalons.co.in/salon-locator/" },
  { name: "Guwahati", href: "https://bbluntsalons.co.in/salon-locator/" },
  { name: "Kolkata", href: "https://bbluntsalons.co.in/salon-locator/" },
];

export const DEFAULT_CATEGORIES_LINKS: FooterLink[] = [
  { name: "All Products", href: "/collections/all" },
  { name: "Hair Styling", href: "/collections/hair-styling" },
  { name: "Hair Colour", href: "/collections/hair-colour" },
  { name: "Hair Care", href: "/collections/hair-care" },
];

export const DEFAULT_MY_ACCOUNT_LINKS: FooterLink[] = [
  { name: "Profile", href: "/account" },
  { name: "Orders", href: "/pages/orders" },
  { name: "Addresses", href: "https://shop.bblunt.com/account/addresses" },
];

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { name: "Visa", icon: "visa", image: "/Footer/icons/visa.svg" },
  { name: "Mastercard", icon: "master", image: "/Footer/icons/master.svg" },
  {
    name: "American Express",
    icon: "amex",
    image: "/Footer/icons/american_express.svg",
  },
  { name: "RuPay", icon: "rupay", image: "/Footer/icons/rupay.svg" },
  {
    name: "Net Banking",
    icon: "netbanking",
    image: "/Footer/icons/netbanking.svg",
  },
  {
    name: "Google Pay",
    icon: "gpay",
    image: "/Footer/icons/google_pay.svg",
  },
  { name: "Paytm", icon: "paytm", image: "/Footer/icons/paytm.svg" },
];

export const DEFAULT_SERVICE_ICONS: ServiceIconItem[] = [
  { name: "Free Shipping", image: "" },
  { name: "Easy Return", image: "" },
  { name: "COD Available", image: "" },
];

export const SERVICE_ICON_SVGS: Record<string, React.ReactNode> = {
  "Free Shipping": (
    <svg
      width="32"
      height="23"
      viewBox="0 0 32 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M31.4977 9.9708L28.4835 5.41302C28.0038 4.69337 27.2111 4.26575 26.3454 4.26575H21.4643V2.56571C21.4643 1.14727 20.3171 0 18.8986 0H2.56571C1.14727 0 0 1.14727 0 2.56571V16.8127C0 18.2311 1.14727 19.3784 2.56571 19.3784H3.59825C3.60648 20.3338 3.99108 21.2474 4.66861 21.921C5.34614 22.5946 6.26195 22.9739 7.21736 22.9766C9.20943 22.9766 10.826 21.36 10.8365 19.3784H20.6821C20.6925 21.36 22.3091 22.9766 24.3012 22.9766C26.2933 22.9766 27.9099 21.36 27.9203 19.3784H29.3492C30.7676 19.3784 31.9149 18.2311 31.9149 16.8127V11.3892C31.9253 10.8782 31.7793 10.388 31.4977 9.9708ZM8.94869 19.368C8.93826 20.3066 8.16646 21.068 7.21736 21.068C6.26825 21.068 5.50688 20.3066 5.48602 19.368V19.3367C5.48602 18.3876 6.25782 17.6053 7.21736 17.6053C8.16646 17.6053 8.94869 18.3771 8.94869 19.3367V19.368ZM19.5766 17.4802H10.315C9.67877 16.4372 8.54193 15.728 7.22778 15.728C5.91364 15.728 4.7768 16.4372 4.14059 17.4802H2.57614C2.2111 17.4802 1.90864 17.1777 1.90864 16.8127V2.55528C1.90864 2.19024 2.2111 1.88778 2.57614 1.88778H18.9195C19.2845 1.88778 19.587 2.19024 19.587 2.55528V17.4802H19.5766ZM26.043 19.368C26.0274 19.8154 25.8387 20.2393 25.5167 20.5503C25.1947 20.8613 24.7645 21.0351 24.3169 21.0351C23.8692 21.0351 23.439 20.8613 23.117 20.5503C22.795 20.2393 22.6063 19.8154 22.5907 19.368V19.3367C22.5907 18.3876 23.3625 17.6053 24.3221 17.6053C25.2816 17.6053 26.0534 18.3771 26.0534 19.3367C26.043 19.3575 26.043 19.3575 26.043 19.368ZM30.0271 16.8127C30.0271 17.1777 29.7247 17.4802 29.3596 17.4802H27.3988C26.7626 16.4372 25.6258 15.728 24.3116 15.728C23.1539 15.728 22.1318 16.2808 21.4643 17.136V6.15352H26.3454C26.5749 6.15352 26.7835 6.26825 26.8982 6.45599L29.9124 11.0138C29.9854 11.1285 30.0271 11.2536 30.0271 11.3788V16.8127Z"
        fill="white"
      />
    </svg>
  ),
  "Easy Return": (
    <svg
      width="35"
      height="31"
      viewBox="0 0 35 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.01819 16.1805C0.824907 16.1809 0.635518 16.1261 0.472246 16.0224C0.308975 15.9188 0.178598 15.7707 0.0964158 15.5954C0.0142338 15.4202 -0.0163428 15.2251 0.00827554 15.033C0.0328938 14.841 0.111685 14.6599 0.235402 14.5112L4.80183 9.00321L10.2999 13.5559C10.4028 13.6415 10.4879 13.7466 10.5502 13.8651C10.6126 13.9837 10.651 14.1134 10.6633 14.2468C10.6756 14.3802 10.6616 14.5148 10.6219 14.6427C10.5823 14.7707 10.5179 14.8896 10.4324 14.9927C10.3474 15.0961 10.2428 15.1817 10.1246 15.2445C10.0064 15.3073 9.87705 15.3461 9.74387 15.3587C9.61068 15.3712 9.47634 15.3572 9.34856 15.3176C9.22078 15.2779 9.10209 15.2133 8.99931 15.1276L5.06896 11.8647L1.80097 15.8119C1.70658 15.9284 1.58717 16.022 1.45163 16.0858C1.3161 16.1497 1.16793 16.182 1.01819 16.1805Z"
        fill="white"
      />
      <path
        d="M19.5368 31C18.6829 31 17.8103 30.932 16.9607 30.7861C8.52964 29.3834 2.806 21.378 4.19641 12.9516L4.39894 11.3382C4.43182 11.0706 4.56913 10.8269 4.78085 10.6604C4.99258 10.494 5.26149 10.4183 5.52878 10.4498C5.79595 10.4833 6.03901 10.6214 6.20479 10.8339C6.37057 11.0465 6.44557 11.3161 6.41338 11.5839L6.21194 13.2323C5.00218 20.5895 9.97478 27.543 17.2946 28.7659C19.0366 29.0624 20.82 29.01 22.5417 28.6119C24.2634 28.2137 25.8892 27.4777 27.3252 26.4462C28.7646 25.4227 29.9869 24.1231 30.9211 22.6228C31.8553 21.1224 32.4829 19.4512 32.7675 17.7061C33.9762 10.3829 29.0047 3.44149 21.6837 2.2175C19.5644 1.86391 17.3915 2.02369 15.3464 2.68351C13.3014 3.34332 11.4438 4.48397 9.9288 6.01012C9.83558 6.10593 9.72415 6.18208 9.60108 6.23407C9.47802 6.28606 9.34581 6.31285 9.21225 6.31285C9.07869 6.31285 8.94649 6.28606 8.82342 6.23407C8.70036 6.18208 8.58893 6.10593 8.4957 6.01012C8.39976 5.91679 8.32349 5.80512 8.2714 5.68172C8.21932 5.55832 8.19248 5.42571 8.19248 5.29174C8.19248 5.15776 8.21932 5.02515 8.2714 4.90175C8.32349 4.77836 8.39976 4.66669 8.4957 4.57335C10.2412 2.81787 12.3804 1.50595 14.7349 0.746993C17.0894 -0.0119593 19.5909 -0.195935 22.0308 0.210408C30.4608 1.61208 36.1822 9.61959 34.7918 18.0439C34.4663 20.0527 33.7454 21.9768 32.6711 23.7041C31.5968 25.4314 30.1905 26.9276 28.5339 28.1056C25.8495 30.0118 22.7358 31 19.5368 31Z"
        fill="white"
      />
      <path
        d="M19.4558 22.2939L14.8324 18.5813C14.6229 18.4109 14.4889 18.1646 14.4594 17.8959C14.4299 17.6271 14.5073 17.3576 14.6748 17.1456C14.8447 16.9356 15.0905 16.8011 15.3587 16.7713C15.627 16.7416 15.8962 16.8189 16.1079 16.9866L19.1416 19.4346L25.2659 11.7835C25.4361 11.5732 25.6822 11.4388 25.9508 11.4094C26.2194 11.38 26.4887 11.4581 26.7001 11.6267C26.9083 11.7979 27.0415 12.0439 27.0711 12.3121C27.1008 12.5804 27.0246 12.8496 26.8589 13.0623L19.4558 22.2939Z"
        fill="white"
      />
    </svg>
  ),
  "COD Available": (
    <svg
      width="32"
      height="33"
      viewBox="0 0 32 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.2384 4.24482C9.33781 6.57384 5.27362 8.48395 4.20792 8.48962C0.630716 8.50948 0 10.3061 0 20.4761C0 29.1047 0.203304 30.2914 1.82879 31.1614C4.54456 32.6147 27.8971 32.4408 29.0791 30.9581C32.3263 26.8863 31.9046 13.038 28.4087 8.97283C27.5142 7.93266 25.8281 5.48639 24.6613 3.53562C23.4944 1.58579 22.0429 -0.00565848 21.4349 1.51231e-05C20.8278 0.00568873 17.139 1.9158 13.2384 4.24482ZM21.7488 1.81179C21.7488 3.02594 11.5808 8.73548 10.2238 8.28348C9.61676 8.08112 11.855 6.36013 15.1986 4.45853C22.1573 0.500238 21.7488 0.664773 21.7488 1.81179ZM24.215 5.42682C26.0683 7.86931 25.8168 8.50002 22.9866 8.50002C20.546 8.50002 20.5167 8.44329 22.2774 7.11188C24.7048 5.27552 23.3214 5.29065 19.747 7.1393C18.1773 7.95063 16.3892 8.44423 15.7745 8.2362C15.1599 8.02722 16.3589 6.9568 18.4392 5.85612C23.0774 3.40323 22.7001 3.4316 24.215 5.42682ZM29.3136 13.228C29.3136 15.8067 29.03 16.0648 26.1932 16.0648C22.5999 16.0648 20.8032 17.4832 20.8032 20.32C20.8032 23.1701 22.6037 24.5752 26.2556 24.5752C29.1709 24.5752 29.4139 24.7946 29.1396 27.1756L28.8408 29.7761H15.1296H1.4184L1.14323 21.3403C0.99099 16.7012 1.0846 12.3392 1.34937 11.6479C1.72005 10.6825 5.01641 10.3912 15.5731 10.3912H29.3136V13.228ZM30.2592 20.3768C30.2592 23.6741 30.1874 23.7374 26.8087 23.45C20.1564 22.8845 20.3909 17.0104 27.065 17.0104C30.0956 17.0104 30.2592 17.1835 30.2592 20.3768ZM23.64 20.32C23.64 21.1002 24.0655 21.7384 24.5856 21.7384C25.1057 21.7384 25.5312 21.1002 25.5312 20.32C25.5312 19.5399 25.1057 18.9016 24.5856 18.9016C24.0655 18.9016 23.64 19.5399 23.64 20.32Z"
        fill="white"
      />
    </svg>
  ),
};
