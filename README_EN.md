# Beautiful-MD

[中文](README.md) | English

A professional Markdown preview tool developed with Vue 3 and TypeScript, simulating Grok's Markdown rendering effect.

## Features

- ✅ Precise Markdown rendering
- ✅ Code block toolbar
  - Display code language
  - Expand/Collapse functionality
  - Enable/Disable line wrapping
  - Code copying functionality
- ✅ Syntax highlighting supports multiple programming languages
- ✅ Special formatting for inline code (e.g., CSS property highlighting)
- ✅ Light/Dark theme switching
- ✅ Fully responsive design

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Markdown-it
- Highlight.js
- GitHub Markdown CSS

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
beautiful-md/
├── public/
│   └── test.md     # Test Markdown file
├── src/
│   ├── components/
│   │   ├── CodeBlock.vue         # Code block component
│   │   └── MarkdownRenderer.vue  # Markdown renderer component
│   ├── stores/
│   │   └── markdown.ts           # Pinia state management
│   ├── App.vue                   # Main application component
│   └── main.ts                   # Application entry
└── vite.config.ts                # Vite configuration
```

## Customization

Theme colors and other styles can be customized by modifying CSS variables:

```css
:root {
  --primary-color: #3b82f6;
  --bg-color: #ffffff;
  --text-color: #24292e;
  --border-color: #e5e7eb;
  --header-bg: #1a1a1a;
  --md-code-bg: #1e1e1e;
}

:root.dark {
  --bg-color: #0d1117;
  --text-color: #c9d1d9;
  --border-color: #30363d;
  --header-bg: #161b22;
  --md-code-bg: #161b22;
}
```

## Extensions

Possible future extensions:

- Real-time editing functionality
- Export to PDF or HTML
- More theme options
- Plugin system