---
name: image-webp-optimizer
description: Use when converting images (JPG, PNG, GIF, BMP) to WebP format, optimizing image assets for web performance, replacing legacy image references in the codebase with WebP equivalents, or user says "optimize images", "convert to webp", "reduce image size"
---

# Image WebP Optimizer

Convert images to WebP using `cwebp`, replace all codebase references, remove originals, and report savings.

## Command

```
/image-webp-optimizer <path1> [path2 ...] [--quality N]
```

**Arguments:**
- `<path>` — One or more image files or directories (required). Directories are searched recursively.
- `--quality N` — WebP quality 1–100 (default: 80)

**Examples:**
```
/image-webp-optimizer src/assets/hero.jpg
/image-webp-optimizer src/assets/hero.jpg public/images/banner.png
/image-webp-optimizer public/images/
/image-webp-optimizer src/assets/ --quality 90
```

## Process

Follow these 4 steps strictly in order for each invocation.

### Step 1 — Parse Arguments

1. Split the args string into tokens
2. Extract `--quality N` if present (default: 80)
3. Remaining tokens are file/directory paths (relative to project root)

**Quality safeguards:**
- If quality < 60 → warn user and clamp to 60: `"Quality clamped to 60 — values below this cause severe artifacts"`
- If quality < 70 → warn: `"Low quality setting may cause visible artifacts"`

### Step 2 — Collect Target Files

For each path argument:
- **If file:** Add to conversion list if extension is `.jpg`, `.jpeg`, `.png`, `.gif`, or `.bmp`
- **If directory:** Use Glob to find `**/*.{jpg,jpeg,png,gif,bmp}` recursively, add all matches
- **Skip** any `.webp` files silently
- **Error** if a path doesn't exist — report and continue with remaining paths

If no convertible files found, print `"No convertible images found"` and stop.

### Step 3 — Convert Each File

For each file in the conversion list, run:

```bash
cwebp -q <quality> "<input-path>" -o "<output-path>"
```

Where `<output-path>` replaces the original extension with `.webp` (e.g., `hero.jpg` → `hero.webp`).

After conversion, check sizes using `stat` or `ls -l`:
- Record **before** size (original) and **after** size (webp output)
- If output is **larger** than original → delete the `.webp` output, mark file as `skipped — original smaller`, and move to next file
- If `cwebp` command fails → mark as `failed`, move to next file

### Step 4 — Replace References in Codebase

For each **successfully converted** file:

1. Get the original filename (e.g., `hero.jpg`)
2. Use **Grep** to search for that filename across `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.css`, `*.html`, `*.vue` files in the project
3. For each match found, use **Edit** to replace the old extension with `.webp`
   - Handles: `src="..."`, `url(...)`, `import "..."`, `require("...")`
4. If **no references found** → log: `"Warning: No codebase references found for <filename>"`

### Step 5 — Remove Originals

For each successfully converted file where the `.webp` is smaller:

1. Verify the `.webp` file exists on disk (use `ls`)
2. Verify all reference replacements in Step 4 succeeded
3. **Only then** delete the original: `rm "<original-path>"`

**Never delete if:**
- Conversion failed
- Output was larger (already cleaned up in Step 3)
- `.webp` file doesn't exist on disk

### Step 6 — Print Report

Print a summary table:

```
Optimization Report
----------------------------------------
 File               Before     After     Saved
----------------------------------------
 hero.jpg           420 KB  ->  89 KB    78.8%
 banner.png         210 KB  ->  41 KB    80.5%
 logo.png           skipped — original smaller
 broken.gif         FAILED
----------------------------------------
 Total Converted:   2
 Total Before:      630 KB
 Total After:       130 KB
 Total Saved:       500 KB (79.4%)
```

Format sizes in human-readable units (KB/MB). Include skipped and failed files in the table with their status.

## Safety Rules

1. **Never delete originals** unless `.webp` exists AND is smaller
2. **Never convert** files already in `.webp` format
3. **Minimum quality floor** of 60 to prevent severe quality loss
4. **Warn on low quality** (below 70) before proceeding
5. **Report all failures** — never silently skip files
6. **Verify before cleanup** — check `.webp` exists on disk before removing original

## Common Mistakes

| Mistake | Prevention |
|---------|-----------|
| Deleting original when webp is larger | Always compare sizes first; delete webp output instead |
| Missing references in CSS `url()` | Grep for bare filename, not just `src=` patterns |
| Converting already-optimized PNGs | Check if webp output is larger; skip if so |
| Breaking imports with wrong path | Replace only the extension, not the full path |
| Quality too low causing artifacts | Enforce floor of 60, warn below 70 |
