# Personal Site - Static Site Generator

## Project Overview

This is a static site generator built with Bun and TypeScript that converts Markdown files into a personal website. The site features a modern, minimal, responsive design with a blue color theme.

## Architecture

### Core Components

1. **Build System** (`src/builder.ts`)
   - Orchestrates the entire build process
   - Discovers markdown files in `pages/` directory
   - Processes each page through the markdown parser
   - Copies assets and CSS to output directory
   - Output: `dist/` directory with static HTML files

2. **Markdown Processor** (`src/markdown.ts`)
   - Parses markdown content using marked.js
   - Extracts title from first H1 or H2 heading
   - Generates table of contents from H2 headings
   - Processes custom container syntax (`:::container-name`)
   - Converts image paths from relative to absolute
   - Adds IDs to H2 headings for anchor linking

3. **Template System** (`src/template.ts`)
   - Injects content into HTML template
   - Manages navigation with active state
   - Conditionally renders table of contents sidebar
   - Handles dynamic placeholders: `{{TITLE}}`, `{{CONTENT}}`, `{{NAV}}`, `{{TOC}}`, `{{BODY_CLASS}}`, `{{YEAR}}`

4. **Type Definitions** (`src/types.ts`)
   - PageMetadata: File metadata and output paths (including optional title override)
   - BuildConfig: Build configuration with optional minify flag
   - TableOfContentsItem: TOC structure

5. **Constants** (`src/constants.ts`)
   - PAGE_TITLES: Page title definitions for `<title>` tag
   - NAV_ITEMS: Navigation items configuration
   - NavItem: Navigation item type definition
   - Centralizes site-wide configuration for easy maintenance

6. **Minification** (`src/minify.ts`)
   - minifyHTML: Removes comments, whitespace, and newlines from HTML
   - minifyCSS: Removes comments, whitespace, and unnecessary semicolons from CSS
   - Applied only in production builds

## Custom Markdown Extensions

### Profile Header Container

Syntax:
```markdown
:::profile-header
![Icon](./assets/icon.webp)
Handle Name
Message text here
:::
```

Renders:
```html
<div class="profile-header">
  <div class="profile-icon-wrapper">
    <img src="/assets/icon.webp" alt="Icon" class="profile-icon" />
    <div class="profile-name">Handle Name</div>
  </div>
  <div class="profile-message">Message text here</div>
</div>
```

Layout:
- Desktop: Icon with name below on left, speech bubble on right
- Mobile: Vertical stack with icon, name, and speech bubble

### Scrollable List Container

Syntax:
```markdown
:::scrollable-list
- Item 1
- Item 2
- Item 3
:::
```

Renders a scrollable list container with max height of ~5.5 items, custom scrollbar, and fade gradient at bottom.

## Design System

### Color Palette (Blue Theme)

```css
--color-primary: #2563eb;        /* Primary blue */
--color-primary-dark: #1e40af;   /* Dark blue for text */
--color-primary-light: #dbeafe;  /* Light blue for backgrounds */
--color-background: #ffffff;     /* Page background */
--color-surface: #f8fafc;        /* Card/surface background */
--color-text: #1e293b;           /* Primary text */
--color-text-muted: #64748b;     /* Secondary text */
--color-border: #e2e8f0;         /* Borders */
```

### Layout

- **Max Width (Standard)**: 800px
- **Max Width (With Sidebar)**: 1200px
- **Sidebar Width**: 240px
- **Border Radius**: 8px

### Spacing Scale

```css
--space-xs: 0.5rem;   /* 8px */
--space-sm: 1rem;     /* 16px */
--space-md: 1.5rem;   /* 24px */
--space-lg: 2rem;     /* 32px */
--space-xl: 3rem;     /* 48px */
--space-2xl: 4rem;    /* 64px */
```

### Typography

- **Base Font Size**: 16px (15px on tablet, 14px on mobile)
- **Line Height**: 1.6
- **Font Family**: System fonts with fallback to Noto Sans JP

## Component Specifications

### Site Header

- Sticky positioning at top (z-index: 100)
- Contains site title and navigation
- 2px blue border at bottom
- Collapses to vertical layout on mobile (≤768px)

### Navigation

- Active page highlighted with primary blue background
- Hover state with light blue background
- External links open in new tab with `rel="noopener noreferrer"`
- Three navigation items:
  - Home (/)
  - Profile (/profile.html)
  - Side Oripathy (external link)

### Table of Contents Sidebar

- Only shown when page has 2+ H2 headings
- Sticky positioning below header
- Grid layout: 240px sidebar + flexible content area
- Responsive: Converts to horizontal chip layout on tablet (≤1024px), vertical on mobile

### Profile Header Component

Desktop Layout:
```
[Icon Image]  [  Speech Bubble  ]
[Handle Name]
```

- Icon: 120px circle (100px on tablet, 80px on mobile)
- Name: Small text (0.875rem) below icon
- Speech bubble: White background with shadow, triangle pointer on left pointing to icon
- Background: Gradient from light blue to surface color

Mobile Layout (≤768px):
```
[Icon Image]
[Handle Name]
[Speech Bubble]
```

### Scrollable List

- Max height: 5.5 items visible
- Custom scrollbar (8px width, blue thumb)
- Fade gradient at bottom
- White background with border

## Content Processing Pipeline

1. **Read Markdown File**
   - Load file from `pages/*.md`

2. **Process Content**
   - Normalize line endings (CRLF → LF)
   - Extract title from first H1/H2
   - Generate TOC from H2 headings
   - Convert image paths: `./assets/` → `/assets/`
   - Process custom containers (`:::profile-header`, `:::scrollable-list`)
   - Add IDs to H2 headings for anchor links

3. **Convert to HTML**
   - Parse markdown using marked.js
   - Custom containers already converted to HTML in step 2

4. **Inject into Template**
   - Replace `{{TITLE}}` with page title (from constants or extracted from markdown)
   - Replace `{{CONTENT}}` with HTML content
   - Replace `{{NAV}}` with navigation HTML (active state based on current page)
   - Replace `{{TOC}}` with sidebar HTML (if 2+ items)
   - Replace `{{BODY_CLASS}}` with "has-sidebar" (if 2+ TOC items)
   - Replace `{{YEAR}}` with current year

5. **Write Output**
   - Write HTML to `dist/*.html`

## Responsive Breakpoints

- **1024px**: Sidebar converts to horizontal layout
- **768px**: Header and navigation stack vertically, profile header stacks vertically
- **480px**: Further size reductions, smaller containers

## Build Commands

```bash
bun run build       # Build static site (development mode, no minification)
bun run build:prod  # Build for production (with HTML/CSS minification)
bun run serve       # Start local dev server on port 3000
bun run dev         # Build and serve
bun run clean       # Remove dist/ directory
```

## File Structure

```
personal-site/
├── pages/              # Markdown source files
│   ├── index.md
│   └── profile.md
├── template/           # Template and assets
│   ├── template.html   # HTML template with placeholders
│   ├── styles.css      # Complete CSS with design system
│   └── assets/         # Images and static files
├── src/                # TypeScript source
│   ├── builder.ts      # Build orchestration
│   ├── markdown.ts     # Markdown processing
│   ├── template.ts     # Template injection
│   ├── minify.ts       # HTML/CSS minification
│   ├── constants.ts    # Site-wide constants (page titles, nav items)
│   └── types.ts        # TypeScript interfaces
├── dist/               # Build output (gitignored)
├── index.ts            # Build script entry point (development)
├── index.prod.ts       # Build script entry point (production with minify)
└── serve.ts            # Development server
```

## Important Implementation Details

### Line Ending Normalization

Windows uses CRLF line endings which can break regex patterns. All content is normalized to LF (`\n`) before processing:

```typescript
content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
```

### Custom Container Processing

Custom containers are processed BEFORE marked.js parsing to avoid conflicts. The regex pattern matches multi-line content:

```typescript
/:::container-name\n([\s\S]*?)\n:::/g
```

### H2 Heading ID Generation

H2 headings are converted directly to HTML (not markdown with `{#id}` syntax) to avoid the syntax appearing in rendered output:

```typescript
content.replace(/^##\s+(.+)$/gm, (match, text) => {
  const id = generateId(text);
  return `<h2 id="${id}">${text}</h2>`;
});
```

### CSS Selector Specificity

The `has-sidebar` class only affects main content, not header/footer:

```css
/* Correct: Only affects main content */
body.has-sidebar .main-content .container {
  display: grid;
}

/* Wrong: Would affect all containers including header */
body.has-sidebar .container {
  display: grid;
}
```

### Profile Icon Shadow

The profile icon previously had a blue border that created a square appearance on round images. This was removed:

```css
.profile-icon {
  box-shadow: none !important; /* Remove any shadow/border */
}
```

### Scroll Padding for Anchors

Sticky header covers content when jumping to anchors. Added scroll padding:

```css
html {
  scroll-padding-top: 96px; /* Offset for sticky header */
}
```

### Production Build Minification

HTML and CSS files are minified in production builds to reduce file size:

```typescript
// src/minify.ts
export function minifyHTML(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")  // Remove comments
    .replace(/>\s+</g, "><")          // Remove whitespace between tags
    .trim()
    .replace(/\s{2,}/g, " ");         // Collapse multiple spaces
}

export function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")  // Remove comments
    .replace(/\s*([{}:;,])\s*/g, "$1") // Remove whitespace around symbols
    .replace(/;}/g, "}")                // Remove trailing semicolons
    .trim()
    .replace(/\s{2,}/g, " ");          // Collapse multiple spaces
}
```

Minification is controlled by the `minify` flag in `BuildConfig`:
- Development build (`bun run build`): `minify: false` (or omitted)
- Production build (`bun run build:prod`): `minify: true`

## Known Issues and Solutions

### Issue: Custom containers not rendering
**Cause**: CRLF line endings in Windows not matching regex
**Solution**: Normalize line endings before processing

### Issue: `{#id}` appearing in output
**Cause**: marked.js doesn't support `{#id}` syntax by default
**Solution**: Convert H2 to HTML directly instead of using markdown syntax

### Issue: Anchor links hidden behind header
**Cause**: Sticky header at top of viewport
**Solution**: Add `scroll-padding-top` to html element

### Issue: Header layout different on sidebar pages
**Cause**: `body.has-sidebar .container` affecting all containers
**Solution**: Use more specific selector `body.has-sidebar .main-content .container`

### Issue: Profile icon showing square border
**Cause**: Border style applied to circular image
**Solution**: Remove border, keep only shadow

## Page Title Management

Page titles are centrally defined in `src/constants.ts`:

```typescript
export const PAGE_TITLES: Record<string, string> = {
  "index.md": "bidri",
  "profile.md": "Profile - bidri",
};
```

- Titles are defined per markdown file
- If a page title is not defined in `PAGE_TITLES`, the title falls back to the first H1/H2 from the markdown
- The `PageMetadata.title` field is optional and overrides markdown-extracted titles
- Template no longer adds a suffix (e.g., ` - bidri`) - full title must be specified in constants

To add a new page with a custom title:
1. Create the markdown file in `pages/`
2. Add an entry to `PAGE_TITLES` in `src/constants.ts`

## Navigation Link Management

Navigation items are centrally defined in `src/constants.ts`:

```typescript
export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', internal: true },
  { href: '/profile.html', label: 'Profile', internal: true },
  {
    href: 'https://bi9dri.github.io/emoklore-arknights-side-oripathy/',
    label: 'Side Oripathy',
    internal: false,
  },
];
```

- Internal links: Active state, relative paths
- External links: Open in new tab with `rel="noopener noreferrer"`, absolute URLs
- Navigation items are imported and used by `src/template.ts`

## Deployment

The site is designed to be deployed to Cloudflare Pages:

1. Build generates static files in `dist/`
2. `dist/` is gitignored
3. Cloudflare Pages can run `bun run build` and serve `dist/`

## Dependencies

```json
{
  "dependencies": {
    "marked": "17.0.1"
  },
  "devDependencies": {
    "@biomejs/biome": "1.9.4",
    "@types/bun": "1.3.3",
    "@types/marked": "6.0.0"
  }
}
```

- **marked**: Markdown to HTML conversion
- **biome**: Linting and formatting
- **bun**: Runtime and build tool

## Development Workflow

1. Edit markdown files in `pages/`
2. Run `bun run dev` to build and start server
3. Open http://localhost:3000
4. Make changes and rebuild as needed

## LLM Context Notes

When making changes to this project:

1. **Always normalize line endings** when processing markdown content
2. **Use specific CSS selectors** to avoid affecting unintended elements
3. **Process custom containers before marked.js** to avoid parsing conflicts
4. **Convert H2 to HTML directly** for anchor links, don't use `{#id}` syntax
5. **Test responsive layouts** at all breakpoints (1024px, 768px, 480px)
6. **Maintain the blue color theme** using CSS variables
7. **Keep layout classes in main content area**, not on body/header/footer
8. **Remember Windows line endings** (CRLF) can break regex patterns

## Future Considerations

- Support for H3 headings in TOC
- Additional custom container types
- Dark mode support
- Blog post list generation
- RSS feed generation
- Sitemap generation
