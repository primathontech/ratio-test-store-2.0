# Prompt: Add Section to Template

## Instructions for AI Agent

1. First, read `src/SYSTEM_ARCHITECTURE.md` section "Templates"
2. Then modify the specified template file

### Task: Add a new section to `{TEMPLATE_PATH}`

**Section Requirements:**
- Section name: {SECTION_NAME}
- Widget to use: {WIDGET_TYPE}
- Position: {POSITION} (e.g., "after banner carousel", "before footer")
- Settings: {WIDGET_SETTINGS}

### Steps:

1. **Open template file:** `src/themes/dawn/templates/{TEMPLATE_PATH}/default.ts`

2. **Find the position** to insert the new section

3. **Add section config:**
   ```typescript
   {
     id: "{section-id}",
     name: "{SECTION_NAME}",
     type: SECTION_TYPES.CONTENT_SECTION,
     settings: {
       layout: SECTION_LAYOUT_OPTIONS.FULL,  // or PAGE
       responsive: {
         mobile: { padding: { top: 24, right: 0, bottom: 24, left: 0 } },
         tablet: { padding: { top: 40, right: 0, bottom: 40, left: 0 } },
         desktop: { padding: { top: 56, right: 0, bottom: 56, left: 0 } },
       },
     },
     widgets: [
       {
         id: "{widget-id}",
         name: "{SECTION_NAME} Widget",
         type: WIDGET_TYPES.{WIDGET_TYPE},
         dataSourceKey: "{data-source-key}",  // if needed
         settings: {
           variant: "v1",
           // ... widget-specific settings
         },
       },
     ],
   },
   ```

4. **Add data source** (if the widget needs data):
   ```typescript
   dataSources: {
     // ... existing sources
     newDataSource: {
       type: DATA_SOURCE_TYPES.COLLECTION_BY_HANDLES,
       params: { handles: ["..."], productLimit: 12 },
       required: false,
     },
   },
   ```

5. **Add translations** (if using `t:` keys):
   - Add to `src/themes/dawn/locales/pages/{page}/en.json`

### Example Usage:

Replace placeholders:
- `{TEMPLATE_PATH}` = "home"
- `{SECTION_NAME}` = "Featured Testimonials"
- `{WIDGET_TYPE}` = "Testimonials"
- `{POSITION}` = "before footer"
- `{WIDGET_SETTINGS}` = "variant: v1, autoplay: true"

---

## Template for Your Request:

```
Add a new section to the [template-name] template:
- Section name: [Name]
- Widget: [WIDGET_TYPES.WidgetName]
- Position: [where in the page]
- Settings: [list widget settings]

Follow the instructions in .prompts/add-section.md
```
