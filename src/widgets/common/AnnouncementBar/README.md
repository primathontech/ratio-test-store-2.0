# AnnouncementBar Documentation (V1 & V2)

## Basic Usage

```tsx
import { AnnouncementBar } from "./widgets/common/AnnouncementBar";

<AnnouncementBar
  settings={{
    variant: "v1",
    texts: [
      {
        id: 1,
        text: "🔥 Special Offer! Get 20% off on all orders above ₹499 | Use Code: SAVE20",
        href: "/offers",
      },
    ],
    mode: "marquee",
  }}
/>;
```

## Theme Template Usage

In theme templates (like `src/themes/dawn/templates/home/default.ts`), the announcement bar is configured as:

```tsx
{
  id: "announcement-bar-section",
  name: "Announcement Bar",
  type: SECTION_TYPES.CONTENT_SECTION,
  widgets: [{
    id: "announcement-widget",
    name: "Top Announcement",
    type: REGISTER_WIDGETS.AnnouncementBar,
    settings: {
      variant: "v1",
      mode: "marquee",
      backgroundColor: "#000000",
      texts: [
        {
          id: "t:announcement.0.id",
          text: "t:announcement.0.text",
          href: "t:announcement.0.href",
          target: "_self"
        }
      ]
    }
  }]
}
```

> **Note**: Template configurations use translation keys (prefixed with `t:`) that get resolved at runtime.

## Props Reference

### Core Settings

| Prop        | Type                              | Default      | Description                                                     |
| ----------- | --------------------------------- | ------------ | --------------------------------------------------------------- |
| `texts`     | `IBannerTextItemFlat[]`           | **required** | Array of announcement texts                                     |
| `mode`      | `TBannerMode`                     | `"marquee"`  | Display mode: "marquee", "marquee-reverse", "static", or "fade" |
| `width`     | `"full" \| "container" \| string` | `"full"`     | Bar width                                                       |
| `separator` | `"dot" \| "line"`                 | `undefined`  | Visual separator between multiple texts                         |

### Display Modes

| Mode                | Description                                   | Use Case                                                 |
| ------------------- | --------------------------------------------- | -------------------------------------------------------- |
| `"marquee"`         | Continuous horizontal scrolling left to right | Long text, multiple offers (like Bombay Shaving Company) |
| `"marquee-reverse"` | Continuous horizontal scrolling right to left | Alternative scrolling direction                          |
| `"static"`          | Simple centered display                       | Single important message                                 |
| `"fade"`            | Fade transition between texts                 | Subtle text transitions                                  |

### Text Separators

| Separator   | Description             | Visual |
| ----------- | ----------------------- | ------ |
| `"dot"`     | Bullet point separator  | `•`    |
| `"line"`    | Vertical line separator | `\|`   |
| `undefined` | No separator            | -      |

### Styling

| Prop              | Type     | Default     | Description      |
| ----------------- | -------- | ----------- | ---------------- |
| `backgroundColor` | `string` | `"#000000"` | Background color |
| `fontColor`       | `string` | `"#ffffff"` | Text color       |

### Responsive Layout

| Prop              | Type     | Default  | Description       |
| ----------------- | -------- | -------- | ----------------- |
| `heightMobile`    | `string` | `"40px"` | Mobile height     |
| `heightDesktop`   | `string` | `"48px"` | Desktop height    |
| `fontSizeMobile`  | `string` | `"14px"` | Mobile font size  |
| `fontSizeDesktop` | `string` | `"16px"` | Desktop font size |

### Animation & Behavior

| Prop           | Type               | Default | Description                      |
| -------------- | ------------------ | ------- | -------------------------------- |
| `marqueeSpeed` | `number \| string` | `"30s"` | Marquee animation duration       |
| `pauseOnHover` | `boolean`          | `true`  | Pause marquee animation on hover |

### Action Button

| Prop                          | Type                                         | Default         | Description                |
| ----------------------------- | -------------------------------------------- | --------------- | -------------------------- |
| `showActionButton`            | `boolean`                                    | `false`         | Show/hide action button    |
| `actionButtonText`            | `string`                                     | `"Shop Now"`    | Button text content        |
| `actionButtonHref`            | `string`                                     | `undefined`     | Button link URL (optional) |
| `actionButtonTarget`          | `"_self" \| "_blank" \| "_parent" \| "_top"` | `"_self"`       | Link target                |
| `actionButtonPosition`        | `"left" \| "right" \| "center"`              | `"right"`       | Button position            |
| `actionButtonHeight`          | `string \| number`                           | `"32px"`        | Button height              |
| `actionButtonWidth`           | `string \| number`                           | `"auto"`        | Button width               |
| `actionButtonBorderRadius`    | `string \| number`                           | `"4px"`         | Button border radius       |
| `actionButtonBorderColor`     | `string \| number`                           | `"transparent"` | Button border color        |
| `actionButtonTextColor`       | `string`                                     | `"#ffffff"`     | Button text color          |
| `actionButtonBackgroundColor` | `string`                                     | `"#007bff"`     | Button background color    |

### Accessibility

| Prop        | Type     | Default                 | Description         |
| ----------- | -------- | ----------------------- | ------------------- |
| `ariaLabel` | `string` | `"Announcement banner"` | Accessibility label |

## Text Object Structure

```tsx
interface IBannerTextItemFlat {
  id?: string | number; // Unique identifier
  text: string; // Announcement text
  href?: string; // Optional link destination
  target?: "_self" | "_blank" | "_parent" | "_top"; // Link target
}
```

## Examples

### Basic Marquee (Bombay Shaving Company Style)

```tsx
<AnnouncementBar
  settings={{
    variant: "v1",
    mode: "marquee",
    texts: [{ text: "Free shipping on orders above ₹299" }],
    backgroundColor: "#007bff",
    marqueeSpeed: "25s",
  }}
/>
```

### Static Announcement with Action Button (The Derma Co Style)

```tsx
<AnnouncementBar
  settings={{
    variant: "v1",
    mode: "static",
    texts: [
      {
        text: "Upto 35% Off on all orders above Rs.799 Today | Use Coupon - REDEEM35 at Cart",
        href: "/offers",
      },
    ],
    backgroundColor: "#28a745",
    showActionButton: true,
    actionButtonText: "Shop Now",
    actionButtonHref: "/shop",
    actionButtonPosition: "right",
  }}
/>
```

### Multiple Texts with Separators (Aqualogica Style)

```tsx
<AnnouncementBar
  settings={{
    variant: "v1",
    mode: "static",
    texts: [
      { text: "Free shipping on orders above ₹499" },
      { text: "30-day return policy" },
      { text: "24/7 customer support" },
    ],
    separator: "dot",
    backgroundColor: "#17a2b8",
  }}
/>
```

### Weryze Style with Emojis and Center Button

```tsx
<AnnouncementBar
  settings={{
    variant: "v1",
    mode: "marquee",
    texts: [
      {
        text: "🔥PAYDAY SALE 🔥 Flat 10% off on Orders above Rs.499/- | Use Code: PAYDAY",
      },
    ],
    backgroundColor: "#000000",
    fontColor: "#ffffff",
    showActionButton: true,
    actionButtonText: "Get Deal",
    actionButtonPosition: "center",
    actionButtonBackgroundColor: "#ff6b6b",
  }}
/>
```

### Custom Styled Action Button

```tsx
<AnnouncementBar
  settings={{
    variant: "v1",
    mode: "static",
    texts: [{ text: "Limited time offer - 50% off everything!" }],
    backgroundColor: "#6f42c1",
    showActionButton: true,
    actionButtonText: "Claim Now",
    actionButtonPosition: "left",
    actionButtonHeight: "36px",
    actionButtonWidth: "120px",
    actionButtonBorderRadius: "20px",
    actionButtonBackgroundColor: "#ffffff",
    actionButtonTextColor: "#6f42c1",
    actionButtonBorderColor: "#6f42c1",
  }}
/>
```

### Responsive Design

```tsx
<AnnouncementBar
  settings={{
    variant: "v1",
    mode: "marquee",
    texts: [{ text: "Special offer text here" }],
    backgroundColor: "#dc3545",
    heightMobile: "36px",
    heightDesktop: "50px",
    fontSizeMobile: "13px",
    fontSizeDesktop: "17px",
  }}
/>
```

### With Link

```tsx
<AnnouncementBar
  settings={{
    variant: "v1",
    mode: "static",
    texts: [
      {
        text: "Click here for exclusive deals!",
        href: "/deals",
        target: "_blank",
      },
    ],
    backgroundColor: "#6f42c1",
  }}
/>
```

## Component Architecture

The AnnouncementBar follows a compound component pattern with these reusable parts:

### Compound Components

- **`AnnouncementText`** - Renders individual text with optional links
- **`MarqueeText`** - Handles marquee scrolling animation with separators
- **`Separator`** - Visual separators between text items (dot or line)
- **`ActionButton`** - Configurable call-to-action button
- **`CloseButton`** - Dismissible close functionality

### File Structure

```
AnnouncementBar/
├── README.md
├── index.tsx          # Main component export
├── types.ts           # TypeScript interfaces
├── variants.ts        # Variant registry
├── V1/
│   └── index.tsx      # V1 implementation (includes responsive styles)
└── compounds/
    ├── utils.ts       # Utility functions (responsive styles, separator styles)
    ├── AnnouncementText.tsx
    ├── MarqueeText.tsx
    ├── Separator.tsx
    ├── ActionButton.tsx
    └── CloseButton.tsx
```

## Real-world Inspirations

This implementation is inspired by announcement bars from:

- **Bombay Shaving Company**: Continuous scrolling marquee
- **The Derma Co**: Static promotional messages with colors
- **Aqualogica**: Multi-part offers with separators
- **Weryze**: Fire emoji emphasis and strong CTAs
- **Kilrr**: First-time buyer discounts

## Action Button Positioning

The action button uses CSS flexbox for clean positioning:

- **Left**: `justify-content: flex-start` - Button appears first
- **Center**: `justify-content: center` - Content and button centered with gap
- **Right**: `justify-content: space-between` - Text left, button right
- **Default**: `justify-content: space-evenly` - Even distribution

## Best Practices

1. **Keep text concise** - Announcement bars have limited space
2. **Use contrasting colors** - Ensure text is readable against background
3. **Include clear CTAs** - Make offers actionable with links or action buttons
4. **Test responsively** - Verify appearance across devices
5. **Consider accessibility** - Use proper ARIA labels
6. **Limit marquee speed** - Too fast becomes unreadable
7. **Provide close option** - Allow users to dismiss if needed
8. **Use separators wisely** - For multiple related messages
9. **Position buttons strategically** - Right for primary actions, left for secondary
10. **Style buttons consistently** - Match your brand colors and design system

## Performance Notes

- Animations use CSS transforms for optimal performance
- Responsive styles are generated once and cached
- Compound components enable code splitting and reusability
- Simple API reduces bundle size and complexity

---

## AnnouncementBar V2 - Slider Functionality

### What's New in V2?

AnnouncementBar V2 introduces **slider functionality** with navigation controls, inspired by the BBLUNT website design. Each announcement text becomes a separate slide that users can navigate through.

### Key V2 Features

- 🎠 **Carousel/Slider Mode**: Each announcement is a separate slide
- ⬅️➡️ **Navigation Arrows**: Prev/next controls with customizable icons
- 📱 **Touch/Drag Support**: Swipe on mobile, drag on desktop
- ⏯️ **Auto-advance**: Automatic slide progression with customizable timing
- 🔄 **Infinite Loop**: Seamless cycling through announcements
- 🎨 **BBLUNT-inspired Design**: Matches the reference website's UX/UI

### V2 Usage

```tsx
import { AnnouncementBar } from "./widgets/common/AnnouncementBar";

<AnnouncementBar
  settings={{
    variant: "v2", // Enable V2 slider functionality
    enableSlider: true,
    backgroundColor: "#e91e63", // BBLUNT pink
    texts: [
      {
        id: 1,
        text: "Sale is Live | Buy 1 Get 1 Free + Extra 5% Off On Prepaid Orders | Use Code: BOGO",
        href: "/sale",
      },
      {
        id: 2,
        text: "🔥 LIMITED TIME OFFER - Flat 50% OFF on All Hair Care Products",
        href: "/offers",
      },
      {
        id: 3,
        text: "FREE SHIPPING on orders above ₹499 | Shop Now & Save Big!",
        href: "/shop",
      },
    ],
    autoplay: true,
    autoplayInterval: 4000,
    showNavigationArrows: true,
    navigationIconStyle: "chevron",
    enableDragScroll: true,
  }}
/>;
```

### V2-Specific Settings

#### Slider Configuration

| Prop               | Type      | Default | Description                                  |
| ------------------ | --------- | ------- | -------------------------------------------- |
| `enableSlider`     | `boolean` | `true`  | Enable slider functionality (V2 only)        |
| `slidesToShow`     | `number`  | `1`     | Number of announcements visible at once      |
| `slidesToScroll`   | `number`  | `1`     | Number of announcements to scroll per action |
| `autoplay`         | `boolean` | `true`  | Auto-advance slides                          |
| `autoplayInterval` | `number`  | `5000`  | Auto-advance interval in milliseconds        |
| `infinite`         | `boolean` | `true`  | Loop slides infinitely                       |

#### Navigation Controls

| Prop                    | Type                              | Default     | Description               |
| ----------------------- | --------------------------------- | ----------- | ------------------------- |
| `showNavigationArrows`  | `boolean`                         | `true`      | Show prev/next arrows     |
| `navigationPosition`    | `"inside" \| "outside"`           | `"inside"`  | Arrow positioning         |
| `navigationIconStyle`   | `"arrow" \| "chevron" \| "caret"` | `"chevron"` | Icon style                |
| `showNavigationOnHover` | `boolean`                         | `false`     | Show arrows only on hover |

#### Drag/Touch Support

| Prop               | Type      | Default | Description                     |
| ------------------ | --------- | ------- | ------------------------------- |
| `enableDragScroll` | `boolean` | `true`  | Enable drag/touch scrolling     |
| `dragSensitivity`  | `number`  | `50`    | Minimum drag distance in pixels |

#### V2 Styling

| Prop                             | Type     | Default             | Description      |
| -------------------------------- | -------- | ------------------- | ---------------- |
| `navigationArrowColor`           | `string` | `"#ffffff"`         | Arrow color      |
| `navigationArrowBackgroundColor` | `string` | `"rgba(0,0,0,0.5)"` | Arrow background |
| `navigationArrowSize`            | `string` | `"32px"`            | Arrow size       |

### V2 Examples

#### BBLUNT-Style Slider (Recommended)

```tsx
<AnnouncementBar
  settings={{
    variant: "v2",
    backgroundColor: "#e91e63", // BBLUNT pink
    fontColor: "#ffffff",
    texts: [
      {
        text: "Sale is Live | Buy 1 Get 1 Free + Extra 5% Off On Prepaid Orders | Use Code: BOGO",
        href: "/sale",
      },
      {
        text: "🔥 LIMITED TIME OFFER - Flat 50% OFF on All Hair Care Products",
        href: "/offers",
      },
      {
        text: "FREE SHIPPING on orders above ₹499 | Shop Now & Save Big!",
        href: "/shop",
      },
    ],
    autoplay: true,
    autoplayInterval: 4000,
    showNavigationArrows: true,
    navigationIconStyle: "chevron",
    enableDragScroll: true,
    navigationArrowSize: "28px",
    navigationArrowBackgroundColor: "rgba(0,0,0,0.3)",
    heightMobile: "44px",
    heightDesktop: "52px",
  }}
/>
```

#### Manual Navigation Only

```tsx
<AnnouncementBar
  settings={{
    variant: "v2",
    backgroundColor: "#2196f3",
    texts: [
      { text: "New Collection Launch - Explore Now" },
      { text: "Premium Quality Products at Best Prices" },
    ],
    autoplay: false, // Disable auto-advance
    showNavigationArrows: true,
    navigationIconStyle: "arrow",
    enableDragScroll: true,
  }}
/>
```

#### Hover-Activated Navigation

```tsx
<AnnouncementBar
  settings={{
    variant: "v2",
    backgroundColor: "#000000",
    texts: [
      { text: "🎉 MEGA SALE - Up to 70% OFF" },
      { text: "🚚 FREE Delivery on orders above ₹999" },
      { text: "💝 Buy 2 Get 1 FREE on selected items" },
    ],
    autoplay: true,
    autoplayInterval: 3000,
    showNavigationOnHover: true, // Show arrows only on hover
    navigationIconStyle: "caret",
  }}
/>
```

#### With Action Button

```tsx
<AnnouncementBar
  settings={{
    variant: "v2",
    backgroundColor: "#4caf50",
    texts: [
      { text: "Limited Time Offer - Don't Miss Out!" },
      { text: "Join our VIP Club for Exclusive Deals" },
    ],
    autoplay: true,
    autoplayInterval: 5000,
    showActionButton: true,
    actionButtonText: "Shop Now",
    actionButtonPosition: "right",
    actionButtonBackgroundColor: "#ffffff",
    actionButtonTextColor: "#4caf50",
  }}
/>
```

### Template Usage (BBLUNT Example)

In theme templates, V2 is configured like this:

```tsx
{
  id: "announcement-bar-section",
  name: "Announcement Bar",
  type: SECTION_TYPES.CONTENT_SECTION,
  settings: {
    layout: SECTION_LAYOUT_OPTIONS.FULL,
  },
  widgets: [{
    id: "announcement-bar-widget",
    name: "Announcement Bar V2",
    type: REGISTER_WIDGETS.AnnouncementBar,
    settings: {
      variant: "v2",
      enableSlider: true,
      backgroundColor: "#e91e63", // BBLUNT pink color
      fontColor: "#ffffff",
      texts: "t:common.announcement-bar", // Translation key
      autoplay: true,
      autoplayInterval: 4000,
      infinite: true,
      showNavigationArrows: true,
      navigationPosition: "inside",
      navigationIconStyle: "chevron",
      enableDragScroll: true,
      dragSensitivity: 50,
      navigationArrowColor: "#ffffff",
      navigationArrowBackgroundColor: "rgba(0,0,0,0.3)",
      navigationArrowSize: "28px",
      heightMobile: "44px",
      heightDesktop: "52px",
      fontSizeMobile: "14px",
      fontSizeDesktop: "16px",
    },
  }]
}
```

### V2 vs V1 Comparison

| Feature            | V1                       | V2                              |
| ------------------ | ------------------------ | ------------------------------- |
| **Display Mode**   | Marquee scrolling        | Individual slides               |
| **Navigation**     | None                     | Prev/Next arrows                |
| **Touch Support**  | None                     | Drag/Swipe gestures             |
| **Auto-advance**   | Continuous scroll        | Timed slide transitions         |
| **Multiple Texts** | All visible in marquee   | One slide at a time             |
| **User Control**   | Pause on hover only      | Full navigation control         |
| **Use Case**       | Long continuous messages | Multiple distinct announcements |

### V2 Technical Implementation

V2 leverages patterns from the [`BbluntCarousel`](src/widgets/dawn/ProductGrid/common/BbluntCarousel.tsx) component:

- **Transform-based Animation**: Uses `translateX` for smooth slide transitions
- **Touch/Mouse Event Handling**: Supports both touch and mouse drag gestures
- **State Management**: Tracks current slide, dragging state, and transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: CSS transforms for hardware acceleration

### V2 Best Practices

1. **Limit Slide Count**: 3-5 announcements work best for user attention
2. **Optimal Timing**: 4-6 seconds per slide for readability
3. **Clear Navigation**: Use contrasting arrow colors for visibility
4. **Mobile-First**: Test drag gestures on touch devices
5. **Accessibility**: Ensure proper ARIA labels and keyboard support
6. **Content Strategy**: Each slide should be self-contained and actionable

### Migration from V1 to V2

To upgrade from V1 to V2:

1. Change `variant` from `"v1"` to `"v2"`
2. Set `enableSlider: true`
3. Configure navigation and autoplay settings
4. Test with multiple announcement texts
5. Adjust styling for the new slider layout

```tsx
// V1 Configuration
{
  variant: "v1",
  mode: "marquee",
  texts: [/* multiple texts shown in marquee */]
}

// V2 Configuration
{
  variant: "v2",
  enableSlider: true,
  autoplay: true,
  autoplayInterval: 4000,
  showNavigationArrows: true,
  texts: [/* same texts, now as individual slides */]
}
```

### V2 Browser Support

- **Modern Browsers**: Full support with hardware acceleration
- **Touch Devices**: Native touch/swipe gesture support
- **Keyboard Navigation**: Arrow key support for accessibility
- **Screen Readers**: Proper ARIA announcements for slide changes
