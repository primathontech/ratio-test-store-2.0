import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/widgets/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/theme/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/integrations/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/editor-integration/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xxs: "401px",
        xs: "490px", // mobile (≤ 480px)
        lm: "769px", // large mobile (> 480px && ≤ 769px)
        mt: "860px", // medium tablet (> 768px && ≤ 860px)
        st: "1125px",
        xxl: "1387px", // custom breakpoint
      },
      // Base color system using CSS variables
      colors: {
        // Primary palette
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "var(--color-primary-light)",
          lighter: "var(--color-primary-light-3)",
          subtle: "var(--color-primary-light-2)",
          lightest: "var(--color-primary-light-4)",
          dark: "var(--color-primary-dark)",
          darker: "var(--color-primary-dark-2)",
          darkest: "var(--color-primary-dark-3)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          light: "var(--color-secondary-light)",
          lighter: "var(--color-secondary-light-2)",
          lightest: "var(--color-on-secondary)",
          dark: "var(--color-secondary-dark)",
          darker: "var(--color-secondary-dark-2)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          light: "var(--color-accent-light)",
          dark: "var(--color-accent-dark)",
        },

        // Surface colors
        background: {
          DEFAULT: "var(--color-background)",
          2: "var(--color-background-2)",
          3: "var(--color-background-3)",
          4: "var(--color-background-4)",
          5: "var(--color-background-5)",
          primary: "var(--color-background-primary)",
        },

        surface: {
          DEFAULT: "var(--color-surface)",
          2: "var(--color-surface-2)",
          3: "var(--color-surface-3)",
          4: "var(--color-surface-4)",
          5: "var(--color-surface-5)",
          6: "var(--color-surface-6)",
          7: "var(--color-surface-7)",
          8: "var(--color-surface-8)",
          9: "var(--color-surface-9)",
          10: "var(--color-surface-10)",
          11: "var(--color-surface-11)",
          12: "var(--color-surface-12)",
          13: "var(--color-surface-13)",
          14: "var(--color-surface-14)",
          15: "var(--color-surface-15)",
          16: " var(--color-surface-16)",
        },

        // Text colors
        text: {
          DEFAULT: "var(--color-text)",
          light: "var(--color-text-light)",
          light2: "var(--color-text-light-2)",
          lighter: "var(--color-text-lighter)",
          lightest: "var(--color-text-lightest)",
          subtle: "var(--color-text-subtle)",
          dark: "var(--color-text-dark)",
          darker1: "var(--color-text-dark-1)",
          darker: "var(--color-text-dark-2)",
          darker2: "var(--color-text-dark-3)",
          "dark-grayish-blue": "var(--color-dark-grayish-blue)",
        },

        // Semantic colors
        success: {
          DEFAULT: "var(--color-success)",
          light: "var(--color-success-light)",
          dark: "var(--color-success-dark)",
          darker: "var(--color-success-darker)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          light: "var(--color-warning-light)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          light: "var(--color-error-light)",
        },
        info: {
          DEFAULT: "var(--color-info)",
          light: "var(--color-info-light)",
          dark: "var(--color-info-dark)",
        },

        // On-colors for contrast
        "on-primary": "var(--color-on-primary)",
        "on-secondary": "var(--color-on-secondary)",
        "on-accent": "var(--color-on-accent)",
        "on-success": "var(--color-on-success)",
        "on-warning": "var(--color-on-warning)",
        "on-error": "var(--color-on-error)",
        "on-info": "var(--color-on-info)",
        "faq-section-bg": "var(--color-faq-section-bg)",
        "faq-header-bg": "var(--color-faq-header-bg)",
        "faq-border": "var(--color-faq-border)",
        "faq-question-text": "var(--color-faq-question-text)",
        "faq-answer-text": "var(--color-faq-answer-text)",
        "faq-hover-question": "var(--color-faq-hover-question)",
        "faq-title-color": "var(--color-faq-title-color)",
        "info-darker": "var(--color-info-darker)",

        // Overlay colors
        "overlay-dark": "var(--color-overlay-dark)",
        "overlay-light": "var(--color-overlay-light)",

        "home-icon": "var(--color-home-icon)",
        "hawk-grey": "var(--color-hawk-grey)",
        lighthouse: "var(--color-lighthouse)",
        thunder: "var(--color-thunder)",
        "filter-group": "var(--color-filter-group)",
        "bs-body-color": "var(--color-bs-body-color)",
        steam: "var(--color-steam)",
        "filter-drawer-overlay": "var(--color-filter-drawer-overlay)",
        "cart-overlay-dark": "var(--color-cart-overlay-dark)",
        "cart-drawer-background": "var(--color-cart-drawer-background)",
        "gray-neutral-100": "var(--color-gray-neutral-100)",
        "gray-neutral-200": "var(--color-gray-neutral-200)",
        "gray-neutral-300": "var(--color-gray-neutral-300)",
        "gray-neutral-400": "var(--color-gray-neutral-400)",
        "gray-neutral-500": "var(--color-gray-neutral-500)",
        "gray-neutral-600": "var(--color-gray-neutral-600)",
        "gray-neutral-900": "var(--color-gray-neutral-900)",
        "congress-blue": "var(--color-congress-blue)",
        "teal-400": "var(--color-teal-400)",
        "teal-500": "var(--color-teal-500)",
        "teal-600": "var(--color-teal-600)",
        "teal-700": "var(--color-teal-700)",
        "dark-grey": "var(--color-dark-grey)",
        "dark-grey-2": "var(--color-dark-grey-2)",
        "green-600": "var(--color-green-600)",
        "jungle-green": "var(--color-jungle-green)",
        "jungle-green-opacity-10": "var(--color-jungle-green-opacity-10)",
        "black-950": "var(--color-black-950)",
        "slate-100": "var(--color-slate-100)",
        "slate-200": "var(--color-slate-200)",
        "slate-400": "var(--color-slate-400)",
        "slate-450": "var(--color-slate-450)",
        "slate-600": "var(--color-slate-600)",
        "blue-50": "var(--color-blue-50)",
        "blue-100": "var(--color-blue-100)",
        "blue-600": "var(--color-blue-600)",
        "blue-700": "var(--color-blue-700)",
        "red-600": "var(--color-red-600)",
        "warm-grey": "var(--color-warm-grey)",
        "black-100": "var(--color-black-100)",
        black: "var(--color-black)",
        "light-grey": "var(--color-light-grey)",
        "light-grey-1": "var(--color-light-grey-1)",
        "light-grey-2": "var(--color-light-grey-2)",
        "light-grey-3": "var(--color-light-grey-3)",
        "light-grey-4": "var(--color-light-grey-4)",
        "light-grey-5": "var(--color-light-grey-5)",
        "light-grey-6": "var(--color-light-grey-6)",
        "light-grey-7": "var(--color-light-grey-7)",
        "light-grey-8": "var(--color-light-grey-8)",
        "light-grey-9": "var(--color-light-grey-9)",
        "light-grey-10": "var(--color-light-grey-10)",
        "light-grey-11": "var(--color-light-grey-11)",
        "light-grey-12": "var(--color-light-grey-12)",
        "sky-blue": "var(--color-sky-blue)",
        "off-white": "var(--color-off-white)",
        "light-orange": "var(--color-light-orange)",
        "lighter-orange": "var(--color-lighter-orange)",
        "lightest-orange": "var(--color-lightest-orange)",
        "dark-orange": "var(--color-dark-orange)",
        "darker-orange": "var(--color-darker-orange)",
        "light-green": "var(--color-light-green)",
        "lighter-green": "var(--color-lighter-green)",
        "dark-green": "var(--color-dark-green)",
        "subtle-orange": "var(--color-subtle-orange)",
        "darkest-green": "var(--color-darkest-green)",
      },

      // Typography
      fontFamily: {
        // Next.js Google Fonts integration
        inter: ["var(--font-inter)", "Inter"],
        opensans: ["var(--font-opensans)", "Open Sans", "sans-serif"],
        // Set Inter as default sans font
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        // Existing theme fonts (keeping for backward compatibility)
        heading: [
          "var(--headingfont)",
          "var(--font-opensans)",
          "Open Sans",
          "sans-serif",
        ],
        body: ["var(--bodyFont)", "Open Sans", "sans-serif"],
        accent: [
          "var(--accentfont)",
          "var(--font-opensans)",
          "Open Sans",
          "sans-serif",
        ],
        figtree: ["var(--font-figtree)", "Figtree", "sans-serif"],
        avenir: ["var(--font-avenir)", "Avenir", "sans-serif"],
        mono: ["var(--monofont)", "monospace"],
      },

      fontSize: {
        "3xs": [
          "var(--font-size-3xs)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        xs: ["var(--font-size-xs)", { lineHeight: "var(--line-height-tight)" }],
        "2xs": [
          "var(--font-size-2xs)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        "4xs": [
          "var(--font-size-4xs)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        sm: ["var(--font-size-sm)", { lineHeight: "var(--line-height-base)" }],
        base: [
          "var(--font-size-base)",
          { lineHeight: "var(--line-height-base)" },
        ],
        md: ["var(--font-size-md)", { lineHeight: "var(--line-height-base)" }],
        "md-2": [
          "var(--font-size-md-2)",
          { lineHeight: "var(--line-height-base)" },
        ],
        lg: ["var(--font-size-lg)", { lineHeight: "var(--line-height-base)" }],
        "lg-1": [
          "var(--font-size-lg-1)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        "lg-2": [
          "var(--font-size-lg-2)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        "lg-3": [
          "var(--font-size-lg-3)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        xl: ["var(--font-size-xl)", { lineHeight: "var(--line-height-tight)" }],
        xxl: [
          "var(--font-size-xxl)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        "2xl": [
          "var(--font-size-2xl)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        "2xl-1": [
          "var(--font-size-2xl-1)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        "3xl": [
          "var(--font-size-3xl)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        "4xl": [
          "var(--font-size-4xl)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        "5xl": [
          "var(--font-size-5xl)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        "faq-question": [
          "var(--font-baseFontSize)",
          { lineHeight: "var(--line-height-base)" },
        ],
        "faq-question-md": [
          "var(--font-size-xl)",
          { lineHeight: "var(--line-height-base)" },
        ],
        "faq-answer": [
          "var(--font-size-sm)",
          { lineHeight: "var(--line-height-base)" },
        ],
        "faq-answer-md": [
          "var(--font-size-base)",
          { lineHeight: "var(--line-height-base)" },
        ],
        "faq-title": [
          "var(--font-size-32)",
          { lineHeight: "var(--line-height-base)" },
        ],
        "faq-title-md": [
          "var(--font-size-56)",
          { lineHeight: "var(--line-height-base)" },
        ],
        "18": [
          "var(--font-size-18)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        medium: [
          "var(--font-size-heading-5)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        "body-small": [
          "var(--font-size-body-small)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        "20": [
          "var(--font-size-heading-4)",
          { lineHeight: "var(--line-height-tight)" },
        ],
        "30": [
          "var(--font-size-30)",
          { lineHeight: "var(--line-height-tight)" },
        ],
      },

      lineHeight: {
        highTight: "var(--line-height-highTight)",
        tight: "var(--line-height-tight)",
        base: "var(--line-height-base)",
        relaxed: "var(--line-height-relaxed)",
        normal: "var(--line-height-normal)",
      },

      letterSpacing: {
        tight: "var(--letter-spacing-tight)",
        normal: "var(--letter-spacing-normal)",
        wide: "var(--letter-spacing-wide)",
        wider: "var(--letter-spacing-wider)",
      },

      fontWeight: {
        light: "var(--font-weight-light)",
        normal: "var(--font-weight-normal)",
        medium: "var(--font-weight-medium)",
        semibold: "var(--font-weight-semibold)",
        bold: "var(--font-weight-bold)",
        "faq-question": "var(--font-weight-normal)",
        "faq-answer": "var(--font-weight-normal)",
      },

      // Spacing
      spacing: {
        unit: "var(--spacing-unit)",
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
        "3xl": "var(--spacing-3xl)",
        section: "var(--section-spacing)",
        "faq-section": "var(--section-spacing)",
        "spacing-350": "var(--spacing-350)",
      },

      // Container sizes
      maxWidth: {
        container: "var(--container-width)",
        "container-xs": "var(--container-xs)",
        "container-sm": "var(--container-sm)",
        "container-md": "var(--container-md)",
        "container-lg": "var(--container-lg)",
        "container-xl": "var(--container-xl)",
      },

      // Border radius
      borderRadius: {
        none: "var(--border-radius-none)",
        sm: "var(--border-radius-sm)",
        DEFAULT: "var(--border-radius)",
        md: "var(--border-radius-md)",
        lg: "var(--border-radius-lg)",
        xl: "var(--border-radius-xl)",
        full: "var(--border-radius-full)",
        "radius-20": "var(--border-radius-20)",
        "faq-header": "var(--border-faq-header)",
        "faq-image": "var(--border-radius-20)",
        "10": "var(--border-radius-10)",
      },

      // Box shadows
      boxShadow: {
        none: "var(--shadow-none)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        inner: "var(--shadow-inner)",
        outline: "var(--shadow-outline)",
        soft: "var(--shadow-soft)",
        elevated: "var(--shadow-elevated)",
      },

      // Transitions
      transitionDuration: {
        DEFAULT: "var(--transition-duration)",
        fast: "var(--transition-duration-fast)",
        slow: "var(--transition-duration-slow)",
        slower: "var(--transition-duration-slower)",
      },

      transitionTimingFunction: {
        DEFAULT: "var(--transition-timing-default)",
        in: "var(--transition-timing-in)",
        out: "var(--transition-timing-out)",
        "in-out": "var(--transition-timing-in-out)",
      },

      // Z-index
      zIndex: {
        "0": "var(--z-0)",
        "10": "var(--z-10)",
        "20": "var(--z-20)",
        "30": "var(--z-30)",
        "40": "var(--z-40)",
        "50": "var(--z-50)",
        "999": "var(--z-999)",
        "2100": "var(--z-2100)",
        "2999": "var(--z-2999)",
        "3999": "var(--z-3999)",
        auto: "var(--z-auto)",
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        fixed: "var(--z-fixed)",
        modal: "var(--z-modal)",
        popover: "var(--z-popover)",
        tooltip: "var(--z-tooltip)",
      },

      // Animations
      animation: {
        spin: "spin 1s linear infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite",
        "fade-in":
          "fadeIn var(--transition-duration-slow) var(--transition-timing-out)",
        "slide-up":
          "slideUp var(--transition-duration-slow) var(--transition-timing-out)",
        "slide-down":
          "slideDown var(--transition-duration-slow) var(--transition-timing-out)",
        "scale-in":
          "scaleIn var(--transition-duration-slow) var(--transition-timing-out)",
      },

      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: {
            opacity: "0",
            transform: "translateY(1rem)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideDown: {
          from: {
            opacity: "0",
            transform: "translateY(-1rem)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        scaleIn: {
          from: {
            opacity: "0",
            transform: "scale(0.95)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        progress: {
          "0%": { width: "0%" },
          "50%": { width: "70%" },
          "100%": { width: "100%" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },

      // Width
      width: {
        "230": "var(--width-230)",
        "400": "var(--width-400)",
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("editor", ".editor-preview &");
    }),
  ],
  // Enable future features
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
