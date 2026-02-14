# Storefront Starter

A production-ready, performance-optimized e-commerce storefront built with **Next.js 14**, featuring a modular widget system, theme support, and built-in performance governance.

## Features

- **Next.js 14** with App Router and Server Components
- **Modular Widget System** - Reusable, configurable components with A/B variant support
- **Theme Support** - Easy customization via JSON configuration
- **Multi-platform** - Works with Shopify or custom backends
- **Performance Governance** - Built-in validation, scoring, and CI enforcement
- **i18n Ready** - Built-in internationalization with next-intl
- **GoKwik Integration** - Checkout and authentication

## Quick Start

```bash
# Clone the repository
git clone https://github.com/primathontech/storefront-starter.git my-store
cd my-store

# Install dependencies
bun install

# Copy environment example
cp .env.example .env.local

# Start development server
bun run dev

# Open http://localhost:4344
```

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

## Environment Variables

```env
# Commerce Platform
PLATFORM=shopify                    # or 'custom'
MERCHANT_NAME=dawn                  # Theme/merchant name

# Shopify Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-token
SHOPIFY_API_VERSION=2025-04

# GoKwik Integration (optional)
NEXT_PUBLIC_GOKWIK_MID=your-merchant-id
NEXT_PUBLIC_GOKWIK_ENVIRONMENT=sandbox
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
- **Commerce**: Shopify Hydrogen React
- **Icons**: Radix UI Icons
- **Carousel**: Embla Carousel

## License

MIT
