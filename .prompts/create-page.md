# Prompt: Create New Page

## Instructions for AI Agent

1. First, read `src/SYSTEM_ARCHITECTURE.md` section "Quick Start: Create a New Page"
2. Then create the following:

### Task: Create a new page at `/{PAGE_PATH}`

**Page Requirements:**
- Page name: {PAGE_NAME}
- URL path: /{PAGE_PATH}
- Sections needed: {LIST_SECTIONS}

### Files to Create:

1. **Template file:** `src/themes/dawn/templates/{PAGE_PATH}/default.ts`
   - Copy Header section from `templates/home/default.ts` (lines 186-225)
   - Add content sections as specified
   - Copy Footer section from `templates/home/default.ts` (lines 1044-1091)

2. **Next.js page:** `src/app/{PAGE_PATH}/page.tsx`
   - Use the pattern from existing pages
   - Set `templateName: "{PAGE_PATH}"` in routeContext

3. **Translations (if needed):** `src/themes/dawn/locales/pages/{PAGE_PATH}/en.json`

### Example Usage:

Replace placeholders:
- `{PAGE_NAME}` = "About Us"
- `{PAGE_PATH}` = "about"
- `{LIST_SECTIONS}` = "Hero banner, Team section, FAQ"

---

## Template for Your Request:

```
Create a new page:
- Page name: [Your page name]
- URL path: /[your-path]
- Sections: [List the sections you want]

Follow the instructions in .prompts/create-page.md
```
