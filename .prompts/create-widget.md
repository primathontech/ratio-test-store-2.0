# Prompt: Create New Widget

## Instructions for AI Agent

1. First, read `src/SYSTEM_ARCHITECTURE.md` section "Creating New Widgets"
2. Then create the following:

### Task: Create a new widget called `{WIDGET_NAME}`

**Widget Requirements:**

- Widget name: {WIDGET_NAME}
- Purpose: {DESCRIPTION}
- Props/Settings: {LIST_PROPS}
- Variants: {LIST_VARIANTS}

### Files to Create:

1. **Main component:** `src/widgets/common/{WIDGET_NAME}/index.tsx`

   ```typescript
   "use client";
   import React from "react";
   import { {WIDGET_NAME}Variants } from "./variants";
   import { {WIDGET_NAME}Props } from "./types";

   export function {WIDGET_NAME}({ data, settings, className, locale }: {WIDGET_NAME}Props) {
     const variant = settings.variant || "v1";
     const VariantComponent = {WIDGET_NAME}Variants[variant];

     if (!VariantComponent) {
       return <{WIDGET_NAME}Variants.default {...{ data, settings, className, locale }} />;
     }

     return <VariantComponent data={data} settings={settings} className={className} locale={locale} />;
   }
   ```

2. **Types:** `src/widgets/common/{WIDGET_NAME}/types.ts`
   - Define props interface with data, settings, className, locale

3. **Variants registry:** `src/widgets/common/{WIDGET_NAME}/variants.ts`
   - Export variant map with v1, default

4. **V1 variant:** `src/widgets/common/{WIDGET_NAME}/V1/index.tsx`
   - Implement the actual UI

5. **Run generator:** `bun run generate:widgets`

### Example Usage:

Replace placeholders:

- `{WIDGET_NAME}` = "TeamMembers"
- `{DESCRIPTION}` = "Displays team member cards in a grid"
- `{LIST_PROPS}` = "members: array, columns: number, showBio: boolean"
- `{LIST_VARIANTS}` = "v1 (grid), v2 (carousel)"

---

## Template for Your Request:

```
Create a new widget:
- Widget name: [WidgetName in PascalCase]
- Purpose: [What does it do?]
- Props: [List the settings it should accept]
- Variants: [v1, v2, etc. with descriptions]

Follow the instructions in .prompts/create-widget.md
```
