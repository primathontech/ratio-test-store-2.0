"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  fireUserEngagementEvent,
  clearKwikpassAuthStorage,
  KWIKPASS_TOKEN_KEYS,
} from "./utils";
import { useAuth } from "@shopkit/core/context";

// Constants
const DROPDOWN_WIDTH = 172;
const DROPDOWN_OFFSET = 100;

// Types
interface IconProps {
  className?: string;
}

interface KwikPassLogoProps {
  width?: string;
  height?: string;
  currentColor?: string;
}

interface DropdownMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<IconProps>;
  testId: string;
  path?: string;
  onClick?: () => void;
}
declare global {
  interface Window {
    handleCustomLogin?: (param: boolean) => void;
  }
}

const OrderHistoryIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="14"
    fill="none"
    viewBox="0 0 15 14"
    className={className}
  >
    <path
      fill="#7C4D9B"
      d="M9.545.002c.48 0 .95.136 1.364.395.415.258.76.63.999 1.079.24.448.365.956.365 1.473 0 .518-.126 1.026-.366 1.474H15v1.473h-1.364v7.367a.768.768 0 01-.2.521.657.657 0 01-.482.216H2.045a.657.657 0 01-.482-.216.768.768 0 01-.2-.52V5.895H0V4.422l3.093.001a3.153 3.153 0 01-.306-2.095A2.974 2.974 0 013.862.554 2.577 2.577 0 015.76.019 2.669 2.669 0 017.5 1c.255-.314.57-.566.922-.738.353-.172.735-.26 1.122-.26zM8.182 5.896H6.818v7.367h1.364V5.896zm-2.727-4.42c-.353 0-.691.149-.944.413a1.53 1.53 0 00-.416 1.005c-.013.38.11.751.345 1.035.234.284.561.46.912.489l.103.004h1.363V2.95c0-.352-.116-.693-.329-.96a1.34 1.34 0 00-.828-.497l-.105-.013-.102-.004zm4.09 0c-.344 0-.675.14-.927.393-.252.252-.407.599-.433.97l-.003.11v1.473h1.363c.344 0 .676-.14.928-.393s.406-.599.432-.97l.004-.11c0-.39-.144-.766-.4-1.042a1.314 1.314 0 00-.964-.432z"
    ></path>
  </svg>
);

const WalletIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="12"
    fill="none"
    viewBox="0 0 14 12"
    className={className}
  >
    <path
      fill="#7C4D9B"
      d="M11.756.438c.432 0 .813.38.813.812 0 .457-.381.813-.813.813H2.413a.418.418 0 00-.407.406c0 .228.178.406.407.406h9.343c.889 0 1.625.736 1.625 1.625v5.688a1.62 1.62 0 01-1.625 1.624h-9.75c-.914 0-1.625-.71-1.625-1.624V2.062c0-.888.711-1.624 1.625-1.624h9.75zm-.812 7.718a.818.818 0 00.812-.812.835.835 0 00-.812-.813.818.818 0 00-.813.813c0 .457.356.812.813.812z"
    ></path>
  </svg>
);

const UserIcon = ({ className }: IconProps) => (
  <img
    src="/ratio/images/static/user_icon.svg"
    alt="User"
    width="19"
    height="22"
    className={className}
  />
);

const AddressBookIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="13"
    fill="none"
    viewBox="0 0 12 13"
    className={className}
  >
    <path
      fill="#7C4D9B"
      d="M8.16 5.28a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0zM12 .96v10.56a.96.96 0 01-.96.96H2.4a.96.96 0 01-.96-.96v-1.44H.48a.48.48 0 010-.96h.96v-2.4H.48a.48.48 0 110-.96h.96v-2.4H.48a.48.48 0 110-.96h.96V.96A.96.96 0 012.4 0h8.64a.96.96 0 01.96.96zM9.984 8.352A4.073 4.073 0 008.34 7.051a2.4 2.4 0 10-3.236 0 4.073 4.073 0 00-1.648 1.301.48.48 0 10.768.576 3.12 3.12 0 014.992 0 .48.48 0 00.768-.576z"
    ></path>
  </svg>
);

const LogOutIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    fill="none"
    viewBox="0 0 10 10"
    className={className}
  >
    <path
      fill="#7C4D9B"
      d="M1.878 1.029h3.086a.516.516 0 00.514-.515A.516.516 0 004.964 0H1.878C1.312 0 .849.463.849 1.029v7.2c0 .566.463 1.03 1.029 1.03h3.086a.516.516 0 00.514-.515.516.516 0 00-.514-.515H1.878v-7.2z"
    ></path>
    <path
      fill="#7C4D9B"
      d="M9.927 4.449L8.492 3.014a.258.258 0 00-.442.18v.92h-3.6a.516.516 0 00-.515.515c0 .283.232.514.515.514h3.6v.921c0 .231.278.345.437.18l1.435-1.435a.253.253 0 00.005-.36z"
    ></path>
  </svg>
);

// Icon components based on provided SVGs
const MyProfileIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
  >
    <path d="M6.24228 9.14472H4.0476C2.44803 9.14472 1.14598 7.84266 1.14598 6.24233V4.04842C1.14598 2.44961 2.44803 1.14759 4.0476 1.14759H6.24228C7.84185 1.14759 9.1439 2.44964 9.1439 4.04842V6.24229C9.14387 7.84266 7.84185 9.14472 6.24228 9.14472ZM4.0476 2.73864C3.32513 2.73864 2.73702 3.32594 2.73702 4.04845V6.24233C2.73702 6.96481 3.32513 7.55371 4.0476 7.55371H6.24228C6.96476 7.55371 7.55286 6.96484 7.55286 6.24233V4.04842C7.55286 3.32594 6.96476 2.7386 6.24228 2.7386L4.0476 2.73864ZM15.9866 9.14472H13.7912C12.1916 9.14472 10.8903 7.84266 10.8903 6.24233V4.04842C10.8903 2.44961 12.1916 1.14759 13.7912 1.14759H15.9866C17.5862 1.14759 18.8874 2.44961 18.8874 4.04842V6.24229C18.8874 7.84266 17.5862 9.14472 15.9866 9.14472ZM13.7911 2.73864C13.0686 2.73864 12.4813 3.32594 12.4813 4.04845V6.24233C12.4813 6.96481 13.0686 7.55371 13.7911 7.55371H15.9866C16.709 7.55371 17.2964 6.96484 17.2964 6.24233V4.04842C17.2964 3.32594 16.7091 2.7386 15.9866 2.7386L13.7911 2.73864ZM6.24228 18.8525H4.0476C2.44803 18.8525 1.14598 17.5505 1.14598 15.9517V13.7562C1.14598 12.1574 2.44803 10.8554 4.0476 10.8554H6.24228C7.84185 10.8554 9.1439 12.1575 9.1439 13.7562V15.9517C9.14387 17.5505 7.84185 18.8525 6.24228 18.8525ZM4.0476 12.4464C3.32513 12.4464 2.73702 13.0337 2.73702 13.7562V15.9517C2.73702 16.6742 3.32513 17.2615 4.0476 17.2615H6.24228C6.96476 17.2615 7.55286 16.6742 7.55286 15.9517V13.7562C7.55286 13.0338 6.96476 12.4464 6.24228 12.4464H4.0476ZM15.9866 18.8525H13.7912C12.1916 18.8525 10.8903 17.5505 10.8903 15.9517V13.7562C10.8903 12.1574 12.1916 10.8554 13.7912 10.8554H15.9866C17.5862 10.8554 18.8874 12.1575 18.8874 13.7562V15.9517C18.8874 17.5505 17.5862 18.8525 15.9866 18.8525ZM13.7911 12.4464C13.0686 12.4464 12.4813 13.0337 12.4813 13.7562V15.9517C12.4813 16.6742 13.0686 17.2615 13.7911 17.2615H15.9866C16.709 17.2615 17.2964 16.6742 17.2964 15.9517V13.7562C17.2964 13.0338 16.7091 12.4464 15.9866 12.4464H13.7911Z"></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.24228 9.29223H4.0476C2.36652 9.29223 0.998437 7.9241 0.998437 6.2423V4.04839C0.998437 2.36807 2.36658 1.00002 4.0476 1.00002H6.24228C7.92331 1.00002 9.29144 2.36811 9.29144 4.04839V6.24227C9.29141 7.92409 7.92336 9.29223 6.24228 9.29223ZM4.0476 2.88615C3.4065 2.88615 2.88457 3.40752 2.88457 4.04843V6.2423C2.88457 6.88342 3.40673 7.40614 4.0476 7.40614H6.24228C6.88316 7.40614 7.40532 6.88345 7.40532 6.2423V4.04839C7.40532 3.40751 6.88338 2.88612 6.24228 2.88612L4.0476 2.88615ZM15.9866 9.29223H13.7912C12.11 9.29223 10.7428 7.92405 10.7428 6.2423V4.04839C10.7428 2.36813 12.1101 1.00002 13.7912 1.00002H15.9866C17.6677 1.00002 19.035 2.36813 19.035 4.04839V6.24227C19.035 7.92404 17.6677 9.29223 15.9866 9.29223ZM13.7911 2.88615C13.1501 2.88615 12.6288 3.4074 12.6288 4.04843V6.2423C12.6288 6.88353 13.1503 7.40614 13.7911 7.40614H15.9866C16.6273 7.40614 17.1488 6.88356 17.1488 6.2423V4.04839C17.1488 3.4074 16.6276 2.88612 15.9866 2.88612L13.7911 2.88615ZM6.24228 19H4.0476C2.36658 19 0.998437 17.632 0.998437 15.9517V13.7562C0.998437 12.0759 2.36658 10.7078 4.0476 10.7078H6.24228C7.92331 10.7078 9.29144 12.0759 9.29144 13.7562V15.9517C9.29141 17.632 7.92331 19 6.24228 19ZM4.0476 12.5939C3.4065 12.5939 2.88457 13.1153 2.88457 13.7562V15.9517C2.88457 16.5925 3.4065 17.1139 4.0476 17.1139H6.24228C6.88339 17.1139 7.40532 16.5926 7.40532 15.9517V13.7562C7.40532 13.1153 6.88338 12.5939 6.24228 12.5939H4.0476ZM15.9866 19H13.7912C12.1101 19 10.7428 17.6319 10.7428 15.9517V13.7562C10.7428 12.076 12.1101 10.7078 13.7912 10.7078H15.9866C17.6677 10.7078 19.035 12.076 19.035 13.7562V15.9517C19.035 17.6319 17.6677 19 15.9866 19ZM13.7911 12.5939C13.1501 12.5939 12.6288 13.1152 12.6288 13.7562V15.9517C12.6288 16.5927 13.1501 17.1139 13.7911 17.1139H15.9866C16.6276 17.1139 17.1488 16.5927 17.1488 15.9517V13.7562C17.1488 13.1152 16.6276 12.5939 15.9866 12.5939H13.7911ZM4.0476 9.14472H6.24228C7.84185 9.14472 9.14387 7.84266 9.1439 6.24229V4.04842C9.1439 2.44964 7.84185 1.14759 6.24228 1.14759H4.0476C2.44803 1.14759 1.14598 2.44961 1.14598 4.04842V6.24233C1.14598 7.84266 2.44803 9.14472 4.0476 9.14472ZM2.73702 4.04845C2.73702 3.32594 3.32513 2.73864 4.0476 2.73864L6.24228 2.7386C6.96476 2.7386 7.55286 3.32594 7.55286 4.04842V6.24233C7.55286 6.96484 6.96476 7.55371 6.24228 7.55371H4.0476C3.32513 7.55371 2.73702 6.96481 2.73702 6.24233V4.04845ZM13.7912 9.14472H15.9866C17.5862 9.14472 18.8874 7.84266 18.8874 6.24229V4.04842C18.8874 2.44961 17.5862 1.14759 15.9866 1.14759H13.7912C12.1916 1.14759 10.8903 2.44961 10.8903 4.04842V6.24233C10.8903 7.84266 12.1916 9.14472 13.7912 9.14472ZM12.4813 4.04845C12.4813 3.32594 13.0686 2.73864 13.7911 2.73864L15.9866 2.7386C16.7091 2.7386 17.2964 3.32594 17.2964 4.04842V6.24233C17.2964 6.96484 16.709 7.55371 15.9866 7.55371H13.7911C13.0686 7.55371 12.4813 6.96481 12.4813 6.24233V4.04845ZM4.0476 18.8525H6.24228C7.84185 18.8525 9.14387 17.5505 9.1439 15.9517V13.7562C9.1439 12.1575 7.84185 10.8554 6.24228 10.8554H4.0476C2.44803 10.8554 1.14598 12.1574 1.14598 13.7562V15.9517C1.14598 17.5505 2.44803 18.8525 4.0476 18.8525ZM2.73702 13.7562C2.73702 13.0337 3.32513 12.4464 4.0476 12.4464H6.24228C6.96476 12.4464 7.55286 13.0338 7.55286 13.7562V15.9517C7.55286 16.6742 6.96476 17.2615 6.24228 17.2615H4.0476C3.32513 17.2615 2.73702 16.6742 2.73702 15.9517V13.7562ZM13.7912 18.8525H15.9866C17.5862 18.8525 18.8874 17.5505 18.8874 15.9517V13.7562C18.8874 12.1575 17.5862 10.8554 15.9866 10.8554H13.7912C12.1916 10.8554 10.8903 12.1574 10.8903 13.7562V15.9517C10.8903 17.5505 12.1916 18.8525 13.7912 18.8525ZM12.4813 13.7562C12.4813 13.0337 13.0686 12.4464 13.7911 12.4464H15.9866C16.7091 12.4464 17.2964 13.0338 17.2964 13.7562V15.9517C17.2964 16.6742 16.709 17.2615 15.9866 17.2615H13.7911C13.0686 17.2615 12.4813 16.6742 12.4813 15.9517V13.7562Z"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.24228 9.39223H4.0476C2.31128 9.39223 0.898438 7.97931 0.898438 6.2423V4.04839C0.898438 2.31283 2.31137 0.900024 4.0476 0.900024H6.24228C7.97852 0.900024 9.39144 2.31286 9.39144 4.04839V6.24227C9.39141 7.9793 7.97861 9.39223 6.24228 9.39223ZM4.0476 2.98615C3.46165 2.98615 2.98457 3.46282 2.98457 4.04843V6.2423C2.98457 6.82826 3.46203 7.30614 4.0476 7.30614H6.24228C6.82785 7.30614 7.30532 6.82829 7.30532 6.2423V4.04839C7.30532 3.46281 6.82823 2.98612 6.24228 2.98612L4.0476 2.98615ZM15.9866 9.39223H13.7912C12.0547 9.39223 10.6428 7.97922 10.6428 6.2423V4.04839C10.6428 2.31292 12.0548 0.900024 13.7912 0.900024H15.9866C17.7229 0.900024 19.135 2.31292 19.135 4.04839V6.24227C19.135 7.97922 17.723 9.39223 15.9866 9.39223ZM13.7911 2.98615C13.2054 2.98615 12.7288 3.46263 12.7288 4.04843V6.2423C12.7288 6.82845 13.2057 7.30614 13.7911 7.30614H15.9866C16.5719 7.30614 17.0488 6.82848 17.0488 6.2423V4.04839C17.0488 3.46263 16.5724 2.98612 15.9866 2.98612L13.7911 2.98615ZM6.24228 19.1H4.0476C2.31137 19.1 0.898438 17.6872 0.898438 15.9517V13.7562C0.898438 12.0207 2.31137 10.6078 4.0476 10.6078H6.24228C7.97852 10.6078 9.39144 12.0207 9.39144 13.7562V15.9517C9.39141 17.6872 7.97852 19.1 6.24228 19.1ZM4.0476 12.6939C3.46165 12.6939 2.98457 13.1706 2.98457 13.7562V15.9517C2.98457 16.5372 3.46165 17.0139 4.0476 17.0139H6.24228C6.82823 17.0139 7.30532 16.5373 7.30532 15.9517V13.7562C7.30532 13.1706 6.82823 12.6939 6.24228 12.6939H4.0476ZM15.9866 19.1H13.7912C12.0548 19.1 10.6428 17.6871 10.6428 15.9517V13.7562C10.6428 12.0207 12.0548 10.6078 13.7912 10.6078H15.9866C17.7229 10.6078 19.135 12.0208 19.135 13.7562V15.9517C19.135 17.6871 17.7229 19.1 15.9866 19.1ZM13.7911 12.6939C13.2054 12.6939 12.7288 13.1704 12.7288 13.7562V15.9517C12.7288 16.5374 13.2053 17.0139 13.7911 17.0139H15.9866C16.5723 17.0139 17.0488 16.5374 17.0488 15.9517V13.7562C17.0488 13.1705 16.5724 12.6939 15.9866 12.6939H13.7911ZM4.0476 9.29223H6.24228C7.92336 9.29223 9.29141 7.92409 9.29144 6.24227V4.04839C9.29144 2.36811 7.92331 1.00002 6.24228 1.00002H4.0476C2.36658 1.00002 0.998437 2.36807 0.998437 4.04839V6.2423C0.998437 7.9241 2.36652 9.29223 4.0476 9.29223ZM2.88457 4.04843C2.88457 3.40752 3.4065 2.88615 4.0476 2.88615L6.24228 2.88612C6.88338 2.88612 7.40532 3.40751 7.40532 4.04839V6.2423C7.40532 6.88345 6.88316 7.40614 6.24228 7.40614H4.0476C3.40673 7.40614 2.88457 6.88342 2.88457 6.2423V4.04843ZM13.7912 9.29223H15.9866C17.6677 9.29223 19.035 7.92404 19.035 6.24227V4.04839C19.035 2.36813 17.6677 1.00002 15.9866 1.00002H13.7912C12.1101 1.00002 10.7428 2.36813 10.7428 4.04839V6.2423C10.7428 7.92405 12.11 9.29223 13.7912 9.29223ZM12.6288 4.04843C12.6288 3.4074 13.1501 2.88615 13.7911 2.88615L15.9866 2.88612C16.6276 2.88612 17.1488 3.4074 17.1488 4.04839V6.2423C17.1488 6.88356 16.6273 7.40614 15.9866 7.40614H13.7911C13.1503 7.40614 12.6288 6.88353 12.6288 6.2423V4.04843ZM4.0476 19H6.24228C7.92331 19 9.29141 17.632 9.29144 15.9517V13.7562C9.29144 12.0759 7.92331 10.7078 6.24228 10.7078H4.0476C2.36658 10.7078 0.998437 12.0759 0.998437 13.7562V15.9517C0.998437 17.632 2.36658 19 4.0476 19ZM2.88457 13.7562C2.88457 13.1153 3.4065 12.5939 4.0476 12.5939H6.24228C6.88338 12.5939 7.40532 13.1153 7.40532 13.7562V15.9517C7.40532 16.5926 6.88339 17.1139 6.24228 17.1139H4.0476C3.4065 17.1139 2.88457 16.5925 2.88457 15.9517V13.7562ZM13.7912 19H15.9866C17.6677 19 19.035 17.6319 19.035 15.9517V13.7562C19.035 12.076 17.6677 10.7078 15.9866 10.7078H13.7912C12.1101 10.7078 10.7428 12.076 10.7428 13.7562V15.9517C10.7428 17.6319 12.1101 19 13.7912 19ZM12.6288 13.7562C12.6288 13.1152 13.1501 12.5939 13.7911 12.5939H15.9866C16.6276 12.5939 17.1488 13.1152 17.1488 13.7562V15.9517C17.1488 16.5927 16.6276 17.1139 15.9866 17.1139H13.7911C13.1501 17.1139 12.6288 16.5927 12.6288 15.9517V13.7562Z"
    ></path>
  </svg>
);
const MyHistoryIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${className || ""}`}
  >
    <path
      d="M4.6 2.20033L3.3 3.93366C3.04251 4.27697 2.91377 4.44863 2.91676 4.59232C2.91936 4.71736 2.97799 4.83462 3.07646 4.91172C3.18962 5.00032 3.40419 5.00032 3.83333 5.00032H16.1667C16.5958 5.00032 16.8104 5.00032 16.9235 4.91172C17.022 4.83462 17.0806 4.71736 17.0832 4.59232C17.0862 4.44863 16.9575 4.27697 16.7 3.93366L15.4 2.20033M4.6 2.20033C4.74667 2.00477 4.82 1.90699 4.91294 1.83647C4.99525 1.77401 5.08846 1.72741 5.18782 1.69903C5.3 1.66699 5.42222 1.66699 5.66667 1.66699H14.3333C14.5778 1.66699 14.7 1.66699 14.8122 1.69903C14.9115 1.72741 15.0047 1.77401 15.0871 1.83647C15.18 1.90699 15.2533 2.00477 15.4 2.20033M4.6 2.20033L3.03333 4.28921C2.83545 4.55306 2.73651 4.68498 2.66625 4.83026C2.6039 4.95917 2.55843 5.09559 2.53096 5.23612C2.5 5.3945 2.5 5.55941 2.5 5.88921L2.5 15.667C2.5 16.6004 2.5 17.0671 2.68166 17.4236C2.84144 17.7372 3.09641 17.9922 3.41002 18.152C3.76654 18.3337 4.23325 18.3337 5.16667 18.3337L14.8333 18.3337C15.7668 18.3337 16.2335 18.3337 16.59 18.152C16.9036 17.9922 17.1586 17.7372 17.3183 17.4236C17.5 17.0671 17.5 16.6004 17.5 15.667V5.88921C17.5 5.55941 17.5 5.3945 17.469 5.23613C17.4416 5.09559 17.3961 4.95918 17.3338 4.83026C17.2635 4.68498 17.1646 4.55306 16.9667 4.28921L15.4 2.20033M13.3333 8.33366C13.3333 9.21771 12.9821 10.0656 12.357 10.6907C11.7319 11.3158 10.8841 11.667 10 11.667C9.11594 11.667 8.2681 11.3158 7.64298 10.6907C7.01786 10.0656 6.66667 9.21771 6.66667 8.33366"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    ></path>
  </svg>
);
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-sm font-bold justify-center mx-4 rounded  text-gray-700"
  >
    <path
      d="M15 6.66667L18.3334 10M18.3334 10L15 13.3333M18.3334 10H7.50002M12.5 3.50337C11.4377 2.86523 10.2044 2.5 8.88891 2.5C4.90019 2.5 1.66669 5.85786 1.66669 10C1.66669 14.1421 4.90019 17.5 8.88891 17.5C10.2044 17.5 11.4377 17.1348 12.5 16.4966"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const Close = ({ currentColor = "#374151" }) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="border border-[#374151] rounded-full w-[23px] h-[23px] md:w-[23px] md:h-[23px] px-[1px] py-[1px]"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke={currentColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const KwikPassLogo: React.FC<KwikPassLogoProps> = ({
  width = "19",
  height = "22",
  currentColor = "black",
}) => {
  return (
    <img
      src="/ratio/images/static/user_icon.svg"
      alt="User"
      width={width}
      height={height}
      style={{ color: currentColor }}
    />
  );
};
// Dropdown Menu Component (unchanged)
interface DropdownMenuProps {
  items: DropdownMenuItem[];
  position: { top: number; left: number };
  onClose: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  onItemClick?: (item: DropdownMenuItem) => void;
  onLogout?: () => void;
  showLogout?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  position,
  onClose,
  onItemClick,
  dropdownRef,
  onLogout,
  showLogout = false,
}) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  const handleItemClick = useCallback(
    (item: DropdownMenuItem) => {
      item.onClick?.();
      onItemClick?.(item);
      onClose();
    },
    [onClose, onItemClick]
  );

  if (typeof window === "undefined") {
    return null;
  }

  // Render dropdown relative to the parent container (no portal needed)
  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 md:right-[25px] p-4 overflow-hidden rounded-b-[8px] border w-[170px] h-[140px] border-gray-100 mt-6 md:mt-4 bg-white shadow-[0_0_30px_rgba(0,0,0,0.3)]"
      style={{
        width: `${DROPDOWN_WIDTH}`,
        zIndex: 99999,
        transform: "translateX(30px)",
        marginTop: "21px",
      }}
      // onKeyDown={handleKeyDown}
      // tabIndex={-1}
      // role="menu"
      // aria-orientation="vertical"
      data-testid="dropdown-menu"
    >
      <div className="flex flex-col  justify-center h-full space-y-4">
        {items.map((item) => (
          <button
            key={item.id}
            className="flex items-center gap-2 text-sm text-black"
            onClick={() => handleItemClick(item)}
            data-testid={item.testId}
            role="menuitem"
          >
            <item.icon className="" />
            {item.label}
          </button>
        ))}
        {showLogout && onLogout && (
          <button
            id="logout"
            className="flex items-center text-sm  justify-center w-full p-2 border border-gray-300 rounded text-gray-700 mt-4"
            aria-label="Logout"
            onClick={() => {
              onLogout();
              onClose();
            }}
            data-test-id="logout-button"
          >
            Logout
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};
// Menu Items Configuration (unchanged)
const LOGGED_OUT_MENU_ITEMS: DropdownMenuItem[] = [
  {
    id: "login",
    label: "",
    icon: UserIcon,
    testId: "login-option-3",
  },
];

const LOGGED_IN_MENU_ITEMS: DropdownMenuItem[] = [
  {
    id: "account",
    label: "Your Profile",
    icon: MyProfileIcon,
    testId: "account-option-1",
    path: "/account",
  },
  {
    id: "order-history",
    label: "Order History",
    icon: MyHistoryIcon,
    testId: "account-option-2",
    path: "/pages/orders",
  },
];

/**
 * Check if device is touch enabled (mobile/tablet)
 */
const isOnTouchDevice = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

// Define custom event types for KwikPass
type KwikPassLoginEvent = CustomEvent<{
  [key: string]: unknown;
}>;

// Extend WindowEventMap to include KwikPass events
declare global {
  interface WindowEventMap {
    "user-loggedin": KwikPassLoginEvent;
    user_loggedin_merchant: KwikPassLoginEvent;
  }
}

export default function KwikpassLoginCustom() {
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { accessToken, login, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | HTMLDivElement>(null);
  const router = useRouter();

  // Check if user is authenticated via any source (useAuth OR GoKwik guest data)
  const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);

  useEffect(() => {
    if (accessToken) {
      setIsAuthenticated(true);
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    try {
      const guestRaw = localStorage.getItem("GUESTUSERDATA");
      if (guestRaw) {
        const guestData = JSON.parse(guestRaw);
        if (guestData?.user_token) {
          login(guestData.user_token);
          setIsAuthenticated(true);
          return;
        }
      }
      const gkToken =
        sessionStorage.getItem("gk_access_token") ||
        sessionStorage.getItem("gkAccessToken");
      if (gkToken) {
        login(gkToken);
        setIsAuthenticated(true);
        return;
      }
    } catch {
      // storage unavailable
    }
    setIsAuthenticated(!!accessToken);
  }, [accessToken, login]);

  // Detect touch device on mount
  useEffect(() => {
    setIsTouchDevice(isOnTouchDevice);
  }, []);

  // When KwikPass authenticates the user during checkout (OTP) the SDK writes
  // KWIKUSERTOKEN to its cookie/localStorage but does NOT fire `user-loggedin`,
  // so our auth context stays empty. Read the token directly and adopt it into
  // useAuth so the header reflects the SDK's session.
  useEffect(() => {
    if (accessToken) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }

    // Cookie first, then localStorage — matches the SDK's own lookup order.
    const readKey = (key: string): string | null => {
      const cookieMatch = document.cookie
        .split("; ")
        .find((c) => c.startsWith(`${key}=`));
      if (cookieMatch) {
        const value = cookieMatch.split("=").slice(1).join("=");
        if (value) {
          try {
            return decodeURIComponent(value);
          } catch {
            return value;
          }
        }
      }
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    };

    for (const key of KWIKPASS_TOKEN_KEYS) {
      const token = readKey(key);
      if (token) {
        login(token);
        return;
      }
    }

    // Legacy GUESTUSERDATA fallback for older SDK versions.
    try {
      const guestRaw = readKey("GUESTUSERDATA");
      if (guestRaw) {
        const guestData = JSON.parse(guestRaw);
        if (guestData?.user_token) {
          login(guestData.user_token);
        }
      }
    } catch {
      // Safari Private Browsing throws SecurityError on storage access
    }
  }, [accessToken, login]);

  // Listen for KwikPass login event
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleKwikpassLogin = (event: KwikPassLoginEvent) => {
      console.log("KwikPass login event received:", event);
      console.log("Event detail:", event.detail);

      // Handle the login after the user is authenticated via SSO or KwikPass
      if (!event.detail) {
        console.warn("KwikPass login event has no detail");
        return;
      }

      // Try to extract the access token from various possible locations
      let loginData = null;

      // Check for gk-access-token
      if (event.detail["gk-access-token"]) {
        loginData = event.detail["gk-access-token"];
      }
      // Check for accessToken
      else if (event.detail["accessToken"]) {
        loginData = event.detail["accessToken"];
      }
      // Check for token
      else if (event.detail["token"]) {
        loginData = event.detail["token"];
      }
      // If detail is an object with data, use the whole detail
      else if (
        typeof event.detail === "object" &&
        Object.keys(event.detail).length > 0
      ) {
        loginData = event.detail;
      }
      // If detail is a string/number, use it directly
      else if (event.detail !== null && event.detail !== undefined) {
        loginData = event.detail;
      }

      if (loginData) {
        console.log("Calling login with data:", loginData);
        login(loginData);
      } else {
        console.warn("No valid login data found in event:", event.detail);
      }
    };

    // Add event listener for user login events
    window.addEventListener("user-loggedin", handleKwikpassLogin);

    // Cleanup function to remove event listener on component unmount
    return () => {
      window.removeEventListener("user-loggedin", handleKwikpassLogin);
    };
  }, [login]);

  /**
   * Handles user logout
   */
  const doLogout = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        clearKwikpassAuthStorage();
        if (window.handleLogout) {
          window.handleLogout("/");
        }
        logout();
        setIsAuthenticated(false);
        setOpen(false);
        window.location.replace("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logout]);
  /**
   * Triggers KwikPass login flow
   */
  const handleLogin = () => {
    try {
      setIsLoggingIn(true);
      if (typeof window !== "undefined" && window.handleCustomLogin) {
        window.handleCustomLogin(false);
        setOpen(false);
        fireUserEngagementEvent();
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  /**
   * Handle dropdown item click
   */
  const handleDropdownItemClick = useCallback(
    (item: DropdownMenuItem) => {
      fireUserEngagementEvent();

      if (item.id === "logout") {
        doLogout();
        return;
      }

      if (item.path) {
        router.push(item.path);
      }
    },
    [doLogout, router]
  );

  /**
   * Get menu items based on auth state
   */
  const getMenuItems = useCallback((): DropdownMenuItem[] => {
    if (isAuthenticated) {
      return LOGGED_IN_MENU_ITEMS;
    }

    return LOGGED_OUT_MENU_ITEMS.map((item) => ({
      ...item,
      onClick: handleLogin,
    }));
  }, [isAuthenticated, handleLogin]);

  /**
   * Toggle dropdown on click (both mobile and desktop when logged in)
   */
  const toggleDropdown = useCallback(() => {
    // When logged in, always toggle on click (both mobile and desktop)
    if (isAuthenticated) {
      setOpen((prev) => !prev);
    } else if (isTouchDevice) {
      // When logged out, only toggle on mobile
      setOpen((prev) => !prev);
    }
  }, [isAuthenticated, isTouchDevice]);

  /**
   * Open dropdown for desktop (hover) - only used when logged out
   */
  const openDropdown = useCallback(() => {
    if (!isTouchDevice && !isAuthenticated) {
      setOpen(true);
    }
  }, [isTouchDevice, isAuthenticated]);

  /**
   * Close dropdown for desktop (hover out) - only used when logged out
   */
  const closeDropdown = useCallback(() => {
    if (!isTouchDevice && !isAuthenticated) {
      setOpen(false);
    }
  }, [isTouchDevice, isAuthenticated]);

  const onOrderHistory = () => {
    fireUserEngagementEvent();
    router.push("/account/order-history");
    setOpen(false);
  };

  /**
   * Handle click outside to close dropdown
   */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Check if click is outside both button and dropdown
      const isOutsideButton =
        buttonRef.current && !buttonRef.current.contains(event.target as Node);
      const isOutsideDropdown =
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node);
      if (isOutsideButton && isOutsideDropdown) {
        setOpen(false);
      }
    };

    // Add both mouse and touch events for better mobile support
    const events = isTouchDevice ? ["touchstart"] : ["mousedown"];

    if (open) {
      events.forEach((eventType) => {
        document.addEventListener(
          eventType,
          handleClickOutside as EventListener
        );
      });
    }

    return () => {
      events.forEach((eventType) => {
        document.removeEventListener(
          eventType,
          handleClickOutside as EventListener
        );
      });
    };
  }, [open, isTouchDevice]);

  /**
   * Update dropdown position
   */
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 14,
        left: rect.right - DROPDOWN_OFFSET - 30,
      });
    }
  }, [open]);

  /**
   * Handle keyboard navigation
   */
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [open]);

  const menuItems = getMenuItems();
  const showDropdown = open && dropdownPosition && isAuthenticated;
  return (
    <div
      className="relative flex items-center flex-col"
      data-testid="kwikpass-login"
      onMouseEnter={!isAuthenticated ? openDropdown : undefined}
      onMouseLeave={!isAuthenticated ? closeDropdown : undefined}
    >
      {isAuthenticated ? (
        // Logged in state
        <>
          {open ? (
            <div
              ref={buttonRef as React.RefObject<HTMLDivElement>}
              className="h-full flex items-center gap-2"
            >
              <div
                className="flex items-center justify-start cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                aria-label="Close user menu"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(false);
                  }
                }}
                data-testid="close-user-menu-button"
              >
                <Close currentColor="#1d1d1d" />
                <span
                  className="text-sm ml-2 font-normal leading-normal whitespace-nowrap"
                  style={{
                    color: "#1d1d1d",
                  }}
                >
                  Account
                </span>
              </div>
            </div>
          ) : (
            <button
              ref={buttonRef as React.RefObject<HTMLButtonElement>}
              className="h-full flex items-center gap-2 cursor-pointer"
              aria-label="Open user menu"
              onClick={toggleDropdown}
              disabled={isLoggingIn}
              data-testid="user-account-button"
            >
              <KwikPassLogo height="22" width="19" currentColor="#fcfced99" />
              <span
                className="text-sm font-normal leading-normal whitespace-nowrap"
                style={{
                  color: "#1d1d1d",
                }}
              >
                Account
              </span>
            </button>
          )}
        </>
      ) : (
        // Logged out state - no dropdown, just icon that triggers login
        <div className="relative pt-1.5">
          <button
            className="h-full flex items-center gap-2 cursor-pointer mb-2"
            aria-label="Login"
            onClick={handleLogin}
            disabled={isLoggingIn}
            data-testid="login-button"
          >
            <KwikPassLogo height="22" width="19" currentColor="#04040499" />
            <span
              className="hidden md:block text-sm font-normal"
              style={{
                color: "#1d1d1d",
              }}
            >
              Account
            </span>
          </button>
        </div>
      )}

      {/* Dropdown Menu - only show when logged in */}
      {showDropdown && (
        <DropdownMenu
          items={menuItems}
          position={dropdownPosition}
          onClose={() => setOpen(false)}
          dropdownRef={dropdownRef}
          onItemClick={handleDropdownItemClick}
          onLogout={doLogout}
          showLogout={!!isAuthenticated}
        />
      )}
    </div>
  );
}
