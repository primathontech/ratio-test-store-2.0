# Storefront Starter

A production-ready e-commerce storefront built with Next.js 14, featuring a modular widget system, theme support, and seamless integration with Shopify or custom backends.

## Quick Start

### Option 1: Clone from GitHub (Recommended)

```bash
# Clone the repository
git clone https://github.com/primathontech/storefront-starter.git my-store
cd my-store

# Copy environment example
cp .env.example .env.local

# Install dependencies
bun install

# Start development server
bun run dev

# Open http://localhost:4344
```

### Option 2: Download ZIP

If you downloaded the ZIP file instead of cloning:

```bash
# Extract and navigate to folder
cd storefront-starter

# Initialize git (required for version control)
git init
git add .
git commit -m "Initial commit from storefront-starter template"

# Copy environment example
cp .env.example .env.local

# Install dependencies
bun install

# Start development server
bun run dev
```

## Features

- **Next.js 14** with App Router
- **Modular Widget System** - Reusable, configurable components
- **Theme Support** - Easy customization via theme configuration
- **Multi-platform** - Works with Shopify or custom backends
- **GoKwik Integration** - Checkout and authentication
- **i18n Ready** - Built-in internationalization support
- **Performance Optimized** - Image caching, code splitting

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── bootstrap/              # App initialization (builder, i18n)
├── config/                 # Commerce and app configuration
├── integrations/           # Platform integrations (GoKwik, etc.)
├── themes/                 # Theme configurations and templates
├── ui/                     # Shared UI components
├── utils/                  # Utility functions
└── widgets/                # Widget components
    └── common/             # Shared widgets (Header, Footer, etc.)
```

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Commerce Platform (choose one)
NEXT_PUBLIC_COMMERCE_PLATFORM=custom  # or 'shopify'

# For Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token

# For Custom Backend
NEXT_PUBLIC_CUSTOM_API_URL=https://your-api.com

# GoKwik Integration (optional)
NEXT_PUBLIC_GOKWIK_MID=your-merchant-id
NEXT_PUBLIC_GOKWIK_ENVIRONMENT=sandbox
```

See `SYSTEM_ARCHITECTURE.md` for detailed configuration options.

## Development

### CLI Commands

```bash
# Generate widgets/templates types
bun run generate

# Create new widget
bun run g:widget MyWidget

# Create new template
bun run g:template my-page

# Watch for changes
bun run dev:watch

# Validate performance
bun run perf:check
```

### Creating a New Page

1. Create template: `src/themes/dawn/templates/my-page/default.ts`
2. Create page: `src/app/my-page/page.tsx`
3. Run `bun run generate:templates`

See `SYSTEM_ARCHITECTURE.md` for detailed guides.

## Receiving Updates

This project may receive updates from the upstream repository. To get updates:

### First Time Setup

```bash
# Add upstream remote
git remote add upstream https://github.com/primathontech/storefront-starter.git
```

### Getting Updates

```bash
# Fetch latest changes
git fetch upstream

# Merge updates (resolve conflicts if needed)
git merge upstream/main

# Or rebase (cleaner history)
git rebase upstream/main
```

### Protected Files

These files are typically customized per project and may cause conflicts:

- `.env.local` - Environment configuration
- `src/config/commerce.ts` - Commerce settings
- `src/themes/*/` - Theme customizations

When merging, keep your local versions of these files.

## Documentation

- `SYSTEM_ARCHITECTURE.md` - Complete architecture documentation
- `AGENTS.md` - AI agent instructions
- `CLAUDE.md` - Claude Code quick reference
- `.prompts/` - Reusable prompt templates

## Support

For issues or questions, contact the platform team.
