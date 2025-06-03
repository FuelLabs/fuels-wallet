# Fuel Wallet Documentation

Official documentation site for [Fuel Wallet](https://wallet.fuel.network/), built with Next.js and MDX.

## Overview

This package contains the documentation website for Fuel Wallet, including:

- **User Guide**: Installation instructions, wallet features, and how-to guides
- **Developer SDK**: Integration guides, API references, and examples for building DApps
- **Contributing**: Guidelines for contributing to the Fuel Wallet project

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Content**: MDX for documentation pages
- **Styling**: @fuel-ui/css component library
- **Search**: Algolia DocSearch integration
- **Deployment**: Static site generation with export

## Development

### Prerequisites

- Node.js 18+
- pnpm (workspace package manager)

### Getting Started

```bash
# Install dependencies (from project root)
pnpm install

# Start development server
pnpm dev

# Or run from project root
pnpm --filter docs dev
```

The documentation site will be available at `http://localhost:3030`.

### Scripts

- `dev` - Start development server on port 3030
- `build:preview` - Build static site for production
- `start` - Serve built static files
- `lint` - Run ESLint
- `ts:check` - Type check TypeScript files

## Project Structure

```
packages/docs/
├── docs/                   # MDX documentation files
│   ├── install.mdx        # Installation guide
│   ├── how-to-use.mdx     # User guide
│   ├── browser-support.mdx # Browser compatibility
│   ├── dev/               # Developer documentation
│   └── contributing/      # Contributing guides
├── src/
│   ├── components/        # React components
│   ├── pages/             # Next.js pages
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── styles/            # CSS styles
├── public/                # Static assets
└── examples/              # Code examples
```

## Documentation Content

### User Documentation

- **Installation**: Browser extension installation for Chrome, Firefox, and other browsers
- **How to Use**: Comprehensive guides for wallet features (accounts, networks, assets, transactions)
- **Browser Support**: Compatibility information and troubleshooting

### Developer Documentation

- **Getting Started**: Quick start guide for DApp integration
- **SDK Reference**: Complete API documentation for @fuels/react
- **Connectors**: Available wallet connectors and configuration
- **Integration Guides**: Step-by-step tutorials for common tasks:
  - Connecting to wallet
  - Managing accounts
  - Sending transactions
  - Working with assets
  - Handling networks

### Contributing

- **Development Setup**: Local development environment setup
- **Contribution Guidelines**: Code standards and review process
- **Running Locally**: Instructions for building and testing

## Configuration

### Environment Variables

- `DOCS_BASE_URL` - Base path for deployment (optional)
- `NEXT_PUBLIC_APP_VERSION` - Injected from app package.json

### Search

DocSearch configuration is defined in `docsearch.json` for Algolia integration.

### Spell Check

Custom dictionary words are maintained in `spell-check-custom-words.txt` with configuration in `.spellcheck.yml`.

## Deployment

The documentation is deployed as a static site:

```bash
pnpm build:preview
pnpm start
```

Generated files are output to the `out/` directory for hosting on static file servers.

## Dependencies

### Core
- Next.js 14 - React framework
- @mdx-js/react - MDX support
- @fuel-ui/react - Fuel design system

### Documentation
- next-mdx-remote - Remote MDX processing
- remark/rehype - Markdown processing
- @docsearch/react - Algolia search

### Development
- TypeScript - Type safety
- ESLint - Code linting
- Prettier - Code formatting

## Contributing

See the [Contributing Guide](https://wallet.fuel.network/docs/contributing/guide/) for development setup and guidelines.

## License

Apache-2.0 License - see the [LICENSE](../../LICENSE) file for details.
