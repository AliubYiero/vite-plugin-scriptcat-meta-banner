# Vite Plugin ScriptCat Meta Banner

[English](./README.md) / 中文

## 功能

在Vite构建过程中自动注入 ScriptCat / Tampermonkey 用户脚本元数据块(UserScript Header)。支持自动生成符合规范的`// ==UserScript==`头信息，并可选添加`/* ==UserConfig== */`配置块，使构建产物直接成为可安装的用户脚本。

## 安装

```bash
npm install @yiero/vite-plugin-scriptcat-meta-banner -D
# or
yarn add @yiero/vite-plugin-scriptcat-meta-banner -D
# or
pnpm add @yiero/vite-plugin-scriptcat-meta-banner -D
```

## 配置

插件提供两种使用方式：

### 基础配置(直接传入UserScript)

```ts
import { defineConfig } from 'vite'
import metaBannerPlugin from '@yiero/vite-plugin-scriptcat-meta-banner'

export default defineConfig({
  plugins: [
    // 其他插件...
    
    // 直接传入UserScript配置
    metaBannerPlugin([
      ['name', '我的脚本'],
      ['namespace', 'https://example.com'],
      ['version', '1.0.0'],
      ['description', '一个示例用户脚本'],
      ['author', 'YourName'],
      ['match', '*://*.example.com/*'],
      ['grant', 'GM_setValue'],
      ['grant', 'GM_getValue']
    ])
  ],	
})
```

### 高级配置(完整选项)

| 参数                        | 类型                  | 描述                             | 默认值 |
| --------------------------- | --------------------- | -------------------------------- | ------ |
| `userScript`                | `ScriptCatUserScript` | UserScript元数据配置             | 必填   |
| `userConfig`                | `ScriptCatUserConfig` | UserConfig配置(用于脚本设置界面) | `{}`   |
| `useBackgroundPromiseBlock` | `boolean`             | 后台脚本是否使用Promise包裹      | `true` |

```ts
import { defineConfig } from 'vite'
import metaBannerPlugin from '@yiero/vite-plugin-scriptcat-meta-banner'

export default defineConfig({
  plugins: [
    // 其他插件...
    
    // 完整配置
    metaBannerPlugin({
      userScript: [
        ['name', '我的脚本'],
        ['namespace', 'https://example.com'],
        ['version', '1.0.0'],
        ['background'],
        ['grant', 'GM_setValue']
      ],
      userConfig: {
        general: {
          enableFeature: {
            title: '启用功能',
            description: '是否启用主要功能',
            type: 'checkbox',
            default: true
          },
          apiEndpoint: {
            title: 'API地址',
            description: '设置后端API地址',
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

## 工作原理

插件在Vite构建的`generateBundle`阶段工作，会自动执行以下操作：

1. 解析传入的UserScript配置，过滤空属性并计算最大键长
2. 识别是否为后台脚本(background/crontab)
3. 在每个代码块前插入格式化的元数据头
4. 对后台脚本自动用Promise包裹代码(可选)
5. 暴露解析后的UserScript数据供其他插件使用

**处理前(源代码):**
```js
console.log('Hello from userscript!');
GM_setValue('visited', true);
```

**构建后:**
```js
// ==UserScript==
// @name        我的脚本
// @namespace   https://example.com
// @version     1.0.0
// @grant       GM_setValue
// ==/UserScript==

/* ==UserConfig==
general:
    enableFeature:
        title: 启用功能
        description: 是否启用主要功能
        type: checkbox
        default: true
    apiEndpoint:
        title: API地址
        description: 设置后端API地址
        type: text
        default: https://api.example.com
==/UserConfig== */

console.log('Hello from userscript!');
GM_setValue('visited', true);
```

## 支持的元数据字段

### UserScript标准字段

支持ScriptCat/Tampermonkey所有标准元数据字段，包括但不限于：

- **基础信息**: `name`, `namespace`, `version`, `description`, `author`
- **执行范围**: `match`, `include`, `exclude`, `connect`
- **权限声明**: `grant`, `antifeature`
- **资源加载**: `require`, `require-css`, `resource`
- **脚本特性**: `background`, `crontab`, `early-start`, `noframes`
- **执行时机**: `run-at`, `run-in`, `inject-into`
- **更新信息**: `updateURL`, `downloadURL`, `supportURL`
- **图标信息**: `icon`, `iconURL`, `icon64`, `icon64URL`

### UserConfig配置

支持创建脚本配置界面，可用类型包括：
- `text` - 文本输入
- `checkbox` - 复选框
- `number` - 数字输入
- `select` - 单选下拉
- `mult-select` - 多选下拉
- `textarea` - 多行文本

## API

插件实例暴露以下API供其他插件使用：

```js
const metaBannerPlugin = plugins.find( plugin => plugin.name === 'vite-plugin-scriptcat-meta-banner' );
const { parsedUserScript } = metaBannerPlugin.api;
```

## 贡献指南

欢迎贡献！请通过 [GitHub](https://github.com/AliubYiero/vite-plugin-scriptcat-meta-banner) 提交 issue 或 PR。

## 许可证

GPL-3 © [AliubYiero](https://github.com/AliubYiero)