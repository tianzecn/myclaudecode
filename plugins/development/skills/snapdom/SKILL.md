---
name: snapdom
description: snapDOM is a fast, accurate DOM-to-image capture tool that converts HTML elements into scalable SVG images. Use for capturing HTML elements, converting DOM to images (SVG, PNG, JPG, WebP), preserving styles, fonts, and pseudo-elements.
---

# SnapDOM Skill

Fast, dependency-free DOM-to-image capture library for converting HTML elements into scalable SVG or raster image formats.

## When to Use This Skill

Use SnapDOM when you need to:

- Convert HTML elements to images (SVG, PNG, JPG, WebP)
- Capture styled DOM with pseudo-elements and shadows
- Export elements with embedded fonts and icons
- Create screenshots with custom dimensions or scaling
- Handle CORS-blocked resources using proxy fallback
- Implement custom rendering pipelines with plugins
- Optimize performance on large or complex elements

## Key Features

### Universal Export Options

- **SVG** - Scalable vector format, embeds all styles
- **PNG, JPG, WebP** - Raster formats with configurable quality
- **Canvas** - Get raw Canvas element for further processing
- **Blob** - Raw binary data for custom handling

### Performance

- Ultra-fast capture (1.6ms for small elements, ~171ms for 4000×2000)
- **No dependencies** - Uses standard Web APIs only
- Outperforms html2canvas by 10-40x on complex elements

### Style Support

- Embedded fonts (including icon fonts)
- CSS pseudo-elements (::before, ::after)
- CSS counters
- CSS line-clamp
- Transform and shadow effects
- Shadow DOM content

### Advanced Capabilities

- Same-origin iframe support
- CORS proxy fallback for blocked assets
- Plugin system for custom transformations
- Straighten transforms (remove rotate/translate)
- Selective element exclusion
- Tight bounding box calculation

## Installation

### NPM/Yarn

```bash
npm install @zumer/snapdom
# or
yarn add @zumer/snapdom
```

### CDN (ES Module)

```html
<script type="module">
  import { snapdom } from "https://unpkg.com/@zumer/snapdom/dist/snapdom.mjs";
</script>
```

### CDN (UMD)

```html
<script src="https://unpkg.com/@zumer/snapdom/dist/snapdom.umd.js"></script>
```

## Quick Start Examples

### Basic Reusable Capture

```javascript
// Create reusable capture object
const result = await snapdom(document.querySelector("#target"));

// Export to different formats
const png = await result.toPng();
const jpg = await result.toJpg();
const svg = await result.toSvg();
const canvas = await result.toCanvas();
const blob = await result.toBlob();

// Use the result
document.body.appendChild(png);
```

### One-Step Export

```javascript
// Direct export without intermediate object
const png = await snapdom.toPng(document.querySelector("#target"));
const svg = await snapdom.toSvg(element);
```

### Download Element

```javascript
// Automatically download as file
await snapdom.download(element, "screenshot.png");
await snapdom.download(element, "image.svg");
```

### With Options

```javascript
const result = await snapdom(element, {
  scale: 2, // 2x resolution
  width: 800, // Custom width
  height: 600, // Custom height
  embedFonts: true, // Include @font-face
  exclude: ".no-capture", // Hide elements
  useProxy: true, // Enable CORS proxy
  straighten: true, // Remove transforms
  noShadows: false, // Keep shadows
});

const png = await result.toPng({ quality: 0.95 });
```

## Essential Options Reference

| Option       | Type            | Purpose                                     |
| ------------ | --------------- | ------------------------------------------- |
| `scale`      | Number          | Scale output (e.g., 2 for 2x resolution)    |
| `width`      | Number          | Custom output width in pixels               |
| `height`     | Number          | Custom output height in pixels              |
| `embedFonts` | Boolean         | Include non-icon @font-face rules           |
| `useProxy`   | String\|Boolean | Enable CORS proxy (URL or true for default) |
| `exclude`    | String          | CSS selector for elements to hide           |
| `straighten` | Boolean         | Remove translate/rotate transforms          |
| `noShadows`  | Boolean         | Strip shadow effects                        |

## Common Patterns

### Responsive Screenshots

```javascript
// Capture at different scales
const mobile = await snapdom.toPng(element, { scale: 1 });
const tablet = await snapdom.toPng(element, { scale: 1.5 });
const desktop = await snapdom.toPng(element, { scale: 2 });
```

### Exclude Elements

```javascript
// Hide specific elements from capture
const png = await snapdom.toPng(element, {
  exclude: ".controls, .watermark, [data-no-capture]",
});
```

### Fixed Dimensions

```javascript
// Capture with specific size
const result = await snapdom(element, {
  width: 1200,
  height: 630, // Standard social media size
});
```

### CORS Handling

```javascript
// Fallback for CORS-blocked resources
const png = await snapdom.toPng(element, {
  useProxy: "https://cors.example.com/?", // Custom proxy
});
```

### Plugin System (Beta)

```javascript
// Extend with custom exporters
snapdom.plugins([pluginFactory, { colorOverlay: true }]);

// Hook into lifecycle
defineExports(context) {
  return {
    pdf: async (ctx, opts) => { /* generate PDF */ }
  };
}

// Lifecycle hooks available:
// beforeSnap → beforeClone → afterClone →
// beforeRender → beforeExport → afterExport
```

## Performance Comparison

SnapDOM significantly outperforms html2canvas:

| Scenario          | SnapDOM | html2canvas | Improvement |
| ----------------- | ------- | ----------- | ----------- |
| Small (200×100)   | 1.6ms   | 68ms        | 42x faster  |
| Medium (800×600)  | 12ms    | 280ms       | 23x faster  |
| Large (4000×2000) | 171ms   | 1,800ms     | 10x faster  |

## Development

### Setup

```bash
git clone https://github.com/zumerlab/snapdom.git
cd snapdom
npm install
```

### Build

```bash
npm run compile
```

### Testing

```bash
npm test
```
