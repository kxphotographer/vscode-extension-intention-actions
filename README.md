# VSCode Extension: Intention Actions

A Visual Studio Code extension that provides useful code intention actions for TypeScript and TypeScript React files. This extension enhances your development workflow by offering quick fixes and code actions to improve code quality and maintainability.

## Features

- **Flip Binary Expressions**: Quickly flip binary expressions (e.g., `a === b` to `b === a`)
- **Flip Comma-Separated Elements**: Easily reorder comma-separated elements in your code

## Requirements

- Visual Studio Code version 1.73.0 or higher
- TypeScript or TypeScript React files

## Installation

1. Open VS Code
2. Go to the Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Intention Actions"
4. Click Install

## Usage

The extension provides code actions that appear in the Quick Fix menu (Ctrl+. / Cmd+.) when your cursor is positioned on supported code patterns.

### Available Actions

1. **Flip Binary Expressions**
   - Works on binary expressions like comparisons and logical operations
   - Example: `if (a === b)` can be flipped to `if (b === a)`

2. **Flip Comma-Separated Elements**
   - Works on comma-separated lists
   - Example: `const [a, b]` can be flipped to `const [b, a]`

## Development

### Prerequisites

- Node.js
- pnpm (version 10.8.1 or higher)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Available Scripts

- `pnpm build` - Build the extension
- `pnpm lint` - Run linting checks
- `pnpm format` - Format the code

### Project Structure

```
.
├── src/
│   ├── providers/         # Code action providers
│   ├── localeResources/   # Localization resources
│   └── index.ts          # Extension entry point
├── dist/                 # Compiled output
└── package.json         # Project configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

- kxphotographer 