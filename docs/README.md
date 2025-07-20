# Flows Documentation

Official documentation for **Flows** - A stateful, secure, JavaScript-embedded DAG workflow executor designed for frontend applications.

## Overview

This documentation is built with [VitePress](https://vitepress.dev/) and provides comprehensive guides, API references, and examples for using Flows in your projects.

## Structure

```
docs/
├── .vitepress/
│   └── config.ts          # VitePress configuration
├── guide/                 # User guides and tutorials
│   ├── introduction.md    # Introduction to Flows
│   ├── installation.md    # Installation guide
│   ├── quick-start.md     # Quick start tutorial
│   ├── core-concepts.md   # Core concepts deep dive
│   ├── storage.md         # Storage configuration
│   ├── events.md          # Event system guide
│   ├── failure-handling.md # Failure handling strategies
│   └── ...               # Additional guides
├── api/                   # API reference
│   ├── core.md           # Core classes and methods
│   ├── types.md          # Type definitions
│   ├── utilities.md      # Utility functions
│   ├── enums.md          # Enumerations
│   └── configuration.md  # Configuration reference
├── examples/              # Code examples and tutorials
│   ├── index.md          # Examples overview
│   ├── simple-workflow.md # Basic workflow examples
│   ├── subflow-patterns.md # Modular workflow patterns
│   ├── failure-handling.md # Error handling examples
│   └── ...               # Additional examples
├── package.json          # Documentation dependencies
└── README.md             # This file
```

## Development

### Prerequisites

- Node.js 16+ 
- pnpm (recommended) or npm/yarn
- Basic knowledge of Markdown and VitePress

### Setup

1. **Install dependencies:**
   ```bash
   # From the project root
   pnpm docs:install
   
   # Or directly in docs directory
   cd docs && pnpm install
   ```

2. **Start development server:**
   ```bash
   # From the project root
   pnpm docs:dev
   
   # Or directly in docs directory
   cd docs && pnpm dev
   ```

3. **Open browser:**
   Navigate to `http://localhost:5173` to view the documentation.

### Building for Production

```bash
# From the project root
pnpm docs:build

# Or directly in docs directory
cd docs && pnpm build
```

The built documentation will be in `docs/.vitepress/dist/`.

### Preview Production Build

```bash
# From the project root  
pnpm docs:preview

# Or directly in docs directory
cd docs && pnpm preview
```

## Writing Documentation

### Guidelines

1. **Use clear, concise language**
2. **Provide practical examples** for all concepts
3. **Follow the established structure** and formatting conventions
4. **Include code examples** that can be copy-pasted and run
5. **Cross-reference related sections** using internal links

### Markdown Features

VitePress supports extended Markdown features:

#### Code Groups

```markdown
::: code-group

```bash [pnpm]
pnpm add flows
```

```bash [npm]
npm install flows
```

```bash [yarn]
yarn add flows
```

:::
```

#### Custom Containers

```markdown
::: tip
This is a helpful tip for users.
:::

::: warning
This is important information to be aware of.
:::

::: danger
This is critical information about potential issues.
:::
```

#### TypeScript Code Blocks

```markdown
```typescript
import { createFlows, createWorkflow, StorageType } from 'flows';

const flows = createFlows({
  storage: { type: StorageType.MEMORY }
});
```
```

### File Naming Conventions

- Use kebab-case for file names: `failure-handling.md`
- Use descriptive names that match the content
- Group related files in appropriate directories

### Content Structure

Each documentation page should follow this structure:

```markdown
# Page Title

Brief introduction explaining what this page covers.

## Section 1

Content with examples...

### Subsection

More detailed content...

## Section 2

More content...

## Next Steps

Links to related documentation.
```

## Contributing to Documentation

### Adding New Content

1. **Create the markdown file** in the appropriate directory
2. **Add the page to the sidebar** in `.vitepress/config.ts`
3. **Write clear, comprehensive content** following the guidelines
4. **Test locally** with `pnpm docs:dev`
5. **Submit a pull request** with your changes

### Updating Existing Content

1. **Make your changes** to the relevant markdown files
2. **Test the changes** locally
3. **Check for broken links** and formatting issues
4. **Submit a pull request** with a clear description

### Navigation Updates

To add new pages to the navigation, edit `.vitepress/config.ts`:

```typescript
sidebar: {
  '/guide/': [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/guide/introduction' },
        { text: 'Installation', link: '/guide/installation' },
        { text: 'Your New Page', link: '/guide/your-new-page' }, // Add here
      ]
    },
  ],
}
```

## Deployment

### GitHub Pages

This documentation is designed to be deployed to GitHub Pages:

1. **Build the documentation:**
   ```bash
   pnpm docs:build
   ```

2. **Deploy to GitHub Pages:**
   The built files in `docs/.vitepress/dist/` can be deployed to any static hosting service.

3. **Automated deployment:**
   Consider setting up GitHub Actions for automatic deployment on push to main.

### Other Platforms

The built documentation is static HTML/CSS/JS and can be deployed to:
- Netlify
- Vercel  
- AWS S3 + CloudFront
- Any static hosting service

## Writing Examples

When creating example documentation:

1. **Create executable examples** in `src/examples/` directory
2. **Document the examples** in `docs/examples/`
3. **Cross-reference** between documentation and code
4. **Test examples** to ensure they work as documented

### Example Template

```typescript
/**
 * Example: [Name]
 * 
 * Description: What this example demonstrates
 * 
 * Key Features:
 * - Feature 1
 * - Feature 2
 */

// ... example code ...

export async function runExample() {
  // ... implementation ...
}

// Main execution block for direct running
if (require.main === module) {
  runExample().catch(console.error);
}
```

## Best Practices

### Content

- **Start with the user's goal** - what are they trying to achieve?
- **Provide working code examples** that can be copy-pasted
- **Explain the "why" not just the "how"**
- **Use consistent terminology** throughout all documentation
- **Include error handling** in examples
- **Link to related concepts** and sections

### Code Examples

- **Use realistic examples** rather than "foo", "bar" placeholders
- **Show complete, working code** when possible
- **Include imports and setup** in examples
- **Use TypeScript** for better developer experience
- **Test your examples** to ensure they work

### Structure

- **Use descriptive headings** that clearly indicate content
- **Keep sections focused** on single topics
- **Provide clear navigation** between related topics
- **Include "Next Steps" sections** to guide users
- **Use consistent formatting** across all pages

## Troubleshooting

### Common Issues

**Build fails:**
- Check for syntax errors in markdown files
- Ensure all internal links are valid
- Verify VitePress configuration is correct

**Links don't work:**
- Use relative paths for internal links
- Check file names and paths are correct
- Ensure `.md` extension is included for markdown files

**Development server issues:**
- Clear node_modules and reinstall dependencies
- Check for conflicting processes on port 5173
- Verify VitePress version compatibility

### Getting Help

- Check the [VitePress documentation](https://vitepress.dev/)
- Review existing documentation for patterns
- Ask questions in project discussions or issues

## Maintenance

### Regular Tasks

- **Update examples** when API changes
- **Check for broken links** periodically
- **Review and update** outdated information
- **Ensure examples** still work with current version
- **Update dependencies** in package.json

### Version Updates

When releasing new versions of Flows:

1. **Update version references** in documentation
2. **Add new features** to relevant guides
3. **Update API documentation** for any changes
4. **Add migration guides** for breaking changes
5. **Update examples** to use new features

---

## Quick Reference

### Useful Commands

```bash
# Development
pnpm docs:dev              # Start dev server
pnpm docs:build            # Build for production
pnpm docs:preview          # Preview production build

# From project root
pnpm docs:install          # Install docs dependencies
```

### Important Files

- **`.vitepress/config.ts`** - Main configuration
- **`index.md`** - Homepage content
- **`package.json`** - Dependencies and scripts

### Helpful Links

- [VitePress Guide](https://vitepress.dev/guide/what-is-vitepress)
- [Markdown Extensions](https://vitepress.dev/guide/markdown)
- [Theming](https://vitepress.dev/guide/custom-theme)

---

**Happy documenting!** 📚✨ 