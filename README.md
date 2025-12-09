# Vite Plugin ScriptCat Meta Banner

English / [中文](./README-zh.md)

## Features

Automatically injects ScriptCat/Tampermonkey userscript metadata blocks (UserScript Header) during the Vite build process. Supports automatically generating standardized `// ==UserScript==` header information and optionally adding `/* ==UserConfig== */` configuration blocks, making the build output directly installable as a userscript.

## Installation

```bash
npm install @yiero/vite-plugin-scriptcat-meta-banner -D
# or
yarn add @yiero/vite-plugin-scriptcat-meta-banner -D
# or
pnpm add @yiero/vite-plugin-scriptcat-meta-banner -D
```

## Configuration

The plugin offers two usage methods:

### Basic Configuration (direct UserScript)

```ts
import { defineConfig } from 'vite'
import metaBannerPlugin from '@yiero/vite-plugin-scriptcat-meta-banner'

export default defineConfig({
  plugins: [
    // Other plugins...
    
    // Directly pass UserScript configuration
    metaBannerPlugin([
      ['name', 'My Script'],
      ['namespace', 'https://example.com'],
      ['version', '1.0.0'],
      ['description', 'An example userscript'],
      ['author', 'YourName'],
      ['match', '*://*.example.com/*'],
      ['grant', 'GM_setValue'],
      ['grant', 'GM_getValue']
    ])
  ],	
})
```

### Advanced Configuration (complete options)

| Parameter                   | Type                  | Description                                    | Default  |
| --------------------------- | --------------------- | ---------------------------------------------- | -------- |
| `userScript`                | `ScriptCatUserScript` | UserScript metadata configuration              | Required |
| `userConfig`                | `ScriptCatUserConfig` | UserConfig configuration (for script settings) | `{}`     |
| `useBackgroundPromiseBlock` | `boolean`             | Whether to wrap background scripts in Promise  | `true`   |

```ts
import { defineConfig } from 'vite'
import metaBannerPlugin from '@yiero/vite-plugin-scriptcat-meta-banner'

export default defineConfig({
  plugins: [
    // Other plugins...
    
    // Complete configuration
    metaBannerPlugin({
      userScript: [
        ['name', 'My Script'],
        ['namespace', 'https://example.com'],
        ['version', '1.0.0'],
        ['background'],
        ['grant', 'GM_setValue']
      ],
      userConfig: {
        general: {
          enableFeature: {
            title: 'Enable Feature',
            description: 'Whether to enable the main feature',
            type: 'checkbox',
            default: true
          },
          apiEndpoint: {
            title: 'API Endpoint',
            description: 'Set backend API address',
            type: 'text',
            default: 'https://api.example.com'
          }
        }
      },
      useBackgroundPromiseBlock: true
    })
  ],	
})
```

## How It Works

The plugin operates during Vite's `generateBundle` phase and automatically performs the following actions:

1. Parses the provided UserScript configuration, filters empty properties, and calculates the maximum key length
2. Identifies if it's a background script (background/crontab)
3. Inserts the formatted metadata header before each code block
4. Automatically wraps background script code in a Promise (optional)
5. Exposes parsed UserScript data for use by other plugins

**Before processing (source code):**
```js
console.log('Hello from userscript!');
GM_setValue('visited', true);
```

**After build:**
```js
// ==UserScript==
// @name        My Script
// @namespace   https://example.com
// @version     1.0.0
// @grant       GM_setValue
// ==/UserScript==

/* ==UserConfig==
general:
    enableFeature:
        title: Enable Feature
        description: Whether to enable the main feature
        type: checkbox
        default: true
    apiEndpoint:
        title: API Endpoint
        description: Set backend API address
        type: text
        default: https://api.example.com
==/UserConfig== */

console.log('Hello from userscript!');
GM_setValue('visited', true);
```

## Supported Metadata Fields

### UserScript Standard Fields

Supports all standard metadata fields for ScriptCat/Tampermonkey, including but not limited to:

- **Basic Info**: `name`, `namespace`, `version`, `description`, `author`
- **Execution Scope**: `match`, `include`, `exclude`, `connect`
- **Permission Declarations**: `grant`, `antifeature`
- **Resource Loading**: `require`, `require-css`, `resource`
- **Script Features**: `background`, `crontab`, `early-start`, `noframes`
- **Execution Timing**: `run-at`, `run-in`, `inject-into`
- **Update Information**: `updateURL`, `downloadURL`, `supportURL`
- **Icon Information**: `icon`, `iconURL`, `icon64`, `icon64URL`

### UserConfig Configuration

Supports creating script configuration interfaces with the following types:
- `text` - Text input
- `checkbox` - Checkbox
- `number` - Number input
- `select` - Single-select dropdown
- `mult-select` - Multi-select dropdown
- `textarea` - Multi-line text area

## API

The plugin instance exposes the following API for use by other plugins:

```js
const metaBanner = metaBannerPlugin([...]);
// In other plugins
const { parsedUserScript } = metaBanner.api;
```

## Contribution Guidelines

Contributions are welcome! Please submit issues or PRs via [GitHub](https://github.com/AliubYiero/vite-plugin-scriptcat-meta-banner).

## License

GPL-3 © [AliubYiero](https://github.com/AliubYiero)
