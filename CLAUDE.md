# Claude Code Instructions for Storefront Builder

## Required Reading Before Any Task

Before generating pages, widgets, templates, or integrations, **ALWAYS read these files first**:

1. **`src/SYSTEM_ARCHITECTURE.md`** - How templates, widgets, themes work together
2. **`AGENTS.md`** - Package APIs and common patterns

## Quick Command Reference

| Task                 | Documentation Section                                            |
| -------------------- | ---------------------------------------------------------------- |
| Create new page      | `SYSTEM_ARCHITECTURE.md` → "Quick Start: Create a New Page"      |
| Create new widget    | `SYSTEM_ARCHITECTURE.md` → "Creating New Widgets"                |
| Create new template  | `SYSTEM_ARCHITECTURE.md` → "Creating New Templates"              |
| Add integration      | `src/integrations/README.md`                                     |
| Understand data flow | `SYSTEM_ARCHITECTURE.md` → "Page Rendering Flow"                 |
| **Add to cart**      | `SYSTEM_ARCHITECTURE.md` → "Commerce & Cart Flow"                |
| **Checkout flow**    | `SYSTEM_ARCHITECTURE.md` → "Commerce & Cart Flow"                |
| **Data fetching**    | `SYSTEM_ARCHITECTURE.md` → "Commerce & Cart Flow" → "Data Layer" |
| **CLI commands**     | `SYSTEM_ARCHITECTURE.md` → "CLI Commands"                        |

## Essential CLI Commands

```bash
# Generate/regenerate manifests (REQUIRED after creating widgets/templates)
bun run generate:widgets     # After creating/modifying widgets
bun run generate:templates   # After creating/modifying templates
bun run generate:i18n        # After modifying translations
bun run generate             # Run all generators

# Scaffold new components
bun run g widget MyWidget    # Create new widget scaffold
bun run g template about     # Create new template scaffold
bun run g theme custom       # Create new theme scaffold

# Development
bun run dev                  # Start dev server
bun run dev:watch            # Dev server + auto-regenerate on changes

# Validation (before committing)
bun run perf:check           # Run all validations
```

## File Patterns

### New Page

1. Template: `src/themes/bblunt-2/templates/{page-name}/default.ts`
2. Next.js Page: `src/app/{page-name}/page.tsx`
3. Translations (optional): `src/themes/bblunt-2/locales/pages/{page-name}/en.json`

### New Widget

1. Run: `bun run g widget {WidgetName}` (scaffolds the folder)
2. Or manually create: `src/widgets/common/{WidgetName}/`
3. Files: `index.tsx`, `variants.ts`, `types.ts`, `V1/index.tsx`
4. Run: `bun run generate:widgets` (REQUIRED - updates manifest)

### New Integration

1. Folder: `src/integrations/{feature}-{platform}/`
2. Follow pattern from existing integrations

## Architecture Rules

1. **Widgets use variants** - Always support `settings.variant` prop (`v1`, `v2`, etc.)
2. **Templates define pages** - Use `PageConfig` with `dataSources` and `sections`
3. **Translations use `t:` prefix** - e.g., `"t:common.header.title"`
4. **Scripts load in layout** - Never lazy-load SDK scripts in button components
5. **Use existing patterns** - Copy from `templates/home/default.ts` for sections

## Before You Code

Ask yourself:

- [ ] Have I read the relevant documentation?
- [ ] Am I following the existing naming conventions?
- [ ] Am I using the variant pattern for widgets?
- [ ] Am I copying patterns from existing similar files?

## Prompt Templates (Use These!)

Ready-to-use prompt templates are in `.prompts/` folder:

| Task                    | Prompt Template             |
| ----------------------- | --------------------------- |
| Create new page         | `.prompts/create-page.md`   |
| Create new widget       | `.prompts/create-widget.md` |
| Add section to template | `.prompts/add-section.md`   |

### How to Use Prompt Templates

**Option 1: Reference the template**

```
Create a new "Contact Us" page at /contact.
Follow the instructions in .prompts/create-page.md
```

**Option 2: Fill in the template**

```
Create a new page:
- Page name: Contact Us
- URL path: /contact
- Sections: Hero banner, Contact form, FAQ

Follow the instructions in .prompts/create-page.md
```

## Example Prompts That Work Well

### Create a New Page

```
Create a new "Contact Us" page at /contact with:
- Header (copy from home template)
- A hero section with title and description
- A contact form widget
- FAQ section
- Footer (copy from home template)

Read src/SYSTEM_ARCHITECTURE.md first, then follow "Quick Start: Create a New Page"
```

### Create a New Widget

```
Create a new "TeamMembers" widget that displays team member cards.
- Support v1 variant (grid layout)
- Props: members array, columns setting

Read src/SYSTEM_ARCHITECTURE.md section "Creating New Widgets"
```

### Add Section to Existing Page

```
Add a testimonials section to the home page template.
- Use the existing Testimonials widget (WIDGET_TYPES.Testimonials)
- Place it before the footer
- Use v1 variant

Read src/SYSTEM_ARCHITECTURE.md section "Templates"
```

### Add to Cart Functionality

```
Add an "Add to Cart" button to my ProductCard component.
- Use useCart hook from @shopkit/cart
- Fire analytics event after adding
- Show loading state

Read src/SYSTEM_ARCHITECTURE.md section "Commerce & Cart Flow"
```

### Implement Checkout

```
How does checkout work in this app?
What files do I need to modify to customize the checkout button?

Read src/SYSTEM_ARCHITECTURE.md section "Commerce & Cart Flow" → "Checkout Integration"
```
