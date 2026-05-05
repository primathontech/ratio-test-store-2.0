import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/widgets/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/theme/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/integrations/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xxs: "401px",
        xs: "490px", // mobile (≤ 480px)
        lm: "769px", // large mobile (> 480px && ≤ 769px)
        mt: "860px", // medium tablet (> 768px && ≤ 860px)
        st: "1125px",
        xl2: "1150px",
        xxl: "1387px", // custom breakpoint
        xl3: "1400px",
      },
      // Base color system using CSS variables
      colors: {
        // Primary palette
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "var(--color-primary-light)",
          lighter: "var(--color-primary-light-3)",
          dark: "var(--color-primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          dark: "var(--color-secondary-dark)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          dark: "var(--color-accent-dark)",
        },

        // Surface colors
        background: {
          DEFAULT: "var(--color-background)",
        },

        surface: {
          DEFAULT: "var(--color-surface)",
          2: "var(--color-surface-2)",
          3: "var(--color-surface-3)",
          4: "var(--color-surface-4)",
        },

        // Text colors
        text: {
          DEFAULT: "var(--color-text)",
          light: "var(--color-text-light)",
          lighter: "var(--color-text-lighter)",
          subtle: "var(--color-text-subtle)",
          darker: "var(--color-text-dark-2)",
        },

        // Semantic colors
        success: {
          DEFAULT: "var(--color-success)",
          dark: "var(--color-success-dark)",
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
          dark: "var(--color-info-dark)",
        },

        // On-colors for contrast (used via @apply in globals.css for buttons/badges/alerts)
        "on-primary": "var(--color-on-primary)",
        "on-secondary": "var(--color-on-secondary)",
        "on-accent": "var(--color-on-accent)",
        "on-success": "var(--color-on-success)",
        "on-warning": "var(--color-on-warning)",
        "on-error": "var(--color-on-error)",
        "on-info": "var(--color-on-info)",

        "faq-border": "var(--color-faq-border)",
        "loading-blue": "var(--color-loading-blue)",
        "bg-gray": "var(--color-bg-gray)",
        "lightest-gray": "var(--color-lightest-gray)",
        "faq-question-text": "var(--color-faq-question-text)",
        "faq-answer-text": "var(--color-faq-answer-text)",
        "faq-hover-question": "var(--color-faq-hover-question)",
        "faq-title-color": "var(--color-faq-title-color)",
        "info-darker": "var(--color-info-darker)",
        "info-lighter": "var(--color-info-lighter)",
        // Order-status / payment-status tokens (post-order pages)
        "order-text": "var(--color-order-text)",
        "order-border": "var(--color-order-border)",
        "order-detail-border": "var(--color-order-detail-border)",
        "cancel-text": "var(--color-cancel-text)",
        "cod-bg": "var(--color-cod-bg)",
        "cod-text": "var(--color-cod-text)",
        "prepaid-bg": "var(--color-prepaid-bg)",
        "prepaid-text": "var(--color-prepaid-text)",
        "lighter-gray": "var(--color-lighter-gray)",
        "gray-light": "var(--color-gray-light)",

        // Overlay colors
        "overlay-dark": "var(--color-overlay-dark)",
        "overlay-light": "var(--color-overlay-light)",

        "filter-group": "var(--color-filter-group)",
        "cart-overlay-dark": "var(--color-cart-overlay-dark)",
        "blue-50": "var(--color-blue-50)",
        "blue-600": "var(--color-blue-600)",
        "blue-700": "var(--color-blue-700)",
        "red-600": "var(--color-red-600)",
        black: "var(--color-black)",
      },

      // Typography
      fontFamily: {
        opensans: ["var(--font-opensans)", "Open Sans", "sans-serif"],
        // Gotham — local font, primary brand body font
        gotham: ["var(--font-gotham)", "system-ui", "sans-serif"],
        // Set Gotham as default sans font (applies to most text by default)
        sans: ["var(--font-gotham)", "system-ui", "sans-serif"],
        // font-body is applied to <body> in globals.css and inherited everywhere
        body: ["var(--font-gotham)", "system-ui", "sans-serif"],
        // Heading font — used via @apply in globals.css h1-h6 and section titles
        heading: [
          "var(--font-gotham)",
          "var(--font-opensans)",
          "Open Sans",
          "sans-serif",
        ],
        mono: ["ui-monospace", "monospace"],
      },

      fontSize: {
        xs: ["var(--font-size-xs)", { lineHeight: "var(--line-height-tight)" }],
        sm: ["var(--font-size-sm)", { lineHeight: "var(--line-height-base)" }],
        base: [
          "var(--font-size-base)",
          { lineHeight: "var(--line-height-base)" },
        ],
        md: ["var(--font-size-md)", { lineHeight: "var(--line-height-base)" }],
        lg: ["var(--font-size-lg)", { lineHeight: "var(--line-height-base)" }],
        xl: ["var(--font-size-xl)", { lineHeight: "var(--line-height-tight)" }],
        "2xl": [
          "var(--font-size-2xl)",
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
        "body-small": [
          "var(--font-size-body-small)",
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
      },

      fontWeight: {
        light: "var(--font-weight-light)",
        normal: "var(--font-weight-normal)",
        medium: "var(--font-weight-medium)",
        semibold: "var(--font-weight-semibold)",
        bold: "var(--font-weight-bold)",
        extrabold: "var(--font-weight-extrabold)",
      },

      // Spacing
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
        section: "var(--section-spacing)",
      },

      // Container sizes
      maxWidth: {
        container: "var(--container-width)",
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
        "2xl": "var(--border-radius-2xl)",
        "3xl": "var(--border-radius-3xl)",
        full: "var(--border-radius-full)",
      },

      // Box shadows
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },

      // Transitions
      transitionDuration: {
        DEFAULT: "var(--transition-duration)",
        fast: "var(--transition-duration-fast)",
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
      },

      // Animations
      animation: {
        spin: "spin 1s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
