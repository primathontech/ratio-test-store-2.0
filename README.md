# Storefront Starter

A production-ready, performance-optimized e-commerce storefront built with **Next.js 14**, featuring a modular widget system, theme support, and built-in performance governance.

## Features

- **Next.js 14** with App Router and Server Components
- **Modular Widget System** - Reusable, configurable components with A/B variant support
- **Theme Support** - Easy customization via JSON configuration
- **Custom Backend Support** - Built for GoKwik's microservices architecture
- **Shopify Compatible** - Optional Shopify Storefront API integration
- **Performance Governance** - Built-in validation, scoring, and CI enforcement
- **i18n Ready** - Built-in internationalization with next-intl
- **GoKwik Integration** - Checkout and authentication out of the box

## Quick Start

```bash
# Clone the repository
git clone https://github.com/primathontech/storefront-starter.git my-store
cd my-store

# Install dependencies
bun install

# Copy environment example and configure
cp .env.example .env.local

# Start development server
bun run dev

# Open http://localhost:4344
```

## Configuration

### Minimum Required Environment Variables

Create a `.env.local` file with these essential variables:

```env
# =============================================================================
# MERCHANT CONFIGURATION
# =============================================================================
NEXT_PUBLIC_MERCHANT_NAME=your-merchant        # Your merchant identifier
NEXT_PUBLIC_PLATFORM=custom                    # Use 'custom' for GoKwik backend
NEXT_PUBLIC_THEME_NAME=dawn                    # Theme to use

# =============================================================================
# SHOPIFY CONFIGURATION (Data Source)
# =============================================================================
# Product data is fetched from Shopify Storefront API
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
SHOPIFY_API_VERSION="2025-04"

NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
NEXT_PUBLIC_SHOPIFY_API_VERSION="2025-04"

# =============================================================================
# GOKWIK CONFIGURATION
# =============================================================================
NEXT_PUBLIC_GOKWIK_MID="your-merchant-id"
NEXT_PUBLIC_STORE_ID="your-merchant-id"
NEXT_PUBLIC_MERCHANT_ID="your-merchant-id"

NEXT_PUBLIC_GOKWIK_ENVIRONMENT="qa"            # qa, sandbox, or production
NEXT_PUBLIC_GOKWIK_SCRIPT_URL="https://qa.pdp.gokwik.co"
NEXT_PUBLIC_GOKWIK_ENABLED=true

# =============================================================================
# CUSTOM BACKEND API ENDPOINTS
# =============================================================================
NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL="https://your-api/products"
NEXT_PUBLIC_CUSTOM_API_CART_URL="https://your-api/orders"
NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL="https://your-api/order-history"
```

See **[ENV_GUIDE.md](./ENV_GUIDE.md)** for complete documentation of all environment variables.

## Project Structure

```
storefront-starter/
├── .github/                 # GitHub Actions CI workflows
├── .husky/                  # Git hooks (pre-commit, commit-msg)
├── .perf/                   # Performance validation scripts
├── .prompts/                # AI prompt templates
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── bootstrap/           # App initialization (builder, i18n, middleware)
│   ├── config/              # Commerce and app configuration
│   ├── integrations/        # Platform integrations (checkout, auth)
│   │   ├── cart-drawer-*/   # Cart drawer implementations
│   │   ├── checkout-*/      # Checkout integrations (GoKwik)
│   │   └── kwikpass-*/      # Authentication (KwikPass)
│   ├── locales/             # i18n translation files
│   ├── themes/              # Theme configurations and templates
│   │   └── dawn/            # Default theme
│   │       ├── templates/   # Page templates (home, products, etc.)
│   │       ├── locales/     # Theme-specific translations
│   │       └── theme.json   # Theme configuration
│   ├── ui/                  # Shared UI components (atomic, components)
│   ├── utils/               # Utility functions
│   └── widgets/             # Widget components
│       └── common/          # Shared widgets (Header, Footer, PageContent)
├── .eslintrc.json           # ESLint with performance rules
├── .prettierrc              # Prettier configuration
└── package.json
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        STOREFRONT STARTER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Shopify    │    │   GoKwik     │    │   GoKwik     │       │
│  │  Storefront  │    │    Cart      │    │   Checkout   │       │
│  │     API      │    │   Service    │    │   (PDP SDK)  │       │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘       │
│         │                   │                   │                │
│         ▼                   ▼                   ▼                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    DATA LAYER                            │    │
│  │  • Product data from Shopify                            │    │
│  │  • Cart management via GoKwik                           │    │
│  │  • Checkout via GoKwik PDP SDK                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   WIDGET SYSTEM                          │    │
│  │  • Header, Footer, PageContent                          │    │
│  │  • A/B variant support                                  │    │
│  │  • Theme-aware styling                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## CLI Commands

### Development

```bash
bun run dev              # Start dev server (port 4344)
bun run dev:watch        # Dev with auto-regeneration
bun run build            # Production build
bun run start            # Start production server
```

### Code Generation

```bash
bun run generate         # Generate all types (widgets, templates, i18n)
bun run g:widget Name    # Create new widget
bun run g:template name  # Create new template
bun run g:theme name     # Create new theme
```

### Performance Validation

```bash
bun run perf:check       # Run all performance validations
bun run perf:score       # Calculate widget performance scores
bun run perf:score:all   # Score all widgets (not just staged)
bun run perf:rules       # List all performance rules
bun run perf:audit       # Audit third-party scripts
```

### Individual Validators

```bash
bun run validate:widget      # Validate widget structure
bun run validate:template    # Validate template structure
bun run validate:route       # Validate route structure
bun run validate:assets      # Validate asset sizes
```

### Code Quality

```bash
bun run lint             # Run ESLint
bun run lint:fix         # Fix ESLint issues
bun run format           # Format with Prettier
bun run check-types      # TypeScript type check
```

## Performance Governance

This project includes a comprehensive performance governance system to ensure Core Web Vitals compliance.

### Pre-commit Hooks (Local)

When you commit, the following checks run automatically:

1. **Widget Structure Validation** - Ensures proper widget file structure
2. **Template Validation** - Validates template configuration
3. **Route Validation** - Checks page route structure
4. **ESLint** - Code quality and performance rules
5. **Asset Validation** - Image < 500KB, Video < 5MB, Font < 100KB
6. **Performance Scoring** - Minimum score: 75/100
7. **Type Generation** - Auto-generates widget/template types
8. **Type Check** - TypeScript validation
9. **Build** - Production build verification

### GitHub Actions CI (PR)

When you create a PR, the same validations run in CI. **This cannot be bypassed** - PRs will fail if performance requirements aren't met.

### ESLint Performance Rules

The `.eslintrc.json` includes rules for:

- **LCP Protection** - Block render-blocking resources
- **CLS Prevention** - Require dimensions on images/videos
- **INP Optimization** - Block heavy dependencies
- **Memory Leak Prevention** - Warn on cleanup-required patterns
- **Static Page Enforcement** - Block dynamic APIs in static pages

### Blocked Dependencies

The following are blocked in widgets/themes:

| Package           | Reason           | Alternative                     |
| ----------------- | ---------------- | ------------------------------- |
| lodash            | 70KB bundle      | Native JS or lodash-es          |
| moment            | 70KB bundle      | Intl.DateTimeFormat or date-fns |
| axios             | Direct HTTP      | Use dataSources                 |
| jquery            | DOM manipulation | React patterns                  |
| framer-motion     | 30KB bundle      | CSS transitions                 |
| styled-components | Runtime CSS      | Tailwind                        |

See `.perf/allowed-packages.json` for the full allowlist.

## Creating Content

### New Widget

```bash
bun run g:widget ProductCard
```

Creates:

```
src/widgets/common/ProductCard/
├── index.tsx           # Main component with variant switching
├── types.ts            # TypeScript interfaces
├── variants.ts         # Variant registry
└── V1/
    └── index.tsx       # Default variant implementation
```

### New Template

```bash
bun run g:template checkout
```

Creates template in `src/themes/dawn/templates/checkout/default.ts`

### New Theme

```bash
bun run g:theme minimal
```

Creates a complete theme structure with templates and locales.

## Integrations

### GoKwik Checkout

The storefront uses GoKwik's PDP SDK for checkout. Configuration:

```env
NEXT_PUBLIC_GOKWIK_MID="your-merchant-id"
NEXT_PUBLIC_GOKWIK_ENVIRONMENT="qa"          # qa, sandbox, production
NEXT_PUBLIC_GOKWIK_SCRIPT_URL="https://qa.pdp.gokwik.co"
```

| Environment | Script URL                      |
| ----------- | ------------------------------- |
| QA          | `https://qa.pdp.gokwik.co`      |
| Sandbox     | `https://sandbox.pdp.gokwik.co` |
| Production  | `https://pdp.gokwik.co`         |

### Custom Backend APIs

The storefront connects to these microservices:

| Service         | Environment Variable                       | Purpose            |
| --------------- | ------------------------------------------ | ------------------ |
| Product Service | `NEXT_PUBLIC_CUSTOM_API_PRODUCT_URL`       | Product catalog    |
| Cart Service    | `NEXT_PUBLIC_CUSTOM_API_CART_URL`          | Cart operations    |
| Order History   | `NEXT_PUBLIC_CUSTOM_API_ORDER_HISTORY_URL` | Order tracking     |
| Inventory       | `NEXT_PUBLIC_CUSTOM_API_INVENTORY_URL`     | Stock availability |
| Discounts       | `NEXT_PUBLIC_GOKWIK_DISCOUNT_API_URL`      | Coupon/discounts   |

### Shopify (Optional)

If using Shopify as product data source:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
```

## Commit Message Format

This project enforces [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[scope]: <description>

Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
```

Examples:

```
feat: add product zoom widget
fix(cart): resolve quantity update bug
chore: update dependencies
```

## Documentation

| File                     | Description                         |
| ------------------------ | ----------------------------------- |
| `README.md`              | This file - project overview        |
| `ENV_GUIDE.md`           | Environment variables guide         |
| `GETTING_STARTED.md`     | Detailed setup guide                |
| `SYSTEM_ARCHITECTURE.md` | Complete architecture documentation |
| `AGENTS.md`              | AI agent instructions               |
| `CLAUDE.md`              | Claude Code quick reference         |
| `.prompts/`              | Reusable AI prompt templates        |

## Receiving Updates

```bash
# Add upstream remote (first time)
git remote add upstream https://github.com/primathontech/storefront-starter.git

# Fetch and merge updates
git fetch upstream
git merge upstream/main
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Data Fetching**: SWR
- **i18n**: next-intl
- **Commerce**: Shopify Hydrogen React (for product data)
- **Checkout**: GoKwik PDP SDK
- **Icons**: Radix UI Icons
- **Carousel**: Embla Carousel

## License

MIT
