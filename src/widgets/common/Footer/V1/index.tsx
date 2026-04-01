"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FooterProps } from "../types";

/* ------------------------------------------------------------------ */
/*  Inline SVG Icons                                                    */
/* ------------------------------------------------------------------ */

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    fill="currentColor"
    className="w-[14px] h-[14px]"
  >
    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 512 512" fill="currentColor" className="w-[14px] h-[14px]">
    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
    className="w-[14px] h-[14px]"
  >
    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
    fill="currentColor"
    className="w-[14px] h-[14px]"
  >
    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 512 512" fill="currentColor" className="w-[14px] h-[14px]">
    <path d="M464 64C490.5 64 512 85.49 512 112C512 127.1 504.9 141.3 492.8 150.4L275.2 313.6C263.8 322.1 248.2 322.1 236.8 313.6L19.2 150.4C7.113 141.3 0 127.1 0 112C0 85.49 21.49 64 48 64H464zM217.6 339.2C240.4 356.3 271.6 356.3 294.4 339.2L512 176V384C512 419.3 483.3 448 448 448H64C28.65 448 0 419.3 0 384V176L217.6 339.2z" />
  </svg>
);

const FreeShippingIcon = () => (
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
);

const EasyReturnIcon = () => (
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
);

const CODAvailableIcon = () => (
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
);

const PaymentProtectionIcon = () => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_footer_pp)">
      <path
        d="M22.0589 3.5631C18.6962 3.33874 15.4599 2.19394 12.704 0.253915C12.5014 0.0896431 12.2484 0 11.9875 0C11.7266 0 11.4737 0.0896431 11.271 0.253915C8.51504 2.19377 5.2788 3.33855 1.91608 3.5631C1.63789 3.59081 1.37985 3.72069 1.19188 3.92763C1.00391 4.13457 0.899351 4.40387 0.898438 4.68344C0.898438 19.85 11.1137 24.4627 11.5569 24.645C11.6977 24.7043 11.8475 24.7396 12 24.7495C12.1544 24.7553 12.3076 24.7191 12.4431 24.645C12.8863 24.4599 23.1016 19.85 23.1016 4.68344C23.0903 4.40293 22.9789 4.13574 22.7877 3.93023C22.5964 3.72472 22.3379 3.59449 22.0589 3.5631ZM11.975 17.688C10.8515 17.6882 9.75315 17.3552 8.81883 16.7312C7.88452 16.1073 7.1562 15.2202 6.72595 14.1824C6.2957 13.1445 6.18284 12.0023 6.40165 10.9003C6.62046 9.79833 7.1611 8.78594 7.95523 7.99117C8.74935 7.1964 9.7613 6.65493 10.8631 6.43522C11.965 6.21552 13.1072 6.32745 14.1454 6.75685C15.1837 7.18625 16.0712 7.91385 16.696 8.84766C17.3207 9.78146 17.6546 10.8795 17.6553 12.0031C17.6563 12.7496 17.51 13.489 17.2249 14.1789C16.9398 14.8688 16.5214 15.4957 15.9937 16.0238C15.466 16.5518 14.8394 16.9706 14.1496 17.2562C13.4599 17.5417 12.7215 17.6885 11.975 17.688Z"
        fill="#CECECE"
      />
      <path
        d="M13.5614 9.9007L11.2171 12.245L10.2865 11.3124C10.1859 11.2044 10.0645 11.1176 9.92968 11.0575C9.79484 10.9973 9.64926 10.9649 9.50162 10.9623C9.35399 10.9596 9.20734 10.9867 9.07042 11.042C8.9335 11.0973 8.80913 11.1796 8.70472 11.284C8.60031 11.3884 8.51801 11.5128 8.46274 11.6497C8.40746 11.7866 8.38034 11.9333 8.38299 12.0809C8.38564 12.2285 8.41802 12.3741 8.47818 12.509C8.53835 12.6438 8.62506 12.7652 8.73316 12.8657L10.428 14.5606C10.5321 14.6629 10.6559 14.7432 10.7918 14.7967C10.9277 14.8501 11.073 14.8755 11.219 14.8714C11.5115 14.8665 11.7924 14.7561 12.01 14.5606L15.1452 11.4253C15.3484 11.2178 15.4621 10.939 15.4621 10.6487C15.4621 10.3583 15.3484 10.0795 15.1452 9.87202C14.9255 9.6778 14.641 9.57301 14.3477 9.57832C14.0545 9.58363 13.774 9.69865 13.5614 9.9007Z"
        fill="#CECECE"
      />
    </g>
    <defs>
      <clipPath id="clip0_footer_pp">
        <rect width="24" height="24.75" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-[16px] h-[16px]"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const MinusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-[16px] h-[16px]"
  >
    <path d="M5 12h14" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/bbluntindia",
    Icon: FacebookIcon,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/bbluntindia",
    Icon: TwitterIcon,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/bbluntindia",
    Icon: InstagramIcon,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/c/BBLUNTIndia/videos",
    Icon: YouTubeIcon,
  },
  {
    name: "Email",
    href: "mailto:care@BBLUNT.com",
    Icon: EmailIcon,
  },
];

const navColumns = [
  {
    title: "About Us",
    links: [
      { text: "Our Story", href: "/pages/about-us" },
      { text: "Blogs", href: "/blogs/news" },
    ],
  },
  {
    title: "Useful Links",
    links: [
      { text: "Privacy Policy", href: "/pages/privacy-policy" },
      { text: "Return Policy", href: "/pages/return-policy" },
      { text: "Terms & Conditions", href: "/pages/terms-and-conditions" },
      { text: "Contact Us", href: "https://support.bblunt.com/support/home" },
      {
        text: "Request Replacement/Returns",
        href: "https://bblunt.com/apps/return_prime",
      },
    ],
  },
  {
    title: "Our Salons",
    links: [
      {
        text: "Mumbai",
        href: "https://bbluntsalons.co.in/salon-locator/",
      },
      {
        text: "Hyderabad",
        href: "https://bbluntsalons.co.in/salon-locator/",
      },
      {
        text: "Bangalore",
        href: "https://bbluntsalons.co.in/salon-locator/",
      },
      {
        text: "Gurugram",
        href: "https://bbluntsalons.co.in/salon-locator/",
      },
      {
        text: "Guwahati",
        href: "https://bbluntsalons.co.in/salon-locator/",
      },
      {
        text: "Kolkata",
        href: "https://bbluntsalons.co.in/salon-locator/",
      },
    ],
  },
  {
    title: "Categories",
    links: [
      { text: "All Products", href: "/collections/all" },
      { text: "Hair Styling", href: "/collections/hair-styling" },
      { text: "Hair Colour", href: "/collections/hair-colour" },
      { text: "Hair Care", href: "/collections/hair-care" },
    ],
  },
  {
    title: "My Account",
    links: [
      { text: "Profile", href: "/account" },
      { text: "Orders", href: "/pages/orders" },
      {
        text: "Addresses",
        href: "https://shop.bblunt.com/account/addresses",
      },
    ],
  },
];

const paymentIcons = [
  { alt: "Visa", src: "/Footer/icons/visa.svg" },
  { alt: "Mastercard", src: "/Footer/icons/master.svg" },
  { alt: "American Express", src: "/Footer/icons/american_express.svg" },
  { alt: "RuPay", src: "/Footer/icons/rupay.svg" },
  { alt: "Net Banking", src: "/Footer/icons/netbanking.svg" },
  { alt: "Google Pay", src: "/Footer/icons/google_pay.svg" },
  { alt: "Paytm", src: "/Footer/icons/paytm.svg" },
];

const trustBadges = [
  { label: "Free Shipping", Icon: FreeShippingIcon },
  { label: "Easy Return", Icon: EasyReturnIcon },
  { label: "COD Available", Icon: CODAvailableIcon },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                      */
/* ------------------------------------------------------------------ */

/** Social icon link with hover effect */
const SocialLink = ({
  href,
  name,
  Icon,
}: {
  href: string;
  name: string;
  Icon: React.FC;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={name}
    className="flex items-center justify-center w-[36px] h-[36px] rounded-[9999px] border border-[#e7e7e7] text-[#e7e7e7] hover:text-[#0089DD] hover:border-[#0089DD] transition-all duration-300"
  >
    <Icon />
  </a>
);

/** Mobile accordion column */
const AccordionColumn = ({
  title,
  links,
  isOpen,
  onToggle,
}: {
  title: string;
  links: { text: string; href: string }[];
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="border-t border-[#333333]">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-[16px] px-[15px] text-left"
      aria-expanded={isOpen}
    >
      <span className="font-[Gotham,sans-serif] text-[14px] leading-[17px] font-[700] text-[#ffffff]">
        {title}
      </span>
      <span className="text-[#ffffff]">
        {isOpen ? <MinusIcon /> : <PlusIcon />}
      </span>
    </button>
    <div
      className="overflow-hidden transition-all duration-300"
      style={{
        maxHeight: isOpen ? `${links.length * 40 + 16}px` : "0px",
        opacity: isOpen ? 1 : 0,
      }}
    >
      <ul className="flex flex-col gap-[10px] px-[15px] pb-[16px] list-none m-0 p-0">
        {links.map((link) => (
          <li key={link.text}>
            <Link
              href={link.href}
              className="font-[Gotham,sans-serif] text-[13px] leading-[20px] font-[400] text-[#e7e7e7] no-underline hover:text-[#0089DD] transition-colors duration-[250ms]"
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  V1 -- Footer                                                       */
/* ------------------------------------------------------------------ */

export const V1 = memo(function V1({ className }: FooterProps) {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenAccordion((prev) => (prev === index ? null : index));
  };

  return (
    <footer
      className={[
        "bg-[#1a1a1a] text-[#e7e7e7] font-[Gotham,sans-serif]",
        className || "",
      ].join(" ")}
    >
      {/* ============================================================ */}
      {/*  MAIN FOOTER CONTENT                                         */}
      {/* ============================================================ */}
      <div className="pt-[40px] pb-[40px] md:pt-[40px] md:pb-[40px]">
        <div className="mx-auto px-[15px] md:px-[30px] lg:px-[50px] xl:max-w-[1400px]">
          {/* -------------------------------------------------------- */}
          {/*  DESKTOP LAYOUT (lg+)                                     */}
          {/* -------------------------------------------------------- */}
          <div className="hidden lg:flex lg:gap-[40px] xl:gap-[60px]">
            {/* Left column: Logo + Social */}
            <div
              className="flex flex-col gap-[24px]"
              style={{ flex: "0 0 35%" }}
            >
              {/* Logo */}
              <Link href="/" aria-label="BBlunt Home">
                <Image
                  src="/Footer/images/logo.png"
                  alt="BBlunt"
                  width={180}
                  height={53}
                  className="w-[180px] h-auto"
                />
              </Link>
              {/* Social icons */}
              <ul className="flex items-center gap-[12px] list-none m-0 p-0">
                {socialLinks.map((social) => (
                  <li key={social.name}>
                    <SocialLink
                      href={social.href}
                      name={social.name}
                      Icon={social.Icon}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Right section: 5 Nav Columns */}
            <div className="flex flex-1 justify-between gap-[20px]">
              {navColumns.map((column) => (
                <div key={column.title} className="flex flex-col gap-[16px]">
                  <h6 className="font-[Gotham,sans-serif] text-[14px] leading-[17px] font-[700] text-[#ffffff] m-0 p-0">
                    {column.title}
                  </h6>
                  <ul className="flex flex-col gap-[10px] list-none m-0 p-0">
                    {column.links.map((link) => (
                      <li key={link.text}>
                        <Link
                          href={link.href}
                          className="font-[Gotham,sans-serif] text-[13px] leading-[20px] font-[400] text-[#e7e7e7] no-underline hover:text-[#0089DD] transition-colors duration-[250ms]"
                        >
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/*  MOBILE / TABLET LAYOUT (<lg)                             */}
          {/* -------------------------------------------------------- */}
          <div className="lg:hidden">
            {/* Logo (mobile, centered or left) */}
            <div className="mb-[20px]">
              <Link href="/" aria-label="BBlunt Home">
                <Image
                  src="/Footer/images/logo.png"
                  alt="BBlunt"
                  width={140}
                  height={41}
                  className="w-[140px] h-auto"
                />
              </Link>
            </div>

            {/* Accordion Columns */}
            {navColumns.map((column, index) => (
              <AccordionColumn
                key={column.title}
                title={column.title}
                links={column.links}
                isOpen={openAccordion === index}
                onToggle={() => handleToggle(index)}
              />
            ))}

            {/* Get the App */}
            <div className="border-t border-[#333333] pt-[20px] mt-[0px]">
              <h6 className="font-[Gotham,sans-serif] text-[14px] leading-[17px] font-[700] text-[#ffffff] mb-[16px] px-[15px]">
                Get the app
              </h6>
              <div className="flex items-center gap-[12px] px-[15px]">
                <a
                  href="https://onelink.to/zwhyy8"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on iOS"
                >
                  <Image
                    src="/Footer/images/app-store-ios.png"
                    alt="Download on iOS"
                    width={135}
                    height={40}
                    className="h-[40px] w-auto"
                  />
                </a>
                <a
                  href="https://onelink.to/zwhyy8"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on Android"
                >
                  <Image
                    src="/Footer/images/app-store-android.png"
                    alt="Download on Android"
                    width={135}
                    height={40}
                    className="h-[40px] w-auto"
                  />
                </a>
              </div>
            </div>

            {/* Trust Badges (mobile only) */}
            <div className="flex items-center justify-center gap-[24px] mt-[28px] mb-[20px]">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-[8px]"
                >
                  <badge.Icon />
                  <span className="text-[11px] leading-[14px] text-[#ffffff] font-[400] text-center">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Payment Icons (mobile) */}
            <div className="flex items-center justify-center gap-[8px] mb-[20px]">
              {paymentIcons.map((icon) => (
                <Image
                  key={icon.alt}
                  src={icon.src}
                  alt={icon.alt}
                  width={38}
                  height={24}
                  className="h-[24px] w-auto"
                />
              ))}
            </div>

            {/* Social Icons (mobile bottom) */}
            <div className="flex items-center justify-center gap-[12px] mt-[20px] mb-[16px]">
              {socialLinks.map((social) => (
                <SocialLink
                  key={`mobile-${social.name}`}
                  href={social.href}
                  name={social.name}
                  Icon={social.Icon}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  BOTTOM BAR: Copyright + Payment Protection                   */}
      {/* ============================================================ */}
      <div className="border-t border-[#333333]">
        <div className="mx-auto px-[15px] md:px-[30px] lg:px-[50px] xl:max-w-[1400px] py-[14px] flex flex-col lg:flex-row items-center justify-between gap-[12px]">
          {/* Copyright */}
          <div className="text-[12px] leading-[18px] text-[#e7e7e7] font-[400] text-center lg:text-left">
            &copy; 2026 <span>Honasa Consumer Limited</span>. All rights
            reserved.
          </div>

          {/* Desktop payment icons + protection text */}
          <div className="hidden lg:flex items-center gap-[16px]">
            <div className="flex items-center gap-[8px]">
              {paymentIcons.map((icon) => (
                <Image
                  key={`desktop-${icon.alt}`}
                  src={icon.src}
                  alt={icon.alt}
                  width={38}
                  height={24}
                  className="h-[24px] w-auto"
                />
              ))}
            </div>
            <div className="flex items-center gap-[6px] text-[#CECECE]">
              <PaymentProtectionIcon />
              <span className="text-[12px] leading-[16px] font-[400]">
                100% Payment Protection, Easy Return
              </span>
            </div>
          </div>

          {/* Mobile payment protection (shown under copyright on small screens) */}
          <div className="flex lg:hidden items-center gap-[6px] text-[#CECECE]">
            <PaymentProtectionIcon />
            <span className="text-[11px] leading-[14px] font-[400]">
              100% Payment Protection, Easy Return
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
});

export { V1 as default };
