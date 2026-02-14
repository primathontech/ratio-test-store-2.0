# Testimonials Widget

A flexible and customizable testimonials carousel widget for displaying customer reviews and feedback.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Card Variants](#card-variants)
- [Styling Examples](#styling-examples)
- [Adding New Card Variants](#adding-new-card-variants)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)

## Overview

The Testimonials widget provides a powerful carousel system for showcasing customer testimonials with:

- Multiple pre-built card variants
- Fully customizable styling
- Responsive design
- Autoplay and navigation controls
- Flexible layout options

## Features

- ✅ **Multiple Card Variants**: Default and brand-specific (e.g., BBLUNT, TheDerma)
- ✅ **Carousel Controls**: Arrows, indicators, autoplay, loop
- ✅ **Responsive**: Mobile, tablet, and desktop optimized
- ✅ **Customizable**: Colors, borders, shadows, spacing
- ✅ **Accessible**: ARIA labels and semantic HTML
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **Performant**: Optimized with Keen Slider

## Quick Start

### Basic Usage

```typescript
// In your template file (e.g., default.ts)
{
  id: "testimonials-section",
  name: "Customer Testimonials",
  type: SECTION_TYPES.CONTENT_SECTION,
  widgets: [
    {
      id: "testimonials-widget",
      name: "Customer Testimonials Carousel",
      type: REGISTER_WIDGETS.Testimonials,
      settings: {
        variant: "v1",
        heading: "What Our Customers Say",
        subheading: "Real reviews from real customers",
        testimonials: [
          {
            id: "1",
            image: "/images/customer1.jpg",
            name: "John Doe",
            location: "New York, USA",
            stars: 5,
            title: "Amazing Product!",
            description: "This product exceeded my expectations...",
            alt: "John Doe's photo"
          },
          // More testimonials...
        ],
        autoplay: true,
        loop: true,
        pauseOnHover: true,
        interval: 5000,
        showArrows: true,
        showIndicators: true,
        slidesPerView: 3,
        mobileSlidesPerView: 1,
        spacing: 16,
        cardVariant: "default",
        testimonialBackgroundColor: "#e6f0fa",
        primaryColor: "#0066cc",
      },
    },
  ],
}
```

## Configuration

### Widget Settings

| Setting                      | Type             | Default     | Description                  |
| ---------------------------- | ---------------- | ----------- | ---------------------------- |
| `variant`                    | `string`         | `"v1"`      | Widget layout variant        |
| `heading`                    | `string`         | -           | Section heading text         |
| `subheading`                 | `string`         | -           | Section subheading text      |
| `testimonials`               | `ITestimonial[]` | `[]`        | Array of testimonial objects |
| `autoplay`                   | `boolean`        | `true`      | Enable automatic sliding     |
| `loop`                       | `boolean`        | `true`      | Enable infinite loop         |
| `pauseOnHover`               | `boolean`        | `true`      | Pause autoplay on hover      |
| `interval`                   | `number`         | `5000`      | Autoplay interval (ms)       |
| `showArrows`                 | `boolean`        | `true`      | Show navigation arrows       |
| `showIndicators`             | `boolean`        | `true`      | Show slide indicators        |
| `slidesPerView`              | `number`         | `3`         | Slides visible (desktop)     |
| `mobileSlidesPerView`        | `number`         | `1`         | Slides visible (mobile)      |
| `spacing`                    | `number`         | `16`        | Space between slides (px)    |
| `cardVariant`                | `string`         | `"default"` | Card variant to use          |
| `cardStyleConfig`            | `object`         | -           | Card styling configuration   |
| `CustomCardComponent`        | `Component`      | -           | Custom card component        |
| `testimonialBackgroundColor` | `string`         | `"#e6f0fa"` | Legacy background color      |
| `primaryColor`               | `string`         | -           | Primary theme color          |

### Testimonial Object

```typescript
interface ITestimonial {
  id?: string | number;
  image: string; // Customer image URL
  name: string; // Customer name
  location?: string; // Customer location
  stars: number; // Rating (1-5)
  title: string; // Review title
  description: string; // Review content
  alt?: string; // Image alt text
}
```

## Card Variants

### 1. Default Card (`cardVariant: "default"`)

Classic testimonial card with centered content, rounded corners, and shadow.

**Usage:**

```typescript
settings: {
  cardVariant: "default",
  cardStyleConfig: {
    backgroundColor: "#ffffff",
    border: {
      width: "1px",
      color: "#e5e7eb",
      radius: "1rem"
    },
    shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    padding: "2rem",
    textColors: {
      name: "#111827",
      location: "#6b7280",
      title: "#1f2937",
      description: "#4b5563"
    },
    starColor: "#f59e0b",
    starEmptyColor: "#d1d5db",
    image: {
      size: "5rem",
      borderWidth: "3px",
      borderColor: "#dbeafe",
      borderRadius: "9999px"
    }
  }
}
```

### 2. BBLUNT Card (`cardVariant: "bblunt"`)

Brand-specific card designed for BBLUNT theme with hover effects and gradient accent.

**Usage:**

```typescript
settings: {
  cardVariant: "bblunt",
  cardStyleConfig: {
    backgroundColor: "#f8f9fa",
    textColors: {
      name: "#2c3e50",
      location: "#7f8c8d",
      title: "#34495e",
      description: "#5a6c7d",
    },
    starColor: "#f39c12",
    starEmptyColor: "#ecf0f1",
  }
}
```

### 3. TheDerma Card (`cardVariant: "thederma"`)

Clean and professional card designed for TheDerma Co brand with light blue accents and verified badge.

**Features:**

- Light blue background (#f0f9ff)
- Sky blue border (#38bdf8)
- Verified customer badge
- Hover effect with shadow transition
- Professional and trustworthy design

**Usage:**

```typescript
settings: {
  cardVariant: "thederma",
  cardStyleConfig: {
    backgroundColor: "#f0f9ff",
    border: {
      width: "2px",
      color: "#38bdf8",
      radius: "1.5rem"
    },
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    padding: "2rem",
    textColors: {
      name: "#0c4a6e",
      location: "#64748b",
      title: "#0f172a",
      description: "#475569"
    },
    starColor: "#fbbf24",
    starEmptyColor: "#e2e8f0",
    image: {
      size: "5rem",
      borderWidth: "3px",
      borderColor: "#38bdf8",
      borderRadius: "9999px"
    }
  }
}
```

**Default Appearance:**

- Background: Light blue (#f0f9ff)
- Border: 2px sky blue (#38bdf8) with 1.5rem radius
- Text: Dark blue headings with gray descriptions
- Stars: Golden yellow (#fbbf24)
- Image: Circular with sky blue border
- Badge: "Verified Customer" with checkmark icon

## Styling Examples

### E-commerce Store (Modern & Professional)

```typescript
cardStyleConfig: {
  backgroundColor: "#ffffff",
  border: { width: "1px", color: "#e5e7eb", radius: "1.5rem" },
  shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  padding: "2rem",
  textColors: {
    name: "#111827",
    location: "#6b7280",
    title: "#1f2937",
    description: "#4b5563"
  },
  starColor: "#f59e0b",
  image: {
    size: "5rem",
    borderWidth: "3px",
    borderColor: "#ffffff",
    borderRadius: "1rem"
  }
}
```

### Minimalist Brand (Clean & Simple)

```typescript
cardStyleConfig: {
  backgroundColor: "transparent",
  border: { width: "0", color: "transparent", radius: "0.5rem" },
  shadow: "none",
  padding: "1.5rem",
  textColors: {
    name: "#000000",
    location: "#666666",
    title: "#000000",
    description: "#333333"
  },
  starColor: "#000000",
  starEmptyColor: "#cccccc",
  image: {
    size: "4rem",
    borderWidth: "1px",
    borderColor: "#e0e0e0",
    borderRadius: "9999px"
  }
}
```

### Luxury Brand (Elegant & Premium)

```typescript
cardStyleConfig: {
  backgroundColor: "#1a1a1a",
  border: { width: "2px", color: "#d4af37", radius: "0.5rem" },
  shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  padding: "2.5rem",
  textColors: {
    name: "#ffffff",
    location: "#d4af37",
    title: "#ffffff",
    description: "#cccccc"
  },
  starColor: "#d4af37",
  starEmptyColor: "#4a4a4a",
  image: {
    size: "6rem",
    borderWidth: "3px",
    borderColor: "#d4af37",
    borderRadius: "9999px"
  }
}
```

### Tech Startup (Modern & Bold)

```typescript
cardStyleConfig: {
  backgroundColor: "#0f172a",
  border: { width: "1px", color: "#3b82f6", radius: "1rem" },
  shadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)",
  padding: "2rem",
  textColors: {
    name: "#ffffff",
    location: "#94a3b8",
    title: "#e0e7ff",
    description: "#cbd5e1"
  },
  starColor: "#3b82f6",
  starEmptyColor: "#334155",
  image: {
    size: "5rem",
    borderWidth: "2px",
    borderColor: "#3b82f6",
    borderRadius: "0.75rem"
  }
}
```

## Adding New Card Variants

To add a new brand-specific card variant:

### Step 1: Create Card Component

Create a new file in `src/widgets/common/Testimonials/compounds/card-variants/`:

```tsx
// YourBrandCard.tsx
import React from "react";
import Image from "next/image";
import { CardVariantProps } from "./types";

export const YourBrandCard: React.FC<CardVariantProps> = ({
  testimonial,
  index,
  styleConfig = {},
}) => {
  const { image, name, location, stars, title, description, alt } = testimonial;

  // Extract styling from styleConfig
  const {
    backgroundColor = "#ffffff",
    textColors = {},
    starColor = "#fbbf24",
    starEmptyColor = "#d1d5db",
  } = styleConfig;

  return (
    <div
      className="keen-slider__slide flex items-center justify-center"
      key={index}
    >
      <div
        className="w-full h-full rounded-xl shadow-lg p-6"
        style={{ backgroundColor }}
      >
        {/* Your brand-specific design */}
        <div className="flex justify-center mb-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image
              src={image}
              alt={alt || name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <h3
          className="font-bold text-lg text-center"
          style={{ color: textColors.name }}
        >
          {name}
        </h3>

        {location && (
          <p
            className="text-sm text-center"
            style={{ color: textColors.location }}
          >
            {location}
          </p>
        )}

        {/* Star rating */}
        <div className="flex justify-center gap-1 my-3">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-5 h-5"
              style={{ color: i < stars ? starColor : starEmptyColor }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        <h4
          className="font-semibold text-center mb-2"
          style={{ color: textColors.title }}
        >
          {title}
        </h4>

        <p
          className="text-sm text-center"
          style={{ color: textColors.description }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};
```

### Step 2: Update Types

Add your variant to `types.ts`:

```typescript
export type TestimonialCardVariant = "default" | "bblunt" | "yourbrand";
```

### Step 3: Register in TestimonialCardWrapper

Update `TestimonialCardWrapper.tsx`:

```typescript
import { YourBrandCard } from "./YourBrandCard";

const getCardComponent = (): CardVariantComponent => {
  switch (variant) {
    case "bblunt":
      return BbluntTestimonialCard;
    case "yourbrand":
      return YourBrandCard;
    case "default":
    default:
      return DefaultCard;
  }
};
```

### Step 4: Export from Index

Add to `index.ts`:

```typescript
export { YourBrandCard } from "./YourBrandCard";
```

### Step 5: Use in Templates

```typescript
settings: {
  cardVariant: "yourbrand",
  cardStyleConfig: { /* optional customization */ }
}
```

## API Reference

### CardStyleConfig Interface

```typescript
interface CardStyleConfig {
  backgroundColor?: string;

  border?: {
    width?: string;
    color?: string;
    radius?: string;
  };

  shadow?: string;
  padding?: string;

  textColors?: {
    name?: string;
    location?: string;
    title?: string;
    description?: string;
  };

  starColor?: string;
  starEmptyColor?: string;

  image?: {
    size?: string;
    borderWidth?: string;
    borderColor?: string;
    borderRadius?: string;
  };

  layout?: "vertical" | "horizontal";
  customClasses?: string;
  customStyles?: React.CSSProperties;
}
```

### Responsive Configuration

```typescript
responsive: {
  mobile: {
    slidesPerView: 1,
    spacing: 12,
  },
  tablet: {
    slidesPerView: 2,
    spacing: 16,
  },
  desktop: {
    slidesPerView: 3,
    spacing: 20,
  },
}
```

## Best Practices

### 1. Performance

- Optimize images before use
- Limit testimonials to 10-15 for best performance
- Use appropriate image sizes (recommended: 200x200px)

### 2. Accessibility

- Always provide `alt` text for images
- Use semantic HTML structure
- Ensure sufficient color contrast (WCAG AA minimum)
- Include ARIA labels for carousel controls

### 3. Content

- Keep testimonial descriptions concise (100-150 words)
- Use real customer photos when possible
- Include customer location for authenticity
- Verify all testimonials are genuine

### 4. Design

- Maintain consistent card heights
- Use brand colors in `cardStyleConfig`
- Test on multiple screen sizes
- Ensure text is readable on all backgrounds

### 5. Carousel Settings

- Set appropriate `interval` (3000-7000ms recommended)
- Enable `pauseOnHover` for better UX
- Use `loop: false` for small testimonial counts
- Adjust `slidesPerView` based on card width

### 6. Card Variants

- Use **default variant** for quick customization
- Use **pre-registered variants** for brand-specific designs
- Use **custom variant** for unique, one-off designs
- Keep custom components simple and performant

## Troubleshooting

### Cards Not Displaying

- Check testimonials array is not empty
- Verify image URLs are accessible
- Ensure `slidesPerView` is appropriate for screen size

### Carousel Not Sliding

- Verify `autoplay` is set to `true`
- Check `interval` value is reasonable
- Ensure there are enough testimonials to slide

### Styling Issues

- Check `cardStyleConfig` syntax
- Verify color values are valid CSS
- Test responsive breakpoints
- Clear browser cache

## Migration Guide

### From Old TestimonialCard to New System

```typescript
// Before
<TestimonialCard
  testimonial={testimonial}
  index={0}
  backgroundColor="#e6f0fa"
/>

// After
<TestimonialCardWrapper
  testimonial={testimonial}
  index={0}
  variant="default"
  backgroundColor="#e6f0fa"
/>
```

### From Legacy Settings

```typescript
// Before
settings: {
  testimonialBackgroundColor: "#e6f0fa"
}

// After (recommended)
settings: {
  cardVariant: "default",
  cardStyleConfig: {
    backgroundColor: "#e6f0fa"
  }
}
```

## Support

For questions, issues, or feature requests:

- Check this documentation first
- Review example configurations above
- Contact the development team
- Submit issues to the project repository

## License

This widget is part of the storefront-builder project.
